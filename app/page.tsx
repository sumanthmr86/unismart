import { BellRing, Flame, Scale, Search, ShieldCheck, Sparkles, Swords, TrendingDown, Trophy } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { BuyingGuide } from '@/lib/types';
import { SearchBar } from '@/components/SearchBar';
import { ProductGrid } from '@/components/ProductGrid';
import { DealsCarousel } from '@/components/DealsCarousel';
import { CategoryCard } from '@/components/CategoryCard';
import { GuideCard } from '@/components/GuideCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Newsletter } from '@/components/Newsletter';
import { CATEGORIES } from '@/data/categories';
import { getCategoryName } from '@/data/categories';
import { COMPARISONS } from '@/data/comparisons';
import { GUIDES } from '@/data/guides';
import { ROUNDUPS } from '@/data/roundups';
import { getProductBySlug } from '@/data/products';
import { EXAMPLE_SEARCHES, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';
import { getFeaturedDeals, getFeaturedProducts } from '@/lib/products';
import { getDealsPage } from '@/lib/products';
import { discountPercent, formatINR, savingsInr } from '@/lib/format';
import { productPlaceholder } from '@/lib/placeholder';
import { isCuratedProduct } from '@/data/products';

export const metadata: Metadata = {
  title: `${SITE_NAME} — Smart choices. Better prices.`,
  description: SITE_DESCRIPTION,
};

const trustItems = [
  { icon: ShieldCheck, label: 'We check deals before we share them' },
  { icon: Scale, label: 'Compare before you buy' },
  { icon: BellRing, label: 'No checkout, no payments' },
];

const steps = [
  {
    icon: Search,
    title: 'Discover',
    description:
      'Find products worth buying — researched and curated for students, not stuffed with every option on the internet.',
  },
  {
    icon: Scale,
    title: 'Compare',
    description:
      'Put products side by side on specs, price and our UniSmart Score so the best pick is obvious.',
  },
  {
    icon: TrendingDown,
    title: 'Save',
    description:
      'Head to the merchant through a deal link and spend less — without checkout, payments or hidden fees on UniSmart.',
  },
];

export default function HomePage() {
  const featured = getFeaturedProducts().slice(0, 8);
  const deals = getFeaturedDeals().filter(isCuratedProduct).slice(0, 8);
  const guides = GUIDES.slice(0, 6);
  const comparisons = COMPARISONS.slice(0, 3);

  return (
    <>
      <HeroSection />
      <DealOfTheDaySection />
      <CategoriesSection />
      <FeaturedProductsSection products={featured} />
      <DealsCarousel
        products={deals}
        headline={{
          eyebrow: "Today's best deals",
          title: 'Deals worth a second look',
          subtitle:
            'Steep discounts on products we would still recommend at full price — auto-rotating all day.',
          href: '/deals',
        }}
      />
      <ComparisonsSection comparisons={comparisons} />
      <BestPicksSection />
      <GuidesSection guides={guides} />
      <HowItWorksSection />
      <NewsletterSection />
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(60rem 30rem at 15% -10%, rgb(79 70 229 / 0.35), transparent 60%), radial-gradient(50rem 26rem at 90% 10%, rgb(217 70 239 / 0.22), transparent 55%), radial-gradient(40rem 30rem at 50% 110%, rgb(79 70 229 / 0.18), transparent 60%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgb(255 255 255 / 0.15) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.15) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(70rem 40rem at 50% 0%, black, transparent)',
        }}
      />
      <div className="container-page relative pb-20 pt-16 sm:pt-24 lg:pb-28 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-indigo-200 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Student product discovery for India
          </span>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Smart choices.
            <br />
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              Better prices.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Discover products worth buying, compare your options, and find
            student-friendly deals without wasting your money.
          </p>

          <div className="mx-auto mt-9 max-w-2xl">
            <SearchBar variant="hero" />
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-medium text-slate-400">Try:</span>
              {EXAMPLE_SEARCHES.map((example) => (
                <a
                  key={example}
                  href={`/products?q=${encodeURIComponent(example)}`}
                  className="chip border-white/15 bg-white/5 text-slate-300 hover:border-indigo-400/60 hover:text-white"
                >
                  {example}
                </a>
              ))}
            </div>
          </div>

          <ul className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {trustItems.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-slate-300">
                <Icon className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function DealOfTheDaySection() {
  const deal = getDealsPage().find((d) => {
    const pct = discountPercent(d.priceInr, d.previousPriceInr);
    return pct >= 18 && pct <= 65;
  });
  if (!deal) return null;
  const discount = discountPercent(deal.priceInr, deal.previousPriceInr);
  const savings = savingsInr(deal.priceInr, deal.previousPriceInr);
  return (
    <section className="container-page -mt-4 sm:-mt-6" aria-labelledby="deal-of-day-heading">
      <Link
        href={`/products/${deal.slug}`}
        className="card group relative block overflow-hidden border-0 bg-slate-950 text-white shadow-elevate"
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(42rem 18rem at 8% 0%, rgb(217 70 239 / 0.25), transparent 55%), radial-gradient(36rem 20rem at 95% 100%, rgb(79 70 229 / 0.35), transparent 55%)',
          }}
        />
        <div className="relative grid gap-6 p-6 sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-8 sm:p-8">
          <div className="overflow-hidden rounded-2xl bg-white/10">
            <img
              src={deal.image ?? productPlaceholder(deal.name, deal.category)}
              alt=""
              width={288}
              height={216}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-rose-300">
                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                Deal of the day
              </span>
              <h2
                id="deal-of-day-heading"
                className="mt-3 font-display text-xl font-bold leading-snug tracking-tight sm:text-2xl"
              >
                {deal.name}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-300">
                {getCategoryName(deal.category)} · {deal.shortRecommendation}
              </p>
            </div>
            <div className="shrink-0 text-left sm:text-right">
              <p className="text-2xl font-extrabold text-emerald-300">
                {formatINR(deal.priceInr)}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                <span className="line-through">
                  {formatINR(deal.previousPriceInr)}
                </span>{' '}
                <span className="font-semibold text-rose-300">
                  {discount}% off
                </span>
              </p>
              <p className="mt-1 text-xs font-medium text-slate-300">
                You save {formatINR(savings)}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-900 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                View deal
                <TrendingDown className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="categories-heading">
      <div className="container-page">
        <SectionHeading
          eyebrow="Shop by category"
          title="Everything students actually look for"
          subtitle="Ten categories, curated around real student life — from hostel essentials to study setups."
          href="/products"
        />
        <ul className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-5">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function FeaturedProductsSection({
  products,
}: {
  products: ReturnType<typeof getFeaturedProducts>;
}) {
  return (
    <section
      className="bg-slate-50 py-16 sm:py-20"
      aria-labelledby="featured-heading"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow="Featured products"
          title="Student favourites, hand-picked"
          subtitle="High UniSmart Scores across price points — refreshed regularly."
          href="/products"
        />
        <ProductGrid products={products} />
      </div>
    </section>
  );
}

