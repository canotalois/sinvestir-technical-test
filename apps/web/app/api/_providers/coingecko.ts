import { z } from "zod";
import {
  ProviderError,
  type PriceProvider,
  type ProviderCoin,
  type ProviderPrice,
} from "./types";

const BASE = "https://api.coingecko.com/api/v3";
const COINS_TTL = 3600;
const HISTORY_TTL = 21_600;

function headers(): Record<string, string> {
  const result: Record<string, string> = { accept: "application/json" };
  const key = process.env.COINGECKO_API_KEY;
  if (key !== undefined && key !== "") result["x-cg-demo-api-key"] = key;
  return result;
}

const marketsSchema = z.array(
  z.object({
    id: z.string(),
    symbol: z.string(),
    name: z.string(),
    market_cap_rank: z.number().nullable().optional(),
  }),
);

const chartSchema = z.object({
  prices: z.array(z.tuple([z.number(), z.number()])).min(1),
});

export const coingeckoProvider: PriceProvider = {
  name: "coingecko",

  async listCoins(): Promise<ProviderCoin[]> {
    const url = `${BASE}/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
    const res = await fetch(url, {
      headers: headers(),
      next: { revalidate: COINS_TTL },
    });
    if (!res.ok)
      throw new ProviderError(
        `CoinGecko /coins/markets returned ${res.status}`,
      );
    const parsed = marketsSchema.safeParse(await res.json());
    if (!parsed.success)
      throw new ProviderError("CoinGecko /coins/markets: unexpected shape");
    return parsed.data.map((c) => ({
      id: c.id,
      symbol: c.symbol,
      name: c.name,
      marketCapRank: c.market_cap_rank ?? null,
    }));
  },

  async priceHistory(id: string): Promise<ProviderPrice[]> {
    const buildUrl = (days: string) =>
      `${BASE}/coins/${encodeURIComponent(id)}/market_chart?vs_currency=eur&days=${days}`;

    let res = await fetch(buildUrl("3650"), {
      headers: headers(),
      next: { revalidate: HISTORY_TTL },
    });

    // Without a key, the public tier is capped at 365 days (401). Fall back to the
    // maximum allowed window to keep the demo working (documented degradation).
    if (res.status === 401) {
      console.warn(
        "[coingecko] history > 365d refused (key required) — falling back to days=365",
      );
      res = await fetch(buildUrl("365"), {
        headers: headers(),
        next: { revalidate: HISTORY_TTL },
      });
    }

    if (!res.ok)
      throw new ProviderError(`CoinGecko /market_chart returned ${res.status}`);
    const parsed = chartSchema.safeParse(await res.json());
    if (!parsed.success)
      throw new ProviderError("CoinGecko /market_chart: unexpected shape");
    return parsed.data.prices;
  },
};
