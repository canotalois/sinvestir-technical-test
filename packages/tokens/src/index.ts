/**
 * Concrete colors exposed in TS — Chart.js draws on a <canvas> and does not read
 * CSS vars. Must stay aligned with the Tailwind theme (the app's `@theme`).
 */

export const rgb = {
  surface: "8 12 22",
  surfaceSoft: "15 23 42",
  surfaceElevated: "0 23 63",
  text: "255 255 255",
  textMuted: "156 163 175",
  primary: "37 99 235",
  ring: "16 152 247",
  gold: "232 179 57",
  positive: "34 197 94",
  negative: "239 68 68",
  border: "120 153 206",
  chartArea: "41 69 168",
} as const;

export const color = {
  surface: "#080C16",
  surfaceSoft: "#0F172A",
  surfaceElevated: "#00173F",
  text: "#FFFFFF",
  textMuted: "#9CA3AF",
  primary: "#2563EB",
  ring: "#1098F7",
  gold: "#E8B339",
  positive: "#22C55E",
  negative: "#EF4444",
  border: "#7899CE",
  chartArea: "#2945A8",
} as const;

/** `withAlpha("16 152 247", 0.3)` -> "rgb(16 152 247 / 0.3)". */
export function withAlpha(rgbTriplet: string, alpha: number): string {
  return `rgb(${rgbTriplet} / ${alpha})`;
}
