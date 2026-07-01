export type SimulationErrorCode =
  | "INVALID_AMOUNT"
  | "INVALID_RANGE"
  | "NO_PRICE_DATA"
  | "NO_INVESTMENTS_IN_RANGE";

/** Simulation domain error. The `code` lets the UI switch on the failure. */
export class SimulationError extends Error {
  readonly code: SimulationErrorCode;

  constructor(code: SimulationErrorCode, message: string) {
    super(message);
    this.name = "SimulationError";
    this.code = code;
  }
}
