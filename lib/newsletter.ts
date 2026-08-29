const BUTTONDOWN_API_URL = 'https://api.buttondown.com/v1/subscribers';

export type SubscribeErrorType = 'invalid' | 'duplicate' | 'unavailable';

export type SubscribeResult = { ok: true } | { ok: false; error: SubscribeErrorType };

export async function subscribeEmail(email: string): Promise<SubscribeResult> {
  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'unavailable' };
  }

  try {
    const apiKey = process.env.BUTTONDOWN_API_KEY;
    const tag = process.env.BUTTONDOWN_TAG?.trim();
    const payload: { email_address: string; tags?: string[] } = { email_address: email };
    if (tag) payload.tags = [tag];

    const response = await fetch(BUTTONDOWN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${apiKey}`,
        'X-Buttondown-Collision-Behavior': 'add',
        'X-Buttondown-Bypass-Firewall': 'true',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (response.ok) {
      return { ok: true };
    }

    const body = (await response.json().catch(() => null)) as { code?: string } | null;
    if (body?.code === 'subscriber_suppressed') {
      return { ok: false, error: 'duplicate' };
    }

    return { ok: false, error: 'unavailable' };
  } catch {
    return { ok: false, error: 'unavailable' };
  }
}