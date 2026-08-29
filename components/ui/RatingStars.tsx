import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/cn';

export function RatingStars({
  rating,
  className,
  showValue = false,
}: {
  rating: number;
  className?: string;
  showValue?: boolean;
}) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const up = rating - full >= 0.75;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return 'full';
    if (i === full && hasHalf) return 'half';
    if (i === full && up) return 'full';
    return 'empty';
  });

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {stars.map((type, i) =>
          type === 'full' ? (
            <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          ) : type === 'half' ? (
            <span key={i} className="relative inline-flex">
              <Star className="h-3.5 w-3.5 text-slate-300" />
              <StarHalf className="absolute inset-0 h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            </span>
          ) : (
            <Star key={i} className="h-3.5 w-3.5 text-slate-300" />
          ),
        )}
      </span>
      {showValue && (
        <span className="text-xs font-semibold text-slate-700">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
}