import Link from 'next/link';
import { Facebook, Instagram, Mail, Twitter, Youtube } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { CATEGORIES } from '@/data/categories';
import { SITE_NAME } from '@/lib/site';

const exploreLinks = [
  { href: '/products', label: 'All products' },
  { href: '/deals', label: 'Today’s deals' },
  { href: '/guides', label: 'Buying guides' },
  { href: '/compare', label: 'Compare products' },
];

const companyLinks = [
  { href: '/about', label: 'About UniSmart' },
  { href: '/contact', label: 'Contact us' },
  { href: '/privacy', label: 'Privacy policy' },
  { href: '/terms', label: 'Terms of use' },
  { href: '/affiliate-disclosure', label: 'Affiliate disclosure' },
];

const socialLinks = [
  { href: '#', label: 'Instagram', icon: Instagram },
  { href: '#', label: 'Twitter / X', icon: Twitter },
  { href: '#', label: 'YouTube', icon: Youtube },
  { href: '#', label: 'Facebook', icon: Facebook },
];

const categories = CATEGORIES.slice(0, 6);

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-950 text-slate-400">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="[&_.text-slate-900]:text-white">
            <Logo />
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Product discovery and deals for Indian college students and young
            professionals. We research, compare and surface smart buys — so you
            don’t waste your money.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-400 transition hover:border-indigo-500 hover:bg-indigo-600/10 hover:text-white"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
          <a
            href="mailto:hello@unismart.store"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            hello@unismart.store
          </a>
        </div>

        <nav className="lg:col-span-2" aria-label="Explore">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Explore
          </h3>
          <ul className="mt-4 space-y-2.5">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="lg:col-span-3" aria-label="Categories">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Categories
          </h3>
          <ul className="mt-4 space-y-2.5">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/products?category=${category.id}`}
                  className="text-sm transition hover:text-white"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="lg:col-span-3" aria-label="Company">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Company
          </h3>
          <ul className="mt-4 space-y-2.5">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-slate-900">
        <div className="container-page flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE_NAME}. All rights reserved. Made with care in India.
          </p>
          <p className="max-w-xl leading-relaxed">
            {SITE_NAME} is a product discovery website. We are not an online store
            and do not process payments. Product information is for reference only.
          </p>
        </div>
      </div>
    </footer>
  );
}