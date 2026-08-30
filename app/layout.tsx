import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { ToastProvider } from '@/components/ui/Toast';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { CompareBar } from '@/components/layout/CompareBar';
import { CompareProvider } from '@/components/compare/CompareProvider';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'student deals India',
    'product discovery college students',
    'best laptops for students',
    'best earbuds under 1500',
    'buying guides India',
    'compare products',
    'UniSmart',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <div className="flex min-h-screen flex-col pb-16 md:pb-0">
          <ErrorBoundary>
            <CompareProvider>
              <ToastProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <CompareBar />
                <MobileNav />
              </ToastProvider>
            </CompareProvider>
          </ErrorBoundary>
        </div>
        <Analytics />
      </body>
    </html>
  );
}