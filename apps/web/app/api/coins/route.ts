import { NextResponse } from "next/server";
import { getProvider } from "../_providers";
import { handleProviderError } from "../_providers/httpError";

export const revalidate = 3600;

export async function GET() {
  try {
    const coins = await getProvider().listCoins();
    return NextResponse.json(coins);
  } catch (err) {
    return handleProviderError(err);
  }
}
