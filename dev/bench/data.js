window.BENCHMARK_DATA = {
  "lastUpdate": 1778361251358,
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
      },
      {
        "commit": {
          "author": {
            "email": "fpbrault@gmail.com",
            "name": "Felix Perron-Brault",
            "username": "fpbrault"
          },
          "committer": {
            "email": "fpbrault@gmail.com",
            "name": "Felix Perron-Brault",
            "username": "fpbrault"
          },
          "distinct": true,
          "id": "505004e0bb880344b0caa26ac45289ddd22d0810",
          "message": "chore: enable always commenting for alerts in CI workflow",
          "timestamp": "2026-05-09T13:39:00-04:00",
          "tree_id": "088ad6c3b6d9095c425fbafa97e4a6a0e3defad1",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/505004e0bb880344b0caa26ac45289ddd22d0810"
        },
        "date": 1778348906499,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 59224140.4,
            "range": "± 3367852.89",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 66519521.3,
            "range": "± 2014184.63",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 71362949.8,
            "range": "± 616293.21",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 68663253.8,
            "range": "± 558288.68",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 81502741.9,
            "range": "± 3051809.09",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 85515166.7,
            "range": "± 3638140.14",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 24183208.2,
            "range": "± 267624.33",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 26144371.7,
            "range": "± 190689.06",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 27490052.5,
            "range": "± 362898.69",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 24569925.5,
            "range": "± 422869.07",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 26199529.2,
            "range": "± 376375.58",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 27276177.1,
            "range": "± 186983.99",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 26158949.3,
            "range": "± 172579.17",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 28085040.1,
            "range": "± 901434.3",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 29290153.2,
            "range": "± 158635.41",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 55940370.2,
            "range": "± 152526.47",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 60682837.5,
            "range": "± 1477044.81",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 62863900.3,
            "range": "± 1840211.42",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 57236110.1,
            "range": "± 229608.59",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 63022125.2,
            "range": "± 260886.79",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 65740061.5,
            "range": "± 247935.5",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 29370013,
            "range": "± 249251.07",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 31897269.2,
            "range": "± 256278.73",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 33529303.9,
            "range": "± 220441.05",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 25571075.6,
            "range": "± 405224.35",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 27914474.9,
            "range": "± 158688.58",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 29553477.3,
            "range": "± 374878.26",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 53914209,
            "range": "± 6021387.48",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 57776358.5,
            "range": "± 3380932.5",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 60658487.5,
            "range": "± 2137953.19",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 77101699.8,
            "range": "± 307138.43",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 81462042.7,
            "range": "± 2536089.29",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 80774835.3,
            "range": "± 862526.22",
            "unit": "ns/iter"
          }
        ]
      },
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
          "id": "b71e66edf0cedfacc564b83644257f0fd851c115",
          "message": "Merge pull request #156 from fpbrault/fix/perf-issues\n\nfix: troubleshoot performance issues",
          "timestamp": "2026-05-09T17:11:10-04:00",
          "tree_id": "d13a10c65d41c9a03d9c28f4a1350eea5f6c9acd",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/b71e66edf0cedfacc564b83644257f0fd851c115"
        },
        "date": 1778361249766,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 11873221.5,
            "range": "± 117775.32",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 19423061.1,
            "range": "± 166770.71",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 24826444.9,
            "range": "± 555726.49",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 17343169.4,
            "range": "± 169558.07",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 27881248.8,
            "range": "± 274757.16",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 31834430,
            "range": "± 574975.03",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4231689.5,
            "range": "± 33376.79",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 7428510.75,
            "range": "± 59454.48",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 9597209.8,
            "range": "± 116813",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2821157.7,
            "range": "± 33427.21",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2863198.2,
            "range": "± 46058.6",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2888901.75,
            "range": "± 29454.89",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5818120.9,
            "range": "± 48761.53",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 8460997,
            "range": "± 93221.49",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 10552979.1,
            "range": "± 122914.61",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 10455589.3,
            "range": "± 101883.87",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 17703660.2,
            "range": "± 103499.04",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 21749549.4,
            "range": "± 222504.75",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 11487258.2,
            "range": "± 152057.8",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 19675971.3,
            "range": "± 170387.8",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 24305807.4,
            "range": "± 270832.59",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5594226,
            "range": "± 33275.96",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 9939581.9,
            "range": "± 96905.81",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 12817737,
            "range": "± 103264.72",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5086362.3,
            "range": "± 66350.28",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8649206.3,
            "range": "± 71086.08",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10994306.2,
            "range": "± 78639.73",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8873372.8,
            "range": "± 92285.59",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 15977041.5,
            "range": "± 93636.38",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 20745048.3,
            "range": "± 227577.05",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 23864006,
            "range": "± 149814.89",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 29319681,
            "range": "± 400873.95",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 30172961.1,
            "range": "± 562829.69",
            "unit": "ns/iter"
          }
        ]
      }
    ]
  }
}