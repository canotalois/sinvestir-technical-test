import { summarizeByYear } from "../core/yearly";
import { formatAmount, formatUnitsNumber, formatPctValue } from "./format";
import { SURFACE, signClass } from "./styles";
import type { SeriesPoint } from "../core/types";

const TH = "px-5 py-4 font-light text-blue-light";
const TD = "px-5 py-3.5 tabular-nums";

export function CalendarTable({
  series,
  symbol,
}: {
  series: readonly SeriesPoint[];
  symbol: string;
}) {
  const rows = summarizeByYear(series);

  return (
    <div className={`overflow-x-auto ${SURFACE}`}>
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className={TH}>Année</th>
            <th className={`${TH} text-right`}>Investi</th>
            <th className={`${TH} text-right`}>Acquis</th>
            <th className={`${TH} text-right`}>Valeur</th>
            <th className={`${TH} text-right`}>Perf.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.year}
              className="border-b border-white/5 last:border-0"
            >
              <td className={`${TD} font-normal text-white`}>{row.year}</td>
              <td className={`${TD} text-right text-white`}>
                {formatAmount(row.invested)} €
              </td>
              <td className={`${TD} text-right text-white`}>
                {formatUnitsNumber(row.units)} {symbol.toUpperCase()}
              </td>
              <td className={`${TD} text-right text-white`}>
                {formatAmount(row.value)} €
              </td>
              <td
                className={`${TD} text-right ${signClass(row.performancePct)}`}
              >
                {formatPctValue(row.performancePct)} %
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
