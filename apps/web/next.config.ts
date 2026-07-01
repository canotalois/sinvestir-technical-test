import type { NextConfig } from "next";

// PostHog cloud region (EU by default). Set NEXT_PUBLIC_POSTHOG_HOST to the US
// host (https://us.i.posthog.com) if the project lives there.
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";
const POSTHOG_ASSETS = POSTHOG_HOST.replace(".i.posthog.com", "-assets.i.posthog.com");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Monorepo packages are consumed as TS source, so Next transpiles them.
  transpilePackages: ["@sinvestir/crypto-simulator", "@sinvestir/tokens"],
  // Reverse-proxy PostHog through our own origin so ad-blockers don't drop it.
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: `${POSTHOG_ASSETS}/static/:path*`,
      },
      { source: "/ingest/:path*", destination: `${POSTHOG_HOST}/:path*` },
    ];
  },
  // PostHog needs trailing slashes preserved on the proxied API routes.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
