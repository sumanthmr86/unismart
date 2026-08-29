import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BadgeCheck, CheckCircle2, RefreshCcw, Swords } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Faq } from '@/components/ui/Faq';
import { PageHero } from '@/components/ui/PageHero';
import { ProductCard } from '@/components/ProductCard';
import { getCategoryName } from '@/data/categories';
import {
  ROUNDUPS,
  getRoundupBySlug,
  getRoundupPicks,
  type Roundup,
} from '@/data/roundups';
import type { Product } from '@/lib/types';
import { SITE_NAME, SITE_URL } from '@/lib/site';

interface BestPicksPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ROUNDUPS.map((roundup) => ({ slug: roundup.slug }));
}

export async function generateMetadata({
  params,
}: BestPicksPageProps): Promise<Metadata> {
  const { slug } = await params;
  const roundup = getRoundupBySlug(slug);
  if (!roundup) return { title: 'Not found' };

  return {
    title: roundup.metaTitle,
    description: roundup.metaDescription,
    openGraph: {
      type: 'website',
      title: roundup.metaTitle,
      description: roundup.metaDescription,
      url: `${SITE_URL}/best/${roundup.slug}`,
    },
  };
}

function categoryLabel(roundup: Roundup): string {
  return roundup.category === 'all'
    ? 'Best picks'
    : `Best ${getCategoryName(roundup.category)}`;
}

function buildFaq(roundup: Roundup, picks: Product[]) {
  const top = picks[0];
  const capNote =
    roundup.maxPrice !== undefined
      ? `to ₹${roundup.maxPrice.toLocaleString('en-IN')}`
      : 'across a range of budgets';

  return [
    {
      q: `Is this ${roundup.title.toLowerCase()} list updated?`,
      a: `Yes. Every ${SITE_NAME} roundup re-ranks live on every deploy: prices are pulled straight from Amazon India several times a day and each pick is re-scored, so the list reflects what you can actually buy today ${capNote}.`,
    },
    {
      q: top
        ? `Why is the ${top.name.split(',')[0]} ranked first above the others?`
        : 'Why did these products win over the rest?',
      a: top
        ? `It scored the highest on our UniSmart Score, which balances value for money, Amazon rating, community feedback and fit for the purpose of this roundup. A higher rank here does not always mean “most expensive” — it means the one we would buy first.`
        : `These picks scored highest on our UniSmart Score, which balances value for money, Amazon rating, community feedback and fit for this roundup. A higher rank means the one we would buy first.`,
    },
    {
      q: roundup.maxPrice !== undefined
        ? `Should I spend more than ₹${roundup.maxPrice.toLocaleString('en-IN')}?`
        : 'Is a higher budget always better?',
      a: `Sometimes. Above this budget you usually get better build quality, battery and features — but for most students the range this list covers maps to genuinely good products, which is exactly why the roundup is capped the way it is. If you can stretch comfortably, use the watch-list on one of our product pages instead of buying blindly.`,
    },
    {
      q: 'Does UniSmart earn money from these picks?',
      a: `Yes — when you buy through a deal link, Amazon pays us a small commission at no extra cost to you. It never changes a product’s rank: our scores are driven by price, rating and value, not by the commission. Full details are in our affiliate disclosure.`,
    },
  ];
}

export default async function BestPicksDetailPage({ params }: BestPicksPageProps) {
  const { slug } = await params;
  const roundup = getRoundupBySlug(slug);
  if (!roundup) notFound();

  const picks = getRoundupPicks(roundup);
  const faq = buildFaq(roundup, picks);

  const related = ROUNDUPS.filter((r) => r.slug !== roundup.slug)
    .sort((a, b) => {
      const aSame = a.category === roundup.category;
      const bSame = b.category === roundup.category;
      return Number(bSame) - Number(aSame);
    })
    .slice(0, 6);

  const category = roundup.category === 'all' ? null : getCategoryName(roundup.category);

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: roundup.metaTitle,
    description: roundup.metaDescription,
    url: `${SITE_URL}/best/${roundup.slug}`,
    itemListElement: picks.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/products/${product.slug}`,
      name: product.name,
      item: {
        '@type': 'Product',
        name: product.name,
        image: product.image,
        brand: { '@type': 'Brand', name: product.brand },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: product.priceInr,
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };

  return (
    <div className="py-10 sm:py-14">
      <div className="container-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />

        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Best picks', href: '/best' },
            { label: roundup.title },
          ]}
        />

        <header>
          <PageHero
            eyebrow={categoryLabel(roundup)}
            title={roundup.title}
            description={roundup.intro}
          />
          <p className="-mt-6 mb-10 inline-flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Prices are live from Amazon India and refresh several times a day.
            {roundup.maxPrice !== undefined && (
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700">
                Budget cap: ₹{roundup.maxPrice.toLocaleString('en-IN')}
              </span>
            )}
          </p>
        </header>

        <section aria-labelledby="ranked-list-heading">
          <h2
            id="ranked-list-heading"
            className="sr-only"
          >
            Ranked picks
          </h2>
          <ol className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 pt-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {picks.map((product, index) => {
              const isTop = index < 3;
              return (
                <li key={product.id} className="relative pt-3">
                  <span
                    className={`absolute left-2 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow ${
                      isTop ? 'brand-gradient text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <ProductCard product={product} className="h-full" />
                </li>
              );
            })}
          </ol>
        </section>

        {roundup.note && (
          <section
            className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8"
            aria-labelledby="how-we-ranked-heading"
          >
            <h2
              id="how-we-ranked-heading"
              className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-slate-900"
            >
              <BadgeCheck className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              How we ranked these
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600">{roundup.note}</p>
            <ul className="mt-4 grid gap-2.5 text-sm text-slate-600 sm:grid-cols-2">
              {[
                'Value for money against the budget cap',
                'Amazon rating and verified buyer count',
                'Fit for the purpose — not just specs on paper',
                'Real-world student usage and feedback',
              ].map((criterion) => (
                <li key={criterion} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                  {criterion}
                </li>
              ))}
            </ul>
          </section>
        )}

        <Faq items={faq} />

        <section className="mt-16" aria-labelledby="more-roundups-heading">
          <h2
            id="more-roundups-heading"
            className="font-display text-2xl font-bold tracking-tight text-slate-900"
          >
            More best picks
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/best/${item.slug}`}
                  className="card group flex h-full items-start justify-between gap-4 p-4 transition-shadow hover:shadow-elevate"
                >
                  <span className="min-w-0">
                    <span className="line-clamp-2 block text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                      {item.title}
                    </span>
                    {item.maxPrice !== undefined && (
                      <span className="mt-1.5 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                        Under ₹{item.maxPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </span>
                  <Swords className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 group-hover:text-indigo-500" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {category && (
          <p className="mt-8 text-sm text-slate-500">
            Prefer to filter manually?{' '}
            <Link
              href={`/products?category=${roundup.category}`}
              className="font-semibold text-indigo-600 hover:underline"
            >
              Browse every {category.toLowerCase()}
            </Link>{' '}
            or{' '}
            <Link href="/best" className="font-semibold text-indigo-600 hover:underline">
              see all roundups
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}