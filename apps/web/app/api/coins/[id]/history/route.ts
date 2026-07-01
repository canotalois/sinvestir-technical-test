import { NextResponse } from "next/server";
import { getProvider, ProviderError } from "../../../_providers";

export const revalidate = 21_600;

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const prices = await getProvider().priceHistory(id);
    return NextResponse.json({ prices });
  } catch (err) {
    const status = err instanceof ProviderError ? err.status : 502;
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "upstream", message }, { status });
  }
}
