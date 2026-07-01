import { ContractError } from "./errors";
import { coinsSchema, marketChartSchema, type Coin } from "./contracts";
import type { PricePoint } from "../core/types";

export interface DataClientOptions {
  /** API base (default: "/api", served by the Next route handlers). */
  readonly baseUrl?: string;
  /** `fetch` injection (tests, SSR). Default: the global `fetch`. */
  readonly fetchImpl?: typeof fetch;
}

function resolve(options: DataClientOptions): {
  baseUrl: string;
  doFetch: typeof fetch;
} {
  return {
    baseUrl: options.baseUrl ?? "/api",
    doFetch: options.fetchImpl ?? fetch,
  };
}

/** List of selectable cryptos (top market cap). */
export async function fetchCoins(
  options: DataClientOptions = {},
): Promise<Coin[]> {
  const { baseUrl, doFetch } = resolve(options);
  const res = await doFetch(`${baseUrl}/coins`);
  if (!res.ok) {
    throw new ContractError(
      "HTTP_ERROR",
      `GET ${baseUrl}/coins a renvoyé ${res.status}`,
    );
  }
  const json: unknown = await res.json();
  const parsed = coinsSchema.safeParse(json);
  if (!parsed.success) {
    throw new ContractError(
      "SHAPE_MISMATCH",
      "Réponse /coins non conforme au contrat.",
      {
        cause: parsed.error,
      },
    );
  }
  return parsed.data;
}

/** Daily price history (EUR) of a crypto, normalized to `PricePoint[]`. */
export async function fetchPriceHistory(
  id: string,
  options: DataClientOptions = {},
): Promise<PricePoint[]> {
  const { baseUrl, doFetch } = resolve(options);
  const url = `${baseUrl}/coins/${encodeURIComponent(id)}/history`;
  const res = await doFetch(url);
  if (!res.ok) {
    throw new ContractError("HTTP_ERROR", `GET ${url} a renvoyé ${res.status}`);
  }
  const json: unknown = await res.json();
  const parsed = marketChartSchema.safeParse(json);
  if (!parsed.success) {
    throw new ContractError(
      "SHAPE_MISMATCH",
      "Réponse d'historique non conforme au contrat.",
      {
        cause: parsed.error,
      },
    );
  }
  return parsed.data.prices.map(([t, price]) => ({ t, price }));
}
