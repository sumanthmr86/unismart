import type { Metadata } from 'next';
import { ProductGrid } from '@/components/ProductGrid';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { getDealsPage } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Today’s deals',
  description:
    'Curated student-friendly deals on laptops, earbuds, backpacks and more — hand-picked at real live prices.',
};

export default function DealsPage() {
  const deals = getDealsPage();

  return (
    <div className="py-10 sm:py-14">
      <div className="container-page">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Deals' },
          ]}
        />

        <div className="mb-8 max-w-3xl">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Today’s featured deals
          </h1>
          <p className="mt-2 text-slate-600">
            Sorted by discount, but curated so the <em>value</em> always beats the
            sticker price. Prices update with what merchants are offering right now.
          </p>
        </div>

        <ProductGrid products={deals} skeletonCount={8} />
      </div>
    </div>
  );
}