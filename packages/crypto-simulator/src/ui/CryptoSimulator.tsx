"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exportNodeToPng } from "./exportImage";
import {
  simulationSchema,
  MAX_AMOUNT,
  type SimulationFormValues,
} from "./formSchema";
import { SimulationForm } from "./SimulationForm";
import { ResultsPanel } from "./ResultsPanel";
import { HistoryChart } from "./HistoryChart";
import { YearBarChart } from "./YearBarChart";
import { DoughnutChart } from "./DoughnutChart";
import { ChartTypeTabs, type ChartType } from "./ChartTypeTabs";
import { CalendarTable } from "./CalendarTable";
import { ViewTabs, type ResultsView } from "./ViewTabs";
import { SaveShareModal } from "./SaveShareModal";
import { TooltipProvider } from "./Tooltip";
import { ShareCard } from "./ShareCard";
import { StatsRow } from "./StatsRow";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";
import { InfoIcon } from "./icons";
import { periodsLabel, toDateInputValue, fromDateInputValue } from "./format";
import { useCoins, usePriceHistory } from "../data/hooks";
import { simulate } from "../core/simulate";
import { SimulationError } from "../core/errors";
import type { Frequency, SimulationResult } from "../core/types";

export interface CryptoSimulatorProps {
  /** API base (route handlers). Defaults to "/api" in the data client. */
  readonly apiBaseUrl?: string;
  readonly defaultCoinId?: string;
  readonly defaultAmount?: number;
  readonly defaultFrequency?: Frequency;
  readonly defaultFrom?: string;
  readonly className?: string;
}

const RULE =
  "h-0.5 w-[clamp(28px,6vw,50px)] rounded-[2px] bg-gradient-to-r from-blue-sky/0 to-blue-sky/85";
const TUTO_URL = "https://www.youtube.com/watch?v=TbKgV8mZvOE";

