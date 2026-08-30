import { useState, useEffect, useRef, useCallback } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  resistance?: number;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
}: UsePullToRefreshOptions) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (isRefreshing) return;
    const scrollTop = elementRef.current?.scrollTop ?? 0;
    if (scrollTop > 0) return; // Only allow pull-to-refresh at top
    startY.current = e.touches[0].clientY;
  }, [isRefreshing]);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isRefreshing || startY.current === null) return;
      const currentY = e.touches[0].clientY;
      const distance = (currentY - startY.current) / resistance;
      if (distance > 0) {
        e.preventDefault();
        setIsPulling(true);
        setPullDistance(Math.min(distance, threshold * 1.5));
      }
    },
    [isRefreshing, threshold, resistance]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || isRefreshing) return;
    const triggered = pullDistance >= threshold;
    setIsPulling(false);
    setPullDistance(0);
    startY.current = null;

    if (triggered) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  }, [isPulling, isRefreshing, pullDistance, onRefresh]);

  // Attach/remove listeners
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    ref: elementRef,
    isPulling,
    pullDistance,
    isRefreshing,
    progress: Math.min(pullDistance / threshold, 1),
  };
}