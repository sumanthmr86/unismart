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
        productIds: ['realme-buds-air-8-pro'],
      },
    ],
    picks: [
      { label: 'Best Overall', productId: 'oneplus-nord-buds-3', reason: 'Balanced everything, real ANC, great value on sale.' },
      { label: 'Best Budget', productId: 'boat-airdopes-141', reason: 'Unbeatable price for casual listeners who want bass.' },
      { label: 'Best Step-Up', productId: 'realme-buds-air-8-pro', reason: 'Dual drivers and stronger ANC when budget allows.' },
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
        heading: 'Capacity: from phone top-ups to laptop rescue',
        body: 'A 10000mAh bank tops a typical phone twice and slips into a backpack. If you also carry a laptop and earbuds, step up to a 20000mAh bank with fast charging — it handles phones, tablets, laptops and earbuds without drama.',
      },
      {
        heading: 'Best power bank: Xiaomi Power Bank 5i 20000mAh',
        body: 'The Xiaomi Power Bank 5i is the safest purchase in the category — proven cells, solid build, and 67W turbo output that can top up a phone in minutes and even charge a laptop.',
        productIds: ['xiaomi-power-bank-5i-20000'],
      },
      {
        heading: 'The charger upgrade: Ambrane 65W GaN',
        body: 'One GaN charger replaces the laptop adapter, the phone brick and the earbud plug. If your laptop charges over USB-C, this collapses desk clutter to a single small brick.',
        productIds: ['ambrane-65w-gan-charger'],
      },
    ],
    picks: [
      { label: 'Best Power Bank', productId: 'xiaomi-power-bank-5i-20000', reason: 'Reliable, fast and the market default for a reason.' },
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
        productIds: ['prestige-electric-kettle-1-5l'],
      },
      {
        heading: 'Fix the socket problem',
        body: 'One outlet never survives contact with a phone charger, a lamp and a friend. A surge-protected extension board protects both your gadgets and your roommate patience.',
        productIds: ['havells-extension-board-4-socket'],
      },
      {
        heading: 'Survive power cuts and long days',
        body: 'Between morning lectures and evening library runs, a power bank covers the gap when the hostel board goes out — the 20000mAh Xiaomi 5i even keeps a laptop alive.',
        productIds: ['xiaomi-power-bank-5i-20000'],
      },
    ],
    picks: [
      { label: 'Best First Buy', productId: 'prestige-electric-kettle-1-5l', reason: 'Chai, maggi and oats — instant relief in a hostel.' },
      { label: 'Best Gadget Insurance', productId: 'havells-extension-board-4-socket', reason: 'Surge protection ends voltage-dip heart attacks.' },
      { label: 'Best Power Backup', productId: 'xiaomi-power-bank-5i-20000', reason: 'Keeps your phone (and laptop) alive through hostel outages.' },
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
        productIds: ['samsung-galaxy-tab-a11-plus'],
      },
    ],
    picks: [
      { label: 'Best Budget', productId: 'redmi-pad-se', reason: 'Huge screen, long battery, unbeatable price.' },
      { label: 'Best Media Pick', productId: 'samsung-galaxy-tab-a11-plus', reason: 'Better screen, speakers and storage headroom.' },
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
  {
    id: 'best-earbuds-for-calls',
    slug: 'best-earbuds-for-calls',
    title: 'Best Earbuds for Calls in India',
    category: 'audio',
    excerpt:
      'If your earbuds exist for hostel WhatsApp calls and lecture recordings, pick for mics, not bass. The picks that hear you clearly.',
    publishedOn: '2026-08-24',
    readMinutes: 5,
    intro:
      'Most cheap earbuds are tuned for music and forget the "call" half of "calls-music". If long family calls, group-study syncs and morning stand-ups are your main use, mic count and clarity beat bass any day. These are the picks that keep you audible.',
    sections: [
      {
        heading: 'What makes an earbud good for calls',
        body: 'Look for two or more microphones per bud, an ENC or CVC noise-cancellation label for calls, and a stem design that places mics closer to your mouth. IPX4 helps when you take calls on the walk to class.',
      },
      {
        heading: 'Best value with real mics: OnePlus Nord Buds 3r',
        body: 'Dual microphones with clear-call processing make the 3r a sleeper pick for voice. The 54-hour total battery means one charge covers a full week of calls and music.',
        productIds: ['oneplus-nord-buds-3r-tws-earbuds-up-to-54'],
      },
      {
        heading: 'Quad-mic champion: Noise Buds N1',
        body: 'Quad-mic with ENC call processing is exactly what a noisy hostel needs — the N1 shrinks background chatter so your voice comes through. It is also the smallest budget footprint in this list.',
        productIds: ['noise-buds-n1-truly-wireless-earbuds-with-chrome-finish'],
      },
      {
        heading: 'When call clarity is the whole budget',
        body: 'The Nord Buds 3 adds real call-mic tech to real noise cancellation under ₹2,000. If you take calls in buses and libraries, the mic separation is worth the small stretch.',
        productIds: ['oneplus-nord-buds-3'],
      },
    ],
    picks: [
      { label: 'Best Overall Calls', productId: 'oneplus-nord-buds-3', reason: 'Real ANC plus dependable call mics under ₹2,000.' },
      { label: 'Best Value', productId: 'oneplus-nord-buds-3r-tws-earbuds-up-to-54', reason: 'Dual mics, clear-call processing, 54-hour battery.' },
      { label: 'Best Budget Mics', productId: 'noise-buds-n1-truly-wireless-earbuds-with-chrome-finish', reason: 'Quad mics with ENC at a very low price.' },
    ],
    tips: [
      'Test call quality with a friend before the return window closes — mic quality is marketed, not guaranteed.',
      'Buds with stems sit the mics closer to your mouth than bullet-style buds.',
      'If your phone has two mics, prefer a pair that does not clash with the phone\'s own noise cancellation.',
    ],
    faq: [
      { q: 'Do earbuds with ANC also muffle my voice on calls?', a: 'ANC cancels noise going INTO your ear; ENC/CVC cancels noise coming out of your mic. Both help, but on a bus the ENC number decides whether people hear you.' },
      { q: 'Is a neckband better than earbuds for calls?', a: 'Neckbands put mics near your collar, which often sounds better indoors — but earbuds with quad mics now match them outdoors.' },
    ],
  },
  {
    id: 'best-budget-smartwatches',
    slug: 'best-budget-smartwatches',
    title: 'Best Budget Smartwatches in India',
    category: 'accessories',
    excerpt:
      'Notification mirror, step counter and Bluetooth calling — the smartwatches under ₹3,000 that do not feel like toys.',
    publishedOn: '2026-08-20',
    readMinutes: 6,
    intro:
      'The budget smartwatch market is crowded with indistinguishable options. This guide narrows it to watches where the screen, battery and calling actually hold up to daily campus use — so you buy once and stop scrolling.',
    sections: [
      {
        heading: 'AMOLED or LCD — the first fork',
        body: 'Above ~₹2,000 you can get an AMOLED watch with a bright, colourful always-on display — the biggest visual difference in the category. Below that, choose for battery and build instead.',
        productIds: ['fastrack-limitless-fs2-pro-1-96-amoled-smart-watch'],
      },
      {
        heading: 'Best under ₹1,600: boAt Storm Call 4',
        body: 'Bluetooth calling and a bright screen at a price that is hard to argue with. The Storm Call 4 is the value pick for a first smartwatch that just works.',
        productIds: ['boat-storm-call-4-india-s-first-smartwatch-with'],
      },
      {
        heading: 'Best around ₹2,500: Noise Pulse 4 Max',
        body: 'Push past ₹2,000 and budget watches get larger AMOLED displays, smoother workouts tracking and smarter health metrics. The Pulse 4 Max is the best feature-per-rupee in this tier.',
        productIds: ['noise-pulse-4-max-smart-watch-with-ai-create'],
      },
      {
        heading: 'The classic-round case: Fire-Boltt Phoenix Pro',
        body: 'Prefer a round, classic-looking dial? The Phoenix Pro keeps the smartwatch features but looks more like a regular watch — a closer fit for formals and presentations.',
        productIds: ['fire-boltt-phoenix-pro-round-smart-watch-1-39'],
      },
    ],
    picks: [
      { label: 'Best Under ₹1,600', productId: 'boat-storm-call-4-india-s-first-smartwatch-with', reason: 'Calling, notifications and a bright screen at a real budget price.' },
      { label: 'Best Overall Budget', productId: 'noise-pulse-4-max-smart-watch-with-ai-create', reason: 'AMOLED display and the best feature set around ₹2,500.' },
      { label: 'Best Classic Look', productId: 'fire-boltt-phoenix-pro-round-smart-watch-1-39', reason: 'Round dial that reads as a watch, not a gadget.' },
    ],
    tips: [
      'Check which contact list syncs with calling — many watches mirror the SIM call log, which confuses dual-SIM users.',
      'Battery claims are optimistic; expect 70-80% of the sticker figure with always-on display enabled.',
      'Buy during sale weeks — this category routinely drops 20-30% on Amazon and Flipkart.',
    ],
    faq: [
      { q: 'Is Bluetooth calling on smartwatches actually usable?', a: 'Yes for short calls in quiet places. In traffic or a noisy canteen, both sides struggle — use your phone for long conversations.' },
      { q: 'Do budget smartwatches need their own SIM?', a: 'No — the watch uses your phone\'s SIM and Bluetooth. Only expensive standalone watches support eSIM in India.' },
    ],
  },
  {
    id: 'best-monitors-for-students',
    slug: 'best-monitors-for-students',
    title: 'Best Monitors for Students in India',
    category: 'monitors',
    excerpt:
      'One extra screen changes how you study, code and binge — the monitors that give the most screen per rupee, explained.',
    publishedOn: '2026-08-15',
    readMinutes: 5,
    intro:
      'Every serious student hits the laptop-screen ceiling: three tabs, a notebook and the PDF that refuses to fit. A second monitor is the upgrade that fixes it — cheap, permanent and instantly noticeable. Here is how to choose and which to buy.',
    sections: [
      {
        heading: '24-inch IPS is the value sweet spot',
        body: 'For under ₹7,000 you get a 24-inch FHD IPS monitor at 100-144Hz. That is the size where you stop squinting, and IPS panels keep colours accurate for design work too.',
        productIds: ['acer-ek240y-p6-p6-23-8-inch-ips-full'],
      },
      {
        heading: 'The 27-inch upgrade',
        body: 'If you live in spreadsheets, code or Figma, jump to 27-inch FHD IPS — the extra surface reduces scrolling by a lot. Most 27-inch FHD monitors under ₹10,000 are the same internals at a bigger price-to-inch ratio.',
        productIds: ['lg-27u411a-bd-68-5-cm-27-inch-fhd'],
      },
      {
        heading: 'Double-duty for work and play',
        body: 'A 144Hz panel doubles as a gaming monitor between assignments. The Acer EK240Y and KA270 refresh at 144Hz while staying properly affordable for a study setup.',
        productIds: ['acer-ka270-p6-27-inch-ips-full-hd-backlit'],
      },
    ],
    picks: [
      { label: 'Best 24-Inch', productId: 'acer-ek240y-p6-p6-23-8-inch-ips-full', reason: 'IPS, 144Hz and an unbeatable price-to-quality ratio.' },
      { label: 'Best 27-Inch', productId: 'lg-27u411a-bd-68-5-cm-27-inch-fhd', reason: 'Bigger screen, same FHD IPS quality, budget-friendly.' },
      { label: 'Best All-Rounder', productId: 'lg-24ml600s-monitor', reason: 'A dependable 24-inch IPS from a brand you know.' },
    ],
    tips: [
      'Place the monitor at arm\'s length, top of the screen at eye level — posture is the real reason to buy.',
      'Use one cable for everything: USB-C monitors can charge your laptop and carry video at once.',
      'Keep the laptop lid open beside the monitor for a free third screen while studying.',
    ],
    faq: [
      { q: 'Do I need 2K or 4K for study?', a: 'Not usually. FHD is crisp enough for text and coursework; 2K/4K only pull their weight for photo/video work at 27-inch and above.' },
      { q: 'Can one monitor work with my laptop and hostel console?', a: 'Yes — if it has two HDMI ports, switch inputs via the OSD. Most budget monitors have at least one HDMI and one VGA.' },
    ],
  },
];

export function getGuideBySlug(slug: string): BuyingGuide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}