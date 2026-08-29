import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BadgeCheck,
  CheckCircle2,
  MinusCircle,
  RefreshCw,
  ShoppingBag,
  Swords,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import { CompareButton } from '@/components/compare/CompareButton';
import { DealButton } from '@/components/DealButton';
import { Faq } from '@/components/ui/Faq';
import { GuideCard } from '@/components/GuideCard';
import { PriceBlock } from '@/components/ui/PriceBlock';
import { RatingStars } from '@/components/ui/RatingStars';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ProductGrid } from '@/components/ProductGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getCategoryName } from '@/data/categories';
import { getComparisonsForProduct } from '@/data/comparisons';
import { getProductBySlug } from '@/data/products';
import { PRODUCTS } from '@/data/products';
import { GUIDES } from '@/data/guides';
import { getRelatedGuides, getRelatedProducts } from '@/lib/products';
import { retailerName } from '@/lib/affiliate';
import { formatINR } from '@/lib/format';
import { productPlaceholder } from '@/lib/placeholder';
import { SITE_URL } from '@/lib/site';
import type { Product } from '@/lib/types';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

function formatSyncDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product not found' };

  return {
    title: product.name,
    description: product.shortRecommendation,
    openGraph: {
      type: 'website',
      title: `${product.name} — ${formatINR(product.priceInr)} on ${SITE_URL}`,
      description: product.shortRecommendation,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = getRelatedProducts(product, 4);
  const relatedGuides = getRelatedGuides(product.category, '', 3);
  const categoryName = getCategoryName(product.category);
  const comparisons = getComparisonsForProduct(product.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: `${SITE_URL}/products/${product.slug}`,
    description: product.description,
    brand: { '@type': 'Brand', name: product.brand },
    category: categoryName,
    review: product.reviews.map((review) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: review.author },
      reviewBody: review.detail,
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.ratingCount,
      bestRating: 5,
    },
    offers: {
      '@type': 'Offer',
      price: product.priceInr,
      priceCurrency: 'INR',
      url: product.deals[0]?.url ?? `${SITE_URL}/products/${product.slug}`,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div className="py-10 sm:py-14">
      <div className="container-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: categoryName, href: `/products?category=${product.category}` },
            { label: product.name },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
              <img
                src={product.image ?? productPlaceholder(product.name, product.category)}
                alt={`${product.name} — product image`}
                width={640}
                height={480}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/products?category=${product.category}`}
                className="chip"
              >
                {categoryName}
              </Link>
              <span className="chip">{product.brand}</span>
            </div>

            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              {product.shortRecommendation}.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <RatingStars rating={product.rating} showValue />
              <span className="text-xs text-slate-500">
                {product.ratingCount.toLocaleString('en-IN')} ratings
              </span>
              <ScoreBadge score={product.uniSmartScore} />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <PriceBlock
                price={product.priceInr}
                previousPrice={product.previousPriceInr}
                size="lg"
                showSavings
              />
              {product.priceUpdatedOn && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  Live price synced from Amazon ·{' '}
                  {formatSyncDate(product.priceUpdatedOn)}
                </p>
              )}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <DealButton
                  href={product.deals[0]?.url ?? '#'}
                  size="lg"
                  label="View Deal"
                  note="Opens the merchant website"
                  className="flex-1"
                />
                <CompareButton
                  productId={product.id}
                  variant="full"
                  className="sm:w-auto"
                />
              </div>
            </div>

            <div className="mt-8">
              <h2 className="font-display text-xl font-bold text-slate-900">
                Description
              </h2>
              <p className="mt-3 leading-relaxed text-slate-600">
                {product.description}
              </p>
            </div>

            {comparisons.length > 0 && (
              <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
                <h2 className="flex items-center gap-2 font-display text-sm font-bold text-slate-900">
                  <Swords className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                  Head-to-head comparison
                </h2>
                <ul className="mt-3 space-y-2">
                  {comparisons.map((comparison) => {
                    const otherId = comparison.productIds.find((id) => id !== product.id);
                    const other = otherId ? getProductBySlug(otherId) : undefined;
                    if (!other) return null;
                    return (
                      <li key={comparison.id}>
                        <Link
                          href={`/vs/${comparison.slug}`}
                          className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition-shadow hover:shadow-card"
                        >
                          <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">
                            {product.brand} vs {other.brand}
                          </span>
                          <span className="text-xs text-slate-400">
                            see verdict
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <section className="lg:col-span-3" aria-labelledby="specs-heading">
            <h2 id="specs-heading" className="font-display text-xl font-bold text-slate-900">
              Specifications
            </h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <tbody>
                  {product.specs.map((spec, index) => (
                    <tr
                      key={spec.label}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
                    >
                      <th
                        scope="row"
                        className="w-2/5 px-5 py-3.5 text-left font-medium text-slate-500"
                      >
                        {spec.label}
                      </th>
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="lg:col-span-2" aria-labelledby="pros-cons-heading">
            <h2 id="pros-cons-heading" className="font-display text-xl font-bold text-slate-900">
              Pros &amp; cons
            </h2>
            <div className="mt-4 grid gap-4">
              <div className="rounded-2xl rounded-tl-none border border-emerald-100 bg-emerald-50/60 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                  <ThumbsUp className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  Pros
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {product.pros.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl rounded-tl-none border border-rose-100 bg-rose-50/60 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-rose-900">
                  <ThumbsDown className="h-4 w-4 text-rose-500" aria-hidden="true" />
                  Cons
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {product.cons.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                      <MinusCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <section className="card p-6" aria-labelledby="bestfor-heading">
            <h2 id="bestfor-heading" className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
              <BadgeCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              Best for
            </h2>
            <ul className="mt-4 space-y-2.5">
              {product.bestFor.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section className="card p-6" aria-labelledby="notideal-heading">
            <h2 id="notideal-heading" className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
              <ShoppingBag className="h-5 w-5 text-rose-500" aria-hidden="true" />
              Not ideal for
            </h2>
            <ul className="mt-4 space-y-2.5">
              {product.notIdealFor.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <DealsSection product={product} />
        <ReviewsSection product={product} />

        <section className="mt-16" aria-labelledby="related-products-heading">
          <SectionHeading
            eyebrow="More like this"
            title="Related products"
            href="/products"
          />
          <ProductGrid products={relatedProducts} skeletonCount={4} className="xl:grid-cols-4" />
        </section>

        {relatedGuides.length > 0 && (
          <section className="mt-16" aria-labelledby="related-guides-heading">
            <SectionHeading
              eyebrow="Keep reading"
              title="Related buying guides"
              href="/guides"
            />
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[
                ...GUIDES.filter((g) => relatedGuides.some((rg) => rg.id === g.id)),
              ]
                .slice(0, 3)
                .map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function DealsSection({ product }: { product: Product }) {
  return (
    <section className="mt-12" aria-labelledby="deals-heading">
      <h2 id="deals-heading" className="font-display text-xl font-bold text-slate-900">
        Available deals
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {product.deals.map((deal) => (
          <li key={deal.retailer}>
            <div className="card flex h-full flex-col gap-3 p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-sm font-bold text-slate-900">
                  {retailerName(deal.retailer)}
                </span>
                {deal.priceInr !== undefined && (
                  <span className="text-sm font-semibold text-slate-500">
                    {formatINR(deal.priceInr)}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600">{deal.note}</p>
              <DealButton
                href={deal.url}
                size="sm"
                label={`View on ${retailerName(deal.retailer)}`}
                className="mt-auto w-full"
              />
            </div>
          </li>
        ))}
      </ul>
      <Faq
        items={[
          {
            q: 'Do these prices include shipping and taxes?',
            a: 'Prices shown are real merchant prices at the time of writing. Final cost, including shipping and GST, is decided by the merchant when you click through.',
          },
          {
            q: 'Why do deals differ between retailers?',
            a: 'Different merchants run different offers — bank discounts, exchange bonuses and flash sales. Compare a couple before buying.',
          },
        ]}
      />
    </section>
  );
}

function ReviewsSection({ product }: { product: Product }) {
  return (
    <section className="mt-12" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="font-display text-xl font-bold text-slate-900">
        What students say
      </h2>
      <p className="mt-1 text-xs text-slate-400">Editorial impressions from our research — not customer reviews.</p>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {product.reviews.map((review) => (
          <li key={review.author}>
            <figure className="card h-full p-5">
              <RatingStars rating={5} />
              <blockquote className="mt-3 text-sm leading-relaxed text-slate-600">
                “{review.detail}”
              </blockquote>
              <figcaption className="mt-3 text-xs font-semibold text-slate-400">
                {review.author}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}