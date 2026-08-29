'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

type SubmitStatus = 'idle' | 'pending' | 'success' | 'error';
type SubmitError = 'invalid' | 'duplicate' | 'rate' | 'unavailable' | 'network';

const ERROR_MESSAGES: Record<SubmitError, string> = {
  invalid: 'That email doesn’t look right — mind checking it?',
  duplicate: 'Looks like you’re already subscribed — welcome back!',
  rate: 'Whoa, easy tiger — try again in a few minutes.',
  unavailable: 'Something glitched on our side. Please try again in a few minutes.',
  network: 'Couldn’t reach the server — check your connection and try again.',
};

export function Newsletter({
  description = 'One short email each week with the best deals, new buying guides and money-saving tips. No spam, unsubscribe anytime.',
  compact = false,
}: {
  description?: string;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [error, setError] = useState<SubmitError>('network');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement | null;
    const websiteInput = form.elements.namedItem('website') as HTMLInputElement | null;
    if (!emailInput) return;

    setStatus('pending');
    setError('network');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.value.trim(),
          website: websiteInput?.value ?? '',
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (response.ok && data?.ok) {
        setStatus('success');
        return;
      }

      const submitError: SubmitError =
        data?.error === 'invalid'
          ? 'invalid'
          : data?.error === 'rate'
            ? 'rate'
            : data?.error === 'duplicate'
              ? 'duplicate'
              : 'unavailable';
      setError(submitError);
      setStatus('error');
    } catch {
      setError('network');
      setStatus('error');
    }
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
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="website-field">Leave this field empty</label>
        <input id="website-field" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <input
          id={compact ? 'newsletter-compact' : 'newsletter-hero'}
          name="email"
          type="email"
          required
          disabled={status === 'pending'}
          placeholder="you@college.edu"
          className="input-base flex-1 disabled:cursor-wait disabled:opacity-70"
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
      {status === 'error' && (
        <p className="mt-2 text-sm font-medium text-red-600" role="alert">
          {ERROR_MESSAGES[error]}
        </p>
      )}
      {!compact && status !== 'error' && (
        <p className="mt-2 text-xs text-slate-500">{description}</p>
      )}
    </form>
  );
}