#![allow(clippy::field_reassign_with_default)]

use std::collections::BTreeMap;
use std::env;
use std::time::Instant;

use cosmo_synth_engine::params::{
    Algo, FxSlotConfig, FxSlotType, LineSelect, ModDestination, ModMatrix, ModRoute, ModSource,
    PolyMode, SynthParams,
};
use cosmo_synth_engine::processor::{midi_note_to_freq, CosmoProcessor};

const DEFAULT_NOTES: [u8; 8] = [36, 40, 43, 48, 52, 55, 60, 64];

#[derive(Clone)]
struct BenchmarkConfig {
    scenario: String,
    voices: usize,
    seconds: f32,
    sample_rate: f32,
    block_size: usize,
    iterations: usize,
    warmup_iterations: usize,
    json: bool,
    all: bool,
}

impl Default for BenchmarkConfig {
    fn default() -> Self {
        Self {
            scenario: "default".to_string(),
            voices: 3,
            seconds: 4.0,
            sample_rate: 48_000.0,
            block_size: 128,
            iterations: 3,
            warmup_iterations: 1,
            json: false,
            all: false,
        }
    }
}

#[derive(Clone)]
struct Scenario {
    name: &'static str,
    description: &'static str,
    build_params: fn() -> SynthParams,
    note_churn_blocks: Option<usize>,
}

#[derive(Clone)]
struct CaseResult {
    scenario: String,
    voices: usize,
    seconds: f32,
    sample_rate: f32,
    block_size: usize,
    iterations: usize,
    warmup_iterations: usize,
    elapsed_ms_runs: Vec<f64>,
    rendered_samples: usize,
    checksum: f64,
}

fn usage() {
    println!(
		"render-bench options:\n  --scenario <name>\n  --voices <n>\n  --seconds <s>\n  --sample-rate <hz>\n  --block-size <n>\n  --iterations <n>\n  --warmup <n>\n  --all\n  --json"
	);
}

fn parse_args() -> Result<BenchmarkConfig, String> {
    let mut cfg = BenchmarkConfig::default();
    let mut args = env::args().skip(1);

    while let Some(arg) = args.next() {
        match arg.as_str() {
            "--scenario" => {
                cfg.scenario = args
                    .next()
                    .ok_or_else(|| "missing value for --scenario".to_string())?;
            }
            "--voices" => {
                cfg.voices = args
                    .next()
                    .ok_or_else(|| "missing value for --voices".to_string())?
                    .parse::<usize>()
                    .map_err(|_| "invalid --voices value".to_string())?;
            }
            "--seconds" => {
                cfg.seconds = args
                    .next()
                    .ok_or_else(|| "missing value for --seconds".to_string())?
                    .parse::<f32>()
                    .map_err(|_| "invalid --seconds value".to_string())?;
            }
            "--sample-rate" => {
                cfg.sample_rate = args
                    .next()
                    .ok_or_else(|| "missing value for --sample-rate".to_string())?
                    .parse::<f32>()
                    .map_err(|_| "invalid --sample-rate value".to_string())?;
            }
            "--block-size" => {
                cfg.block_size = args
                    .next()
                    .ok_or_else(|| "missing value for --block-size".to_string())?
                    .parse::<usize>()
                    .map_err(|_| "invalid --block-size value".to_string())?;
            }
            "--iterations" => {
                cfg.iterations = args
                    .next()
                    .ok_or_else(|| "missing value for --iterations".to_string())?
                    .parse::<usize>()
                    .map_err(|_| "invalid --iterations value".to_string())?;
            }
            "--warmup" => {
                cfg.warmup_iterations = args
                    .next()
                    .ok_or_else(|| "missing value for --warmup".to_string())?
                    .parse::<usize>()
                    .map_err(|_| "invalid --warmup value".to_string())?;
            }
            "--json" => {
                cfg.json = true;
            }
            "--all" => {
                cfg.all = true;
            }
            "--help" | "-h" => {
                usage();
                std::process::exit(0);
            }
            unknown => {
                return Err(format!("unknown argument: {unknown}"));
            }
        }
    }

    if cfg.voices == 0 || cfg.voices > DEFAULT_NOTES.len() {
        return Err("--voices must be between 1 and 8".to_string());
    }
    if cfg.block_size == 0 {
        return Err("--block-size must be > 0".to_string());
    }
    if cfg.seconds <= 0.0 {
        return Err("--seconds must be > 0".to_string());
    }
    if cfg.sample_rate <= 0.0 {
        return Err("--sample-rate must be > 0".to_string());
    }
    if cfg.iterations == 0 {
        return Err("--iterations must be > 0".to_string());
    }

    Ok(cfg)
}

