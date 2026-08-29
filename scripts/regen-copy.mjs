import { readFileSync, writeFileSync } from 'node:fs';

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

const friendly = (category) => labels[category] ?? category.replace(/-/g, ' ');

let rewritten = 0;
for (const product of data) {
  const cleanedPros = [
    ...new Set(
      (product.pros ?? []).filter(
        (pro) =>
          pro.length > 12 && !pro.includes(':') && /^[A-Za-z0-9]/.test(pro),
      ),
    ),
  ].slice(0, 4);

  product.pros = cleanedPros;

  const cleanRec = cleanedPros.find(
    (pro) => pro.length < 96 && !pro.includes(':') && /^[A-Za-z0-9]/.test(pro),
  );
  product.shortRecommendation =
    cleanRec ?? `A ${friendly(product.category)} worth a look on Amazon India`;

  const body = cleanedPros
    .slice(0, 3)
    .join('. ')
    .replace(/[.|;:,\s]+$/, '');
  product.description = body
    ? `${product.name}. ${body}.`
    : `${product.name} — auto-listed from Amazon India with a live price, customer rating and key specs. Tap the deal to check today's exact price and warranty before buying.`;

  rewritten += 1;
}

writeFileSync(path, JSON.stringify(data, null, 2));
console.log(`Rewrote ${rewritten} products in ${path}`);