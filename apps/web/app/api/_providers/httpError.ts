import { NextResponse } from "next/server";
import { ProviderError } from "./types";

export function handleProviderError(err: unknown): NextResponse {
  const status = err instanceof ProviderError ? err.status : 502;
  const message = err instanceof Error ? err.message : "Unknown error";
  return NextResponse.json({ error: "upstream", message }, { status });
}
