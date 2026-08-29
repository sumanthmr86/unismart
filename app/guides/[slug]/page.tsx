import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, BookOpenText, CheckCircle2, Clock, Lightbulb } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Faq } from '@/components/ui/Faq';
import { GuideCard } from '@/components/GuideCard';
import { GuideProductRef } from '@/components/GuideProductRef';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { DealButton } from '@/components/DealButton';
import { PriceBlock } from '@/components/ui/PriceBlock';
import { getGuideBySlug } from '@/data/guides';
import { GUIDES } from '@/data/guides';
import { getCategoryName } from '@/data/categories';
import { getProductById } from '@/data/products';
import { productPlaceholder } from '@/lib/placeholder';

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: 'Guide not found' };

  return {
    title: guide.title,
    description: guide.excerpt,
    openGraph: {
      type: 'article',
      title: `${guide.title} — UniSmart buying guide`,
      description: guide.excerpt,
      publishedTime: guide.publishedOn,
    },
  };
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const relatedGuides = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);
  const categoryName = getCategoryName(guide.category);
  const publishedDate = new Date(guide.publishedOn).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <div className="py-10 sm:py-14">
      <div className="container-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Buying guides', href: '/guides' },
            { label: guide.title },
          ]}
        />

        <header className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/products?category=${guide.category}`} className="chip">
              {categoryName}
            </Link>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <BookOpenText className="h-3.5 w-3.5" aria-hidden="true" />
              Buying guide
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {guide.readMinutes} min read
            </span>
            <span className="text-xs text-slate-400">{publishedDate}</span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            {guide.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            {guide.intro}
          </p>
        </header>

        <section className="mt-12" aria-labelledby="picks-heading">
          <h2
            id="picks-heading"
            className="font-display text-2xl font-bold tracking-tight text-slate-900"
          >
            Our picks at a glance
          </h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {guide.picks.map((pick) => {
              const product = getProductById(pick.productId);
              if (!product) return null;
              return (
                <li key={pick.label} className="card flex flex-col gap-4 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                      {pick.label}
                    </span>
                    <ScoreBadge score={product.uniSmartScore} compact />
                  </div>
                  <Link href={`/products/${product.slug}`} className="group flex gap-3">
                    <img
                      src={product.image ?? productPlaceholder(product.name, product.category)}
                      alt=""
                      className="h-14 w-[68px] shrink-0 rounded-xl object-cover"
                    />
                    <span className="min-w-0">
                      <span className="line-clamp-2 block text-sm font-bold text-slate-900 group-hover:text-indigo-700">
                        {product.name}
                      </span>
                      <span className="mt-1 block text-sm text-slate-500">
                        {pick.reason}
                      </span>
                    </span>
                  </Link>
                  <PriceBlock
                    price={product.priceInr}
                    previousPrice={product.previousPriceInr}
                    size="sm"
                  />
                  <DealButton
                    href={product.deals[0]?.url ?? '#'}
                    size="sm"
                    label={`View Deal · ${getCategoryName(product.category)}`}
                    className="w-full"
                  />
                </li>
              );
            })}
          </ul>
        </section>

        <div className="mt-14 grid gap-12 lg:grid-cols-3">
          <article className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
              {guide.title}
            </h2>
            {guide.sections.map((section, index) => (
              <section
                key={section.heading}
                id={section.heading.toLowerCase().replace(/\s+/g, '-')}
                className="mt-10 scroll-mt-24"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full brand-gradient text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="font-display text-xl font-bold tracking-tight text-slate-900">
                    {section.heading}
                  </h3>
                </div>
                <p className="mt-3 leading-relaxed text-slate-600">
                  {section.body}
                </p>
                {section.productIds && section.productIds.length > 0 && (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {section.productIds.map((productId) => (
                      <GuideProductRef key={productId} productId={productId} />
                    ))}
                  </div>
                )}
              </section>
            ))}

            <section className="mt-10" aria-labelledby="tips-heading">
              <h3
                id="tips-heading"
                className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-slate-900"
              >
                <Lightbulb className="h-5 w-5 text-amber-500" aria-hidden="true" />
                Money-saving tips
              </h3>
              <ul className="mt-4 space-y-3">
                {guide.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2.5 text-slate-600">
                    <CheckCircle2
                      className="mt-1 h-4 w-4 shrink-0 text-emerald-500"
                      aria-hidden="true"
                    />
                    {tip}
                  </li>
                ))}
              </ul>
            </section>
          </article>

          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <Faq items={guide.faq} title="Quick answers" />
              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-2">
                  <BookOpenText className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                  <span className="text-sm font-bold text-slate-900">
                    In this guide
                  </span>
                </div>
                <ul className="mt-3 space-y-2">
                  {guide.sections.map((section) => (
                    <li key={section.heading}>
                      <a
                        href={`#${section.heading.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-sm text-slate-600 transition hover:text-indigo-600"
                      >
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-16" aria-labelledby="more-guides-heading">
          <div className="mb-6 flex items-center justify-between">
            <h2
              id="more-guides-heading"
              className="font-display text-2xl font-bold tracking-tight text-slate-900"
            >
              Keep reading
            </h2>
            <Link href="/guides" className="btn-link">
              All guides
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {relatedGuides.map((related) => (
              <GuideCard key={related.id} guide={related} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}