const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-IN,en;q=0.9,hi;q=0.8',
  'Cache-Control': 'no-cache',
  'Upgrade-Insecure-Requests': '1',
};

const BOT_MARKERS = [
  'Robot Check',
  'Enter the characters you see below',
  'api-services-support@amazon.com',
  'To discuss automated access to Amazon data',
  'Sorry, we just need to make sure',
];

const MAX_PRICE_INR = 50_00_000;

export async function fetchProductPage(asin) {
  const url = `https://www.amazon.in/dp/${asin}`;
  const res = await fetch(url, {
    headers: HEADERS,
    redirect: 'follow',
    signal: AbortSignal.timeout(30_000),
  });
  const html = await res.text();
  return { status: res.status, html, url };
}

export function isBotBlocked(html) {
  return BOT_MARKERS.some((marker) => html.includes(marker));
}

export function isProductPage(html) {
  return html.includes('id="productTitle"');
}

function firstNumber(text) {
  if (!text) return NaN;
  const withoutDecimals = text.replace(/\.\d+/, '');
  const digits = withoutDecimals.replace(/[^0-9]/g, '');
  return digits ? parseInt(digits, 10) : NaN;
}

const PRICE_WHOLE_RE =
  /<span class="a-price-whole">\s*([0-9,]+)(?:<span[^>]*>[^<]*<\/span>)?\s*<\/span>/i;

function tryCorePriceWhole(html) {
  const coreStart = html.indexOf('corePriceDisplay_desktop_feature_div');
  const windowHtml = coreStart >= 0 ? html.slice(coreStart, coreStart + 12_000) : html;
  const wholeMatch = windowHtml.match(PRICE_WHOLE_RE);
  return wholeMatch ? firstNumber(wholeMatch[1]) : NaN;
}

function tryAnyPriceWhole(html) {
  const wholeMatch = html.match(PRICE_WHOLE_RE);
  return wholeMatch ? firstNumber(wholeMatch[1]) : NaN;
}

function tryToPayOffscreen(html) {
  const match = html.match(
    /apex-price-to-pay-value[^>]*>\s*<span class="a-offscreen">([^<]+)<\/span>/i,
  );
  return match ? firstNumber(match[1]) : NaN;
}

function tryJsonAmount(html, key) {
  const match = html.match(new RegExp(`"${key}"\\s*:\\s*([0-9.]+)`));
  return match ? Math.round(parseFloat(match[1])) : NaN;
}

function tryApexPriceToPayAmount(html) {
  const match = html.match(/"apexPriceToPay"\s*:\s*{[^}]*?"amount"\s*:\s*([0-9.]+)/);
  return match ? Math.round(parseFloat(match[1])) : NaN;
}

export function parseProductPrices(html) {
  const prices = { priceInr: NaN, previousPriceInr: NaN };

  prices.priceInr =
    tryCorePriceWhole(html) ||
    tryToPayOffscreen(html) ||
    tryAnyPriceWhole(html) ||
    tryApexPriceToPayAmount(html) ||
    tryJsonAmount(html, 'priceAmount');

  const mrpMatch = html.match(
    /apex-basisprice-value[^>]*>\s*<span class="a-offscreen">([^<]+)<\/span>/is,
  );
  if (mrpMatch) {
    prices.previousPriceInr = firstNumber(mrpMatch[1]);
  }

  if (
    !Number.isFinite(prices.priceInr) ||
    prices.priceInr <= 0 ||
    prices.priceInr > MAX_PRICE_INR
  ) {
    prices.priceInr = NaN;
  }

  if (
    !Number.isFinite(prices.previousPriceInr) ||
    prices.previousPriceInr <= 0 ||
    prices.previousPriceInr > MAX_PRICE_INR
  ) {
    prices.previousPriceInr = NaN;
  }

  return prices;
}

export async function fetchAndParse(asin) {
  const { status, html } = await fetchProductPage(asin);
  if (status !== 200) {
    throw new Error(`HTTP ${status}`);
  }
  if (isBotBlocked(html) || !isProductPage(html)) {
    throw new Error('blocked by Amazon or not a product page');
  }
  const { priceInr, previousPriceInr } = parseProductPrices(html);
  if (!Number.isFinite(priceInr)) {
    throw new Error('price not found on page');
  }
  return { priceInr, previousPriceInr };
}