fn scenarios() -> Vec<Scenario> {
    vec![
        Scenario {
            name: "default",
            description: "Factory default parameters",
            build_params: || SynthParams::default(),
            note_churn_blocks: None,
        },
        Scenario {
            name: "osc-sine-minimal",
            description: "Sine-only lines, no FX, no matrix modulation",
            build_params: || {
                let mut p = SynthParams::default();
                p.poly_mode = PolyMode::Poly8;
                p.line_select = LineSelect::L1PlusL2Prime;
                p.line1.algo = Algo::Sine;
                p.line1.algo2 = None;
                p.line1.algo_blend = 0.0;
                p.line1.dca_base = 0.85;
                p.line1.dcw_base = 0.0;
                p.line2.algo = Algo::Sine;
                p.line2.algo2 = None;
                p.line2.algo_blend = 0.0;
                p.line2.dca_base = 0.85;
                p.line2.dcw_base = 0.0;
                p.mod_matrix = ModMatrix::default();
                p.fx_slots = [
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                ];
                p
            },
            note_churn_blocks: None,
        },
        Scenario {
            name: "osc-pd-heavy-no-mod-fx",
            description: "High-cost PD/warp algorithms only (no matrix, no FX)",
            build_params: || {
                let mut p = SynthParams::default();
                p.poly_mode = PolyMode::Poly8;
                p.line_select = LineSelect::L1PlusL2Prime;
                p.line1.algo = Algo::Fof;
                p.line1.algo2 = Some(Algo::Karpunk);
                p.line1.algo_blend = 0.65;
                p.line1.dcw_base = 0.95;
                p.line1.dca_base = 0.85;
                p.line2.algo = Algo::Karpunk;
                p.line2.algo2 = Some(Algo::Ripple);
                p.line2.algo_blend = 0.65;
                p.line2.dcw_base = 0.95;
                p.line2.dca_base = 0.85;
                p.mod_matrix = ModMatrix::default();
                p.fx_slots = [
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                ];
                p
            },
            note_churn_blocks: None,
        },
        Scenario {
            name: "mod-only-sine",
            description: "Sine-only lines with dense matrix modulation (no FX)",
            build_params: || {
                let mut p = SynthParams::default();
                p.poly_mode = PolyMode::Poly8;
                p.line_select = LineSelect::L1PlusL2Prime;
                p.line1.algo = Algo::Sine;
                p.line1.algo2 = None;
                p.line1.algo_blend = 0.0;
                p.line2.algo = Algo::Sine;
                p.line2.algo2 = None;
                p.line2.algo_blend = 0.0;
                p.mod_matrix = heavy_mod_matrix();
                p.lfo.rate = 7.5;
                p.lfo2.rate = 5.25;
                p.random.rate = 11.0;
                p.fx_slots = [
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                ];
                p
            },
            note_churn_blocks: Some(12),
        },
        Scenario {
            name: "fx-only-sine",
            description: "Sine-only lines with full FX chain (no matrix)",
            build_params: || {
                let mut p = SynthParams::default();
                p.poly_mode = PolyMode::Poly8;
                p.line_select = LineSelect::L1PlusL2Prime;
                p.line1.algo = Algo::Sine;
                p.line1.algo2 = None;
                p.line1.algo_blend = 0.0;
                p.line2.algo = Algo::Sine;
                p.line2.algo2 = None;
                p.line2.algo_blend = 0.0;
                p.mod_matrix = ModMatrix::default();
                p.fx_slots = [
                    FxSlotConfig::default_for_type(FxSlotType::Chorus),
                    FxSlotConfig::default_for_type(FxSlotType::Phaser),
                    FxSlotConfig::default_for_type(FxSlotType::Delay),
                    FxSlotConfig::default_for_type(FxSlotType::Reverb),
                    FxSlotConfig::default_for_type(FxSlotType::Compressor),
                    FxSlotConfig::default_for_type(FxSlotType::Eq5Band),
                ];
                p
            },
            note_churn_blocks: Some(24),
        },
        Scenario {
            name: "fun-bass-like",
            description: "Simpler mono-ish bass style with minimal FX",
            build_params: || {
                let mut p = SynthParams::default();
                p.poly_mode = PolyMode::Mono;
                p.line_select = LineSelect::L1PlusL2Prime;
                p.line1.algo = Algo::Saw;
                p.line1.algo2 = Some(Algo::Sine);
                p.line1.algo_blend = 0.15;
                p.line1.dca_base = 0.85;
                p.line2.algo = Algo::Pulse;
                p.line2.algo2 = Some(Algo::Square);
                p.line2.algo_blend = 0.2;
                p.line2.dca_base = 0.65;
                p.fx_slots = [
                    FxSlotConfig::default_for_type(FxSlotType::Compressor),
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Vibrato(Default::default()),
                    FxSlotConfig::PhaseMod(Default::default()),
                    FxSlotConfig::Empty,
                ];
                p
            },
            note_churn_blocks: Some(64),
        },
        Scenario {
            name: "chants-like",
            description: "Complex dual-line formant patch with layered FX",
            build_params: || {
                let mut p = SynthParams::default();
                p.poly_mode = PolyMode::Poly8;
                p.line1.algo = Algo::Fof;
                p.line1.algo2 = Some(Algo::Ripple);
                p.line1.algo_blend = 0.55;
                p.line1.dcw_base = 0.85;
                p.line1.dca_base = 0.8;
                p.line2.algo = Algo::MultiSine;
                p.line2.algo2 = Some(Algo::SawPulse);
                p.line2.algo_blend = 0.45;
                p.line2.dcw_base = 0.9;
                p.line2.dca_base = 0.72;
                p.lfo.rate = 4.2;
                p.lfo2.rate = 6.0;
                p.random.rate = 9.0;
                p.mod_matrix = heavy_mod_matrix();
                p.fx_slots = [
                    FxSlotConfig::default_for_type(FxSlotType::Chorus),
                    FxSlotConfig::default_for_type(FxSlotType::Delay),
                    FxSlotConfig::default_for_type(FxSlotType::Reverb),
                    FxSlotConfig::default_for_type(FxSlotType::Phaser),
                    FxSlotConfig::default_for_type(FxSlotType::Compressor),
                    FxSlotConfig::default_for_type(FxSlotType::Eq5Band),
                ];
                p
            },
            note_churn_blocks: Some(16),
        },
        Scenario {
            name: "chops-like",
            description: "Aggressive transient patch with high modulation churn",
            build_params: || {
                let mut p = SynthParams::default();
                p.poly_mode = PolyMode::Poly8;
                p.line1.algo = Algo::Karpunk;
                p.line1.algo2 = Some(Algo::Fold);
                p.line1.algo_blend = 0.6;
                p.line2.algo = Algo::Twist;
                p.line2.algo2 = Some(Algo::Clip);
                p.line2.algo_blend = 0.5;
                p.lfo.rate = 8.0;
                p.lfo2.rate = 12.0;
                p.random.rate = 16.0;
                p.mod_matrix = heavy_mod_matrix();
                p.fx_slots = [
                    FxSlotConfig::default_for_type(FxSlotType::Distortion),
                    FxSlotConfig::default_for_type(FxSlotType::Delay),
                    FxSlotConfig::default_for_type(FxSlotType::RingMod),
                    FxSlotConfig::default_for_type(FxSlotType::Wavefolder),
                    FxSlotConfig::default_for_type(FxSlotType::Reverb),
                    FxSlotConfig::default_for_type(FxSlotType::Compressor),
                ];
                p
            },
            note_churn_blocks: Some(8),
        },
        Scenario {
            name: "fx-heavy",
            description: "Default oscillators with fully populated FX chain",
            build_params: || {
                let mut p = SynthParams::default();
                p.fx_slots = [
                    FxSlotConfig::default_for_type(FxSlotType::Chorus),
                    FxSlotConfig::default_for_type(FxSlotType::Phaser),
                    FxSlotConfig::default_for_type(FxSlotType::Delay),
                    FxSlotConfig::default_for_type(FxSlotType::Reverb),
                    FxSlotConfig::default_for_type(FxSlotType::Compressor),
                    FxSlotConfig::default_for_type(FxSlotType::Eq5Band),
                ];
                p
            },
            note_churn_blocks: Some(24),
        },
        Scenario {
            name: "mod-heavy",
            description: "Dense modulation matrix on both lines",
            build_params: || {
                let mut p = SynthParams::default();
                p.mod_matrix = heavy_mod_matrix();
                p.lfo.rate = 7.5;
                p.lfo2.rate = 5.25;
                p.random.rate = 11.0;
                p
            },
            note_churn_blocks: Some(12),
        },
        Scenario {
            name: "worst-poly",
            description: "High-cost algorithms, heavy modulation, heavy FX",
            build_params: || {
                let mut p = SynthParams::default();
                p.poly_mode = PolyMode::Poly8;
                p.line_select = LineSelect::L1PlusL2Prime;
                p.line1.algo = Algo::Fof;
                p.line1.algo2 = Some(Algo::Karpunk);
                p.line1.algo_blend = 0.65;
                p.line1.dcw_base = 0.95;
                p.line2.algo = Algo::Karpunk;
                p.line2.algo2 = Some(Algo::Ripple);
                p.line2.algo_blend = 0.65;
                p.line2.dcw_base = 0.95;
                p.mod_matrix = heavy_mod_matrix();
                p.lfo.rate = 9.0;
                p.lfo2.rate = 9.0;
                p.random.rate = 18.0;
                p.fx_slots = [
                    FxSlotConfig::default_for_type(FxSlotType::GrainDelay),
                    FxSlotConfig::default_for_type(FxSlotType::ShimmerVerb),
                    FxSlotConfig::default_for_type(FxSlotType::Distortion),
                    FxSlotConfig::default_for_type(FxSlotType::RingMod),
                    FxSlotConfig::default_for_type(FxSlotType::Wavefolder),
                    FxSlotConfig::default_for_type(FxSlotType::Compressor),
                ];
                p
            },
            note_churn_blocks: Some(4),
        },
        // ─────────────────────────────────────────────────────────────────
        // Optimization benchmark scenarios (parameter interpolation, vectorization, cubic sine)
        // ─────────────────────────────────────────────────────────────────
        Scenario {
            name: "opt-sine-lfo-heavy",
            description: "Pure sine LFO benchmark (tests cubic sine approx)",
            build_params: || {
                let mut p = SynthParams::default();
                p.poly_mode = PolyMode::Poly8;
                p.line1.algo = Algo::Sine;
                p.line1.algo2 = None;
                p.line2.algo = Algo::Sine;
                p.line2.algo2 = None;
                p.lfo.rate = 20.0; // Fast LFO (high sine sample rate)
                p.lfo2.rate = 18.5;
                p.random.rate = 0.5; // Minimal random
                p.mod_matrix = heavy_mod_matrix();
                p.fx_slots = [
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                ];
                p
            },
            note_churn_blocks: None,
        },
        Scenario {
            name: "opt-param-interp-light",
            description: "Light modulation (tests parameter interpolation overhead)",
            build_params: || {
                let mut p = SynthParams::default();
                p.poly_mode = PolyMode::Poly8;
                p.line1.algo = Algo::Sine;
                p.line2.algo = Algo::Saw;
                p.lfo.rate = 3.5;
                p.lfo2.rate = 2.75;
                p.mod_matrix = ModMatrix {
                    routes: vec![
                        ModRoute {
                            source: ModSource::Lfo1,
                            destination: ModDestination::Line1DcwBase,
                            amount: 0.5,
                            enabled: true,
                        },
                        ModRoute {
                            source: ModSource::Lfo2,
                            destination: ModDestination::Line2AlgoBlend,
                            amount: 0.6,
                            enabled: true,
                        },
                    ],
                };
                p.fx_slots = [
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                ];
                p
            },
            note_churn_blocks: Some(32),
        },
        Scenario {
            name: "opt-render-vectorization",
            description: "Mid-cost algorithms for render-loop vectorization test",
            build_params: || {
                let mut p = SynthParams::default();
                p.poly_mode = PolyMode::Poly8;
                p.line1.algo = Algo::MultiSine;
                p.line1.algo2 = Some(Algo::Saw);
                p.line1.algo_blend = 0.5;
                p.line2.algo = Algo::Pulse;
                p.line2.algo2 = Some(Algo::Sine);
                p.line2.algo_blend = 0.3;
                p.lfo.rate = 4.0;
                p.lfo2.rate = 3.25;
                p.mod_matrix = ModMatrix::default();
                p.fx_slots = [
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                ];
                p
            },
            note_churn_blocks: Some(16),
        },
        Scenario {
            name: "opt-all-combined",
            description: "All optimizations active: cubic sine, param interp, vectorization",
            build_params: || {
                let mut p = SynthParams::default();
                p.poly_mode = PolyMode::Poly8;
                p.line1.algo = Algo::Fof;
                p.line1.algo2 = Some(Algo::MultiSine);
                p.line1.algo_blend = 0.55;
                p.line2.algo = Algo::Karpunk;
                p.line2.algo2 = Some(Algo::Saw);
                p.line2.algo_blend = 0.45;
                p.lfo.rate = 7.5;
                p.lfo2.rate = 5.5;
                p.random.rate = 12.0;
                p.mod_matrix = heavy_mod_matrix();
                p.fx_slots = [
                    FxSlotConfig::default_for_type(FxSlotType::Chorus),
                    FxSlotConfig::default_for_type(FxSlotType::Delay),
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                    FxSlotConfig::Empty,
                ];
                p
            },
            note_churn_blocks: Some(12),
        },
    ]
}

