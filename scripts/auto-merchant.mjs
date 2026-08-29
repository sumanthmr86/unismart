import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { PaapiClient } from 'amazon-paapi';
import { derivedAudioSpecs } from './lib/title-specs.mjs';
import { cleanProductName } from './lib/clean-name.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const PA_ACCESS_KEY = process.env.AMAZON_PA_ACCESS_KEY;
const PA_SECRET_KEY = process.env.AMAZON_PA_SECRET_KEY;
const PA_PARTNER_TAG = process.env.AMAZON_PA_PARTNER_TAG || 'unismart00-21';
const PA_HOST = process.env.AMAZON_PA_HOST || 'webservices.amazon.in';
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

const queriesPath = path.join(root, 'scripts', 'data', 'catalog-queries.json');
const asinsPath = path.join(root, 'data', 'amazon-asins.json');
const autoProductsPath = path.join(root, 'data', 'auto-products.json');
const archivedPath = path.join(root, 'data', 'archived-products.json');
const livePricesPath = path.join(root, 'data', 'live-prices.json');

const MAX_PRODUCTS_PER_CATEGORY = 50;
const TARGET_TOTAL = 200;
const ARCHIVE_THRESHOLD_SCORE = 4.0;

const client = new PaapiClient({
  accessKey: PA_ACCESS_KEY,
  secretKey: PA_SECRET_KEY,
  partnerTag: PA_PARTNER_TAG,
  host: PA_HOST,
});

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function normalizeTitle(title) {
  return title.toLowerCase().replace(/\s+/g, ' ').trim();
}

function generateId(title, asin) {
  return `${slugify(title)}-${asin.slice(-6)}`;
}

function extractPrice(listings) {
  if (!listings || !listings.length) return { price: 0, previousPrice: 0 };
  let minPrice = Infinity;
  let maxPrice = 0;
  for (const l of listings) {
    if (l.Price && typeof l.Price.Amount === 'number') {
      const amt = Math.round(l.Price.Amount / 100);
      if (amt > 0) {
        minPrice = Math.min(minPrice, amt);
        maxPrice = Math.max(maxPrice, amt);
      }
    }
  }
  if (minPrice === Infinity) return { price: 0, previousPrice: 0 };
  return { price: minPrice, previousPrice: maxPrice > minPrice ? maxPrice : Math.round(minPrice * 1.3) };
}

function extractRating(reviews) {
  if (!reviews) return { rating: 0, count: 0 };
  const star = reviews.StarRating || 0;
  const count = reviews.Count || 0;
  return { rating: star, count };
}

function extractImages(images) {
  const urls = new Set();
  if (!images) return [];
  const add = (obj) => {
    if (obj?.URL) urls.add(obj.URL);
    if (obj?.Large?.URL) urls.add(obj.Large.URL);
    if (obj?.Medium?.URL) urls.add(obj.Medium.URL);
    if (obj?.Small?.URL) urls.add(obj.Small.URL);
  };
  if (images.Primary) add(images.Primary);
  if (images.Variants) {
    for (const v of images.Variants) add(v);
  }
  return Array.from(urls);
}

function extractFeatures(itemInfo) {
  const features = [];
  if (itemInfo?.ProductInfo?.Features?.DisplayValues) {
    features.push(...itemInfo.ProductInfo.Features.DisplayValues);
  }
  if (itemInfo?.TechnicalInfo?.Features?.DisplayValues) {
    features.push(...itemInfo.TechnicalInfo.Features.DisplayValues);
  }
  return features;
}

function buildShortRecommendation(title, features, category) {
  const key = features.slice(0, 2).join('; ');
  return key || `Top-rated ${category} on Amazon India — ${title}`;
}

function buildDescription(title, features, rating, ratingCount, category) {
  const featText = features.slice(0, 5).join('. ');
  return `${title}. ${featText}. Rated ${rating}/5 from ${ratingCount.toLocaleString()} Amazon reviews. Built for student life — ${category}. ${featText}`;
}

