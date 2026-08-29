'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('UniSmart UI error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <TriangleAlert className="h-8 w-8" aria-hidden="true" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900">
            Something went wrong
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            An unexpected error occurred while showing this page. Try refreshing,
            or head back to home.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="btn-primary"
              onClick={() => window.location.reload()}
            >
              Refresh page
            </button>
            <Link className="btn-secondary" href="/">
              Go to home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}