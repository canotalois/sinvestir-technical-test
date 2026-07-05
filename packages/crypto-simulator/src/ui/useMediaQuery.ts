"use client";

import { useSyncExternalStore } from "react";

/** SSR-safe media-query hook. `serverValue` is what the server and the first
 *  client render assume (before the real query is known), so pick the value
 *  that keeps the desktop render identical and avoids a hydration mismatch. */
function useMediaQuery(query: string, serverValue: boolean): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** True on a device with a real hover pointer (mouse). Defaults to true so the
 *  desktop tooltip path renders on the server and stays 1:1. */
export function useHoverCapable(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)", true);
}

/** True on a viewport too narrow for the two-month calendar (~680px). */
export function useNarrowViewport(): boolean {
  return useMediaQuery("(max-width: 680px)", false);
}