function ComparisonsSection({
  comparisons,
}: {
  comparisons: (typeof COMPARISONS)[number][];
}) {
  const items = comparisons
    .map((comparison) => {
      const first = getProductBySlug(comparison.productIds[0]);
      const second = getProductBySlug(comparison.productIds[1]);
      return first && second ? { comparison, first, second } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <section
      className="bg-slate-50 py-16 sm:py-20"
      aria-labelledby="comparisons-heading"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow="Head-to-head"
          title="Settling the debates"
          subtitle="The product arguments every hostel has — settled side by side with real specs and live prices."
          href="/vs"
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map(({ comparison, first, second }) => (
            <Link
              key={comparison.id}
              href={`/vs/${comparison.slug}`}
              className="card group flex h-full flex-col p-5 transition-shadow hover:shadow-elevate"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-indigo-600">
                <Swords className="h-4 w-4" aria-hidden="true" />
                {first.brand} vs {second.brand}
              </span>
              <h3 className="mt-2 font-display text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-indigo-600">
                {first.name} vs {second.name}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                {comparison.metaDescription}
              </p>
              <p className="mt-3 text-xs font-semibold text-indigo-600">
                {comparison.picks[0]?.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function BestPicksSection() {
  const roundups = ROUNDUPS.slice(0, 6);
  return (
    <section className="py-16 sm:py-20" aria-labelledby="best-picks-heading">
      <div className="container-page">
        <SectionHeading
          eyebrow="Best-of roundups"
          title="Best picks in every budget"
          subtitle="Top earbuds, laptops, smartwatches and more — ranked by UniSmart Score with live Amazon prices."
          href="/best"
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {roundups.map((roundup) => (
            <Link
              key={roundup.slug}
              href={`/best/${roundup.slug}`}
              className="card group flex h-full flex-col p-5 transition-shadow hover:shadow-elevate"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-indigo-600">
                <Trophy className="h-4 w-4" aria-hidden="true" />
                {roundup.maxPrice !== undefined
                  ? `Under ₹${roundup.maxPrice.toLocaleString('en-IN')}`
                  : 'Top picks'}
              </span>
              <h3 className="mt-2 font-display text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-indigo-600">
                {roundup.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                {roundup.metaDescription}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuidesSection({
  guides,
}: {
  guides: BuyingGuide[];
}) {
  return (
    <section className="bg-slate-50 py-16 sm:py-20" aria-labelledby="guides-heading">
      <div className="container-page">
        <SectionHeading
          eyebrow="Buying guides"
          title="Buy once, buy right"
          subtitle="Plain-language guides that tell you what to buy, why, and what to skip."
          href="/guides"
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="how-heading">
      <div className="container-page">
        <SectionHeading
          eyebrow="How UniSmart works"
          title="Discover. Compare. Save."
          subtitle="No account, no checkout — just better decisions in a few minutes."
        />
        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="card relative p-6 sm:p-7">
              <span className="absolute right-6 top-6 font-display text-4xl font-extrabold text-slate-100">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl brand-gradient text-white shadow-elevate">
                <step.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="container-page pb-4" aria-labelledby="newsletter-heading">
      <div className="relative overflow-hidden rounded-3xl brand-gradient px-6 py-14 text-white sm:px-12">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(40rem 20rem at 85% -20%, rgb(255 255 255 / 0.25), transparent 60%)',
          }}
        />
        <div className="relative mx-auto max-w-2xl text-center">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white">
            <BellRing className="h-3.5 w-3.5" aria-hidden="true" />
            Free weekly briefing
          </span>
          <h2 className="mt-5 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Get the best student deals in your inbox
          </h2>
          <p className="mx-auto mt-3 max-w-lg px-2 text-sm text-white/80 sm:text-base">
            One short email each week: the real deals, new buying guides and
            money-saving tips for campus life.
          </p>
          <div className="mx-auto mt-7 max-w-lg">
            <Newsletter compact />
          </div>
          <p className="mt-3 text-xs text-white/60">
            No spam. Unsubscribe in one click any time.
          </p>
        </div>
      </div>
    </section>
  );
}