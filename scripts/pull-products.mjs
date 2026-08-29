import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  fetchProductPage,
  isBotBlocked,
  isProductPage,
  parseProductPrices,
} from './lib/amazon-price.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET_TAG = 'unismart00-21';
const DELAY_MS = 900;

const asinsPath = path.join(root, 'data', 'amazon-asins.json');
const livePricesPath = path.join(root, 'data', 'live-prices.json');
const pulledPath = path.join(root, 'scripts', 'data', 'pulled-products.json');

const asins = JSON.parse(readFileSync(asinsPath, 'utf8'));
let livePrices = {};
if (existsSync(livePricesPath)) {
  livePrices = JSON.parse(readFileSync(livePricesPath, 'utf8'));
}
let pulledList = [];
if (existsSync(pulledPath)) {
  pulledList = JSON.parse(readFileSync(pulledPath, 'utf8'));
}

function strip(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function extractAsinFromText(text) {
  const match = text.match(
    /(?:\/dp\/|\/gp\/product\/|\/product\/)([A-Z0-9]{10})/i,
  );
  return match ? match[1].toUpperCase() : null;
}

function extractTitle(html) {
  const match = html.match(/<span[^>]+id="productTitle"[^>]*>\s*([\s\S]*?)\s*<\/span>/i);
  return match ? strip(match[1]) : '';
}

function extractImage(html) {
  const landing = html.match(/<img[^>]+id="landingImage"[^>]*>/i)?.[0] ?? '';
  const hires = landing.match(/data-old-hires="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i);
  const srcMatch = landing.match(/src="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i);
  if (hires || srcMatch) return hires?.[1] ?? srcMatch?.[1] ?? '';
  const wrapper = html.match(
    /<div[^>]+id="imgTagWrapperId"[^>]*>\s*<img[^>]+src="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i,
  );
  if (wrapper) return wrapper[1];
  const ogImage = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i);
  return ogImage ? ogImage[1] : '';
}

function extractRating(html) {
  const match = html.match(/<span class="a-icon-alt">([\d.]+)\s*out of 5/i);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  return Number.isFinite(value) ? value : 0;
}

function extractRatingCount(html) {
  const match = html.match(/id="acrCustomerReviewText"[^>]*>\s*([^<]+)<\/i?/i);
  if (!match) return 0;
  const digits = match[1].replace(/[^0-9]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

function extractBrand(html) {
  const brandRow = extractOverviewRows(html).find((row) => /^brand$/i.test(row.label));
  if (brandRow) return brandRow.value;
  const byline = html.match(/id="bylineInfo"[\s\S]*?<\/div>/i)?.[0] ?? '';
  const store = byline.match(/Visit the\s+([^<]+?)\s+Store/i);
  if (store) return strip(store[1]);
  const anchor = byline.match(/<a[^>]*>([^<]+)<\/a>/i);
  if (anchor) return strip(anchor[1]);
  return '';
}

function extractOverviewRows(html) {
  const start = html.indexOf('id="productOverview_feature_div"');
  const windowHtml =
    start >= 0 ? html.slice(start, start + 24_000) : '';
  const rows = [];
  const rowRe = /<tr[^>]*>\s*(?:<th[^>]*>|<td[^>]*>)\s*([\s\S]*?)\s*<\/(?:th|td)>\s*<td[^>]*>\s*([\s\S]*?)\s*<\/td>\s*<\/tr>/gi;
  let match;
  while ((match = rowRe.exec(windowHtml)) !== null) {
    const label = strip(match[1]);
    const value = strip(match[2]);
    if (label && value && !/see more/i.test(label)) {
      rows.push({ label, value });
    }
  }
  return rows;
}

function extractSpecs(html) {
  const rows = extractOverviewRows(html).filter(
    (row) => !/^brand$/i.test(row.label),
  );

  if (rows.length > 0) return rows;

  const bulletsStart = html.indexOf('id="detailBullets_feature_div"');
  const bulletsWindow =
    bulletsStart >= 0 ? html.slice(bulletsStart, bulletsStart + 24_000) : '';
  const bulletRe = /class="a-list-item"><span class="a-text-bold">([\s\S]*?)<\/span>\s*([\s\S]*?)<\/span>/gi;
  let match;
  while ((match = bulletRe.exec(bulletsWindow)) !== null) {
    const label = strip(match[1]).replace(/[::\s]+$/, '');
    const value = strip(match[2]);
    if (label && value) rows.push({ label, value });
  }
  return rows;
}

function extractAbout(html) {
  const start = html.indexOf('id="feature-bullets"');
  const windowHtml =
    start >= 0 ? html.slice(start, start + 24_000) : html;
  const bullets = [];
  const bulletRe = /<span class="a-list-item">([\s\S]*?)<\/span>/gi;
  let match;
  while ((match = bulletRe.exec(windowHtml)) !== null) {
    const text = strip(match[1]);
    if (text.length > 6 && !text.startsWith('✦') && !/read more/i.test(text)) {
      bullets.push(text);
    }
  }
  return [...new Set(bullets)].slice(0, 6);
}

async function pullOne(input, asinHint) {
  const isFile = existsSync(input);
  const source = isFile ? 'file' : 'url';
  let html = '';
  let asin = asinHint;
  let status = 200;

  if (isFile) {
    try {
      html = readFileSync(input, 'utf8');
    } catch {
      console.log(`  SKIP  (cannot read) ${input}`);
      return null;
    }
  } else {
    asin = asin ?? extractAsinFromText(input);
    if (!asin) {
      console.log(`  SKIP  (no ASIN in URL) ${input}`);
      return null;
    }
    try {
      const res = await fetchProductPage(asin);
      status = res.status;
      html = res.html;
    } catch {
      console.log(`  ERROR ${asin} — fetch failed`);
      return null;
    }
  }

  if (status !== 200) {
    console.log(`  ERROR ${asin} — HTTP ${status}`);
    return null;
  }
  if (isBotBlocked(html) || !isProductPage(html)) {
    console.log(`  SKIP  ${asin} — blocked by Amazon or not a product page`);
    return null;
  }

  asin = asin ?? extractAsinFromText(html) ?? '';
  const title = extractTitle(html);
  if (!title) {
    console.log(`  ERROR ${asin} — no title found`);
    return null;
  }

  const { priceInr, previousPriceInr } = parseProductPrices(html);
  const image = extractImage(html);
  const rating = extractRating(html);
  const ratingCount = extractRatingCount(html);
  const specs = extractSpecs(html);
  const brand = extractBrand(html);
  const about = extractAbout(html);

  const existingSlug = Object.keys(asins).find((slug) => asins[slug] === asin);
  let slug = existingSlug ?? slugify(title);
  if (!existingSlug) {
    let suffix = 2;
    const base = slug;
    while (Object.hasOwn(asins, slug)) {
      slug = `${base}-${suffix}`;
      suffix += 1;
    }
  }

  const record = {
    asin,
    slug,
    pulledAt: new Date().toISOString(),
    source,
    name: title,
    brand,
    category: null,
    priceInr: Number.isFinite(priceInr) ? priceInr : null,
    previousPriceInr: Number.isFinite(previousPriceInr) ? previousPriceInr : null,
    rating,
    ratingCount,
    uniSmartScore: null,
    image,
    specs,
    about,
    url: `https://www.amazon.in/dp/${asin}?tag=${TARGET_TAG}`,
    existsOnSite: Boolean(existingSlug),
    needsEditorial: true,
  };

  return record;
}

function slugify(name) {
  const words = name
    .toLowerCase()
    .replace(/[()]/g, ' ')
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  const core = words.slice(0, 9).join('-');
  return core.slice(0, 90).replace(/-+$/, '') || 'product';
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const filteredArgs = args.filter((arg) => arg !== '--dry-run');
  let inputs = [];
  const hints = new Map();

  if (filteredArgs.length === 0) {
    const linksPath = path.join(root, 'pending-links.txt');
    if (!existsSync(linksPath)) {
      console.log('No URLs given. Usage: npm run pull:products -- <amazon-url ...>\n');
      console.log('Or drop Amazon links in pending-links.txt at the repo root (one per line).');
      return;
    }
    inputs = readFileSync(linksPath, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));
  } else {
    for (const arg of filteredArgs) {
      const hintMatch = arg.match(/^(.*):([A-Z0-9]{10})$/);
      if (hintMatch && existsSync(hintMatch[1])) {
        inputs.push(hintMatch[1]);
        hints.set(hintMatch[1], hintMatch[2]);
      } else if (existsSync(arg)) {
        inputs.push(arg);
      } else {
        inputs.push(arg);
      }
    }
  }

  console.log(`Pulling ${inputs.length} product(s)...\n`);

  const fresh = [];
  for (let index = 0; index < inputs.length; index += 1) {
    const record = await pullOne(inputs[index], hints.get(inputs[index]));
    if (record) {
      fresh.push(record);
      console.log(
        `  OK   ${record.slug}  ₹${record.priceInr ?? '?'}  (${record.name.slice(0, 60)})`,
      );
    }
    if (record && index < inputs.length - 1 && !existsSync(inputs[index])) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }
  }

  if (fresh.length === 0) {
    console.log('\nNothing to add.');
    return;
  }

  if (dryRun) {
    console.log('\nDRY RUN — no files were changed. Pulled records:');
    for (const record of fresh) {
      console.log(JSON.stringify(record, null, 2));
    }
    return;
  }

  const newAsins = {};
  for (const record of fresh) {
    if (!record.existsOnSite && record.asin) {
      newAsins[record.slug] = record.asin;
    }
  }
  if (Object.keys(newAsins).length > 0) {
    Object.assign(asins, newAsins);
    writeFileSync(asinsPath, `${JSON.stringify(asins, null, 2)}\n`, 'utf8');
  }

  for (const record of fresh) {
    if (!record.existsOnSite && Number.isFinite(record.priceInr)) {
      livePrices[record.slug] = {
        priceInr: record.priceInr,
        previousPriceInr:
          Number.isFinite(record.previousPriceInr)
            ? record.previousPriceInr
            : record.priceInr,
        updatedAt: record.pulledAt,
      };
    }
  }
  writeFileSync(livePricesPath, `${JSON.stringify(livePrices, null, 2)}\n`, 'utf8');

  pulledList.push(...fresh.filter((record) => !record.existsOnSite));
  mkdirSync(path.dirname(pulledPath), { recursive: true });
  writeFileSync(pulledPath, `${JSON.stringify(pulledList, null, 2)}\n`, 'utf8');

  const newlyAdded = fresh.filter((record) => !record.existsOnSite);
  const pulled = fresh.filter((record) => record.existsOnSite);

  console.log('\nSummary');
  console.log(`  New products registered: ${newlyAdded.length}`);
  console.log(`  Existing (data pulled only): ${pulled.length}`);
  console.log(`   - ASINs saved to ${path.relative(root, asinsPath)}`);
  console.log(`   - Skeletons saved to ${path.relative(root, pulledPath)}`);
  console.log('\nNext step: give me these slugs and I will finish the editorial ');
  console.log('(category, UniSmart Score, description, pros/cons, reviews) and publish them.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

export { pullOne, slugify, extractAsinFromText, strip };