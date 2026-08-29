export function derivedAudioSpecs(specs, name) {
  const out = [];
  const existing = new Set((specs ?? []).map((s) => s.label.toLowerCase()));
  const add = (label, value) => {
    if (value && !existing.has(label.toLowerCase())) {
      out.push({ label, value });
      existing.add(label.toLowerCase());
    }
  };

  const play =
    name.match(
      /(?:^|\s)(\d+(?:\.\d+)?)\s*(?:hrs?|hours?|h)\s+(?:of\s+|music\s+)?(?:playback|playtime|play|battery|total)/i,
    ) ?? name.match(/\b(\d+(?:\.\d+)?)\s*hrs?\s*battery/i);
  add('Battery life', play ? `Up to ${play[1]} hours of total playtime` : '');

  const ip = name.match(/IPX?\d+/i);
  add('Water resistance', ip ? ip[0] : '');

  const drv = name.match(/(\d+(?:\.\d+)?)\s*mm\s*(?:dynamic\s*)?driver/i);
  add('Driver', drv ? `${drv[1]}mm dynamic driver` : '');

  if (/\b(anc|active noise cancellation|noise cancellation)\b/i.test(name)) {
    add('ANC', 'Active noise cancellation');
  }

  const typeC = /usb[ -]?c|type[ -]?c/i.test(name);
  const fast = /fast charging/i.test(name);
  if (typeC || fast) {
    add(
      'Charging',
      [fast ? 'Fast charging' : '', typeC ? 'USB Type-C' : '']
        .filter(Boolean)
        .join(', '),
    );
  }

  return out;
}