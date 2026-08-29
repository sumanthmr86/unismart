import type { Product } from '@/lib/types';
import { amazonUrl } from '@/lib/affiliate';
import amazonAsins from '@/data/amazon-asins.json';
import livePrices from '@/data/live-prices.json';

const AMAZON_ASINS: Record<string, string> = amazonAsins as Record<string, string>;

interface LivePriceEntry {
  priceInr: number;
  previousPriceInr: number;
  updatedAt: string;
}

const LIVE_PRICES = (livePrices as Record<string, LivePriceEntry>) ?? {};

function withLivePrices(products: Product[]): Product[] {
  return products.map((product) => {
    const live = LIVE_PRICES[product.slug];
    if (!live || typeof live.priceInr !== 'number' || live.priceInr <= 0) {
      return product;
    }
    return {
      ...product,
      priceInr: live.priceInr,
      previousPriceInr:
        typeof live.previousPriceInr === 'number' && live.previousPriceInr > 0
          ? live.previousPriceInr
          : product.previousPriceInr,
    };
  });
}

function searchUrl(retailerId: string, query: string): string {
  const q = encodeURIComponent(query);
  switch (retailerId) {
    case 'flipkart':
      return `https://www.flipkart.com/search?q=${q}`;
    case 'croma':
      return `https://www.croma.com/search/?q=${q}`;
    case 'reliance-digital':
      return `https://www.reliancedigital.in/search?q=${q}`;
    case 'vijay-sales':
      return `https://www.vijaysales.com/search?q=${q}`;
    default:
      return `https://www.amazon.in/s?k=${q}&tag=${encodeURIComponent(process.env.NEXT_PUBLIC_AFFILIATE_TAG ?? 'unismart00-21')}`;
  }
}

function dealUrl(retailerId: string, slug: string): string {
  if (retailerId === 'amazon') {
    const asin = AMAZON_ASINS[slug];
    if (asin) return amazonUrl(asin);
  }
  return searchUrl(retailerId, slug.replace(/-/g, ' '));
}

