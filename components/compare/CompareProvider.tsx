'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { CheckCircle2, Info } from 'lucide-react';

const STORAGE_KEY = 'unismart.compare';
const MAX_COMPARE = 4;

interface ToastItem {
  id: number;
  message: string;
  kind: 'success' | 'info';
}

interface CompareContextValue {
  selected: string[];
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  limitReached: boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return ctx;
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastId = useRef(0);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        if (Array.isArray(parsed)) {
          setSelected(parsed.filter((id) => typeof id === 'string').slice(0, MAX_COMPARE));
        }
      }
    } catch {
      setSelected([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    } catch {
      // storage unavailable
    }
  }, [selected, hydrated]);

  const pushToast = useCallback((message: string, kind: ToastItem['kind']) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, message, kind }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  const toggle = useCallback(
    (id: string) => {
      setSelected((prev) => {
        if (prev.includes(id)) {
          pushToast('Removed from compare', 'info');
          return prev.filter((x) => x !== id);
        }
        if (prev.length >= MAX_COMPARE) {
          pushToast(`You can compare up to ${MAX_COMPARE} products at a time`, 'info');
          return prev;
        }
        pushToast('Added to compare', 'success');
        return [...prev, id];
      });
    },
    [pushToast],
  );

  const remove = useCallback((id: string) => {
    setSelected((prev) => prev.filter((x) => x !== id));
    pushToast('Removed from compare', 'info');
  }, [pushToast]);

  const clear = useCallback(() => {
    setSelected([]);
    pushToast('Compare list cleared', 'info');
  }, [pushToast]);

  const isSelected = useCallback(
    (id: string) => selected.includes(id),
    [selected],
  );

  return (
    <CompareContext.Provider
      value={{
        selected,
        isSelected,
        toggle,
        remove,
        clear,
        limitReached: selected.length >= MAX_COMPARE,
      }}
    >
      {children}

      <div
        className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg"
          >
            {toast.kind === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            ) : (
              <Info className="h-4 w-4 text-amber-400" aria-hidden="true" />
            )}
            {toast.message}
          </div>
        ))}
      </div>
    </CompareContext.Provider>
  );
}