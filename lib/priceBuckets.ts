import type { CategoryId } from '@/lib/types';

export const CATEGORY_PRICE_BUCKETS: Record<CategoryId | 'all', { label: string; min: number | undefined; max: number | undefined }[]> = {
  all: [
    { label: 'Under ₹500', min: undefined, max: 500 },
    { label: '₹500 – ₹2,000', min: 500, max: 2000 },
    { label: '₹2,000 – ₹10,000', min: 2000, max: 10000 },
    { label: 'Above ₹10,000', min: 10000, max: undefined },
  ],
  laptops: [
    { label: 'Under ₹30,000', min: undefined, max: 30000 },
    { label: '₹30,000 – ₹60,000', min: 30000, max: 60000 },
    { label: '₹60,000 – ₹1,00,000', min: 60000, max: 100000 },
    { label: 'Above ₹1,00,000', min: 100000, max: undefined },
  ],
  audio: [
    { label: 'Under ₹1,000', min: undefined, max: 1000 },
    { label: '₹1,000 – ₹3,000', min: 1000, max: 3000 },
    { label: '₹3,000 – ₹5,000', min: 3000, max: 5000 },
    { label: 'Above ₹5,000', min: 5000, max: undefined },
  ],
  accessories: [
    { label: 'Under ₹500', min: undefined, max: 500 },
    { label: '₹500 – ₹2,000', min: 500, max: 2000 },
    { label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
    { label: 'Above ₹5,000', min: 5000, max: undefined },
  ],
  backpacks: [
    { label: 'Under ₹500', min: undefined, max: 500 },
    { label: '₹500 – ₹1,500', min: 500, max: 1500 },
    { label: '₹1,500 – ₹3,000', min: 1500, max: 3000 },
    { label: 'Above ₹3,000', min: 3000, max: undefined },
  ],
  'power-charging': [
    { label: 'Under ₹1,000', min: undefined, max: 1000 },
    { label: '₹1,000 – ₹3,000', min: 1000, max: 3000 },
    { label: '₹3,000 – ₹5,000', min: 3000, max: 5000 },
    { label: 'Above ₹5,000', min: 5000, max: undefined },
  ],
  'study-setup': [
    { label: 'Under ₹1,000', min: undefined, max: 1000 },
    { label: '₹1,000 – ₹3,000', min: 1000, max: 3000 },
    { label: '₹3,000 – ₹5,000', min: 3000, max: 5000 },
    { label: 'Above ₹5,000', min: 5000, max: undefined },
  ],
  'hostel-essentials': [
    { label: 'Under ₹500', min: undefined, max: 500 },
    { label: '₹500 – ₹1,500', min: 500, max: 1500 },
    { label: '₹1,500 – ₹3,000', min: 1500, max: 3000 },
    { label: 'Above ₹3,000', min: 3000, max: undefined },
  ],
  tablets: [
    { label: 'Under ₹10,000', min: undefined, max: 10000 },
    { label: '₹10,000 – ₹20,000', min: 10000, max: 20000 },
    { label: '₹20,000 – ₹30,000', min: 20000, max: 30000 },
    { label: 'Above ₹30,000', min: 30000, max: undefined },
  ],
  stationery: [
    { label: 'Under ₹200', min: undefined, max: 200 },
    { label: '₹200 – ₹500', min: 200, max: 500 },
    { label: '₹500 – ₹1,000', min: 500, max: 1000 },
    { label: 'Above ₹1,000', min: 1000, max: undefined },
  ],
  monitors: [
    { label: 'Under ₹10,000', min: undefined, max: 10000 },
    { label: '₹10,000 – ₹20,000', min: 10000, max: 20000 },
    { label: '₹20,000 – ₹30,000', min: 20000, max: 30000 },
    { label: 'Above ₹30,000', min: 30000, max: undefined },
  ],
};