import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { derivedAudioSpecs } from './lib/title-specs.mjs';
import { cleanProductName } from './lib/clean-name.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const autoProductsPath = path.join(root, 'data', 'auto-products.json');
const archivedPath = path.join(root, 'data', 'archived-products.json');
const asinsPath = path.join(root, 'data', 'amazon-asins.json');

const TARGET_TOTAL = 500;

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function generateId(title, asin) {
  return `${slugify(title)}-${asin.slice(-6)}`;
}

function extractSpecsFromString(specsStr, category) {
  const specs = [];
  if (!specsStr) return specs;
  const pairs = specsStr.split(';').map(s => s.trim()).filter(Boolean);
  for (const pair of pairs) {
    const [label, ...valParts] = pair.split(':');
    if (label && valParts.length) {
      specs.push({ label: label.trim(), value: valParts.join(':').trim() });
    }
  }
  return specs;
}

function buildDescription(title, features, rating, ratingCount, category) {
  const featText = features.slice(0, 5).join('. ');
  return `${title}. ${featText}. Rated ${rating}/5 from ${ratingCount.toLocaleString()} Amazon reviews. Built for student life — ${category}. ${featText}`;
}

function scoreProduct(p) {
  const amazonScore = p.rating * Math.log10(p.ratingCount + 10) * 2;
  const priceScore = p.previousPriceInr > p.priceInr ? ((p.previousPriceInr - p.priceInr) / p.previousPriceInr) * 10 : 0;
  return amazonScore + priceScore;
}

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    values.push(current.trim());
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ? values[idx].replace(/^"|"$/g, '') : '';
    });
    rows.push(row);
  }
  return rows;
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error('Usage: node scripts/import-csv.mjs <path-to-csv>');
    console.error('Example: node scripts/import-csv.mjs data/seed-products.csv');
    process.exit(1);
  }

  const fullCsvPath = path.resolve(root, csvPath);
  if (!existsSync(fullCsvPath)) {
    console.error(`CSV file not found: ${fullCsvPath}`);
    process.exit(1);
  }

  console.log(`📥 Reading CSV: ${fullCsvPath}`);
  const csvText = readFileSync(fullCsvPath, 'utf8');
  const rows = parseCSV(csvText);
  console.log(`📊 Parsed ${rows.length} rows from CSV`);

  let asins = existsSync(asinsPath) ? JSON.parse(readFileSync(asinsPath, 'utf8')) : {};
  let autoProducts = existsSync(autoProductsPath) ? JSON.parse(readFileSync(autoProductsPath, 'utf8')) : [];
  let archived = existsSync(archivedPath) ? JSON.parse(readFileSync(archivedPath, 'utf8')) : [];

  const existingSlugs = new Set(autoProducts.map(p => p.slug));
  const existingAsins = new Set(Object.values(asins));

  let imported = 0;
  let skipped = 0;

  for (const row of rows) {
    if (autoProducts.length >= 500) break;

    const name = row.name?.trim();
    const category = row.category?.trim();
    const priceInr = parseInt(row.priceInr) || 0;
    const previousPriceInr = parseInt(row.previousPriceInr) || Math.round(priceInr * 1.3);
    const rating = parseFloat(row.rating) || 4.0;
    const ratingCount = parseInt(row.ratingCount) || 100;
    const shortRecommendation = row.shortRecommendation?.trim() || `Great ${category} pick`;
    const description = row.description?.trim() || `Great ${category} product for students.`;
    const image = row.image?.trim() || '';
    const brand = row.brand?.trim() || 'Unknown';
    const specsStr = row.specs?.trim() || '';

    if (!name || !category || priceInr <= 0) {
      console.log(`⚠️ Skipping invalid row: ${name || 'no name'}`);
      skipped++;
      continue;
    }

    const slug = slugify(name);
    if (existingSlugs.has(slug)) {
      console.log(`⚠️ Skipping duplicate slug: ${slug}`);
      skipped++;
      continue;
    }

    // Generate a fake ASIN for manual entries
    const fakeAsin = `MANUAL${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const id = generateId(name, fakeAsin);

    const specs = extractSpecsFromString(specsStr, category);
    const audioSpecs = derivedAudioSpecs(name);
    const allSpecs = [...specs, ...audioSpecs];

    const features = specs.map(s => `${s.label}: ${s.value}`);
    const shortRec = shortRecommendation;
    const desc = buildDescription(name, features, rating, ratingCount, category);

    const product = {
      id,
      slug,
      name,
      brand,
      category,
      priceInr,
      previousPriceInr,
      rating,
      ratingCount,
      uniSmartScore: 7.5,
      shortRecommendation: shortRec,
      description: desc,
      specs: allSpecs,
      pros: features.slice(0, 3),
      cons: [],
      bestFor: [`${category} enthusiasts`, 'Students on a budget'],
      notIdealFor: ['Professional studio use'],
      deals: [
        {
          retailer: 'amazon',
          url: `https://www.amazon.in/s?k=${encodeURIComponent(name)}&tag=unismart00-21`,
          priceInr,
          note: 'Search on Amazon India',
        },
      ],
      reviews: [],
      image: image || `https://via.placeholder.com/400?text=${encodeURIComponent(name)}`,
      images: image ? [image] : [`https://via.placeholder.com/400?text=${encodeURIComponent(name)}`],
      priceUpdatedOn: new Date().toISOString(),
      featured: false,
      deal: true,
    };

    autoProducts.push(product);
    existingSlugs.add(slug);
    asins[slug] = fakeAsin;
    imported++;
  }

  console.log(`✅ Imported ${imported} products, skipped ${skipped}`);

  // Score all products
  for (const p of autoProducts) {
    p.uniSmartScore = Math.round(scoreProduct(p) * 10) / 10;
  }

  autoProducts.sort((a, b) => b.uniSmartScore - a.uniSmartScore);

  const keep = autoProducts.slice(0, 500);
  const archive = autoProducts.slice(500);

  for (const p of archive) {
    p.archivedAt = new Date().toISOString();
  }

  writeFileSync(autoProductsPath, JSON.stringify(keep, null, 2));
  writeFileSync(archivedPath, JSON.stringify([...JSON.parse(readFileSync(archivedPath, 'utf8') || '[]'), ...archive], null, 2));
  writeFileSync(asinsPath, JSON.stringify(asins, null, 2));

  console.log(`✅ Kept ${keep.length} products, archived ${archive.length} products`);

  // Run catalog to regenerate specs
  const { execSync } = await import('node:child_process');
  console.log('📦 Running catalog to regenerate specs...');
  execSync('npm run catalog', { cwd: path.join(root), stdio: 'inherit' });

  console.log('🎉 Import complete! Total products:', keep.length);
}

main().catch(e => {
  console.error('💥 Import failed:', e);
  process.exit(1);
});