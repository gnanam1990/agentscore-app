import { computeScore, getTier, type ScoreFactors } from "./scoring";

export const REQUIRED_ENVS = [
  "AGENTSCORE_STATS_URL",
  "AGENTSCORE_LEADERBOARD_URL",
  "AGENTSCORE_FACTORS_URL",
] as const;

export type DataStatus = "connected" | "connectors_required" | "error";

export interface AgentScoreStats {
  data_status: DataStatus;
  total_agents: number | null;
  average_score: number | null;
  tier_distribution: Record<"untrusted" | "rookie" | "verified" | "trusted" | "elite", number | null>;
  missing_integrations: string[];
  last_checked_at: string;
  error?: string;
}

export interface LeaderboardEntry {
  address: string;
  score: number;
  tier: string;
}

export interface LeaderboardResponse {
  data_status: DataStatus;
  agents: LeaderboardEntry[];
  total: number;
  missing_integrations: string[];
  error?: string;
}

export interface ScoreResponse {
  data_status: DataStatus;
  address: string;
  score?: number;
  tier?: string;
  factors?: ScoreFactors;
  computed_at?: string;
  missing_integrations?: string[];
  error?: string;
}

const emptyTierDistribution = {
  untrusted: null,
  rookie: null,
  verified: null,
  trusted: null,
  elite: null,
};

export async function getStats(): Promise<AgentScoreStats> {
  const statsUrl = process.env.AGENTSCORE_STATS_URL;
  if (!statsUrl) {
    return {
      data_status: "connectors_required",
      total_agents: null,
      average_score: null,
      tier_distribution: emptyTierDistribution,
      missing_integrations: [...REQUIRED_ENVS],
      last_checked_at: new Date().toISOString(),
    };
  }

  try {
    const data = await fetchJson<Record<string, unknown>>(statsUrl);
    return {
      data_status: "connected",
      total_agents: toNumber(data.total_agents),
      average_score: toNumber(data.average_score),
      tier_distribution: {
        untrusted: toNumber(data.untrusted),
        rookie: toNumber(data.rookie),
        verified: toNumber(data.verified),
        trusted: toNumber(data.trusted),
        elite: toNumber(data.elite),
      },
      missing_integrations: REQUIRED_ENVS.filter((name) => !process.env[name]),
      last_checked_at: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data_status: "error",
      total_agents: null,
      average_score: null,
      tier_distribution: emptyTierDistribution,
      missing_integrations: REQUIRED_ENVS.filter((name) => !process.env[name]),
      last_checked_at: new Date().toISOString(),
      error: (error as Error).message,
    };
  }
}

export async function getLeaderboard(): Promise<LeaderboardResponse> {
  const leaderboardUrl = process.env.AGENTSCORE_LEADERBOARD_URL;
  if (!leaderboardUrl) {
    return {
      data_status: "connectors_required",
      agents: [],
      total: 0,
      missing_integrations: ["AGENTSCORE_LEADERBOARD_URL"],
    };
  }

  try {
    const data = await fetchJson<{ agents?: LeaderboardEntry[]; total?: number }>(leaderboardUrl);
    return {
      data_status: "connected",
      agents: data.agents ?? [],
      total: data.total ?? data.agents?.length ?? 0,
      missing_integrations: [],
    };
  } catch (error) {
    return {
      data_status: "error",
      agents: [],
      total: 0,
      missing_integrations: [],
      error: (error as Error).message,
    };
  }
}

export async function getScore(address: string): Promise<ScoreResponse> {
  const factorsUrl = process.env.AGENTSCORE_FACTORS_URL;
  if (!factorsUrl) {
    return {
      data_status: "connectors_required",
      address,
      missing_integrations: ["AGENTSCORE_FACTORS_URL"],
      error: "Real scoring requires an indexed factor source.",
    };
  }

  try {
    const url = new URL(factorsUrl);
    url.searchParams.set("address", address);
    const factors = await fetchJson<ScoreFactors>(url.toString());
    const score = computeScore(factors);
    return {
      data_status: "connected",
      address,
      score,
      tier: getTier(score),
      factors,
      computed_at: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data_status: "error",
      address,
      error: (error as Error).message,
    };
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}

function toNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
