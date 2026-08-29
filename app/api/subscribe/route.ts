import { NextResponse, type NextRequest } from 'next/server';
import { subscribeEmail } from '@/lib/newsletter';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const submitTimes = new Map<string, number[]>();

interface SubscribeBody {
  email?: unknown;
  website?: unknown;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  const now = Date.now();
  const recent = (submitTimes.get(ip) ?? []).filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS,
  );
  if (recent.length >= RATE_LIMIT_MAX) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 });
  }

  let body: SubscribeBody;
  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }

  // Honeypot: bots fill this hidden field — silently drop without subscribing.
  if (typeof body.website === 'string' && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = body.email;
  const valid =
    typeof email === 'string' &&
    email.length <= 254 &&
    EMAIL_RE.test(email.trim().toLowerCase());
  if (!valid) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 422 });
  }

  recent.push(now);
  submitTimes.set(ip, recent);

  const result = await subscribeEmail(email.trim().toLowerCase());
  if (result.ok) {
    return NextResponse.json({ ok: true });
  }
  if (result.error === 'duplicate') {
    return NextResponse.json({ ok: false, error: 'duplicate' });
  }
  return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 502 });
}