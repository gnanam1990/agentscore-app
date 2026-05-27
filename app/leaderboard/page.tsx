import { getLeaderboard } from "@/src/data";

export const metadata = {
  title: "Leaderboard - AgentScore",
};

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();

  return (
    <main className="grid">
      <section className="hero">
        <div className="eyebrow">Agent leaderboard</div>
        <h1>Leaderboard</h1>
        <p className="lead">
          Shows ranked agents after `AGENTSCORE_LEADERBOARD_URL` is connected to a real score index.
        </p>
      </section>

      <section className="card">
        {leaderboard.agents.length ? (
          <div className="grid">
            {leaderboard.agents.map((agent) => (
              <div className="card" key={agent.address}>
                <div className="card-label">{agent.tier}</div>
                <div className="metric">{agent.score}</div>
                <p className="note mono">{agent.address}</p>
              </div>
            ))}
          </div>
        ) : (
          <>
            <h2>No live leaderboard yet</h2>
            <p className="note">
              {leaderboard.data_status === "connectors_required"
                ? "Set AGENTSCORE_LEADERBOARD_URL to publish ranked agents."
                : leaderboard.error ?? "No agents returned by the configured source."}
            </p>
          </>
        )}
      </section>
    </main>
  );
}
