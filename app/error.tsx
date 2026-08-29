'use client';

import { TriangleAlert } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
        <TriangleAlert className="h-8 w-8" aria-hidden="true" />
      </div>
      <h2 className="font-display text-xl font-bold text-slate-900">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        {error.message || 'An unexpected error occurred while showing this page.'}
      </p>
      <button type="button" onClick={reset} className="btn-primary mt-6">
        Try again
      </button>
    </div>
  );
}