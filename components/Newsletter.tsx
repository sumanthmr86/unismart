'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

export function Newsletter({
  description = 'One short email each week with the best deals, new buying guides and money-saving tips. No spam, unsubscribe anytime.',
  compact = false,
}: {
  description?: string;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('pending');
    window.setTimeout(() => setStatus('success'), 900);
  }

  if (status === 'success') {
    return (
      <div
        className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4"
        role="status"
      >
        <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" aria-hidden="true" />
        <p className="text-sm font-medium text-emerald-800">
          You’re in! Your first weekly deal list is on the way.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Subscribe to the weekly deals newsletter">
      <label htmlFor={compact ? 'newsletter-compact' : 'newsletter-hero'} className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <input
          id={compact ? 'newsletter-compact' : 'newsletter-hero'}
          type="email"
          required
          placeholder="you@college.edu"
          className="input-base flex-1"
        />
        <button
          type="submit"
          disabled={status === 'pending'}
          className="btn-primary shrink-0 disabled:cursor-wait disabled:opacity-70"
        >
          {status === 'pending' ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          {status === 'pending' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
      {!compact && (
        <p className="mt-2 text-xs text-slate-500">{description}</p>
      )}
    </form>
  );
}