window.BENCHMARK_DATA = {
  "lastUpdate": 1778346384609,
  "repoUrl": "https://github.com/fpbrault/cosmo-pd",
  "entries": {
    "cosmo-synth-engine": [
      {
        "commit": {
          "author": {
            "email": "fpbrault@gmail.com",
            "name": "Felix Perron-Brault",
            "username": "fpbrault"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5eeb87331b415ec16bb7302b5b9ce7d01656c7e8",
          "message": "Merge pull request #159 from fpbrault/chore/bench-setup\n\nchore: update CI workflows for engine benchmarks and add new benchmar…",
          "timestamp": "2026-05-09T12:57:44-04:00",
          "tree_id": "0712db6946e39b556eef29898001cf87836330b9",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/5eeb87331b415ec16bb7302b5b9ce7d01656c7e8"
        },
        "date": 1778346382943,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 59031897.7,
            "range": "± 535493.37",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 66557403.1,
            "range": "± 873148.57",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 71331437.6,
            "range": "± 234245.39",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 68767320.4,
            "range": "± 368494.12",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 81688670.2,
            "range": "± 2918856.26",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 85693553.7,
            "range": "± 948035.37",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 24110426.2,
            "range": "± 196167.90",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 26101824.1,
            "range": "± 200355.01",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 27406284.5,
            "range": "± 446587.08",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 24590873.9,
            "range": "± 1735409.88",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 26211487.7,
            "range": "± 232661.14",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 27289077.4,
            "range": "± 983275.19",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 26193688.4,
            "range": "± 204427.61",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 28083651.7,
            "range": "± 174737.28",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 29346307.2,
            "range": "± 160636.90",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 55986285.1,
            "range": "± 847925.25",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 60648068.9,
            "range": "± 988029.05",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 62801150.8,
            "range": "± 1765146.22",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 57208156.1,
            "range": "± 202576.35",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 63054906,
            "range": "± 588032.07",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 65782590.4,
            "range": "± 2253699.32",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 29313929,
            "range": "± 112130.69",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 31885084.7,
            "range": "± 124114.55",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 33558047.8,
            "range": "± 183816.82",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 25547265.2,
            "range": "± 141170.42",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 28019846.4,
            "range": "± 197496.58",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 29538403,
            "range": "± 133108.38",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 53371365.1,
            "range": "± 312684.45",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 57779871.3,
            "range": "± 275575.63",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 60740716,
            "range": "± 742072.26",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 77247946.9,
            "range": "± 481537.66",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 81471574.1,
            "range": "± 253541.83",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 80899527.4,
            "range": "± 3401789.81",
            "unit": "ns/iter"
          }
        ]
      }
    ]
  }
}