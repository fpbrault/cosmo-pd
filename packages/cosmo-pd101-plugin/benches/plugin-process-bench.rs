use criterion::{Criterion, criterion_group, criterion_main};
use std::hint::black_box;
use std::time::Duration;

use cosmo_pd101_plugin::Plugin;
use truce_test::driver;

fn checksum_audio(output: &[Vec<f32>]) -> f64 {
    output
        .iter()
        .flat_map(|channel| channel.iter())
        .enumerate()
        .map(|(index, sample)| f64::from(*sample) * ((index % 97) as f64 + 1.0))
        .sum()
}

fn bench_plugin_process(c: &mut Criterion) {
    c.bench_function("plugin_process_sustained_poly_128_block", |b| {
        b.iter(|| {
            let result = driver!(Plugin)
                .sample_rate(48_000.0)
                .block_size(128)
                .duration(Duration::from_millis(80))
                .capture_audio(true)
                .script(|script| {
                    for note in [48, 52, 55, 59, 64, 67] {
                        script.note_on(note, 0.85);
                    }
                })
                .run();
            black_box(checksum_audio(&result.output));
        });
    });
}

fn benchmark_config() -> Criterion {
    Criterion::default()
        .sample_size(30)
        .measurement_time(Duration::from_secs(5))
}

criterion_group! {
    name = benches;
    config = benchmark_config();
    targets = bench_plugin_process
}
criterion_main!(benches);
