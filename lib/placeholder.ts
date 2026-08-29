import type { CategoryId } from '@/lib/types';

const PALETTES: Record<CategoryId, [string, string]> = {
  laptops: ['#4f46e5', '#7c3aed'],
  audio: ['#db2777', '#7c3aed'],
  accessories: ['#0891b2', '#6366f1'],
  backpacks: ['#d97706', '#db2777'],
  'power-charging': ['#059669', '#0d9488'],
  'study-setup': ['#2563eb', '#0ea5e9'],
  'hostel-essentials': ['#ea580c', '#f59e0b'],
  tablets: ['#7c3aed', '#db2777'],
  stationery: ['#16a34a', '#059669'],
  monitors: ['#475569', '#0f172a'],
};

function hashCode(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase() || 'U';
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function productPlaceholder(
  name: string,
  category: CategoryId,
): string {
  const [from, to] = PALETTES[category] ?? PALETTES.laptops;
  const seed = hashCode(name);
  const circleX = 40 + (seed % 45);
  const circleY = 22 + (seed % 40);
  const initial = escapeXml(initialOf(name));
  const label = escapeXml(name.split(/\s+/).slice(0, 3).join(' '));
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">`,
    `<defs>`,
    `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">`,
    `<stop offset="0" stop-color="${from}"/>`,
    `<stop offset="1" stop-color="${to}"/>`,
    `</linearGradient>`,
    `<pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse">`,
    `<path d="M 40 0 L 0 40 M 0 0 L 40 40" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>`,
    `</pattern>`,
    `</defs>`,
    `<rect width="640" height="480" fill="url(#g)"/>`,
    `<circle cx="${circleX}" cy="${circleY}" r="180" fill="#ffffff" fill-opacity="0.08"/>`,
    `<circle cx="560" cy="400" r="140" fill="#ffffff" fill-opacity="0.06"/>`,
    `<rect width="640" height="480" fill="url(#p)"/>`,
    `<rect x="56" y="132" width="200" height="200" rx="28" fill="#ffffff" fill-opacity="0.16"/>`,
    `<text x="156" y="288" font-family="-apple-system, Segoe UI, Roboto, sans-serif" font-size="120" font-weight="700" fill="#ffffff" text-anchor="middle">${initial}</text>`,
    `<text x="44" y="432" font-family="-apple-system, Segoe UI, Roboto, sans-serif" font-size="30" font-weight="600" fill="#ffffff" fill-opacity="0.95">${label}</text>`,
    `</svg>`,
  ].join('');

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function guidePlaceholder(title: string, category: CategoryId): string {
  const [from, to] = PALETTES[category] ?? PALETTES.laptops;
  const escaped = escapeXml(title);
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">`,
    `<defs>`,
    `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">`,
    `<stop offset="0" stop-color="${from}"/>`,
    `<stop offset="1" stop-color="${to}"/>`,
    `</linearGradient>`,
    `</defs>`,
    `<rect width="640" height="360" fill="url(#g)"/>`,
    `<circle cx="540" cy="40" r="150" fill="#ffffff" fill-opacity="0.10"/>`,
    `<circle cx="80" cy="330" r="120" fill="#ffffff" fill-opacity="0.08"/>`,
    `<rect x="420" y="210" width="76" height="76" rx="14" fill="#ffffff" fill-opacity="0.16" transform="rotate(18 458 248)"/>`,
    `<text x="40" y="196" font-family="-apple-system, Segoe UI, Roboto, sans-serif" font-size="32" font-weight="700" fill="#ffffff" fill-opacity="0.95" letter-spacing="1">${escaped}</text>`,
    `<text x="40" y="236" font-family="-apple-system, Segoe UI, Roboto, sans-serif" font-size="18" font-weight="500" fill="#ffffff" fill-opacity="0.7">UniSmart Buying Guide</text>`,
    `</svg>`,
  ].join('');

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}