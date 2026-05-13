---
name: cosmo-benchmark
description: Benchmark workflows for cosmo-pd — engine, bridge, UI. When and how to benchmark, baseline comparison with worktrees.
allowed-tools: Read, Write, Edit, Bash, Task, Glob
version: 1.0
priority: HIGH
---

# Cosmo-PD Benchmarking Skill

## When to Benchmark

| Trigger | Benchmark | Reason |
|---------|-----------|--------|
| Engine optimisation | `engine` | Measure DSP throughput change |
| WASM/bridge change | `bridge` | Measure JS↔WASM comm latency |
| Rust dep upgrade | `engine` | Detect codegen regressions |
| Frontend perf work | `ui` | Measure AudioWorklet round-trip |
| Before/after any perf-sensitive PR | all | Prove improvement, catch regressions |
| CI reports regression | matching type | Isolate and fix |

## Workflow: Compare Against Baseline (git worktree)

Do NOT stash or lose your working tree. Use a git worktree for the baseline:

```bash
# 1. Get baseline from main branch
git worktree add ../cosmo-pd-baseline main

# 2. Run baseline benchmarks
cd ../cosmo-pd-baseline
bun run perf:engine:all
# or: bun run perf:bridge
# or: bun perf:web

# 3. Return to your working branch
cd ../cosmo-pd

# 4. Run current benchmarks
bun run perf:engine:current
# or: bun run perf:bridge (writes to target/perf/bridge/current.json)

# 5. Compare
bun run perf:engine:compare

# 6. Clean up baseline worktree
git worktree remove ../cosmo-pd-baseline
```

For bridge benchmarks specifically (they need the dev server running):

```bash
# Terminal 1: baseline branch worktree
cd ../cosmo-pd-baseline && bun run build:engine && bun run dev

# Terminal 2: run baseline
bun run ./scripts/perf-bridge-benchmark.mjs \
  --url http://localhost:5173/synth-renderer \
  --out baseline.json

# Terminal 3: switch to your branch's dev server, repeat
```

## Which Benchmark to Use

| Type | Command | Output | Compare |
|------|---------|--------|---------|
| **Engine** | `bun run perf:engine:all` | `target/perf/engine/current.json` | `bun run perf:engine:compare` |
| **Engine (nightly bench)** | `bun run perf:engine:bench` | Criterion HTML | — |
| **Bridge** | `bun run perf:bridge` | stdout JSON | `bun run perf:bridge:compare` |
| **UI** | `bun run perf:web` | stdout JSON | `bun run perf:ui:compare` |

## Worktree Cleanup

```bash
# List all worktrees
git worktree list

# Remove when done
git worktree remove ../cosmo-pd-baseline
```

WARNING: If the baseline worktree's dev server is still running, `git worktree remove` will fail. Kill the server first.

## Interpreting Results

### Engine (render-bench)

- **ns/sample**: nanoseconds per audio sample (lower is better)
- **RT factor**: realtime factor (< 1.0 means faster than realtime)
- **Checksum**: must match between baseline and current (bit-identical audio)
- Regression threshold: 130% of baseline (CI fails)

### Bridge (bridge-bench)

- **p50RttMs / p95RttMs**: median and 95th percentile round-trip time
- Regression threshold: >10% increase in p50 or p95 flags a warning

### UI (benchmarkHarness)

- **p50LastMs / p95LastMs**: median and 95th percentile block render time
- **p50LastRtPercent**: realtime budget percentage

## Quick Reference

```bash
# One-shot: engine all scenarios
bun run perf:engine:all
bun run perf:engine:current  # writes to target/perf/engine/current.json

# Compare baseline vs current
bun run perf:engine:compare

# Bridge (starts dev server, runs, compares)
bun run perf:bridge
```
