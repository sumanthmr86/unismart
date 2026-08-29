import { readFileSync, writeFileSync } from 'node:fs';
import { derivedAudioSpecs } from './lib/title-specs.mjs';

const path = 'data/auto-products.json';
const data = JSON.parse(readFileSync(path, 'utf8'));

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

const CATEGORY_COPY = {
  audio:
    'Built for the daily commute — music, calls and video lectures on the go.',
  'power-charging':
    'Keeps your phone, tablet and cables charged through lectures and hostel power cuts.',
  'study-setup':
    'A practical pick for dorm life — long hours at your desk without the clutter.',
  'hostel-essentials':
    'Makes hostel and PG life easier, from day one to finals week.',
  backpacks: 'Room for a laptop, books and the climb between floors.',
  accessories:
    'A small upgrade that keeps your setup working smoothly through the semester.',
  monitors: 'A bigger canvas for assignments, code and late-night series.',
  tablets: 'For notes, lectures and reading — light enough for every bag.',
  laptops: 'Ready for notes, projects, coding and the odd game night.',
  stationery: 'Stocked up and ready for the semester — notes, lists and exams.',
};

const friendly = (category) => labels[category] ?? category.replace(/-/g, ' ');

const ratingLine = (rating, ratingCount) => {
  const parts = [];
  if (rating > 0) parts.push(`rated ${rating}/5`);
  if (ratingCount > 0) parts.push(`${ratingCount.toLocaleString('en-IN')} Amazon reviews`);
  return parts.length > 0 ? ` Backed by ${parts.join(' and ')}.` : '';
};

const modelShort = (name, brand) => {
  let model = name;
  if (brand && name.toLowerCase().startsWith(brand.toLowerCase())) {
    model = name.slice(brand.length);
  }
  model = model.replace(/^(?:,|:|\s|-)+/, '').trim();
  return model.slice(0, 48) || '';
};

const polishBullet = (raw) => {
  let bullet = raw
    .replace(/^[\s*•▪·:;—–\-›]+/, '')
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/^\[[^\]]*\]\s*/, '')
    .replace(/^[A-Z][A-Z &/.%'\-(),]{2,48}\s*[:—-]\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
  bullet = bullet.charAt(0).toUpperCase() + bullet.slice(1);
  return bullet;
};

let rewritten = 0;
for (const product of data) {
  if (product.category === 'audio') {
    const extras = derivedAudioSpecs(product.specs ?? [], product.name);
    product.specs = [...extras, ...(product.specs ?? [])].slice(0, 12);
  }
  const rawPros = [
    ...new Set(
      (product.pros ?? (product.about ?? [])).map((pro) => polishBullet(pro)),
    ),
  ]
    .filter((pro) => pro.length > 12)
    .slice(0, 4);

  const pros = rawPros.filter(
    (pro) => !pro.includes(':') && /^[A-Za-z0-9]/.test(pro),
  );

  if (pros.length === 0) {
    for (const s of product.specs?.slice(0, 2) ?? []) {
      pros.push(`${s.label}: ${s.value}`);
    }
  }

  const shortRecommendation =
    pros.find((pro) => pro.length < 96 && !pro.includes(':')) ??
    (() => {
      const model = modelShort(product.name, product.brand);
      const base = `Top-rated ${friendly(product.category)} on Amazon India`;
      return model ? `${base} — ${model}` : base;
    })();

  const bullets = pros.slice(0, 3).join('. ');
  const template =
    CATEGORY_COPY[product.category] ??
    'Popular on Amazon India with a live price that updates automatically.';
  const rating = ratingLine(product.rating, product.ratingCount);
  let description = `${product.name}. ${shortRecommendation}. ${template}${rating}`;
  if (bullets) description = `${description} ${bullets}.`;
  description = description.replace(/[.|;:,\s]+$/, '');

  product.pros = pros;
  product.shortRecommendation = shortRecommendation;
  product.description = description;
  rewritten += 1;
}

writeFileSync(path, JSON.stringify(data, null, 2));
console.log(`Rewrote ${rewritten} products in ${path}`);