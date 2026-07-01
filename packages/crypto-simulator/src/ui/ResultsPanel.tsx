import type { ReactNode } from "react";
import { Tooltip } from "./Tooltip";
import { Button } from "./Button";
import { PlayCircleIcon } from "./icons";
import { Skeleton } from "./Skeleton";
import { SURFACE } from "./styles";
import {
  formatEur,
  formatAmount,
  formatUnitsNumber,
  formatPct,
  formatPctValue,
  formatDateLong,
  FREQUENCY_LABELS,
} from "./format";
import type { Frequency, SimulationResult } from "../core/types";

interface ResultsPanelProps {
  readonly result: SimulationResult | null;
  readonly loading: boolean;
  readonly symbol: string;
  readonly coinName: string;
  readonly amount: number;
  readonly frequency: Frequency;
  readonly from: string;
  readonly to: string;
  readonly periodsText: string | null;
  readonly tutoUrl?: string;
  /** Shown on the right of the header (export card). Ignored when `tutoUrl` is set. */
  readonly dateLabel?: string;
}

const CARD = `@container flex flex-col gap-3 min-h-[152px] p-6 ${SURFACE}`;
// Number size indexed on the card width (cqi) → never overflows,
// the unit stays on the same line; capped at the recorded sizes (30px / 41,6px).
const CARD_VALUE =
  "text-[clamp(1.125rem,9cqi,1.875rem)] font-normal leading-[1.05] tabular-nums [overflow-wrap:anywhere]";
const CARD_VALUE_BIG = `${CARD_VALUE} text-[clamp(1.5rem,13cqi,2.6rem)]`;

function Card({
  label,
  info,
  wide,
  children,
}: {
  label: string;
  info?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={wide === true ? `${CARD} col-span-2` : CARD}>
      <div className="flex items-center gap-1.5 text-sm font-normal text-white">
        <span>{label}</span>
        {info !== undefined ? <Tooltip text={info} /> : null}
      </div>
      {children}
    </div>
  );
}

function Value({
  children,
  unit,
  big,
}: {
  children: ReactNode;
  unit?: string;
  big?: boolean;
}) {
  return (
    <div className="mt-auto flex min-w-0 flex-wrap items-baseline gap-1.5">
      <span className={big === true ? CARD_VALUE_BIG : CARD_VALUE}>
        {children}
      </span>
      {unit !== undefined ? (
        <span className="text-sm font-normal text-white">{unit}</span>
      ) : null}
    </div>
  );
}

const dash = (
  <div className="mt-auto flex flex-wrap items-baseline gap-1.5">
    <span className={`${CARD_VALUE} opacity-40`}>—</span>
  </div>
);

function InvestedGainBar({ result }: { result: SimulationResult }) {
  const gain = result.gain;
  const hasGain = gain >= 0;
  // Full track (gold = gain) + blue « investi » pill on top, like S'investir.
  const goldWidth = hasGain && result.finalValue > 0 ? 100 : 0;
  const blueWidth = hasGain
    ? result.finalValue > 0
      ? (result.invested / result.finalValue) * 100
      : 0
    : result.invested > 0
      ? (result.finalValue / result.invested) * 100
      : 0;

  return (
    <div>
      <div className="mt-4 flex flex-wrap justify-between gap-4 text-xs font-light">
        <span className="text-blue-sky">
          Investi
          <span className="ml-1.5 text-sm font-bold">
            {formatEur(result.invested)}
          </span>
        </span>
        <span className={hasGain ? "text-yellow" : "text-negative"}>
          {hasGain ? "Plus-value" : "Moins-value"}
          <span className="ml-1.5 text-sm font-bold">{formatEur(gain)}</span>
        </span>
      </div>
      <div
        className="relative mt-2 h-[30px] w-full overflow-hidden rounded-full bg-white/[0.08]"
        role="img"
        aria-label="Répartition investi / plus-value"
      >
        {goldWidth > 0 ? (
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-yellow"
            style={{ width: `${goldWidth}%` }}
          />
        ) : null}
        <span
          className="absolute inset-y-0 left-0 rounded-full bg-blue-sky"
          style={{ width: `${blueWidth}%` }}
        />
      </div>
    </div>
  );
}

