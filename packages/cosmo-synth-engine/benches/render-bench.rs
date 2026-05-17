use criterion::{black_box, criterion_group, criterion_main, Criterion};

#[allow(dead_code)]
#[path = "../src/bin/render-bench.rs"]
mod render_bench;

const BENCH_RENDER_SAMPLES: usize = 4_096;

const SCENARIOS: &[(&str, &[usize])] = &[
    ("default", &[3, 6, 8]),
    ("fun-bass-like", &[3, 6, 8]),
    ("chants-like", &[3, 6, 8]),
    ("chops-like", &[3, 6, 8]),
    ("mod-heavy", &[3, 6, 8]),
    ("fx-heavy", &[3, 6, 8]),
    ("worst-poly", &[3, 6, 8]),
    ("opt-sine-lfo-heavy", &[3, 6, 8]),
    ("opt-param-interp-light", &[3, 6, 8]),
    ("opt-render-vectorization", &[3, 6, 8]),
    ("opt-all-combined", &[3, 6, 8]),
];

fn bench_all(c: &mut Criterion) {
    for (scenario, voices) in SCENARIOS {
        for voice_count in *voices {
            c.bench_function(&format!("{}_{}_voices", scenario, voice_count), |b| {
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

criterion_group!(benches, bench_all);
criterion_main!(benches);
