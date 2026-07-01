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

    const points = await fetchPriceHistory("bitcoin", { baseUrl: BASE });

    expect(points).toEqual([
      { t: 1_577_836_800_000, price: 6400.12 },
      { t: 1_577_923_200_000, price: 6500.34 },
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
