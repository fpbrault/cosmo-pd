# Benchmarking

This project has three benchmark systems for different parts of the stack.

## 1. Engine Benchmarks

Measures Rust/WASM DSP throughput — audio rendering speed for 33 scenarios across 3 voice counts (99 cases).

### Run

```bash
# Full suite (all scenarios × 3 voice counts)
cargo run --release --bin render-bench -- --all --json > results.json

# Specific suites
cargo run --release --bin render-bench -- --suite hotspots --json
cargo run --release --bin render-bench -- --suite algos --json

# Single scenario
cargo run --release --bin render-bench -- --scenario fun-bass-like --voices 6 --json
```

### Compare results

```bash
bun run ./scripts/perf-engine-compare.mjs baseline.json current.json
```

CI-compatible with `--markdown-out` and `--fail-on-regressions` flags.

### CI

- PR job `perf-benchmarks` in `.github/workflows/ci.yml` — builds engine from base + PR branch, runs render-bench on both, compares, fails on regressions
- Main branch push to `.github/workflows/engine-benchmark-pages.yml` — publishes to GitHub Pages historical trends

---

## 2. Bridge Benchmarks

Measures engine-frontend communication latency — `setParams` round-trip, telemetry poll RTT, init time, churn handling. Runs via Playwright in the real browser.

### Run

```bash
# Full suite (4 scenarios)
bun run perf:bridge
# or: bun run ./scripts/perf-bridge-web.mjs

# Single scenario
bun run perf:bridge:benchmark -- --scenario telemetry-rtt

# With explicit URL
bun run ./scripts/perf-bridge-benchmark.mjs \
  --url http://localhost:5173/synth-renderer \
  --out results.json \
  --scenario telemetry-rtt
```

### Compare

```bash
bun run perf:bridge:compare baseline.json current.json
```

### CI

- PR job `perf-benchmarks` (same as engine) — runs bridge benchmarks from base + PR, compares, warns on >10% regression
- Main branch tracking in `engine-benchmark-pages.yml`

### Scenarios

| ID | What it measures |
|---|---|
| `telemetry-rtt` | Latency of a single telemetry poll cycle (requestRuntimeTelemetry → runtimeModSources response) |
| `param-set-telemetry` | Time from `setParams` to reflecting in next telemetry poll |
| `churn` | Rapid param changes — measures throughput of setParams under load |
| `note-churn` | Rapid note on/off — measures MIDI event throughput |

---

## 3. UI Benchmarks

Measures end-to-end audio rendering performance from the JavaScript side (AudioWorklet-based). Uses `window.__czBenchmark` API.

### Run

```bash
bun run perf:web
# or: bun run ./scripts/perf-web-benchmark.mjs

# Manual
bun run ./scripts/perf-ui-benchmark.mjs \
  --url http://localhost:5173/synth-renderer \
  --out results.json
```

### Scenarios

| ID | What it measures |
|---|---|
| `idle` | Engine with no active voices (baseline overhead) |
| `single-note` | Sustained single voice for 2.6s |
| `octave-pulses` | Rapid note on/off churn |
| `chord-stabs` | Repeated 3-note chords (polyphony stress) |

---

## Adding a New Scenario

### Engine benchmark

1. Add scenario params in `packages/cosmo-synth-engine/src/bin/render-bench.rs` (scenarios array)
2. Rebuild with `cargo build --release --bin render-bench`
3. Run with `--scenario <name> --json`

### Bridge benchmark

1. Add scenario in `packages/cosmo-pd101/src/lib/performance/bridge-bench.ts`
2. Export type if custom options needed
3. Run via Playwright with `--scenario <id>`

### UI benchmark

1. Add scenario in `packages/cosmo-pd101/src/lib/performance/benchmarkHarness.ts`
2. The scenario must use the `BenchmarkRuntime` interface (noteOn/noteOff/getPerformanceMetrics)
3. Run via `perf-ui-benchmark.mjs`

---

## Architecture

```
┌──────────────────────┐     ┌──────────────────┐     ┌─────────────────────────────┐
│ Rust Engine Bench    │────▶│ render-bench.rs  │────▶│ JSON report                  │
│ (99 cases, criterion)│     │ (binary runner)  │     │ { cases: [{ scenario,       │
└──────────────────────┘     └──────────────────┘     │   voices, p50, p95, ... }] }│
                                                      └─────────────────────────────┘
┌──────────────────────┐     ┌──────────────────┐     ┌─────────────────────────────┐
│ Bridge Bench         │────▶│ perf-bridge-     │────▶│ JSON report                  │
│ (4 scenarios,        │     │ benchmark.mjs    │     │ { cases: [{ scenario,       │
│  Playwright)         │     │ (Playwright)     │     │   p50RttMs, ... }] }          │
└──────────────────────┘     └──────────────────┘     └─────────────────────────────┘
┌──────────────────────┐     ┌──────────────────┐     ┌─────────────────────────────┐
│ UI Bench             │────▶│ perf-ui-         │────▶│ JSON report                  │
│ (4 scenarios,        │     │ benchmark.mjs    │     │ { cases: [{ scenario,       │
│  AudioWorklet)       │     │ (Playwright)     │     │   p50LastMs, ... }] }        │
└──────────────────────┘     └──────────────────┘     └─────────────────────────────┘
```

Each produces JSON reports that compare scripts (`perf-engine-compare.mjs`, `perf-bridge-compare.mjs`, `perf-ui-compare.mjs`) can cross-reference.
