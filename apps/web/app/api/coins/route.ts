import { NextResponse } from "next/server";
import { getProvider, ProviderError } from "../_providers";

export const revalidate = 3600;

export async function GET() {
  try {
    const coins = await getProvider().listCoins();
    return NextResponse.json(coins);
  } catch (err) {
    const status = err instanceof ProviderError ? err.status : 502;
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "upstream", message }, { status });
  }
}