function Summary({
  result,
  coinName,
  amount,
  frequency,
  from,
  to,
}: ResultsPanelProps & { result: SimulationResult }) {
  const freq = FREQUENCY_LABELS[frequency].toLowerCase();
  return (
    <p
      className={`col-span-2 p-6 ${SURFACE} text-sm font-light leading-[1.7] text-white/85 min-[560px]:col-span-3 [&_strong]:font-medium [&_strong]:text-white`}
    >
      En investissant <strong>{formatEur(amount)}</strong> ({freq}) en{" "}
      <strong>{coinName}</strong> entre le{" "}
      <strong>{formatDateLong(from)}</strong> et le{" "}
      <strong>{formatDateLong(to)}</strong>, vous auriez investi{" "}
      <strong>{formatEur(result.invested)}</strong> au total pour une valeur de{" "}
      <strong>{formatEur(result.finalValue)}</strong> — soit une performance de{" "}
      <strong>{formatPct(result.performancePct)}</strong>.
    </p>
  );
}

export function ResultsPanel(props: ResultsPanelProps) {
  const { result, loading, symbol, periodsText, tutoUrl, dateLabel } = props;
  const perfClass =
    result === null
      ? ""
      : result.performancePct >= 0
        ? "text-positive"
        : "text-negative";

  return (
    <section className="min-w-0" aria-label="Vos résultats">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h3 className="m-0 border-l-2 border-blue-sky pl-4 text-2xl font-normal leading-[1.1] text-white">
          Vos résultats
        </h3>
        {tutoUrl !== undefined ? (
          <Button
            data-share-hide="true"
            className="shrink-0 text-[12px]"
            onClick={() => window.open(tutoUrl, "_blank", "noreferrer")}
            icon={<PlayCircleIcon className="h-4 w-4" />}
          >
            Voir notre vidéo tuto
          </Button>
        ) : dateLabel !== undefined ? (
          <span className="shrink-0 text-sm font-light text-blue-light">
            {dateLabel}
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 min-[560px]:grid-cols-3">
        <Card
          label="Valeur finale"
          info="Valeur actuelle de votre position au dernier prix connu."
          wide
        >
          {loading ? (
            <Skeleton className="mt-auto h-[30px] w-[70%]" />
          ) : result ? (
            <Value unit="EUR">{formatAmount(result.finalValue)}</Value>
          ) : (
            dash
          )}
          {loading ? (
            <div className="mt-4">
              <div className="flex justify-between gap-4">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3.5 w-24" />
              </div>
              <Skeleton className="mt-2 h-[30px] w-full rounded-full" />
            </div>
          ) : result ? (
            <InvestedGainBar result={result} />
          ) : null}
        </Card>

        <Card
          label="Performance"
          info="Plus ou moins-value rapportée au montant investi."
        >
          {loading ? (
            <Skeleton className="mt-auto h-[42px] w-[70%]" />
          ) : result ? (
            <div className="mt-auto flex min-w-0 flex-wrap items-baseline gap-1.5">
              <span className={`${CARD_VALUE_BIG} ${perfClass}`}>
                {formatPctValue(result.performancePct)}
              </span>
              <span className="text-sm font-normal text-white">%</span>
            </div>
          ) : (
            dash
          )}
        </Card>

        <Card
          label="Crypto acquise"
          info="Quantité totale de l'actif accumulée sur la période."
        >
          {loading ? (
            <Skeleton className="mt-auto h-[30px] w-[80%]" />
          ) : result ? (
            <Value unit={symbol.toUpperCase()}>
              {formatUnitsNumber(result.units)}
            </Value>
          ) : (
            dash
          )}
        </Card>

        <Card
          label="Prix de revient moyen"
          info="Prix moyen d'achat (montant investi / quantité acquise)."
        >
          {loading ? (
            <Skeleton className="mt-auto h-[30px] w-[80%]" />
          ) : result ? (
            <Value unit="EUR">{formatAmount(result.averagePrice)}</Value>
          ) : (
            dash
          )}
        </Card>

        <Card
          label={
            periodsText !== null
              ? `Total investi · ${periodsText}`
              : "Total investi"
          }
        >
          {loading ? (
            <Skeleton className="mt-auto h-[30px] w-[80%]" />
          ) : result ? (
            <Value unit="EUR">{formatAmount(result.invested)}</Value>
          ) : (
            dash
          )}
        </Card>

        {loading ? (
          <div className={`col-span-2 p-6 ${SURFACE} min-[560px]:col-span-3`}>
            <Skeleton className="mb-2 h-3.5 w-full" />
            <Skeleton className="h-3.5 w-[85%]" />
          </div>
        ) : result ? (
          <Summary {...props} result={result} />
        ) : null}
      </div>
    </section>
  );
}
