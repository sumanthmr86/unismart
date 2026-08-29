import { readFileSync } from 'node:fs';
import { normalizeSpecLabel } from '../lib/specs.ts';

const auto = JSON.parse(readFileSync('data/auto-products.json', 'utf8'));

function parseCurated() {
  const src = readFileSync('data/products.ts', 'utf8');
  const blocks = [];
  const re = /id: '([^']+)'[\s\S]*?specs: \[([\s\S]*?)\n    \],/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const specs = [...m[2].matchAll(/\{ label: '([^']+)', value: '([^']*)'\}/g)].map(
      ([, label, value]) => ({ label, value }),
    );
    blocks.push({ id: m[1], specs });
  }
  return blocks;
}

const curated = parseCurated();
console.log(`Loaded ${auto.length} auto products, ${curated.length} curated products`);

let dupIssues = 0;
for (const p of [...auto, ...curated]) {
  const seen = new Map();
  for (const s of p.specs ?? []) {
    const n = normalizeSpecLabel(s.label);
    if (seen.has(n)) {
      dupIssues += 1;
      console.log(`DUP in ${p.id}: "${s.label}" -> "${n}" collides with "${seen.get(n)}"`);
    } else {
      seen.set(n, s.label);
    }
  }
}
if (dupIssues === 0) console.log('No duplicate normalized labels inside any product — keys safe.');

const semanticDups = [
  { raw: ['Connectivity Technology', 'Wireless Communication Standard'], label: 'Connectivity' },
];
console.log('\nIntentional merges still present (harmless — same info, e.g. Bluetooth version):');
for (const p of [...auto, ...curated]) {
  const labels = (p.specs ?? []).map((s) => s.label);
  if (labels.includes('Connectivity Technology') && labels.includes('Wireless Communication Standard')) {
    console.log(`  ${p.id}`);
  }
}