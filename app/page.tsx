import Link from "next/link";
import { getStats } from "@/src/data";

const tiers = [
  ["Elite", "800-1000", "#3b82f6"],
  ["Trusted", "600-799", "#22c55e"],
  ["Verified", "400-599", "#eab308"],
  ["Rookie", "200-399", "#f97316"],
  ["Untrusted", "0-199", "#ef4444"],
] as const;

export default async function HomePage() {
  const stats = await getStats();

  return (
    <main className="grid">
      <section className="hero">
        <div className="eyebrow">Kite Mainnet reputation</div>
        <h1>AgentScore</h1>
        <p className="lead">
          Reputation scoring for AI agents on Kite. This deployment is live, but real scores are
          unavailable until transaction, KPass, reliability, service, and governance factor sources
          are connected.
        </p>
        <div className="actions">
          <Link className="button primary" href="/agents">
            Look up agent
          </Link>
          <Link className="button" href="/leaderboard">
            Leaderboard
          </Link>
        </div>
      </section>

      <section className="grid stats">
        <Stat label="Data status" value={stats.data_status === "connected" ? "Live" : "Connectors required"} />
        <Stat label="Total agents" value={formatStat(stats.total_agents)} />
        <Stat label="Average score" value={formatStat(stats.average_score)} />
        <Stat label="Missing envs" value={String(stats.missing_integrations.length)} note={stats.missing_integrations.join(", ")} />
      </section>

      <section className="card notice">
        <h2>Real data required</h2>
        <p className="note">
          Random or demo scores are disabled. Configure `AGENTSCORE_STATS_URL`,
          `AGENTSCORE_LEADERBOARD_URL`, and `AGENTSCORE_FACTORS_URL` to enable live scoring.
        </p>
      </section>

      <section className="grid tiers">
        {tiers.map(([name, range, color]) => (
          <div className="card" key={name}>
            <div className="card-label">{name}</div>
            <div className="metric" style={{ color }}>
              {range}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="card">
      <div className="card-label">{label}</div>
      <div className="metric">{value}</div>
      {note && <p className="note">{note}</p>}
    </div>
  );
}

function formatStat(value: number | null) {
  return value === null ? "Needs data" : value.toLocaleString();
}
