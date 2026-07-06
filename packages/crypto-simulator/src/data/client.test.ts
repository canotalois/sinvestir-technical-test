import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { fetchCoins, fetchPriceHistory } from "./client";
import { ContractError } from "./errors";

const BASE = "http://localhost/api";
const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("fetchCoins", () => {
  it("validates and returns the list of coins when the contract is respected", async () => {
    server.use(
      http.get(`${BASE}/coins`, () =>
        HttpResponse.json([
          { id: "bitcoin", symbol: "btc", name: "Bitcoin", marketCapRank: 1 },
          { id: "ethereum", symbol: "eth", name: "Ethereum", marketCapRank: 2 },
        ]),
      ),
    );

    const coins = await fetchCoins({ baseUrl: BASE });

    expect(coins).toHaveLength(2);
    expect(coins[0]?.id).toBe("bitcoin");
  });

  it("throws ContractError SHAPE_MISMATCH when a required field is missing", async () => {
    server.use(
      http.get(`${BASE}/coins`, () =>
        HttpResponse.json([
          { id: "bitcoin", symbol: "btc" /* name missing */ },
        ]),
      ),
    );

    await expect(fetchCoins({ baseUrl: BASE })).rejects.toMatchObject({
      name: "ContractError",
      code: "SHAPE_MISMATCH",
    });
  });

  it("throws ContractError HTTP_ERROR on a non-OK status", async () => {
    server.use(
      http.get(`${BASE}/coins`, () => new HttpResponse(null, { status: 502 })),
    );

    const error = await fetchCoins({ baseUrl: BASE }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ContractError);
    expect((error as ContractError).code).toBe("HTTP_ERROR");
  });
});

describe("fetchPriceHistory", () => {
  it("maps { prices: [[t, p]] } to PricePoint[]", async () => {
    server.use(
      http.get(`${BASE}/coins/bitcoin/history`, () =>
        HttpResponse.json({
          prices: [
            [1_577_836_800_000, 6400.12],
            [1_577_923_200_000, 6500.34],
          ],
        }),
      ),
    );

    const { prices } = await fetchPriceHistory("bitcoin", { baseUrl: BASE });

    expect(prices).toEqual([
      { t: 1_577_836_800_000, price: 6400.12 },
      { t: 1_577_923_200_000, price: 6500.34 },
    ]);
  });

  it("flags degraded when the API served a fallback source", async () => {
    server.use(
      http.get(`${BASE}/coins/bitcoin/history`, () =>
        HttpResponse.json(
          { prices: [[1_577_836_800_000, 6400.12]] },
          { headers: { "x-data-degraded": "true" } },
        ),
      ),
    );

    const result = await fetchPriceHistory("bitcoin", { baseUrl: BASE });

    expect(result.degraded).toBe(true);
  });

  it("is not degraded by default (primary source)", async () => {
    server.use(
      http.get(`${BASE}/coins/bitcoin/history`, () =>
        HttpResponse.json({ prices: [[1_577_836_800_000, 6400.12]] }),
      ),
    );

    const result = await fetchPriceHistory("bitcoin", { baseUrl: BASE });

    expect(result.degraded).toBe(false);
  });

  it("sorts points by ascending timestamp (providers sometimes return one out of order)", async () => {
    server.use(
      http.get(`${BASE}/coins/bitcoin/history`, () =>
        HttpResponse.json({
          prices: [
            [1_577_836_800_000, 100],
            [1_735_344_000_000, 300], // 2024-12-28, out of order
            [1_724_803_200_000, 200], // 2024-08-28, should come before the line above
          ],
        }),
      ),
    );

    const { prices } = await fetchPriceHistory("bitcoin", { baseUrl: BASE });

    expect(prices.map((p) => p.t)).toEqual([
      1_577_836_800_000, 1_724_803_200_000, 1_735_344_000_000,
    ]);
  });

  it("throws SHAPE_MISMATCH when 'prices' is missing", async () => {
    server.use(
      http.get(`${BASE}/coins/bitcoin/history`, () =>
        HttpResponse.json({ foo: "bar" }),
      ),
    );

    await expect(
      fetchPriceHistory("bitcoin", { baseUrl: BASE }),
    ).rejects.toMatchObject({
      code: "SHAPE_MISMATCH",
    });
  });
});
