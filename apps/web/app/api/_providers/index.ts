import { coingeckoProvider } from "./coingecko";
import { fritzyProvider } from "./fritzy";
import type { PriceProvider } from "./types";

const PROVIDERS: Record<string, PriceProvider> = {
  coingecko: coingeckoProvider,
  fritzy: fritzyProvider,
};

/** Default primary source: Fritzy (full history, no key). Overridable via env. */
const DEFAULT_PROVIDER = "fritzy";

/**
 * Ordered data sources: the configured primary first (`CRYPTO_DATA_PROVIDER`,
 * default Fritzy), then the others as fallbacks. Throws on an unknown env value
 * (visibility over a silent default).
 */
export function getProviderChain(): PriceProvider[] {
  const name = process.env.CRYPTO_DATA_PROVIDER ?? DEFAULT_PROVIDER;
  const primary = PROVIDERS[name];
  if (primary === undefined) {
    throw new Error(
      `CRYPTO_DATA_PROVIDER inconnu : "${name}" (valeurs acceptées : ${Object.keys(PROVIDERS).join(", ")})`,
    );
  }
  const fallbacks = Object.values(PROVIDERS).filter((p) => p !== primary);
  return [primary, ...fallbacks];
}

export interface SourcedResult<T> {
  readonly value: T;
  readonly source: string;
  /** True when a fallback (not the primary) served the request. */
  readonly degraded: boolean;
}

/**
 * Calls `run` against each source in order, returning the first success flagged
 * `degraded` when a fallback answered. Rethrows the last error only if every
 * source fails.
 */
export async function withFallback<T>(
  run: (provider: PriceProvider) => Promise<T>,
): Promise<SourcedResult<T>> {
  const chain = getProviderChain();
  let lastError: unknown;
  for (let i = 0; i < chain.length; i++) {
    const provider = chain[i];
    if (provider === undefined) continue;
    try {
      const value = await run(provider);
      return { value, source: provider.name, degraded: i > 0 };
    } catch (err) {
      lastError = err;
      console.warn(
        `[providers] ${provider.name} a échoué, bascule sur la source suivante`,
        err instanceof Error ? err.message : err,
      );
    }
  }
  throw lastError;
}

export { ProviderError } from "./types";
