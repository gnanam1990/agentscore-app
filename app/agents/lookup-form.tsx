"use client";

import { useState } from "react";
import type { ScoreResponse } from "@/src/data";

const addressPattern = /^0x[a-fA-F0-9]{40}$/;

export function LookupForm() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const valid = addressPattern.test(address.trim());

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid) return;
    setBusy(true);
    setResult(null);
    try {
      const response = await fetch(`/api/v1/score/${address.trim()}`);
      setResult((await response.json()) as ScoreResponse);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card form" onSubmit={submit}>
      <label>
        <span className="card-label">Agent wallet address</span>
        <input
          className="input"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="0x..."
          spellCheck={false}
        />
      </label>
      <button className="button primary" disabled={!valid || busy} type="submit">
        {busy ? "Checking..." : "Check score"}
      </button>
      {address && !valid && <p className="note">Enter a valid 0x address.</p>}
      {result && (
        <div className="card notice">
          <div className="card-label">{result.data_status}</div>
          <div className="metric">{result.score ?? "Needs data"}</div>
          <p className="note">{result.error ?? `Tier: ${result.tier}`}</p>
        </div>
      )}
    </form>
  );
}
