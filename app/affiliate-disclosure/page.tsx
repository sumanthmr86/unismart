import type { Metadata } from 'next';
import { HandCoins, Info, Scale } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { RETAILERS } from '@/lib/affiliate';

export const metadata: Metadata = {
  title: 'Affiliate disclosure',
  description:
    'How UniSmart makes money through merchant referral links — and how that never changes what we recommend.',
  robots: { index: true, follow: true },
};

const facts = [
  {
    icon: Scale,
    title: 'Recommendations stay independent',
    body: 'Higher commissions never move a product higher on a page or into a guide. If we stop believing in a product, it stops appearing here — regardless of any commercial relationship.',
  },
  {
    icon: Info,
    title: 'Prices you see are still your prices',
    body: 'You never pay more because you arrived via UniSmart. Merchant paid you a referral fee for sending you there — the amount they would otherwise spend on ads.',
  },
  {
    icon: HandCoins,
    title: 'Funding keeps everything free',
    body: 'Referral income is our business model. It keeps UniSmart free for students with no paywalls, no sponsored “best of” lists, and no checkout anywhere on the site.',
  },
];

export default function AffiliateDisclosurePage() {
  return (
    <div className="py-10 sm:py-14">
      <div className="container-page">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Affiliate disclosure' },
          ]}
        />

        <PageHero
          eyebrow="Transparency"
          title="Affiliate disclosure"
          description="We believe in radical honesty about money. Here’s exactly how UniSmart makes money — and why it never changes our recommendations."
        />

        <div className="max-w-3xl space-y-8">
          <section className="prose-unismart">
            <h2>How UniSmart makes money</h2>
            <p>
              UniSmart is a free product discovery and comparison website. We do
              not sell anything. Instead, we participate in merchant affiliate
              programs: when you click a “View Deal” button and make a purchase
              on the merchant’s website, the merchant may pay UniSmart a small
              commission. This fee never increases the price you pay.
            </p>
            <p>
              On this demonstration build, all deal links are demo URLs. Real
              affiliate tracking arrives in a later stage — and this page will
              be updated with the exact programs and merchants we work with.
            </p>
          </section>

          <div className="grid gap-4 sm:grid-cols-3">
            {facts.map(({ icon: Icon, title, body }) => (
              <article key={title} className="card p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-sm font-bold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
              </article>
            ))}
          </div>

          <section className="prose-unismart">
            <h2>Do we work with sponsored placements?</h2>
            <p>
              Not at the moment, and not planned. If this ever changes, sponsored
              content will be clearly labelled “Sponsored,” never disguised as an
              editorial recommendation.
            </p>
            <h2>Where do our links go?</h2>
            <p>
              Affiliate links route through a UniSmart short link (<code>/go/…</code>)
              so we can track referrals without changing the merchant experience.
              Merchant program publishers are listed below:
            </p>
            <ul>
              {RETAILERS.map((retailer) => (
                <li key={retailer.id}>
                  <strong>{retailer.name}</strong> — {retailer.domain}
                </li>
              ))}
            </ul>
            <p>
              Again, on this build the links are placeholders. When live, this
              disclosure will always reflect the real list of partner programs.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}