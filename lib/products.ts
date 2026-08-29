import { CATEGORIES } from '@/data/categories';
import { GUIDES } from '@/data/guides';
import { PRODUCTS } from '@/data/products';
import type { BuyingGuide, CategoryId, Product, SortKey } from '@/lib/types';
import { discountPercent } from '@/lib/format';

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function getFeaturedDeals(): Product[] {
  return PRODUCTS.filter((p) => p.deal)
    .slice()
    .sort(
      (a, b) =>
        discountPercent(b.priceInr, b.previousPriceInr) -
        discountPercent(a.priceInr, a.previousPriceInr),
    );
}

export function getDealsPage(): Product[] {
  return PRODUCTS.filter((p) => p.previousPriceInr > p.priceInr)
    .slice()
    .sort(
      (a, b) =>
        discountPercent(b.priceInr, b.previousPriceInr) -
        discountPercent(a.priceInr, a.previousPriceInr),
    );
}

export function getProductsByCategory(category: CategoryId): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function productCountForCategory(categoryId: CategoryId): number {
  return getProductsByCategory(categoryId).length;
}

export interface ProductWithCategory extends Product {
  categoryName: string;
  categorySlug: string;
}

export function withCategory(product: Product): ProductWithCategory {
  const category = CATEGORIES.find((c) => c.id === product.category)!;
  return {
    ...product,
    categoryName: category.name,
    categorySlug: category.id,
  };
}

const FILLER_WORDS = new Set([
  'best',
  'top',
  'the',
  'a',
  'an',
  'for',
  'of',
  'in',
  'on',
  'to',
  'and',
  'with',
  'college',
  'students',
  'student',
  'class',
  'buy',
  'price',
  'under',
  'below',
  'less',
  'than',
  'above',
  'over',
  'up',
  'upto',
  'max',
  'within',
  'products',
  'product',
  'rs',
  'inr',
  'k',
]);

export interface ParsedQuery {
  tokens: string[];
  minPrice?: number;
  maxPrice?: number;
}

export function parseSearchQuery(input: string): ParsedQuery {
  const q = (input ?? '').trim().toLowerCase().replace(/₹/g, 'rs ');
  let minPrice: number | undefined;
  let maxPrice: number | undefined;

  const priceRe =
    /(?:under|below|less than|up to|upto|within|max)\s*(?:rs\.?\s*)?(\d[\d,]*(?:\s*k)?)|\b(?:rs\.?\s*)(\d[\d,]*(?:\s*k)?)/i;
  const priceMatch = q.match(priceRe);
  if (priceMatch) {
    const raw = (priceMatch[1] ?? priceMatch[2]).replace(/,/g, '');
    const mult = /k\s*$/.test(raw) ? 1000 : 1;
    const num = parseFloat(raw) * mult;
    maxPrice = Number.isFinite(num) ? num : undefined;
  }

  const plainPriceRe = /(\d[\d,]*(?:\s*k)?)/;
  const tokens = q
    .split(/\s+/)
    .filter(Boolean)
    .reduce<string[]>((acc, word) => {
      if (FILLER_WORDS.has(word)) return acc;
      const m = word.match(plainPriceRe);
      if (m && m[0].length >= 4) {
        const mult = /k$/i.test(m[0]) ? 1000 : 1;
        const num = parseFloat(m[0].replace(/,/g, '')) * mult;
        if (Number.isFinite(num)) maxPrice = Math.min(maxPrice ?? num, num);
        return acc;
      }
      acc.push(word);
      return acc;
    }, []);

  return { tokens, minPrice, maxPrice };
}

export function searchProducts(query: string): Product[] {
  const { tokens } = parseSearchQuery(query);
  if (tokens.length === 0) return [];

  const scored = PRODUCTS.map((product) => {
    const haystack = [
      product.name,
      product.brand,
      withCategory(product).categoryName,
      product.shortRecommendation,
      product.description,
      ...product.bestFor,
      ...product.notIdealFor,
      ...product.pros,
      ...product.cons,
    ]
      .join(' ')
      .toLowerCase();

    let score = 0;
    for (const token of tokens) {
      if (haystack.includes(token)) score += 1;
      if (product.name.toLowerCase().includes(token)) score += 3;
      if (product.brand.toLowerCase() === token) score += 2;
    }
    return { product, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.product);
}

export function filterProducts(
  products: Product[],
  opts: {
    query: string;
    category: CategoryId | 'all';
    maxPrice?: number;
    minPrice?: number;
  },
): Product[] {
  const { tokens, minPrice, maxPrice } = parseSearchQuery(opts.query);

  const match = (p: Product, priceCap?: number) => {
    if (opts.category !== 'all' && p.category !== opts.category) return false;
    const low = opts.minPrice ?? minPrice;
    const high = opts.maxPrice ?? priceCap;
    if (low !== undefined && p.priceInr < low) return false;
    if (high !== undefined && p.priceInr > high) return false;
    if (tokens.length === 0) return true;
    const haystack = [
      p.name,
      p.brand,
      withCategory(p).categoryName,
      p.shortRecommendation,
      ...p.bestFor,
    ]
      .join(' ')
      .toLowerCase();
    return tokens.every((t) => haystack.includes(t));
  };

  const priced = products.filter((p) => match(p, maxPrice));
  if (priced.length === 0 && maxPrice !== undefined) {
    return products.filter((p) => match(p, undefined));
  }
  return priced;
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const list = products.slice();
  switch (sort) {
    case 'relevance':
      return list;
    case 'price_asc':
      return list.sort((a, b) => a.priceInr - b.priceInr);
    case 'price_desc':
      return list.sort((a, b) => b.priceInr - a.priceInr);
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating);
    case 'discount':
      return list.sort(
        (a, b) =>
          discountPercent(b.priceInr, b.previousPriceInr) -
          discountPercent(a.priceInr, a.previousPriceInr),
      );
  }
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const same = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category,
  );
  const others = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category !== product.category,
  );
  const merged = [...same, ...others];
  return merged.slice(0, limit);
}

export function getRelatedGuides(
  _category: CategoryId,
  excludeSlug: string,
  limit = 3,
): BuyingGuide[] {
  return GUIDES.filter((g) => g.slug !== excludeSlug).slice(0, limit);
}