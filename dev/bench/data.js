window.BENCHMARK_DATA = {
  "lastUpdate": 1778522808664,
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
          "id": "cb8d31a55a3efa5775827c8fa5e00d71cc4f1fbd",
          "message": "Merge pull request #160 from fpbrault/refactor/synth-engine-module-split",
          "timestamp": "2026-05-09T22:26:30-04:00",
          "tree_id": "f9e7dddb030c48ae04eaff0244ef327c326c5a71",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/cb8d31a55a3efa5775827c8fa5e00d71cc4f1fbd"
        },
        "date": 1778380467097,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 54949977.4,
            "range": "± 3404619.47",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 60572881,
            "range": "± 3251129.05",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 64331922.8,
            "range": "± 703252.69",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 60154208.7,
            "range": "± 5117599.79",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 68407601.8,
            "range": "± 515071.55",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 71445845.8,
            "range": "± 1054180.75",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 22086580.3,
            "range": "± 129124.98",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 23948045.6,
            "range": "± 240605.11",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 25066309.5,
            "range": "± 163820.29",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 23060760.5,
            "range": "± 927131.02",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 25255612,
            "range": "± 170800.67",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 26707744.7,
            "range": "± 191431.93",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 23650691.6,
            "range": "± 239791.61",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 25445854.9,
            "range": "± 215697.73",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 26552682,
            "range": "± 176302.4",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 52774764.6,
            "range": "± 1254862.44",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 57378402.4,
            "range": "± 662831.62",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 59691113.5,
            "range": "± 1514747.87",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 54017397.1,
            "range": "± 3520604.3",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 59509612,
            "range": "± 584302.39",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 62452086.9,
            "range": "± 1375387.68",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 27594463.6,
            "range": "± 157410.14",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 29765391.3,
            "range": "± 277057.38",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 31121343.2,
            "range": "± 413351.4",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 23053262.7,
            "range": "± 200398.43",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 25209004.3,
            "range": "± 184346.79",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 26605295.8,
            "range": "± 115201.42",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 51884217.1,
            "range": "± 3413126.11",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 55754037.6,
            "range": "± 1623459.75",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 58418170.9,
            "range": "± 1908254.57",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 64859989.2,
            "range": "± 580902.25",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 68719790.5,
            "range": "± 1347477.27",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 68831831.2,
            "range": "± 369968.15",
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
          "id": "21335bf9d74b02e21def6db6d6948c60f06ec90e",
          "message": "Merge pull request #161 from fpbrault/refactor/cosmo-pd101-split-and-cleanup\n\nrefactor(cosmo-pd101): split PresetLibrary into smaller components",
          "timestamp": "2026-05-10T06:17:21-04:00",
          "tree_id": "5b9e383dc6d2c1fde9dbc7154afa6ee78f858d86",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/21335bf9d74b02e21def6db6d6948c60f06ec90e"
        },
        "date": 1778408740222,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 57026389.8,
            "range": "± 1316357.47",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 63204731.1,
            "range": "± 1100267.22",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 67365102.6,
            "range": "± 754101.97",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 62692002.6,
            "range": "± 618131.27",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 71826002.4,
            "range": "± 307034.17",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 74992900.6,
            "range": "± 413173.32",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 22829693.5,
            "range": "± 198915.58",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 24630524.4,
            "range": "± 351295.47",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 25834975.4,
            "range": "± 220323.66",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 23712783.7,
            "range": "± 268552.74",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 26021376.5,
            "range": "± 347596.17",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 27522349.5,
            "range": "± 230607.47",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 24305038,
            "range": "± 417173.72",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 26119139.9,
            "range": "± 370366.41",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 27307481.6,
            "range": "± 308633.56",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 54868725.9,
            "range": "± 223936.75",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 59767220.1,
            "range": "± 468422.61",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 62345032.8,
            "range": "± 344781.87",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 56352756,
            "range": "± 602323.82",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 62816585,
            "range": "± 584594.33",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 66273655.3,
            "range": "± 301127.35",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 28082117.5,
            "range": "± 210277.93",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 30497875.4,
            "range": "± 270535.74",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 31979622.2,
            "range": "± 213227.65",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 23754708.2,
            "range": "± 207743.97",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 25964971,
            "range": "± 278723.85",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 27440449.3,
            "range": "± 203069.35",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 53401811.9,
            "range": "± 295625.25",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 58186534,
            "range": "± 682712.6",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 61191157.5,
            "range": "± 308654.63",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 67755893.8,
            "range": "± 294058.79",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 71992489,
            "range": "± 652372.29",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 72253969.2,
            "range": "± 493895.54",
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
          "id": "47343ac3d19d4a175d90aab2fd91838a4ca17059",
          "message": "Merge pull request #167 from fpbrault/refactor/cosmo-pd101/phase2-step-envelope-split\n\nrefactor(cosmo-pd101): split StepEnvelopeEditor into smaller modules",
          "timestamp": "2026-05-10T06:38:48-04:00",
          "tree_id": "0deae38402fff8abcf621668e5a8e51a836468df",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/47343ac3d19d4a175d90aab2fd91838a4ca17059"
        },
        "date": 1778410024273,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 57118380.2,
            "range": "± 383737.6",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 63100864.9,
            "range": "± 1196242.61",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 67209924.4,
            "range": "± 543053.01",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 62692987,
            "range": "± 379911.78",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 71823733.8,
            "range": "± 317909.29",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 75033772.9,
            "range": "± 499615.47",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 23059530.1,
            "range": "± 239399",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 24846890.2,
            "range": "± 231829.57",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 26018814.6,
            "range": "± 380976.98",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 23804410.5,
            "range": "± 273491.24",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 26132198.3,
            "range": "± 305934.53",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 27644849.1,
            "range": "± 234739.03",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 24619015.2,
            "range": "± 166485.79",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 26267757.6,
            "range": "± 240429.67",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 27399525.6,
            "range": "± 176079.28",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 55040935.9,
            "range": "± 1151722.35",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 59895708,
            "range": "± 227537.33",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 62449741.9,
            "range": "± 248843.1",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 56457565.9,
            "range": "± 360654.91",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 62999537,
            "range": "± 562864.65",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 66463620.5,
            "range": "± 265624.59",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 28197997.9,
            "range": "± 218769.42",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 30579033.8,
            "range": "± 156147.93",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 32101400,
            "range": "± 203764.78",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 23791692.6,
            "range": "± 346624.79",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 26032065.9,
            "range": "± 184399.17",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 27490731.9,
            "range": "± 188672.83",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 53489753.8,
            "range": "± 628992.79",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 58083992.9,
            "range": "± 508063.35",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 61130743.3,
            "range": "± 759127.93",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 68006874.6,
            "range": "± 732335.43",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 72212505.7,
            "range": "± 451126.51",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 72516957.1,
            "range": "± 255997.61",
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
          "id": "e758ca18b855829d9ebbf37c16666fc6ac6021a1",
          "message": "Merge pull request #168 from fpbrault/refactor/cosmo-pd101/phase3-per-line-warp\n\nrefactor(cosmo-pd101): extract usePerLineWarp hook and perLineWarpUtils from PerLineWarpBlock",
          "timestamp": "2026-05-10T06:54:02-04:00",
          "tree_id": "81b230638df5bde18edfd8638520b4999f33a332",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/e758ca18b855829d9ebbf37c16666fc6ac6021a1"
        },
        "date": 1778410938735,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 57062273.2,
            "range": "± 483072.93",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 63020082.9,
            "range": "± 429443.79",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 67759265.4,
            "range": "± 804856.35",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 62475184.7,
            "range": "± 472745.53",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 71811399.2,
            "range": "± 434092.24",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 75390225.4,
            "range": "± 180382.37",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 22806000.3,
            "range": "± 167197.94",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 24613781.9,
            "range": "± 164995.99",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 25831474.8,
            "range": "± 211943.9",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 23615214.3,
            "range": "± 319751.22",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 26040993.8,
            "range": "± 300943.21",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 27528836.6,
            "range": "± 137183.24",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 24317650.1,
            "range": "± 287592.48",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 26078356.6,
            "range": "± 144478.25",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 27346206.1,
            "range": "± 326572.65",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 54985594.1,
            "range": "± 226986.12",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 59955580.4,
            "range": "± 230238.03",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 62474754.3,
            "range": "± 201476.01",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 56393346.1,
            "range": "± 373697.05",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 62877119.2,
            "range": "± 414382.04",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 66802147.8,
            "range": "± 374939.34",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 28089103.9,
            "range": "± 157079.4",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 30508724.7,
            "range": "± 184689.78",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 32097515.7,
            "range": "± 206725.12",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 23645982.4,
            "range": "± 269804.43",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 25898675.9,
            "range": "± 251426.4",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 27336274.3,
            "range": "± 204520.39",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 53468285.4,
            "range": "± 214927.72",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 58254873.7,
            "range": "± 223425.82",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 61318345,
            "range": "± 207101.99",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 67913252.5,
            "range": "± 260288",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 72429335.9,
            "range": "± 313019.88",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 73019372.8,
            "range": "± 328166.41",
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
          "id": "8be4696ae51f2ab0b9dad4ba63de5a48cb791707",
          "message": "Merge pull request #169 from fpbrault/refactor/cosmo-pd101/phase4-fx-dedup\n\nrefactor(cosmo-pd101): deduplicate custom FX renderers with shared useFxModuleController hook",
          "timestamp": "2026-05-10T07:27:05-04:00",
          "tree_id": "f5d8f05d1765ef3afb7e10c2d25d0222c6131a6c",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/8be4696ae51f2ab0b9dad4ba63de5a48cb791707"
        },
        "date": 1778412920934,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 56905264.3,
            "range": "± 646071.22",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 62967398.4,
            "range": "± 767864.3",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 67123682.3,
            "range": "± 560199.93",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 62444221,
            "range": "± 678688.32",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 71419569.1,
            "range": "± 673508.39",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 74603812.7,
            "range": "± 324417.66",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 22780848,
            "range": "± 215143.7",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 24566912,
            "range": "± 94432.78",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 25769952.6,
            "range": "± 129042.89",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 23558055.5,
            "range": "± 335668.92",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 25937291.5,
            "range": "± 216676.86",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 27501826.1,
            "range": "± 205226.3",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 24300999,
            "range": "± 386872.91",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 26063055.7,
            "range": "± 169346.15",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 27310019.3,
            "range": "± 242514.18",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 54815073.5,
            "range": "± 285604.89",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 59677869.9,
            "range": "± 248876.91",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 62280613.9,
            "range": "± 231630.31",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 56323517.8,
            "range": "± 334126.1",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 62807889.4,
            "range": "± 629704.41",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 66484880.2,
            "range": "± 303214.24",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 28076120.3,
            "range": "± 209247.07",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 30531722,
            "range": "± 122359.31",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 32046052.8,
            "range": "± 624756.7",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 23657786.1,
            "range": "± 329471.04",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 25928407.3,
            "range": "± 205054.52",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 27387003.8,
            "range": "± 190656.15",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 53453345.2,
            "range": "± 236743.26",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 58087572.3,
            "range": "± 306943.5",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 61255218,
            "range": "± 251655.75",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 67881568.7,
            "range": "± 296499.44",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 72035198.5,
            "range": "± 419031.31",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 72261100.1,
            "range": "± 890506.08",
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
          "id": "cd884e040e80d2ef423b45681edd8a959654be29",
          "message": "Merge pull request #170 from fpbrault/refactor/cosmo-pd101/phase5-iifes",
          "timestamp": "2026-05-10T07:41:57-04:00",
          "tree_id": "4e975cc4a9b5604d603d4587b9f611bef54086d4",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/cd884e040e80d2ef423b45681edd8a959654be29"
        },
        "date": 1778413813171,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 57143152.1,
            "range": "± 1239244.32",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 63053409.6,
            "range": "± 598740.99",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 67217483.9,
            "range": "± 847049.19",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 62659930.8,
            "range": "± 701072.12",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 71821681.4,
            "range": "± 898233.01",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 74941285,
            "range": "± 856395.69",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 22922806.2,
            "range": "± 221865.96",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 24753521,
            "range": "± 173383.23",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 25965681,
            "range": "± 1200374.78",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 23662423,
            "range": "± 343873.29",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 26100254.5,
            "range": "± 241278.94",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 27588483.2,
            "range": "± 214711.19",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 24489531.4,
            "range": "± 409084.17",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 26218583.4,
            "range": "± 180379.98",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 27437526.1,
            "range": "± 279765.72",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 54941998.8,
            "range": "± 215884.77",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 59883679.9,
            "range": "± 2338218.73",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 62421599,
            "range": "± 543904.26",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 56540526,
            "range": "± 260245.14",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 62989912.5,
            "range": "± 496869.53",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 66428917.8,
            "range": "± 467481.24",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 28168736.2,
            "range": "± 181670.7",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 30595720.7,
            "range": "± 235026.8",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 32062209.9,
            "range": "± 429386.76",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 23760394.6,
            "range": "± 270901.85",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 25958077.1,
            "range": "± 275293.5",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 27496532.3,
            "range": "± 347859.8",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 53468052.6,
            "range": "± 451060.57",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 58143616.5,
            "range": "± 704381.01",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 61217292.8,
            "range": "± 2555146.58",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 67954381.3,
            "range": "± 379290.61",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 72114707.6,
            "range": "± 684950.08",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 72416776.6,
            "range": "± 3399197.31",
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
          "id": "f59331cd213ffa826660f3cbc210e58e8ac947ba",
          "message": "Merge pull request #172 from fpbrault/ci/engine-benchmark-path-filter",
          "timestamp": "2026-05-10T07:52:47-04:00",
          "tree_id": "f0f84d96c1b63b2f0add8901970b1a1fb5091432",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/f59331cd213ffa826660f3cbc210e58e8ac947ba"
        },
        "date": 1778414464838,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 56925457.7,
            "range": "± 1098085.55",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 62873312.2,
            "range": "± 760263.95",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 67100232,
            "range": "± 629881.54",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 62477918.6,
            "range": "± 262855.14",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 71525375.8,
            "range": "± 577462.97",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 74657072.8,
            "range": "± 636081.32",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 22809502.5,
            "range": "± 164826.43",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 24560754.8,
            "range": "± 169532.66",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 25768907.8,
            "range": "± 196546.05",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 23720203.1,
            "range": "± 233096.34",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 25992029.4,
            "range": "± 241090.94",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 27493303.7,
            "range": "± 193589.62",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 24423429.8,
            "range": "± 360357.91",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 26050751.7,
            "range": "± 163438.14",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 27212554.9,
            "range": "± 238214.97",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 54945284.7,
            "range": "± 387301.06",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 59854803.5,
            "range": "± 268294.15",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 62403624.6,
            "range": "± 255094.21",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 56410473.5,
            "range": "± 379050.77",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 62861418.1,
            "range": "± 310785.13",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 66306903.4,
            "range": "± 194794.62",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 28045266.3,
            "range": "± 188629.59",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 30448297.7,
            "range": "± 171232.48",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 31956642.8,
            "range": "± 163811.37",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 23684823.8,
            "range": "± 201960.77",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 25824523.2,
            "range": "± 163941.88",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 27342309.6,
            "range": "± 163368.81",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 53434743.7,
            "range": "± 433277.77",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 58133100.1,
            "range": "± 363684.71",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 61153015.4,
            "range": "± 316719.13",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 67791062.8,
            "range": "± 304945.61",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 72009887.6,
            "range": "± 335462.18",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 72325293,
            "range": "± 231358.57",
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
          "id": "4a02731e327c0b3955d5ba424ed0f2370f476041",
          "message": "Merge pull request #130 from fpbrault/feat/add-terrain-stutter-cheby-algos\n\nfeat(cosmo-synth-engine): add Terrain, Stutter, and Cheby phase distortion algorithms",
          "timestamp": "2026-05-10T10:26:23-04:00",
          "tree_id": "aaef71385988a07655f0468a87e09dc54092435c",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/4a02731e327c0b3955d5ba424ed0f2370f476041"
        },
        "date": 1778423666403,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 53031283.5,
            "range": "± 439513.35",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 59155843,
            "range": "± 375733.89",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 63209960.6,
            "range": "± 406368.96",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 59705817.4,
            "range": "± 3050009.92",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 67325074,
            "range": "± 638532.79",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 70272008.4,
            "range": "± 333168.9",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 24333627.5,
            "range": "± 99610.28",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 26248933.3,
            "range": "± 115099.89",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 27481725.7,
            "range": "± 182883.93",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 25118675.6,
            "range": "± 193177.49",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 27521185.1,
            "range": "± 154097",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 28981061,
            "range": "± 142798.61",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 25766459.1,
            "range": "± 119761.62",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 27643343.2,
            "range": "± 170199.81",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 28961293.2,
            "range": "± 113235.9",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 51179231.8,
            "range": "± 546049.97",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 56312719.6,
            "range": "± 262756.56",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 59075057.3,
            "range": "± 345055.25",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 52397921.3,
            "range": "± 530319.71",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 58547639.3,
            "range": "± 1480207.29",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 61718440.1,
            "range": "± 558138.29",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 28534371.9,
            "range": "± 226834.46",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 30971540.4,
            "range": "± 186070",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 32584405.9,
            "range": "± 301233.11",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 25266527.5,
            "range": "± 173667.56",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 27584592.1,
            "range": "± 130195.53",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 29148516,
            "range": "± 156295.31",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 49770390.5,
            "range": "± 264412.75",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 54578919.2,
            "range": "± 593898.51",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 57576528.8,
            "range": "± 202505.08",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 63826400.1,
            "range": "± 461329.16",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 67855759.8,
            "range": "± 426050.85",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 67927760.1,
            "range": "± 303110.07",
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
          "id": "66b63785f4be66c662a773f799ce04d58fbe5ce7",
          "message": "Merge pull request #173 from fpbrault/feat/move-all-strings-to-i18n\n\nfeat: move all strings to i18n",
          "timestamp": "2026-05-10T12:13:57-04:00",
          "tree_id": "b5e8d125386e693b3b0232625a6a7b2e10f7093d",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/66b63785f4be66c662a773f799ce04d58fbe5ce7"
        },
        "date": 1778430118934,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 53017506,
            "range": "± 439016.85",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 59191793.1,
            "range": "± 232825.37",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 63125577.9,
            "range": "± 567238.85",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 58535765.7,
            "range": "± 254498.83",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 67437906.7,
            "range": "± 167679.78",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 70415369.9,
            "range": "± 231164.1",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 24388546.7,
            "range": "± 170904.77",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 26447027.7,
            "range": "± 120783.57",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 27614592.4,
            "range": "± 131287.36",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 25400046,
            "range": "± 130457.08",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 27858485.7,
            "range": "± 163757.84",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 29348996.5,
            "range": "± 133479.12",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 26436450.7,
            "range": "± 137134.33",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 28440250.4,
            "range": "± 253026.91",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 29594773.3,
            "range": "± 120098.83",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 50960439.6,
            "range": "± 126798.81",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 56017037.7,
            "range": "± 160203.43",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 58548423,
            "range": "± 156603.52",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 51998976,
            "range": "± 126664.32",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 58026409.1,
            "range": "± 153538.16",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 61273974.6,
            "range": "± 192296.58",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 28443595,
            "range": "± 194405.35",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 31118054.5,
            "range": "± 118975.94",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 32702389,
            "range": "± 128351.93",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 25273603.6,
            "range": "± 141674.39",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 27682132.8,
            "range": "± 128064.8",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 29111883.8,
            "range": "± 272439.85",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 49253202.4,
            "range": "± 167281.33",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 54063761.4,
            "range": "± 201296.69",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 57088206.7,
            "range": "± 276425.28",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 63597653.7,
            "range": "± 325239.16",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 67667598.6,
            "range": "± 279436.84",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 67717835.3,
            "range": "± 324532.93",
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
          "id": "0e9e529b2d9110d50133fd03cc2b4a7d4eba0752",
          "message": "Merge pull request #174 from fpbrault/feat/remove-lcd-display-stuff\n\nrefactor: Synth Components and Remove LCD Control Readout",
          "timestamp": "2026-05-10T12:26:29-04:00",
          "tree_id": "f9cea9e91ecc060e2d76029e0b4069ca3b1ab016",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/0e9e529b2d9110d50133fd03cc2b4a7d4eba0752"
        },
        "date": 1778430876190,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 53583159.3,
            "range": "± 535676.43",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 60164211.8,
            "range": "± 876176.24",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 64366323.5,
            "range": "± 660937.11",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 58926642.6,
            "range": "± 789870.87",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 68055578.4,
            "range": "± 903870.86",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 71207709.8,
            "range": "± 770718.31",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 24104523.9,
            "range": "± 231460.26",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 26063589.5,
            "range": "± 407768",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 27254999,
            "range": "± 264994.96",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 24903692.9,
            "range": "± 281729.94",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 27283872.5,
            "range": "± 245289.97",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 28821079.6,
            "range": "± 264591.84",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 25572661.4,
            "range": "± 274168.26",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 27542157.7,
            "range": "± 262447.23",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 28746641.7,
            "range": "± 250358.27",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 51671321.9,
            "range": "± 332609.5",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 57116227.8,
            "range": "± 388015.17",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 59836884.9,
            "range": "± 369336.78",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 52788517.4,
            "range": "± 580355.98",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 59155732.1,
            "range": "± 387471.73",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 62529830,
            "range": "± 479540.5",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 28335537.7,
            "range": "± 216627.22",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 30811156.7,
            "range": "± 254108.55",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 32399354.6,
            "range": "± 234683.28",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 24957928.6,
            "range": "± 218790.19",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 27380393.2,
            "range": "± 260091.1",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 28895411.2,
            "range": "± 220166.13",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 50089405.6,
            "range": "± 404573.2",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 55256602.7,
            "range": "± 1416927.83",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 58502151,
            "range": "± 375108.97",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 64510271.4,
            "range": "± 490856.01",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 68704828.3,
            "range": "± 378577.92",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 68838365.7,
            "range": "± 615290.48",
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
          "id": "94e26d2293777bc102ba2f579a4ae2b7bade063f",
          "message": "Merge pull request #175 from fpbrault/lab/simd\n\nfeat: simd implementation",
          "timestamp": "2026-05-11T14:04:30-04:00",
          "tree_id": "d8e3c1a158fce5c0d3ed22286752ae429f6ea2d4",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/94e26d2293777bc102ba2f579a4ae2b7bade063f"
        },
        "date": 1778522807035,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 9186869.6,
            "range": "± 2154264.59",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11937544.2,
            "range": "± 119540.03",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13764370.5,
            "range": "± 120886.05",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12212125.6,
            "range": "± 127189.51",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16709242.9,
            "range": "± 123989.66",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18406175.8,
            "range": "± 631415.18",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4723614.7,
            "range": "± 41645.16",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6996194.2,
            "range": "± 79905.25",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 8460413.7,
            "range": "± 73690.46",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3805169.5,
            "range": "± 52329.17",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 4236019.5,
            "range": "± 62416.6",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4449478.6,
            "range": "± 58133.65",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5792509.3,
            "range": "± 179504.07",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7959472.1,
            "range": "± 86848.79",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 9368667.6,
            "range": "± 101858.74",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7898813.2,
            "range": "± 68960.44",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10124746.4,
            "range": "± 106129.96",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11359006.6,
            "range": "± 133376.13",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8182918.5,
            "range": "± 134935.06",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10719948.3,
            "range": "± 109452.49",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12138582,
            "range": "± 113901.98",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4753029.6,
            "range": "± 67544.84",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6864480.3,
            "range": "± 91161.14",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8246439.6,
            "range": "± 102703.26",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5359094.3,
            "range": "± 93079.23",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7935084.4,
            "range": "± 112489.28",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9682135,
            "range": "± 144961.96",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7195818.6,
            "range": "± 164962.41",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9199094.4,
            "range": "± 129773.76",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10449938.3,
            "range": "± 159528.07",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12882046.3,
            "range": "± 159073.34",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14480916.2,
            "range": "± 156069.84",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14634628.5,
            "range": "± 184882.72",
            "unit": "ns/iter"
          }
        ]
      }
    ]
  }
}