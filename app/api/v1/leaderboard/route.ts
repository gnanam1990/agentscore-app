import { NextResponse } from "next/server";
import { getLeaderboard } from "@/src/data";

export async function GET() {
  return NextResponse.json(await getLeaderboard(), {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
