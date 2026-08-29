import { PRODUCTS } from '@/data/products';
import type { CategoryId, Product } from '@/lib/types';

export interface Roundup {
  slug: string;
  category: CategoryId | 'all';
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  maxPrice?: number;
  count: number;
  match?: string[];
  exclude?: string[];
  note?: string;
}

export const ROUNDUPS: Roundup[] = [
  {
    slug: 'earbuds-under-1000',
    category: 'audio',
    title: 'Best Earbuds Under ₹1,000 in India',
    metaTitle: '5 Best Earbuds Under ₹1,000 in India (2026)',
    metaDescription:
      'The best truly wireless earbuds under ₹1,000 in India — bass-heavy, battery-friendly and ranked by our UniSmart Score with live Amazon prices.',
    intro:
      'You do not need to spend a fortune for decent wireless earbuds today. Under ₹1,000 you get punchy bass, long case battery life and a pocketable case — enough for daily commutes, lectures and hostel playlists. These are the ones we would actually buy.',
    maxPrice: 1000,
    count: 8,
    match: ['earbud'],
    note: 'In this budget, focus on total battery life and fit. None of these are audiophile grade, but all of them punch well above their price tag.',
  },
  {
    slug: 'earbuds-under-2000',
    category: 'audio',
    title: 'Best Earbuds Under ₹2,000 in India',
    metaTitle: '8 Best Earbuds Under ₹2,000 in India (2026)',
    metaDescription:
      'The best earbuds under ₹2,000 in India — including picks with real noise cancellation, ranked with live prices and honest pros and cons.',
    intro:
      'Step up from the ₹1,000 segment and earbuds start getting serious: better drivers, real noise cancellation on some models, and battery lives that cross 40 hours. If you can stretch your budget to ₹2,000, this is the segment that delivers.',
    maxPrice: 2000,
    count: 8,
    match: ['earbud'],
    note: 'At ₹2,000 the biggest win is going from “just plays music” to “sounds genuinely good”. Prioritise ANC if you live in a noisy hostel or travel by bus.',
  },
  {
    slug: 'smart-watches-under-3000',
    category: 'accessories',
    title: 'Best Smartwatches Under ₹3,000 in India',
    metaTitle: '10 Best Smartwatches Under ₹3,000 in India (2026)',
    metaDescription:
      'The best budget smartwatches under ₹3,000 in India — AMOLED and big-display options with Bluetooth calling, ranked with live prices.',
    intro:
      'Smartwatches under ₹3,000 now come with sharp AMOLED screens, Bluetooth calling, heart-rate tracking and battery lives measured in days, not hours. This is the sweet spot for a first smartwatch that feels expensive without being.',
    maxPrice: 3000,
    count: 10,
    match: ['smartwatch', 'smart watch'],
    note: 'Look for AMOLED displays in this range — they make the biggest visual difference. Bluetooth calling is nice-to-have, not essential.',
  },
  {
    slug: 'smart-watches-under-2000',
    category: 'accessories',
    title: 'Best Smartwatches Under ₹2,000 in India',
    metaTitle: '8 Best Smartwatches Under ₹2,000 in India (2026)',
    metaDescription:
      'The best smartwatches under ₹2,000 in India — Bluetooth calling, fitness tracking and long battery life, ranked with live Amazon prices.',
    intro:
      'Just over one to two thousand rupees gets you a smartwatch with calling, notifications, step and heart-rate tracking. Screens are mostly LCD here, so choose for battery life and build — these are the picks that balance it best.',
    maxPrice: 2000,
    count: 8,
    match: ['smartwatch', 'smart watch'],
    note: 'Under ₹2,000 screens are usually LCD. Pick for battery and comfort first; the AMOLED upgrade is worth the jump if you can afford the ₹3,000 tier.',
  },
  {
    slug: 'fitness-bands',
    category: 'all',
    title: 'Best Fitness Bands for Students in India',
    metaTitle: 'Best Fitness Bands in India (2026)',
    metaDescription:
      'The best fitness and smart bands in India — long battery life, heart-rate and SpO2 tracking, ranked for students who want to hit 10k steps.',
    intro:
      'If you just want steps, sleep and heart rate without a bulky screen, a fitness band beats a smartwatch on price and battery. The options here last weeks on one charge and the best ones track all-day health metrics without nagging.',
    count: 8,
    match: ['fitness band', 'smart band'],
    exclude: ['neckband'],
    note: 'Bands live and die by battery and accuracy. Anything promising a month of battery with solid HR/SpO2 tracking is a keeper for campus life.',
  },
  {
    slug: 'laptops-under-50000',
    category: 'laptops',
    title: 'Best Laptops Under ₹50,000 in India',
    metaTitle: 'Best Laptops Under ₹50,000 in India (2026)',
    metaDescription:
      'The best laptops under ₹50,000 in India for college — Ryzen and i5 options for notes, coding and projects, with live prices from Amazon.',
    intro:
      'Under ₹50,000 you can get a new laptop with a modern Intel or AMD chip, a full-HD display and enough RAM for college life — notes, browsing, coding and the odd movie night. These are the models that survive four years of classes.',
    maxPrice: 50000,
    count: 8,
    note: 'At this price, prioritise RAM (16GB if you can) and a good keyboard over looks. A light machine you actually carry beats a heavy “powerful” one.',
  },
  {
    slug: 'laptops-under-60000',
    category: 'laptops',
    title: 'Best Laptops Under ₹60,000 in India',
    metaTitle: '8 Best Laptops Under ₹60,000 in India (2026)',
    metaDescription:
      'The best laptops under ₹60,000 in India for students — including gaming-capable RTX models, ranked with spec points and live prices.',
    intro:
      'At ₹60,000 the laptop market opens right up: premium thin-and-lights, and gaming machines with real dedicated GPUs that also handle coding and editing. Whether you want portability or power, this list covers the best of both.',
    maxPrice: 60000,
    count: 8,
    note: 'Decide first: portability or GPU power? Under ₹60,000 you usually choose one — and either choice is valid depending on your course and gaming habits.',
  },
  {
    slug: 'power-banks',
    category: 'power-charging',
    title: 'Best Power Banks for Students in India',
    metaTitle: 'Best Power Banks in India (2026)',
    metaDescription:
      'The best power banks in India — 10000mAh to 20000mAh with fast charging, ranked with live prices. Perfect for hostels, lectures and travel.',
    intro:
      'Every student knows the panic of a 1% battery before a lecture. A good power bank fixes that forever. The list below covers compact 10k banks you can pocket and 20k monsters that can also charge a laptop.',
    count: 8,
    match: ['power bank'],
    note: 'Bigger is not always better — decide between pocketable 10k and laptop-charging 20k. Fast charging (22.5W+) matters more than raw mAh for daily use.',
  },
  {
    slug: 'gan-chargers',
    category: 'power-charging',
    title: 'Best 65W GaN Chargers for Laptops in India',
    metaTitle: 'Best GaN Chargers in India (2026)',
    metaDescription:
      'Best GaN fast chargers in India — one small charger for your laptop, phone and earbuds, with live prices and port breakdowns.',
    intro:
      'A GaN charger replaces the tangle of laptop bricks and phone adapters with one pocketable 65W block. Charge your laptop, phone and earbuds from a single hostel socket — these are the ones that do it reliably.',
    count: 8,
    match: ['gan'],
    note: 'Make sure total wattage covers your laptop’s needs (most USBC laptops take 60-65W). Two C ports + one A port is the configuration that actually ends desk clutter.',
  },
  {
    slug: 'travel-adapters',
    category: 'power-charging',
    title: 'Best Travel Adapters for Students in India',
    metaTitle: 'Best Universal Travel Adapters in India (2026)',
    metaDescription:
      'The best universal travel adapters in India — plug into sockets abroad, charge laptops and skip the extension board, with live prices.',
    intro:
      'Heading abroad for studies or an exchange trip? A universal travel adapter means your Indian chargers work anywhere — and the right one charges your laptop too. These picks cover international sockets without burning a hole in your budget.',
    count: 8,
    match: ['travel'],
    exclude: ['cable', 'braided', 'coiled', 'magnetic'],
  },
  {
    slug: 'desk-lamps',
    category: 'study-setup',
    title: 'Best Study Desk Lamps for Students in India',
    metaTitle: 'Best Desk Lamps for Study in India (2026)',
    metaDescription:
      'The best LED study lamps in India — flicker-free light, colour modes and USB-rechargeable options, ranked with live prices.',
    intro:
      'Studying under a ceiling light at 1am is a recipe for sore eyes. A proper desk lamp with warm, flicker-free light changes how long you can focus. These are the lamps that make late-night sessions comfortable.',
    count: 8,
    match: ['lamp'],
    note: 'Prioritise flicker-free LED and adjustable colour temperature for reading and screen work. USB-rechargeable lamps survive power cuts — a real hostel perk.',
  },
  {
    slug: 'laptop-stands',
    category: 'study-setup',
    title: 'Best Laptop Stands in India for Students',
    metaTitle: 'Best Laptop Stands in India (2026)',
    metaDescription:
      'The best adjustable laptop stands in India — ergonomic, foldable and travel-friendly, ranked with live prices for studying and typing.',
    intro:
      'A laptop stand raises your screen to eye level, fixes your posture and keeps your neck happy through long typing sessions. Every option here folds flat for your backpack and many double as cooling platforms.',
    count: 8,
    match: ['laptop stand', 'laptop riser', 'notebook riser', 'tabletop notebook', 'laptop/desktop'],
    note: 'Look for 6+ tilt angles and aluminium build if you type a lot. A stand plus a wireless keyboard is the classic student desk upgrade.',
  },
  {
    slug: 'mechanical-keyboards',
    category: 'study-setup',
    title: 'Best Budget Mechanical Keyboards in India',
    metaTitle: 'Best Mechanical Keyboards Under ₹2,000 in India (2026)',
    metaDescription:
      'Best budget mechanical keyboards in India — clicky and silent hot-swappable options for coding, essays and gaming, with live prices.',
    intro:
      'Mechanical keyboards feel dramatically better to type on and, at these prices, make a real difference over a full academic year of essays and code. This roundup favours hot-swappable switches so you can fix a bad key instead of buying a new board.',
    maxPrice: 2000,
    count: 8,
    match: ['mechanical', 'semi-mechanical'],
    exclude: ['membrane'],
    note: 'Hot-swappable switches are the single most useful feature in the budget tier — a broken switch stops being a paperweight. Red (linear) switches are quietest for hostels.',
  },
  {
    slug: 'wireless-mice',
    category: 'all',
    title: 'Best Wireless Mice for Students in India',
    metaTitle: 'Best Wireless Mice in India (2026)',
    metaDescription:
      'Best wireless mice in India — quiet clicks, long battery life and pocket-friendly sizes, ranked with live prices for study and work.',
    intro:
      'A decent mouse beats a laptop trackpad for every essay, spreadsheet and late-night assignment. These wireless mice are quiet enough for libraries, light enough for sleeves and last months on a single battery.',
    count: 8,
    match: ['mouse', 'mice'],
    note: 'For study use, value silence and battery life over gaming DPI. A flat Bluetooth mouse also pairs instantly with tablets.',
  },
  {
    slug: 'monitors-for-study',
    category: 'monitors',
    title: 'Best Monitors for Students in India',
    metaTitle: 'Best Monitors for Study in India (2026)',
    metaDescription:
      'Best monitors in India for students — 24 and 27-inch IPS displays with high refresh rates, ranked with live prices.',
    intro:
      'One laptop screen is never enough by second year. A 24 or 27-inch IPS monitor at 100Hz or higher turns split-screen research, code and notes into a daily joy. These are the monitors that give the most screen per rupee.',
    count: 8,
    note: 'You only need one monitor for study: 24-inch FHD IPS is the value sweet spot, and 27-inch is worth it if you stare at spreadsheets or design software all day.',
  },
  {
    slug: 'tablets-under-25000',
    category: 'tablets',
    title: 'Best Tablets Under ₹25,000 in India',
    metaTitle: 'Best Tablets Under ₹25,000 in India (2026)',
    metaDescription:
      'The best tablets under ₹25,000 in India for notes, PDFs and Netflix — big 2.5K displays and long battery, ranked with live prices.',
    intro:
      'A tablet under ₹25,000 gives you a big-screen companion for lecture PDFs, handwritten notes and post-class Netflix. The best picks here have sharp 2.5K displays and speakers that actually fill a room.',
    maxPrice: 25000,
    count: 8,
    note: 'If it is mainly for reading and media, prioritise display and speakers over raw specs. Add a stylus-friendly model only if you plan to take handwritten notes daily.',
  },
  {
    slug: 'laptop-backpacks',
    category: 'backpacks',
    title: 'Best Laptop Backpacks in India',
    metaTitle: 'Best Laptop Backpacks with Rain Cover in India (2026)',
    metaDescription:
      'The best college laptop backpacks in India — padded 15.6-inch sleeves, rain covers and real capacity, ranked with live prices.',
    intro:
      'Your backpack carries your laptop, your books and your dignity through every monsoon. All of these have padded laptop sleeves and rain covers — the two features that decide whether your electronics survive the commute.',
    count: 8,
    match: ['backpack'],
    note: 'Check the laptop sleeve fit first: most fit 15.6-inch, but a few are tight for thick gaming machines. A rain cover turns a bad day into a non-event.',
  },
  {
    slug: 'electric-kettles',
    category: 'hostel-essentials',
    title: 'Best Electric Kettles in India for Hostel Life',
    metaTitle: 'Best Electric Kettles in India (2026)',
    metaDescription:
      'Best electric kettles in India — fast boiling, auto cut-off and ISI-certified stainless steel for chai, maggi and coffee, with live prices.',
    intro:
      'The electric kettle is the hardest-working appliance in any Indian hostel. These models boil water in under two minutes, switch off automatically and are built from stainless steel — the essentials you should never compromise on.',
    count: 8,
    match: ['kettle'],
    note: 'Prioritise ISI certification, automatic cut-off and cool-touch handles. A 1.2-1.8L stainless body is the sweet spot for speed and capacity.',
  },
  {
    slug: 'water-bottles',
    category: 'hostel-essentials',
    title: 'Best Steel Water Bottles for Students in India',
    metaTitle: 'Best Stainless Steel Water Bottles in India (2026)',
    metaDescription:
      'Best stainless steel water bottles in India — leak-proof, rust-proof and ISI certified, ranked with live prices for campus and hostel.',
    intro:
      'A good steel bottle ends the plastic-bottle cycle and keeps water cold through a long day of classes. These are leak-proof, rust-proof and built to survive being knocked around a hostel room.',
    count: 8,
    match: ['bottle'],
    exclude: ['lunch box'],
  },
  {
    slug: 'notebooks',
    category: 'stationery',
    title: 'Best Notebooks for Students in India',
    metaTitle: 'Best Notebooks for College in India (2026)',
    metaDescription:
      'Best notebooks for college in India — 172-page soft bounds and spiral options that take gel ink without bleeding, with live prices.',
    intro:
      'One subject, one notebook — the buying trick that keeps your bag light all semester. These picks take gel and ballpoint ink cleanly, hold 172+ pages and work out cheapest when bought in a pack.',
    count: 8,
    match: ['notebook', 'book'],
  },
  {
    slug: 'gel-pens',
    category: 'stationery',
    title: 'Best Gel Pens for Students in India',
    metaTitle: 'Best Gel Pens for Students in India (2026)',
    metaDescription:
      'Best gel pens in India — smudge-free 0.5-0.6mm writing that stops hand cramps, ranked with live prices for exams and notes.',
    intro:
      'Once you write with a proper gel pen, cheap promotional pens stop making sense. Smudge-free liquid ink, a fine tip and a grip that stops hand cramps — these are the pens worth buying in bulk before exam season.',
    count: 8,
    match: ['pen'],
    exclude: ['case', 'pencil', 'box', 'notebook'],
  },
];

export function getRoundupBySlug(slug: string): Roundup | undefined {
  return ROUNDUPS.find((roundup) => roundup.slug === slug);
}

export function getRoundupPicks(roundup: Roundup): Product[] {
  const matchTerms = (roundup.match ?? []).map((term) => term.toLowerCase());
  const excludeTerms = (roundup.exclude ?? []).map((term) => term.toLowerCase());

  const filtered = PRODUCTS.filter((product) => {
    if (roundup.category !== 'all' && product.category !== roundup.category) {
      return false;
    }
    if (roundup.maxPrice !== undefined && product.priceInr > roundup.maxPrice) {
      return false;
    }
    const haystack =
      `${product.name} ${product.shortRecommendation} ${product.brand}`.toLowerCase();
    if (excludeTerms.some((term) => haystack.includes(term))) return false;
    if (matchTerms.length > 0 && !matchTerms.some((term) => haystack.includes(term))) {
      return false;
    }
    return true;
  });

  return filtered
    .slice()
    .sort(
      (a, b) =>
        b.uniSmartScore - a.uniSmartScore ||
        b.rating - a.rating ||
        b.ratingCount - a.ratingCount,
    )
    .slice(0, roundup.count);
}