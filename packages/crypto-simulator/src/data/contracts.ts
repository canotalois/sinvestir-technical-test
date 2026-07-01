import { z } from "zod";

/**
 * Contracts for OUR API (Next route handlers), not raw CoinGecko.
 * The snake_case → camelCase mapping is done once on the server side.
 */

export const coinSchema = z.object({
  id: z.string().min(1),
  symbol: z.string().min(1),
  name: z.string().min(1),
  marketCapRank: z.number().int().nullable(),
});
export type Coin = z.infer<typeof coinSchema>;

export const coinsSchema = z.array(coinSchema);

/** History response: { prices: [[timestamp_ms, price_eur], …] } (CoinGecko format). */
export const marketChartSchema = z.object({
  prices: z.array(z.tuple([z.number(), z.number()])).min(1),
});
export type MarketChart = z.infer<typeof marketChartSchema>;