fn heavy_mod_matrix() -> ModMatrix {
    let routes = vec![
        ModRoute {
            source: ModSource::Lfo1,
            destination: ModDestination::Lfo1Rate,
            amount: 0.5,
            enabled: true,
        },
        ModRoute {
            source: ModSource::Lfo2,
            destination: ModDestination::Lfo2Rate,
            amount: 0.5,
            enabled: true,
        },
        ModRoute {
            source: ModSource::ModEnv,
            destination: ModDestination::Line1AlgoBlend,
            amount: 0.8,
            enabled: true,
        },
        ModRoute {
            source: ModSource::Velocity,
            destination: ModDestination::Line2AlgoBlend,
            amount: 0.5,
            enabled: true,
        },
        ModRoute {
            source: ModSource::Lfo1,
            destination: ModDestination::Line1DcwBase,
            amount: 0.7,
            enabled: true,
        },
        ModRoute {
            source: ModSource::Lfo2,
            destination: ModDestination::Line2DcwBase,
            amount: 0.7,
            enabled: true,
        },
        ModRoute {
            source: ModSource::Random,
            destination: ModDestination::Line1AlgoParam1,
            amount: 0.6,
            enabled: true,
        },
        ModRoute {
            source: ModSource::Random,
            destination: ModDestination::Line2AlgoParam2,
            amount: 0.6,
            enabled: true,
        },
        ModRoute {
            source: ModSource::ModWheel,
            destination: ModDestination::ChorusMix,
            amount: 0.8,
            enabled: true,
        },
        ModRoute {
            source: ModSource::Aftertouch,
            destination: ModDestination::ReverbMix,
            amount: 0.4,
            enabled: true,
        },
        ModRoute {
            source: ModSource::ModEnv,
            destination: ModDestination::DelayMix,
            amount: 0.55,
            enabled: true,
        },
        ModRoute {
            source: ModSource::Lfo1,
            destination: ModDestination::Line1DcoEnvStep2Rate,
            amount: 0.6,
            enabled: true,
        },
        ModRoute {
            source: ModSource::Lfo2,
            destination: ModDestination::Line2DcaEnvStep4Rate,
            amount: 0.5,
            enabled: true,
        },
    ];

    ModMatrix { routes }
}

