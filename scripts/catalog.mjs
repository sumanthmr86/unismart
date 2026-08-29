import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pullOne, strip } from './pull-products.mjs';
import { derivedAudioSpecs } from './lib/title-specs.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET_TAG = 'unismart00-21';
const SEARCH_DELAY_MS = 1200;
const PRODUCT_DELAY_MS = 900;
const MAX_NEW_TOTAL = Number.parseInt(process.env.CATALOG_MAX ?? '200', 10);

const queriesPath = path.join(root, 'scripts', 'data', 'catalog-queries.json');
const templatesPath = path.join(root, 'scripts', 'data', 'catalog-templates.json');
const asinsPath = path.join(root, 'data', 'amazon-asins.json');
const livePricesPath = path.join(root, 'data', 'live-prices.json');
const autoProductsPath = path.join(root, 'data', 'auto-products.json');

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-IN,en;q=0.9,hi;q=0.8',
  'Cache-Control': 'no-cache',
  'Upgrade-Insecure-Requests': '1',
};

const BOT_MARKERS = [
  'Robot Check',
  'Enter the characters you see below',
  'api-services-support@amazon.com',
  'To discuss automated access to Amazon data',
  'Sorry, we just need to make sure',
];

const queries = JSON.parse(readFileSync(queriesPath, 'utf8'));
const templates = JSON.parse(readFileSync(templatesPath, 'utf8'));

let asins = {};
if (existsSync(asinsPath)) asins = JSON.parse(readFileSync(asinsPath, 'utf8'));
let livePrices = {};
if (existsSync(livePricesPath)) livePrices = JSON.parse(readFileSync(livePricesPath, 'utf8'));
let autoProducts = [];
if (existsSync(autoProductsPath)) autoProducts = JSON.parse(readFileSync(autoProductsPath, 'utf8'));

const productsTsPath = path.join(root, 'data', 'products.ts');
const curatedNames = existsSync(productsTsPath)
  ? [...readFileSync(productsTsPath, 'utf8').matchAll(/^\s*name:\s*'([^']+)'/gm)].map(
      (match) => match[1],
    )
  : [];

const normalizeTitle = (title) =>
  title.toLowerCase().replace(/\s+/g, ' ').trim();

const allAsins = new Set(Object.values(asins));
const seenNew = new Map();
const slugSet = new Set([...Object.keys(asins), ...autoProducts.map((p) => p.slug)]);
const titleSet = new Set([
  ...autoProducts.map((p) => normalizeTitle(p.name)),
  ...curatedNames.map(normalizeTitle),
]);

function isBotBlocked(html) {
  return BOT_MARKERS.some((marker) => html.includes(marker));
}

async function fetchSearchPage(query) {
  const res = await fetch(`https://www.amazon.in/s?k=${encodeURIComponent(query)}`, {
    headers: HEADERS,
    redirect: 'follow',
    signal: AbortSignal.timeout(30_000),
  });
  const html = await res.text();
  return { status: res.status, html };
}

function extractAsins(html, limit) {
  const found = new Set();
  for (const match of html.matchAll(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/gi)) {
    found.add(match[1].toUpperCase());
  }
  return [...found].slice(0, limit);
}

function capitalizeBrand(brand) {
  const clean = brand.replace(/[^A-Za-z0-9.!&+ -]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!clean) return 'See product';
  return clean
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .slice(0, 24);
}

function friendlyCategory(category) {
  const labels = {
    audio: 'audio gear',
    'power-charging': 'charger',
    'study-setup': 'desk essential',
    'hostel-essentials': 'hostel essential',
    backpacks: 'backpack',
    accessories: 'accessory',
    monitors: 'monitor',
    tablets: 'tablet',
    laptops: 'laptop',
    stationery: 'stationery item',
  };
  return labels[category] ?? category.replace(/-/g, ' ');
}

