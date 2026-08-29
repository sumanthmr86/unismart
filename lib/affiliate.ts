export interface Retailer {
  id: string;
  name: string;
  domain: string;
}

export const RETAILERS: Retailer[] = [
  { id: 'amazon', name: 'Amazon India', domain: 'amazon.in' },
  { id: 'flipkart', name: 'Flipkart', domain: 'flipkart.com' },
  { id: 'croma', name: 'Croma', domain: 'croma.com' },
  { id: 'reliance-digital', name: 'Reliance Digital', domain: 'reliancedigital.in' },
  { id: 'vijay-sales', name: 'Vijay Sales', domain: 'vijaysales.com' },
  { id: 'offline-retail', name: 'Local & offline stores', domain: 'in-store' },
];

function retailerById(id: string): Retailer {
  return RETAILERS.find((r) => r.id === id) ?? RETAILERS[0];
}

export function retailerName(id: string): string {
  return retailerById(id).name;
}

const AFFILIATE_BASE_URL =
  process.env.NEXT_PUBLIC_AFFILIATE_BASE_URL ?? 'https://unismart.store/go';

export function affiliateUrl(retailerId: string, productSlug: string): string {
  const tag = process.env.NEXT_PUBLIC_AFFILIATE_TAG ?? '';
  const base = `${AFFILIATE_BASE_URL}/${retailerId}/${productSlug}`;
  return tag ? `${base}?tag=${encodeURIComponent(tag)}` : base;
}