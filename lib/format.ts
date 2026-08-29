const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const inrCompactFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
  notation: 'compact',
});

export function formatINR(value: number): string {
  return inrFormatter.format(value);
}

export function formatINRCompact(value: number): string {
  return inrCompactFormatter.format(value);
}

export function discountPercent(price: number, previousPrice: number): number {
  if (previousPrice <= 0 || price >= previousPrice) return 0;
  return Math.round((1 - price / previousPrice) * 100);
}

export function savingsInr(price: number, previousPrice: number): number {
  return Math.max(0, previousPrice - price);
}