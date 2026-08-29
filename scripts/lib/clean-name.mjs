const FILLER =
  /(?:truly\s+wireless|true\s+wireless|bluetooth|wireless|in[- ]?ear|on[- ]?ear|over[- ]?ear|around[- ]?ear|earbuds|earphones|headphones|tws|neckband|earpads|corded|cable|stainless\s+steel|water\s+bottle|with\s+mic)\s*$/i;

export function cleanProductName(name, { fallbackLength = 48 } = {}) {
  const original = String(name);
  let base = original;
  base = base
    .replace(
      /\s+ISI(?:\s+Certified)?\b.*$/i,
      '',
    )
    .replace(/\s+I\s+(?:leak|easy\s*clean|certified|warranty|rust|resistant|bpa)[^]*$/i, '')
    .replace(
      /\s+(?:w\/|with|featuring|up\s+to\s+\d+(?:\.\d+)?\s*(?:hr|hrs|hours|ms)).*$/i,
      '',
    )
    .replace(/\s*,\s*.*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
  for (let i = 0; i < 6; i++) {
    const next = base.replace(FILLER, '');
    if (next === base) break;
    base = next;
  }
  const cleaned = base.trim().slice(0, 80);
  if (cleaned.length < 10) {
    return (
      original
        .split(/\s*,\s*/)[0]
        .replace(/\s*\[[^\]]*\]\s*$/, '')
        .trim()
        .slice(0, fallbackLength) || cleaned
    );
  }
  return cleaned;
}