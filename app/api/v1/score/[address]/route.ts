import { NextResponse } from "next/server";
import { getScore } from "@/src/data";

const addressPattern = /^0x[a-fA-F0-9]{40}$/;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  if (!addressPattern.test(address)) {
    return NextResponse.json({ error: "Invalid address format" }, { status: 400 });
  }

  const result = await getScore(address);
  return NextResponse.json(result, {
    status: result.data_status === "connectors_required" ? 503 : 200,
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
