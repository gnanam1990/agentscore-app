# AgentScore

> A reputation system for autonomous on-chain agents on Kite Mainnet.

## Overview

AgentScore computes a 0–1000 reputation score for an agent address based on on-chain activity, then exposes the result through a small JSON API and a dashboard. Each score is broken down into weighted factors (age, volume, verification, reliability, diversity, governance) and mapped to a trust tier. It is built for anyone who needs a comparable, transparent trust signal for agents transacting on Kite Mainnet.

## Features

- Deterministic scoring engine that combines six weighted factors into a single 0–1000 score and a trust tier (`untrusted`, `rookie`, `verified`, `trusted`, `elite`).
- JSON API for per-address scores, a leaderboard, and aggregate stats.
- Dashboard UI with Overview, Leaderboard, and Lookup pages.
- Explicit data-status reporting: endpoints return `connectors_required` (with the list of missing integrations) when live data sources are not configured, `connected` when they are, and `error` on upstream failure. There is no random or demo data.

## Tech stack

- Next.js 16 (App Router) with React 19
- TypeScript
- pnpm

## Architecture

- `src/scoring.ts` — the scoring engine: factor weights, `computeScore`, `getTier`, and tier color constants.
- `src/data.ts` — data layer that reads the configured upstream URLs and shapes the API responses; declares the required environment variables.
- `app/api/v1/*` — route handlers exposing the public JSON API.
- `app/` — dashboard pages (`/`, `/leaderboard`, `/agents`) and shared layout.

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 9 (the repo pins `pnpm@9.12.0` via `packageManager`)

### Installation

```bash
pnpm install
```

### Configuration

Live data requires the following environment variables (set them in `.env.local`). Each points at an upstream JSON source. When unset, the matching endpoint reports `connectors_required` instead of returning data.

| Variable | Purpose |
|---|---|
| `AGENTSCORE_STATS_URL` | Source for aggregate stats (total agents, average score, tier distribution). |
| `AGENTSCORE_LEADERBOARD_URL` | Source for the ranked leaderboard of agents. |
| `AGENTSCORE_FACTORS_URL` | Source for per-address scoring factors; queried with an `address` parameter. |

### Running

```bash
pnpm dev      # start the development server
pnpm build    # production build
pnpm start    # serve the production build
```

## Usage

### Scoring model

| Factor | Weight | Description |
|---|---|---|
| Age | 15% | Days since first transaction |
| Volume | 25% | Total value transacted |
| KPass | 15% | KitePass verification status |
| Reliability | 20% | Payment success rate |
| Diversity | 15% | Number of unique services used |
| Governance | 10% | Staking participation |

Tiers by score: `elite` (≥800), `trusted` (≥600), `verified` (≥400), `rookie` (≥200), otherwise `untrusted`.

### API

| Endpoint | Description |
|---|---|
| `GET /api/v1/score/{address}` | Score and factor breakdown for a single agent address. Validates the `0x…` address format and returns `400` on a malformed address. |
| `GET /api/v1/leaderboard` | Ranked list of agents. |
| `GET /api/v1/stats` | Aggregate statistics and tier distribution. |

```bash
curl http://localhost:3000/api/v1/score/0x0000000000000000000000000000000000000000
curl http://localhost:3000/api/v1/leaderboard
curl http://localhost:3000/api/v1/stats
```

When the relevant URL is not configured, responses include `"data_status": "connectors_required"` and a `missing_integrations` list; the score endpoint returns HTTP `503` in that case.

## Status

Working application. The scoring engine, API routes, and dashboard are implemented. Live results depend on configuring the three upstream data URLs above — without them the API reports `connectors_required` rather than fabricating data. No automated tests are included in this repository.

## License

No license specified.
