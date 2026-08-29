import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';

export function ScoreBadge({
  score,
  className,
  compact = false,
}: {
  score: number;
  className?: string;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-2 py-1 font-semibold text-white',
        compact ? 'text-[10px]' : 'text-xs',
        className,
      )}
      title={`UniSmart Score: ${score.toFixed(1)} / 10`}
    >
      <Sparkles className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} aria-hidden="true" />
      {compact ? score.toFixed(1) : `UniSmart Score ${score.toFixed(1)}`}
    </span>
  );
}