fn find_scenario(name: &str) -> Option<Scenario> {
    scenarios()
        .into_iter()
        .find(|scenario| scenario.name == name)
}

fn scenario_matrix() -> Vec<(String, usize)> {
    let names = [
        "default",
        "fun-bass-like",
        "chants-like",
        "chops-like",
        "mod-heavy",
        "fx-heavy",
        "worst-poly",
        // Optimization-focused scenarios
        "opt-sine-lfo-heavy",
        "opt-param-interp-light",
        "opt-render-vectorization",
        "opt-all-combined",
    ];

    let mut matrix = Vec::new();
    for name in names {
        matrix.push((name.to_string(), 3));
        matrix.push((name.to_string(), 6));
    }
    matrix
}

fn run_case(config: &BenchmarkConfig, scenario: &Scenario) -> Result<CaseResult, String> {
    let total_samples = (config.seconds * config.sample_rate) as usize;
    let mut elapsed_ms_runs = Vec::with_capacity(config.iterations);
    let mut final_checksum = 0.0_f64;

    for run_idx in 0..(config.warmup_iterations + config.iterations) {
        let mut processor = CosmoProcessor::new(config.sample_rate);
        let params = (scenario.build_params)();
        processor.set_params(params);
        let mut block = vec![0.0_f32; config.block_size];

        for note in DEFAULT_NOTES.iter().take(config.voices) {
            let frequency = midi_note_to_freq(*note);
            processor.note_on(*note, frequency, 0.85);
        }

        let mut rendered_samples = 0usize;
        let mut checksum = 0.0_f64;
        let mut block_index = 0usize;
        let start = Instant::now();
        while rendered_samples < total_samples {
            let remaining = total_samples - rendered_samples;
            let this_block = remaining.min(config.block_size);
            processor.process(&mut block[..this_block]);
            checksum += block[..this_block]
                .iter()
                .map(|sample| f64::from(sample.abs()))
                .sum::<f64>();
            rendered_samples += this_block;
            block_index += 1;

            if let Some(churn_blocks) = scenario.note_churn_blocks {
                if block_index.is_multiple_of(churn_blocks) {
                    let lead = DEFAULT_NOTES[(block_index / churn_blocks) % config.voices];
                    let release = DEFAULT_NOTES[(block_index / churn_blocks + 1) % config.voices];
                    processor.note_off(release);
                    processor.note_on(lead, midi_note_to_freq(lead), 0.92);
                }
            }
        }

        let elapsed_ms = start.elapsed().as_secs_f64() * 1000.0;
        if run_idx >= config.warmup_iterations {
            elapsed_ms_runs.push(elapsed_ms);
            final_checksum = checksum;
        }
    }

    Ok(CaseResult {
        scenario: scenario.name.to_string(),
        voices: config.voices,
        seconds: config.seconds,
        sample_rate: config.sample_rate,
        block_size: config.block_size,
        iterations: config.iterations,
        warmup_iterations: config.warmup_iterations,
        elapsed_ms_runs,
        rendered_samples: (config.seconds * config.sample_rate) as usize,
        checksum: final_checksum,
    })
}

