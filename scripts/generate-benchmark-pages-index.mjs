#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

function usage() {
	console.error(
		"Usage: node scripts/generate-benchmark-pages-index.mjs <data.js> <index.html>",
	);
	process.exit(1);
}

function parseBenchmarkData(dataJsContent) {
	const marker = "window.BENCHMARK_DATA =";
	const markerIndex = dataJsContent.indexOf(marker);
	if (markerIndex === -1) {
		throw new Error("Could not find BENCHMARK_DATA assignment in data.js");
	}

	const jsonText = dataJsContent
		.slice(markerIndex + marker.length)
		.trim()
		.replace(/;\s*$/, "");
	return JSON.parse(jsonText);
}

function groupBenchName(benchName) {
	const voiceMatch = benchName.match(/^(.*)_([0-9]+)_voices$/);
	if (voiceMatch) {
		return {
			group: voiceMatch[1],
			variant: `${voiceMatch[2]} voices`,
		};
	}

	return {
		group: benchName,
		variant: "value",
	};
}

function buildGroupedData(entries) {
	const commitLabels = [];
	const commitDetails = [];
	const groups = new Map();

	for (let commitIndex = 0; commitIndex < entries.length; commitIndex += 1) {
		const entry = entries[commitIndex];
		commitLabels.push(entry.commit.id.slice(0, 7));
		commitDetails.push({
			id: entry.commit.id,
			message: entry.commit.message,
			timestamp: entry.commit.timestamp,
			url: entry.commit.url,
			committer: entry.commit.committer?.username ?? "unknown",
		});

		for (const bench of entry.benches) {
			const { group, variant } = groupBenchName(bench.name);
			if (!groups.has(group)) {
				groups.set(group, {
					unit: bench.unit,
					variants: new Map(),
				});
			}

			const groupData = groups.get(group);
			if (!groupData.variants.has(variant)) {
				groupData.variants.set(variant, {
					values: Array(entries.length).fill(null),
					ranges: Array(entries.length).fill(""),
					extras: Array(entries.length).fill(""),
				});
			}

			const variantData = groupData.variants.get(variant);
			variantData.values[commitIndex] = bench.value;
			variantData.ranges[commitIndex] = bench.range ?? "";
			variantData.extras[commitIndex] = bench.extra ?? "";
		}
	}

	const groupedCharts = [];
	for (const [groupName, groupData] of groups.entries()) {
		const variants = [];
		for (const [variantName, variantData] of groupData.variants.entries()) {
			variants.push({
				name: variantName,
				values: variantData.values,
				ranges: variantData.ranges,
				extras: variantData.extras,
			});
		}

		variants.sort((a, b) => {
			const av = Number.parseInt(a.name, 10);
			const bv = Number.parseInt(b.name, 10);
			if (Number.isNaN(av) || Number.isNaN(bv)) {
				return a.name.localeCompare(b.name);
			}
			return av - bv;
		});

		groupedCharts.push({
			name: groupName,
			unit: groupData.unit,
			variants,
		});
	}

	groupedCharts.sort((a, b) => a.name.localeCompare(b.name));

	return {
		commitLabels,
		commitDetails,
		charts: groupedCharts,
	};
}