const baseProducts: Product[] = [
  {
    id: 'hp-victus-15',
    slug: 'hp-victus-15',
    name: 'HP Smartchoice Victus 15 Gaming Laptop',
    brand: 'HP',
    category: 'laptops',
    priceInr: 94990,
    previousPriceInr: 101199,
    rating: 4.0,
    ratingCount: 55,
    uniSmartScore: 8.6,
    image: 'https://m.media-amazon.com/images/I/71ESz+ewFFL._SL1500_.jpg',
    shortRecommendation: 'Powerful 14th-gen gaming laptop for hostel life',
    description:
      'The HP Smartchoice Victus 15 is the laptop every hostel gamer ends up recommending. A 144Hz FHD display, a 14th-gen Intel Core i5 processor and an RTX 3050 with 6GB VRAM make it great for gaming nights, coding projects and video editing alike. It is not the lightest machine, but it earns its weight.',
    specs: [
      { label: 'Display', value: '15.6" FHD IPS, 144Hz, 300 nits' },
      { label: 'Processor', value: 'Intel Core i5-14450HX (10 cores, 16 threads)' },
      { label: 'Graphics', value: 'NVIDIA GeForce RTX 3050 (6GB)' },
      { label: 'RAM', value: '24GB DDR5' },
      { label: 'Storage', value: '512GB NVMe SSD' },
      { label: 'Operating system', value: 'Windows 11 Home + Office 2024' },
      { label: 'Weight', value: '2.3 kg' },
    ],
    pros: [
      'Smooth 144Hz display for the price',
      'Plenty of RAM for multitasking',
      'Good cooling for long sessions',
    ],
    cons: ['Plastic build feels average', 'Battery life is just okay'],
    bestFor: [
      'Casual and competitive gaming',
      'Coding, multitasking and editing',
      'Users who want one machine for everything',
    ],
    notIdealFor: [
      'Frequent campus commuters needing an under-2kg laptop',
      '8+ hour battery life on the go',
    ],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'hp-victus-15'), priceInr: 94990, note: 'Best live deal on Amazon India' },
      { retailer: 'flipkart', url: dealUrl('flipkart', 'hp-victus-15'), note: 'Check exchange offers on Flipkart' },
    ],
    reviews: [
      { author: ' 2nd year, B.Tech', detail: 'Runs Valorant and VS Code all day. Screen is unreal at this price.' },
      { author: ' 4th year, Design', detail: 'Handles Figma and Premiere clips without breaking a sweat.' },
    ],
    featured: true,
    deal: true,
  },
  {
    id: 'lenovo-ideapad-slim-3',
    slug: 'lenovo-ideapad-slim-3',
    name: 'Lenovo IdeaPad Slim 3 15.3" i5 Laptop',
    brand: 'Lenovo',
    category: 'laptops',
    priceInr: 72290,
    previousPriceInr: 92990,
    rating: 4.3,
    ratingCount: 1872,
    uniSmartScore: 8.2,
    image: 'https://m.media-amazon.com/images/I/71Q6JmLZE7L._SL1500_.jpg',
    shortRecommendation: 'Slim 15.3-inch laptop with a fast i5 for projects',
    description:
      'The IdeaPad Slim 3 is the dependable workhorse students upgrade to after their first laptop dies. A bright 15.3-inch WUXGA display, a backlit keyboard and a powerful 13th-gen Intel Core i5 for notes, coding and light editing make it one of the safest purchases in its segment.',
    specs: [
      { label: 'Display', value: '15.3" (38.8cm) WUXGA IPS, anti-glare' },
      { label: 'Processor', value: '13th Gen Intel Core i5-13420H' },
      { label: 'RAM / storage', value: '16GB / 512GB SSD' },
      { label: 'Operating system', value: 'Windows 11 + Office Home 2024' },
      { label: 'Keyboard', value: 'Backlit, numeric keypad' },
      { label: 'Extras', value: 'Metal top cover, IR camera, 1 yr ADP' },
      { label: 'Weight', value: '1.6 kg' },
    ],
    pros: [
      'Fast 13th-gen i5 for projects and coding',
      'Bright 15.3" WUXGA IPS display',
      'Light enough to carry daily (1.6kg)',
    ],
    cons: ['Costs more than older Slim 3 versions', 'Battery is adequate, not outstanding'],
    bestFor: [
      'Notes, browsing and office work',
      'Project work and light coding',
      'Media consumption on a big screen',
    ],
    notIdealFor: ['Serious gaming', 'Heavy video editing'],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'lenovo-ideapad-slim-3'), priceInr: 72290, note: 'Amazon India price' },
      { retailer: 'flipkart', url: dealUrl('flipkart', 'lenovo-ideapad-slim-3'), note: 'Compare on Flipkart' },
      { retailer: 'croma', url: dealUrl('croma', 'lenovo-ideapad-slim-3'), note: 'In-store price match at Croma' },
    ],
    reviews: [
      { author: ' 1st year, Commerce', detail: 'Lasts a full day of classes on one charge. Exactly what I needed.' },
      { author: ' 3rd year, Engineering', detail: 'Solid for MATLAB and documents. No complaints at this price.' },
    ],
    deal: true,
  },
  {
    id: 'boat-airdopes-141',
    slug: 'boat-airdopes-141',
    name: 'boAt Airdopes 141 TWS Earbuds',
    brand: 'boAt',
    category: 'audio',
    priceInr: 999,
    previousPriceInr: 4490,
    rating: 4.1,
    ratingCount: 85422,
    uniSmartScore: 7.2,
    image: 'https://m.media-amazon.com/images/I/71RFdy6y6LL._SL1500_.jpg',
    shortRecommendation: 'Cheap daily earbuds with a signature bass sound',
    description:
      'The Airdopes 141 is the earbud you buy when you just want music to play and calls to work, without overthinking it. Punchy bass, a pocketable case and ridiculous sale price make it the default cheap pick for campus life.',
    specs: [
      { label: 'Driver', value: '8mm dynamic' },
      { label: 'Battery', value: 'Up to 42h with case' },
      { label: 'Charging', value: 'USB Type-C' },
      { label: 'Water resistance', value: 'IPX4' },
      { label: 'Latency', value: 'Low-latency gaming mode' },
      { label: 'Controls', value: 'Touch controls, voice assistant' },
    ],
    pros: ['Aggressive pricing on sales', 'Bass-heavy sound signature', 'Long total battery life'],
    cons: ['Mediocre call clarity indoors', 'Build feels light and plasticky'],
    bestFor: [
      'Budget-first buyers',
      'Casual music and podcast listening',
      'Gym and commute use',
    ],
    notIdealFor: ['Audiophiles', 'People who take lots of calls in noisy places'],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'boat-airdopes-141'), priceInr: 999, note: 'Deep discount live on Amazon India' },
      { retailer: 'flipkart', url: dealUrl('flipkart', 'boat-airdopes-141'), note: 'Compare price on Flipkart' },
      { retailer: 'croma', url: dealUrl('croma', 'boat-airdopes-141'), note: 'Buy in-store at Croma' },
    ],
    reviews: [
      { author: ' 2nd year, Arts', detail: 'For under 1.5k these are fine. Bass is loud, battery lasts the week.' },
      { author: ' 1st year, Medical', detail: 'Call quality is meh but music is fun. Great for the price.' },
    ],
    deal: true,
  },
  {
    id: 'oneplus-nord-buds-3',
    slug: 'oneplus-nord-buds-3',
    name: 'OnePlus Nord Buds 3',
    brand: 'OnePlus',
    category: 'audio',
    priceInr: 2799,
    previousPriceInr: 3599,
    rating: 4.3,
    ratingCount: 21340,
    uniSmartScore: 8.3,
    image: 'https://m.media-amazon.com/images/I/51CfKYzmFsL._SL1500_.jpg',
    shortRecommendation: 'Best budget earbuds with real active noise cancellation',
    description:
      'The Nord Buds 3 brings genuinely useful active noise cancellation (up to 32dB) to the budget crowd. Balanced sound, a comfortable fit and a battery that stretches to 43 hours with the case make it the pick we recommend most often to students upgrading from store-basic earbuds.',
    specs: [
      { label: 'Driver', value: 'Dynamic drivers, harmonic tuning' },
      { label: 'ANC', value: 'Active noise cancellation, up to 32dB' },
      { label: 'Battery', value: 'Up to 43h total playback with case' },
      { label: 'Charging', value: 'USB Type-C, 10 min = 11 hours of playback' },
      { label: 'Water resistance', value: 'IP55' },
      { label: 'Low latency', value: 'Yes, gaming mode' },
    ],
    pros: [
      'Real ANC at a student-friendly price',
      'Comfortable all-day fit',
      'Dependable battery in the case',
    ],
    cons: ['ANC dulls highs slightly', 'No wireless charging'],
    bestFor: [
      'Noisy hostels and crowded buses',
      'Music, calls and gaming',
      'Budget buyers who want ANC',
    ],
    notIdealFor: ['Fans of heavy bass-boosted tuning'],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'oneplus-nord-buds-3'), priceInr: 2799, note: 'Best price on Amazon India' },
      { retailer: 'flipkart', url: dealUrl('flipkart', 'oneplus-nord-buds-3'), note: 'Check Flipkart exchange deals' },
    ],
    reviews: [
      { author: ' 2nd year, Engineering', detail: 'ANC is legit. The library zeroes travel into the background.' },
      { author: ' 3rd year, Law', detail: 'Best value earbud I have owned. Case battery lasts the week.' },
    ],
    featured: true,
    deal: true,
  },
  {
id: 'realme-buds-air-8-pro',
    slug: 'realme-buds-air-8-pro',
    name: 'realme Buds Air 8 Pro',
    brand: 'realme',
    category: 'audio',
    priceInr: 6999,
    previousPriceInr: 8999,
    rating: 4.4,
    ratingCount: 9120,
    uniSmartScore: 8.5,
    image: 'https://m.media-amazon.com/images/I/61ExmlANK4L._SL1500_.jpg',
    shortRecommendation: 'Mid-range pick with strong ANC and dual drivers',
    description:
      'Stepping up in price brings meaningful upgrades: true dual-DAC drivers, seriously strong noise cancellation and 3D spatial audio. The Buds Air 8 Pro is the sweet spot for students who live on calls, gaming and playlists.',
    specs: [
      { label: 'Driver', value: '11mm + 6mm dual DAC drivers' },
      { label: 'ANC', value: '55dB noise cancellation' },
      { label: 'Microphones', value: '6-mic VPU for clear calls' },
      { label: 'Audio', value: '3D spatial audio' },
      { label: 'Battery', value: 'Up to 50h total playtime' },
      { label: 'Water resistance', value: 'IP55' },
    ],
    pros: [
      'Detailed dual-driver sound',
      'Strong adaptive ANC',
      'Connect to laptop and phone at once',
    ],
    cons: ['Slightly large case', 'Tuning favours bass over neutrality'],
    bestFor: [
      'Long commutes and hostel mornings',
      'Frequent calls and meetings',
      'Users who want noticeably better audio',
    ],
    notIdealFor: ['Strict budget under ₹2500'],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'realme-buds-air-8-pro'), priceInr: 6999, note: 'Amazon India price' },
      { retailer: 'flipkart', url: dealUrl('flipkart', 'realme-buds-air-8-pro'), note: 'Compare on Flipkart' },
    ],
    reviews: [
      { author: ' MBA student', detail: 'Dual drivers are the real deal. Jazz and podcasts both sound right.' },
      { author: ' 4th year, Tech', detail: 'ANC kills the hostel fan noise. Worth the extra over budget buds.' },
    ],
  },
  {
    id: 'logitech-pebble-2-m350s',
    slug: 'logitech-pebble-2-m350s',
    name: 'Logitech Pebble 2 M350s Mouse',
    brand: 'Logitech',
    category: 'accessories',
    priceInr: 1595,
    previousPriceInr: 2295,
    rating: 4.5,
    ratingCount: 12670,
    uniSmartScore: 8.4,
    image: 'https://m.media-amazon.com/images/I/51pIShw4V8L._SL1500_.jpg',
    shortRecommendation: 'Silent, portable mouse for library days',
    description:
      'The Pebble 2 is small, silent and slips into any pocket. Quiet clicks make it a library favourite, cross-platform Bluetooth and USB receivers keep it compatible everywhere, and the eco-plastic build is a nice bonus.',
    specs: [
      { label: 'Type', value: 'Silent click, optical' },
      { label: 'Connectivity', value: 'Bluetooth + 2.4GHz USB receiver' },
      { label: 'DPI', value: 'Adjustable up to 4000' },
      { label: 'Battery', value: 'Up to 18 months, single AA' },
      { label: 'Compatibility', value: 'Windows, macOS, ChromeOS, Android, iPadOS' },
      { label: 'Weight', value: '78g' },
    ],
    pros: [
      'Very quiet clicks',
      'Flat design is easy to carry',
      'Long battery life',
    ],
    cons: ['Shape may be small for big hands', 'No scroll wheel tilt'],
    bestFor: [
      'Library and late-night study use',
      'Laptop + tablet users',
      'Minimalist desk setups',
    ],
    notIdealFor: ['Gamers needing high polling rate'],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'logitech-pebble-2-m350s'), priceInr: 1595, note: 'Amazon India price' },
      { retailer: 'croma', url: dealUrl('croma', 'logitech-pebble-2-m350s'), note: 'In-store at Croma' },
    ],
    reviews: [
      { author: ' 3rd year, Design', detail: 'Silent enough for the library and tiny enough for my sleeve pocket.' },
      { author: ' 2nd year, Engineering', detail: 'Clicks feel great, battery lasts ages. Zero regrets.' },
    ],
    featured: true,
  },
  {
    id: 'amazonbasics-laptop-sleeve-15-6',
    slug: 'amazonbasics-laptop-sleeve-15-6',
    name: 'Amazon Basics Laptop Sleeve 15.6"',
    brand: 'Amazon Basics',
    category: 'accessories',
    priceInr: 419,
    previousPriceInr: 899,
    rating: 4.4,
    ratingCount: 34710,
    uniSmartScore: 7.9,
    image: 'https://m.media-amazon.com/images/I/814V5+Ve3VL._SL1500_.jpg',
    shortRecommendation: 'Dirt-cheap protection for daily commutes',
    description:
      'A padded sleeve is the cheapest insurance your laptop can get. This Amazon Basics sleeve offers multiple pockets, a side handle, water-repellent fabric and shock-absorbing padding — perfect for the walk from hostel to classes.',
    specs: [
      { label: 'Fits', value: 'Laptops up to 15.6" / MacBook' },
      { label: 'Material', value: 'Water repellent, shock absorbing' },
      { label: 'Pockets', value: 'Multiple pockets' },
      { label: 'Handle', value: 'Side carry handle' },
      { label: 'Colours', value: 'Black (as linked)' },
    ],
    pros: ['Very affordable', 'Cushioned on all sides', 'Simple and durable'],
    cons: ['No shoulder strap', 'Thin padding compared to hardshell cases'],
    bestFor: [
      'Hostel-to-class commutes',
      'Water-repellent-light weather',
      'Budget protection',
    ],
    notIdealFor: ['Heavy drop protection', 'Carrying extra accessories'],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'amazonbasics-laptop-sleeve-15-6'), priceInr: 419, note: 'Amazon India price' },
    ],
    reviews: [
      { author: ' 1st year, Science', detail: 'My off-white laptop stays clean through the monsoon. Great value.' },
      { author: ' 2nd year, Arts', detail: 'Does exactly what a sleeve should. Nothing fancy, nothing broken.' },
    ],
    deal: true,
  },
  {
    id: 'skybags-brat-backpack',
    slug: 'skybags-brat-backpack',
    name: 'Skybags Brat Pro Max 35L Backpack',
    brand: 'Skybags',
    category: 'backpacks',
    priceInr: 999,
    previousPriceInr: 2100,
    rating: 4.2,
    ratingCount: 41650,
    uniSmartScore: 7.9,
    image: 'https://m.media-amazon.com/images/I/71FlP-n8xNL._SL1500_.jpg',
    shortRecommendation: 'The most popular college backpack',
    description:
      'The Brat is a campus legend. A spacious 35-litre Pro Max build with three compartments, a padded laptop slot and a rain cover makes it the backpack that shows up in every lecture hall — backed by a 1-year global warranty.',
    specs: [
      { label: 'Capacity', value: '35 litres (Pro Max)' },
      { label: 'Laptop sleeve', value: 'Padded, fits up to 15.6"' },
      { label: 'Compartments', value: '3 compartments' },
      { label: 'Extras', value: 'Rain cover, side pockets' },
      { label: 'Straps', value: 'Padded shoulder straps' },
      { label: 'Warranty', value: '1-year global warranty' },
    ],
    pros: ['Excellent price', 'Big 35L capacity', 'Rain cover included'],
    cons: ['Back padding is thin', 'Large for smaller builds'],
    bestFor: [
      'Daily college use',
      'Carrying laptop + books + extras',
      'Rainy-season commutes',
    ],
    notIdealFor: ['Ultra-compact everyday carry'],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'skybags-brat-backpack'), priceInr: 999, note: 'Amazon India price' },
      { retailer: 'flipkart', url: dealUrl('flipkart', 'skybags-brat-backpack'), note: 'Check Flipkart offers' },
    ],
    reviews: [
      { author: ' 1st year, Commerce', detail: 'Carries my laptop, books and a tiffin. Back nothing in two semesters.' },
      { author: ' 2nd year, Law', detail: 'For ₹750 this is unbeatable. Looks much pricier than it is.' },
    ],
    deal: true,
  },
  {
    id: 'american-tourister-30l-backpack',
    slug: 'american-tourister-30l-backpack',
    name: 'American Tourister RON 28L Backpack',
    brand: 'American Tourister',
    category: 'backpacks',
    priceInr: 1599,
    previousPriceInr: 4200,
    rating: 4.5,
    ratingCount: 18230,
    uniSmartScore: 8.7,
    image: 'https://m.media-amazon.com/images/I/71mM5CQjEhL._SL1500_.jpg',
    shortRecommendation: 'Premium pick that lasts all four years',
    description:
      'If you want one backpack for all of college, this is it. Four organized compartments including a dedicated laptop space, a durable build and a rain cover for monsoon commutes — the slightly higher spend pays for itself.',
    specs: [
      { label: 'Capacity', value: '28 litres' },
      { label: 'Laptop sleeve', value: 'Dedicated, fits laptops' },
      { label: 'Compartments', value: '4 compartments' },
      { label: 'Extras', value: 'Rain cover included' },
      { label: 'Style', value: 'Black, unisex' },
    ],
    pros: [
      'Excellent organisation',
      'Rain cover included',
      'Built to last 3+ years',
    ],
    cons: ['Costs more than budget packs', 'Slightly stiff when empty'],
    bestFor: [
      'Final-year and postgrad students',
      'Daily carriers + weekend trips',
      'Users who want structure, not a bucket',
    ],
    notIdealFor: ['Strict budget under ₹1000'],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'american-tourister-30l-backpack'), priceInr: 1599, note: 'Amazon India price' },
      { retailer: 'flipkart', url: dealUrl('flipkart', 'american-tourister-30l-backpack'), note: 'Compare on Flipkart' },
    ],
    reviews: [
      { author: ' 4th year, Engineering', detail: 'Three years old and still looks new. Worth every rupee.' },
      { author: ' MBA student', detail: 'The organizers changed my life. Everything has a spot.' },
    ],
    featured: true,
  },
  {
    id: 'xiaomi-power-bank-5i-20000',
    slug: 'xiaomi-power-bank-5i-20000',
    name: 'Xiaomi Power Bank 5i 20000mAh',
    brand: 'Xiaomi',
    category: 'power-charging',
    priceInr: 3499,
    previousPriceInr: 5999,
    rating: 4.4,
    ratingCount: 52340,
    uniSmartScore: 8.5,
    image: 'https://m.media-amazon.com/images/I/513FWGu6CWL._SL1500_.jpg',
    shortRecommendation: 'Best-selling power bank for a reason',
    description:
      'The Xiaomi Power Bank 5i is the heavyweight champ of the category. A huge 20000mAh cell with lightning-fast 67W turbo charging can top up your phone, tablet and even a laptop — and an in-built cable means you will never be caught without a wire again.',
    specs: [
      { label: 'Capacity', value: '20000mAh' },
      { label: 'Charging', value: '67W turbo, PD 3.0 & PPS' },
      { label: 'Cable', value: 'In-built cable included' },
      { label: 'Ports', value: 'Triple output ports' },
      { label: 'Display', value: 'Digital battery/capacity display' },
      { label: 'Protection', value: '12-layer protection' },
      { label: 'Compatible with', value: 'Laptop, tablet, phone, earbuds' },
    ],
    pros: [
      '67W turbo-fast charging',
      'Built-in cable + digital display',
      'Big enough to charge a laptop',
    ],
    cons: ['Heavier than small power banks', 'Costs more than 10000mAh models'],
    bestFor: [
      'Days away from sockets',
      'Charging laptop + phone + earbuds together',
      'Frequent travellers',
    ],
    notIdealFor: ['Ultra-light everyday pocket carry'],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'xiaomi-power-bank-5i-20000'), priceInr: 3499, note: 'Amazon India price' },
      { retailer: 'flipkart', url: dealUrl('flipkart', 'xiaomi-power-bank-5i-20000'), note: 'Compare on Flipkart' },
    ],
    reviews: [
      { author: ' 2nd year, Engineering', detail: 'Saved me every hostel power cut. Charges my phone twice.' },
      { author: ' 1st year, Medical', detail: 'Small, reliable, does the job without drama.' },
    ],
    deal: true,
  },
  {
    id: 'ambrane-65w-gan-charger',
    slug: 'ambrane-65w-gan-charger',
    name: 'Ambrane 65W GaN Charger (RAAP G65)',
    brand: 'Ambrane',
    category: 'power-charging',
    priceInr: 2399,
    previousPriceInr: 3999,
    rating: 4.3,
    ratingCount: 9870,
    uniSmartScore: 8.2,
    image: 'https://m.media-amazon.com/images/I/71dsoiS55DL._SL1500_.jpg',
    shortRecommendation: 'One charger for laptop, phone and earbuds',
    description:
      'A 65W GaN charger collapses the jumble of adapters on your desk into one pocketable brick. Three ports (2x USB-C + 1x USB-A) let you top up a laptop, phone and earbuds from a single hostel socket point — with PD technology for MacBook, Dell, HP and more.',
    specs: [
      { label: 'Power', value: '65W total (GaN)' },
      { label: 'Ports', value: '2x USB-C + 1x USB-A' },
      { label: 'Output', value: 'PD technology, GaN fast charging' },
      { label: 'Compatible with', value: 'MacBook, Dell, HP, ASUS laptops & all devices' },
      { label: 'Size', value: 'Compact, travel friendly' },
      { label: 'Protection', value: 'Over-voltage, over-current, short-circuit' },
    ],
    pros: [
      'Charges laptops and phones',
      'Very small for the power',
      'Foldable pins survive bags',
    ],
    cons: ['Plastic body, no premium feel', 'Single port maxes at 65W combined'],
    bestFor: [
      'USB-C laptop owners',
      'Cutting down desk clutter',
      'Travel and hostel packing',
    ],
    notIdealFor: ['School rules that only allow stock chargers'],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'ambrane-65w-gan-charger'), priceInr: 2399, note: 'Amazon India price' },
      { retailer: 'flipkart', url: dealUrl('flipkart', 'ambrane-65w-gan-charger'), note: 'Compare on Flipkart' },
    ],
    reviews: [
      { author: ' 3rd year, Engineering', detail: 'One socket, three devices. My desk is finally clean.' },
      { author: ' MBA student', detail: 'Small enough for my laptop sleeve pocket. Charges everything.' },
    ],
    deal: true,
  },
  {
    id: 'wipro-garnet-led-desk-lamp',
    slug: 'wipro-garnet-led-desk-lamp',
    name: 'Wipro Garnet LED Desk Lamp',
    brand: 'Wipro',
    category: 'study-setup',
    priceInr: 1349,
    previousPriceInr: 1500,
    rating: 4.4,
    ratingCount: 15420,
    uniSmartScore: 8.6,
    image: 'https://m.media-amazon.com/images/I/617P1iGF4vL._SL1500_.jpg',
    shortRecommendation: 'Eye-comfort lamp for late-night study',
    description:
      'Late-night study without a proper lamp is a recipe for headaches. The Wipro Garnet offers flicker-free light, adjustable brightness and a flexible stand, making your study table the one place your eyes actually thank you.',
    specs: [
      { label: 'Type', value: 'Flicker-free LED' },
      { label: 'Brightness', value: 'Adjustable, 3-4 modes' },
      { label: 'Colour temp', value: 'Warm to cool' },
      { label: 'Power', value: 'Direct mains (no battery)' },
      { label: 'Stand', value: 'Flexible neck' },
      { label: 'Clamp/base', value: 'Flat base' },
    ],
    pros: ['Gentle on eyes at night', 'Several brightness modes', 'Stable flat base'],
    cons: ['No battery backup', 'Not portable'],
    bestFor: [
      'Routine late-night study',
      'Clean, minimal desks',
      'Eye-comfort-focused students',
    ],
    notIdealFor: ['Dorm rooms without a desk socket nearby'],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'wipro-garnet-led-desk-lamp'), priceInr: 1349, note: 'Amazon India price' },
      { retailer: 'flipkart', url: dealUrl('flipkart', 'wipro-garnet-led-desk-lamp'), note: 'Compare on Flipkart' },
      { retailer: 'croma', url: dealUrl('croma', 'wipro-garnet-led-desk-lamp'), note: 'In-store at Croma' },
    ],
    reviews: [
      { author: ' 1st year, Medical', detail: 'Studied till 2am for months with zero eye strain. Game changer.' },
      { author: ' 2nd year, Arts', detail: 'Looks premium on the desk and the light modes actually help.' },
    ],
    featured: true,
  },
  {
    id: 'logitech-mk235-combo',
    slug: 'logitech-mk235-combo',
    name: 'Logitech MK235 Wireless Combo',
    brand: 'Logitech',
    category: 'study-setup',
    priceInr: 1845,
    previousPriceInr: 2095,
    rating: 4.4,
    ratingCount: 22980,
    uniSmartScore: 8.5,
    image: 'https://m.media-amazon.com/images/I/610pkebtmuL._SL1500_.jpg',
    shortRecommendation: 'Quiet keyboard-mouse set for dorm desks',
    description:
      'The MK235 combo turns any desk into a proper workstation. A compact keyboard with quiet keys, a reliable wireless mouse and a battery life measured in years make it a set-and-forget upgrade for assign-long essays.',
    specs: [
      { label: 'Includes', value: 'Keyboard + 3-button mouse' },
      { label: 'Connection', value: '2.4GHz USB receiver' },
      { label: 'Keyboard battery', value: 'Up to 36 months' },
      { label: 'Mouse battery', value: 'Up to 12 months' },
      { label: 'Range', value: 'Up to 10m' },
      { label: 'Layout', value: 'Compact US layout' },
    ],
    pros: ['Excellent battery life', 'Quiet, comfortable keys', 'One small receiver for both'],
    cons: ['No backlight', 'Not Bluetooth'],
    bestFor: [
      'Long writing and coding sessions',
      'Keeping hostel neighbours happy',
      'Budget desk setups',
    ],
    notIdealFor: ['Tablet-only users who need Bluetooth'],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'logitech-mk235-combo'), priceInr: 1845, note: 'Amazon India price' },
      { retailer: 'croma', url: dealUrl('croma', 'logitech-mk235-combo'), note: 'In-store at Croma' },
    ],
    reviews: [
      { author: ' 3rd year, Engineering', detail: 'Typed my entire thesis on this. Keys still feel brand new.' },
      { author: ' 2nd year, Design', detail: 'Dead quiet at 2am. Perfect for shared rooms.' },
    ],
  },
  {
    id: 'lg-24ml600s-monitor',
    slug: 'lg-24ml600s-monitor',
    name: 'LG Smartchoice 24" FHD IPS Monitor',
    brand: 'LG',
    category: 'monitors',
    priceInr: 7499,
    previousPriceInr: 17000,
    rating: 4.4,
    ratingCount: 8760,
    uniSmartScore: 8.6,
    image: 'https://m.media-amazon.com/images/I/811ZXt6KvwL._SL1500_.jpg',
    shortRecommendation: 'Best cheap external display for multitasking',
    description:
      'One laptop screen is never enough by third year. This LG 24-inch IPS panel adds a buttery 120Hz refresh and sharp colour-accurate space for split-screen research, code and notes, with a 3-side virtually borderless design that hides well in a hostel room.',
    specs: [
      { label: 'Size', value: '60cm (24") IPS' },
      { label: 'Resolution', value: '1920 x 1080 Full HD' },
      { label: 'Refresh', value: '120Hz, 1ms MBR' },
      { label: 'Colour', value: 'sRGB 99%, HDR10' },
      { label: 'Ports', value: 'HDMI + VGA' },
      { label: 'Eye care', value: 'Reader mode, Flicker Safe' },
    ],
    pros: [
      'Smooth 120Hz refresh',
      'Accurate IPS colours',
      'Slim bezels for a clean look',
    ],
    cons: ['No USB-C', 'Speakers are weak'],
    bestFor: [
      'Dual-screen study setups',
      'Photo and doc editing',
      'Stable, long desk time',
    ],
    notIdealFor: ['Competitive esports at 144Hz+'],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'lg-24ml600s-monitor'), priceInr: 7499, note: 'Amazon India price' },
      { retailer: 'croma', url: dealUrl('croma', 'lg-24ml600s-monitor'), note: 'In-store at Croma' },
      { retailer: 'reliance-digital', url: dealUrl('reliance-digital', 'lg-24ml600s-monitor'), note: 'Reliance Digital deal' },
    ],
    reviews: [
      { author: ' 4th year, Engineering', detail: 'Notes on one screen, IDE on the other. Productivity doubled.' },
      { author: ' MBA student', detail: 'Colours are clean, stand feels solid. Great value.' },
    ],
    featured: true,
  },
  {
    id: 'redmi-pad-se',
    slug: 'redmi-pad-se',
    name: 'Redmi Pad 2 11" 2.5K Tablet',
    brand: 'Redmi',
    category: 'tablets',
    priceInr: 18999,
    previousPriceInr: 27999,
    rating: 4.3,
    ratingCount: 21450,
    uniSmartScore: 8.1,
    image: 'https://m.media-amazon.com/images/I/71XIM211EkL._SL1500_.jpg',
    shortRecommendation: 'Sharp 2.5K display tablet for notes, PDFs and Netflix',
    description:
      'The Redmi Pad 2 is the answer to "should I buy a tablet?" for most students. A big 11-inch 2.5K display, loud speakers and a battery that outlasts your day make it ideal for reading PDFs, taking notes and winding down with a movie.',
    specs: [
      { label: 'Display', value: '11" (27.94cm) 2.5K, 90Hz' },
      { label: 'Processor', value: 'MediaTek Helio G100 Ultra' },
      { label: 'RAM / storage', value: '4GB / 128GB (expandable)' },
      { label: 'Battery', value: '9340mAh' },
      { label: 'Operating system', value: 'HyperOS 2' },
      { label: 'Connectivity', value: 'Wi-Fi model, Dolby Atmos' },
    ],
    pros: [
      'Big, sharp display',
      'Loud speakers for media',
      'Long battery life',
    ],
    cons: ['Charging is modest 18W', 'Average camera'],
    bestFor: [
      'PDFs, notes and online classes',
      'Netflix and media binges',
      'A companion to a good laptop',
    ],
    notIdealFor: ['Replacing a laptop for coding', 'Heavy gaming'],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'redmi-pad-se'), priceInr: 18999, note: 'Amazon India price' },
      { retailer: 'flipkart', url: dealUrl('flipkart', 'redmi-pad-se'), note: 'Check Flipkart bank offers' },
    ],
    reviews: [
      { author: ' 1st year, Medical', detail: 'All my lectures on one screen now. Battery lasts two days.' },
      { author: ' 2nd year, Arts', detail: 'Netflix and PDFs look fantastic. Great second screen.' },
    ],
    featured: true,
    deal: true,
  },
  {
    id: 'samsung-galaxy-tab-a11-plus',
    slug: 'samsung-galaxy-tab-a11-plus',
    name: 'Samsung Galaxy Tab A11+',
    brand: 'Samsung',
    category: 'tablets',
    priceInr: 24999,
    previousPriceInr: 27999,
    rating: 4.4,
    ratingCount: 15980,
    uniSmartScore: 8.4,
    image: 'https://m.media-amazon.com/images/I/61r4lmS91hL._SL1500_.jpg',
    shortRecommendation: 'Bigger screen and better speakers for media',
    description:
      'The Galaxy Tab A11+ is the step-up pick with a roomier 11-inch 90Hz screen, four Dolby Atmos speakers and AI features on board. Between classes it doubles as a polished media hub that travels light.',
    specs: [
      { label: 'Display', value: '11" (27.82cm) 90Hz' },
      { label: 'RAM / storage', value: '6GB / 128GB' },
      { label: 'AI', value: 'Google Gemini built in' },
      { label: 'Speakers', value: 'Quad speakers, Dolby Atmos' },
      { label: 'Connectivity', value: 'Wi-Fi tablet' },
      { label: 'Colour', value: 'Gray' },
    ],
    pros: [
      'Smooth 90Hz display',
      'Strong quad speakers',
      '128GB storage headroom',
    ],
    cons: ['Middling battery life', 'No bundled stylus'],
    bestFor: [
      'Media-heavy students',
      'Notes plus light gaming',
      'Long-video lecture watchers',
    ],
    notIdealFor: ['Sub-₹15000 budget buyers'],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'samsung-galaxy-tab-a11-plus'), priceInr: 24999, note: 'Amazon India price' },
      { retailer: 'flipkart', url: dealUrl('flipkart', 'samsung-galaxy-tab-a11-plus'), note: 'Compare on Flipkart' },
    ],
    reviews: [
      { author: ' 3rd year, Law', detail: 'Notes on the left, case law on the right. Speakers are superb.' },
      { author: ' 2nd year, Engineering', detail: 'Bigger and smoother than the cheaper tablets. Worth the step up.' },
    ],
  },
  {
    id: 'prestige-electric-kettle-1-5l',
    slug: 'prestige-electric-kettle-1-5l',
    name: 'Prestige Electric Kettle 1.5L (PKOSS)',
    brand: 'Prestige',
    category: 'hostel-essentials',
    priceInr: 665,
    previousPriceInr: 1445,
    rating: 4.3,
    ratingCount: 36440,
    uniSmartScore: 8.3,
    image: 'https://m.media-amazon.com/images/I/71EspAy4bUL._SL1500_.jpg',
    shortRecommendation: 'Instant chai and maggi, the hostel staple',
    description:
      'The electric kettle is the single most used appliance in Indian hostels — and this Prestige PKOSS model nails it: fast 1350W boil, automatic cut-off, cool-touch handle and lid, single-touch lid locking and a roomy 1.5-litre capacity. Chai in under two minutes.',
    specs: [
      { label: 'Capacity', value: '1.5 litres' },
      { label: 'Material', value: 'Stainless steel' },
      { label: 'Power', value: '1350W, fast boil' },
      { label: 'Safety', value: 'Automatic cut-off, lid lock' },
      { label: 'Handle', value: 'Cool-touch handle and lid' },
      { label: 'Warranty', value: '1 year, ISI certified' },
    ],
    pros: [
      'Boils water fast',
      'Auto cut-off saves the day',
      'Big 1.5L capacity for two',
    ],
    cons: ['No temperature control', 'Mixed-size rooms may prefer smaller'],
    bestFor: [
      'Chai, coffee and maggi',
      'Hot water for oats and soups',
      'Double-occupancy rooms',
    ],
    notIdealFor: ['Cooking meals for large groups'],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'prestige-electric-kettle-1-5l'), priceInr: 665, note: 'Amazon India price' },
      { retailer: 'flipkart', url: dealUrl('flipkart', 'prestige-electric-kettle-1-5l'), note: 'Compare on Flipkart' },
    ],
    reviews: [
      { author: ' 1st year, Engineering', detail: 'Maggi and chai gang rise. Boils in under two minutes.' },
      { author: ' 2nd year, Science', detail: 'Three semesters of daily use and still going strong.' },
    ],
    deal: true,
  },
  {
    id: 'havells-extension-board-4-socket',
    slug: 'havells-extension-board-4-socket',
    name: 'Havells EcoStar 4+1 Extension Board',
    brand: 'Havells',
    category: 'hostel-essentials',
    priceInr: 545,
    previousPriceInr: 715,
    rating: 4.5,
    ratingCount: 27810,
    uniSmartScore: 8.7,
    image: 'https://m.media-amazon.com/images/I/51TcOC0WibL._SL1500_.jpg',
    shortRecommendation: 'Surge-protected power strip for the top bunk',
    description:
      'Hostel walls rarely have enough sockets. This Havells EcoStar board adds four universal grounded outlets (plus one bonus socket) with overload, over-current and over-voltage protection and a 4-metre cord — so your charger, lamp and kettle can finally live together in peace.',
    specs: [
      { label: 'Sockets', value: '4+1 universal 3-pin sockets' },
      { label: 'Protection', value: 'Overload, over-current, over-voltage' },
      { label: 'Cord', value: '4m copper wire' },
      { label: 'Indicator', value: 'LED power indicator' },
      { label: 'Certification', value: 'ISI certified wire & plug' },
    ],
    pros: [
      'Protection against overload & voltage dips',
      'Long 4m copper cord',
      'Led indicator for power status',
    ],
    cons: ['No USB ports', 'Plastic body needs care'],
    bestFor: [
      'Bedside charging setups',
      'Desks with limited sockets',
      'Protecting expensive devices',
    ],
    notIdealFor: ['Whole-room extension needs beyond 4 sockets'],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'havells-extension-board-4-socket'), priceInr: 545, note: 'Amazon India price' },
      { retailer: 'flipkart', url: dealUrl('flipkart', 'havells-extension-board-4-socket'), note: 'Compare on Flipkart' },
    ],
    reviews: [
      { author: ' 3rd year, Arts', detail: 'Three chargers, one lamp, zero sparks. Peace of mind.' },
      { author: ' 1st year, Medical', detail: 'Surge protection sold me. Gadgets are safe during voltage dips.' },
    ],
  },
  {
    id: 'classmate-notebook-pack',
    slug: 'classmate-notebook-pack',
    name: 'Classmate Long Notebook 12-Pack',
    brand: 'Classmate',
    category: 'stationery',
    priceInr: 576,
    previousPriceInr: 720,
    rating: 4.6,
    ratingCount: 48720,
    uniSmartScore: 8.8,
    image: 'https://m.media-amazon.com/images/I/71jK7zcYXcL._SL1500_.jpg',
    shortRecommendation: 'Best-value notebook pack for the semester',
    description:
      'One subject, one notebook, zero stress. This 12-pack of Classmate long notebooks (140 pages each, single line) covers a full semester of lectures with paper that takes gel and ballpoint ink cleanly, at a price that beats buying them one at a time.',
    specs: [
      { label: 'Pack size', value: '12 notebooks' },
      { label: 'Pages', value: '140 pages each' },
      { label: 'Size', value: '297mm x 210mm, single line' },
      { label: 'Type', value: 'Long (ruled) notebook' },
      { label: 'Binding', value: 'Perfect bound' },
    ],
    pros: [
      'Works out very cheap per notebook',
      'Good paper quality',
      'Covers a whole semester',
    ],
    cons: ['Basic cover', 'Soft cover can crease'],
    bestFor: [
      'Semester planning ahead',
      'Lecture notes and rough work',
      'Bulk use throughout the year',
    ],
    notIdealFor: ['One subject, single notebook buyers'],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'classmate-notebook-pack'), priceInr: 576, note: 'Amazon India price (pack of 12)' },
      { retailer: 'flipkart', url: dealUrl('flipkart', 'classmate-notebook-pack'), note: 'Compare on Flipkart' },
    ],
    reviews: [
      { author: ' 2nd year, Science', detail: 'Bought once for the year. Paper handles my gel pens perfectly.' },
      { author: ' 1st year, Commerce', detail: 'Cheaper per notebook than the campus store. Easy win.' },
    ],
    featured: true,
  },
  {
    id: 'pilot-v5-pens-pack-10',
    slug: 'pilot-v5-pens-pack-10',
    name: 'Pilot V5 Precision Pens (Pack of 10)',
    brand: 'Pilot',
    category: 'stationery',
    priceInr: 629,
    previousPriceInr: 700,
    rating: 4.7,
    ratingCount: 13210,
    uniSmartScore: 8.9,
    image: 'https://m.media-amazon.com/images/I/61JbSSexYwL._SL1500_.jpg',
    shortRecommendation: 'Smooth pens students keep buying again',
    description:
      'Once you write with a V5, the cheap free-bank pens stop making sense. Liquid-ink smoothness, precise 0.5mm extra-fine tips and a pack of 10 make this the quiet luxury of every serious note-taker.',
    specs: [
      { label: 'Pack size', value: '10 pens' },
      { label: 'Tip', value: '0.5mm extra-fine rollerball' },
      { label: 'Ink', value: 'Pure liquid ink, blue' },
      { label: 'Type', value: 'Hi-Tecpoint V5' },
      { label: 'Colours', value: 'Blue ink' },
    ],
    pros: [
      'Exceptionally smooth writing',
      'Crisp 0.5mm line',
      'Refillable grip section',
    ],
    cons: ['Ink can smudge left-handed', 'Caps can get lost easily'],
    bestFor: [
      'Long writing sessions',
      'Fountain-pen feel on a budget',
      'Exams and careful notes',
    ],
    notIdealFor: ['Left-handed writers who dislike smudging'],
    deals: [
      { retailer: 'amazon', url: dealUrl('amazon', 'pilot-v5-pens-pack-10'), priceInr: 629, note: 'Amazon India price (pack of 10)' },
      { retailer: 'flipkart', url: dealUrl('flipkart', 'pilot-v5-pens-pack-10'), note: 'Check Flipkart offers' },
    ],
    reviews: [
      { author: ' 3rd year, Medical', detail: 'My hand stops cramping with these. Gorgeous lines on this paper.' },
      { author: ' 2nd year, Law', detail: 'Once you switch you never go back. Stocked for the year.' },
    ],
    featured: true,
  },
];

export const PRODUCTS: Product[] = withLivePrices(baseProducts);

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}