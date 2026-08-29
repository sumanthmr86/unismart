import type { Category, CategoryId } from '@/lib/types';

export const CATEGORY_INTRO: Record<CategoryId, string> = {
  laptops:
    'The right laptop for college balances battery life, build and price — not just the flashiest spec sheet. Think 8GB+ RAM, a comfortable keyboard for long assignment hours and enough ports for hostel life. Buy once, buy right.',
  audio:
    'Earbuds and headphones are a near-daily purchase for students — the trick is matching them to how you actually use them: commute, gym, or all-night music with a roommate asleep nearby. Battery time and a good IP rating matter more than brand.',
  accessories:
    'A dependable mouse, a good sleeve and a few cable organisers quietly save you hours of frustration across the semester. Small spends, outsize quality-of-life wins.',
  backpacks:
    'A student backpack needs to carry a laptop, books and a water bottle without hurting your shoulders between classes. Look for padded straps, a laptop compartment and decent water resistance.',
  'power-charging':
    'Power banks and fast chargers are the difference between a dead phone in a lecture and a full charge. Prioritise capacity, output wattage and a brand with a trustable safety record.',
  'study-setup':
    'A proper study corner — a lamp that doesnt strain your eyes, a keyboard that doesnt cramp your hands and enough screen to stop squinting — protects you across every semester.',
  'hostel-essentials':
    'The small things that make a hostel room liveable: organisers, water bottles, laundry helpers and little upgrades that cost little and improve every day.',
  tablets:
    'Tablets shine for note-taking, PDFs and lecture slides — lighter than a laptop and easier on the eyes than a phone. Consider pen support and battery life before raw specs.',
  stationery:
    'Stationery you will actually finish: pens that dont dry out mid-exam, notebooks that survive a semester and a few organisers to keep it all findable.',
  monitors:
    'More screen area for assignments, code and side projects. Resolution, panel type and a stand that improves posture matter far more than marketing buzzwords.',
};

export const CATEGORY_KEYWORDS: Record<CategoryId, string> = {
  laptops: 'laptop for college',
  audio: 'earbuds and headphones for students',
  accessories: 'student accessories',
  backpacks: 'backpack for college',
  'power-charging': 'power bank and fast charger',
  'study-setup': 'study desk setup',
  'hostel-essentials': 'hostel essentials',
  tablets: 'tablet for students',
  stationery: 'college stationery',
  monitors: 'monitor for study and work',
};

export function categoryPageTitle(category: Category): string {
  return `Best ${category.name} for Students in India (2026)`;
}

export function categoryPageDescription(category: Category): string {
  return `${category.description} Browse our ${category.name.toLowerCase()} picks with live Amazon prices, UniSmart Scores and side-by-side comparisons.`;
}