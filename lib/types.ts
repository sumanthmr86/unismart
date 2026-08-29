export type CategoryId =
  | 'laptops'
  | 'audio'
  | 'accessories'
  | 'backpacks'
  | 'power-charging'
  | 'study-setup'
  | 'hostel-essentials'
  | 'tablets'
  | 'stationery'
  | 'monitors';

export interface Category {
  id: CategoryId;
  name: string;
  short: string;
  description: string;
}

export interface Deal {
  retailer: string;
  url: string;
  priceInr?: number;
  note: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface DemoReview {
  author: string;
  detail: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategoryId;
  priceInr: number;
  previousPriceInr: number;
  rating: number;
  ratingCount: number;
  uniSmartScore: number;
  shortRecommendation: string;
  description: string;
  specs: ProductSpec[];
  pros: string[];
  cons: string[];
  bestFor: string[];
  notIdealFor: string[];
  deals: Deal[];
  reviews: DemoReview[];
  image?: string;
  images?: string[];
  priceUpdatedOn?: string;
  featured?: boolean;
  deal?: boolean;
}

export interface BuyingGuide {
  id: string;
  slug: string;
  title: string;
  category: CategoryId;
  excerpt: string;
  publishedOn: string;
  readMinutes: number;
  intro: string;
  sections: { heading: string; body: string; productIds?: string[] }[];
  picks: { label: string; productId: string; reason: string }[];
  tips: string[];
  faq: { q: string; a: string }[];
}

export type SortKey =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'rating'
  | 'discount';

export interface ComparisonPick {
  label: string;
  productId: string;
  reason: string;
}

export interface ProductComparison {
  id: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  productIds: [string, string];
  intro: string;
  keyDifferences: string[];
  verdict: string;
  picks: ComparisonPick[];
  faq: { q: string; a: string }[];
  publishedOn: string;
}