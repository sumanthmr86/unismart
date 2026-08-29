import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { fetchAndParse } from './lib/amazon-price.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const asinsPath = path.join(root, 'data', 'amazon-asins.json');
const livePath = path.join(root, 'data', 'live-prices.json');

const asins = JSON.parse(readFileSync(asinsPath, 'utf8'));
const live = JSON.parse(readFileSync(livePath, 'utf8'));

const today = new Date().toISOString().slice(0, 10);
const changes = [];
let ok = 0;
let failed = 0;
let totalBlocked = false;

for (const [slug, asin] of Object.entries(asins)) {
  const current = live[slug] || {};
  try {
    const { priceInr, previousPriceInr } = await fetchAndParse(asin);
    if (!Number.isFinite(priceInr)) throw new Error('no usable price');

    const newMrp =
      Number.isFinite(previousPriceInr) && previousPriceInr >= priceInr
        ? previousPriceInr
        : current.previousPriceInr;

    const priceChanged = priceInr !== current.priceInr;
    const mrpChanged = newMrp !== current.previousPriceInr;

    live[slug] = {
      priceInr,
      previousPriceInr: newMrp,
      updatedAt: today,
    };

    if (priceChanged) {
      changes.push(
        `${slug}: ${formatInr(current.priceInr)} -> ${formatInr(priceInr)}` +
          (mrpChanged ? ` (MRP ${formatInr(current.previousPriceInr)} -> ${formatInr(newMrp)})` : ''),
      );
    }
    ok += 1;
  } catch (err) {
    failed += 1;
    console.warn(`  ${slug} (${asin}): ${err.message}`);
  }
  await new Promise((resolve) => setTimeout(resolve, 900));
}

writeFileSync(livePath, `${JSON.stringify(live, null, 2)}\n`);

if (failed === Object.keys(asins).length && ok === 0) {
  totalBlocked = true;
}

console.log(
  `\nSync finished: ${ok} checked, ${failed} failed, ${changes.length} price changes.`,
);
if (changes.length > 0) {
  console.log(`Changes:\n  ${changes.join('\n  ')}`);
}
if (totalBlocked) {
  console.warn(
    'WARNING: every product failed to fetch — Amazon may be blocking this network. No prices were updated.',
  );
}

function formatInr(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'n/a';
  return `₹${value.toLocaleString('en-IN')}`;
}