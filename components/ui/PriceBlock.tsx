import { ArrowDown } from 'lucide-react';
import { discountPercent, formatINR } from '@/lib/format';

export function PriceBlock({
  price,
  previousPrice,
  size = 'md',
  showSavings = false,
}: {
  price: number;
  previousPrice: number;
  size?: 'sm' | 'md' | 'lg';
  showSavings?: boolean;
}) {
  const discount = discountPercent(price, previousPrice);
  const savings = previousPrice - price;

  const sizeClasses = {
    sm: {
      price: 'text-base',
      previous: 'text-xs',
      badge: 'text-[10px] px-1.5 py-0.5',
    },
    md: {
      price: 'text-lg',
      previous: 'text-sm',
      badge: 'text-xs px-2 py-0.5',
    },
    lg: {
      price: 'text-3xl',
      previous: 'text-base',
      badge: 'text-xs px-2.5 py-1',
    },
  }[size];

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <span
        className={`${sizeClasses.price} font-bold tracking-tight text-slate-900`}
      >
        {formatINR(price)}
      </span>
      {discount > 0 && (
        <>
          <span className={`${sizeClasses.previous} text-slate-400 line-through`}>
            {formatINR(previousPrice)}
          </span>
          <span
            className={`${sizeClasses.badge} inline-flex items-center gap-1 rounded-md bg-rose-100 font-semibold text-rose-700`}
          >
            <ArrowDown className="h-3 w-3" aria-hidden="true" />
            {discount}%
          </span>
          {showSavings && (
            <span className="text-xs font-medium text-emerald-600">
              You save {formatINR(savings)}
            </span>
          )}
        </>
      )}
    </div>
  );
}