function renderHtml(payload) {
	const serialized = JSON.stringify(payload);

	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Engine Benchmarks</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f6f8fc;
        --panel: #ffffff;
        --text: #121722;
        --muted: #566174;
        --border: #d5ddea;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 24px;
        font-family: "Segoe UI", "Inter", sans-serif;
        background: radial-gradient(circle at top right, #ebf0ff 0%, var(--bg) 40%);
        color: var(--text);
      }
      header {
        margin-bottom: 18px;
      }
      h1 {
        margin: 0 0 8px;
        font-size: 1.5rem;
      }
      .meta {
        color: var(--muted);
        font-size: 0.92rem;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
        gap: 14px;
      }
      .card {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 12px 12px 4px;
        box-shadow: 0 2px 8px rgba(22, 28, 45, 0.06);
      }
      .card h2 {
        margin: 0 0 8px;
        font-size: 0.96rem;
        text-transform: capitalize;
      }
      .chart-wrap {
        height: 260px;
      }
      footer {
        margin-top: 18px;
        color: var(--muted);
        font-size: 0.85rem;
      }
      @media (max-width: 640px) {
        body { padding: 12px; }
        .grid { grid-template-columns: 1fr; }
        .chart-wrap { height: 220px; }
      }
    </style>
  </head>
  <body>
    <header>
      <h1>Engine benchmark trends</h1>
      <div class="meta" id="meta"></div>
    </header>
    <main class="grid" id="charts"></main>
    <footer>
      Grouped by benchmark family. Click a data point to open the commit.
    </footer>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"></script>
    <script>
      const payload = ${serialized};
      const palette = [
        "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#22c55e", "#ef4444", "#64748b"
      ];

      const chartArea = document.getElementById("charts");
      document.getElementById("meta").textContent =
        payload.repo + " | " + payload.benchmarkName + " | updated " + new Date(payload.lastUpdate).toLocaleString();

      payload.charts.forEach((group) => {
        const card = document.createElement("section");
        card.className = "card";
        const title = document.createElement("h2");
        title.textContent = group.name.replace(/_/g, " ");
        const wrap = document.createElement("div");
        wrap.className = "chart-wrap";
        const canvas = document.createElement("canvas");
        wrap.appendChild(canvas);
        card.appendChild(title);
        card.appendChild(wrap);
        chartArea.appendChild(card);

        const datasets = group.variants.map((variant, i) => ({
          label: variant.name,
          data: variant.values,
          spanGaps: true,
          borderColor: palette[i % palette.length],
          backgroundColor: palette[i % palette.length],
          borderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 5,
          tension: 0.2,
          metaRanges: variant.ranges,
          metaExtras: variant.extras,
        }));

        new Chart(canvas, {
          type: "line",
          data: {
            labels: payload.commitLabels,
            datasets,
          },
          options: {
            maintainAspectRatio: false,
            interaction: { mode: "nearest", intersect: false },
            plugins: {
              legend: { position: "top" },
              tooltip: {
                callbacks: {
                  title(items) {
                    const item = items[0];
                    const detail = payload.commitDetails[item.dataIndex];
                    return detail.id.slice(0, 7) + " - " + detail.timestamp;
                  },
                  afterTitle(items) {
                    const detail = payload.commitDetails[items[0].dataIndex];
                    return detail.message;
                  },
                  label(ctx) {
                    const value = ctx.parsed.y;
                    if (value == null) {
                      return ctx.dataset.label + ": no data";
                    }
                    const range = ctx.dataset.metaRanges?.[ctx.dataIndex] || "";
                    return ctx.dataset.label + ": " + Number(value).toLocaleString() + " " + group.unit + (range ? " (" + range + ")" : "");
                  },
                  afterLabel(ctx) {
                    return ctx.dataset.metaExtras?.[ctx.dataIndex] || "";
                  },
                },
              },
            },
            scales: {
              x: {
                title: { display: true, text: "Commit" },
                ticks: { maxRotation: 45, minRotation: 45 },
              },
              y: {
                title: { display: true, text: group.unit },
                beginAtZero: true,
              },
            },
            onClick(_event, elements) {
              if (!elements.length) {
                return;
              }
              const idx = elements[0].index;
              const url = payload.commitDetails[idx]?.url;
              if (url) {
                window.open(url, "_blank", "noopener");
              }
            },
          },
        });
      });
    </script>
  </body>
</html>
`;
}

function main() {
	const dataJsPath = process.argv[2];
	const indexHtmlPath = process.argv[3];
	if (!dataJsPath || !indexHtmlPath) {
		usage();
	}

	const raw = fs.readFileSync(dataJsPath, "utf8");
	const benchmarkData = parseBenchmarkData(raw);
	const benchmarkName = "cosmo-synth-engine";
	const entries = benchmarkData.entries?.[benchmarkName];
	if (!Array.isArray(entries) || entries.length === 0) {
		throw new Error(`No entries found for ${benchmarkName}`);
	}

	const grouped = buildGroupedData(entries);
	const payload = {
		repo: benchmarkData.repoUrl,
		lastUpdate: benchmarkData.lastUpdate,
		benchmarkName,
		...grouped,
	};

	fs.mkdirSync(path.dirname(indexHtmlPath), { recursive: true });
	fs.writeFileSync(indexHtmlPath, renderHtml(payload), "utf8");
	console.log(
		`Generated ${indexHtmlPath} with ${payload.charts.length} grouped charts`,
	);
}

main();
