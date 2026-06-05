use criterion::{Criterion, criterion_group, criterion_main};
use std::hint::black_box;
use std::time::Duration;

#[allow(dead_code)]
#[path = "../src/bin/render-bench.rs"]
mod render_bench;

const BENCH_RENDER_SAMPLES: usize = 4_096;

const SCENARIOS: &[(&str, &str, &[usize])] = &[
    ("default", "default", &[3, 6, 8]),
    ("fun_bass_like", "fun-bass-like", &[3, 6, 8]),
    ("chants_like", "chants-like", &[3, 6, 8]),
    ("chops_like", "chops-like", &[3, 6, 8]),
    ("mod_heavy", "mod-heavy", &[3, 6, 8]),
    ("fx_heavy", "fx-heavy", &[3, 6, 8]),
    ("worst_poly", "worst-poly", &[3, 6, 8]),
    ("opt_sine_lfo_heavy", "opt-sine-lfo-heavy", &[3, 6, 8]),
    (
        "opt_param_interp_light",
        "opt-param-interp-light",
        &[3, 6, 8],
    ),
    (
        "opt_render_vectorization",
        "opt-render-vectorization",
        &[3, 6, 8],
    ),
    ("opt_all_combined", "opt-all-combined", &[3, 6, 8]),
];

fn bench_all(c: &mut Criterion) {
    for (bench_label, scenario, voices) in SCENARIOS {
        for voice_count in *voices {
            c.bench_function(&format!("{}_{}_voices", bench_label, voice_count), |b| {
                b.iter(|| {
                    let checksum =
                        render_bench::benchmark_case(scenario, *voice_count, BENCH_RENDER_SAMPLES)
                            .expect("benchmark case should run");
                    black_box(checksum);
                });
            });
        }
    }
}

fn benchmark_config() -> Criterion {
    Criterion::default()
        .sample_size(60)
        .measurement_time(Duration::from_secs(8))
}

criterion_group! {
    name = benches;
    config = benchmark_config();
    targets = bench_all
}
criterion_main!(benches);
