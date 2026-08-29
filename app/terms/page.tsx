import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms of use',
  description:
    'The terms that govern your use of UniSmart — a product discovery and deals website for Indian students.',
  robots: { index: true, follow: true },
};

const sections = [
  {
    heading: 'What UniSmart is',
    body: [
      'UniSmart (unismart.store) is a product discovery and comparison website for Indian students and young professionals. It is not an e-commerce store. UniSmart does not sell products, handle payments, manage inventory or process orders.',
      'All product information, prices, ratings and reviews shown on this website are demonstration placeholders. Real, verified data will replace these in future releases.',
    ],
  },
  {
    heading: 'Purchases and merchants',
    body: [
      'When you tap “View Deal,” you leave UniSmart and visit an external merchant. Any order, payment, return, warranty or dispute is between you and that merchant. UniSmart is not a party to any purchase.',
    ],
  },
  {
    heading: 'Information accuracy',
    body: [
      'We work hard to keep product data accurate, but prices, availability and specifications change constantly on merchant sites. Always confirm details — price, GST, shipping, warranty — on the merchant’s website before buying.',
      'On the current demo build, prices and discounts are illustrative and may not reflect any real offer.',
    ],
  },
  {
    heading: 'Demo disclaimer',
    body: [
      'This is a demonstration build. Buying guides, comparisons and “Top picks” are sample content intended to demonstrate the product experience, not financial or product advice.',
    ],
  },
  {
    heading: 'No professional advice',
    body: [
      'Content on UniSmart is general information, not professional or purchasing advice. Your decisions are your own.',
    ],
  },
  {
    heading: 'Acceptable use',
    body: [
      'Use UniSmart for lawful purposes only. Do not attempt to abuse, scrape at scale, or interfere with the website or its infrastructure.',
    ],
  },
  {
    heading: 'Changes to these terms',
    body: [
      'We may update these terms as UniSmart grows. Continued use of the website after changes means you accept the updated terms.',
    ],
  },
  {
    heading: 'Contact',
    body: [
      'For questions about these terms, email hello@unismart.store.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="py-10 sm:py-14">
      <div className="container-page">
        <div className="max-w-3xl">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Terms of use' },
            ]}
          />

          <PageHero
            eyebrow="Legal"
            title="Terms of use"
            description="Last updated: August 2026. Clear rules for using UniSmart."
          />

          <div className="prose-unismart">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}