fn percentile(sorted: &[f64], fraction: f64) -> f64 {
    if sorted.is_empty() {
        return 0.0;
    }
    let clamped = fraction.clamp(0.0, 1.0);
    let idx = ((sorted.len() - 1) as f64 * clamped).round() as usize;
    sorted[idx]
}

fn summarize(result: &CaseResult) -> BTreeMap<&'static str, f64> {
    let mut runs = result.elapsed_ms_runs.clone();
    runs.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));

    let p50_ms = percentile(&runs, 0.5);
    let p95_ms = percentile(&runs, 0.95);
    let max_ms = percentile(&runs, 1.0);
    let rendered_seconds = result.rendered_samples as f64 / f64::from(result.sample_rate);
    let realtime_factor_p50 = if p50_ms > 0.0 {
        rendered_seconds / (p50_ms / 1000.0)
    } else {
        0.0
    };
    let realtime_factor_p95 = if p95_ms > 0.0 {
        rendered_seconds / (p95_ms / 1000.0)
    } else {
        0.0
    };
    let ns_per_sample_p50 = if result.rendered_samples > 0 {
        (p50_ms * 1_000_000.0) / result.rendered_samples as f64
    } else {
        0.0
    };
    let rt_cpu_percent_p50 = if realtime_factor_p50 > 0.0 {
        100.0 / realtime_factor_p50
    } else {
        0.0
    };

    let mut summary = BTreeMap::new();
    summary.insert("p50Ms", p50_ms);
    summary.insert("p95Ms", p95_ms);
    summary.insert("maxMs", max_ms);
    summary.insert("realtimeFactorP50", realtime_factor_p50);
    summary.insert("realtimeFactorP95", realtime_factor_p95);
    summary.insert("nsPerSampleP50", ns_per_sample_p50);
    summary.insert("rtCpuPercentP50", rt_cpu_percent_p50);
    summary.insert("checksum", result.checksum);
    summary
}

