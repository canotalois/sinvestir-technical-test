export { CryptoSimulator } from "./ui/CryptoSimulator";
export type { CryptoSimulatorProps } from "./ui/CryptoSimulator";

export { simulate } from "./core/simulate";
export { summarizeByYear, type YearSummary } from "./core/yearly";
export { SimulationError } from "./core/errors";
export type { SimulationErrorCode } from "./core/errors";
export {
  FREQUENCIES,
  isFrequency,
  type Frequency,
  type PricePoint,
  type SimulationInput,
  type SimulationResult,
  type SeriesPoint,
} from "./core/types";

export {
  fetchCoins,
  fetchPriceHistory,
  type DataClientOptions,
} from "./data/client";
export { ContractError } from "./data/errors";
export type { ContractErrorCode } from "./data/errors";
export {
  coinSchema,
  coinsSchema,
  marketChartSchema,
  type Coin,
} from "./data/contracts";
