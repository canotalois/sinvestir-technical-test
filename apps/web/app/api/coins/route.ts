import { NextResponse } from "next/server";
import { withFallback } from "../_providers";
import { handleProviderError } from "../_providers/httpError";

export const revalidate = 3600;

export async function GET() {
  try {
    const { value: coins } = await withFallback((provider) =>
      provider.listCoins(),
    );
    return NextResponse.json(coins);
  } catch (err) {
    return handleProviderError(err);
  }
}
