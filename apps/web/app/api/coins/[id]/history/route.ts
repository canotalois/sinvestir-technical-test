import { NextResponse } from "next/server";
import { getProvider } from "../../../_providers";
import { handleProviderError } from "../../../_providers/httpError";

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
    return handleProviderError(err);
  }
}
