import type { Metadata } from 'next';
import { Facebook, Instagram, Mail, MessageSquare, Twitter, Youtube } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Contact us',
  description: 'Get in touch with the UniSmart team — product suggestions, brand enquiries, feedback or anything else.',
};

const channels = [
  { icon: Mail, label: 'Email', value: 'hello@unismart.store', href: 'mailto:hello@unismart.store' },
  { icon: MessageSquare, label: 'Product suggestions', value: 'Tell us what to review next', href: '#product-suggestion' },
  { icon: Instagram, label: 'Instagram', value: '@unismart.store', href: '#' },
  { icon: Twitter, label: 'Twitter / X', value: '@unismart_store', href: '#' },
  { icon: Youtube, label: 'YouTube', value: 'UniSmart', href: '#' },
  { icon: Facebook, label: 'Facebook', value: 'UniSmart', href: '#' },
];

export default function ContactPage() {
  return (
    <div className="py-10 sm:py-14">
      <div className="container-page">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Contact' },
          ]}
        />

        <PageHero
          eyebrow="Contact us"
          title="We read everything students send"
          description="Product you want us to cover? A deal we missed? Or a brand partner interested in working with UniSmart — we’d love to hear from you."
        />

        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <ul className="space-y-3">
              {channels.map(({ icon: Icon, label, value, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="card flex items-center gap-4 p-4 transition hover:border-indigo-200 hover:shadow-card"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {label}
                      </span>
                      <span className="block text-sm font-semibold text-slate-900">
                        {value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="card mt-6 p-5">
              <h2 className="font-display text-base font-bold text-slate-900">
                Response times
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                We usually reply within 2 working days. Product suggestions are
                read weekly and the best ones go straight onto the roadmap.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3" id="product-suggestion">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}