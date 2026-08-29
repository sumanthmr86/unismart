import type { Metadata } from 'next';
import { Eye, HandHeart, HeartHandshake, ShieldCheck, Users } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'About UniSmart',
  description:
    'UniSmart is student product discovery for India — helping college students find useful products, compare them and discover good deals.',
};

const values = [
  {
    icon: Eye,
    title: 'Honest curation',
    description:
      'We only feature products we would buy ourselves. No paid placement, no sponsored “best” lists dressed up as reviews.',
  },
  {
    icon: Users,
    title: 'Built for students',
    description:
      'Every guide is written for Indian campuses — hostel power cuts, monsoon commutes and student budgets included.',
  },
  {
    icon: HandHeart,
    title: 'Transparent by design',
    description:
      'UniSmart is a discovery site, not a store. We make money only from merchant referral fees, clearly disclosed.',
  },
  {
    icon: ShieldCheck,
    title: 'Your money stays yours',
    description:
      'No accounts, no checkout, no payment details. You compare here, and buy wherever you want.',
  },
];

const steps = [
  {
    title: 'We research the market',
    description:
      'Each product starts with specs, pricing history and what real students complain about — before we ever mention it.',
  },
  {
    title: 'We score it honestly',
    description:
      'The UniSmart Score weighs value, reliability and suitability for student life — not how much an ad costs.',
  },
  {
    title: 'We show you the deal',
    description:
      'Every deal button goes straight to the real merchant listing, so you can click, compare retailers and decide with full control.',
  },
];

export default function AboutPage() {
  return (
    <div className="py-10 sm:py-14">
      <div className="container-page">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'About' },
          ]}
        />

        <PageHero
          eyebrow="About UniSmart"
          title="Smart choices for every student budget"
          description="We help Indian college students and young professionals discover products worth buying, compare options honestly, and find real student-friendly deals."
        />

        <section className="grid gap-10 lg:grid-cols-2">
          <div className="prose-unismart">
            <h2>Why UniSmart exists</h2>
            <p>
              Between flash sale marketing, fake discounts and hundreds of
              “under ₹1500” lists written by people who never held the product,
              buying gear for college has become a trap. Students overpay, buy
              the wrong spec, or skip a genuinely useful purchase because they
              don’t trust the sources.
            </p>
            <p>
              UniSmart cuts through that. We treat product discovery the way a
              good senior would explain it to a fresher: here’s what to look
              for, here’s what to avoid, and here’s the honest best pick for
              your budget.
            </p>
            <p>
              <strong>Important:</strong> UniSmart is not an e-commerce store.
              We don’t sell products, process payments, hold inventory or run a
              checkout. We research, compare and point you to merchants — so the
              final purchase decision always stays with you.
            </p>
            <h2>How we pick what you see</h2>
            <ol>
              {steps.map((step) => (
                <li key={step.title}>
                  <strong>{step.title}.</strong> {step.description}
                </li>
              ))}
            </ol>
            <p>
              Prices on UniSmart are the live merchant prices we captured at the
              time of publishing. Since deals change daily, always confirm the
              final price, shipping and warranty on the retailer’s page before
              you buy.
            </p>
          </div>

          <div className="space-y-4">
            {values.map(({ icon: Icon, title, description }) => (
              <article key={title} className="card flex gap-4 p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl brand-gradient text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {description}
                  </p>
                </div>
              </article>
            ))}
            <article className="rounded-2xl bg-slate-900 p-6 text-slate-300">
              <HeartHandshake className="h-6 w-6 text-indigo-400" aria-hidden="true" />
              <p className="mt-3 leading-relaxed">
                If UniSmart saves even one student from a bad purchase, this
                project has already done its job. <strong className="text-white">Shop smart, students.</strong>
              </p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}