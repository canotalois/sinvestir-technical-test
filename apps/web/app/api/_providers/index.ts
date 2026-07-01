import { coingeckoProvider } from "./coingecko";
import { fritzyProvider } from "./fritzy";
import type { PriceProvider } from "./types";

const PROVIDERS: Record<string, PriceProvider> = {
  coingecko: coingeckoProvider,
  fritzy: fritzyProvider,
};

/** Default provider: Fritzy (full history, no key). Overridable via env. */
const DEFAULT_PROVIDER = "fritzy";

/**
 * Selects the data source via `CRYPTO_DATA_PROVIDER` (coingecko | fritzy).
 * Throws on an unknown value (visibility > silent fallback).
 */
export function getProvider(): PriceProvider {
  const name = process.env.CRYPTO_DATA_PROVIDER ?? DEFAULT_PROVIDER;
  const provider = PROVIDERS[name];
  if (provider === undefined) {
    throw new Error(
      `CRYPTO_DATA_PROVIDER inconnu : "${name}" (valeurs acceptées : ${Object.keys(PROVIDERS).join(", ")})`,
    );
  }
  return provider;
}

export { ProviderError } from "./types";
