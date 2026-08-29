import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description:
    'How UniSmart handles (and does not handle) your data. Short version: we collect almost nothing.',
  robots: { index: true, follow: true },
};

const sections = [
  {
    heading: 'The short version',
    body: [
      'We care about your privacy, and today UniSmart collects almost nothing. There is no user account system, no login, no transaction processing and no payment data anywhere in UniSmart.',
      'There are no analytics scripts running and no marketing trackers being served on this website.',
    ],
  },
  {
    heading: 'Data this build collects',
    body: [
      'Nothing that leaves your device. Product selection and compare lists are stored in your browser’s local storage so your session feels cohesive — this stays on your device and is never sent to a server.',
      'If you subscribe to the newsletter or submit the contact form, your message is received and read, and we reply by email. We never sell or share your details.',
    ],
  },
  {
    heading: 'What the future build will collect',
    body: [
      'When UniSmart adds accounts, affiliate tracking and contact forms, this page will be updated to explain exactly what is collected, why, and how you can request deletion.',
      'We will never sell personal data. That policy will not change as the product grows.',
    ],
  },
  {
    heading: 'External links',
    body: [
      'Clicking “View Deal” takes you to an external merchant website. UniSmart has no access to what you do there — their privacy policies govern that visit.',
    ],
  },
  {
    heading: 'Your choices',
    body: [
      'You can clear the compare list from the compare page, or clear your browser’s local storage at any time. Nothing else about you is stored to delete.',
    ],
  },
  {
    heading: 'Contact',
    body: [
      'Questions about privacy? Email hello@unismart.store and we will respond within a reasonable time.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="py-10 sm:py-14">
      <div className="container-page">
        <div className="max-w-3xl">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Privacy policy' },
            ]}
          />

          <PageHero
            eyebrow="Legal"
            title="Privacy policy"
            description="Last updated: August 2026. Long story short — we collect almost nothing."
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