function extractSpecs(features, category) {
  const specs = [];
  const specKeywords = {
    audio: ['driver', 'battery', 'charging', 'latency', 'anc', 'water', 'ipx', 'bluetooth'],
    laptops: ['display', 'processor', 'ram', 'storage', 'graphics', 'weight', 'battery'],
    accessories: ['dpi', 'battery', 'connectivity', 'weight', 'silent'],
    backpacks: ['capacity', 'laptop', 'compartments', 'rain', 'warranty'],
    'power-charging': ['capacity', 'watt', 'charging', 'ports', 'cable', 'display'],
    'study-setup': ['brightness', 'flicker', 'dpi', 'keys', 'connectivity', 'battery'],
    'hostel-essentials': ['capacity', 'power', 'material', 'safety', 'weight'],
    tablets: ['display', 'processor', 'ram', 'storage', 'battery', 'os'],
    stationery: ['pack', 'pages', 'size', 'type', 'tip'],
    monitors: ['size', 'resolution', 'refresh', 'colour', 'ports', 'eye'],
  };
  const keywords = specKeywords[category] || [];
  for (const feat of features) {
    const low = feat.toLowerCase();
    for (const kw of keywords) {
      if (low.includes(kw)) {
        const label = kw.charAt(0).toUpperCase() + kw.slice(1);
        const value = feat;
        specs.push({ label, value });
        break;
      }
    }
    if (specs.length >= 8) break;
  }
  return specs;
}

function scoreProduct(p, clickCount = 0) {
  const amazonScore = p.rating * Math.log10(p.ratingCount + 10) * 2;
  const clickScore = Math.log10(clickCount + 1) * 5;
  const priceScore = p.previousPriceInr > p.priceInr ? ((p.previousPriceInr - p.priceInr) / p.previousPriceInr) * 10 : 0;
  return amazonScore + clickScore + priceScore;
}

async function fetchClicksFromVercel() {
  if (!VERCEL_TOKEN) return {};
  try {
    const res = await fetch('https://api.vercel.com/v1/analytics/events', {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    });
    if (!res.ok) return {};
    const data = await res.json();
    const clicks = {};
    for (const event of data.events || []) {
      if (event.name === 'product_click' && event.properties?.slug) {
        clicks[event.properties.slug] = (clicks[event.properties.slug] || 0) + 1;
      }
    }
    return clicks;
  } catch {
    return {};
  }
}

async function searchCategory(query, category, limit = 10) {
  try {
    const response = await client.SearchItems({
      Keywords: query,
      SearchIndex: 'All',
      ItemCount: limit,
      Resources: [
        'Images.Primary.Large',
        'Images.Primary.Medium',
        'Images.Primary.Small',
        'Images.Variants.Large',
        'Images.Variants.Medium',
        'Images.Variants.Small',
        'ItemInfo.Title',
        'ItemInfo.ByLineInfo',
        'ItemInfo.Classifications',
        'ItemInfo.ProductInfo',
        'ItemInfo.TechnicalInfo',
        'ItemInfo.ExternalIds',
        'Offers.Listings.Price',
        'Offers.Listings.Availability',
        'CustomerReviews.StarRating',
        'CustomerReviews.Count',
        'BrowseNodes',
      ],
      SortBy: 'Relevance',
    });
    return response.Items || [];
  } catch (e) {
    console.error(`Search failed for "${query}":`, e.message);
    return [];
  }
}

