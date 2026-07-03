/** Shared Tailwind class tokens (kept in one place to avoid drift/duplication). */

/** Glassy card surface - subtle white border + fill, used across result cards. */
export const SURFACE = "rounded-card border border-white/10 bg-white/5";

export function signClass(value: number): string {
  return value >= 0 ? "text-positive" : "text-negative";
}
