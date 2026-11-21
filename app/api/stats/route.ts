import { NextResponse } from "next/server";
import { getStats } from "@/src/data";

const headers = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
};

// Compact stats for external dashboards. Uses the same score index as the
// Overview page; never returns placeholder numbers.
export async function GET() {
  const stats = await getStats();

  if (stats.data_status !== "connected") {
    return NextResponse.json(
      {
        error: "no live data source",
        reason:
          stats.data_status === "connectors_required"
            ? "AGENTSCORE_STATS_URL is not configured; no real score index is connected."
            : `Score index request failed: ${stats.error ?? "unknown error"}`,
      },
      { status: 503, headers }
    );
  }

  if (stats.total_agents === null && stats.average_score === null) {
    return NextResponse.json(
      {
        error: "no live data source",
        reason: "Score index returned no numeric total_agents or average_score.",
      },
      { status: 503, headers }
    );
  }

  return NextResponse.json(
    {
      agents: stats.total_agents,
      average_score: stats.average_score,
      source: "AgentScore stats index (AGENTSCORE_STATS_URL)",
      as_of: stats.last_checked_at,
    },
    { headers }
  );
}