async function main() {
  console.log('🤖 Auto-Merchant starting...');

  if (!PA_ACCESS_KEY || !PA_SECRET_KEY) {
    console.error('❌ Missing PA-API credentials in env');
    process.exit(1);
  }

  const queries = JSON.parse(readFileSync(queriesPath, 'utf8'));
  let asins = existsSync(asinsPath) ? JSON.parse(readFileSync(asinsPath, 'utf8')) : {};
  let autoProducts = existsSync(autoProductsPath) ? JSON.parse(readFileSync(autoProductsPath, 'utf8')) : [];
  let livePrices = existsSync(livePricesPath) ? JSON.parse(readFileSync(livePricesPath, 'utf8')) : {};
  let archived = existsSync(archivedPath) ? JSON.parse(readFileSync(archivedPath, 'utf8')) : [];

  const existingAsins = new Set(Object.values(asins));
  const existingSlugs = new Set(autoProducts.map((p) => p.slug));

  const clicks = await fetchClicksFromVercel();
  console.log(`📊 Loaded ${Object.keys(clicks).length} product click counts from Vercel`);

  const allNewProducts = [];
  const seenAsins = new Set(existingAsins);

  for (const { query, category, limit } of queries) {
    console.log(`🔍 Searching: "${query}" (${category})...`);
    const items = await searchCategory(query, category, limit);
    await sleep(1000);

    for (const item of items) {
      const asin = item.ASIN;
      if (!asin || seenAsins.has(asin)) continue;
      seenAsins.add(asin);

      const title = item.ItemInfo?.Title?.DisplayValue || `Product ${asin}`;
      const name = cleanProductName(title);
      const slug = slugify(name);

      if (existingSlugs.has(slug)) continue;
      existingSlugs.add(slug);

      const { price, previousPrice } = extractPrice(item.Offers?.Listings);
      const { rating, count: ratingCount } = extractRating(item.CustomerReviews);
      const images = extractImages(item.Images);
      const image = images[0] || '';
      const features = extractFeatures(item.ItemInfo);
      const shortRec = buildShortRecommendation(title, features, category);
      const description = buildDescription(title, features, rating, ratingCount, category);
      const specs = extractSpecs(features, category);
      const audioSpecs = derivedAudioSpecs(name);
      const allSpecs = [...specs, ...audioSpecs];

      const pros = features.slice(0, 3).map((f) => f.charAt(0).toUpperCase() + f.slice(1));
      const cons = [];
      const bestFor = [`${category} enthusiasts`, 'Students on a budget'];
      const notIdealFor = ['Professional studio use'];

      const product = {
        id: generateId(name, asin),
        slug,
        name,
        brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || 'Unknown',
        category,
        priceInr: price,
        previousPriceInr: previousPrice,
        rating,
        ratingCount,
        uniSmartScore: 7.5,
        shortRecommendation: shortRec,
        description,
        specs: allSpecs,
        pros,
        cons,
        bestFor,
        notIdealFor,
        deals: [
          {
            retailer: 'amazon',
            url: `https://www.amazon.in/dp/${asin}?tag=${encodeURIComponent(PA_PARTNER_TAG)}`,
            priceInr: price,
            note: 'Auto-listed on Amazon India with live pricing',
          },
        ],
        reviews: [],
        image: image || `https://via.placeholder.com/400?text=${encodeURIComponent(name)}`,
        images: images.length ? images : [image || `https://via.placeholder.com/400?text=${encodeURIComponent(name)}`],
        priceUpdatedOn: new Date().toISOString(),
        featured: false,
        deal: true,
      };

      allNewProducts.push(product);
      asins[slug] = asin;
    }
  }

  console.log(`✨ Found ${allNewProducts.length} new products from PA-API`);

  const allProducts = [...autoProducts, ...allNewProducts];

  const clicksMap = clicks;
  for (const p of allProducts) {
    const clicksCount = clicksMap[p.slug] || 0;
    p.uniSmartScore = Math.round(scoreProduct(p, clicksCount) * 10) / 10;
  }

  allProducts.sort((a, b) => b.uniSmartScore - a.uniSmartScore);

  const keep = allProducts.slice(0, TARGET_TOTAL);
  const archive = allProducts.slice(TARGET_TOTAL);

  for (const p of archive) {
    p.archivedAt = new Date().toISOString();
  }

  writeFileSync(autoProductsPath, JSON.stringify(keep, null, 2));
  writeFileSync(archivedPath, JSON.stringify([...archived, ...archive], null, 2));
  writeFileSync(asinsPath, JSON.stringify(asins, null, 2));

  console.log(`✅ Kept ${keep.length} products, archived ${archive.length} products`);
  console.log('📦 Running catalog to regenerate specs...');

  const { execSync } = await import('node:child_process');
  execSync('npm run catalog', { cwd: root, stdio: 'inherit' });

  console.log('🎉 Auto-Merchant complete!');
}

main().catch((e) => {
  console.error('💥 Auto-Merchant failed:', e);
  process.exit(1);
});