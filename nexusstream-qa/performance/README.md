# Performance Testing

This folder contains the serious performance workload for NexusStream.

## Tooling
- k6 for load and throughput testing
- Grafana dashboard for visualization
- Python pytest remains for functional testing only

## Run locally

```bash
k6 run --env BASE_URL=http://localhost:3000 performance/k6-load-test.js
```

## What this covers
- GET /api/products under a realistic traffic profile
- 95th percentile latency threshold
- failure-rate threshold
- staged load ramp for smoke-to-load validation

## Why this is separate
This is not a unit or functional test. It is a load test designed to simulate traffic and measure API performance under stress.
