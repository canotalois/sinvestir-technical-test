"use client";

import type { ReactNode } from "react";
import {
  ErrorBoundary as ReactErrorBoundary,
  type FallbackProps,
} from "react-error-boundary";

/**
 * Recoverable fallback rendered on any subtree crash: a small floating window
 * (bottom-left) instead of a white screen. "Réessayer" re-mounts the subtree,
 * "Recharger" reloads the page. Fixed-position, so it never shifts layout.
 */
function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div
      role="alert"
      className="fixed bottom-4 left-4 z-[100] w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl border border-negative/30 bg-modal/95 p-4 shadow-2xl backdrop-blur"
    >
      <div className="flex items-start gap-3">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="mt-0.5 h-5 w-5 shrink-0 text-negative"
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">
            Une erreur est survenue
          </p>
          <p className="mt-1 text-xs font-light leading-snug text-blue-light">
            Quelque chose s&apos;est mal passé. Vous pouvez réessayer ou
            recharger la page.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={resetErrorBoundary}
              className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-light text-white transition-colors hover:bg-white/5"
            >
              Réessayer
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-blue-sky px-4 py-1.5 text-xs font-light text-white transition-opacity hover:opacity-90"
            >
              Recharger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Last-resort safety net around the app, built on `react-error-boundary`. */
export function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}
