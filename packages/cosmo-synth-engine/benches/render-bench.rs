#![cfg_attr(nightly, feature(test))]

#[cfg(nightly)]
extern crate test;

#[cfg(nightly)]
use test::{black_box, Bencher};

#[cfg(not(nightly))]
use std::hint::black_box;

#[allow(dead_code)]
#[path = "../src/bin/render-bench.rs"]
mod render_bench;

const BENCH_RENDER_SAMPLES: usize = 4_096;

#[cfg(nightly)]
fn bench_case(bencher: &mut Bencher, scenario: &str, voices: usize) {
    bencher.iter(|| {
        let checksum = render_bench::benchmark_case(scenario, voices, BENCH_RENDER_SAMPLES)
            .expect("benchmark case should run");
        black_box(checksum);
    });
}

#[cfg(nightly)]
macro_rules! render_bench_case {
    ($fn_name:ident, $scenario:literal, $voices:expr) => {
        #[bench]
        fn $fn_name(bencher: &mut Bencher) {
            bench_case(bencher, $scenario, $voices);
        }
    };
}

#[cfg(nightly)]
render_bench_case!(default_3_voices, "default", 3);
#[cfg(nightly)]
render_bench_case!(default_6_voices, "default", 6);
#[cfg(nightly)]
render_bench_case!(default_8_voices, "default", 8);
#[cfg(nightly)]
render_bench_case!(fun_bass_like_3_voices, "fun-bass-like", 3);
#[cfg(nightly)]
render_bench_case!(fun_bass_like_6_voices, "fun-bass-like", 6);
#[cfg(nightly)]
render_bench_case!(fun_bass_like_8_voices, "fun-bass-like", 8);
#[cfg(nightly)]
render_bench_case!(chants_like_3_voices, "chants-like", 3);
#[cfg(nightly)]
render_bench_case!(chants_like_6_voices, "chants-like", 6);
#[cfg(nightly)]
render_bench_case!(chants_like_8_voices, "chants-like", 8);
#[cfg(nightly)]
render_bench_case!(chops_like_3_voices, "chops-like", 3);
#[cfg(nightly)]
render_bench_case!(chops_like_6_voices, "chops-like", 6);
#[cfg(nightly)]
render_bench_case!(chops_like_8_voices, "chops-like", 8);
#[cfg(nightly)]
render_bench_case!(mod_heavy_3_voices, "mod-heavy", 3);
#[cfg(nightly)]
render_bench_case!(mod_heavy_6_voices, "mod-heavy", 6);
#[cfg(nightly)]
render_bench_case!(mod_heavy_8_voices, "mod-heavy", 8);
#[cfg(nightly)]
render_bench_case!(fx_heavy_3_voices, "fx-heavy", 3);
#[cfg(nightly)]
render_bench_case!(fx_heavy_6_voices, "fx-heavy", 6);
#[cfg(nightly)]
render_bench_case!(fx_heavy_8_voices, "fx-heavy", 8);
#[cfg(nightly)]
render_bench_case!(worst_poly_3_voices, "worst-poly", 3);
#[cfg(nightly)]
render_bench_case!(worst_poly_6_voices, "worst-poly", 6);
#[cfg(nightly)]
render_bench_case!(worst_poly_8_voices, "worst-poly", 8);
#[cfg(nightly)]
render_bench_case!(opt_sine_lfo_heavy_3_voices, "opt-sine-lfo-heavy", 3);
#[cfg(nightly)]
render_bench_case!(opt_sine_lfo_heavy_6_voices, "opt-sine-lfo-heavy", 6);
#[cfg(nightly)]
render_bench_case!(opt_sine_lfo_heavy_8_voices, "opt-sine-lfo-heavy", 8);
#[cfg(nightly)]
render_bench_case!(opt_param_interp_light_3_voices, "opt-param-interp-light", 3);
#[cfg(nightly)]
render_bench_case!(opt_param_interp_light_6_voices, "opt-param-interp-light", 6);
#[cfg(nightly)]
render_bench_case!(opt_param_interp_light_8_voices, "opt-param-interp-light", 8);
#[cfg(nightly)]
render_bench_case!(
    opt_render_vectorization_3_voices,
    "opt-render-vectorization",
    3
);
#[cfg(nightly)]
render_bench_case!(
    opt_render_vectorization_6_voices,
    "opt-render-vectorization",
    6
);
#[cfg(nightly)]
render_bench_case!(
    opt_render_vectorization_8_voices,
    "opt-render-vectorization",
    8
);
#[cfg(nightly)]
render_bench_case!(opt_all_combined_3_voices, "opt-all-combined", 3);
#[cfg(nightly)]
render_bench_case!(opt_all_combined_6_voices, "opt-all-combined", 6);
#[cfg(nightly)]
render_bench_case!(opt_all_combined_8_voices, "opt-all-combined", 8);
