"use client";

import { useEffect, useState } from "react";
import {
  fetchCoins,
  fetchPriceHistory,
  type DataClientOptions,
} from "./client";
import type { Coin } from "./contracts";
import type { PricePoint } from "../core/types";

export type CoinsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; coins: Coin[] };

export type HistoryState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; prices: PricePoint[] };

function messageOf(err: unknown): string {
  return err instanceof Error
    ? err.message
    : "Une erreur inattendue est survenue.";
}

/** Loads the coin list once (and on `options` change). */
export function useCoins(options: DataClientOptions): CoinsState {
  const [state, setState] = useState<CoinsState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    fetchCoins(options)
      .then((coins) => {
        if (!cancelled) setState({ status: "ready", coins });
      })
      .catch((err: unknown) => {
        if (!cancelled) setState({ status: "error", message: messageOf(err) });
      });
    return () => {
      cancelled = true;
    };
  }, [options]);

  return state;
}

/**
 * Loads the price history for `coinId`. The previous coin's data stays visible
 * while a new coin loads; `loading` only flips true if the fetch exceeds 200 ms,
 * so a cached switch swaps instantly (no skeleton flash) while a slow one shows
 * a skeleton rather than lingering stale data.
 */
export function usePriceHistory(
  coinId: string,
  options: DataClientOptions,
): { state: HistoryState; loading: boolean } {
  const [state, setState] = useState<HistoryState>({ status: "loading" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (coinId === "") return;
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) setLoading(true);
    }, 200);
    fetchPriceHistory(coinId, options)
      .then((prices) => {
        if (cancelled) return;
        clearTimeout(timer);
        setLoading(false);
        setState({ status: "ready", prices });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        clearTimeout(timer);
        setLoading(false);
        setState({ status: "error", message: messageOf(err) });
      });
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [coinId, options]);

  return { state, loading };
}
