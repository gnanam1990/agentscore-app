export interface ScoreFactors {
  age: number;
  volume: number;
  kpass: number;
  reliability: number;
  diversity: number;
  governance: number;
}

export interface AgentScoreResult {
  address: string;
  score: number;
  tier: "untrusted" | "rookie" | "verified" | "trusted" | "elite";
  factors: ScoreFactors;
  computed_at: string;
}

const WEIGHTS = {
  age: 0.15,
  volume: 0.25,
  kpass: 0.15,
  reliability: 0.20,
  diversity: 0.15,
  governance: 0.10,
};

export function computeScore(factors: ScoreFactors): number {
  let score = 0;
  score += factors.age * WEIGHTS.age;
  score += factors.volume * WEIGHTS.volume;
  score += factors.kpass * WEIGHTS.kpass;
  score += factors.reliability * WEIGHTS.reliability;
  score += factors.diversity * WEIGHTS.diversity;
  score += factors.governance * WEIGHTS.governance;
  return Math.round(Math.min(1000, Math.max(0, score)));
}

export function getTier(score: number): AgentScoreResult["tier"] {
  if (score >= 800) return "elite";
  if (score >= 600) return "trusted";
  if (score >= 400) return "verified";
  if (score >= 200) return "rookie";
  return "untrusted";
}

export const TIER_COLORS = {
  untrusted: "#ef4444",
  rookie: "#f97316",
  verified: "#eab308",
  trusted: "#22c55e",
  elite: "#3b82f6",
};
