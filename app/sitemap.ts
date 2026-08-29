import type { MetadataRoute } from 'next';
import { COMPARISONS } from '@/data/comparisons';
import { PRODUCTS } from '@/data/products';
import { GUIDES } from '@/data/guides';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/vs`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/deals`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/guides`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/affiliate-disclosure`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const productRoutes: MetadataRoute.Sitemap = PRODUCTS.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const comparisonRoutes: MetadataRoute.Sitemap = COMPARISONS.map((comparison) => ({
    url: `${SITE_URL}/vs/${comparison.slug}`,
    lastModified: new Date(comparison.publishedOn),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: new Date(guide.publishedOn),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...comparisonRoutes, ...guideRoutes];
}