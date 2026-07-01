"use client";

import { useEffect, type ReactNode } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

/**
 * Initialises PostHog against our own `/ingest` reverse proxy (see
 * next.config), so analytics survive ad-blockers. No-op if the key is unset.
 */
export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    // Guard against React StrictMode's double-invoke re-initialising PostHog.
    if (key === undefined || key === "" || posthog.__loaded) return;
    posthog.init(key, {
      api_host: "/ingest",
      ui_host: "https://eu.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
      person_profiles: "identified_only",
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