export function CryptoSimulator({
  apiBaseUrl,
  defaultCoinId = "bitcoin",
  defaultAmount = 25,
  defaultFrequency = "weekly",
  defaultFrom = "2018-01-01",
  className,
}: CryptoSimulatorProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState<ResultsView>("chart");
  const [chartType, setChartType] = useState<ChartType>("line");
  const shareRef = useRef<HTMLDivElement>(null);

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SimulationFormValues>({
    resolver: zodResolver(simulationSchema),
    mode: "onChange",
    defaultValues: {
      coinId: defaultCoinId,
      amount: defaultAmount,
      frequency: defaultFrequency,
      from: defaultFrom,
      to: toDateInputValue(Date.now()),
    },
  });
  const { coinId, amount, frequency, from, to } = watch();

  const clientOptions = useMemo(
    () => (apiBaseUrl !== undefined ? { baseUrl: apiBaseUrl } : {}),
    [apiBaseUrl],
  );

  const coinsState = useCoins(clientOptions);
  const { state: historyState, loading: historyLoading } = usePriceHistory(
    coinId,
    clientOptions,
  );

  useEffect(() => {
    if (coinsState.status === "ready" && coinId === "") {
      const first = coinsState.coins[0]?.id;
      if (first !== undefined) setValue("coinId", first);
    }
  }, [coinsState, coinId, setValue]);

  // Field-level problems (bad amount/dates) are shown by the form's floating
  // errors, so `computed` only surfaces DATA problems (no history / no buy in
  // range) - never a shifting banner for validation.
  const computed = useMemo<{
    result: SimulationResult | null;
    dataError: string | null;
  }>(() => {
    if (historyState.status !== "ready")
      return { result: null, dataError: null };
    const fromTs = fromDateInputValue(from);
    const toTs = fromDateInputValue(to);
    if (!Number.isFinite(fromTs) || !Number.isFinite(toTs) || fromTs > toTs) {
      return { result: null, dataError: null };
    }
    if (!(amount > 0) || amount > MAX_AMOUNT) {
      return { result: null, dataError: null };
    }
    try {
      const result = simulate({
        prices: historyState.prices,
        amount,
        frequency,
        from: fromTs,
        to: toTs,
      });
      return { result, dataError: null };
    } catch (err) {
      if (err instanceof SimulationError) {
        const isData =
          err.code === "NO_PRICE_DATA" ||
          err.code === "NO_INVESTMENTS_IN_RANGE";
        return { result: null, dataError: isData ? err.message : null };
      }
      throw err;
    }
  }, [historyState, amount, frequency, from, to]);

  const coins = coinsState.status === "ready" ? coinsState.coins : [];
  const coin = coins.find((c) => c.id === coinId);
  const symbol = coin?.symbol ?? "";
  const coinName = coin?.name ?? "cet actif";
  const loadError =
    coinsState.status === "error"
      ? coinsState.message
      : historyState.status === "error"
        ? historyState.message
        : null;
  const result = computed.result;
  const periodsText = result ? periodsLabel(frequency, result.periods) : null;
  const minDate =
    historyState.status === "ready" && historyState.prices[0] !== undefined
      ? toDateInputValue(historyState.prices[0].t)
      : undefined;
  const showSkeleton = historyState.status === "loading" || historyLoading;

  async function downloadResultsImage() {
    const node = shareRef.current;
    if (node === null) return;
    try {
      await exportNodeToPng(node, `simulation-${coinId}.png`);
    } catch (err) {
      console.warn("Could not generate the share image", err);
    }
  }

  return (
    <TooltipProvider>
      <div
        className={`mx-auto w-full max-w-[1200px] px-4 pb-8 pt-6 font-sans text-white ${className ?? ""}`}
      >
        <header className="mb-6 text-center">
          <div className="flex items-center justify-center gap-4">
            <span className={RULE} />
            <h1 className="m-0 text-[clamp(1.4rem,4vw,1.875rem)] font-medium uppercase leading-[1.15]">
              Simulateur crypto
            </h1>
            <span className={`${RULE} -scale-x-100`} />
          </div>
          <p className="mt-3 text-lg font-light text-blue-sky">
            Visualisez ce qu&apos;un investissement en cryptomonnaie aurait
            rapporté
          </p>
          <p className="mx-auto mt-4 max-w-[768px] text-sm font-light leading-relaxed text-white">
            Combien aurait rapporté un investissement programmé (DCA) ou un
            achat unique en bitcoin, ethereum ou un autre crypto-actif ? Estimez
            la performance passée de votre stratégie à partir des prix de marché
            réels, et visualisez l&apos;évolution de votre capital dans le
            temps.
          </p>
        </header>

        <div className="mx-auto mb-8 flex max-w-3xl items-center justify-center gap-x-4 rounded-2xl border border-blue-sky/10 bg-blue-sky/5 p-4 backdrop-blur">
          <div>
            <InfoIcon className="h-6 w-6 rounded-full bg-blue-sky/10 p-0.5 text-blue-sky" />
          </div>
          <p className="text-left text-xs font-light text-blue-light sm:text-sm">
            Outil pédagogique fondé sur des données de marché passées. Les
            crypto-actifs sont très volatils : investir comporte un risque de
            perte en capital partielle ou totale. Les performances passées ne
            préjugent pas des performances futures. Ceci n&apos;est pas un
            conseil en investissement.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 min-[900px]:grid-cols-[2fr_3fr] min-[900px]:gap-12">
          <div className="min-w-0">
            <SimulationForm
              control={control}
              errors={errors}
              coins={coins}
              minDate={minDate}
              disabled={coinsState.status === "loading"}
            />
            <div className="mt-8 flex gap-3">
              <Button
                className="flex-1"
                onClick={() => setModalOpen(true)}
                disabled={result === null}
              >
                Enregistrer la simulation
              </Button>
              <Button
                variant="white"
                className="flex-1"
                onClick={() => setModalOpen(true)}
                disabled={result === null}
              >
                Partager mes résultats
              </Button>
            </div>
          </div>

          <div>
            <ResultsPanel
              result={result}
              loading={showSkeleton}
              symbol={symbol}
              coinName={coinName}
              amount={amount}
              frequency={frequency}
              from={from}
              to={to}
              periodsText={periodsText}
              tutoUrl={TUTO_URL}
            />
          </div>
        </div>

        <section className="mt-14" aria-label="Évolution de l'investissement">
          {/* Tabs - height reserved so results never push the chart down on load. */}
          <div className="mb-8 flex min-h-[60px] items-center justify-center">
            {result && !showSkeleton ? (
              <ViewTabs value={view} onChange={setView} />
            ) : null}
          </div>

          {view === "calendar" && result && !showSkeleton ? (
            <CalendarTable series={result.series} symbol={symbol} />
          ) : (
            <>
              <div className="mb-6">
                {showSkeleton ? (
                  <div className="flex flex-wrap justify-center gap-12">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="text-center">
                        <Skeleton className="mx-auto mb-2.5 h-3.5 w-[90px]" />
                        <Skeleton className="mx-auto h-6 w-[130px]" />
                      </div>
                    ))}
                  </div>
                ) : result ? (
                  <StatsRow
                    finalValue={result.finalValue}
                    gain={result.gain}
                    invested={result.invested}
                  />
                ) : null}
              </div>

              {showSkeleton ? (
                <Skeleton className="h-[280px] w-full rounded-2xl min-[860px]:h-[360px]" />
              ) : result ? (
                <>
                  <div className="mb-5 flex justify-center">
                    <ChartTypeTabs value={chartType} onChange={setChartType} />
                  </div>
                  {chartType === "bar" ? (
                    <YearBarChart series={result.series} />
                  ) : chartType === "doughnut" ? (
                    <DoughnutChart
                      invested={result.invested}
                      gain={result.gain}
                    />
                  ) : (
                    <HistoryChart
                      series={result.series}
                      symbol={symbol}
                      variant={chartType === "area" ? "area" : "line"}
                    />
                  )}
                </>
              ) : (
                <div className="flex h-[280px] min-h-[200px] items-center justify-center text-center text-[0.9rem] text-blue-light min-[860px]:h-[360px]">
                  {loadError ??
                    computed.dataError ??
                    "Choisissez un actif pour afficher l'évolution."}
                </div>
              )}
            </>
          )}
        </section>

        <SaveShareModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          sim={{ coinId, amount, frequency, from, to }}
          onDownloadImage={downloadResultsImage}
        />

        {result ? (
          <div
            aria-hidden="true"
            className="pointer-events-none fixed left-[-9999px] top-0"
          >
            <div ref={shareRef}>
              <ShareCard
                result={result}
                symbol={symbol}
                coinName={coinName}
                amount={amount}
                frequency={frequency}
                from={from}
                to={to}
                periodsText={periodsText}
                generatedAt={Date.now()}
              />
            </div>
          </div>
        ) : null}
      </div>
    </TooltipProvider>
  );
}