fn print_text(case: &CaseResult, summary: &BTreeMap<&'static str, f64>, description: &str) {
    println!(
        "scenario={} voices={} sr={} block={}samps seconds={:.1} iterations={}",
        case.scenario,
        case.voices,
        case.sample_rate,
        case.block_size,
        case.seconds,
        case.iterations
    );
    println!("  description={description}");
    println!(
        "  p50={:.2}ms p95={:.2}ms max={:.2}ms",
        summary["p50Ms"], summary["p95Ms"], summary["maxMs"]
    );
    println!(
        "  realtime(p50)={:.2}x  rt-cpu(p50)={:.1}%  ns/sample(p50)={:.1}",
        summary["realtimeFactorP50"], summary["rtCpuPercentP50"], summary["nsPerSampleP50"]
    );
    println!("  checksum={:.5}\n", summary["checksum"]);
}

fn case_json(case: &CaseResult, summary: &BTreeMap<&'static str, f64>) -> serde_json::Value {
    serde_json::json!({
        "scenario": case.scenario,
        "voices": case.voices,
        "seconds": case.seconds,
        "sampleRate": case.sample_rate,
        "blockSize": case.block_size,
        "iterations": case.iterations,
        "warmupIterations": case.warmup_iterations,
        "renderedSamples": case.rendered_samples,
        "elapsedMsRuns": case.elapsed_ms_runs,
        "summary": summary,
    })
}

