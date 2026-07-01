export type ContractErrorCode = "HTTP_ERROR" | "SHAPE_MISMATCH";

/**
 * Network boundary error: the HTTP status is not OK, or the response does not
 * match the expected contract. Always preferable to silent acceptance.
 */
export class ContractError extends Error {
  readonly code: ContractErrorCode;

  constructor(
    code: ContractErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ContractError";
    this.code = code;
  }
}
