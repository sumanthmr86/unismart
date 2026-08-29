import type { BuyingGuide } from '@/lib/types';

export const GUIDES: BuyingGuide[] = [
  {
    id: 'best-earbuds-under-1500',
    slug: 'best-earbuds-under-1500',
    title: 'Best Earbuds Under ₹1500',
    category: 'audio',
    excerpt:
      'Real ANC, deep bass or the best call quality — the best budget earbuds in India, picked for hostel life.',
    publishedOn: '2026-08-12',
    readMinutes: 6,
    intro:
      "The sub-₹1500 earbud market is India's busiest, and most of it is marketing noise. We filtered it down to the picks students actually enjoy using daily — ranked on sound, battery, mic quality and how they survive a hostel week.",
    sections: [
      {
        heading: 'What to check under ₹1500',
        body: 'Stick to a few priorities: battery life over soundstage, IPX4 water resistance for rain commutes, and a low-latency mode if you game. Skip claims of "studio bass" — at this price you are buying convenience first.',
      },
      {
        heading: 'Budget pick: boAt Airdopes 141',
        body: 'When the price drops hard, the Airdopes 141 is the easiest wallet-out buy. Bass-forward sound and a long total battery cover 90% of casual listeners. Just don\'t expect crisp mics.',
        productIds: ['boat-airdopes-141'],
      },
      {
        heading: 'Best overall: OnePlus Nord Buds 3',
        body: 'Real active noise cancellation under ₹2000 (and often under ₹1500 on sale) puts the Nord Buds 3 in a league of its own. Balanced sound, comfy fit and a dependable case make it the default recommendation.',
        productIds: ['oneplus-nord-buds-3'],
      },
      {
        heading: 'Step-up pick: realme Buds Air 6 Pro',
        body: 'If your budget creeps past ₹1500 occasionally and you want dual drivers plus stronger ANC, the Buds Air 6 Pro is the sensible step-up. Great for students who live on calls.',
        productIds: ['realme-buds-air-6-pro'],
      },
    ],
    picks: [
      { label: 'Best Overall', productId: 'oneplus-nord-buds-3', reason: 'Balanced everything, real ANC, great value on sale.' },
      { label: 'Best Budget', productId: 'boat-airdopes-141', reason: 'Unbeatable price for casual listeners who want bass.' },
      { label: 'Best Step-Up', productId: 'realme-buds-air-6-pro', reason: 'Dual drivers and stronger ANC when budget allows.' },
    ],
    tips: [
      'Buy earbuds during sale weeks — ₹1500 picks often drop below ₹1200.',
      'Check if the case supports type-C — hostel cables are usually type-C.',
      'IPX4 ratings matter more than big drivers for campus life.',
    ],
    faq: [
      { q: 'Is ANC actually useful in cheap earbuds?', a: 'On the Nord Buds 3, yes — it meaningfully cuts hostel fan noise and bus rumble. On ₹500 earbuds, treat ANC claims as theatre.' },
      { q: 'Do I need low-latency mode for gaming?', a: 'Only for competitive games. For BGMI and casual play, any half-decent earbud is fine.' },
    ],
  },
  {
    id: 'best-laptops-for-college-students',
    slug: 'best-laptops-for-college-students',
    title: 'Best Laptops for College Students',
    category: 'laptops',
    excerpt:
      'Balanced picks for notes, coding, editing and occasional gaming — without overpaying for power you will not use.',
    publishedOn: '2026-08-05',
    readMinutes: 8,
    intro:
      'Most students overbuy laptops, then drain their pockets for a GPU they never use. This guide matches realistic workloads — notes, browsing, the odd MATLAB or Premiere project — to the right machine across three budgets.',
    sections: [
      {
        heading: 'Figure out your real workload first',
        body: 'Write down what your course actually needs before looking at specs. Arts and commerce students rarely need a discrete GPU. Engineering and design students should prioritise RAM and screen quality before raw speed.',
      },
      {
        heading: 'The value pick: HP Victus 15',
        body: 'If you want one machine for coding, editing and gaming, the Victus 15 with a 144Hz panel punches above its price. It is heavier than ultrabooks, so treat it as a desk-and-backpack companion, not a shoulder ornament.',
        productIds: ['hp-victus-15'],
      },
      {
        heading: 'The reliable all-rounder: Lenovo IdeaPad Slim 3',
        body: 'For notes, browsing and light work, the IdeaPad Slim 3 is the safe, sensible buy. Light enough to carry daily, with battery that outlasts a full day of classes. Perfect for first-years.',
        productIds: ['lenovo-ideapad-slim-3'],
      },
      {
        heading: 'Why you might not need to spend ₹60k+',
        body: 'For most non-engineering degrees, spend the savings on a good tablet, a monitor or Wi-Fi. A ₹35-45k laptop covers notes, media and office work for four years with zero pain.',
        productIds: ['redmi-pad-se'],
      },
    ],
    picks: [
      { label: 'Best Overall Value', productId: 'hp-victus-15', reason: 'Game, code and edit on a 144Hz screen at a rare price.' },
      { label: 'Best For Notes & Classes', productId: 'lenovo-ideapad-slim-3', reason: 'Light, quiet and battery-friendly for a full day.' },
      { label: 'Best Companion', productId: 'redmi-pad-se', reason: 'A tablet extends your laptop instead of replacing it.' },
    ],
    tips: [
      'Buy 16GB RAM if you can — upgrade later costs more.',
      'Check hostel rules before choosing desktop-replacement-sized laptops.',
      'Watch for bank-offer discounts; they often beat the sticker deal.',
    ],
    faq: [
      { q: 'Do students really need 8GB or 16GB RAM?', a: '8GB is survivable for notes and browsing. For engineering coursework and lots of browser tabs, 16GB is the happier life.' },
      { q: 'Should I buy during the academic year start sales?', a: 'July-August brings the biggest student discounts, but Diwali and Amazon/Flipkart sale weeks are close seconds.' },
    ],
  },
  {
    id: 'best-backpacks-for-college',
    slug: 'best-backpacks-for-college',
    title: 'Best Backpacks for College',
    category: 'backpacks',
    excerpt:
      'Laptop slots, rain survival and space for a tiffin box — the backpacks that carry you through college.',
    publishedOn: '2026-07-28',
    readMinutes: 5,
    intro:
      'A good college backpack meets three tests: it protects your laptop, it survives Indian weather, and it looks fine at 8am lectures. Here are the two picks that pass all three without breaking the budget.',
    sections: [
      {
        heading: 'What a college backpack really needs',
        body: 'Start with a padded laptop compartment that fits your actual screen size. Add a water-repellent outer, at least one front organizer pocket, and straps that do not dig in during a full-day schedule.',
      },
      {
        heading: 'Best budget: Skybags Brat 25L',
        body: 'The Brat is the proven campus crowd-pleaser — affordable, durable and it fits a 15.6-inch laptop with room for books and lunch. Thin back padding is the only real compromise.',
        productIds: ['skybags-brat-backpack'],
      },
      {
        heading: 'Best premium: American Tourister 30L',
        body: 'For students who want one bag for four years, the American Tourister 30L brings real organization, comfortable straps and a build that shrugs off hostel abuse.',
        productIds: ['american-tourister-30l-backpack'],
      },
    ],
    picks: [
      { label: 'Best Budget', productId: 'skybags-brat-backpack', reason: 'The campus default at a price that is hard to argue with.' },
      { label: 'Best Long-Term', productId: 'american-tourister-30l-backpack', reason: 'Organized, comfy and built to last all four years.' },
    ],
    tips: [
      'Buy backpacks in June-July when school/college-season deals land.',
      'Check that the laptop sleeve fits snugly — loose slots mean more bounce.',
      'Pack the heavy laptop closest to your back to protect your posture.',
    ],
    faq: [
      { q: 'Can a 25L backpack really hold a laptop and books?', a: 'Yes for a single semester load: 15.6-inch laptop, 3-4 notebooks and a tiffin. Anything bigger and step up to 30L.' },
    ],
  },
  {
    id: 'best-power-banks-and-chargers',
    slug: 'best-power-banks-and-chargers',
    title: 'Best Power Banks & Chargers for Students',
    category: 'power-charging',
    excerpt:
      'Hostel power cuts and one charging socket — how to keep a phone, laptop and earbuds alive all day.',
    publishedOn: '2026-07-20',
    readMinutes: 6,
    intro:
      'The average hostel day has more devices than sockets. This guide covers the exact tools that end the daily charging scramble: a dependable power bank and a fast GaN charger for everything.',
    sections: [
      {
        heading: 'Why 10000mAh is the sweet spot',
        body: 'It tops a typical phone twice, adds barely any weight to a backpack, and fits hostel rules better than giant bricks. Bigger banks charge laptops slowly and weigh a ton — only buy one if you truly need it.',
      },
      {
        heading: 'Best power bank: Xiaomi Mi 3i 10000',
        body: 'The Mi Power Bank 3i is the safest purchase in the category — proven cells, solid build, and 18W output for a phone-sized top-up on the go.',
        productIds: ['mi-power-bank-3i-10000'],
      },
      {
        heading: 'The charger upgrade: Ambrane 65W GaN',
        body: 'One GaN charger replaces the laptop adapter, the phone brick and the earbud plug. If your laptop charges over USB-C, this collapses desk clutter to a single small brick.',
        productIds: ['ambrane-65w-gan-charger'],
      },
    ],
    picks: [
      { label: 'Best Power Bank', productId: 'mi-power-bank-3i-10000', reason: 'Reliable, compact and the market default for a reason.' },
      { label: 'Best Charger', productId: 'ambrane-65w-gan-charger', reason: 'One brick for laptop, phone and earbuds.' },
    ],
    tips: [
      'Keep a 1.5m type-C cable — it is the most borrowed item in a hostel.',
      'Surge-protected extension boards protect chargers during voltage dips.',
      'Buy power banks before monsoon; delivery times stretch during outages.',
    ],
    faq: [
      { q: 'Can one charger charge a laptop and a phone together?', a: 'Yes — on a 65W multi-port charger both share the total wattage. Avoid heavy tasks while the laptop charges.' },
    ],
  },
  {
    id: 'best-study-setup-products',
    slug: 'best-study-setup-products',
    title: 'Best Study Setup Products',
    category: 'study-setup',
    excerpt:
      'Building a desk that makes 8-hour study days easier — lamps, keyboards and monitors that pay for themselves.',
    publishedOn: '2026-07-11',
    readMinutes: 6,
    intro:
      'Your study desk is where hours of your week disappear. Small upgrades — a flicker-free lamp, a quiet keyboard and a second screen — compound into better focus, better eyes and better posture.',
    sections: [
      {
        heading: 'Light first, everything else second',
        body: 'Studying under a tube light at midnight is how headaches start. A flicker-free LED lamp with adjustable warmth is the highest-impact rupee you can spend on your desk.',
        productIds: ['wipro-garnet-led-desk-lamp'],
      },
      {
        heading: 'Quiet peripherals for shared rooms',
        body: 'Hostel roommates rarely sleep on the same schedule. A silent mouse and a soft-keys keyboard let you keep working without a mutiny at midnight.',
        productIds: ['logitech-pebble-2-m350s', 'logitech-mk235-combo'],
      },
      {
        heading: 'The second screen that changes everything',
        body: 'Notes on one display, work on the other. A budget 24-inch IPS monitor is the biggest productivity win available for under ₹9000.',
        productIds: ['lg-24ml600s-monitor'],
      },
    ],
    picks: [
      { label: 'Best Lamp', productId: 'wipro-garnet-led-desk-lamp', reason: 'Flicker-free and eye-kind for late-night sessions.' },
      { label: 'Best Keyboard', productId: 'logitech-mk235-combo', reason: 'Quiet, long-lasting and roommate-proof.' },
      { label: 'Best Upgrade', productId: 'lg-24ml600s-monitor', reason: 'A second screen is the ultimate focus boost.' },
    ],
    tips: [
      'Angle lamps to avoid screen glare — light your desk, not your monitor.',
      'Sit with elbows at 90 degrees; a cheap upright binder under a laptop fixes posture.',
      'Blue-ish light for deep work, warm light 30 minutes before sleeping.',
    ],
    faq: [
      { q: 'Do I need an ergonomic chair first?', a: 'A decent chair matters most if you sit for 6+ hours. If space is tight, fix monitor height and posture before buying anything else.' },
    ],
  },
  {
    id: 'hostel-essentials-every-student-needs',
    slug: 'hostel-essentials-every-student-needs',
    title: 'Hostel Essentials Every Student Needs',
    category: 'hostel-essentials',
    excerpt:
      'The small, cheap upgrades that transform a bare hostel room into a liveable one — from chai to surge protection.',
    publishedOn: '2026-06-30',
    readMinutes: 5,
    intro:
      "Hostel rooms start with a bed, a table and one charging socket. Most students discover the gaps the hard way — via cold water, empty batteries and midnight hunger. This guide lists the essentials worth buying in week one.",
    sections: [
      {
        heading: 'The appliance that pays for itself',
        body: 'A small electric kettle pays for itself within a fortnight of replacing canteen chai and instant noods. Compact, fast and shock-proof — the single highest-value hostel purchase.',
        productIds: ['prestige-electric-kettle-0-8l'],
      },
      {
        heading: 'Fix the socket problem',
        body: 'One outlet never survives contact with a phone charger, a lamp and a friend. A surge-protected extension board protects both your gadgets and your roommate patience.',
        productIds: ['havells-extension-board-4-socket'],
      },
      {
        heading: 'Survive power cuts and long days',
        body: 'Between morning lectures and evening library runs, a 10000mAh power bank covers the gap when the hostel board goes out.',
        productIds: ['mi-power-bank-3i-10000'],
      },
    ],
    picks: [
      { label: 'Best First Buy', productId: 'prestige-electric-kettle-0-8l', reason: 'Chai, maggi and oats — instant relief in a hostel.' },
      { label: 'Best Gadget Insurance', productId: 'havells-extension-board-4-socket', reason: 'Surge protection ends voltage-dip heart attacks.' },
      { label: 'Best Power Backup', productId: 'mi-power-bank-3i-10000', reason: 'Keeps your phone alive through hostel outages.' },
    ],
    tips: [
      'Check the hostel appliance policy before buying kettles or hotplates.',
      'Label your chargers and power banks — hostel lending is aggressive.',
      'Buy a small first-aid kit and a torch; nobody regrets either.',
    ],
    faq: [
      { q: 'Is a kettle allowed in hostels?', a: 'Many hostels allow low-wattage kettles. Confirm with the warden first — a ₹50 fine is not worth a ₹900 kettle.' },
    ],
  },
  {
    id: 'best-tablets-for-students',
    slug: 'best-tablets-for-students',
    title: 'Best Tablets for Students',
    category: 'tablets',
    excerpt:
      'PDFs, notes and lectures on one big screen — the tablets that make sense for campus life, ranked.',
    publishedOn: '2026-06-18',
    readMinutes: 5,
    intro:
      'A tablet is the best "second screen" a student can own — lighter than a laptop for lectures and notes, better than a phone for PDFs. Here are the picks that actually make sense for Indian students right now.',
    sections: [
      {
        heading: 'Laptop plus tablet, or tablet instead of laptop?',
        body: 'A tablet extends a laptop beautifully but rarely replaces one — spreadsheets and code still want a keyboard and OS. Buy a tablet as the companion, not the substitute.',
      },
      {
        heading: 'Best budget: Redmi Pad SE',
        body: 'The Redmi Pad SE nails the basics — big 90Hz display, quad speakers, and battery that outlasts a full day. For PDFs, notes and media, it is all you need.',
        productIds: ['redmi-pad-se'],
      },
      {
        heading: 'Best media and notes: Samsung Galaxy Tab A9+',
        body: 'The A9+ adds a smoother 90Hz panel and tuned speakers, with room to grow storage. Students who live in Google Docs and YouTube lectures will feel the upgrade.',
        productIds: ['samsung-galaxy-tab-a9'],
      },
    ],
    picks: [
      { label: 'Best Budget', productId: 'redmi-pad-se', reason: 'Huge screen, long battery, unbeatable price.' },
      { label: 'Best Media Pick', productId: 'samsung-galaxy-tab-a9', reason: 'Better screen, speakers and storage headroom.' },
    ],
    tips: [
      'Buy a matte screen protector for PDF-heavy reading.',
      'A cheap folio stand beats a dedicated keyboard for most note-takers.',
      'Check if your college Wi-Fi portal has an app — tablets love captive networks.',
    ],
    faq: [
      { q: 'Can a tablet replace my laptop for engineering?', a: 'Not for coding or AutoCAD. Use it as a companion — one screen for notes, the other for the actual work.' },
    ],
  },
];

export function getGuideBySlug(slug: string): BuyingGuide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}