const CATEGORY_COPY = {
  audio:
    "Built for the daily commute — music, calls and video lectures on the go.",
  'power-charging':
    'Keeps your phone, tablet and cables charged through lectures and hostel power cuts.',
  'study-setup': 'A practical pick for dorm life — long hours at your desk without the clutter.',
  'hostel-essentials': 'Makes hostel and PG life easier, from day one to finals week.',
  backpacks: 'Room for a laptop, books and the climb between floors.',
  accessories: 'A small upgrade that keeps your setup working smoothly through the semester.',
  monitors: 'A bigger canvas for assignments, code and late-night series.',
  tablets: 'For notes, lectures and reading — light enough for every bag.',
  laptops: 'Ready for notes, projects, coding and the odd game night.',
  stationery: 'Stocked up and ready for the semester — notes, lists and exams.',
};

function ratingLine(rating, ratingCount) {
  const parts = [];
  if (rating > 0) parts.push(`rated ${rating}/5`);
  if (ratingCount > 0) parts.push(`${ratingCount.toLocaleString('en-IN')} Amazon reviews`);
  return parts.length > 0 ? ` Backed by ${parts.join(' and ')}.` : '';
}

function modelShort(name, brand) {
  let model = name;
  if (brand && name.toLowerCase().startsWith(brand.toLowerCase())) {
    model = name.slice(brand.length);
  }
  model = model.replace(/^(?:,|:|\s|-)+/, '').trim();
  return model.slice(0, 48) || '';
}

