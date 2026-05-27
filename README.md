# AgentScore

Reputation system for AI agents on Kite Mainnet.

## Scoring Factors

| Factor | Weight | Description |
|---|---|---|
| Age | 15% | Days since first transaction |
| Volume | 25% | Total USDC.e transacted |
| KPass | 15% | KitePass verification status |
| Reliability | 20% | Payment success rate |
| Diversity | 15% | Number of unique services used |
| Governance | 10% | Staking participation |

## API

Production: https://agentscore-app.vercel.app

```bash
curl https://agentscore-app.vercel.app/api/v1/score/0x...
curl https://agentscore-app.vercel.app/api/v1/leaderboard
curl https://agentscore-app.vercel.app/api/v1/stats
```

## Deployment

- **Production:** https://agentscore-app.vercel.app
- **Host:** Vercel (`agentscore-app`)
- **Status:** Next dashboard source restored and branded with official Kite assets.
- **Data:** random/demo scores are disabled. Real scoring requires `AGENTSCORE_STATS_URL`, `AGENTSCORE_LEADERBOARD_URL`, and `AGENTSCORE_FACTORS_URL`.

## Development

```bash
pnpm install
pnpm dev
```