fn run_single(config: &BenchmarkConfig) -> Result<Vec<serde_json::Value>, String> {
    let scenario = find_scenario(&config.scenario)
        .ok_or_else(|| format!("unknown scenario: {}", config.scenario))?;
    let case = run_case(config, &scenario)?;
    let summary = summarize(&case);
    if !config.json {
        print_text(&case, &summary, scenario.description);
    }
    Ok(vec![case_json(&case, &summary)])
}

fn run_all(config: &BenchmarkConfig) -> Result<Vec<serde_json::Value>, String> {
    let mut cases = Vec::new();
    for (scenario_name, voices) in scenario_matrix() {
        let scenario = find_scenario(&scenario_name)
            .ok_or_else(|| format!("unknown scenario in matrix: {scenario_name}"))?;
        let mut case_cfg = config.clone();
        case_cfg.scenario = scenario_name;
        case_cfg.voices = voices;
        let case = run_case(&case_cfg, &scenario)?;
        let summary = summarize(&case);
        if !config.json {
            print_text(&case, &summary, scenario.description);
        }
        cases.push(case_json(&case, &summary));
    }
    Ok(cases)
}

fn main() {
    let config = match parse_args() {
        Ok(cfg) => cfg,
        Err(error) => {
            eprintln!("{error}");
            usage();
            std::process::exit(2);
        }
    };

    let output = if config.all {
        run_all(&config)
    } else {
        run_single(&config)
    };

    match output {
        Ok(cases) => {
            if config.json {
                let payload = serde_json::json!({
                    "tool": "render-bench",
                    "cases": cases,
                });
                match serde_json::to_string_pretty(&payload) {
                    Ok(json) => println!("{json}"),
                    Err(error) => {
                        eprintln!("failed to serialize benchmark JSON: {error}");
                        std::process::exit(1);
                    }
                }
            }
        }
        Err(error) => {
            eprintln!("benchmark failed: {error}");
            std::process::exit(1);
        }
    }
}