function polishBullet(raw) {
  let bullet = raw
    .replace(/^[\s*•▪·:;—–\-›]+/, '')
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/^\[[^\]]*\]\s*/, '')
    .replace(/^[A-Z][A-Z &/.%'\-(),]{2,48}\s*[:—-]\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
  bullet = bullet.charAt(0).toUpperCase() + bullet.slice(1);
  return strip(bullet).trim();
}

function buildShortRecommendation(pros, category, brand, name) {
  const clean = pros.find(
    (pro) =>
      pro.length < 96 && !pro.includes(':') && /^[A-Za-z0-9]/.test(pro),
  );
  if (clean) return clean;
  const model = modelShort(name, brand);
  const base = `Top-rated ${friendlyCategory(category)} on Amazon India`;
  return model ? `${base} — ${model}` : base;
}

function cleanBullets(about) {
  const out = [];
  for (const bullet of about) {
    const parts = bullet
      .split('|')
      .map((part) => strip(part))
      .filter((part) => part.length > 12);
    for (const part of parts) out.push(part);
  }
  return [...new Set(out)];
}

function buildPros(about) {
  return cleanBullets(about)
    .map(polishBullet)
    .filter((item) => item.length > 12)
    .slice(0, 4);
}

function buildDescription(record, pros, shortRec) {
  const bullets = pros.slice(0, 3).join('. ');
  const template =
    CATEGORY_COPY[record.category] ??
    'Popular on Amazon India with a live price that updates automatically.';
  const rating = ratingLine(record.rating, record.ratingCount);
  let body = `${record.name}. ${shortRec}. ${template}${rating}`;
  if (bullets) body = `${body} ${bullets}.`;
  return body.replace(/[.|;:,\s]+$/, '');
}

function computeScore(record, discountPct) {
  if (record.rating <= 0) return 6.0;
  let score =
    record.rating * 1.5 +
    (discountPct >= 20 ? 1 : 0) +
    (record.ratingCount > 500 ? 0.8 : record.ratingCount > 50 ? 0.4 : 0) +
    (record.specs.length > 0 ? 0.5 : 0) +
    (record.image ? 0.2 : 0);
  return Math.max(3, Math.min(9.8, Math.round(score * 10) / 10));
}

function buildProduct(record, queryConfig, slug) {
  const price = Number.isFinite(record.priceInr) ? record.priceInr : 0;
  let mrp = Number.isFinite(record.previousPriceInr) ? record.previousPriceInr : 0;
  if (mrp < price) mrp = 0;
  const discountPct =
    price > 0 && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const template = templates[queryConfig.category] ?? {
    bestFor: ['Everyday use'],
    notIdealFor: ['Very specific niche needs'],
  };
  const pros = buildPros(record.about);
  if (pros.length === 0) {
    for (const s of record.specs.slice(0, 2)) {
      pros.push(`${s.label}: ${s.value}`);
    }
  }
  const cons =
    record.rating > 0 && record.rating < 4
      ? [`Customer reviews sit at ${record.rating} out of 5`]
      : [];
  const name = record.name.slice(0, 160);
  const brand = record.brand ? record.brand.slice(0, 24) : capitalizeBrand(name);
  const specs =
    queryConfig.category === 'audio'
      ? [...derivedAudioSpecs(record.specs, name), ...record.specs].slice(0, 12)
      : record.specs.slice(0, 12);
  const shortRecommendation = buildShortRecommendation(
    pros,
    queryConfig.category,
    brand,
    name,
  );

  return {
    id: slug,
    slug,
    name,
    brand,
    category: queryConfig.category,
    priceInr: price,
    previousPriceInr: mrp > 0 ? mrp : price,
    rating: record.rating,
    ratingCount: record.ratingCount,
    uniSmartScore: computeScore(record, discountPct),
    shortRecommendation,
    description: buildDescription(record, pros, shortRecommendation),
    specs,
    pros,
    cons,
    bestFor: template.bestFor,
    notIdealFor: template.notIdealFor,
    deals: [
      {
        retailer: 'amazon',
        url: `https://www.amazon.in/dp/${record.asin}?tag=${TARGET_TAG}`,
        priceInr: price > 0 ? price : undefined,
        note: 'Auto-listed on Amazon India with live pricing',
      },
      {
        retailer: 'flipkart',
        url: `https://www.flipkart.com/search?q=${encodeURIComponent(name.replace(/\s+/g, ' ').slice(0, 40))}`,
        note: 'Compare price on Flipkart',
      },
    ],
    reviews: [],
    image: record.image || '',
    priceUpdatedOn: record.pulledAt,
    featured: false,
    deal: discountPct >= 25,
  };
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const dedupe = process.argv.includes('--dedupe');
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  if (dedupe) {
    const before = autoProducts.length;
    const keptByTitle = new Map();
    for (const product of autoProducts) {
      const key = normalizeTitle(product.name);
      const existing = keptByTitle.get(key);
      if (!existing) {
        keptByTitle.set(key, product);
        continue;
      }
      if (product.ratingCount > existing.ratingCount) {
        keptByTitle.set(key, product);
      }
    }
    const kept = [...keptByTitle.values()];
    const dropped = autoProducts.filter((p) => !kept.includes(p));
    autoProducts = kept;

    for (const drop of dropped) {
      delete asins[drop.slug];
      delete livePrices[drop.slug];
    }

    console.log(`Dedupe: ${before} -> ${autoProducts.length} products (${dropped.length} variants removed).`);
    if (dryRun) {
      console.log('Dry run — nothing was written.');
      return;
    }
    writeFileSync(autoProductsPath, `${JSON.stringify(autoProducts, null, 2)}\n`, 'utf8');
    writeFileSync(asinsPath, `${JSON.stringify(asins, null, 2)}\n`, 'utf8');
    writeFileSync(livePricesPath, `${JSON.stringify(livePrices, null, 2)}\n`, 'utf8');
    console.log('Saved deduped auto-products.json, amazon-asins.json and live-prices.json.');
    return;
  }

  const startedWith = autoProducts.length;

  console.log(`Catalog importer — ${queries.length} search terms, max ${MAX_NEW_TOTAL} new${dryRun ? ' (DRY RUN)' : ''}\n`);

  let newCount = 0;
  let skipped = 0;

  for (let qIndex = 0; qIndex < queries.length; qIndex += 1) {
    const config = queries[qIndex];
    if (newCount >= MAX_NEW_TOTAL) {
      console.log('  Max new products reached — stopping.');
      break;
    }

    let search;
    try {
      search = await fetchSearchPage(config.query);
    } catch {
      console.log(`  SKIP  search "${config.query}" — fetch failed`);
      await sleep(SEARCH_DELAY_MS);
      continue;
    }

    if (search.status !== 200) {
      console.log(`  SKIP  search "${config.query}" — HTTP ${search.status}`);
      await sleep(SEARCH_DELAY_MS);
      continue;
    }
    if (isBotBlocked(search.html)) {
      console.log(`  SKIP  search "${config.query}" — blocked by Amazon`);
      await sleep(SEARCH_DELAY_MS);
      continue;
    }

    const asinCandidates = extractAsins(search.html, config.limit).filter(
      (asin) => !allAsins.has(asin) && !seenNew.has(asin),
    );

    if (asinCandidates.length === 0) {
      console.log(`  DONE  "${config.query}" — no new products`);
      await sleep(SEARCH_DELAY_MS);
      continue;
    }

    console.log(`  "${config.query}" — ${asinCandidates.length} new candidate(s)`);
    for (let pIndex = 0; pIndex < asinCandidates.length; pIndex += 1) {
      const asin = asinCandidates[pIndex];
      if (newCount >= MAX_NEW_TOTAL) break;
      const record = await pullOne(`https://www.amazon.in/dp/${asin}?tag=${TARGET_TAG}`, asin);
      if (!record || record.existsOnSite || !record.priceInr) {
        skipped += 1;
        if (record) seenNew.set(asin, record.slug);
        await sleep(PRODUCT_DELAY_MS);
        continue;
      }

      let slug = record.slug;
      const titleKey = normalizeTitle(record.name);
      if (titleSet.has(titleKey)) {
        skipped += 1;
        seenNew.set(asin, slug);
        await sleep(PRODUCT_DELAY_MS);
        continue;
      }
      titleSet.add(titleKey);
      if (slugSet.has(slug)) {
        const base = slug;
        let suffix = 2;
        while (slugSet.has(`${base}-${suffix}`)) suffix += 1;
        slug = `${base}-${suffix}`;
      }
      slugSet.add(slug);

      const product = buildProduct(record, config, slug);
      seenNew.set(asin, slug);
      autoProducts.push(product);
      allAsins.add(asin);
      newCount += 1;
      console.log(
        `    + ${slug}  ₹${product.priceInr}  (${product.brand})`,
      );
      await sleep(PRODUCT_DELAY_MS);
    }
    await sleep(SEARCH_DELAY_MS);
  }

  console.log(`\nImported ${newCount} new product(s), ${skipped} skipped/failed. Total auto catalog: ${autoProducts.length}.`);

  if (dryRun || newCount === 0) {
    console.log(dryRun ? 'Dry run — nothing was written.' : 'No changes to save.');
    if (newCount > 0 && dryRun) {
      console.log('\nSample entry:');
      console.log(JSON.stringify(autoProducts[autoProducts.length - newCount], null, 2));
    }
    return;
  }

  const newAsins = {};
  for (const product of autoProducts.slice(startedWith)) {
    const asin = Object.keys(seenNew).find(
      (key) => seenNew.get(key) === product.slug,
    );
    if (asin) newAsins[product.slug] = asin;
  }
  if (Object.keys(newAsins).length > 0) {
    Object.assign(asins, newAsins);
    writeFileSync(asinsPath, `${JSON.stringify(asins, null, 2)}\n`, 'utf8');
  }

  for (const product of autoProducts.slice(startedWith)) {
    livePrices[product.slug] = {
      priceInr: product.priceInr,
      previousPriceInr: product.previousPriceInr,
      updatedAt: product.priceUpdatedOn,
    };
  }
  writeFileSync(livePricesPath, `${JSON.stringify(livePrices, null, 2)}\n`, 'utf8');

  mkdirSync(path.dirname(autoProductsPath), { recursive: true });
  writeFileSync(autoProductsPath, `${JSON.stringify(autoProducts, null, 2)}\n`, 'utf8');

  console.log('Saved auto-products.json, amazon-asins.json and live-prices.json.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}