/** Abstraction over the price data source (CoinGecko, Fritzy, …). */

export interface ProviderCoin {
  readonly id: string;
  readonly symbol: string;
  readonly name: string;
  readonly marketCapRank: number | null;
}

/** A point [timestamp_ms, price_eur]. */
export type ProviderPrice = readonly [number, number];

export interface PriceProvider {
  readonly name: string;
  listCoins(): Promise<ProviderCoin[]>;
  /** Daily history (EUR), sorted by ascending timestamp. */
  priceHistory(id: string): Promise<ProviderPrice[]>;
}

export class ProviderError extends Error {
  readonly status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = "ProviderError";
    this.status = status;
  }
}
