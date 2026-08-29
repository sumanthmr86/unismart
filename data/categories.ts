import type { Category, CategoryId } from '@/lib/types';

export const CATEGORIES: Category[] = [
  {
    id: 'laptops',
    name: 'Laptops',
    short: 'Laptops',
    description: 'Study, code and game — laptops that handle college life.',
  },
  {
    id: 'audio',
    name: 'Audio',
    short: 'Audio',
    description: 'Earbuds and headphones that survive hostels and commutes.',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    short: 'Accessories',
    description: 'Mice, sleeves and little upgrades that make a big difference.',
  },
  {
    id: 'backpacks',
    name: 'Backpacks',
    short: 'Backpacks',
    description: 'Room for a laptop, books and a lunch box — all in one.',
  },
  {
    id: 'power-charging',
    name: 'Power & Charging',
    short: 'Power & Charging',
    description: 'Power banks and fast chargers for non-stop days.',
  },
  {
    id: 'study-setup',
    name: 'Study Setup',
    short: 'Study Setup',
    description: 'Lamps, keyboards and monitors for a proper study corner.',
  },
  {
    id: 'hostel-essentials',
    name: 'Hostel Essentials',
    short: 'Hostel Essentials',
    description: 'The small things every hostel room genuinely needs.',
  },
  {
    id: 'tablets',
    name: 'Tablets',
    short: 'Tablets',
    description: 'Notes, PDFs and Netflix — a light companion for classes.',
  },
  {
    id: 'stationery',
    name: 'Stationery',
    short: 'Stationery',
    description: 'Notebooks and pens you will actually finish.',
  },
  {
    id: 'monitors',
    name: 'Monitors',
    short: 'Monitors',
    description: 'More screen space for assignments and side projects.',
  },
];

export function getCategory(id: CategoryId): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

export function getCategoryName(id: CategoryId): string {
  return getCategory(id).name;
}