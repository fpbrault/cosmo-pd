use std::hint::black_box;
use std::time::{Duration, Instant};

use cosmo_pd101_plugin::Plugin;
use serde::Serialize;
use truce_test::driver;

const SAMPLE_RATE: f64 = 48_000.0;
const DEFAULT_BLOCK_SIZE: usize = 128;
const DEFAULT_ITERATIONS: usize = 24;
const DEFAULT_WARMUP: usize = 4;
const RUN_DURATION: Duration = Duration::from_millis(80);

#[derive(Clone, Copy)]
struct Scenario {
    id: &'static str,
    description: &'static str,
    configure: fn(truce_test::PluginDriver<Plugin>) -> truce_test::PluginDriver<Plugin>,
}

#[derive(Serialize)]
struct BenchReport {
    tool: &'static str,
    mode: &'static str,
    generated_at: String,
    cases: Vec<BenchCase>,
}

#[derive(Serialize)]
struct BenchCase {
    scenario: &'static str,
    description: &'static str,
    block_size: usize,
    iterations: usize,
    summary: BenchSummary,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct BenchSummary {
    p50_ms: f64,
    p95_ms: f64,
    mean_ms: f64,
    ns_per_sample_p50: f64,
    realtime_factor_p50: f64,
    checksum: f64,
}

struct Options {
    json: bool,
    iterations: usize,
    warmup: usize,
    block_size: usize,
    scenario_ids: Vec<String>,
}

fn usage() {
    eprintln!(
        "plugin-render-bench options:\n  --json\n  --iterations <n>\n  --warmup <n>\n  --block-size <n>\n  --scenario <id>"
    );
}

fn parse_args() -> Options {
    let mut options = Options {
        json: false,
        iterations: DEFAULT_ITERATIONS,
        warmup: DEFAULT_WARMUP,
        block_size: DEFAULT_BLOCK_SIZE,
        scenario_ids: Vec::new(),
    };

    let mut args = std::env::args().skip(1);
    while let Some(arg) = args.next() {
        match arg.as_str() {
            "--json" => options.json = true,
            "--iterations" => {
                if let Some(value) = args.next() {
                    options.iterations = value.parse().unwrap_or(DEFAULT_ITERATIONS);
                }
            }
            "--warmup" => {
                if let Some(value) = args.next() {
                    options.warmup = value.parse().unwrap_or(DEFAULT_WARMUP);
                }
            }
            "--block-size" => {
                if let Some(value) = args.next() {
                    options.block_size = value.parse().unwrap_or(DEFAULT_BLOCK_SIZE);
                }
            }
            "--scenario" => {
                if let Some(value) = args.next() {
                    options.scenario_ids.push(value);
                }
            }
            "--help" | "-h" => {
                usage();
                std::process::exit(0);
            }
            _ => {}
        }
    }

    options.iterations = options.iterations.max(1);
    options
}

fn base_driver(block_size: usize) -> truce_test::PluginDriver<Plugin> {
    driver!(Plugin)
        .sample_rate(SAMPLE_RATE)
        .block_size(block_size)
        .duration(RUN_DURATION)
        .capture_audio(true)
}

fn sustained_poly(driver: truce_test::PluginDriver<Plugin>) -> truce_test::PluginDriver<Plugin> {
    driver.script(|script| {
        for note in [48, 52, 55, 59, 64, 67] {
            script.note_on(note, 0.85);
        }
    })
}

fn note_stream(driver: truce_test::PluginDriver<Plugin>) -> truce_test::PluginDriver<Plugin> {
    driver.script(|script| {
        for note in [48, 52, 55, 59, 64, 67, 71, 72] {
            script.note_on(note, 0.8);
            script.wait_ms(4);
            script.note_off(note);
            script.wait_ms(4);
        }
    })
}

fn midi_cc_mapping(driver: truce_test::PluginDriver<Plugin>) -> truce_test::PluginDriver<Plugin> {
    driver.script(|script| {
        for value in [0.0, 0.25, 0.5, 0.75, 1.0] {
            script.cc(8, value);
            script.wait_ms(6);
        }
    })
}

fn parameter_automation(
    driver: truce_test::PluginDriver<Plugin>,
) -> truce_test::PluginDriver<Plugin> {
    driver.script(|script| {
        for value in [0.2, 0.8, 0.35, 0.65, 0.5] {
            script.set_param(0_u32, value);
            script.wait_ms(6);
        }
    })
}

const SCENARIOS: &[Scenario] = &[
    Scenario {
        id: "idle",
        description: "Plugin wrapper render path with no host events",
        configure: |driver| driver,
    },
    Scenario {
        id: "sustained-poly",
        description: "Sustained six-note render through PluginDriver",
        configure: sustained_poly,
    },
    Scenario {
        id: "note-stream",
        description: "Dense note on/off stream through wrapper events",
        configure: note_stream,
    },
    Scenario {
        id: "midi-cc-mapping",
        description: "Default MIDI CC mapping delivery through wrapper events",
        configure: midi_cc_mapping,
    },
    Scenario {
        id: "parameter-automation",
        description: "Host parameter automation delivery through wrapper events",
        configure: parameter_automation,
    },
];

fn checksum_audio(output: &[Vec<f32>]) -> f64 {
    output
        .iter()
        .flat_map(|channel| channel.iter())
        .enumerate()
        .map(|(index, sample)| f64::from(*sample) * ((index % 97) as f64 + 1.0))
        .sum()
}

fn percentile(values: &[f64], percentile_value: f64) -> f64 {
    if values.is_empty() {
        return 0.0;
    }
    let mut sorted = values.to_vec();
    sorted.sort_by(f64::total_cmp);
    let index = ((percentile_value / 100.0) * (sorted.len() as f64)).floor() as usize;
    sorted[index.min(sorted.len() - 1)]
}

fn run_case(scenario: Scenario, options: &Options) -> BenchCase {
    for _ in 0..options.warmup {
        let result = (scenario.configure)(base_driver(options.block_size)).run();
        black_box(checksum_audio(&result.output));
    }

    let mut durations_ms = Vec::with_capacity(options.iterations);
    let mut checksum = 0.0;
    for _ in 0..options.iterations {
        let started_at = Instant::now();
        let result = (scenario.configure)(base_driver(options.block_size)).run();
        let elapsed = started_at.elapsed();
        checksum = checksum_audio(&result.output);
        black_box(checksum);
        durations_ms.push(elapsed.as_secs_f64() * 1000.0);
    }

    let p50_ms = percentile(&durations_ms, 50.0);
    let p95_ms = percentile(&durations_ms, 95.0);
    let mean_ms = durations_ms.iter().sum::<f64>() / durations_ms.len() as f64;
    let total_samples = SAMPLE_RATE * RUN_DURATION.as_secs_f64();
    let ns_per_sample_p50 = (p50_ms * 1_000_000.0) / total_samples;
    let realtime_factor_p50 = p50_ms / (RUN_DURATION.as_secs_f64() * 1000.0);

    BenchCase {
        scenario: scenario.id,
        description: scenario.description,
        block_size: options.block_size,
        iterations: options.iterations,
        summary: BenchSummary {
            p50_ms,
            p95_ms,
            mean_ms,
            ns_per_sample_p50,
            realtime_factor_p50,
            checksum,
        },
    }
}

fn selected_scenarios(options: &Options) -> Vec<Scenario> {
    if options.scenario_ids.is_empty() {
        return SCENARIOS.to_vec();
    }
    SCENARIOS
        .iter()
        .copied()
        .filter(|scenario| {
            options
                .scenario_ids
                .iter()
                .any(|requested| requested == scenario.id)
        })
        .collect()
}

fn main() {
    let options = parse_args();
    let cases: Vec<BenchCase> = selected_scenarios(&options)
        .into_iter()
        .map(|scenario| run_case(scenario, &options))
        .collect();

    let report = BenchReport {
        tool: "plugin-render-bench",
        mode: "plugin",
        generated_at: format!("{:?}", std::time::SystemTime::now()),
        cases,
    };

    if options.json {
        println!("{}", serde_json::to_string_pretty(&report).unwrap());
        return;
    }

    for case in report.cases {
        println!(
            "{} block={} p50={:.3}ms p95={:.3}ms ns/sample={:.1} realtime={:.3} checksum={:.3}",
            case.scenario,
            case.block_size,
            case.summary.p50_ms,
            case.summary.p95_ms,
            case.summary.ns_per_sample_p50,
            case.summary.realtime_factor_p50,
            case.summary.checksum
        );
    }
}
