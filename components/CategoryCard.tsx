import Link from 'next/link';
import { ArrowUpRight, BatteryCharging, Backpack, BookOpenText, Coffee, Headphones, Laptop, Monitor, Mouse, PenTool, Tablet, LampDesk, TrendingUp } from 'lucide-react';
import type { CategoryId } from '@/lib/types';
import { productCountForCategory } from '@/lib/products';

const CATEGORY_ICONS: Record<CategoryId, typeof Laptop> = {
  laptops: Laptop,
  audio: Headphones,
  accessories: Mouse,
  backpacks: Backpack,
  'power-charging': BatteryCharging,
  'study-setup': LampDesk,
  'hostel-essentials': Coffee,
  tablets: Tablet,
  stationery: PenTool,
  monitors: Monitor,
};

export function CategoryIcon({
  categoryId,
  className,
}: {
  categoryId: CategoryId;
  className?: string;
}) {
  const Icon = CATEGORY_ICONS[categoryId] ?? BookOpenText;
  return <Icon className={className} aria-hidden="true" />;
}

export function CategoryCard({
  category,
}: {
  category: { id: CategoryId; name: string; short: string; description: string };
}) {
  const count = productCountForCategory(category.id);
  const Icon = CATEGORY_ICONS[category.id] ?? BookOpenText;

  return (
    <li>
      <Link
        href={`/category/${category.id}`}
        className="card group relative flex h-full flex-col gap-3 p-5 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-elevate"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </span>
        <span>
          <span className="flex items-center justify-between gap-2">
            <span className="font-display text-sm font-bold text-slate-900 group-hover:text-indigo-700">
              {category.name}
            </span>
            <ArrowUpRight
              className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-600"
              aria-hidden="true"
            />
          </span>
          <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-slate-500">
            {category.description}
          </span>
        </span>
        <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-slate-400">
          <TrendingUp className="h-3 w-3" aria-hidden="true" />
          {count} {count === 1 ? 'product' : 'products'}
        </span>
      </Link>
    </li>
  );
}