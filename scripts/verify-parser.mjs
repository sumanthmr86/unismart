import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import { parseProductPrices, isBotBlocked, isProductPage } from './lib/amazon-price.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const asins = JSON.parse(readFileSync(path.join(root, 'data', 'amazon-asins.json'), 'utf8'));

const dir =
  process.argv[2] ?? path.join(process.env.TEMP_OPENCODE ?? os.tmpdir(), 'opencode');

const fileBySlug = {
  'hp-victus-15': 'hp.html',
  'boat-airdopes-141': 'boat.html',
  'redmi-pad-se': 'redmi.html',
  'lenovo-ideapad-slim-3': 'lenovo.html',
  'oneplus-nord-buds-3': 'oneplus.html',
  'realme-buds-air-8-pro': 'realme.html',
  'logitech-pebble-2-m350s': 'pebble.html',
  'amazonbasics-laptop-sleeve-15-6': 'sleeve.html',
  'skybags-brat-backpack': 'skybags.html',
  'american-tourister-30l-backpack': 'at2.html',
  'xiaomi-power-bank-5i-20000': 'mi.html',
  'ambrane-65w-gan-charger': 'ambrane.html',
  'wipro-garnet-led-desk-lamp': 'wipro.html',
  'logitech-mk235-combo': 'mk235.html',
  'lg-24ml600s-monitor': 'lg.html',
  'samsung-galaxy-tab-a11-plus': 'samsungtab.html',
  'prestige-electric-kettle-1-5l': 'kettle.html',
  'havells-extension-board-4-socket': 'havells.html',
  'classmate-notebook-pack': 'classmate.html',
  'pilot-v5-pens-pack-10': 'pilot.html',
};

let passed = 0;
let missing = 0;
let problems = 0;

console.log(`Parsing local Amazon pages in: ${dir}\n`);

for (const [slug, file] of Object.entries(fileBySlug)) {
  const fullPath = path.join(dir, file);
  const currentAsin = asins[slug] ?? '?';
  if (!existsSync(fullPath)) {
    console.log(`  MISSING ${file} (${slug}) — skipping`);
    missing += 1;
    continue;
  }
  const html = readFileSync(fullPath, 'utf8');
  if (isBotBlocked(html) || !isProductPage(html)) {
    console.log(`  BLOCKED/EXPECTED ${file} (${slug})`);
    problems += 1;
    continue;
  }
  const { priceInr, previousPriceInr } = parseProductPrices(html);
  const okPrice = Number.isFinite(priceInr) && priceInr > 0;
  const okMrp = Number.isFinite(previousPriceInr) && previousPriceInr > 0;
  const sane = okPrice && okMrp ? previousPriceInr >= priceInr : true;
  const status = okPrice && sane ? 'OK ' : 'PROBLEM';
  if (status === 'OK ') passed += 1;
  else problems += 1;
  console.log(
    `  ${status} ${file} (${slug}) ${currentAsin} -> price ₹${priceInr}, MRP ₹${previousPriceInr}${sane ? '' : ' [MRP < price!]'}`,
  );
}

console.log(
  `\nResult: ${passed} parsed cleanly, ${problems} problems, ${missing} missing files.`,
);
if (problems > 0) process.exitCode = 1;