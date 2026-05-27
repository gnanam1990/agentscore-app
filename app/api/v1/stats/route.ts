import { NextResponse } from "next/server";
import { getStats } from "@/src/data";

export async function GET() {
  return NextResponse.json(await getStats(), {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
