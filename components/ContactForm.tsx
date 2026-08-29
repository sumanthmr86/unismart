'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('pending');
    window.setTimeout(() => setStatus('success'), 1000);
  }

  if (status === 'success') {
    return (
      <div
        className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-5"
        role="status"
      >
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" aria-hidden="true" />
        <div>
          <p className="font-semibold text-emerald-900">Message sent</p>
          <p className="mt-1 text-sm text-emerald-800">
            Thanks for reaching out — we’ll get back to you shortly. For anything
            urgent, email hello@unismart.store.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card space-y-5 p-6 sm:p-8"
      aria-label="Contact form"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Full name
          </label>
          <input id="contact-name" name="name" type="text" required className="input-base" placeholder="Priya Sharma" />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input id="contact-email" name="email" type="email" required className="input-base" placeholder="priya@college.edu" />
        </div>
      </div>

      <div>
        <label htmlFor="contact-topic" className="mb-1.5 block text-sm font-medium text-slate-700">
          Topic
        </label>
        <select id="contact-topic" name="topic" className="input-base" required defaultValue="">
          <option value="" disabled>Select a topic…</option>
          <option value="product">Suggest a product or category</option>
          <option value="brand">Work with UniSmart (brands/retailers)</option>
          <option value="feedback">Feedback or bug report</option>
          <option value="other">Something else</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-slate-700">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="input-base resize-y"
          placeholder="Tell us what’s on your mind…"
        />
      </div>

      <button type="submit" disabled={status === 'pending'} className="btn-primary disabled:cursor-wait disabled:opacity-70">
        {status === 'pending' ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : null}
        {status === 'pending' ? 'Sending…' : 'Send message'}
      </button>
      <p className="text-xs text-slate-400">
        We read every message — expect a reply within a couple of days.
      </p>
    </form>
  );
}