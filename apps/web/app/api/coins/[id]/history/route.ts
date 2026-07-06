import { NextResponse } from "next/server";
import { withFallback } from "../../../_providers";
import { handleProviderError } from "../../../_providers/httpError";

export const revalidate = 21_600;

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const { value: prices, degraded } = await withFallback((provider) =>
      provider.priceHistory(id),
    );
    return NextResponse.json(
      { prices },
      { headers: { "x-data-degraded": String(degraded) } },
    );
  } catch (err) {
    return handleProviderError(err);
  }
}
