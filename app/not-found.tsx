import Link from 'next/link';
import { Compass, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Compass className="h-8 w-8" aria-hidden="true" />
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-indigo-600">
        404 — page not found
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        This page wandered off campus
      </h1>
      <p className="mt-3 max-w-md text-slate-600">
        The page you’re looking for doesn’t exist or has moved. Let’s get you back
        to something useful.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          <Home className="h-4 w-4" aria-hidden="true" />
          Go home
        </Link>
        <Link href="/products" className="btn-secondary">
          <Search className="h-4 w-4" aria-hidden="true" />
          Browse products
        </Link>
      </div>
    </div>
  );
}