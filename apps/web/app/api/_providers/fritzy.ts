import { z } from "zod";
import {
  ProviderError,
  chartSchema,
  COINS_TTL,
  HISTORY_TTL,
  type PriceProvider,
  type ProviderCoin,
  type ProviderPrice,
} from "./types";

// Backend of the original simulator (CoinGecko proxy cached by Fritzy):
// serves the full daily history (since 2013) in EUR, without a key.
const BASE = "https://digital-assets.fritzy.finance";

const marketsSchema = z.array(
  z.object({
    id: z.string(),
    symbol: z.string(),
    name: z.string(),
    marketCapRank: z.number().nullable().optional(),
  }),
);

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
