import { z } from "zod";
import {
  ProviderError,
  type PriceProvider,
  type ProviderCoin,
  type ProviderPrice,
} from "./types";

// Backend of the original simulator (CoinGecko proxy cached by Fritzy):
// serves the full daily history (since 2013) in EUR, without a key.
const BASE = "https://digital-assets.fritzy.finance";
const COINS_TTL = 3600;
const HISTORY_TTL = 21_600;

const marketsSchema = z.array(
  z.object({
    id: z.string(),
    symbol: z.string(),
    name: z.string(),
    marketCapRank: z.number().nullable().optional(),
  }),
);

const chartSchema = z.object({
  prices: z.array(z.tuple([z.number(), z.number()])).min(1),
});

export const fritzyProvider: PriceProvider = {
  name: "fritzy",

  async listCoins(): Promise<ProviderCoin[]> {
    const res = await fetch(`${BASE}/coins/markets?vs_currency=usd`, {
      headers: { accept: "application/json" },
      next: { revalidate: COINS_TTL },
    });
    if (!res.ok)
      throw new ProviderError(`Fritzy /coins/markets returned ${res.status}`);
    const parsed = marketsSchema.safeParse(await res.json());
    if (!parsed.success)
      throw new ProviderError("Fritzy /coins/markets: unexpected shape");
    return parsed.data.map((c) => ({
      id: c.id,
      symbol: c.symbol,
      name: c.name,
      marketCapRank: c.marketCapRank ?? null,
    }));
  },

  async priceHistory(id: string): Promise<ProviderPrice[]> {
    const url = `${BASE}/coins/${encodeURIComponent(id)}/market_chart?vs_currency=EUR&days=3650`;
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      next: { revalidate: HISTORY_TTL },
    });
    if (!res.ok)
      throw new ProviderError(`Fritzy /market_chart returned ${res.status}`);
    const parsed = chartSchema.safeParse(await res.json());
    if (!parsed.success)
      throw new ProviderError("Fritzy /market_chart: unexpected shape");
    return parsed.data.prices;
  },
};
