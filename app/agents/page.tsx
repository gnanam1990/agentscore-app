import { LookupForm } from "./lookup-form";

export const metadata = {
  title: "Lookup - AgentScore",
};

export default function AgentsPage() {
  return (
    <main className="grid">
      <section className="hero">
        <div className="eyebrow">Score lookup</div>
        <h1>Look up an agent</h1>
        <p className="lead">
          Score lookup calls `/api/v1/score/:address`. Without `AGENTSCORE_FACTORS_URL`, the API
          returns a connector-required response instead of a fake score.
        </p>
      </section>
      <LookupForm />
    </main>
  );
}
