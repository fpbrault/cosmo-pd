window.BENCHMARK_DATA = {
  "lastUpdate": 1780512823380,
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
          "id": "ee80a510c766b29e1ec2624e69486325e04e806a",
          "message": "feat: add script to generate grouped benchmark pages and update workflow",
          "timestamp": "2026-05-11T14:23:51-04:00",
          "tree_id": "06fa3df6bfc777b46789a86b7f4b4350b2ec7586",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/ee80a510c766b29e1ec2624e69486325e04e806a"
        },
        "date": 1778523976703,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 9139385.3,
            "range": "± 143158.03",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11999852.3,
            "range": "± 241447.59",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14024815.9,
            "range": "± 177784.05",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12016819.9,
            "range": "± 187039.61",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16532693.2,
            "range": "± 316604.73",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18253826.5,
            "range": "± 322322.25",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4664142.8,
            "range": "± 158883.62",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6967141.2,
            "range": "± 172063.88",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 8373769.7,
            "range": "± 94630.97",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3862531.15,
            "range": "± 47868.87",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 4144730.85,
            "range": "± 64971.29",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4486106.7,
            "range": "± 123297.15",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5707356.4,
            "range": "± 48981.46",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7871606.6,
            "range": "± 102632.34",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 9311805.3,
            "range": "± 174961.3",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7865430.1,
            "range": "± 119538.39",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10122575.5,
            "range": "± 131889.61",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11378544.7,
            "range": "± 150263.71",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8237938.6,
            "range": "± 55221.73",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10858518.9,
            "range": "± 87285.83",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12321061.3,
            "range": "± 103000.71",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4554334.05,
            "range": "± 60262.38",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6655850.1,
            "range": "± 95093.05",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8086857.9,
            "range": "± 100564.3",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5272193.5,
            "range": "± 55474.81",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7878146.25,
            "range": "± 89042.63",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9605428.7,
            "range": "± 95694.52",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7118750.8,
            "range": "± 84289.34",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9272596.6,
            "range": "± 86222.69",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10698243.1,
            "range": "± 203208.35",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12854559.2,
            "range": "± 113072.06",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14498096.4,
            "range": "± 96581.41",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14653463.6,
            "range": "± 140588.28",
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
          "id": "449e93cf7385a3641f1947b100ef655caecfaf40",
          "message": "chore: ignore .bench-commits in Biome lint, apply formatting fixes",
          "timestamp": "2026-05-11T14:40:42-04:00",
          "tree_id": "23fb76cfae94e51c157b20e3254d058c8d4bdca6",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/449e93cf7385a3641f1947b100ef655caecfaf40"
        },
        "date": 1778524993503,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 9488096.7,
            "range": "± 211072.35",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12326769.7,
            "range": "± 190123.7",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14351171.2,
            "range": "± 237700.96",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12319105.6,
            "range": "± 171914.25",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16873582.1,
            "range": "± 181770.81",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18545877.9,
            "range": "± 156818.41",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4788603.25,
            "range": "± 126492.17",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 7062602.8,
            "range": "± 94340.91",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 8681590.2,
            "range": "± 196288.03",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3934196.85,
            "range": "± 102020.69",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 4324562.7,
            "range": "± 146489.36",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4636006,
            "range": "± 152542.26",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5866351.4,
            "range": "± 108337.1",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 8098260.4,
            "range": "± 268695.44",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 9569298.5,
            "range": "± 162082.28",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8056324.7,
            "range": "± 153057.45",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10417822.2,
            "range": "± 162184.71",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11624480,
            "range": "± 178546.51",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8515075.1,
            "range": "± 173037.59",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11284383.4,
            "range": "± 155962.25",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12698522.1,
            "range": "± 169080.73",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4685290,
            "range": "± 176169.42",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6840618.3,
            "range": "± 120696.53",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8339830.6,
            "range": "± 129517.59",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5491715.5,
            "range": "± 145634.97",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8170525,
            "range": "± 175590.14",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9995326.3,
            "range": "± 159078.52",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7306860.4,
            "range": "± 172682.18",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9543844,
            "range": "± 183005.74",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11005146.4,
            "range": "± 161521.88",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 13202737.1,
            "range": "± 158071.25",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14885390.4,
            "range": "± 169847.53",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15010568.5,
            "range": "± 149209.62",
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
          "id": "e2b8a0b47197156b31c9addb000429737a4c47f2",
          "message": "Merge pull request #153 from fpbrault/lab/auv3\n\nfeat: add auv3 support",
          "timestamp": "2026-05-12T09:01:22-04:00",
          "tree_id": "0eaaa236668bc85587a59a2542bdfbdd93540764",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/e2b8a0b47197156b31c9addb000429737a4c47f2"
        },
        "date": 1778591028175,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 9013324.2,
            "range": "± 119481.99",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11786357,
            "range": "± 107162.04",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13655921.7,
            "range": "± 152782.11",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12062680.7,
            "range": "± 122018.82",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16614115.6,
            "range": "± 336779.25",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18392373.7,
            "range": "± 184325.53",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4647109.5,
            "range": "± 50033.73",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6846841.2,
            "range": "± 77071.1",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 8309844.6,
            "range": "± 116353.92",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3721620.7,
            "range": "± 68052.88",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 4123400.4,
            "range": "± 110535.13",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4342108.05,
            "range": "± 50324.48",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5705693.05,
            "range": "± 59665.59",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7862894.4,
            "range": "± 87969.74",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 9251009.5,
            "range": "± 522906.83",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7779361.5,
            "range": "± 246125.59",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9944110.6,
            "range": "± 98807.46",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11167596.3,
            "range": "± 137848.55",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8166360.5,
            "range": "± 131964.77",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10625425.6,
            "range": "± 126808",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12029293.3,
            "range": "± 99004.54",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4634352.5,
            "range": "± 546233.19",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6740658.5,
            "range": "± 78157.13",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8110616.1,
            "range": "± 148035.42",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5263626.6,
            "range": "± 66114.11",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7835087.7,
            "range": "± 158523.74",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9541320.1,
            "range": "± 83894.2",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7081035,
            "range": "± 98789.51",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8985696.35,
            "range": "± 71117.96",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10276425.7,
            "range": "± 115180.58",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12624347.9,
            "range": "± 140245.7",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14243534.2,
            "range": "± 213109.08",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14468880,
            "range": "± 160473.22",
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
          "id": "af37968874d73f0c8b49f396630caea560ab9358",
          "message": "Merge pull request #180 from fpbrault/fix/stuck-params\n\nfix: stuck params issue",
          "timestamp": "2026-05-12T09:14:51-04:00",
          "tree_id": "b9115325bfa75d852ff46b9a12c77f20b4c8cec3",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/af37968874d73f0c8b49f396630caea560ab9358"
        },
        "date": 1778591849918,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 9261177.3,
            "range": "± 117254.34",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12028417.4,
            "range": "± 289659.7",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13926768.6,
            "range": "± 112218.12",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12384891.6,
            "range": "± 98089.39",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16998893.2,
            "range": "± 149199.61",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18778706.2,
            "range": "± 466630.62",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4367246.55,
            "range": "± 110146.04",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6734088.2,
            "range": "± 269426.73",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 8232261.8,
            "range": "± 153964.26",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3497063.5,
            "range": "± 82890.35",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3883726.1,
            "range": "± 139719.96",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4062137.4,
            "range": "± 99376.85",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5685730.3,
            "range": "± 218851.01",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7905684.9,
            "range": "± 216127.13",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 9332573.3,
            "range": "± 151781.28",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7773728.5,
            "range": "± 201804.04",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9951059.2,
            "range": "± 135803.24",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11253386.4,
            "range": "± 181828.29",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8192815.4,
            "range": "± 135508.45",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10803456.3,
            "range": "± 161168.05",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12231455.6,
            "range": "± 214595.27",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4345057.6,
            "range": "± 227426.02",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6362218.1,
            "range": "± 160311.19",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7775527,
            "range": "± 134125.6",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4914643.3,
            "range": "± 122272.53",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7469678.8,
            "range": "± 185319.17",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9295222.6,
            "range": "± 585892.87",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6766834.7,
            "range": "± 101460.09",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8796243.6,
            "range": "± 152534.91",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10046373.6,
            "range": "± 282475.63",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12780644.3,
            "range": "± 135449.15",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14498131.3,
            "range": "± 90813.44",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14628422.4,
            "range": "± 153203.87",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "68a5ff51350c0892c44d21e234d8cf830fa60931",
          "message": "fix(deps): update bun non-major dependencies (#178)\n\n* fix(deps): update bun non-major dependencies\n\n* fix(deps): add customManagers:biomeVersions to renovate configuration\n\n---------\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>\nCo-authored-by: Felix Perron-Brault <fpbrault@gmail.com>",
          "timestamp": "2026-05-12T15:16:48Z",
          "tree_id": "5d5f6fa54e2c4e1d56a2efb6d1852045b4b89381",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/68a5ff51350c0892c44d21e234d8cf830fa60931"
        },
        "date": 1778599152959,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 8973653.3,
            "range": "± 310837.04",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11631825.2,
            "range": "± 164754.57",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13436871.6,
            "range": "± 102856.26",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11969024,
            "range": "± 100806.58",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16456848.5,
            "range": "± 75351.9",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18210901.6,
            "range": "± 123773.41",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4585163.2,
            "range": "± 42341.07",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6780171.5,
            "range": "± 85247.95",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 8233032.85,
            "range": "± 104913.38",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3670994.7,
            "range": "± 72981.92",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 4042115.4,
            "range": "± 60895.55",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4306868,
            "range": "± 59627.49",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5778098.95,
            "range": "± 190342.71",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7842303,
            "range": "± 149398.69",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 9208420.7,
            "range": "± 96626.93",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7783579.6,
            "range": "± 220576.21",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9930240.9,
            "range": "± 550655.29",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11181514.4,
            "range": "± 301660.8",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8140424.7,
            "range": "± 419074.1",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10556760.1,
            "range": "± 134441.97",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11981175.3,
            "range": "± 154048.88",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4582620.1,
            "range": "± 67443.4",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6630481.2,
            "range": "± 78207.67",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7999466.2,
            "range": "± 52644.35",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5137673.8,
            "range": "± 57475.55",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7586725.3,
            "range": "± 113983.23",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9216692.3,
            "range": "± 93898.47",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7002175.9,
            "range": "± 72305.85",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8952445.5,
            "range": "± 77818.72",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10260031.7,
            "range": "± 87405.89",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12530215.8,
            "range": "± 129883.21",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14148687.9,
            "range": "± 120409.41",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14329735.3,
            "range": "± 118031.96",
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
          "id": "20d3399299032485709bddbaa1affea1257b7ce4",
          "message": "refactor: clean up unused code and remove TravelViz component (#182)\n\n* refactor: clean up unused code and remove TravelViz component\n\n* test: skip plugin update checks in e2e tests\n\n* test: skip App component tests temporarily\n\n* linitng",
          "timestamp": "2026-05-12T17:09:24-04:00",
          "tree_id": "2f059dffb1a574c1d7ac9cfab1b59217f02fd835",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/20d3399299032485709bddbaa1affea1257b7ce4"
        },
        "date": 1778620318794,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 8970374.7,
            "range": "± 138885.05",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11842088.7,
            "range": "± 118898.14",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13854636.1,
            "range": "± 102134.42",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11884391.8,
            "range": "± 106189.56",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16464895.5,
            "range": "± 126630.48",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18164991.9,
            "range": "± 110584.86",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4593488.2,
            "range": "± 30440.69",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6889416.7,
            "range": "± 70172.2",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 8399745.6,
            "range": "± 92256.48",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3677145,
            "range": "± 54185.64",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 4022775.5,
            "range": "± 80401.36",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4308558.8,
            "range": "± 50008.25",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5668169.9,
            "range": "± 109571.08",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7883964.4,
            "range": "± 331851.56",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 9393963.7,
            "range": "± 67750.64",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7750723.1,
            "range": "± 124755.16",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10059861.2,
            "range": "± 93335.92",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11354158.3,
            "range": "± 97754.4",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8139510.5,
            "range": "± 79834.12",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10796995.6,
            "range": "± 131055.3",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12258830,
            "range": "± 154979.12",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4624619.7,
            "range": "± 49052.1",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6804996.5,
            "range": "± 103783.28",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8260018,
            "range": "± 90436.85",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5165994.2,
            "range": "± 60137.56",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7758030.8,
            "range": "± 74150.77",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9492207.8,
            "range": "± 98801.94",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7119907.4,
            "range": "± 185548.25",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9315871.6,
            "range": "± 107094.26",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10815538.3,
            "range": "± 119522.46",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12654992.7,
            "range": "± 95331.7",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14290171.1,
            "range": "± 118395.93",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14453240.7,
            "range": "± 118718.8",
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
          "id": "6fa05a5dc82bb72521fa40f7964ee07cd68195ed",
          "message": "fix vibrato waves",
          "timestamp": "2026-05-13T21:56:31-04:00",
          "tree_id": "22ecca334395eb1bd0ab604ac290c852d4642af1",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/6fa05a5dc82bb72521fa40f7964ee07cd68195ed"
        },
        "date": 1778723932139,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 9025663.9,
            "range": "± 234340.5",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11834406.5,
            "range": "± 149156.06",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13724048,
            "range": "± 141774.54",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11870105.4,
            "range": "± 237714.75",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16750604.4,
            "range": "± 1009319.49",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18117497.5,
            "range": "± 1178224.55",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4556406.8,
            "range": "± 164501.84",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6833174.6,
            "range": "± 148981.4",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 8382032.6,
            "range": "± 112272.1",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3680663.6,
            "range": "± 1057040.96",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 4029437,
            "range": "± 45988.76",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4329475,
            "range": "± 70129.28",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5606995.7,
            "range": "± 99681.94",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7812090.8,
            "range": "± 147551.81",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 9268438.5,
            "range": "± 120549.2",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7788313.4,
            "range": "± 147030.39",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10065957.5,
            "range": "± 191304.52",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11377070.2,
            "range": "± 198415.78",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8110927.3,
            "range": "± 140306.77",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10802889.3,
            "range": "± 250077.72",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12228276.7,
            "range": "± 506060.87",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4597570,
            "range": "± 230878.19",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6749500.7,
            "range": "± 274933.79",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8203280.1,
            "range": "± 120053.74",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5146952.2,
            "range": "± 124015.4",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7646457.8,
            "range": "± 132664.76",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9377416.2,
            "range": "± 168289.75",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7152406.7,
            "range": "± 209200.93",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9352919.5,
            "range": "± 187640.07",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10821454.7,
            "range": "± 224721.07",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12798020.1,
            "range": "± 159599.93",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14431979.9,
            "range": "± 161493.41",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14503144,
            "range": "± 151090.26",
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
          "id": "dc54fa8ec93ceeb881c13aab988f3c827720714d",
          "message": "minor fixes",
          "timestamp": "2026-05-14T12:53:29-04:00",
          "tree_id": "9922188d1a32634acc84c6adf36f5e93c32893ba",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/dc54fa8ec93ceeb881c13aab988f3c827720714d"
        },
        "date": 1778777757293,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 9124156.1,
            "range": "± 558146.46",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11900928.4,
            "range": "± 161195.19",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14008398.6,
            "range": "± 219215.22",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12091756.1,
            "range": "± 225192.08",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16561608.1,
            "range": "± 135563.86",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18143285.3,
            "range": "± 184075.26",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4532510.3,
            "range": "± 95969.12",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6818786.9,
            "range": "± 88501.39",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 8349874.8,
            "range": "± 150446.76",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3654897.6,
            "range": "± 46637.04",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 4014565.7,
            "range": "± 61175.92",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4333397.6,
            "range": "± 49386.05",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5701737.8,
            "range": "± 114920.26",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7834613.7,
            "range": "± 79018.19",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 9354289.6,
            "range": "± 137283.27",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7801000.5,
            "range": "± 95081.49",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10103884.5,
            "range": "± 220419.46",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11369268.4,
            "range": "± 96404.1",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8250480.15,
            "range": "± 115356.13",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10788914.4,
            "range": "± 179302.01",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12164382.2,
            "range": "± 150545.65",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4568656.3,
            "range": "± 58517.99",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6746284.3,
            "range": "± 72650.74",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8187583.2,
            "range": "± 126517.57",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5209735.8,
            "range": "± 66660",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7779427.8,
            "range": "± 134823.87",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9407776.45,
            "range": "± 118549.89",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7080212.6,
            "range": "± 52920.27",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9280942.4,
            "range": "± 87474.69",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10716184.9,
            "range": "± 137189.33",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12925207.9,
            "range": "± 142761.25",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14648858.7,
            "range": "± 256301.9",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14710638.8,
            "range": "± 203901.37",
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
          "id": "f09b3c742a2f0107e9a3ef3237703bbeab7066f0",
          "message": "move cz-explorer to its own repo",
          "timestamp": "2026-05-15T08:32:42-04:00",
          "tree_id": "cf30a1aae2a6466e3b7c57d38b7b475c5ae06215",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/f09b3c742a2f0107e9a3ef3237703bbeab7066f0"
        },
        "date": 1778848499143,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 8939799.5,
            "range": "± 84836.61",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11757615.3,
            "range": "± 95319.13",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13687867,
            "range": "± 140389.85",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11903079.1,
            "range": "± 153917.86",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16386834.1,
            "range": "± 175692.28",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18006055.3,
            "range": "± 121728.48",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4550242.45,
            "range": "± 83625.51",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6802882.2,
            "range": "± 86049.65",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 8334544.4,
            "range": "± 74188.44",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3626560.4,
            "range": "± 56128.26",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3984430.5,
            "range": "± 51120.7",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4287649.6,
            "range": "± 61597.05",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5646297.95,
            "range": "± 47218.33",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7813696.5,
            "range": "± 106480.33",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 9294763.6,
            "range": "± 87595.38",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7735140.4,
            "range": "± 125997.74",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10032052.1,
            "range": "± 79681.96",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11266743,
            "range": "± 273036.18",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8006149.4,
            "range": "± 61061.91",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10573595.2,
            "range": "± 1592048.9",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12004425.9,
            "range": "± 98997.03",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4529356.5,
            "range": "± 128710.62",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6700507.5,
            "range": "± 83864.79",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8123559.9,
            "range": "± 88406.32",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5055135.7,
            "range": "± 55745.84",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7559550.5,
            "range": "± 90112.01",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9232693.7,
            "range": "± 56812.93",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7065640.9,
            "range": "± 104150.27",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9230558,
            "range": "± 79057.79",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10659850.2,
            "range": "± 127264.69",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12665480.7,
            "range": "± 128641.71",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14295502.8,
            "range": "± 97633.78",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14452659.9,
            "range": "± 178395.71",
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
          "id": "4f03641be2dcb3db6189842580c97b6950f9b63e",
          "message": "deps",
          "timestamp": "2026-05-15T08:39:58-04:00",
          "tree_id": "dc82bddb18ba97b1c4fdd7793a1cb65257a4168b",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/4f03641be2dcb3db6189842580c97b6950f9b63e"
        },
        "date": 1778848935313,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 8923067.1,
            "range": "± 113700.68",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11581661.8,
            "range": "± 426327.09",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13362530,
            "range": "± 125511.29",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11994122.8,
            "range": "± 157343.83",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16429909.7,
            "range": "± 178360.54",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18088589.6,
            "range": "± 151153.13",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4513465.6,
            "range": "± 81243.25",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6623938.7,
            "range": "± 110509.13",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 8054211.7,
            "range": "± 156527.88",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3596832.5,
            "range": "± 472386.25",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3921998.6,
            "range": "± 95324.13",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4171659.6,
            "range": "± 92309.51",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5568126.6,
            "range": "± 191094.66",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7569093.5,
            "range": "± 392810.93",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8908282.3,
            "range": "± 209626.27",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7703012.55,
            "range": "± 124615.92",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9807702.2,
            "range": "± 171449.26",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11090105.8,
            "range": "± 152397.15",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8150409.7,
            "range": "± 159855.53",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10534545.2,
            "range": "± 158059.48",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11816685.8,
            "range": "± 157091.25",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4530516.9,
            "range": "± 121132.4",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6493901.9,
            "range": "± 86716.56",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7862507.9,
            "range": "± 142170.52",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5129274.4,
            "range": "± 147758.74",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7518771.4,
            "range": "± 143656.53",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9164987.7,
            "range": "± 154998",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7013712.4,
            "range": "± 100904.51",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8936276.4,
            "range": "± 371943.21",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10181615.6,
            "range": "± 93222.35",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12558011.4,
            "range": "± 112891.43",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14127133.3,
            "range": "± 119618.41",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14266974.3,
            "range": "± 146735.73",
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
          "id": "a7d0aaa6a99b629a07d04dbb409fb59066683b10",
          "message": "feat: add vercel configuration for routing",
          "timestamp": "2026-05-15T08:44:24-04:00",
          "tree_id": "05ff831f2f9440d9ce48ca7eaac537f2a9f13f93",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/a7d0aaa6a99b629a07d04dbb409fb59066683b10"
        },
        "date": 1778849201261,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 9015574.8,
            "range": "± 1380036.34",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11857373.1,
            "range": "± 201827.07",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13870286.2,
            "range": "± 657960.45",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11943304.8,
            "range": "± 156155.3",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16437226,
            "range": "± 128283.39",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18165492.3,
            "range": "± 193911.12",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4631647.6,
            "range": "± 75559.65",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6916549,
            "range": "± 212877.85",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 8437486.5,
            "range": "± 69595.01",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3697223.1,
            "range": "± 86065.62",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 4058328.55,
            "range": "± 67862.93",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4372959.2,
            "range": "± 70792.45",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5740372,
            "range": "± 93941.63",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7922594,
            "range": "± 92189.77",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 9383973.9,
            "range": "± 187862.13",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7828946.85,
            "range": "± 71377.28",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10193757.4,
            "range": "± 177420.66",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11425141,
            "range": "± 176957.72",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8142945.7,
            "range": "± 207317.59",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10730721.6,
            "range": "± 208203",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12182834.3,
            "range": "± 143059.09",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4634065.7,
            "range": "± 64627.46",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6878975.6,
            "range": "± 187630.41",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8239388.1,
            "range": "± 79827.35",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5188602.4,
            "range": "± 1518207.82",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7738978.1,
            "range": "± 148325.98",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9444635.2,
            "range": "± 172845.08",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7171353.8,
            "range": "± 111266.13",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9368556.1,
            "range": "± 132144.66",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10818655.3,
            "range": "± 159012.63",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12876004.4,
            "range": "± 175263.02",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14537031.5,
            "range": "± 156050.34",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14677929.5,
            "range": "± 151975.35",
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
          "id": "8c22af35d22d6eaade5afc8a5b8e6a3a26ac5974",
          "message": "Add comprehensive documentation for Cosmo PD-101 synthesizer\n\n- Created effects.md detailing the 17 effect types and FX chain.\n- Added envelopes.md explaining the 8-step CZ-style envelopes.\n- Introduced global-controls.md covering polyphony, portamento, and other global settings.\n- Documented oscillators.md outlining dual oscillator lines and their parameters.\n- Developed overview.md providing an architecture and signal flow description.\n- Established troubleshooting.md for common issues and resolutions.\n- Initialized package.json for project dependencies and scripts.\n- Configured rspress.config.ts for site structure and navigation.",
          "timestamp": "2026-05-15T08:53:58-04:00",
          "tree_id": "b4df43523b52fb08a6db2546b6da5ee7e47002d8",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/8c22af35d22d6eaade5afc8a5b8e6a3a26ac5974"
        },
        "date": 1778849782565,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 8909995.8,
            "range": "± 338139.61",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11504641.9,
            "range": "± 199387.2",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13306640.7,
            "range": "± 113575.31",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11920959.7,
            "range": "± 186678.51",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16327168.5,
            "range": "± 188779.26",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18029903.1,
            "range": "± 201400.11",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4548890.1,
            "range": "± 69420.94",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6628448.6,
            "range": "± 95366.36",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 8037520.6,
            "range": "± 109306.5",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3559589.4,
            "range": "± 39138.68",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3898628.6,
            "range": "± 52273.86",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4131537.1,
            "range": "± 75054.97",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5563134.8,
            "range": "± 55824.48",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7548337.6,
            "range": "± 95814.35",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8880633.1,
            "range": "± 94809.96",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7671700.6,
            "range": "± 77829.31",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9782093.6,
            "range": "± 100161.64",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10939313.1,
            "range": "± 105733.43",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7987403.8,
            "range": "± 897144.12",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10442120.9,
            "range": "± 124705.59",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11721017.9,
            "range": "± 105409.31",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4511044.9,
            "range": "± 59167.36",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6479257.5,
            "range": "± 40204.81",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7816503.1,
            "range": "± 91223.27",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5085105.9,
            "range": "± 61098.66",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7456808.95,
            "range": "± 73065.57",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9029476.9,
            "range": "± 54120.51",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6937787.5,
            "range": "± 63853.71",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8844630.5,
            "range": "± 89644.38",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10073006.8,
            "range": "± 74999.22",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12437469,
            "range": "± 109271.98",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14017018,
            "range": "± 110630.54",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14148780.4,
            "range": "± 123467.11",
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
          "id": "4337f5863b4c0fa8c7345e01f935a1b4137877c9",
          "message": "fix: update base path in rspress configuration for documentation",
          "timestamp": "2026-05-15T09:05:42-04:00",
          "tree_id": "b7d71572dec676cda713b2878988e176c0f0531e",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/4337f5863b4c0fa8c7345e01f935a1b4137877c9"
        },
        "date": 1778850475776,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 8997597,
            "range": "± 117655.37",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11635224.4,
            "range": "± 207285.26",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13405616.6,
            "range": "± 153449.12",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11992563.4,
            "range": "± 120106.54",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16400372.7,
            "range": "± 73484.05",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18097865.6,
            "range": "± 101936.4",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4568745.4,
            "range": "± 35340.4",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6662574.4,
            "range": "± 71658.38",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 8062523.9,
            "range": "± 122363.72",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3614053.3,
            "range": "± 56008.08",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3944210.1,
            "range": "± 36134.51",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4189139.9,
            "range": "± 52723.72",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5604523.7,
            "range": "± 55838.71",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7621929.9,
            "range": "± 87175.08",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8989434.3,
            "range": "± 117188.96",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7719534.5,
            "range": "± 61601.42",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9828478.8,
            "range": "± 133098.84",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11014642.5,
            "range": "± 124304.8",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8101705.8,
            "range": "± 133037.47",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10470242.1,
            "range": "± 75621.96",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11872693.7,
            "range": "± 174674.76",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4568400.1,
            "range": "± 35370.47",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6526606.5,
            "range": "± 39731.81",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7859681.7,
            "range": "± 78120.63",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5120233.15,
            "range": "± 39806.07",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7502865.7,
            "range": "± 96174.29",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9135853,
            "range": "± 89104.78",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6991448.5,
            "range": "± 57599.17",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8860223.7,
            "range": "± 108505.62",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10107525.9,
            "range": "± 68144.92",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12511419.2,
            "range": "± 88051.06",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14070122.6,
            "range": "± 95671.29",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14218867.2,
            "range": "± 86210.51",
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
          "id": "680a031a0c895a25fcbd5038f5d9eb36fc327c9e",
          "message": "fix: update modulation matrix details and correct algorithm counts in documentation",
          "timestamp": "2026-05-15T09:22:23-04:00",
          "tree_id": "5d879d00a037bd080ed4b9d0be60435e221b4dba",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/680a031a0c895a25fcbd5038f5d9eb36fc327c9e"
        },
        "date": 1778851476021,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 8905740,
            "range": "± 102400.26",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11478238.7,
            "range": "± 65068.19",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13268552.8,
            "range": "± 84271.17",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11877725.2,
            "range": "± 140440.29",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16333830.4,
            "range": "± 90857.62",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18052666.5,
            "range": "± 85121.71",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4465264,
            "range": "± 49942.49",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6595066.3,
            "range": "± 1194898.82",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7981794.7,
            "range": "± 49020.84",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3538213.5,
            "range": "± 39173.02",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3866124.2,
            "range": "± 243245.51",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4100011.8,
            "range": "± 46005.81",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5512341.4,
            "range": "± 57286.03",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7498641.2,
            "range": "± 89140.66",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8826254.6,
            "range": "± 89390.44",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7660336.8,
            "range": "± 308837.28",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9721199.1,
            "range": "± 412884.3",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10888599.4,
            "range": "± 176933.82",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7949467.3,
            "range": "± 70054.7",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10381014.8,
            "range": "± 104246.43",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11755332.4,
            "range": "± 160554.14",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4600152.4,
            "range": "± 68397.61",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6573914.5,
            "range": "± 97146.22",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7902823.4,
            "range": "± 120743.51",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5183195.6,
            "range": "± 74726.74",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7578808.1,
            "range": "± 137986.57",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9094554.3,
            "range": "± 138555.35",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6955388.8,
            "range": "± 111603.56",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8819509.7,
            "range": "± 136926.62",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10098396.3,
            "range": "± 116116.17",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12507202.4,
            "range": "± 923298.06",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14178172.8,
            "range": "± 225486.32",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14322185.5,
            "range": "± 532169.21",
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
          "id": "2d1db1df286caa6d1268ba5f043707852f3686b3",
          "message": "fix: update CI configuration for unit and browser tests, remove desktop app documentation",
          "timestamp": "2026-05-15T09:39:45-04:00",
          "tree_id": "403fb4327eb50c451d0d72faeada31dd11484a60",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/2d1db1df286caa6d1268ba5f043707852f3686b3"
        },
        "date": 1778852522804,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 8899273.3,
            "range": "± 115475.65",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11501862.5,
            "range": "± 95318.7",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13272950.3,
            "range": "± 94458.26",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11908364.2,
            "range": "± 3729398.53",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16326678.4,
            "range": "± 486533.54",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17990045.2,
            "range": "± 112667.46",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4507596.1,
            "range": "± 331697.25",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6597449.4,
            "range": "± 92707.41",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7987810.8,
            "range": "± 58919.31",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3540169.3,
            "range": "± 37522.06",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3876870.2,
            "range": "± 33443.39",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4133580,
            "range": "± 263330.76",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5535619.4,
            "range": "± 70896.84",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7513138.2,
            "range": "± 57436.68",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8833676.5,
            "range": "± 70190.91",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7682527.7,
            "range": "± 43148.88",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9758040.95,
            "range": "± 78205.29",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10913729.7,
            "range": "± 1601617.37",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7999325.9,
            "range": "± 61651.17",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10416565.4,
            "range": "± 83039.03",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11730458,
            "range": "± 85162.17",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4507334.6,
            "range": "± 41398.88",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6479319.2,
            "range": "± 49360.54",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7782370.3,
            "range": "± 93232.54",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5061314.7,
            "range": "± 887484.74",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7438730.1,
            "range": "± 47199.05",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9034409,
            "range": "± 120755.95",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6939101,
            "range": "± 46689.97",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8805623.9,
            "range": "± 62856.18",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10048372.7,
            "range": "± 200041.25",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12435600.6,
            "range": "± 106546.75",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13986997.8,
            "range": "± 101267.35",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14126748.9,
            "range": "± 154148.52",
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
          "id": "4fc7d7b5412510f81c72ac14166c262205cefeec",
          "message": "fix: clean up package.json formatting and update rspress.config.ts for better readability",
          "timestamp": "2026-05-15T10:13:57-04:00",
          "tree_id": "88a5221339ae9fc30fd9b521acb14dfd4d857247",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/4fc7d7b5412510f81c72ac14166c262205cefeec"
        },
        "date": 1778854588817,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 9122368.2,
            "range": "± 97974.29",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11784009.9,
            "range": "± 696888.94",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13698498.1,
            "range": "± 106550.94",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11897913.8,
            "range": "± 107310.96",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16403702.6,
            "range": "± 175319.87",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18061486.6,
            "range": "± 317214.58",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4563780.9,
            "range": "± 146186.32",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6826215.35,
            "range": "± 137249.69",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 8319456.95,
            "range": "± 63997.61",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3675936.8,
            "range": "± 45801.9",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 4029696.8,
            "range": "± 815167.78",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4332917.5,
            "range": "± 57120.25",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5684372.2,
            "range": "± 660027.93",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7817659,
            "range": "± 67308.62",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 9255135.7,
            "range": "± 792913.56",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7720347.1,
            "range": "± 69901.71",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10003051.5,
            "range": "± 113318.46",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11254219.3,
            "range": "± 140808.18",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8037528.8,
            "range": "± 103316.9",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10607369,
            "range": "± 197225.86",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12030694.3,
            "range": "± 85042.52",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4591915.6,
            "range": "± 78335.39",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6713075.75,
            "range": "± 120681.46",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8127051.5,
            "range": "± 105645.31",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5134737.7,
            "range": "± 81893.95",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7630298.5,
            "range": "± 98895.29",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9327922.8,
            "range": "± 501160.19",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7138691.4,
            "range": "± 210895.64",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9252645.6,
            "range": "± 113305.23",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10732730.4,
            "range": "± 161226.47",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12703247.3,
            "range": "± 186190.08",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14337332.2,
            "range": "± 175607.29",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14478083.8,
            "range": "± 146094.72",
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
          "id": "46b1feadde2d259ca2e64bd48eb03cdc43675779",
          "message": "fix tests",
          "timestamp": "2026-05-15T12:22:32-04:00",
          "tree_id": "013e82d5d3545b95487de44f66534d223549fc2b",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/46b1feadde2d259ca2e64bd48eb03cdc43675779"
        },
        "date": 1778862288923,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 8941743.1,
            "range": "± 211833.99",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11549977.8,
            "range": "± 189702.42",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13340571.2,
            "range": "± 243458.74",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11923943,
            "range": "± 114883.46",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16370318.2,
            "range": "± 114465.55",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18094092,
            "range": "± 1689767.17",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4494285.05,
            "range": "± 89510.62",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6562625.9,
            "range": "± 64287.04",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7992992.2,
            "range": "± 105346.01",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3578902.4,
            "range": "± 56364.41",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3905168.6,
            "range": "± 119599.04",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4136175.9,
            "range": "± 47207.45",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5529993,
            "range": "± 64031.67",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7549788.1,
            "range": "± 76869.74",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8893042.8,
            "range": "± 110664.05",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7626146.6,
            "range": "± 66811.28",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9718504.2,
            "range": "± 120366.03",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10904750.2,
            "range": "± 107058.8",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7975088.5,
            "range": "± 757005.19",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10384122.2,
            "range": "± 1252685.02",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11711807.2,
            "range": "± 187441.31",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4516804.8,
            "range": "± 44617.26",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6496204.75,
            "range": "± 59576.26",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7831997.5,
            "range": "± 108007.83",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5082124.7,
            "range": "± 65266.24",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7443268.2,
            "range": "± 79749.68",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9018599,
            "range": "± 77224.21",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6902763.7,
            "range": "± 82172.43",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8786808.2,
            "range": "± 109488.97",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10053100.1,
            "range": "± 109150.31",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12413010.3,
            "range": "± 158039.49",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14063596.9,
            "range": "± 181883.56",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14151736.8,
            "range": "± 104038.28",
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
          "id": "838ecd894e64f6f301ab7220a1649f9690e947d8",
          "message": "fix more tests",
          "timestamp": "2026-05-15T12:27:44-04:00",
          "tree_id": "21c4a8789f3e78c164b5e00506c4430258f1c567",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/838ecd894e64f6f301ab7220a1649f9690e947d8"
        },
        "date": 1778862611400,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 9221522.9,
            "range": "± 243099.11",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12021680.6,
            "range": "± 142596.26",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13977858.8,
            "range": "± 294865.63",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12111535.3,
            "range": "± 225363.38",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16509152.4,
            "range": "± 276983.68",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18091387.8,
            "range": "± 449661.9",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4649259.8,
            "range": "± 118034.61",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 7044227.1,
            "range": "± 198679.56",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 8575466.3,
            "range": "± 227077.18",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3825872.25,
            "range": "± 147765.38",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 4241571.5,
            "range": "± 105429.26",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4512421,
            "range": "± 127821.37",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5858963.4,
            "range": "± 140882.38",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7990565.9,
            "range": "± 408578.41",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 9467337.3,
            "range": "± 230503.42",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7907267.55,
            "range": "± 174096.83",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10310688.9,
            "range": "± 217610.71",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11566247.2,
            "range": "± 204448.43",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8297486.6,
            "range": "± 153051.14",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10862132.2,
            "range": "± 239163.7",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12320251.7,
            "range": "± 147814.7",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4790970.5,
            "range": "± 107075.3",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6941583.2,
            "range": "± 167165.26",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8182375.9,
            "range": "± 239995.54",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5139730.3,
            "range": "± 112592.43",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7658135.3,
            "range": "± 171101.66",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9433959.6,
            "range": "± 169342.42",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7154627.6,
            "range": "± 179648.38",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9326571.9,
            "range": "± 145331.96",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10801328.6,
            "range": "± 163109.62",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12842079.2,
            "range": "± 202383.65",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14471673,
            "range": "± 122938.79",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14654719.5,
            "range": "± 358296.07",
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
          "id": "b4bd8295df463779af5ca8e89e0ba8e2d01a6586",
          "message": "cleanup",
          "timestamp": "2026-05-15T21:50:52-04:00",
          "tree_id": "c62b31e33c392d038de11c93600953f8dde4a08a",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/b4bd8295df463779af5ca8e89e0ba8e2d01a6586"
        },
        "date": 1778896396511,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 9086532.3,
            "range": "± 366236.5",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11845609.2,
            "range": "± 97302.97",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13785177.6,
            "range": "± 288716.08",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11926383.1,
            "range": "± 120884.9",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16463511.2,
            "range": "± 168059.99",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18131813,
            "range": "± 134569.92",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 4601221.2,
            "range": "± 34261.29",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6889223.7,
            "range": "± 54598.4",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 8401140.85,
            "range": "± 73560.69",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3659352.8,
            "range": "± 79944.66",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 4004662.9,
            "range": "± 39373.48",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 4339498.1,
            "range": "± 122517.82",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5697068.4,
            "range": "± 53253.34",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7907548.3,
            "range": "± 86984.23",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 9379994,
            "range": "± 111215.18",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7793071.5,
            "range": "± 177253.7",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10061870.7,
            "range": "± 95620.8",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11370617.9,
            "range": "± 157886.28",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8220581.4,
            "range": "± 381830.86",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10730160.4,
            "range": "± 177731.15",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12088675.6,
            "range": "± 119785.72",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4618547,
            "range": "± 66118.76",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6798112.2,
            "range": "± 86271.88",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8217917,
            "range": "± 54469.5",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5190062.4,
            "range": "± 117963.59",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7742843.7,
            "range": "± 180400.03",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9468343.3,
            "range": "± 139140.78",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7119533,
            "range": "± 157463.69",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9322680.35,
            "range": "± 214990.62",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10847727.5,
            "range": "± 260253.86",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12820006.2,
            "range": "± 218621.27",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14414656.4,
            "range": "± 140900.36",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14516074,
            "range": "± 106698.7",
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
          "id": "86a33a6c6950d129d6961cbf76839f1c7aded53b",
          "message": "feat(engine): add compiled render cache and no-mod fast path (#186)\n\n* chore: remove unused filter parameters and related code\n\n* fix tests\n\n* chore: refactor SIMD backend dispatch to reduce code duplication\n\n* feat: Enhance rendering and modulation capabilities in Cosmo Synth Engine\n\n- Introduced `from_compiled_line` method in `LineRenderConfig` to streamline line rendering using compiled plans.\n- Updated `CosmoProcessor` to manage a `RenderPlan`, ensuring efficient rendering and modulation handling.\n- Refactored modulation logic to conditionally apply modulations based on active routes, improving performance.\n- Enhanced voice rendering functions to utilize compiled line plans, optimizing audio output.\n- Added tests to validate rendering behavior with and without modulation, ensuring audio integrity.\n- Minor adjustments to SIMD operations for improved clarity and maintainability.\n\n* refactor(engine): rename RenderPlan to CompiledSynthParams\n\n* linting\n\n* chore: remove unused filter parameters from ENGINE_PARAM_UI_META_V1\n\n* test: add unit test for FX slot changes synchronization in CosmoProcessor\nrefactor: update DCO exponential curve comment for clarity\n\n* chore: update cosmo_synth_engine_bg.wasm binary file",
          "timestamp": "2026-05-17T10:52:06-04:00",
          "tree_id": "008ff6cc5d698e56a0530455330c1c981364c45a",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/86a33a6c6950d129d6961cbf76839f1c7aded53b"
        },
        "date": 1779029653684,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 9025213.25,
            "range": "± 122281",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11711407.8,
            "range": "± 163380.81",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13523813.4,
            "range": "± 209949.24",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11969673.5,
            "range": "± 118507.7",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16533082.8,
            "range": "± 171747.3",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18251657,
            "range": "± 244688.32",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 3342737.3,
            "range": "± 22227.22",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5092753.2,
            "range": "± 21481.65",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6266185.3,
            "range": "± 53479.44",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2740220.6,
            "range": "± 49756.75",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3084619.3,
            "range": "± 76812.96",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3302258.9,
            "range": "± 27431.93",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4626637.4,
            "range": "± 65948.2",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6262955.8,
            "range": "± 143393.74",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7378867.6,
            "range": "± 90122.02",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7433602,
            "range": "± 130608.41",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9678813.9,
            "range": "± 125885.57",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10980260.9,
            "range": "± 185454.44",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7818820.3,
            "range": "± 106220.18",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10373326.8,
            "range": "± 134468.57",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11820375.7,
            "range": "± 214991.34",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4110388.3,
            "range": "± 68280.19",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6201630.8,
            "range": "± 105382.54",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7620930,
            "range": "± 130732.1",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3823611.4,
            "range": "± 41004.91",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5789273.2,
            "range": "± 126801.22",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7094951.4,
            "range": "± 145927.4",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6620647.7,
            "range": "± 87382.31",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8635687.8,
            "range": "± 152245.08",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9819754.3,
            "range": "± 130377.02",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12381052.3,
            "range": "± 161948.75",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13978342.4,
            "range": "± 167296",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14059783.5,
            "range": "± 442707.45",
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
          "id": "c91e9c169e95b59983c9ec8922baaece7db95b72",
          "message": "feat: add CZ DAC emulation and enhance synth parameters (#187)\n\n* chore: remove unused filter parameters and related code\n\n* fix tests\n\n* chore: refactor SIMD backend dispatch to reduce code duplication\n\n* feat: Enhance rendering and modulation capabilities in Cosmo Synth Engine\n\n- Introduced `from_compiled_line` method in `LineRenderConfig` to streamline line rendering using compiled plans.\n- Updated `CosmoProcessor` to manage a `RenderPlan`, ensuring efficient rendering and modulation handling.\n- Refactored modulation logic to conditionally apply modulations based on active routes, improving performance.\n- Enhanced voice rendering functions to utilize compiled line plans, optimizing audio output.\n- Added tests to validate rendering behavior with and without modulation, ensuring audio integrity.\n- Minor adjustments to SIMD operations for improved clarity and maintainability.\n\n* refactor(engine): rename RenderPlan to CompiledSynthParams\n\n* linting\n\n* chore: remove unused filter parameters from ENGINE_PARAM_UI_META_V1\n\n* test: add unit test for FX slot changes synchronization in CosmoProcessor\nrefactor: update DCO exponential curve comment for clarity\n\n* chore: update cosmo_synth_engine_bg.wasm binary file\n\n* feat: add CZ DAC emulation and enhance synth parameters\n\n- Introduced `CzDacColor` struct for DAC coloration effect, implementing processing logic for CZ-1 emulation.\n- Updated `SynthParams` to include `czDacEnabled` flag, allowing toggling of the CZ DAC effect.\n- Refactored voice rendering to utilize a new `VoiceRenderContext` struct, simplifying parameter passing.\n- Enhanced LFO processing by consolidating related logic into a dedicated function.\n- Improved overall code organization and readability by separating concerns and reducing argument counts in functions.",
          "timestamp": "2026-05-17T11:05:05-04:00",
          "tree_id": "cd865736da5330ec3267c57f45fc0f7de18df351",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/c91e9c169e95b59983c9ec8922baaece7db95b72"
        },
        "date": 1779030438454,
        "tool": "cargo",
        "benches": [
          {
            "name": "chants_like_3_voices",
            "value": 8887568.8,
            "range": "± 276873.75",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11602286.6,
            "range": "± 77892.28",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13516171.5,
            "range": "± 156345.32",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11773960.6,
            "range": "± 233353.04",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16193870.6,
            "range": "± 165098.5",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17861902.5,
            "range": "± 151590.91",
            "unit": "ns/iter"
          },
          {
            "name": "default_3_voices",
            "value": 3586882.5,
            "range": "± 27974.06",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5212477.3,
            "range": "± 54532.82",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6269685.7,
            "range": "± 46864.65",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3103732.9,
            "range": "± 62034.37",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3430039.4,
            "range": "± 18505.03",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3693329.3,
            "range": "± 51972.09",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4626340,
            "range": "± 53004.24",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6127692.5,
            "range": "± 60066.35",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7161943.7,
            "range": "± 61189.65",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7496323.1,
            "range": "± 100984.78",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9560356.05,
            "range": "± 54702.94",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10633483.4,
            "range": "± 95462.68",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8028744.7,
            "range": "± 117380.78",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10593815.7,
            "range": "± 68347.48",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11997397.4,
            "range": "± 132904.91",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4328557.1,
            "range": "± 104712.21",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6258741,
            "range": "± 169717.65",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7516122.7,
            "range": "± 79406.58",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4231210.9,
            "range": "± 51194.53",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 6207198.2,
            "range": "± 56460.08",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7531423.8,
            "range": "± 160871.32",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6775724.3,
            "range": "± 53857.82",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8682068.1,
            "range": "± 117692.23",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9895894.1,
            "range": "± 83116.35",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12626968.5,
            "range": "± 116506.27",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14220361.2,
            "range": "± 154583.3",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14325734.4,
            "range": "± 135849.24",
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
          "id": "5237d0c9be691c3cd4322ad078a4708f55faa929",
          "message": "fix: add missing bench configuration for render-bench",
          "timestamp": "2026-05-17T12:20:43-04:00",
          "tree_id": "0fdb9ff50afa0d5aa928613649cdec8a36e91cf6",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/5237d0c9be691c3cd4322ad078a4708f55faa929"
        },
        "date": 1779035239361,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2960674,
            "range": "± 64956",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4727147,
            "range": "± 101169",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5786201,
            "range": "± 38260",
            "unit": "ns/iter"
          },
          {
            "name": "fun-bass-like_3_voices",
            "value": 2329193,
            "range": "± 15714",
            "unit": "ns/iter"
          },
          {
            "name": "fun-bass-like_6_voices",
            "value": 2776821,
            "range": "± 24412",
            "unit": "ns/iter"
          },
          {
            "name": "fun-bass-like_8_voices",
            "value": 2982388,
            "range": "± 179226",
            "unit": "ns/iter"
          },
          {
            "name": "chants-like_3_voices",
            "value": 8142402,
            "range": "± 187584",
            "unit": "ns/iter"
          },
          {
            "name": "chants-like_6_voices",
            "value": 10767456,
            "range": "± 55890",
            "unit": "ns/iter"
          },
          {
            "name": "chants-like_8_voices",
            "value": 12638798,
            "range": "± 28527",
            "unit": "ns/iter"
          },
          {
            "name": "chops-like_3_voices",
            "value": 11202895,
            "range": "± 35721",
            "unit": "ns/iter"
          },
          {
            "name": "chops-like_6_voices",
            "value": 15602563,
            "range": "± 698934",
            "unit": "ns/iter"
          },
          {
            "name": "chops-like_8_voices",
            "value": 17260323,
            "range": "± 395235",
            "unit": "ns/iter"
          },
          {
            "name": "mod-heavy_3_voices",
            "value": 6877006,
            "range": "± 19578",
            "unit": "ns/iter"
          },
          {
            "name": "mod-heavy_6_voices",
            "value": 9014067,
            "range": "± 61322",
            "unit": "ns/iter"
          },
          {
            "name": "mod-heavy_8_voices",
            "value": 10218836,
            "range": "± 28208",
            "unit": "ns/iter"
          },
          {
            "name": "fx-heavy_3_voices",
            "value": 3861865,
            "range": "± 11026",
            "unit": "ns/iter"
          },
          {
            "name": "fx-heavy_6_voices",
            "value": 5569107,
            "range": "± 133669",
            "unit": "ns/iter"
          },
          {
            "name": "fx-heavy_8_voices",
            "value": 6580382,
            "range": "± 142157",
            "unit": "ns/iter"
          },
          {
            "name": "worst-poly_3_voices",
            "value": 11607334,
            "range": "± 23484",
            "unit": "ns/iter"
          },
          {
            "name": "worst-poly_6_voices",
            "value": 13191997,
            "range": "± 66667",
            "unit": "ns/iter"
          },
          {
            "name": "worst-poly_8_voices",
            "value": 13375058,
            "range": "± 24331",
            "unit": "ns/iter"
          },
          {
            "name": "opt-sine-lfo-heavy_3_voices",
            "value": 6208780,
            "range": "± 13724",
            "unit": "ns/iter"
          },
          {
            "name": "opt-sine-lfo-heavy_6_voices",
            "value": 8171500,
            "range": "± 21894",
            "unit": "ns/iter"
          },
          {
            "name": "opt-sine-lfo-heavy_8_voices",
            "value": 9464691,
            "range": "± 79843",
            "unit": "ns/iter"
          },
          {
            "name": "opt-param-interp-light_3_voices",
            "value": 3706937,
            "range": "± 35232",
            "unit": "ns/iter"
          },
          {
            "name": "opt-param-interp-light_6_voices",
            "value": 5761492,
            "range": "± 31717",
            "unit": "ns/iter"
          },
          {
            "name": "opt-param-interp-light_8_voices",
            "value": 7099797,
            "range": "± 22375",
            "unit": "ns/iter"
          },
          {
            "name": "opt-render-vectorization_3_voices",
            "value": 3484141,
            "range": "± 33437",
            "unit": "ns/iter"
          },
          {
            "name": "opt-render-vectorization_6_voices",
            "value": 5582639,
            "range": "± 14594",
            "unit": "ns/iter"
          },
          {
            "name": "opt-render-vectorization_8_voices",
            "value": 6878439,
            "range": "± 37809",
            "unit": "ns/iter"
          },
          {
            "name": "opt-all-combined_3_voices",
            "value": 7287794,
            "range": "± 18652",
            "unit": "ns/iter"
          },
          {
            "name": "opt-all-combined_6_voices",
            "value": 9717969,
            "range": "± 42199",
            "unit": "ns/iter"
          },
          {
            "name": "opt-all-combined_8_voices",
            "value": 11104890,
            "range": "± 24209",
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
          "id": "59d922d644606ee590c1584f65bb270e2046a7b4",
          "message": "fix charts",
          "timestamp": "2026-05-17T12:41:03-04:00",
          "tree_id": "4e82d37f2af2ffdce934b8f5bad37b6635751bd6",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/59d922d644606ee590c1584f65bb270e2046a7b4"
        },
        "date": 1779036443031,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2939764,
            "range": "± 121812",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4465723,
            "range": "± 69390",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5510781,
            "range": "± 78998",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2492352,
            "range": "± 34652",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2840718,
            "range": "± 43524",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3122721,
            "range": "± 59292",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8406664,
            "range": "± 95473",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11266508,
            "range": "± 67512",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13206910,
            "range": "± 98212",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11347353,
            "range": "± 83112",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15784360,
            "range": "± 108929",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17466601,
            "range": "± 116538",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6878834,
            "range": "± 71699",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8958912,
            "range": "± 302276",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10063749,
            "range": "± 109785",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4012394,
            "range": "± 45632",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5509369,
            "range": "± 128082",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6504552,
            "range": "± 78921",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11953421,
            "range": "± 385872",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13561273,
            "range": "± 295616",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13696197,
            "range": "± 105917",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6149982,
            "range": "± 51040",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8143469,
            "range": "± 68658",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9415595,
            "range": "± 63964",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3661158,
            "range": "± 48541",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5534919,
            "range": "± 143899",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6888740,
            "range": "± 72330",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3556550,
            "range": "± 43149",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5531328,
            "range": "± 62119",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6851913,
            "range": "± 54730",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7436006,
            "range": "± 70161",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10018508,
            "range": "± 248933",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11472806,
            "range": "± 210139",
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
          "id": "828c25f86a4bff5bc23fc89c96e31ae921e56667",
          "message": "chore: migrate from nih-plug to truce (#185)\n\n* feat: migrate from nih-plug to truce.audio (CLAP/VST3)\n\nRewrite lib.rs with truce #[derive(Params)] for\n26 DAW-automatable FloatParams and PluginLogic trait\nimpl. Rewrite gui.rs with truce Editor trait keeping\nwry WebView. Update Cargo.toml deps. Remove dead code.\nAll 14 tests pass, 0 warnings.\n\n* chore: clean up build scripts after nih-plug -> truce migration\n\nRemove macOS AUv3 Xcode build path from build-plugin-auv3.mjs\n(keep iOS XCFramework for iPad). Fix stale nih-plug reference\nin build-plugin.sh.\n\n* add tests\n\n* Add truce-shim-types crate for shared C header types\n\n- Introduced a new crate `truce-shim-types` to provide shared C header types for the truce AU shim.\n- Added `Cargo.toml` to define the package metadata and dependencies.\n- Created `README.md` to document the purpose and usage of the crate.\n- Implemented `build.rs` to manage header file changes and trigger rebuilds.\n- Added `include/au_shim_types.h` to define the necessary C types for interoperability between Rust and Objective-C/C.\n- Developed `src/lib.rs` to expose the C header as an embedded string and provide a function to retrieve the include directory.\n\n* feat: update libloading dependency to version 0.9.0 and add meter slots to CzPluginParams\n\n* cleanup, remove vendored wry\n\n* lint\n\n* fix tests\n\n* refactor: simplify voice filtering logic in CosmoPd101FfiEngine and CzPlugin\nfeat: implement standalone window handling in macOS GUI\ntest: format workletNodeRef assignment in useNoteHandling tests for consistency\n\n* refactor: remove unsafe blocks in screenshot_webview_impl for improved safety\n\n* feat: initialize last_scope_hz to 220.0 and update logic for hz assignment in CosmoPd101FfiEngine and CzPlugin\n\n* lint\n\n* fix build\n\n* fix: create ar-wrapper to handle BSD ar compatibility and suppress warnings\n\n* fix: update plugin bundle paths and improve validation in workflows\n\n* cleanup docs\n\n* window",
          "timestamp": "2026-05-17T17:13:13Z",
          "tree_id": "c05c5053b14f6c8914457d31486e9b0b1d832832",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/828c25f86a4bff5bc23fc89c96e31ae921e56667"
        },
        "date": 1779038395726,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2923434,
            "range": "± 121193",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4431212,
            "range": "± 28249",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5483682,
            "range": "± 47049",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2457680,
            "range": "± 25864",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2797680,
            "range": "± 11328",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3065982,
            "range": "± 61285",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8321193,
            "range": "± 120885",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11215252,
            "range": "± 55749",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13199138,
            "range": "± 235945",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11319569,
            "range": "± 63341",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15827958,
            "range": "± 59852",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17505856,
            "range": "± 67158",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6845164,
            "range": "± 67945",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8918898,
            "range": "± 220371",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9963886,
            "range": "± 31737",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3942047,
            "range": "± 22330",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5426586,
            "range": "± 28655",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6481272,
            "range": "± 103943",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11955744,
            "range": "± 74237",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13554302,
            "range": "± 62363",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13733354,
            "range": "± 43108",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6242210,
            "range": "± 72435",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8198870,
            "range": "± 149459",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9381638,
            "range": "± 107717",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3641154,
            "range": "± 75389",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5565040,
            "range": "± 36886",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6913519,
            "range": "± 49734",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3522995,
            "range": "± 57861",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5482325,
            "range": "± 62953",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6796163,
            "range": "± 75303",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7415311,
            "range": "± 100052",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10028725,
            "range": "± 54452",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11337323,
            "range": "± 50923",
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
          "id": "6537d44cd20d1a204e0fdbbd4b27bf52b150d679",
          "message": "refactor: clean up synth UI and engine tests in cosmo-pd101 (#195)\n\nFix cosmo-pd101 tests and lint issues",
          "timestamp": "2026-05-17T23:55:40-04:00",
          "tree_id": "72ed22de27b170c945a185f94aa03de30c7ea793",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/6537d44cd20d1a204e0fdbbd4b27bf52b150d679"
        },
        "date": 1779076932889,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2968385,
            "range": "± 85978",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4683264,
            "range": "± 23529",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5772672,
            "range": "± 23606",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2331526,
            "range": "± 16779",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2769590,
            "range": "± 6152",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2970388,
            "range": "± 4923",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8183299,
            "range": "± 127782",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10780816,
            "range": "± 35907",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12614379,
            "range": "± 65815",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11216301,
            "range": "± 24645",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15596306,
            "range": "± 41782",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17275780,
            "range": "± 123602",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6904803,
            "range": "± 14816",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9026395,
            "range": "± 35442",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10225824,
            "range": "± 57671",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3860443,
            "range": "± 29482",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5525301,
            "range": "± 17141",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6546536,
            "range": "± 105528",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11616855,
            "range": "± 34364",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13192801,
            "range": "± 24696",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13385572,
            "range": "± 471041",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6249750,
            "range": "± 31685",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8188007,
            "range": "± 45021",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9458639,
            "range": "± 30536",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3765629,
            "range": "± 21760",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5810733,
            "range": "± 171017",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7138500,
            "range": "± 62204",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3467438,
            "range": "± 16760",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5555250,
            "range": "± 44343",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6858899,
            "range": "± 13356",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7295551,
            "range": "± 33161",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9701446,
            "range": "± 42688",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11096554,
            "range": "± 37565",
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
          "id": "7c51a5c48c3e5423a55c4b5058d0a3001c104376",
          "message": "chore(rust): migrate workspace to edition 2024 (#196)\n\n* chore(rust): migrate workspace to edition 2024\n\n- Bump edition from 2021 to 2024 in all workspace Cargo.toml files\n- cargo fix --edition auto-fixes: #[unsafe(no_mangle)], unsafe_op_in_unsafe_fn,\n  gen→r#gen keyword, expr→expr_2021 fragment specifier\n- Manual fix: replace static mut with OnceLock in terminate_delegate_class()\n- All 70 tests pass, build is warning-free\n\n* refactor(rust): adopt edition 2024 features — if let chains, collapsible ifs, clippy fixes\n\n- Converted 12 nested `if let` / `if` + `if let` patterns to `&& let` chains\n- Hoisted repeated `if let Some(proc)` checks outside match in MIDI handler\n- Fixed `let_and_return` and `explicit_auto_deref` clippy warnings\n- Applied edition 2024 rustfmt (import ordering, brace style, unsafe block wrapping)\n\n* fix(build): wrap unsafe intrinsics in unsafe blocks for edition 2024\n\n- Added unsafe blocks inside unsafe fn bodies in simd/sse2.rs, simd/avx2.rs, simd/wasm_simd.rs\n- Marked extern block in gui.rs as unsafe extern\n- Suppressed unused variable warning for parent on non-macOS",
          "timestamp": "2026-05-18T04:34:00Z",
          "tree_id": "ec6317d9fdc37d0da803a88a02fd5f5604125180",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/7c51a5c48c3e5423a55c4b5058d0a3001c104376"
        },
        "date": 1779079245432,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3289079,
            "range": "± 167975",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4852462,
            "range": "± 263922",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5989369,
            "range": "± 370890",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2686154,
            "range": "± 112545",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3050538,
            "range": "± 92681",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3343577,
            "range": "± 93897",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9255107,
            "range": "± 188683",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12834954,
            "range": "± 305707",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15188093,
            "range": "± 372664",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12096693,
            "range": "± 57313",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17304085,
            "range": "± 133956",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19258516,
            "range": "± 146948",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7124415,
            "range": "± 205284",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9488389,
            "range": "± 382001",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10881679,
            "range": "± 569901",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4374430,
            "range": "± 138834",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5969397,
            "range": "± 298931",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7093817,
            "range": "± 410084",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 13644827,
            "range": "± 544024",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 15831977,
            "range": "± 768097",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 16204652,
            "range": "± 923223",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6185378,
            "range": "± 59450",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8143068,
            "range": "± 103355",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9411234,
            "range": "± 86733",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3814906,
            "range": "± 129389",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6032033,
            "range": "± 334561",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7592314,
            "range": "± 325754",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4390592,
            "range": "± 132019",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7118845,
            "range": "± 143170",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 8898701,
            "range": "± 185822",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7883027,
            "range": "± 165269",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10764726,
            "range": "± 253090",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12422357,
            "range": "± 327186",
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
          "id": "785e48c77bda2770610e3889ace76baa4ccb63b1",
          "message": "feat: Add tempo and LFO sync features to synth engine (#204)\n\n* feat: Add tempo and LFO sync features to synth engine\n\n- Introduced `tempoBpm` parameter to control manual tempo for BPM-synced modulation.\n- Added `LfoRateMode` and `LfoSyncDivision` types to manage LFO rate modes and sync divisions.\n- Updated `SynthState` and `SynthActions` to include tempo and LFO settings.\n- Enhanced `CosmoProcessor` to handle host transport timing for LFO synchronization.\n- Implemented tests to verify LFO behavior with manual and host transport tempos.\n- Updated UI metadata and localization for new parameters.\n\n* feat: Add factory preset count and parameters retrieval functions; refactor LFO module for cleaner code\n\n* linting\n\n* linting",
          "timestamp": "2026-05-18T13:09:42Z",
          "tree_id": "458526964a9118bab2a6a0659abd258bf29d91ac",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/785e48c77bda2770610e3889ace76baa4ccb63b1"
        },
        "date": 1779110171247,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2976841,
            "range": "± 147827",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4580753,
            "range": "± 15889",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5646471,
            "range": "± 35684",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2570744,
            "range": "± 14199",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2910453,
            "range": "± 22303",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3182685,
            "range": "± 26721",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8341465,
            "range": "± 50703",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11162132,
            "range": "± 66232",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13230324,
            "range": "± 93743",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11389598,
            "range": "± 65724",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16132459,
            "range": "± 267840",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17834217,
            "range": "± 138931",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6900761,
            "range": "± 49778",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8936528,
            "range": "± 133336",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10088919,
            "range": "± 127510",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3966958,
            "range": "± 29690",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5466314,
            "range": "± 69702",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6478115,
            "range": "± 54669",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11912363,
            "range": "± 22671",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13537390,
            "range": "± 224265",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13678203,
            "range": "± 59136",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6182801,
            "range": "± 20532",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8064618,
            "range": "± 38960",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9327426,
            "range": "± 31346",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3629769,
            "range": "± 14939",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5522253,
            "range": "± 35928",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6794629,
            "range": "± 22579",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3584599,
            "range": "± 13737",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5588503,
            "range": "± 34311",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6892396,
            "range": "± 27053",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7512206,
            "range": "± 36895",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10113215,
            "range": "± 67533",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11546504,
            "range": "± 201271",
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
          "id": "711a6e2c3ab699f29c47e78aff90ad0ec42c0e07",
          "message": "fix(engine): notes getting stuck with duplicate events (#203)\n\n* feat: Add tempo and LFO sync features to synth engine\n\n- Introduced `tempoBpm` parameter to control manual tempo for BPM-synced modulation.\n- Added `LfoRateMode` and `LfoSyncDivision` types to manage LFO rate modes and sync divisions.\n- Updated `SynthState` and `SynthActions` to include tempo and LFO settings.\n- Enhanced `CosmoProcessor` to handle host transport timing for LFO synchronization.\n- Implemented tests to verify LFO behavior with manual and host transport tempos.\n- Updated UI metadata and localization for new parameters.\n\n* feat: Add factory preset count and parameters retrieval functions; refactor LFO module for cleaner code\n\n* fix: enhance factory preset handling and MIDI event processing\n\n* fix: improve transport state handling and note processing in synthesizer\n\n* fix: remove unnecessary log statements and improve LFO module functionality\n\n* linting\n\n* linting",
          "timestamp": "2026-05-18T13:20:29Z",
          "tree_id": "99a7f91a79eeb2f3c0186b627d6fb61892eaa7d5",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/711a6e2c3ab699f29c47e78aff90ad0ec42c0e07"
        },
        "date": 1779110827137,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3000314,
            "range": "± 186256",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4541294,
            "range": "± 176606",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5717137,
            "range": "± 70324",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2531893,
            "range": "± 22491",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2888594,
            "range": "± 82507",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3177204,
            "range": "± 132211",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8584474,
            "range": "± 49951",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11342563,
            "range": "± 85473",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13313958,
            "range": "± 67364",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11585754,
            "range": "± 31510",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16054602,
            "range": "± 86773",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17719535,
            "range": "± 125582",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7034219,
            "range": "± 49946",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9074862,
            "range": "± 346874",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10212369,
            "range": "± 384809",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4040464,
            "range": "± 143022",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5628968,
            "range": "± 112197",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6611865,
            "range": "± 61962",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12075479,
            "range": "± 38139",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13643018,
            "range": "± 54809",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13687393,
            "range": "± 61578",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6318186,
            "range": "± 71066",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8233198,
            "range": "± 131683",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9560033,
            "range": "± 114174",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3759460,
            "range": "± 138700",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5605561,
            "range": "± 74102",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6909756,
            "range": "± 80881",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3539865,
            "range": "± 32188",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5505806,
            "range": "± 96182",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6823333,
            "range": "± 55298",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7457838,
            "range": "± 43034",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10015151,
            "range": "± 325536",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11408000,
            "range": "± 70969",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7a3c239bb37f85ad6d16833b26c1952bca0f0b26",
          "message": "chore(deps): update actions/cache action to v5 (#198)\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>",
          "timestamp": "2026-05-18T10:23:08-04:00",
          "tree_id": "4db7b830b238494584759907d2b020422b8756c5",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/7a3c239bb37f85ad6d16833b26c1952bca0f0b26"
        },
        "date": 1779114580698,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3036021,
            "range": "± 229095",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4643964,
            "range": "± 56704",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5671452,
            "range": "± 89803",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2511553,
            "range": "± 28981",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2888377,
            "range": "± 28153",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3160009,
            "range": "± 42429",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8620999,
            "range": "± 89997",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11378619,
            "range": "± 61830",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13381747,
            "range": "± 58093",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11566387,
            "range": "± 53676",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16084632,
            "range": "± 76506",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17882563,
            "range": "± 101576",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6948399,
            "range": "± 176584",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9007760,
            "range": "± 70324",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10214791,
            "range": "± 477184",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4067800,
            "range": "± 36284",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5671439,
            "range": "± 326303",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6692962,
            "range": "± 61579",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12050800,
            "range": "± 221578",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13560592,
            "range": "± 84037",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13742570,
            "range": "± 81374",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6336763,
            "range": "± 168851",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8267728,
            "range": "± 76706",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9668542,
            "range": "± 131158",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3745545,
            "range": "± 46288",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5690020,
            "range": "± 58203",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6974458,
            "range": "± 60266",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3605926,
            "range": "± 32370",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5574341,
            "range": "± 343401",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6879984,
            "range": "± 252708",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7462826,
            "range": "± 96341",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9997109,
            "range": "± 151462",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11349038,
            "range": "± 479846",
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
          "id": "a24fa5c20a8ac23c53b3b9ba530f2b70ee78f3e0",
          "message": "feat(synth): add 4 macro knobs with per-parameter modulation assignments (#199)\n\n* feat(synth): add 4 macro knobs with per-parameter modulation assignments\n\nAdds 4 Arturia-style macro knobs (macro1-4, 0-1 range) to the synth panel, positioned above the mini keyboard on the left side.\n\nEach macro knob supports N parameter assignments with per-depth control:\n- MacroAssignment model (macroIndex, destination ModDestination, depth, enabled)\n- Macro contributions computed in getModulatedValue() alongside existing modulation\n- MacroAssignEditor popover for managing assignments per macro\n- Preset serialization/deserialization via gatherState/applyPreset\n\nNo Rust/engine changes required — macros are purely frontend, values flow through existing snapshot pipeline.\n\n* refactor(synth): move macro knobs to engine ModSource, remove frontend assignment model\n\nMacro1-4 are now first-class ModSource variants in the Rust engine,\nso they route through the existing mod matrix. Removes the frontend\nMacroAssignment model and MacroAssignEditor. Macros are set via\ndedicated IPC/WASM calls following the modWheel/aftertouch pattern.\n\n* feat(synth): implement macro knob functionality and UI integration\n\n* fix build\n\n* feat(synth): enhance modulation routing and optimize ModMatrixCache\n\n* linting",
          "timestamp": "2026-05-18T11:54:03-04:00",
          "tree_id": "26920cc3e4d662bd127b57e2a65aef7030b975ba",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/a24fa5c20a8ac23c53b3b9ba530f2b70ee78f3e0"
        },
        "date": 1779120035615,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2815314,
            "range": "± 111163",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4349670,
            "range": "± 41671",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5424305,
            "range": "± 43170",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2327318,
            "range": "± 6973",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2669472,
            "range": "± 16242",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2882323,
            "range": "± 10672",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8860777,
            "range": "± 85958",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11585877,
            "range": "± 56360",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13477197,
            "range": "± 52656",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11937460,
            "range": "± 50973",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16520537,
            "range": "± 61744",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18219497,
            "range": "± 57827",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7181267,
            "range": "± 102328",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9307684,
            "range": "± 54025",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10443915,
            "range": "± 218040",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4053706,
            "range": "± 10045",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5505683,
            "range": "± 45757",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6492831,
            "range": "± 36498",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12118082,
            "range": "± 132246",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13684504,
            "range": "± 61644",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13828026,
            "range": "± 85233",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6396969,
            "range": "± 26395",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8278894,
            "range": "± 54434",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9529941,
            "range": "± 190148",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3471129,
            "range": "± 13154",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5396292,
            "range": "± 33149",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6692431,
            "range": "± 36218",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3398006,
            "range": "± 14344",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5330620,
            "range": "± 34037",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6642046,
            "range": "± 80214",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7685129,
            "range": "± 46235",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10245725,
            "range": "± 71448",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11570531,
            "range": "± 65609",
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
          "id": "2fc58fb5b5d8e78173d4f2003c1d2520aeb9a80d",
          "message": "refactor: move macros to side panel and use modals for settings instead (#205)\n\n* refactor(synth): move macro knobs to engine ModSource, remove frontend assignment model\n\nMacro1-4 are now first-class ModSource variants in the Rust engine,\nso they route through the existing mod matrix. Removes the frontend\nMacroAssignment model and MacroAssignEditor. Macros are set via\ndedicated IPC/WASM calls following the modWheel/aftertouch pattern.\n\n* feat(synth): enhance modulation routing and optimize ModMatrixCache\n\n* Refactor synth UI components and state management\n\n- Removed AsidePanelTab type and related state from synthUiStore.\n- Simplified GlobalVoicePanel and MacroKnobsPanel components.\n- Introduced SynthSidebar for managing global settings and macro label editing.\n- Added GlobalVoiceModal and MacroLabelEditorModal for better UI handling.\n- Updated SynthRenderer to integrate new sidebar and modal components.\n- Adjusted tests to reflect changes in state management and component structure.\n- Cleaned up unused imports and code related to aside panel management.\n\n* cleanup\n\n* cleanup\n\n* refactor(synth): streamline macro label handling and enhance state management\n\n* feat(synth): enhance MacroKnobsPanel styling and integrate macroLabels into synthStore",
          "timestamp": "2026-05-18T14:02:58-04:00",
          "tree_id": "f1e727a747d6fa173385e6cb74db9c47317c9621",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/2fc58fb5b5d8e78173d4f2003c1d2520aeb9a80d"
        },
        "date": 1779127770806,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2933439,
            "range": "± 42893",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4506488,
            "range": "± 74181",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5600830,
            "range": "± 88026",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2568960,
            "range": "± 31921",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2888150,
            "range": "± 27447",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3173326,
            "range": "± 56857",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8309731,
            "range": "± 82752",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11268674,
            "range": "± 162097",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13297005,
            "range": "± 127214",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11412141,
            "range": "± 40320",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15893299,
            "range": "± 381365",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17544115,
            "range": "± 146924",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7088511,
            "range": "± 40935",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9026360,
            "range": "± 73583",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9978422,
            "range": "± 57992",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3965477,
            "range": "± 25319",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5474849,
            "range": "± 46053",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6513640,
            "range": "± 133158",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11961390,
            "range": "± 249651",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13500075,
            "range": "± 125272",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13692976,
            "range": "± 86859",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6184593,
            "range": "± 36562",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8035630,
            "range": "± 26802",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9320707,
            "range": "± 164120",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3536541,
            "range": "± 19083",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5397955,
            "range": "± 88043",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6667281,
            "range": "± 23127",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3629712,
            "range": "± 17719",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5705162,
            "range": "± 38795",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7091880,
            "range": "± 45742",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7425865,
            "range": "± 62789",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9956624,
            "range": "± 157657",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11406957,
            "range": "± 31730",
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
          "id": "2ed399beeecb6992a1fc0af021406a7c6928de3c",
          "message": "chore: update workflows to build and validate plugins, add validation… (#206)\n\n* chore: update workflows to build and validate plugins, add validation steps and improve caching\n\n* chore: streamline installation of clap-validator and pluginval in workflows\n\n* chore: remove clap-validator installation from workflows and update plugin validation steps\n\n* chore: remove clap option from validation scripts in package.json\n\n* chore: add validate-plugins action and update CI workflows for plugin validation\n\n* chore: update CI and release workflows to remove macOS builds and adjust plugin build scripts",
          "timestamp": "2026-05-18T23:59:12Z",
          "tree_id": "2970131fa1c0afda4928937d3700b83b452e9c52",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/2ed399beeecb6992a1fc0af021406a7c6928de3c"
        },
        "date": 1779149140598,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2959155,
            "range": "± 140103",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4535432,
            "range": "± 21299",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5587599,
            "range": "± 37714",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2465504,
            "range": "± 25689",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2812919,
            "range": "± 17433",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3088364,
            "range": "± 23130",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8332147,
            "range": "± 65245",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11173287,
            "range": "± 58479",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13103710,
            "range": "± 63570",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11263828,
            "range": "± 56309",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15726610,
            "range": "± 107435",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17397675,
            "range": "± 108395",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6882509,
            "range": "± 74039",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8967623,
            "range": "± 59475",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10105087,
            "range": "± 73691",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3997552,
            "range": "± 24884",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5538740,
            "range": "± 32345",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6583526,
            "range": "± 45459",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11856195,
            "range": "± 66583",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13457316,
            "range": "± 63735",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13609887,
            "range": "± 171898",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6234188,
            "range": "± 22955",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8151956,
            "range": "± 44925",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9455106,
            "range": "± 63901",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3567044,
            "range": "± 29042",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5524121,
            "range": "± 24454",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6843356,
            "range": "± 202674",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3570915,
            "range": "± 19561",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5553395,
            "range": "± 38313",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6864579,
            "range": "± 45124",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7424610,
            "range": "± 37571",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9989243,
            "range": "± 40141",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11432559,
            "range": "± 49386",
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
          "id": "7ad34d2b7dda44e586beee06937666f59562e0d9",
          "message": "feat(synth): add MIDI learn with CC mapping and aside panel (#200)\n\n* chore(rust): migrate workspace to edition 2024\n\n- Bump edition from 2021 to 2024 in all workspace Cargo.toml files\n- cargo fix --edition auto-fixes: #[unsafe(no_mangle)], unsafe_op_in_unsafe_fn,\n  gen→r#gen keyword, expr→expr_2021 fragment specifier\n- Manual fix: replace static mut with OnceLock in terminate_delegate_class()\n- All 70 tests pass, build is warning-free\n\n* feat(synth): add MIDI learn with CC mapping and aside panel\n\nMap arbitrary MIDI CCs to any synth parameter via a MIDI Learn aside panel. Right-click bound controls to unlearn. Works in both standalone (Web MIDI API) and plugin (DAW host MIDI via Rust ArrayQueue + idle() eval) runtimes.\n\n- Add midiLearnStore (Zustand + localStorage persist)\n- Add useMidiLearnBindings hook (cz-midi-cc CustomEvent listener)\n- Add MidiLearnPanel with Learn toggle and status\n- Wire SynthParamKnob context menu and learn click\n- Forward all CCs in Rust lib.rs MidiCcQueue and gui.rs idle handler\n- Bridge handlers for nih-plug and AUv3\n\n* Refactor SynthPanelContainer and SynthSidebar components; add MIDI Learn functionality\n\n- Removed unused className prop from SynthPanelContainer.\n- Simplified layout in SynthPanelContainer.\n- Integrated AnimatePresence and motion for MIDI Learn panel in SynthSidebar.\n- Updated SynthSidebarButtons to handle MIDI Learn toggle.\n- Enhanced tests for SynthSidebarButtons to cover MIDI Learn interactions.\n- Refactored MidiLearnPanel to improve binding management and UI.\n- Updated useMidiLearnStore to support multiple MIDI bindings per parameter.\n- Adjusted SynthRenderer to manage MIDI Learn state.\n- Improved MIDI binding logic in useMidiLearnBindings.\n- Cleaned up Rust code for better readability and performance.\n\n* refactor(MidiLearnPanel): remove unused className prop and simplify component structure\n\n* feat: implement MIDI learn functionality across various components\n\n- Added `sectionId` prop to `AlgoControlItem`, `AlgoControlNumber`, `AlgoControlsGroup`, and `AlgoSectionCard` for better control organization.\n- Integrated MIDI learn capabilities in `AlgoControlNumber`, `KnobControl`, `LfoModule`, `ModEnveloppeModule`, and various custom module renderers (Delay, PhaseMod, Tremolo, Vibrato).\n- Created `useMidiLearnTarget` hook to manage MIDI learn state and interactions.\n- Established a registry for MIDI learn targets to facilitate dynamic binding and application of MIDI control changes.\n- Enhanced `MidiLearnPanel` and `MidiLearnStore` to support new MIDI learn functionalities and improve binding management.\n\n* refactor(AlgoControlsGroup): make sectionId optional and set default value\nrefactor(useMidiLearnTarget): define MidiLearnVisualState type and annotate midiLearnState\n\n* fix(AlgoControlNumber): resolve sectionId handling for MIDI learn target key",
          "timestamp": "2026-05-18T20:11:18-04:00",
          "tree_id": "2eea76380a5607b21ba3aa1566d2faa1d9ed0f3b",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/7ad34d2b7dda44e586beee06937666f59562e0d9"
        },
        "date": 1779149869617,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3038717,
            "range": "± 32865",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4906686,
            "range": "± 34939",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6100079,
            "range": "± 20939",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2468576,
            "range": "± 83125",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2922411,
            "range": "± 28390",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3085854,
            "range": "± 41411",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8351214,
            "range": "± 145429",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10976880,
            "range": "± 44350",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12732085,
            "range": "± 60841",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11186859,
            "range": "± 62138",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15633647,
            "range": "± 54750",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17373285,
            "range": "± 72515",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6997650,
            "range": "± 81099",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9152406,
            "range": "± 24328",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10383596,
            "range": "± 29937",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3966812,
            "range": "± 18129",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5685778,
            "range": "± 23311",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6762761,
            "range": "± 29228",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11706592,
            "range": "± 33417",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13330699,
            "range": "± 30844",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13541214,
            "range": "± 31717",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6263012,
            "range": "± 23390",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8276007,
            "range": "± 212273",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9638495,
            "range": "± 49064",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3632230,
            "range": "± 26086",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5773299,
            "range": "± 27798",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7163348,
            "range": "± 28382",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3639179,
            "range": "± 21493",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5898735,
            "range": "± 40916",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7319188,
            "range": "± 39623",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7435984,
            "range": "± 30003",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9827326,
            "range": "± 73834",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11379996,
            "range": "± 46553",
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
          "id": "321b75ceeaccc29f093af7f332acd36a3d50d8bb",
          "message": "feat(gumroad): enhance file upload process with multipart support and error handling",
          "timestamp": "2026-05-18T20:41:06-04:00",
          "tree_id": "b56487d06a1d858569701d38cdff49a4bc5628e2",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/321b75ceeaccc29f093af7f332acd36a3d50d8bb"
        },
        "date": 1779151662828,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2327948,
            "range": "± 47223",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 3689554,
            "range": "± 90239",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 4500264,
            "range": "± 34029",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 1860811,
            "range": "± 18669",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2169033,
            "range": "± 5445",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2354416,
            "range": "± 6238",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 6479473,
            "range": "± 19085",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 8509963,
            "range": "± 22747",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 9959971,
            "range": "± 287154",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 8797281,
            "range": "± 190059",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 12223135,
            "range": "± 31392",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 13555116,
            "range": "± 19708",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 5484079,
            "range": "± 12920",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 7110129,
            "range": "± 18177",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 8048887,
            "range": "± 185296",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3059859,
            "range": "± 13858",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 4326491,
            "range": "± 27716",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 5126211,
            "range": "± 15717",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9166704,
            "range": "± 34484",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 10406145,
            "range": "± 214948",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 10563906,
            "range": "± 40066",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 4945820,
            "range": "± 98627",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 6431293,
            "range": "± 68357",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 7460445,
            "range": "± 22632",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 2816419,
            "range": "± 12242",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 4399764,
            "range": "± 15873",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 5472532,
            "range": "± 19152",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 2830677,
            "range": "± 10776",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 4457671,
            "range": "± 25613",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 5542237,
            "range": "± 143614",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 5769232,
            "range": "± 57283",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 7638524,
            "range": "± 23867",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 8762320,
            "range": "± 86379",
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
          "id": "fa85bc78a4d30360dd8713e9569daecbb5a25974",
          "message": "fix(release): use Gumroad multipart upload and attach flow",
          "timestamp": "2026-05-18T21:11:19-04:00",
          "tree_id": "3aaaa3c06d27865c4bab61dfdd3edebf8e364316",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/fa85bc78a4d30360dd8713e9569daecbb5a25974"
        },
        "date": 1779153486272,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2899002,
            "range": "± 113248",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4432432,
            "range": "± 88170",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5473240,
            "range": "± 78789",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2462961,
            "range": "± 91665",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2810201,
            "range": "± 64742",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3107438,
            "range": "± 73925",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8287699,
            "range": "± 55619",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11078278,
            "range": "± 45200",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12986136,
            "range": "± 182576",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11158463,
            "range": "± 53351",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15655765,
            "range": "± 85179",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17230788,
            "range": "± 74491",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6795961,
            "range": "± 182270",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8825440,
            "range": "± 34259",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9933435,
            "range": "± 255129",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3944386,
            "range": "± 21428",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5443756,
            "range": "± 27173",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6454920,
            "range": "± 20651",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11728219,
            "range": "± 173355",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13297671,
            "range": "± 85385",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13440272,
            "range": "± 30467",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6170140,
            "range": "± 11659",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8036054,
            "range": "± 36890",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9289695,
            "range": "± 18956",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3502925,
            "range": "± 12710",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5386239,
            "range": "± 11398",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6693044,
            "range": "± 95093",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3527237,
            "range": "± 21951",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5478858,
            "range": "± 24703",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6778026,
            "range": "± 34329",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7388585,
            "range": "± 93785",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9970875,
            "range": "± 57758",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11372567,
            "range": "± 37978",
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
          "id": "fa85bc78a4d30360dd8713e9569daecbb5a25974",
          "message": "fix(release): use Gumroad multipart upload and attach flow",
          "timestamp": "2026-05-18T21:11:19-04:00",
          "tree_id": "3aaaa3c06d27865c4bab61dfdd3edebf8e364316",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/fa85bc78a4d30360dd8713e9569daecbb5a25974"
        },
        "date": 1779188855981,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3034633,
            "range": "± 128707",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4719140,
            "range": "± 93038",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5857574,
            "range": "± 99175",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2381383,
            "range": "± 28587",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2813415,
            "range": "± 71260",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3034514,
            "range": "± 18725",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8286756,
            "range": "± 185684",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10868335,
            "range": "± 36614",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12742351,
            "range": "± 436575",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11256993,
            "range": "± 69369",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15629466,
            "range": "± 142397",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17363417,
            "range": "± 55691",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7005640,
            "range": "± 69394",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9135344,
            "range": "± 279456",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10298574,
            "range": "± 65516",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3967693,
            "range": "± 28829",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5599375,
            "range": "± 113149",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6637391,
            "range": "± 247744",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11716449,
            "range": "± 198571",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13316199,
            "range": "± 72311",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13532865,
            "range": "± 67855",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6258142,
            "range": "± 45344",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8191885,
            "range": "± 53951",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9538539,
            "range": "± 260980",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3629661,
            "range": "± 33229",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5701196,
            "range": "± 43670",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7066340,
            "range": "± 40221",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3652619,
            "range": "± 66986",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5786879,
            "range": "± 42364",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7121758,
            "range": "± 124210",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7339808,
            "range": "± 38411",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9767436,
            "range": "± 253192",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11176744,
            "range": "± 54259",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b632126a37568911a6e47903b56bab55147b160a",
          "message": "chore(deps): update dorny/paths-filter action to v4 (#202)\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>",
          "timestamp": "2026-05-19T07:04:50-04:00",
          "tree_id": "4d1eab724ec4121f9638cd2da541e095eb557175",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/b632126a37568911a6e47903b56bab55147b160a"
        },
        "date": 1779189081907,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2772983,
            "range": "± 33262",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4310635,
            "range": "± 108310",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5365496,
            "range": "± 27407",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2321768,
            "range": "± 5546",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2664789,
            "range": "± 5932",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2873887,
            "range": "± 9418",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8774572,
            "range": "± 113664",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11528223,
            "range": "± 44263",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13381635,
            "range": "± 97165",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11822144,
            "range": "± 198774",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16396412,
            "range": "± 55816",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18113653,
            "range": "± 68809",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7135557,
            "range": "± 50044",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9208824,
            "range": "± 57053",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10403681,
            "range": "± 163074",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4030428,
            "range": "± 16126",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5459096,
            "range": "± 22948",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6427628,
            "range": "± 24767",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12109404,
            "range": "± 130584",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13647827,
            "range": "± 96513",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13741996,
            "range": "± 72389",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6390091,
            "range": "± 41768",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8235211,
            "range": "± 36100",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9423085,
            "range": "± 54856",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3446038,
            "range": "± 14523",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5374984,
            "range": "± 18874",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6649673,
            "range": "± 62875",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3364683,
            "range": "± 5406",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5277520,
            "range": "± 17614",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6544028,
            "range": "± 29473",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7620710,
            "range": "± 30300",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10119194,
            "range": "± 45433",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11497499,
            "range": "± 64140",
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
          "id": "5bf4c4d84b5a1f0fb61552093f8e0a4d6ba0272a",
          "message": "fix(release): validate Gumroad API success responses",
          "timestamp": "2026-05-19T07:26:05-04:00",
          "tree_id": "4e2763730b77db574e3a5db3f55706134dd9d5d7",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/5bf4c4d84b5a1f0fb61552093f8e0a4d6ba0272a"
        },
        "date": 1779190882027,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2932581,
            "range": "± 77762",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4450577,
            "range": "± 22454",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5495819,
            "range": "± 240289",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2533148,
            "range": "± 18764",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2868601,
            "range": "± 69850",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3143745,
            "range": "± 28668",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8306376,
            "range": "± 49184",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11083035,
            "range": "± 43758",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12999682,
            "range": "± 41825",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11171943,
            "range": "± 40777",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15608484,
            "range": "± 95962",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17240641,
            "range": "± 75905",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6804097,
            "range": "± 217741",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8831127,
            "range": "± 18119",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9945388,
            "range": "± 169826",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3940162,
            "range": "± 8874",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5435199,
            "range": "± 21497",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6443847,
            "range": "± 36421",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11714218,
            "range": "± 70637",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13286282,
            "range": "± 562641",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13423583,
            "range": "± 30464",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6162008,
            "range": "± 104382",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8035589,
            "range": "± 36178",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9301180,
            "range": "± 74539",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3584403,
            "range": "± 22208",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5447813,
            "range": "± 18991",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6754369,
            "range": "± 24051",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3650129,
            "range": "± 22420",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5699463,
            "range": "± 17127",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7123281,
            "range": "± 48542",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7401350,
            "range": "± 234726",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9947210,
            "range": "± 212209",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11384507,
            "range": "± 68811",
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
          "id": "8a8365e89215d07819a071b6661acd00d9306691",
          "message": "feat: add factory CZ presets and preset identity management (#207)\n\n* feat: add factory CZ presets and preset identity management\n\n- Introduced factory CZ presets in `factoryCzPresets.ts` using definitions from `factoryCzPresetDefinitions`.\n- Created `presetIdentity.ts` for managing preset identities, including ID creation and normalization of preset data.\n- Added `presetSources.ts` to define preset sources and their labels.\n- Updated `presetStorage.ts` to support new stored preset structure, including favorites management.\n- Enhanced `presetStorage.test.ts` with tests for new functionalities and refactored existing tests for clarity.\n- Implemented `presetTags.ts` for managing and normalizing preset tags.\n- Modified `presetTypes.ts` to include new types for frontend presets and metadata.\n\n* Refactor preset storage to use IndexedDB for better performance and reliability\n\n- Updated preset storage functions to utilize IndexedDB instead of localStorage.\n- Implemented asynchronous operations for saving, loading, and deleting presets.\n- Added functions to manage favorites and current state using IndexedDB.\n- Modified tests to accommodate the new storage mechanism and ensure proper functionality.\n- Removed legacy localStorage code and replaced it with IndexedDB interactions.\n- Updated documentation to reflect changes in preset management and storage.",
          "timestamp": "2026-05-19T15:24:09Z",
          "tree_id": "23eb7f1e4a29264f137a1d8729721d536e65a5ac",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/8a8365e89215d07819a071b6661acd00d9306691"
        },
        "date": 1779204642539,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2992840,
            "range": "± 191228",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4489962,
            "range": "± 66517",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5496719,
            "range": "± 107421",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2551416,
            "range": "± 26487",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2866935,
            "range": "± 29347",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3162338,
            "range": "± 20782",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8340613,
            "range": "± 87545",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11157847,
            "range": "± 90467",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13204829,
            "range": "± 115241",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11249236,
            "range": "± 95328",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15897157,
            "range": "± 120624",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17589382,
            "range": "± 129623",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7163410,
            "range": "± 145114",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9210430,
            "range": "± 66600",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10299612,
            "range": "± 193623",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4083937,
            "range": "± 40988",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5568920,
            "range": "± 38829",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6647543,
            "range": "± 96371",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12041428,
            "range": "± 57606",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13613540,
            "range": "± 73339",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13764260,
            "range": "± 79875",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6415457,
            "range": "± 68808",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8292636,
            "range": "± 79970",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9556695,
            "range": "± 93673",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3588888,
            "range": "± 54615",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5476573,
            "range": "± 74445",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6811362,
            "range": "± 83291",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3742757,
            "range": "± 86129",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5802982,
            "range": "± 70966",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7239992,
            "range": "± 149896",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7699357,
            "range": "± 114718",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10248249,
            "range": "± 81130",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11666354,
            "range": "± 85683",
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
          "id": "9a8e911c29cdd6172a0490dae807a0d5cc4a6fc8",
          "message": "feat: add version bump and release scripts for automated version management (#208)\n\n* feat: add factory CZ presets and preset identity management\n\n- Introduced factory CZ presets in `factoryCzPresets.ts` using definitions from `factoryCzPresetDefinitions`.\n- Created `presetIdentity.ts` for managing preset identities, including ID creation and normalization of preset data.\n- Added `presetSources.ts` to define preset sources and their labels.\n- Updated `presetStorage.ts` to support new stored preset structure, including favorites management.\n- Enhanced `presetStorage.test.ts` with tests for new functionalities and refactored existing tests for clarity.\n- Implemented `presetTags.ts` for managing and normalizing preset tags.\n- Modified `presetTypes.ts` to include new types for frontend presets and metadata.\n\n* Refactor preset storage to use IndexedDB for better performance and reliability\n\n- Updated preset storage functions to utilize IndexedDB instead of localStorage.\n- Implemented asynchronous operations for saving, loading, and deleting presets.\n- Added functions to manage favorites and current state using IndexedDB.\n- Modified tests to accommodate the new storage mechanism and ensure proper functionality.\n- Removed legacy localStorage code and replaced it with IndexedDB interactions.\n- Updated documentation to reflect changes in preset management and storage.\n\n* feat: add version bump and release scripts for automated version management",
          "timestamp": "2026-05-19T15:44:39Z",
          "tree_id": "49540fddf8a20681953ba1d9c2da88627cbd4ede",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/9a8e911c29cdd6172a0490dae807a0d5cc4a6fc8"
        },
        "date": 1779205862205,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3047234,
            "range": "± 287867",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4606797,
            "range": "± 122636",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5713250,
            "range": "± 186529",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2565955,
            "range": "± 61886",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2876375,
            "range": "± 19056",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3143973,
            "range": "± 127439",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8519529,
            "range": "± 224534",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11264973,
            "range": "± 79280",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13349536,
            "range": "± 96033",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11246066,
            "range": "± 282204",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15900338,
            "range": "± 93324",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17467121,
            "range": "± 576636",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6938558,
            "range": "± 92672",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9048826,
            "range": "± 294126",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10189065,
            "range": "± 159444",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4061147,
            "range": "± 56369",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5618769,
            "range": "± 82491",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6627496,
            "range": "± 304481",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11914749,
            "range": "± 287566",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13458512,
            "range": "± 200541",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13646527,
            "range": "± 386818",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6245849,
            "range": "± 90188",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8190160,
            "range": "± 136186",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9458631,
            "range": "± 130200",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3597532,
            "range": "± 174171",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5569090,
            "range": "± 267495",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6848544,
            "range": "± 256657",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3736992,
            "range": "± 77827",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5856912,
            "range": "± 101462",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7254614,
            "range": "± 114835",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7543314,
            "range": "± 72441",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10175735,
            "range": "± 111965",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11641895,
            "range": "± 260889",
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
          "id": "bf283ea9bb3670d29883bcc73b0431ad344f10b4",
          "message": "feat: enhance mini keyboard functionality (#209)\n\n* feat: add factory CZ presets and preset identity management\n\n- Introduced factory CZ presets in `factoryCzPresets.ts` using definitions from `factoryCzPresetDefinitions`.\n- Created `presetIdentity.ts` for managing preset identities, including ID creation and normalization of preset data.\n- Added `presetSources.ts` to define preset sources and their labels.\n- Updated `presetStorage.ts` to support new stored preset structure, including favorites management.\n- Enhanced `presetStorage.test.ts` with tests for new functionalities and refactored existing tests for clarity.\n- Implemented `presetTags.ts` for managing and normalizing preset tags.\n- Modified `presetTypes.ts` to include new types for frontend presets and metadata.\n\n* Refactor preset storage to use IndexedDB for better performance and reliability\n\n- Updated preset storage functions to utilize IndexedDB instead of localStorage.\n- Implemented asynchronous operations for saving, loading, and deleting presets.\n- Added functions to manage favorites and current state using IndexedDB.\n- Modified tests to accommodate the new storage mechanism and ensure proper functionality.\n- Removed legacy localStorage code and replaced it with IndexedDB interactions.\n- Updated documentation to reflect changes in preset management and storage.\n\n* feat: add version bump and release scripts for automated version management\n\n* feat: add react-icons and enhance keyboard functionality\n\n- Added `react-icons` dependency to the project.\n- Updated `SharedPhaseDistortionVisualizer` to include `sendAftertouch` in note handling.\n- Enhanced `MiniKeyboardOverlay` to support aftertouch functionality and keyboard settings.\n- Introduced `KeyboardSettingsModal` for configuring keyboard octaves, range, and input mode.\n- Updated `SynthInfoBar` to include a settings button for the keyboard.\n- Refactored `MacroKnobsPanel` and `PresetNavigator` to use icons from `react-icons`.\n- Modified `synthUiStore` to manage keyboard settings and input modes.\n\n* fix: remove unnecessary aftertouch handling in MiniKeyboardOverlay\n\n* feat: implement polyphonic aftertouch functionality across synthesizer components\n\n* feat: enhance MiniKeyboardOverlay with improved aftertouch handling and smooth release functionality\n\n* feat: add tests for MiniKeyboardOverlay and enhance synthStore mock with polyMode",
          "timestamp": "2026-05-19T14:39:34-04:00",
          "tree_id": "b6112a9cc8f90adee939575d460e2b42aedc166b",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/bf283ea9bb3670d29883bcc73b0431ad344f10b4"
        },
        "date": 1779216357891,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2934775,
            "range": "± 89779",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4492616,
            "range": "± 47994",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5537372,
            "range": "± 46990",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2524095,
            "range": "± 27711",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2856803,
            "range": "± 27305",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3100134,
            "range": "± 49777",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8346278,
            "range": "± 45274",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11179668,
            "range": "± 42385",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13048979,
            "range": "± 44683",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11245044,
            "range": "± 76305",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15765366,
            "range": "± 128639",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17458835,
            "range": "± 130571",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6889815,
            "range": "± 92475",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8944012,
            "range": "± 48929",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10123471,
            "range": "± 85597",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4018286,
            "range": "± 37033",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5535644,
            "range": "± 44185",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6595612,
            "range": "± 132417",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11900137,
            "range": "± 77972",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13546588,
            "range": "± 55382",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13710212,
            "range": "± 43227",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6395901,
            "range": "± 42941",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8180189,
            "range": "± 41413",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9381764,
            "range": "± 52734",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3512534,
            "range": "± 34694",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5443224,
            "range": "± 77365",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6754958,
            "range": "± 100695",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3565840,
            "range": "± 36578",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5635841,
            "range": "± 69326",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6907369,
            "range": "± 65823",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7578506,
            "range": "± 71694",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10230388,
            "range": "± 141095",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11667466,
            "range": "± 46887",
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
          "id": "c153e8987148498ced147ecf40dd87d94025502b",
          "message": "feat: small cleanup (#210)\n\n* feat: replace icon components with inline SVGs for previous and next presets\n\n* feat: improve modal presentation and accessibility in PendingModifiedPresetModal",
          "timestamp": "2026-05-19T15:16:53-04:00",
          "tree_id": "934e3cf9a89f6def06b7fae76dd29cec39fdf29b",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/c153e8987148498ced147ecf40dd87d94025502b"
        },
        "date": 1779218605261,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2785985,
            "range": "± 12937",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4328428,
            "range": "± 91241",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5387103,
            "range": "± 16397",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2309310,
            "range": "± 14614",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2658679,
            "range": "± 25443",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2879381,
            "range": "± 22144",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8885117,
            "range": "± 95848",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11650885,
            "range": "± 100136",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13457063,
            "range": "± 63306",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11833855,
            "range": "± 82892",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16378079,
            "range": "± 86822",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18156973,
            "range": "± 75971",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7157366,
            "range": "± 28252",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9228689,
            "range": "± 35191",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10371096,
            "range": "± 55888",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4042228,
            "range": "± 9649",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5466324,
            "range": "± 11545",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6428107,
            "range": "± 18250",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12041012,
            "range": "± 112326",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13620226,
            "range": "± 234336",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13794107,
            "range": "± 62629",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6389165,
            "range": "± 22496",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8188891,
            "range": "± 30223",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9346460,
            "range": "± 56088",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3489414,
            "range": "± 19057",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5413533,
            "range": "± 86489",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6752932,
            "range": "± 52790",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3383548,
            "range": "± 27010",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5294140,
            "range": "± 21521",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6558088,
            "range": "± 32121",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7634095,
            "range": "± 43087",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10106428,
            "range": "± 42845",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11520084,
            "range": "± 93354",
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
          "id": "78590e34174d232f782bef53246e6aca886eb521",
          "message": "fix(editor): keep inactive overlay below drawers",
          "timestamp": "2026-05-19T15:19:46-04:00",
          "tree_id": "f49bcd5ee88bdaf807739aa9d08d45896b6f36b6",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/78590e34174d232f782bef53246e6aca886eb521"
        },
        "date": 1779218844368,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2949040,
            "range": "± 119263",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4683199,
            "range": "± 77058",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5833350,
            "range": "± 97165",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2243293,
            "range": "± 61530",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2594678,
            "range": "± 20195",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2890976,
            "range": "± 61102",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8119858,
            "range": "± 55040",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10734178,
            "range": "± 35123",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12582101,
            "range": "± 325699",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11185660,
            "range": "± 237631",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15574173,
            "range": "± 795419",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17262729,
            "range": "± 83510",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6891136,
            "range": "± 144230",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9048236,
            "range": "± 221118",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10343872,
            "range": "± 80493",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3843226,
            "range": "± 16801",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5505061,
            "range": "± 23118",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6609561,
            "range": "± 41423",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11660763,
            "range": "± 217715",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13279538,
            "range": "± 458728",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13486390,
            "range": "± 35860",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6193325,
            "range": "± 164759",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8199608,
            "range": "± 23911",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9575368,
            "range": "± 170783",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3562318,
            "range": "± 69977",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5661837,
            "range": "± 17052",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7063881,
            "range": "± 45998",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3440723,
            "range": "± 62584",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5525852,
            "range": "± 30116",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6902012,
            "range": "± 24911",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7294427,
            "range": "± 60849",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9754796,
            "range": "± 186995",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11182939,
            "range": "± 68373",
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
          "id": "fa5db269d57e450666233655d2b4a3baf3ffa43d",
          "message": "fix(workflow): adjust indentation for build and upload steps in build-wasm.yml",
          "timestamp": "2026-05-19T16:18:54-04:00",
          "tree_id": "382c4e3e12aba02f2ece9576f317ea9e0181e881",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/fa5db269d57e450666233655d2b4a3baf3ffa43d"
        },
        "date": 1779222331449,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2900737,
            "range": "± 92521",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4659130,
            "range": "± 140524",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5817423,
            "range": "± 104624",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2243870,
            "range": "± 58699",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2620610,
            "range": "± 13510",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2903328,
            "range": "± 20526",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8087814,
            "range": "± 152108",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10739434,
            "range": "± 23496",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12567357,
            "range": "± 25197",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11151881,
            "range": "± 97061",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15542701,
            "range": "± 72476",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17287787,
            "range": "± 39813",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6906535,
            "range": "± 20213",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9062216,
            "range": "± 21310",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10301370,
            "range": "± 21513",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3833005,
            "range": "± 82308",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5476717,
            "range": "± 38580",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6585591,
            "range": "± 36232",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11640615,
            "range": "± 22716",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13293055,
            "range": "± 90348",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13489688,
            "range": "± 30794",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6185705,
            "range": "± 22815",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8199723,
            "range": "± 271935",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9544826,
            "range": "± 176217",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3548599,
            "range": "± 19651",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5646254,
            "range": "± 16151",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7061708,
            "range": "± 19675",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3434774,
            "range": "± 91169",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5543599,
            "range": "± 36180",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6909695,
            "range": "± 146866",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7258187,
            "range": "± 23979",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9727669,
            "range": "± 23956",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11164760,
            "range": "± 101180",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cbfe17018f6fe6eb99268e5a413640ce946b4677",
          "message": "chore(deps): update actions/github-script action to v9 (#201)\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>",
          "timestamp": "2026-05-20T08:42:57-04:00",
          "tree_id": "5057a7061b865b74edbe489d3930042320ecb45d",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/cbfe17018f6fe6eb99268e5a413640ce946b4677"
        },
        "date": 1779281373670,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2955541,
            "range": "± 24256",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4477439,
            "range": "± 146823",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5519420,
            "range": "± 43386",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2568138,
            "range": "± 15520",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2884124,
            "range": "± 19626",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3150393,
            "range": "± 17725",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8351194,
            "range": "± 33005",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11179704,
            "range": "± 73597",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13046634,
            "range": "± 40842",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11170651,
            "range": "± 71930",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15629229,
            "range": "± 77665",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17285002,
            "range": "± 112185",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6827042,
            "range": "± 10674",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8876122,
            "range": "± 15315",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10049100,
            "range": "± 38607",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3965650,
            "range": "± 24763",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5496340,
            "range": "± 26353",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6510971,
            "range": "± 37660",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11917314,
            "range": "± 135709",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13428880,
            "range": "± 53333",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13598671,
            "range": "± 51867",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6213143,
            "range": "± 26773",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8089963,
            "range": "± 119534",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9398614,
            "range": "± 47326",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3560993,
            "range": "± 85940",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5468941,
            "range": "± 79246",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6770971,
            "range": "± 153977",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3714248,
            "range": "± 27296",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5811447,
            "range": "± 33070",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7248776,
            "range": "± 33683",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7542988,
            "range": "± 193519",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10112751,
            "range": "± 223007",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11573309,
            "range": "± 44324",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "06b7d37f9eef47eea04e3d0c45c34dffb94afb19",
          "message": "fix(deps): update cargo non-major dependencies (#197)\n\n* fix(deps): update cargo non-major dependencies\n\n* update for latest specta changes\n\n* fix(wasm): update cosmo_synth_engine_bg.wasm binary file\n\n---------\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>\nCo-authored-by: Felix Perron-Brault <fpbrault@gmail.com>",
          "timestamp": "2026-05-20T09:44:33-04:00",
          "tree_id": "327d90d637ac8440e91a86f793648fd0ed48e35c",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/06b7d37f9eef47eea04e3d0c45c34dffb94afb19"
        },
        "date": 1779285071599,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2894972,
            "range": "± 96719",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4652749,
            "range": "± 113357",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5818163,
            "range": "± 153334",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2239143,
            "range": "± 13429",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2610652,
            "range": "± 120212",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2911404,
            "range": "± 24407",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8055113,
            "range": "± 27032",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10710436,
            "range": "± 33633",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12545730,
            "range": "± 486980",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11125276,
            "range": "± 107771",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15584670,
            "range": "± 79104",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17256855,
            "range": "± 398747",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6880417,
            "range": "± 233158",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9027024,
            "range": "± 49733",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10280679,
            "range": "± 254136",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3839144,
            "range": "± 25660",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5506020,
            "range": "± 126942",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6616774,
            "range": "± 141506",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11619147,
            "range": "± 42848",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13245855,
            "range": "± 50792",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13438525,
            "range": "± 127724",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6158752,
            "range": "± 25347",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8163554,
            "range": "± 28562",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9526313,
            "range": "± 59564",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3559796,
            "range": "± 18077",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5645784,
            "range": "± 109648",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7057111,
            "range": "± 212982",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3437930,
            "range": "± 187826",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5526467,
            "range": "± 116215",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6892940,
            "range": "± 44214",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7229087,
            "range": "± 102496",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9699823,
            "range": "± 266598",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11139439,
            "range": "± 46897",
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
          "id": "b8bedcf8a281184abe6558d1e2178b76ef7924bb",
          "message": "fix build",
          "timestamp": "2026-05-20T10:17:00-04:00",
          "tree_id": "b4aef97a6dbfcf07f7a91848688a45b9673ac428",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/b8bedcf8a281184abe6558d1e2178b76ef7924bb"
        },
        "date": 1779287023601,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3172733,
            "range": "± 90341",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4821658,
            "range": "± 55500",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5882548,
            "range": "± 63946",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2582037,
            "range": "± 40858",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2994369,
            "range": "± 45073",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3271152,
            "range": "± 37144",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9390780,
            "range": "± 53245",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12201191,
            "range": "± 36466",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14046558,
            "range": "± 44039",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12437662,
            "range": "± 33289",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17000049,
            "range": "± 247086",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18737832,
            "range": "± 129106",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7778087,
            "range": "± 139704",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9912428,
            "range": "± 35152",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11035832,
            "range": "± 35071",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4492661,
            "range": "± 79099",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5961757,
            "range": "± 36260",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6984379,
            "range": "± 34348",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12643700,
            "range": "± 42051",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14250070,
            "range": "± 209314",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14364504,
            "range": "± 210234",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7027037,
            "range": "± 35743",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8873755,
            "range": "± 31346",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10080390,
            "range": "± 38961",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3875237,
            "range": "± 30092",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5971151,
            "range": "± 138532",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7277293,
            "range": "± 39261",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3798051,
            "range": "± 43120",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5743040,
            "range": "± 193815",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7048386,
            "range": "± 34253",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8232025,
            "range": "± 26858",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10807609,
            "range": "± 37687",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12179710,
            "range": "± 57681",
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
          "id": "d4abce84c06723e5674f46f24ef54df8e11c5f6e",
          "message": "refactor: update algorithm parameters and remove unused algorithms",
          "timestamp": "2026-05-20T10:17:40-04:00",
          "tree_id": "199ab1a82ce6875a33662e27d75e30b2ae194ecd",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/d4abce84c06723e5674f46f24ef54df8e11c5f6e"
        },
        "date": 1779287076373,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3056714,
            "range": "± 90389",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4741833,
            "range": "± 232858",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5801560,
            "range": "± 160138",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2415258,
            "range": "± 13366",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2788981,
            "range": "± 52813",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2981719,
            "range": "± 34868",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8189053,
            "range": "± 69810",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10812644,
            "range": "± 142167",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12737357,
            "range": "± 24545",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11188500,
            "range": "± 21075",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15593705,
            "range": "± 270671",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17311940,
            "range": "± 24008",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6993556,
            "range": "± 58302",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9083950,
            "range": "± 18030",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10273612,
            "range": "± 23788",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3891786,
            "range": "± 91624",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5574486,
            "range": "± 41349",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6583889,
            "range": "± 156933",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11658598,
            "range": "± 371729",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13292268,
            "range": "± 141551",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13489945,
            "range": "± 34126",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6674027,
            "range": "± 202142",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9162350,
            "range": "± 50766",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10830669,
            "range": "± 76809",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3804908,
            "range": "± 17802",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6112804,
            "range": "± 13618",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7690916,
            "range": "± 180426",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3475645,
            "range": "± 21156",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5597882,
            "range": "± 22532",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6891116,
            "range": "± 18385",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7262421,
            "range": "± 97633",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9686038,
            "range": "± 34721",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11120186,
            "range": "± 291308",
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
          "id": "c0de1815ae50cba933bf6cd18975d0eb06ead67e",
          "message": "refactor: remove quantize algorithm and related references",
          "timestamp": "2026-05-20T11:13:13-04:00",
          "tree_id": "9277e25c5a3f6d501848f9834901e7a4e130a4d3",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/c0de1815ae50cba933bf6cd18975d0eb06ead67e"
        },
        "date": 1779290390802,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2943379,
            "range": "± 149106",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4468444,
            "range": "± 19946",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5527097,
            "range": "± 37369",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2511809,
            "range": "± 10758",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2854608,
            "range": "± 9404",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3122393,
            "range": "± 163459",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8395361,
            "range": "± 25288",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11224688,
            "range": "± 34463",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13133886,
            "range": "± 25994",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11309263,
            "range": "± 28206",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15809590,
            "range": "± 125195",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17476948,
            "range": "± 80734",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6908685,
            "range": "± 115581",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8902359,
            "range": "± 46572",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10023916,
            "range": "± 38783",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3992780,
            "range": "± 28632",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5466749,
            "range": "± 43690",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6511278,
            "range": "± 51463",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11987653,
            "range": "± 79214",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13648674,
            "range": "± 107606",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13740710,
            "range": "± 97196",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6786500,
            "range": "± 79243",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9213446,
            "range": "± 103007",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10951596,
            "range": "± 94690",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3817126,
            "range": "± 55315",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5907826,
            "range": "± 64676",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7350567,
            "range": "± 69646",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3661997,
            "range": "± 55927",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5719633,
            "range": "± 66733",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6997398,
            "range": "± 73493",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7670612,
            "range": "± 54749",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9992622,
            "range": "± 33689",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11399428,
            "range": "± 38015",
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
          "id": "376faf0364e2d98b6610a13f5d8521994c1ba86d",
          "message": "fix build",
          "timestamp": "2026-05-20T13:08:28-04:00",
          "tree_id": "fc8280bd8f3041cbf066afc3c4da4c0a9fe5b635",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/376faf0364e2d98b6610a13f5d8521994c1ba86d"
        },
        "date": 1779297337450,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3087157,
            "range": "± 48421",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4745949,
            "range": "± 85083",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5788363,
            "range": "± 167234",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2491918,
            "range": "± 16167",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2863385,
            "range": "± 15301",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3065187,
            "range": "± 15909",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8282459,
            "range": "± 82340",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10952869,
            "range": "± 230073",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12843004,
            "range": "± 67734",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11281506,
            "range": "± 177328",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15662087,
            "range": "± 43680",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17402530,
            "range": "± 54991",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7071258,
            "range": "± 33266",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9195380,
            "range": "± 153907",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10377289,
            "range": "± 56941",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3927017,
            "range": "± 24759",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5533417,
            "range": "± 20199",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6635170,
            "range": "± 35561",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11700144,
            "range": "± 566431",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13344647,
            "range": "± 59900",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13518580,
            "range": "± 72125",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6705660,
            "range": "± 32128",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9209013,
            "range": "± 46648",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10910555,
            "range": "± 36782",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3848228,
            "range": "± 85769",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6154881,
            "range": "± 67714",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7765128,
            "range": "± 43442",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3518984,
            "range": "± 21842",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5668343,
            "range": "± 493472",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6935970,
            "range": "± 37214",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7335890,
            "range": "± 144154",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9777508,
            "range": "± 84495",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11207055,
            "range": "± 187926",
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
          "id": "e45b994d2f221c7b5d1f5d03f0a08067baab6e47",
          "message": "feat: remove modulation, oscillators, overview, and troubleshooting documentation\n\n- Deleted modulation.md, oscillators.md, overview.md, and troubleshooting.md files from the synth reference documentation.\n- Added i18n support with translations for various sections in i18n.json.\n- Updated rspress configuration to support multiple languages (English and French).\n- Set license to GPL-3.0-only in package.json files across multiple packages.\n- Added license.workspace = true in Cargo.toml files for workspace packages.",
          "timestamp": "2026-05-20T13:26:43-04:00",
          "tree_id": "84e056b74baac0a7c0070b942dbea2c444362af3",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/e45b994d2f221c7b5d1f5d03f0a08067baab6e47"
        },
        "date": 1779298394435,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2989391,
            "range": "± 50871",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4559091,
            "range": "± 209452",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5608163,
            "range": "± 89848",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2687179,
            "range": "± 62995",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2966217,
            "range": "± 70432",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3269621,
            "range": "± 47965",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8693314,
            "range": "± 145629",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11526991,
            "range": "± 38089",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13435972,
            "range": "± 40128",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11607177,
            "range": "± 61177",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16124291,
            "range": "± 40528",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17763510,
            "range": "± 325983",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7173241,
            "range": "± 55602",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9137462,
            "range": "± 82331",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10205603,
            "range": "± 136077",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4076531,
            "range": "± 91334",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5559087,
            "range": "± 56485",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6507705,
            "range": "± 55749",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11896613,
            "range": "± 135067",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13499133,
            "range": "± 51406",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13687251,
            "range": "± 288011",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6796907,
            "range": "± 48138",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9169088,
            "range": "± 36442",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10831808,
            "range": "± 71439",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3744927,
            "range": "± 71534",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5927189,
            "range": "± 163160",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7329702,
            "range": "± 62079",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3704348,
            "range": "± 77871",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5760054,
            "range": "± 47206",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7105591,
            "range": "± 141899",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7493021,
            "range": "± 38986",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10034211,
            "range": "± 50350",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11477524,
            "range": "± 64310",
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
          "id": "03ed6b841774cdfd14009b57cce7367875a8fb5c",
          "message": "feat: add third-party licenses documentation",
          "timestamp": "2026-05-20T13:28:21-04:00",
          "tree_id": "2b8eaaf16daa2bf50cceec15997b1d83b0f931b8",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/03ed6b841774cdfd14009b57cce7367875a8fb5c"
        },
        "date": 1779298561454,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2941803,
            "range": "± 187373",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4487559,
            "range": "± 56635",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5524844,
            "range": "± 28871",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2500944,
            "range": "± 28810",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2853215,
            "range": "± 11412",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3135031,
            "range": "± 32527",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8377427,
            "range": "± 69192",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11214597,
            "range": "± 33334",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13129864,
            "range": "± 59408",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11271480,
            "range": "± 42341",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15785768,
            "range": "± 74021",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17448960,
            "range": "± 164659",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6904231,
            "range": "± 179570",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8918504,
            "range": "± 26550",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10036388,
            "range": "± 34473",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3964904,
            "range": "± 23736",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5468056,
            "range": "± 26873",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6462671,
            "range": "± 21158",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11891365,
            "range": "± 180014",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13526951,
            "range": "± 92577",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13693960,
            "range": "± 290054",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6725491,
            "range": "± 16643",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9135542,
            "range": "± 33464",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10763528,
            "range": "± 33342",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3693919,
            "range": "± 10038",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5793070,
            "range": "± 18468",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7207538,
            "range": "± 23331",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3596055,
            "range": "± 21395",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5626899,
            "range": "± 78341",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6969383,
            "range": "± 29058",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7432370,
            "range": "± 26041",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9975455,
            "range": "± 57124",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11380721,
            "range": "± 249616",
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
          "id": "6837526c6fd579a7861e2eb4d0ed57093d6b2841",
          "message": "feat: add links to pre-built binaries and live web version in README",
          "timestamp": "2026-05-20T13:33:08-04:00",
          "tree_id": "dc9f7cc89b48570b1a73e5fae70443923e531201",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/6837526c6fd579a7861e2eb4d0ed57093d6b2841"
        },
        "date": 1779298889289,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3061280,
            "range": "± 59485",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4739605,
            "range": "± 54548",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5793266,
            "range": "± 53912",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2421205,
            "range": "± 12577",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2787903,
            "range": "± 24881",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2973037,
            "range": "± 59101",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8255243,
            "range": "± 56089",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10914150,
            "range": "± 265705",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12886700,
            "range": "± 230706",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11272371,
            "range": "± 63264",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15718129,
            "range": "± 61659",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17470112,
            "range": "± 210436",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7075150,
            "range": "± 146109",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9196257,
            "range": "± 63345",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10379748,
            "range": "± 84703",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3915130,
            "range": "± 27465",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5580216,
            "range": "± 42718",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6599767,
            "range": "± 54907",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11731272,
            "range": "± 219260",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13354139,
            "range": "± 65380",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13572171,
            "range": "± 59361",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6707498,
            "range": "± 54916",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9223120,
            "range": "± 62167",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10940923,
            "range": "± 147417",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3830619,
            "range": "± 52067",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6120117,
            "range": "± 183699",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7708420,
            "range": "± 63681",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3478156,
            "range": "± 23668",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5600127,
            "range": "± 34971",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6900758,
            "range": "± 80253",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7362567,
            "range": "± 934167",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9798810,
            "range": "± 86769",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11232047,
            "range": "± 69541",
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
          "id": "0862a73dff93bac8a3a15c20746f6dfbe7ca73bb",
          "message": "refactor: simplify prerequisites and update plugin build instructions in contributing documentation",
          "timestamp": "2026-05-20T14:15:48-04:00",
          "tree_id": "db41b8f618fea42d7a35f6ade05ee718fa08756e",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/0862a73dff93bac8a3a15c20746f6dfbe7ca73bb"
        },
        "date": 1779301336338,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2438752,
            "range": "± 74421",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 3714996,
            "range": "± 32690",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 4525174,
            "range": "± 33600",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 1947699,
            "range": "± 30552",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2232592,
            "range": "± 66008",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2374627,
            "range": "± 30589",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 6508615,
            "range": "± 180223",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 8572902,
            "range": "± 199598",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 10055449,
            "range": "± 44152",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 8829650,
            "range": "± 43856",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 12274866,
            "range": "± 181456",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 13599371,
            "range": "± 104413",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 5578259,
            "range": "± 97631",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 7205265,
            "range": "± 49948",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 8179171,
            "range": "± 48133",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3102684,
            "range": "± 25131",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 4413676,
            "range": "± 43923",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 5190445,
            "range": "± 45874",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9299241,
            "range": "± 35271",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 10575820,
            "range": "± 56233",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 10748958,
            "range": "± 40147",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 5356129,
            "range": "± 32915",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 7293308,
            "range": "± 51734",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 8570235,
            "range": "± 209896",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3037634,
            "range": "± 54984",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 4823172,
            "range": "± 110611",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6058271,
            "range": "± 93740",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 2763936,
            "range": "± 91325",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 4371305,
            "range": "± 25602",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 5415837,
            "range": "± 158095",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 5800713,
            "range": "± 52382",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 7698512,
            "range": "± 135565",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 8820294,
            "range": "± 238948",
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
          "id": "b69b52d72eecf4ec8c6a599420eb57539e69e425",
          "message": "cleanup",
          "timestamp": "2026-05-20T15:02:27-04:00",
          "tree_id": "daada50e1777887c23f57c7ab2585abfea366b53",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/b69b52d72eecf4ec8c6a599420eb57539e69e425"
        },
        "date": 1779305799552,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2982240,
            "range": "± 135735",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4507898,
            "range": "± 57087",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5562491,
            "range": "± 79240",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2540827,
            "range": "± 46103",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2865577,
            "range": "± 23646",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3163165,
            "range": "± 32531",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8587088,
            "range": "± 151405",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11476417,
            "range": "± 89701",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13480605,
            "range": "± 72767",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11483064,
            "range": "± 82946",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16050020,
            "range": "± 92580",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17706009,
            "range": "± 96733",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7081592,
            "range": "± 73053",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9105124,
            "range": "± 104993",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10326257,
            "range": "± 68250",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4051443,
            "range": "± 45788",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5566112,
            "range": "± 63002",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6549933,
            "range": "± 70514",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12136800,
            "range": "± 86953",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13738450,
            "range": "± 137702",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13841989,
            "range": "± 93631",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6901087,
            "range": "± 72504",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9376114,
            "range": "± 80741",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11071191,
            "range": "± 104330",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3797130,
            "range": "± 40783",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5938088,
            "range": "± 79410",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7415826,
            "range": "± 88500",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3651023,
            "range": "± 60829",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5695964,
            "range": "± 79916",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7036654,
            "range": "± 84636",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7629884,
            "range": "± 88835",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10223712,
            "range": "± 94253",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11665250,
            "range": "± 73320",
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
          "id": "cdcfeba53114d830511b277f786048e054c4c0ec",
          "message": "refactor: Enhance audio visualization and control with new SynthRenderer components (#219)\n\n* feat: add SynthRenderer components and hooks for improved audio visualization and control\n\n- Introduced SynthRendererDrawer for managing drawer panels (fx, mod, display).\n- Added SynthRendererLibraryOverlay for preset management with animations.\n- Created SynthRendererMainPanel to encapsulate main panel functionalities.\n- Implemented SynthRendererOverlays for handling various overlays (audio start, keyboard, modals).\n- Developed SynthRendererTopBar for top-level controls including volume and mode selection.\n- Added drawerHelpers for managing drawer transitions and states.\n- Implemented useAudioLevelMonitor hook for real-time audio level monitoring.\n- Created usePerformanceMetrics hook for performance tracking in audio worklets.\n- Added useDrawerPanelState and useEnvOverrideHandlers hooks for managing UI state and envelope overrides.\n- Updated synthUiStore to support new panel modes.\n- Refactored CSS for consistent theming.\n- Cleaned up unused imports and optimized code structure across various files.\n\n* fix tests\n\n* Refactor and enhance Cosmo PD-101 plugin\n\n- Updated the end-to-end tests for the algo controls plugin to include hover info checks.\n- Introduced a new Playwright configuration file for improved testing setup.\n- Refactored PluginPage component to streamline state management and improve performance.\n- Added cosmoSynthWorklet.js for the new audio worklet processor implementation.\n- Enhanced ControlKnob component to utilize hover info for better user experience.\n- Updated algo control components to use translated labels and descriptions.\n- Improved SynthRenderer and its related components to support audio context and analyser node references.\n- Fixed worklet URL references to align with new naming conventions.\n- Updated WASM glue code comments to reflect changes in worklet file naming.\n\n* feat: implement preset library functionality\n\n- Add shared utilities for preset library management including sorting and editable target checks.\n- Create hooks for importing presets, managing navigation, and handling state within the preset library.\n- Introduce preset manager helpers for building preset entries and managing preset diffs.\n- Implement persistence for preset manager state to maintain user settings and loaded presets.\n- Refactor existing preset manager logic to utilize new helper functions and hooks for improved readability and maintainability.\n\n* fix build",
          "timestamp": "2026-05-20T17:44:21-04:00",
          "tree_id": "9f1f9c2d72822187b90158185dc877a7159803b6",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/cdcfeba53114d830511b277f786048e054c4c0ec"
        },
        "date": 1779313849471,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3046038,
            "range": "± 27228",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4738978,
            "range": "± 252866",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5790450,
            "range": "± 61835",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2427994,
            "range": "± 25597",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2800957,
            "range": "± 28739",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2989917,
            "range": "± 31369",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8228429,
            "range": "± 52939",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10852335,
            "range": "± 248705",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12804388,
            "range": "± 77175",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11212957,
            "range": "± 43221",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15608882,
            "range": "± 33044",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17367530,
            "range": "± 43576",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7034370,
            "range": "± 94696",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9107639,
            "range": "± 39562",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10311337,
            "range": "± 60327",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3899920,
            "range": "± 25849",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5584920,
            "range": "± 29850",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6587935,
            "range": "± 47083",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11689934,
            "range": "± 48604",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13318210,
            "range": "± 156331",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13523119,
            "range": "± 120297",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6682466,
            "range": "± 40738",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9168275,
            "range": "± 56462",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10875122,
            "range": "± 35852",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3834285,
            "range": "± 57946",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6154772,
            "range": "± 39716",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7741204,
            "range": "± 50195",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3509367,
            "range": "± 29030",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5621642,
            "range": "± 24256",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6929732,
            "range": "± 23720",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7290386,
            "range": "± 53972",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9830720,
            "range": "± 28450",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11296395,
            "range": "± 60863",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ab1ebcb69780ea71b64ac601a9f406ce7ad39d5f",
          "message": "chore(deps): update github artifact actions (major) (#213)\n\nchore(deps): update github artifact actions\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>",
          "timestamp": "2026-05-20T20:14:56-04:00",
          "tree_id": "34060008ca22c9e974fdfdf3c79bb0f6bd405abf",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/ab1ebcb69780ea71b64ac601a9f406ce7ad39d5f"
        },
        "date": 1779322882194,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3097396,
            "range": "± 107958",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4790090,
            "range": "± 152457",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5936734,
            "range": "± 213306",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2518822,
            "range": "± 18748",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2863637,
            "range": "± 9889",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3150470,
            "range": "± 34587",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8440046,
            "range": "± 105489",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11292825,
            "range": "± 113671",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13240578,
            "range": "± 200533",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11395606,
            "range": "± 138786",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15971452,
            "range": "± 184113",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17574129,
            "range": "± 220711",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7115921,
            "range": "± 162206",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9206385,
            "range": "± 214731",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10391373,
            "range": "± 299067",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4112346,
            "range": "± 94173",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5797597,
            "range": "± 208435",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6935580,
            "range": "± 300780",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11975185,
            "range": "± 135793",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13655634,
            "range": "± 321736",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13761658,
            "range": "± 190808",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6820151,
            "range": "± 129490",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9253996,
            "range": "± 174566",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10935010,
            "range": "± 200245",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3797875,
            "range": "± 71392",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5989246,
            "range": "± 131993",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7472225,
            "range": "± 171831",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3687362,
            "range": "± 25694",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5799928,
            "range": "± 32365",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7180003,
            "range": "± 48867",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7678643,
            "range": "± 124642",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10262807,
            "range": "± 162744",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11702913,
            "range": "± 172031",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "92c6cf54654ddfbd43bbaf3a7319693860878aa8",
          "message": "chore(deps): update softprops/action-gh-release action to v3 (#214)\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>\nCo-authored-by: Felix Perron-Brault <fpbrault@gmail.com>",
          "timestamp": "2026-05-20T20:15:30-04:00",
          "tree_id": "bd788f549e7e848e3c45720bfeb26118e6430cf1",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/92c6cf54654ddfbd43bbaf3a7319693860878aa8"
        },
        "date": 1779322919781,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3089138,
            "range": "± 85495",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4733645,
            "range": "± 47986",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5807034,
            "range": "± 55301",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2436968,
            "range": "± 30329",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2798919,
            "range": "± 32906",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2984681,
            "range": "± 28385",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8242421,
            "range": "± 252769",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10892094,
            "range": "± 79085",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12848084,
            "range": "± 148972",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11294393,
            "range": "± 66507",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15695202,
            "range": "± 103289",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17411005,
            "range": "± 123610",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7052415,
            "range": "± 116667",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9183623,
            "range": "± 82244",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10352230,
            "range": "± 90712",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3917833,
            "range": "± 25157",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5587053,
            "range": "± 36822",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6603020,
            "range": "± 191375",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11717698,
            "range": "± 89529",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13351312,
            "range": "± 294383",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13531427,
            "range": "± 96878",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6715048,
            "range": "± 49880",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9211685,
            "range": "± 67371",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10955873,
            "range": "± 106676",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3876540,
            "range": "± 77799",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6188481,
            "range": "± 83623",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7767899,
            "range": "± 102048",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3520551,
            "range": "± 67000",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5611826,
            "range": "± 56635",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6929203,
            "range": "± 217168",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7336841,
            "range": "± 51598",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9794373,
            "range": "± 71121",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11250137,
            "range": "± 84632",
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
          "id": "166ce9d1c2ecdfd4429354faa4bd0668183134a3",
          "message": "feat: add polyphonic aftertouch support (#211)\n\n* feat: add polyphonic aftertouch support\n\n- Implemented handling for polyphonic aftertouch in the audio unit.\n- Added new FFI function `cosmo_pd101_ffi_set_poly_aftertouch` to set polyphonic aftertouch values.\n- Updated the view controller to handle polyphonic aftertouch events from the UI.\n- Modified the Rust backend to process polyphonic aftertouch events and integrate them into the modulation matrix.\n- Enhanced the webview to support sending polyphonic aftertouch events.\n- Updated build scripts to ensure proper feature flags for iOS builds.\n\n* fix build",
          "timestamp": "2026-05-21T13:04:09Z",
          "tree_id": "c10d60c40dad1150e53407ff51601b10c5c66835",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/166ce9d1c2ecdfd4429354faa4bd0668183134a3"
        },
        "date": 1779369043535,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3069619,
            "range": "± 140823",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4682661,
            "range": "± 75765",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5637220,
            "range": "± 59510",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2559221,
            "range": "± 14856",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2927109,
            "range": "± 39519",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3174448,
            "range": "± 62906",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9115367,
            "range": "± 51359",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12060766,
            "range": "± 252081",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14037220,
            "range": "± 242838",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12154930,
            "range": "± 168245",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16883841,
            "range": "± 66703",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18685433,
            "range": "± 312169",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7464300,
            "range": "± 76877",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9696838,
            "range": "± 48635",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10845487,
            "range": "± 312405",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4174244,
            "range": "± 50535",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5725790,
            "range": "± 40493",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6777507,
            "range": "± 104359",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 13138364,
            "range": "± 167210",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 15016400,
            "range": "± 358702",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15235593,
            "range": "± 211763",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7346067,
            "range": "± 55025",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9877185,
            "range": "± 63305",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11555679,
            "range": "± 46381",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4069158,
            "range": "± 81614",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6357981,
            "range": "± 33908",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7826850,
            "range": "± 62888",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3678893,
            "range": "± 80704",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5769043,
            "range": "± 47006",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7117826,
            "range": "± 56712",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8077772,
            "range": "± 268869",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10825351,
            "range": "± 64457",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12339233,
            "range": "± 84897",
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
          "id": "614ca99501dcf4f08f9fa931cb9711b9bc5412dd",
          "message": "feat(cosmo-pd101): rework modulation targeting ux (#220)\n\n* feat: add polyphonic aftertouch support\n\n- Implemented handling for polyphonic aftertouch in the audio unit.\n- Added new FFI function `cosmo_pd101_ffi_set_poly_aftertouch` to set polyphonic aftertouch values.\n- Updated the view controller to handle polyphonic aftertouch events from the UI.\n- Modified the Rust backend to process polyphonic aftertouch events and integrate them into the modulation matrix.\n- Enhanced the webview to support sending polyphonic aftertouch events.\n- Updated build scripts to ensure proper feature flags for iOS builds.\n\n* fix build\n\n* feat(cosmo-pd101): rework modulation targeting ux",
          "timestamp": "2026-05-21T14:03:06Z",
          "tree_id": "2b54b98f3d4faf6d93368bebfb328c267cc5b82c",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/614ca99501dcf4f08f9fa931cb9711b9bc5412dd"
        },
        "date": 1779372576346,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2363496,
            "range": "± 49739",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 3654757,
            "range": "± 125564",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 4512521,
            "range": "± 27936",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 1870070,
            "range": "± 30637",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2205527,
            "range": "± 7102",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2377654,
            "range": "± 54758",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 6722421,
            "range": "± 141012",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 8776912,
            "range": "± 32082",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 10187247,
            "range": "± 47158",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 9145295,
            "range": "± 192708",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 12528908,
            "range": "± 265799",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 13825160,
            "range": "± 51719",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 5699604,
            "range": "± 32932",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 7339656,
            "range": "± 68744",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 8273838,
            "range": "± 43127",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3058061,
            "range": "± 31612",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 4378322,
            "range": "± 45031",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 5182611,
            "range": "± 105093",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9500117,
            "range": "± 165676",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 10759074,
            "range": "± 235819",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 10930779,
            "range": "± 44276",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 5507915,
            "range": "± 46160",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 7353993,
            "range": "± 26174",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 8650928,
            "range": "± 58339",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 2917327,
            "range": "± 57784",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 4618111,
            "range": "± 28504",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 5797531,
            "range": "± 41065",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 2789718,
            "range": "± 9210",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 4380371,
            "range": "± 13433",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 5471388,
            "range": "± 35162",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 5990738,
            "range": "± 22475",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 7891630,
            "range": "± 53554",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 8953776,
            "range": "± 25626",
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
          "id": "148f231358977f17e7429060a6465af3ede253f4",
          "message": "fix(pd101): wire vintage tab to cz dac (#221)\n\n* fix(pd101): wire vintage tab to cz dac\n\n* fix(pd101): keep vintage dac toggle global",
          "timestamp": "2026-05-21T15:43:59Z",
          "tree_id": "8f03bb6a5266c5880edd35d45487e2a3ed81f013",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/148f231358977f17e7429060a6465af3ede253f4"
        },
        "date": 1779378620869,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3039598,
            "range": "± 83579",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4694336,
            "range": "± 99829",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5798387,
            "range": "± 69555",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2355162,
            "range": "± 16288",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2771990,
            "range": "± 17992",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2992092,
            "range": "± 59471",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8450796,
            "range": "± 27017",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11059552,
            "range": "± 34521",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12905268,
            "range": "± 40282",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11587887,
            "range": "± 26607",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15983386,
            "range": "± 264293",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17665190,
            "range": "± 305446",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7155995,
            "range": "± 25388",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9240074,
            "range": "± 49979",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10413492,
            "range": "± 65354",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3939647,
            "range": "± 17550",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5561809,
            "range": "± 95026",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6626920,
            "range": "± 122974",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11988466,
            "range": "± 209698",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13593080,
            "range": "± 39561",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13776760,
            "range": "± 43797",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6887372,
            "range": "± 16264",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9307672,
            "range": "± 24260",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10974247,
            "range": "± 148227",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3746223,
            "range": "± 71744",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5953818,
            "range": "± 50394",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7445159,
            "range": "± 62303",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3509579,
            "range": "± 11183",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5575844,
            "range": "± 13622",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6912740,
            "range": "± 45949",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7539726,
            "range": "± 50520",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9964617,
            "range": "± 103969",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11354653,
            "range": "± 48880",
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
          "id": "daa352245354f12e594527df4905d1efcb46155b",
          "message": "fix: adjust vintage dac settings (#222)\n\n* fix(pd101): wire vintage tab to cz dac\n\n* fix(pd101): keep vintage dac toggle global\n\n* fix: update base URL and port in Playwright config files\n\n* refactor(engine): use fixed cz dac trim\n\n* fix(cz_dac): refactor CzDacColor structure and improve processing logic",
          "timestamp": "2026-05-21T20:46:30-04:00",
          "tree_id": "c8901a5f5a7d86da58d698b430e0fb39e11bb31d",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/daa352245354f12e594527df4905d1efcb46155b"
        },
        "date": 1779411174892,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2927281,
            "range": "± 42019",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4463369,
            "range": "± 17200",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5503288,
            "range": "± 68097",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2551642,
            "range": "± 17495",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2879974,
            "range": "± 35987",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3151821,
            "range": "± 24511",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8731700,
            "range": "± 45336",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11781011,
            "range": "± 42500",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13808452,
            "range": "± 144559",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11698139,
            "range": "± 185300",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16431244,
            "range": "± 72164",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18158567,
            "range": "± 62974",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7169578,
            "range": "± 51925",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9333043,
            "range": "± 41678",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10491654,
            "range": "± 78292",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3945640,
            "range": "± 25403",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5455585,
            "range": "± 26374",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6459407,
            "range": "± 22920",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12289506,
            "range": "± 42728",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13937310,
            "range": "± 328405",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14055890,
            "range": "± 43984",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6942919,
            "range": "± 21460",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9442339,
            "range": "± 56440",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11089668,
            "range": "± 248697",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3783821,
            "range": "± 96692",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5992569,
            "range": "± 25032",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7453244,
            "range": "± 28138",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3519692,
            "range": "± 9666",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5486474,
            "range": "± 15323",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6793564,
            "range": "± 31882",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7783923,
            "range": "± 23929",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10504161,
            "range": "± 27411",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12021877,
            "range": "± 32431",
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
          "id": "8dad462f57e245e08563c34fdaa4c12241fac0aa",
          "message": "refactor: key follow parameters in synth engine (#223)\n\n* fix(pd101): wire vintage tab to cz dac\n\n* fix(pd101): keep vintage dac toggle global\n\n* refactor(engine): use fixed cz dac trim\n\n* Refactor key follow parameters in synth engine\n\n- Removed legacy `keyFollow` field from default presets and replaced it with `dcwKeyFollow` and `dcaKeyFollow`.\n- Updated `DEFAULT_PRESET` to reflect the new key follow structure.\n- Modified envelope processing to utilize the new key follow parameters for both lines.\n- Added tests to ensure correct behavior of the new key follow logic, including its effect on note duration and envelope progression.\n- Adjusted documentation to match the new parameter names and functionality.",
          "timestamp": "2026-05-21T20:56:33-04:00",
          "tree_id": "983e816109bcd944352e7ac5c008ea9142c063c0",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/8dad462f57e245e08563c34fdaa4c12241fac0aa"
        },
        "date": 1779411774616,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3085224,
            "range": "± 52182",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4689419,
            "range": "± 35545",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5771305,
            "range": "± 27074",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2596491,
            "range": "± 78698",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2931434,
            "range": "± 9647",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3203501,
            "range": "± 10424",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9038771,
            "range": "± 34090",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12130041,
            "range": "± 258297",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14162832,
            "range": "± 44947",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11890225,
            "range": "± 93664",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16642640,
            "range": "± 56246",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18398762,
            "range": "± 93954",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7337857,
            "range": "± 27130",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9577051,
            "range": "± 28824",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10809005,
            "range": "± 34133",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4057676,
            "range": "± 19435",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5575024,
            "range": "± 29263",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6593316,
            "range": "± 120260",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12422723,
            "range": "± 71854",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14175642,
            "range": "± 58243",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14402767,
            "range": "± 264376",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7155762,
            "range": "± 43699",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9759988,
            "range": "± 160048",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11461797,
            "range": "± 72723",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4014118,
            "range": "± 77336",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6249856,
            "range": "± 167909",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7764551,
            "range": "± 34065",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3689175,
            "range": "± 117600",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5697943,
            "range": "± 17621",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7069064,
            "range": "± 14574",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7931420,
            "range": "± 23964",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10682350,
            "range": "± 121108",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12167981,
            "range": "± 33314",
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
          "id": "c83bb63f6bd92c85aa0420065fb6f6ed404d4298",
          "message": "fix(synth): correct noise modulation routing (#224)\n\n* fix(synth): correct noise modulation routing\n\n* fix(synth): increase noise dcw response\n\n* perf(synth): simplify noise modulation shaping\n\n* update wasm\n\n* perf(synth): speed up noise modulation\n\n* wasm update",
          "timestamp": "2026-05-22T01:17:22Z",
          "tree_id": "ca4d2ee7230d23465aad4d6944e34240ff0fb4fd",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/c83bb63f6bd92c85aa0420065fb6f6ed404d4298"
        },
        "date": 1779413026725,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3169367,
            "range": "± 13475",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4826807,
            "range": "± 45746",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6021315,
            "range": "± 213609",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2494106,
            "range": "± 18409",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2711518,
            "range": "± 25693",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2972935,
            "range": "± 53321",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8554489,
            "range": "± 22590",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11243362,
            "range": "± 32892",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13074507,
            "range": "± 29872",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11667947,
            "range": "± 29672",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16145008,
            "range": "± 52054",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17912642,
            "range": "± 84984",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7274382,
            "range": "± 20164",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9331572,
            "range": "± 36045",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10553910,
            "range": "± 27060",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4001819,
            "range": "± 23298",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5613700,
            "range": "± 30072",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6771321,
            "range": "± 35240",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12028105,
            "range": "± 26352",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13731263,
            "range": "± 26523",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14045458,
            "range": "± 58151",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7016567,
            "range": "± 28286",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9461478,
            "range": "± 45261",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11143753,
            "range": "± 52541",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3840778,
            "range": "± 14858",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6019719,
            "range": "± 19429",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7492384,
            "range": "± 20441",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3598380,
            "range": "± 14478",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5624136,
            "range": "± 18692",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7026033,
            "range": "± 40446",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7650420,
            "range": "± 17363",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10163554,
            "range": "± 32913",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11635449,
            "range": "± 27988",
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
          "id": "39eeda930e31e9bad4ee1f5c46b9a830d017994d",
          "message": "perf(synth): remove common-path noise overhead (#225)\n\n* update wasm\n\n* perf(synth): remove common-path noise overhead",
          "timestamp": "2026-05-22T01:52:16Z",
          "tree_id": "f680d6b7b6e975f4e638db94f02d875dc5dc67e9",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/39eeda930e31e9bad4ee1f5c46b9a830d017994d"
        },
        "date": 1779415128731,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3150513,
            "range": "± 102596",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4865603,
            "range": "± 169059",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5888881,
            "range": "± 13788",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2443657,
            "range": "± 9593",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2773314,
            "range": "± 32836",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2956967,
            "range": "± 64560",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8598602,
            "range": "± 26749",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11255375,
            "range": "± 23712",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13257478,
            "range": "± 25722",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11732343,
            "range": "± 24734",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16169606,
            "range": "± 41685",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17921185,
            "range": "± 35143",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7248031,
            "range": "± 26426",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9308475,
            "range": "± 20858",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10576895,
            "range": "± 24058",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4105461,
            "range": "± 9339",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5624470,
            "range": "± 17809",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6705068,
            "range": "± 122850",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12127450,
            "range": "± 32406",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13839403,
            "range": "± 32474",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14160742,
            "range": "± 26354",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7101208,
            "range": "± 14451",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9459579,
            "range": "± 190369",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11129020,
            "range": "± 28861",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3902586,
            "range": "± 55032",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6034102,
            "range": "± 15661",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7565600,
            "range": "± 16209",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3624915,
            "range": "± 12400",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5619627,
            "range": "± 12721",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6992385,
            "range": "± 38349",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7648305,
            "range": "± 21484",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10138862,
            "range": "± 279036",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11599513,
            "range": "± 26522",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8953435ae9393a0835e53e15ef125d392a308a6f",
          "message": "fix(deps): update rust crate toml to v1 (#218)\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>",
          "timestamp": "2026-05-22T02:03:49Z",
          "tree_id": "c30e045dc23008528c40762b7af4bf6098bc9eef",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/8953435ae9393a0835e53e15ef125d392a308a6f"
        },
        "date": 1779415813533,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3227998,
            "range": "± 62880",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5028536,
            "range": "± 60885",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6239362,
            "range": "± 37802",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2520755,
            "range": "± 17335",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2829141,
            "range": "± 30280",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3064917,
            "range": "± 34216",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8858430,
            "range": "± 66175",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11933516,
            "range": "± 43600",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13980242,
            "range": "± 32827",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11835382,
            "range": "± 25636",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16694428,
            "range": "± 79392",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18506130,
            "range": "± 103927",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7473007,
            "range": "± 20380",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9868609,
            "range": "± 34074",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11206003,
            "range": "± 62753",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4226356,
            "range": "± 26111",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5985914,
            "range": "± 37688",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7170456,
            "range": "± 17331",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12671788,
            "range": "± 29172",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14595578,
            "range": "± 26434",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14920879,
            "range": "± 27081",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7338936,
            "range": "± 16802",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10117877,
            "range": "± 22837",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12310340,
            "range": "± 215516",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4099864,
            "range": "± 14117",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6592683,
            "range": "± 39667",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8213906,
            "range": "± 25820",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3652028,
            "range": "± 21558",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5687703,
            "range": "± 10754",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7006493,
            "range": "± 52505",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7959574,
            "range": "± 60900",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10851428,
            "range": "± 20377",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12473577,
            "range": "± 81164",
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
          "id": "f12eb5b0686bdc24c5ab7b4309929a04565dd3a4",
          "message": "chore: update .gitignore to exclude Xcode project files and retain Cargo config",
          "timestamp": "2026-05-22T16:24:32-04:00",
          "tree_id": "00334db5b20d8631c052eed3492f7cdb22bcfe90",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/f12eb5b0686bdc24c5ab7b4309929a04565dd3a4"
        },
        "date": 1779481852553,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3229089,
            "range": "± 115495",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5017967,
            "range": "± 25285",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6207344,
            "range": "± 24536",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2533319,
            "range": "± 21692",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2859548,
            "range": "± 12421",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3116030,
            "range": "± 58291",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9032374,
            "range": "± 163110",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12182810,
            "range": "± 367844",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14306940,
            "range": "± 81956",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11858184,
            "range": "± 477100",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16773151,
            "range": "± 110909",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18547286,
            "range": "± 417391",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7471923,
            "range": "± 38191",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9887050,
            "range": "± 176745",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11273821,
            "range": "± 95547",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4268052,
            "range": "± 42600",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6052372,
            "range": "± 55250",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7226514,
            "range": "± 54335",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12659757,
            "range": "± 40858",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14586462,
            "range": "± 441719",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14908611,
            "range": "± 446965",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7358989,
            "range": "± 54153",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10133920,
            "range": "± 59498",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11936639,
            "range": "± 48195",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4159117,
            "range": "± 48654",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6636628,
            "range": "± 113574",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8368592,
            "range": "± 69259",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3692059,
            "range": "± 38433",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5704977,
            "range": "± 47220",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7052571,
            "range": "± 32160",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8099569,
            "range": "± 156866",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10928082,
            "range": "± 77252",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12578333,
            "range": "± 84740",
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
          "id": "81c790565ad87e7cab70a1b416a8536cc8f89595",
          "message": "chore: add sign and notarize setup to release process (#227)\n\n* feat: Enhance AU v2 and v3 support with MIDI 2.0 and SysEx handling\n\n- Added support for MIDI 2.0 channel-voice messages and SysEx events in the AU v3 path.\n- Introduced `AuMidi2Event` structure for handling MIDI 2.0 messages.\n- Updated `AuCallbacks` to include new functions for SysEx output event handling.\n- Implemented SysEx assembler to manage long SysEx payloads across UMP packets.\n- Modified `cb_process` to decode MIDI 2.0 messages and handle SysEx events appropriately.\n- Improved GUI handling by deferring GUI opening until the host has attached the view.\n- Updated vendored `truce-shim-types` to version 0.45.4 with necessary header changes.\n- Ensured consistency between Rust and C header definitions for SysEx pool preallocation.\n\n* remove pbxproj\n\n* chore: add environment variables for signing identities in release workflow\n\n* chore: update release workflow to use secrets for signing identities",
          "timestamp": "2026-05-22T20:54:38Z",
          "tree_id": "d59608f4edba9e1211033fe24072155b6966828f",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/81c790565ad87e7cab70a1b416a8536cc8f89595"
        },
        "date": 1779483653761,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3275924,
            "range": "± 166770",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5030439,
            "range": "± 108123",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6237950,
            "range": "± 35582",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2523124,
            "range": "± 22859",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2841518,
            "range": "± 21661",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3097746,
            "range": "± 106427",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8930725,
            "range": "± 30241",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12057783,
            "range": "± 60189",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14157441,
            "range": "± 79370",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12202174,
            "range": "± 131940",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17205085,
            "range": "± 65797",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19023180,
            "range": "± 62397",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7493855,
            "range": "± 246973",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9909829,
            "range": "± 45469",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11199960,
            "range": "± 75651",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4276391,
            "range": "± 24222",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6016550,
            "range": "± 26915",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7178306,
            "range": "± 35696",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12771996,
            "range": "± 340109",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14722972,
            "range": "± 75474",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15065590,
            "range": "± 90168",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7400614,
            "range": "± 48543",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10205260,
            "range": "± 63119",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12011287,
            "range": "± 364753",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4153571,
            "range": "± 100586",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6642367,
            "range": "± 71545",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8280845,
            "range": "± 61066",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3645477,
            "range": "± 25394",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5695242,
            "range": "± 42293",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7062279,
            "range": "± 53533",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8089601,
            "range": "± 65546",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11043113,
            "range": "± 90387",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12656612,
            "range": "± 92218",
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
          "id": "e7503d130f694e2c36483590dd7572d7c2c08b41",
          "message": "update release workflow",
          "timestamp": "2026-05-22T17:22:39-04:00",
          "tree_id": "23cb8450956b3dc9ecfcfb7b97ef3e1390bcacad",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/e7503d130f694e2c36483590dd7572d7c2c08b41"
        },
        "date": 1779485335475,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3313613,
            "range": "± 174900",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5121447,
            "range": "± 75310",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6295663,
            "range": "± 71425",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2591210,
            "range": "± 21589",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2904249,
            "range": "± 30885",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3179293,
            "range": "± 54661",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9144473,
            "range": "± 71981",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12363151,
            "range": "± 80095",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14355274,
            "range": "± 72502",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12297415,
            "range": "± 64219",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17073376,
            "range": "± 88562",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18810639,
            "range": "± 133436",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7861187,
            "range": "± 103543",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10408575,
            "range": "± 190518",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11582417,
            "range": "± 166800",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4308346,
            "range": "± 41037",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6080274,
            "range": "± 48186",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7169997,
            "range": "± 81945",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12827623,
            "range": "± 66707",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14672593,
            "range": "± 75446",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14952132,
            "range": "± 270844",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7523887,
            "range": "± 51074",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10320018,
            "range": "± 85655",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12095454,
            "range": "± 71792",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4244569,
            "range": "± 40476",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6768663,
            "range": "± 111629",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8372389,
            "range": "± 91406",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3652125,
            "range": "± 30064",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5747106,
            "range": "± 46394",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7075949,
            "range": "± 59187",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8115957,
            "range": "± 60016",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10965170,
            "range": "± 67376",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12517679,
            "range": "± 98195",
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
          "id": "65d3881e39cf69d990967dc929772f6602699d94",
          "message": "chore: add caching for Bun install and Rust build artifacts in workflows",
          "timestamp": "2026-05-22T17:31:53-04:00",
          "tree_id": "1b27c93796bcc63842b2be9adaea233c908ba828",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/65d3881e39cf69d990967dc929772f6602699d94"
        },
        "date": 1779485900321,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3273449,
            "range": "± 62803",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5147538,
            "range": "± 274638",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6387554,
            "range": "± 89974",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2610211,
            "range": "± 36654",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2910954,
            "range": "± 28932",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3213000,
            "range": "± 41510",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9218098,
            "range": "± 132641",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12431100,
            "range": "± 122536",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14445025,
            "range": "± 49416",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12332581,
            "range": "± 43228",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17187957,
            "range": "± 275841",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18909142,
            "range": "± 115967",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7800320,
            "range": "± 63039",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10262761,
            "range": "± 135287",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11512491,
            "range": "± 66486",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4341245,
            "range": "± 73318",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6122131,
            "range": "± 78005",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7210885,
            "range": "± 43665",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 13017607,
            "range": "± 65144",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14850380,
            "range": "± 269421",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15112852,
            "range": "± 78863",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7661579,
            "range": "± 47512",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10533132,
            "range": "± 127204",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12304192,
            "range": "± 46902",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4311575,
            "range": "± 45517",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6911568,
            "range": "± 36447",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8539671,
            "range": "± 95790",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3734012,
            "range": "± 45084",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5836491,
            "range": "± 70770",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7241375,
            "range": "± 31985",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8204850,
            "range": "± 77247",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11108415,
            "range": "± 63553",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12662755,
            "range": "± 58531",
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
          "id": "80b9f5df1fbde657f2ddd1cc6363646123516ba6",
          "message": "chore: specify shell for renaming exact-release artifacts in release workflow",
          "timestamp": "2026-05-22T17:52:18-04:00",
          "tree_id": "dfde5c4395ddd65cda72309187516fdd80cf2a7c",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/80b9f5df1fbde657f2ddd1cc6363646123516ba6"
        },
        "date": 1779487123166,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3243054,
            "range": "± 72348",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5046557,
            "range": "± 32474",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6208871,
            "range": "± 114395",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2562917,
            "range": "± 24459",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2868633,
            "range": "± 16333",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3134047,
            "range": "± 27870",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8990722,
            "range": "± 130254",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12127563,
            "range": "± 166259",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14134479,
            "range": "± 357542",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12062717,
            "range": "± 154545",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16911039,
            "range": "± 78670",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18610071,
            "range": "± 330462",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7559699,
            "range": "± 31937",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9998836,
            "range": "± 59356",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11241745,
            "range": "± 79757",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4288678,
            "range": "± 116673",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6063089,
            "range": "± 38265",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7170903,
            "range": "± 74088",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12845392,
            "range": "± 75781",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14652305,
            "range": "± 216076",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14886427,
            "range": "± 65387",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7495656,
            "range": "± 75036",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10304092,
            "range": "± 170522",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12099516,
            "range": "± 189295",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4237190,
            "range": "± 52662",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6755434,
            "range": "± 165609",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8358691,
            "range": "± 44318",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3635665,
            "range": "± 35019",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5695674,
            "range": "± 13371",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7005419,
            "range": "± 105561",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8057479,
            "range": "± 115534",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10915668,
            "range": "± 63732",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12422065,
            "range": "± 88440",
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
          "id": "a21dbb79b82ec0680fc08accd786d6a295cb984a",
          "message": "chore: add installer signing identity check to macOS notarization process",
          "timestamp": "2026-05-22T18:12:35-04:00",
          "tree_id": "59661dbc5a40324ec7368b0507fb23e47585964b",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/a21dbb79b82ec0680fc08accd786d6a295cb984a"
        },
        "date": 1779488345813,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3081966,
            "range": "± 41373",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4793703,
            "range": "± 36051",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5984551,
            "range": "± 20459",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2512578,
            "range": "± 9700",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2781356,
            "range": "± 20597",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3008957,
            "range": "± 104918",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8623455,
            "range": "± 32976",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11241667,
            "range": "± 36158",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13106762,
            "range": "± 33127",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11718749,
            "range": "± 31235",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16199333,
            "range": "± 24523",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17986679,
            "range": "± 59970",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7298816,
            "range": "± 40495",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9406758,
            "range": "± 37234",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10583196,
            "range": "± 48457",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4029304,
            "range": "± 17301",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5648298,
            "range": "± 29322",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6753356,
            "range": "± 92407",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12459098,
            "range": "± 209869",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13781439,
            "range": "± 41517",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14289779,
            "range": "± 139952",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7148365,
            "range": "± 17599",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9462786,
            "range": "± 21618",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11104412,
            "range": "± 60130",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3906403,
            "range": "± 15768",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6051234,
            "range": "± 72261",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7541589,
            "range": "± 22537",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3604814,
            "range": "± 13952",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5626236,
            "range": "± 16673",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6996462,
            "range": "± 18503",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7679661,
            "range": "± 19806",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10130706,
            "range": "± 173723",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11562444,
            "range": "± 24370",
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
          "id": "58bd3ea98621bb778aa81cdb4e6dfd6e8906713d",
          "message": "fix: mod not working on detune and fx controls (#228)\n\n* fix mod not working on detune and fx controls\n\n* perf: gate per-sample modulation work behind pre-computed flags\n\nAdd compile-time flags (has_fx_mod_routes, has_line_pitch_routes) to CompiledSynthParams so the per-sample FX modulation and octave/detune modulation code paths are skipped when no routes target those destinations.\n\nBenchmark results (block-size=64, 8 voices, 48kHz):\n- mod-only-sine: +14.6% -> +6.7% (72% regression recovered)\n- mod-heavy:     +13.8% -> +3.0% (92% regression recovered)\n- chants-like:   +11.5% -> +6.7% (73% regression recovered)\n- fx-only-sine:  +0.9%  -> ~0%  (100% regression recovered)\n\n* refactor: simplify modulation parameter application in FX processing\n\n* feat: implement modulation for various effects including Bitcrusher, Chorus, Phaser, and more\n\n* refactor: replace modulated_line_params with per-line apply mods methods\n\nReplaced the fragile modulated_line_params/destination_delta\ndispatch with LineParams::apply_line1_mods/apply_line2_mods\nmethods using direct mod_values[] reads instead of cache.get().\n\nRemoved pre-computed bools has_line_pitch_routes and\nhas_fx_mod_routes along with their dependent methods\nis_line_pitch_destination() and is_fx_destination().\nSwitched apply_env_step_modulation to mod_values[] directly.\n\nAdding a new modulatable line param is now a single-field addition\nin one method rather than touching 3+ files.\n\n* linting\n\n* fix: update dcaBase value in BUILTIN_PRESET_DEFINITIONS for improved sound quality",
          "timestamp": "2026-05-23T12:50:35-04:00",
          "tree_id": "6607a7461ebeca740f03d1bd5c75ab388af031e1",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/58bd3ea98621bb778aa81cdb4e6dfd6e8906713d"
        },
        "date": 1779555414662,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3189622,
            "range": "± 24847",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4907690,
            "range": "± 71054",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6036109,
            "range": "± 23745",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2437238,
            "range": "± 19187",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2804671,
            "range": "± 49224",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3009850,
            "range": "± 29310",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8127814,
            "range": "± 38668",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10788138,
            "range": "± 37321",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12694640,
            "range": "± 44972",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11307631,
            "range": "± 181000",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15815523,
            "range": "± 145898",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17647753,
            "range": "± 59336",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6462800,
            "range": "± 33629",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8625818,
            "range": "± 120292",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9869393,
            "range": "± 33371",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4146374,
            "range": "± 87797",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5728638,
            "range": "± 21386",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6828918,
            "range": "± 23975",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11519064,
            "range": "± 44642",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13219982,
            "range": "± 52311",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13543517,
            "range": "± 255963",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6346435,
            "range": "± 115782",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8817897,
            "range": "± 55058",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10523700,
            "range": "± 48591",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4058458,
            "range": "± 29351",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6309232,
            "range": "± 27850",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7873735,
            "range": "± 39582",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3691576,
            "range": "± 81682",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5738349,
            "range": "± 22591",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7135848,
            "range": "± 26776",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7100311,
            "range": "± 57112",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9630297,
            "range": "± 55029",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11126007,
            "range": "± 68460",
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
          "id": "9f93bd272f273fc4a0152ed80b1cb46158e7cd96",
          "message": "feat: Add sync rate mode and sync division to vibrato, tremolo, and g… (#229)\n\nfeat: Add sync rate mode and sync division to vibrato, tremolo, and grain delay effects\n\n- Implemented rate mode selection (Hz or sync) for vibrato, tremolo, and grain delay effects.\n- Introduced sync division parameter to control timing based on the host tempo.\n- Updated UI components to allow users to switch between Hz and sync modes.\n- Enhanced processing logic to calculate effective rates based on selected mode and transport tempo.\n- Added default values for new parameters in effect presets and parameter structures.\n- Updated relevant tests to cover new functionality and ensure stability.",
          "timestamp": "2026-05-23T19:40:22-04:00",
          "tree_id": "ebc94bcdf0e29dbfaeda811aa05995f36c52f7c7",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/9f93bd272f273fc4a0152ed80b1cb46158e7cd96"
        },
        "date": 1779580009149,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3381386,
            "range": "± 44451",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5181802,
            "range": "± 145315",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6415440,
            "range": "± 76850",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2621094,
            "range": "± 33734",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2843674,
            "range": "± 33152",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3090649,
            "range": "± 18155",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8518084,
            "range": "± 41172",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11639397,
            "range": "± 73509",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13712583,
            "range": "± 59939",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11421909,
            "range": "± 190288",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16305619,
            "range": "± 86169",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18165579,
            "range": "± 66815",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6794691,
            "range": "± 91343",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9227400,
            "range": "± 61636",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10567169,
            "range": "± 88826",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4278225,
            "range": "± 34318",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6048599,
            "range": "± 53158",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7250119,
            "range": "± 44517",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12169411,
            "range": "± 267769",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14034330,
            "range": "± 58909",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14349724,
            "range": "± 43643",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6650771,
            "range": "± 45318",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9451845,
            "range": "± 41474",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11350018,
            "range": "± 53074",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4157605,
            "range": "± 86641",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6669219,
            "range": "± 34001",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8364543,
            "range": "± 30326",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3662329,
            "range": "± 15007",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5716735,
            "range": "± 26002",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7115852,
            "range": "± 42734",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7427730,
            "range": "± 26376",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10283283,
            "range": "± 39251",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11878445,
            "range": "± 94862",
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
          "id": "556bc3a3028290c4c5742d18c50ce32da00e079f",
          "message": "refactor: improve fx mod module frames (#231)\n\nRefactor VibratoModuleRenderer: Simplify control handling and integrate FxSlotKnob components; remove unused code and tests",
          "timestamp": "2026-05-23T23:45:49Z",
          "tree_id": "a1b2f4400c891b36a2dbb06e80d5f4810eabd39c",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/556bc3a3028290c4c5742d18c50ce32da00e079f"
        },
        "date": 1779580326581,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3157650,
            "range": "± 17962",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4842111,
            "range": "± 57985",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5970807,
            "range": "± 209499",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2451618,
            "range": "± 9096",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2759999,
            "range": "± 28475",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2973232,
            "range": "± 34359",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8069538,
            "range": "± 18322",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10688345,
            "range": "± 32581",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12506466,
            "range": "± 35977",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11210044,
            "range": "± 38084",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15628968,
            "range": "± 73393",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17368096,
            "range": "± 44927",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6410403,
            "range": "± 24688",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8477741,
            "range": "± 46001",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9663495,
            "range": "± 45501",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4119273,
            "range": "± 22385",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5699919,
            "range": "± 32369",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6793711,
            "range": "± 20280",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11394528,
            "range": "± 59943",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13060930,
            "range": "± 35116",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13353825,
            "range": "± 79483",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6224232,
            "range": "± 19570",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8605929,
            "range": "± 26934",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10243829,
            "range": "± 24790",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3907960,
            "range": "± 14127",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6062671,
            "range": "± 23375",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7566601,
            "range": "± 27634",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3653209,
            "range": "± 12672",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5607278,
            "range": "± 20511",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6953170,
            "range": "± 40019",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7026363,
            "range": "± 21440",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9442965,
            "range": "± 26190",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 10912365,
            "range": "± 25687",
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
          "id": "d1b9359662fb68ee759b8460398b3746df62a2b1",
          "message": "fix: fx modules not always working",
          "timestamp": "2026-05-24T07:29:58-04:00",
          "tree_id": "b9c29639a731dbae9da483088a9786b20c2f225a",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/d1b9359662fb68ee759b8460398b3746df62a2b1"
        },
        "date": 1779622793340,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2495476,
            "range": "± 54401",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 3847819,
            "range": "± 172996",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 4672909,
            "range": "± 96124",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 1952585,
            "range": "± 9654",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2186508,
            "range": "± 5051",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2353013,
            "range": "± 7812",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 6452182,
            "range": "± 210871",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 8536976,
            "range": "± 96761",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 9982607,
            "range": "± 39768",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 8911999,
            "range": "± 78162",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 12405196,
            "range": "± 84291",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 13799526,
            "range": "± 162556",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 5200491,
            "range": "± 155955",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 6857946,
            "range": "± 36235",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 7820358,
            "range": "± 81073",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3254927,
            "range": "± 12088",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 4495800,
            "range": "± 128029",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 5348574,
            "range": "± 32584",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9115458,
            "range": "± 258690",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 10429371,
            "range": "± 35266",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 10649217,
            "range": "± 38824",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 5044900,
            "range": "± 35369",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 6925513,
            "range": "± 166113",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 8243317,
            "range": "± 269672",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3219468,
            "range": "± 23268",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 4950160,
            "range": "± 21000",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6152197,
            "range": "± 127678",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 2907268,
            "range": "± 11546",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 4426530,
            "range": "± 36357",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 5466091,
            "range": "± 16456",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 5681278,
            "range": "± 28988",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 7604398,
            "range": "± 32629",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 8809868,
            "range": "± 50586",
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
          "id": "88f5f22a1ff3898a5cdcc4e9ba098e6215127586",
          "message": "feat: add new fx (#234)\n\n* feat(cosmo-synth-engine): split new fx from PR 176\n\n* feat: add modulation support for various effects\n\n- Implemented modulation parameters for AutoWah, Flanger, Multimode Filter, Rotary Speaker, and Stereo Widener effects.\n- Added `apply_modulation` methods to respective effect structs to handle modulation values from the modulation matrix.\n- Updated `FxChain` to apply modulated parameters for all active effect slots.\n- Enhanced `params` module to include new modulation destinations for the added effects.\n- Introduced LFO rate mode and sync division options in relevant effect parameters.\n\n* refactor: update FX module configuration and UI integration\n\n- Refactored FX module configuration to utilize a unified metadata structure (FX_UI_META) for better maintainability and consistency.\n- Removed redundant preset titles from various modules to streamline the UI.\n- Updated the SynthSidebarButtons component to integrate modulation target and vintage settings.\n- Enhanced the FxSlotFrame component to reflect changes in effect type selection.\n- Adjusted the ModuleFrame component to remove unnecessary meta props and improve header rendering.\n- Updated tests to align with the new structure and ensure functionality remains intact.\n\n* revert change",
          "timestamp": "2026-05-24T09:37:05-04:00",
          "tree_id": "edc9ea2a5dffd3064776a26bc9b4d37126c50288",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/88f5f22a1ff3898a5cdcc4e9ba098e6215127586"
        },
        "date": 1779630208453,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3088398,
            "range": "± 135736",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4813028,
            "range": "± 39462",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6001280,
            "range": "± 66436",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2394343,
            "range": "± 14326",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2714898,
            "range": "± 11628",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2912365,
            "range": "± 10334",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8612624,
            "range": "± 86846",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11490101,
            "range": "± 75026",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13364516,
            "range": "± 78293",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11701541,
            "range": "± 94541",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16328638,
            "range": "± 75057",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18086401,
            "range": "± 192701",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6674088,
            "range": "± 224093",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8963622,
            "range": "± 58629",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10158955,
            "range": "± 60260",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4305293,
            "range": "± 30606",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5919141,
            "range": "± 38654",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7001786,
            "range": "± 53026",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11762544,
            "range": "± 81102",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13461176,
            "range": "± 61099",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13652890,
            "range": "± 75427",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6408698,
            "range": "± 54842",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8900764,
            "range": "± 61141",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10624130,
            "range": "± 62656",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3898376,
            "range": "± 30640",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6195092,
            "range": "± 64015",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7769013,
            "range": "± 70499",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3496363,
            "range": "± 13172",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5465698,
            "range": "± 28119",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6783663,
            "range": "± 46962",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7377206,
            "range": "± 65537",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10058849,
            "range": "± 325704",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11377747,
            "range": "± 69973",
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
          "id": "67de51491a1d5fe8eb0240ce27a2f24b6a5ef9dc",
          "message": "feat: enhance tooltip display for ControlKnob (#232)\n\n* feat: enhance tooltip display for ControlKnob with delayed reveal and positioning\n\n* tests\n\n* linting",
          "timestamp": "2026-05-24T13:44:38Z",
          "tree_id": "33e06ed080f100d94315ebfd63477ed9d8a1e37a",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/67de51491a1d5fe8eb0240ce27a2f24b6a5ef9dc"
        },
        "date": 1779630664354,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3319425,
            "range": "± 106603",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5151765,
            "range": "± 72615",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6394620,
            "range": "± 74643",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2559281,
            "range": "± 23130",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2872476,
            "range": "± 37945",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3120639,
            "range": "± 45765",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8605988,
            "range": "± 45512",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11802645,
            "range": "± 68301",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13913268,
            "range": "± 68509",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11560278,
            "range": "± 88170",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16319919,
            "range": "± 190841",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18114276,
            "range": "± 157161",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6766673,
            "range": "± 149460",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9162429,
            "range": "± 68350",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10444450,
            "range": "± 81716",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4282009,
            "range": "± 29724",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6012088,
            "range": "± 26489",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7198511,
            "range": "± 88973",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12093652,
            "range": "± 94142",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13878231,
            "range": "± 50087",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14155472,
            "range": "± 188223",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6547540,
            "range": "± 19897",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9302211,
            "range": "± 57756",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11131601,
            "range": "± 71898",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4156936,
            "range": "± 33640",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6619918,
            "range": "± 25937",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8292154,
            "range": "± 46304",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3650410,
            "range": "± 21113",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5712802,
            "range": "± 100907",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7077439,
            "range": "± 68844",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7318464,
            "range": "± 77367",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10100340,
            "range": "± 53533",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11640553,
            "range": "± 51515",
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
          "id": "62a61133809f8cb7da380e4dd97133a64c636370",
          "message": "feat: add grain delay module renderer to FX UI meta",
          "timestamp": "2026-05-24T09:45:48-04:00",
          "tree_id": "b652530d01c92ca555d7b18b52096f428a763a66",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/62a61133809f8cb7da380e4dd97133a64c636370"
        },
        "date": 1779630732074,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3218098,
            "range": "± 109815",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5021936,
            "range": "± 60715",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6225775,
            "range": "± 47891",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2521185,
            "range": "± 10262",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2840689,
            "range": "± 21147",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3106636,
            "range": "± 19062",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8518297,
            "range": "± 57634",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11642410,
            "range": "± 64345",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13685227,
            "range": "± 137140",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11481842,
            "range": "± 71228",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16268146,
            "range": "± 70556",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18055597,
            "range": "± 104553",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6805423,
            "range": "± 20241",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9180672,
            "range": "± 54896",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10475293,
            "range": "± 30275",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4269564,
            "range": "± 115076",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6021597,
            "range": "± 35466",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7210038,
            "range": "± 47882",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12164192,
            "range": "± 413551",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13978391,
            "range": "± 76224",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14200935,
            "range": "± 370689",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6557467,
            "range": "± 22560",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9311361,
            "range": "± 45427",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11111920,
            "range": "± 64679",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4127468,
            "range": "± 26411",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6630760,
            "range": "± 70554",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8291965,
            "range": "± 73148",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3671132,
            "range": "± 214725",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5733870,
            "range": "± 34041",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7095347,
            "range": "± 26815",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7386840,
            "range": "± 65875",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10156351,
            "range": "± 122902",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11708415,
            "range": "± 39474",
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
          "id": "50fdca667c15886621017ed1e48c5d6911384f1a",
          "message": "fix build",
          "timestamp": "2026-05-24T09:59:18-04:00",
          "tree_id": "2320cc263abe19bbe7e78d78e6a302d800a358f0",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/50fdca667c15886621017ed1e48c5d6911384f1a"
        },
        "date": 1779631549981,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3173790,
            "range": "± 91674",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4831674,
            "range": "± 66158",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5929382,
            "range": "± 18302",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2461767,
            "range": "± 18860",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2773790,
            "range": "± 23424",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3022005,
            "range": "± 24661",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8057711,
            "range": "± 167383",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10668243,
            "range": "± 33418",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12541036,
            "range": "± 276170",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11139014,
            "range": "± 134775",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15568853,
            "range": "± 322709",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17386886,
            "range": "± 143246",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6429811,
            "range": "± 34966",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8616064,
            "range": "± 41015",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9750319,
            "range": "± 199677",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4133853,
            "range": "± 147465",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5712369,
            "range": "± 47789",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6820433,
            "range": "± 25994",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11487360,
            "range": "± 708561",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13185783,
            "range": "± 38165",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13364477,
            "range": "± 600456",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6224082,
            "range": "± 43158",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8625944,
            "range": "± 36346",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10279605,
            "range": "± 113372",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3970227,
            "range": "± 106117",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6139097,
            "range": "± 61882",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7635052,
            "range": "± 238742",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3641333,
            "range": "± 29362",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5647876,
            "range": "± 21134",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7026806,
            "range": "± 43256",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7049187,
            "range": "± 219189",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9494091,
            "range": "± 53955",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 10936434,
            "range": "± 38202",
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
          "id": "4c19315e0a6c6e53bd0f821a79c0475a7d58ee71",
          "message": "feat: update audio effect presets and processing parameters\n\n- Refactored audio effect presets to use required parameter types for better type safety.\n- Added new parameters such as time_mode and sync_division to delay, grain delay, and tremolo effects.\n- Updated various presets to include new parameters and adjusted values for consistency.\n- Enhanced the Rust backend to accommodate new parameters in the effect processing logic.",
          "timestamp": "2026-05-24T10:24:03-04:00",
          "tree_id": "f7da9ccd991cca55f680e14c59776090ff994077",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/4c19315e0a6c6e53bd0f821a79c0475a7d58ee71"
        },
        "date": 1779633029544,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3052871,
            "range": "± 70172",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4771895,
            "range": "± 28495",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5958378,
            "range": "± 53169",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2408088,
            "range": "± 8509",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2733884,
            "range": "± 5847",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2941214,
            "range": "± 7649",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8462262,
            "range": "± 38889",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11403912,
            "range": "± 50340",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13368718,
            "range": "± 56922",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11609029,
            "range": "± 66666",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16234530,
            "range": "± 467637",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17988863,
            "range": "± 169808",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6681385,
            "range": "± 59393",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8850864,
            "range": "± 54192",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10108595,
            "range": "± 80204",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4307372,
            "range": "± 27465",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5929751,
            "range": "± 29279",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7042686,
            "range": "± 53054",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11665888,
            "range": "± 74095",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13283985,
            "range": "± 69303",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13528316,
            "range": "± 443255",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6377998,
            "range": "± 43632",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8827172,
            "range": "± 284669",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10494071,
            "range": "± 130693",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3898506,
            "range": "± 32657",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6158203,
            "range": "± 32247",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7764475,
            "range": "± 45623",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3509838,
            "range": "± 18198",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5455654,
            "range": "± 29425",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6764453,
            "range": "± 37264",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7233066,
            "range": "± 79713",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9784555,
            "range": "± 56016",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11213917,
            "range": "± 59159",
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
          "id": "d66ebff63a027296bcee07c5ab0b5b595bbc61bd",
          "message": "fix build",
          "timestamp": "2026-05-24T10:25:23-04:00",
          "tree_id": "52b48580ef6f53eb1f77811be438180e546047b2",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/d66ebff63a027296bcee07c5ab0b5b595bbc61bd"
        },
        "date": 1779633107590,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3049742,
            "range": "± 59950",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4803003,
            "range": "± 35262",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6001524,
            "range": "± 60188",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2418425,
            "range": "± 7233",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2754955,
            "range": "± 7167",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2956385,
            "range": "± 10985",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8616497,
            "range": "± 154751",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11498927,
            "range": "± 51571",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13430176,
            "range": "± 76714",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11616579,
            "range": "± 66446",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16216916,
            "range": "± 64634",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18020608,
            "range": "± 79497",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6637461,
            "range": "± 46710",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8880289,
            "range": "± 74643",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10131053,
            "range": "± 91388",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4312580,
            "range": "± 29895",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5962342,
            "range": "± 40522",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7069746,
            "range": "± 76120",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11653033,
            "range": "± 87857",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13333419,
            "range": "± 98343",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13572577,
            "range": "± 58303",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6356478,
            "range": "± 29225",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8934137,
            "range": "± 66965",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10608029,
            "range": "± 105767",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3914167,
            "range": "± 27528",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6188167,
            "range": "± 57663",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7690757,
            "range": "± 58377",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3492091,
            "range": "± 15440",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5503530,
            "range": "± 45194",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6820718,
            "range": "± 40381",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7249183,
            "range": "± 85251",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9861176,
            "range": "± 75610",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11326747,
            "range": "± 54074",
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
          "id": "9910724a37f31cc317809d2967b6c83ac202f28a",
          "message": "test(cosmo-pd101): Add unit tests for various components and hooks in the synth module (#235)\n\n* Add unit tests for various components and hooks in the synth module\n\n- Implement tests for `useDrawerPanelState` to verify drawer state management.\n- Create tests for `useEnvOverrideHandlers` to ensure correct routing of environment changes.\n- Add tests for `ModMatrixContext` to validate context usage and provider functionality.\n- Replace old `SynthParamController.test.ts` with a new comprehensive test suite for `SynthParamController`.\n- Introduce tests for MIDI learning hooks: `useMidiLearnBindings` and `useMidiLearnTarget`.\n- Add tests for modulation target hooks: `useModulationTarget` and `useSynthParamsToWorklet`.\n- Implement tests for the MIDI learn registry and store to ensure proper functionality.\n- Add tests for preset identity and sources to validate preset handling.\n- Introduce tests for preset tags to ensure correct normalization and inference.\n\n* test: add unit tests for various components in the editor and modals\n\n* fix tests",
          "timestamp": "2026-05-24T17:00:35Z",
          "tree_id": "eb90db439fae9e6ce6456546f085eee746d2b0e5",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/9910724a37f31cc317809d2967b6c83ac202f28a"
        },
        "date": 1779642414990,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3231324,
            "range": "± 88840",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4998455,
            "range": "± 24912",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6157820,
            "range": "± 59517",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2544239,
            "range": "± 13067",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2889117,
            "range": "± 15111",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3135964,
            "range": "± 27732",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8617944,
            "range": "± 73289",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11739154,
            "range": "± 358018",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13846172,
            "range": "± 67140",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11474815,
            "range": "± 48896",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16366877,
            "range": "± 58924",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18165506,
            "range": "± 97325",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6780928,
            "range": "± 394513",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9153622,
            "range": "± 67403",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10451541,
            "range": "± 51955",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4259980,
            "range": "± 22776",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5970405,
            "range": "± 31380",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7113493,
            "range": "± 60684",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12094409,
            "range": "± 51674",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13986054,
            "range": "± 61272",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14254518,
            "range": "± 74500",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6758660,
            "range": "± 45763",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9639816,
            "range": "± 54585",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11536262,
            "range": "± 50702",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4304184,
            "range": "± 108989",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6762386,
            "range": "± 150498",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8492283,
            "range": "± 47966",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3700478,
            "range": "± 19609",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5735960,
            "range": "± 43034",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7088344,
            "range": "± 45136",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7377351,
            "range": "± 85307",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10195545,
            "range": "± 70953",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11693653,
            "range": "± 67139",
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
          "id": "d78f40e0ce7dc0a0e445dbe64474e3b6e496be79",
          "message": "feat: add percent formatting support for ControlKnob input and parsing",
          "timestamp": "2026-05-24T17:07:21-04:00",
          "tree_id": "08569c8d665cff465f6d9c47dcb3ea237025dfab",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/d78f40e0ce7dc0a0e445dbe64474e3b6e496be79"
        },
        "date": 1779657229731,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3226821,
            "range": "± 71799",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4893082,
            "range": "± 87354",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5996194,
            "range": "± 30402",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2536606,
            "range": "± 14130",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2838243,
            "range": "± 24929",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2971083,
            "range": "± 26907",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8611369,
            "range": "± 81461",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11292720,
            "range": "± 91237",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13199730,
            "range": "± 166328",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11145836,
            "range": "± 53396",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15606288,
            "range": "± 260584",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17441773,
            "range": "± 328171",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6432303,
            "range": "± 178406",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8499422,
            "range": "± 23757",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9707550,
            "range": "± 193535",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4124809,
            "range": "± 10277",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5640524,
            "range": "± 23361",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6808397,
            "range": "± 120125",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11376086,
            "range": "± 121722",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13040292,
            "range": "± 57572",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13325058,
            "range": "± 54741",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6256742,
            "range": "± 31223",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8636889,
            "range": "± 39710",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10293820,
            "range": "± 64006",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3999810,
            "range": "± 76629",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6156246,
            "range": "± 50445",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7678620,
            "range": "± 33903",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3682550,
            "range": "± 16427",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5682262,
            "range": "± 27355",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7041506,
            "range": "± 49563",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7039564,
            "range": "± 32278",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9459532,
            "range": "± 186787",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 10949848,
            "range": "± 64731",
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
          "id": "1f59bf9d9e50c4b3abd507fbc38a2b45d1ae5731",
          "message": "feat(cosmo-pd101): add synth-param slider system for EQ and blend (#236)\n\n* feat(cosmo-pd101): add synth-param slider system for EQ and blend\n\n* chore: update cosmo_synth_engine_bg.wasm binary file\n\n* lint\n\n* feat: add ControlValueTooltip and integrate with SynthParamSlider and FxSlotSlider\n\n- Implemented ControlValueTooltip component for displaying control values.\n- Integrated ControlValueTooltip into SynthParamSlider for value display during interaction.\n- Updated FxSlotSlider to utilize ControlValueTooltip for enhanced user feedback.\n- Introduced slider interaction curves with varying sensitivity modes (linear, fine, ultrafine).\n- Added tests for slider interaction curves and utility functions for preset module mapping.\n- Refactored Eq5BandModuleRenderer to use FxVerticalSliderGroup for better layout management.\n- Enhanced utility functions for resolving preset parameters and module keys.\n\n* feat: add flat EQ preset to EQ_PRESETS",
          "timestamp": "2026-05-25T15:16:47Z",
          "tree_id": "05ecdddd0dca410db5dc6ee548f1055c8cbd1977",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/1f59bf9d9e50c4b3abd507fbc38a2b45d1ae5731"
        },
        "date": 1779722581308,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3261537,
            "range": "± 97781",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5031493,
            "range": "± 69093",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6245758,
            "range": "± 70832",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2591023,
            "range": "± 17788",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2887344,
            "range": "± 22896",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3141598,
            "range": "± 67928",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8848633,
            "range": "± 87369",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12162004,
            "range": "± 92749",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14326042,
            "range": "± 118260",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11587856,
            "range": "± 280396",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16414111,
            "range": "± 110610",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18228721,
            "range": "± 119361",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6991693,
            "range": "± 73243",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9337745,
            "range": "± 58471",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10647021,
            "range": "± 76982",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4309806,
            "range": "± 95285",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6146151,
            "range": "± 37813",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7277628,
            "range": "± 51144",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 12285817,
            "range": "± 99373",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14121093,
            "range": "± 353560",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14376243,
            "range": "± 260252",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7197303,
            "range": "± 189998",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9846922,
            "range": "± 121661",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11710772,
            "range": "± 62259",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4442472,
            "range": "± 209533",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7208398,
            "range": "± 168118",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8677928,
            "range": "± 96749",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4125371,
            "range": "± 120836",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 6364720,
            "range": "± 174923",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7896220,
            "range": "± 125726",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7702738,
            "range": "± 97415",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10476192,
            "range": "± 117445",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11991247,
            "range": "± 53868",
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
          "id": "4a60d142fc83a9a81ff8f1826ec2829f1be02e57",
          "message": "fix scaling",
          "timestamp": "2026-05-25T13:49:04-04:00",
          "tree_id": "4eaea9fc7aa376d015564f20a937e75e20967d2b",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/4a60d142fc83a9a81ff8f1826ec2829f1be02e57"
        },
        "date": 1779731729140,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3224104,
            "range": "± 58734",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4859311,
            "range": "± 110699",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5994644,
            "range": "± 40889",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2540408,
            "range": "± 11554",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2843709,
            "range": "± 57869",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3053814,
            "range": "± 10249",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8083002,
            "range": "± 28847",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10732966,
            "range": "± 149386",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12636168,
            "range": "± 55458",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11145301,
            "range": "± 23857",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15607972,
            "range": "± 177929",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17418710,
            "range": "± 61491",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6418438,
            "range": "± 59334",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8487994,
            "range": "± 161309",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9695097,
            "range": "± 248743",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4133595,
            "range": "± 9997",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5661847,
            "range": "± 19079",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6800485,
            "range": "± 176312",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11353806,
            "range": "± 27329",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13021781,
            "range": "± 30468",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13312844,
            "range": "± 332322",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6242742,
            "range": "± 22266",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8636017,
            "range": "± 177754",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10291227,
            "range": "± 23232",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3970106,
            "range": "± 43817",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6139297,
            "range": "± 36692",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7664663,
            "range": "± 33390",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3690857,
            "range": "± 10929",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5699197,
            "range": "± 181162",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7080319,
            "range": "± 32124",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7022578,
            "range": "± 32342",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9449396,
            "range": "± 103308",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 10913147,
            "range": "± 28117",
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
          "id": "db9e295ada262f1fb171e412247638e16dc84634",
          "message": "feat: bring back the fx module power toggle (#238)\n\nbring back the fx module power toggle",
          "timestamp": "2026-05-25T20:51:23Z",
          "tree_id": "bef4f0f3e3f6510c920b6749d748a159ad22d770",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/db9e295ada262f1fb171e412247638e16dc84634"
        },
        "date": 1779742651341,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2525344,
            "range": "± 42497",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 3781426,
            "range": "± 11675",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 4666189,
            "range": "± 18988",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 1977812,
            "range": "± 6483",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2200363,
            "range": "± 9507",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2370257,
            "range": "± 8875",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 6341868,
            "range": "± 124391",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 8383476,
            "range": "± 36782",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 9860961,
            "range": "± 204176",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 8696432,
            "range": "± 17717",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 12166965,
            "range": "± 34201",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 13582751,
            "range": "± 59999",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 5069027,
            "range": "± 17467",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 6681936,
            "range": "± 36587",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 7622506,
            "range": "± 33785",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3225935,
            "range": "± 15021",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 4407831,
            "range": "± 24803",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 5279706,
            "range": "± 31690",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8877917,
            "range": "± 29557",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 10168995,
            "range": "± 46557",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 10383752,
            "range": "± 50916",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 4932375,
            "range": "± 18041",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 6770444,
            "range": "± 20881",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 8069191,
            "range": "± 67606",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3123356,
            "range": "± 13701",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 4798602,
            "range": "± 19841",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 5975103,
            "range": "± 17661",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 2881404,
            "range": "± 12072",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 4421919,
            "range": "± 13714",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 5485495,
            "range": "± 28898",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 5537742,
            "range": "± 13047",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 7416163,
            "range": "± 24073",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 8551726,
            "range": "± 162894",
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
          "id": "30b4858e47ba17e0596189d5a2169aacdc1e7fed",
          "message": "feat: improve synth renderer scaling (#239)\n\n* Improve synthrenderer scaling\n\n* lint\n\n* fix wavetable viz",
          "timestamp": "2026-05-25T21:19:02Z",
          "tree_id": "ce583955509186b9c1501408a83b7ed0a02f393a",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/30b4858e47ba17e0596189d5a2169aacdc1e7fed"
        },
        "date": 1779744326385,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3237863,
            "range": "± 49458",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4867342,
            "range": "± 110198",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6138855,
            "range": "± 43492",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2754909,
            "range": "± 58448",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2949699,
            "range": "± 22705",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3064709,
            "range": "± 77715",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8146097,
            "range": "± 31903",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10777697,
            "range": "± 66595",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12670317,
            "range": "± 35278",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11164017,
            "range": "± 30334",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15615953,
            "range": "± 25539",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17509996,
            "range": "± 37174",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6432452,
            "range": "± 21089",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8504913,
            "range": "± 37635",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9705855,
            "range": "± 32967",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4135728,
            "range": "± 93632",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5673176,
            "range": "± 30666",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6797776,
            "range": "± 64993",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11359916,
            "range": "± 121828",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13023456,
            "range": "± 40066",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13328973,
            "range": "± 40112",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6300139,
            "range": "± 24657",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8645886,
            "range": "± 30708",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10306565,
            "range": "± 58321",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3971539,
            "range": "± 78884",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6131075,
            "range": "± 51437",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7663125,
            "range": "± 76419",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3710205,
            "range": "± 12643",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5677593,
            "range": "± 40169",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7054842,
            "range": "± 24883",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7033275,
            "range": "± 29154",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9477911,
            "range": "± 26530",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 10944051,
            "range": "± 25345",
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
          "id": "cb2855a2667f2932b2a734a5249a599ec4331f3c",
          "message": "feat: Enhance audio unit view configuration handling and keyboard height clamping\n\n- Added support for view configuration selection in CosmoPd101AudioUnit, allowing the audio unit to adapt to host view sizes.\n- Implemented a method to determine the preferred size based on the current context in CosmoPd101ViewController.\n- Updated the PluginPage component to clamp the keyboard height based on viewport dimensions, ensuring a better user experience across different screen sizes.\n- Introduced utility functions for clamping keyboard height and calculating preferred content sizes.\n- Updated tests to validate the new keyboard height clamping logic.",
          "timestamp": "2026-05-25T19:37:50-04:00",
          "tree_id": "03f093ab26f04590e74b4fb49a1c6cd7140379f2",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/cb2855a2667f2932b2a734a5249a599ec4331f3c"
        },
        "date": 1779752649763,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3220835,
            "range": "± 132948",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5018293,
            "range": "± 75924",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6219878,
            "range": "± 21490",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2514219,
            "range": "± 14274",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2830256,
            "range": "± 15812",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3083951,
            "range": "± 27092",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8665562,
            "range": "± 118985",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11924861,
            "range": "± 187021",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14090257,
            "range": "± 140540",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11397842,
            "range": "± 39893",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16188767,
            "range": "± 66307",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17941938,
            "range": "± 82974",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6711931,
            "range": "± 17329",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9151076,
            "range": "± 198891",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10519356,
            "range": "± 19247",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4241643,
            "range": "± 16035",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5991774,
            "range": "± 24461",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7155149,
            "range": "± 42728",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11994017,
            "range": "± 41691",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13854099,
            "range": "± 108221",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14125001,
            "range": "± 88534",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6573836,
            "range": "± 52796",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9373387,
            "range": "± 63995",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11282621,
            "range": "± 37740",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4188253,
            "range": "± 21418",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6749745,
            "range": "± 119181",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8480431,
            "range": "± 64751",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3767533,
            "range": "± 83424",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5705044,
            "range": "± 179312",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7510247,
            "range": "± 214168",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7357208,
            "range": "± 35788",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10158796,
            "range": "± 32909",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11684714,
            "range": "± 33310",
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
          "id": "d9f3a70371851fdcf22593f967df6f3555d62d65",
          "message": "feat: refactor Scope context and related components for improved state management (#240)",
          "timestamp": "2026-05-25T23:43:10Z",
          "tree_id": "e0c8e41445802a99d4ac35ba0f42704a8bea029f",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/d9f3a70371851fdcf22593f967df6f3555d62d65"
        },
        "date": 1779752971692,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3305122,
            "range": "± 152029",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4914139,
            "range": "± 40604",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6025257,
            "range": "± 22420",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2552568,
            "range": "± 15956",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2862965,
            "range": "± 43708",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3062082,
            "range": "± 16480",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8139115,
            "range": "± 22720",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11013364,
            "range": "± 209737",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13037289,
            "range": "± 66772",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11421672,
            "range": "± 52983",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15739597,
            "range": "± 77980",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17566454,
            "range": "± 97197",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6450069,
            "range": "± 24495",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8684544,
            "range": "± 36708",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9761454,
            "range": "± 45507",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4176290,
            "range": "± 28531",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5718876,
            "range": "± 52902",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6866747,
            "range": "± 45746",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11561721,
            "range": "± 88922",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13046699,
            "range": "± 157325",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13333810,
            "range": "± 301934",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6252807,
            "range": "± 17475",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8627347,
            "range": "± 25869",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10472489,
            "range": "± 231905",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3989084,
            "range": "± 27765",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6345692,
            "range": "± 32507",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7892771,
            "range": "± 57437",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3743844,
            "range": "± 18992",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5696875,
            "range": "± 111843",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7067455,
            "range": "± 60845",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7071569,
            "range": "± 33918",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9754852,
            "range": "± 126511",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 10996819,
            "range": "± 31288",
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
          "id": "1a8b19d80cbd98323a4753c89367c8398be05d89",
          "message": "refactor(cosmo-pd101): eliminate ~50 drilled props with contexts and zustand (#241)\n\n- PresetManagerContext: new context for preset CRUD, dropped 16+14 drilled props\n  from SynthHeader and SynthRendererLibraryOverlay\n- synthUiStore: added 5 modal open states, removed 12 drilled modal/callback props\n- Drawer state: useDrawerPanelState moved into SynthRendererDrawer, dropped 4 props\n- useEnvOverrideHandlers: deleted (redundant — PhaseLinesSection already had setters)\n- SynthSidebar: reads waveDrawerOpen/midiLearnOpen from store, no props needed",
          "timestamp": "2026-05-26T00:28:17Z",
          "tree_id": "0be27c3a8edf3f97615135917f44845d0b6cc0e4",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/1a8b19d80cbd98323a4753c89367c8398be05d89"
        },
        "date": 1779755679156,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3264586,
            "range": "± 43549",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5047451,
            "range": "± 20458",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6247162,
            "range": "± 149550",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2536582,
            "range": "± 29791",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2856135,
            "range": "± 27969",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3085965,
            "range": "± 30839",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8629377,
            "range": "± 181081",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11778080,
            "range": "± 73458",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13912753,
            "range": "± 54714",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11399438,
            "range": "± 298269",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16240769,
            "range": "± 176560",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17986577,
            "range": "± 151465",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6712056,
            "range": "± 227817",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9157405,
            "range": "± 62639",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10499371,
            "range": "± 135825",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4258789,
            "range": "± 36074",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6008777,
            "range": "± 21866",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7179786,
            "range": "± 17132",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11974499,
            "range": "± 36032",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13831521,
            "range": "± 42244",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14160285,
            "range": "± 288931",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6612687,
            "range": "± 21942",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9416481,
            "range": "± 66064",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11303046,
            "range": "± 49158",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4206664,
            "range": "± 26773",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6761327,
            "range": "± 19029",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8514337,
            "range": "± 194741",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3639411,
            "range": "± 7783",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5669294,
            "range": "± 51464",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7015321,
            "range": "± 18512",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7472114,
            "range": "± 13524",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10333207,
            "range": "± 68756",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11927375,
            "range": "± 34036",
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
          "id": "14bbcc63206da787630d0e841e47c23f189e7f2f",
          "message": "update engine",
          "timestamp": "2026-05-25T20:33:58-04:00",
          "tree_id": "1072093fc287710dd9f24f01fb05c976412e12f7",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/14bbcc63206da787630d0e841e47c23f189e7f2f"
        },
        "date": 1779756015266,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3231096,
            "range": "± 13589",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5022010,
            "range": "± 11947",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6225929,
            "range": "± 14607",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2522878,
            "range": "± 9145",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2834921,
            "range": "± 10314",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3065924,
            "range": "± 9544",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8442858,
            "range": "± 101153",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11765947,
            "range": "± 150548",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13868047,
            "range": "± 541739",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11361392,
            "range": "± 34313",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16165273,
            "range": "± 293443",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17957314,
            "range": "± 86954",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6683668,
            "range": "± 10339",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9156194,
            "range": "± 128906",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10533155,
            "range": "± 42828",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4244223,
            "range": "± 9061",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5990895,
            "range": "± 13855",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7156509,
            "range": "± 78134",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11916476,
            "range": "± 40950",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13777865,
            "range": "± 40252",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14066704,
            "range": "± 159223",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6574074,
            "range": "± 14017",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9371598,
            "range": "± 270939",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11291842,
            "range": "± 67018",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4181713,
            "range": "± 37810",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6729705,
            "range": "± 132748",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8460282,
            "range": "± 270151",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3651712,
            "range": "± 80803",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5942841,
            "range": "± 165818",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7504512,
            "range": "± 201708",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7286693,
            "range": "± 14823",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10140757,
            "range": "± 45106",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11681207,
            "range": "± 387160",
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
          "id": "322a80ca26b9f1f2b790ee5221464c71965a3e31",
          "message": "fix: improve note stealing logic (#244)\n\nimprove note stealing logic\n\nThis PR actually improves performance in most scenarios.",
          "timestamp": "2026-05-26T10:08:15-04:00",
          "tree_id": "9025750d5f0dad58ef7f25e0674003db8ee62dab",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/322a80ca26b9f1f2b790ee5221464c71965a3e31"
        },
        "date": 1779804877353,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3189477,
            "range": "± 191573",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4882358,
            "range": "± 58431",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6009034,
            "range": "± 47834",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2230774,
            "range": "± 24766",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2237421,
            "range": "± 22201",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2236330,
            "range": "± 23134",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8281052,
            "range": "± 46365",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10977413,
            "range": "± 69294",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12850626,
            "range": "± 36987",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10227036,
            "range": "± 45588",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 14798572,
            "range": "± 31844",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17456498,
            "range": "± 41483",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6298610,
            "range": "± 29186",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8414882,
            "range": "± 128647",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9696806,
            "range": "± 43401",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4148164,
            "range": "± 134522",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5719717,
            "range": "± 37454",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6870321,
            "range": "± 29874",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8701484,
            "range": "± 46295",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 11919464,
            "range": "± 51771",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13221617,
            "range": "± 166328",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6207252,
            "range": "± 30456",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8591527,
            "range": "± 40929",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10244746,
            "range": "± 59042",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3915169,
            "range": "± 16246",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6097952,
            "range": "± 29088",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7608280,
            "range": "± 27185",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3641220,
            "range": "± 9052",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5670308,
            "range": "± 20425",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7088575,
            "range": "± 31610",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 6967331,
            "range": "± 36168",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9468572,
            "range": "± 47165",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11046563,
            "range": "± 49517",
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
          "id": "68e684995ca54a2a160b009086d9092b067644a2",
          "message": "feat: add GitHub release version update indicator to bottom bar (#243)\n\n* feat: add GitHub release version update indicator to bottom bar\n\n* feat: implement UpdateNotification component with GitHub release integration and UI tests",
          "timestamp": "2026-05-26T14:43:21Z",
          "tree_id": "e417c8df4922280a0b5bb011afefd3d48e46534a",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/68e684995ca54a2a160b009086d9092b067644a2"
        },
        "date": 1779806983128,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3235338,
            "range": "± 118069",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4958021,
            "range": "± 65340",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6136440,
            "range": "± 38135",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2312205,
            "range": "± 25584",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2305658,
            "range": "± 24276",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2306361,
            "range": "± 24332",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8197976,
            "range": "± 21623",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10901210,
            "range": "± 36615",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12748416,
            "range": "± 124815",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10195684,
            "range": "± 30953",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 14730976,
            "range": "± 38452",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17395862,
            "range": "± 46630",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6322098,
            "range": "± 30230",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8409168,
            "range": "± 62777",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9714500,
            "range": "± 30204",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4169103,
            "range": "± 30070",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5759223,
            "range": "± 36791",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6881548,
            "range": "± 113104",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8754567,
            "range": "± 32436",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 11961959,
            "range": "± 145664",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13276585,
            "range": "± 47552",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6321385,
            "range": "± 54739",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8650767,
            "range": "± 34600",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10288154,
            "range": "± 31769",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3955034,
            "range": "± 35022",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6179039,
            "range": "± 35750",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7683346,
            "range": "± 39996",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3720118,
            "range": "± 28857",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5761170,
            "range": "± 24986",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7187792,
            "range": "± 25059",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 6943054,
            "range": "± 37608",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9415760,
            "range": "± 181722",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 10995417,
            "range": "± 105035",
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
          "id": "6bc839347e5bb7f1275fc9073c96be63d3df2401",
          "message": "feat(livepage): responsive mobile layout with full-height synth (#245)\n\n* feat(livepage): responsive mobile layout with full-height synth renderer\n\n- Use is-mobile package for reliable mobile device detection\n- Remove bg-black and animated backgrounds on mobile\n- Use height-based synth scaling on mobile (fills full viewport height)\n- Disable padding and scale cap on mobile viewports\n\n* fix(livepage): fit bounds on mobile portrait instead of forcing full height",
          "timestamp": "2026-05-26T15:14:11Z",
          "tree_id": "4de675e37ee65d88d98da4caebc274daa95a80a0",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/6bc839347e5bb7f1275fc9073c96be63d3df2401"
        },
        "date": 1779808840247,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3230797,
            "range": "± 57946",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5076947,
            "range": "± 186898",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6247633,
            "range": "± 50552",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2301962,
            "range": "± 59058",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2310891,
            "range": "± 64840",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2320286,
            "range": "± 24254",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8495170,
            "range": "± 73578",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11645499,
            "range": "± 74145",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13806882,
            "range": "± 319102",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10363033,
            "range": "± 81330",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15413288,
            "range": "± 298411",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18202119,
            "range": "± 183894",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6633939,
            "range": "± 167995",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9123510,
            "range": "± 80875",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10590598,
            "range": "± 91887",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4318470,
            "range": "± 123206",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6150485,
            "range": "± 84662",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7308634,
            "range": "± 77261",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9263044,
            "range": "± 587203",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12783800,
            "range": "± 79534",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14080065,
            "range": "± 82946",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6660856,
            "range": "± 184103",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9487447,
            "range": "± 56538",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11251844,
            "range": "± 55713",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4177991,
            "range": "± 138797",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6656410,
            "range": "± 52751",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8472628,
            "range": "± 58915",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3731416,
            "range": "± 47972",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5886820,
            "range": "± 65868",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7259342,
            "range": "± 79469",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7364983,
            "range": "± 70616",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10221313,
            "range": "± 70232",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11833466,
            "range": "± 240780",
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
          "id": "4088a7113a6007f72cc6edf8af248561a68f4c67",
          "message": "feat: upgrade 5-band EQ to 8-band with shelves and peaking filters (#246)\n\nfeat!(eq): upgrade 5-band EQ to 8-band with low/high shelves and peaking filters\n\nExpand the EQ effect from 5 to 8 bands (64/125/250/500/1k/2k/4k/8k Hz)\nwith low-shelf and high-shelf endpoints and 6 peaking bands in between.\nNarrower sliders and ruler ticks fit the 8-column layout.\n\nBREAKING CHANGE: Renames Eq5Band/Eq5BandModuleRenderer to Eq8Band.\nAll param keys change from frequency-based (gain80, gain240, etc.) to\nposition-based (gainBand1-gainBand8). Corresponding modulation\ndestinations rename from EqGain80-EqGain8000 to EqGainBand1-EqGainBand8.",
          "timestamp": "2026-05-26T15:19:05Z",
          "tree_id": "47aa722d0c4e6406b196385aa9e7dcb64201861f",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/4088a7113a6007f72cc6edf8af248561a68f4c67"
        },
        "date": 1779809125195,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3238087,
            "range": "± 182305",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4809634,
            "range": "± 107788",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5999629,
            "range": "± 130441",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2226781,
            "range": "± 51470",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2233683,
            "range": "± 47828",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2223508,
            "range": "± 46495",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8594466,
            "range": "± 229885",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11704017,
            "range": "± 233027",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13760838,
            "range": "± 200549",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10314891,
            "range": "± 116916",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15229278,
            "range": "± 219662",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17943260,
            "range": "± 324203",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6499572,
            "range": "± 98527",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8860667,
            "range": "± 195528",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10293238,
            "range": "± 62085",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4392298,
            "range": "± 37448",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6124665,
            "range": "± 38804",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7335226,
            "range": "± 53856",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9234704,
            "range": "± 93293",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12723967,
            "range": "± 69552",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13985225,
            "range": "± 58680",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6522297,
            "range": "± 28117",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9269669,
            "range": "± 24486",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11079535,
            "range": "± 64818",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4104210,
            "range": "± 29197",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6551860,
            "range": "± 42129",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8186502,
            "range": "± 53721",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3672879,
            "range": "± 31774",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5703446,
            "range": "± 47258",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7072868,
            "range": "± 45109",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7165303,
            "range": "± 23211",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9991116,
            "range": "± 51929",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11614895,
            "range": "± 67563",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ea912a3285bba7f4c4b152f103cebe98792eda6b",
          "message": "chore(deps): update cargo non-major dependencies (#237)\n\n* chore(deps): update cargo non-major dependencies\n\n* update for latest truce\n\n---------\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>\nCo-authored-by: Felix Perron-Brault <fpbrault@gmail.com>",
          "timestamp": "2026-05-26T15:52:55Z",
          "tree_id": "e7f5ed2fae24380b22a2b107ef9843b61c102e74",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/ea912a3285bba7f4c4b152f103cebe98792eda6b"
        },
        "date": 1779811155113,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3156303,
            "range": "± 152043",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4792593,
            "range": "± 29253",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5954726,
            "range": "± 13717",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2214784,
            "range": "± 10686",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2220674,
            "range": "± 10425",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2223689,
            "range": "± 11670",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8381127,
            "range": "± 82181",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11042514,
            "range": "± 74105",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12868043,
            "range": "± 48835",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10281270,
            "range": "± 39599",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 14811533,
            "range": "± 29765",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17497676,
            "range": "± 34633",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6396602,
            "range": "± 55287",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8429659,
            "range": "± 82989",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9630724,
            "range": "± 109413",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4183212,
            "range": "± 54012",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5697820,
            "range": "± 65223",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6722011,
            "range": "± 117828",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8879818,
            "range": "± 47529",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 11933195,
            "range": "± 83757",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13402179,
            "range": "± 94931",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6247333,
            "range": "± 14000",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8583379,
            "range": "± 22896",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10229581,
            "range": "± 47412",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3901737,
            "range": "± 59031",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6092420,
            "range": "± 530640",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7550098,
            "range": "± 32587",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3670531,
            "range": "± 31138",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5686406,
            "range": "± 14553",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7088159,
            "range": "± 15266",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 6913850,
            "range": "± 21162",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9421077,
            "range": "± 18740",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 10997516,
            "range": "± 41809",
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
          "id": "98593ae7175cc00c4d52e084351057c85b381324",
          "message": "chore: remove dead code, unused deps and unused exports (#247)\n\n* remove dead code\n\n* feat: add hideToggle prop to ModuleFrame and update related modules\n\n* chore: update tailwindcss to 4.3.0 and playwright to 1.60.0\n\n* chore: downgrade playwright to version 1.59.1\n\n* chore: update playwright to version 1.60.0\n\n* fix webview subpackage not being found",
          "timestamp": "2026-05-26T12:42:16-04:00",
          "tree_id": "b477836e852175b609ed2be13eee73c92d812967",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/98593ae7175cc00c4d52e084351057c85b381324"
        },
        "date": 1779814111761,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3033605,
            "range": "± 134491",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4776044,
            "range": "± 34810",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5918166,
            "range": "± 21252",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2183532,
            "range": "± 93242",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2197154,
            "range": "± 26262",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2210903,
            "range": "± 28091",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8699427,
            "range": "± 78462",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11615294,
            "range": "± 147906",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13446452,
            "range": "± 93682",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10491180,
            "range": "± 80677",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15228184,
            "range": "± 123512",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18004682,
            "range": "± 61664",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6507758,
            "range": "± 19526",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8771969,
            "range": "± 199191",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10063537,
            "range": "± 87863",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4345425,
            "range": "± 30096",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5961740,
            "range": "± 59502",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7057442,
            "range": "± 46445",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8913010,
            "range": "± 47886",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12130685,
            "range": "± 230303",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13340215,
            "range": "± 52477",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6353185,
            "range": "± 10721",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8883050,
            "range": "± 60867",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10454937,
            "range": "± 68533",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3874867,
            "range": "± 8383",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6144068,
            "range": "± 36976",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7648519,
            "range": "± 27023",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3483447,
            "range": "± 6555",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5435824,
            "range": "± 12766",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6733414,
            "range": "± 13654",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7132988,
            "range": "± 29658",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9725506,
            "range": "± 46845",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11265023,
            "range": "± 51295",
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
          "id": "14284f1392ef93b4ae65caddaff7aaa51852dd7f",
          "message": "revert to previous scaling method",
          "timestamp": "2026-05-26T14:04:04-04:00",
          "tree_id": "eff40fb24ec878edfccf8d1855c28bf1491b9329",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/14284f1392ef93b4ae65caddaff7aaa51852dd7f"
        },
        "date": 1779819024122,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3219789,
            "range": "± 15295",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5018625,
            "range": "± 61741",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6229129,
            "range": "± 25362",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2311880,
            "range": "± 15010",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2319020,
            "range": "± 7878",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2315464,
            "range": "± 32304",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8550465,
            "range": "± 40498",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11701295,
            "range": "± 242670",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13782253,
            "range": "± 29224",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10245973,
            "range": "± 20200",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15153519,
            "range": "± 39442",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17884858,
            "range": "± 203762",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6471783,
            "range": "± 126008",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8818267,
            "range": "± 25741",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10197183,
            "range": "± 29003",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4322535,
            "range": "± 14016",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6078192,
            "range": "± 18112",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7256693,
            "range": "± 23136",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9063547,
            "range": "± 34145",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12567137,
            "range": "± 37936",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13885256,
            "range": "± 64273",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6494604,
            "range": "± 29068",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9240643,
            "range": "± 36340",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11023985,
            "range": "± 40164",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4067404,
            "range": "± 14905",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6536556,
            "range": "± 58333",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8145660,
            "range": "± 29078",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3683573,
            "range": "± 9115",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5728889,
            "range": "± 19673",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7093953,
            "range": "± 20605",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7186811,
            "range": "± 43103",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10003211,
            "range": "± 56308",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11637141,
            "range": "± 62596",
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
          "id": "4a37ba44ecf4679a53d5fffe606551aa1d6cc1df",
          "message": "make gumroad upload automatic",
          "timestamp": "2026-05-26T20:59:20-04:00",
          "tree_id": "fa18f18a6ddb407e130c312d4195f3a1ffea7432",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/4a37ba44ecf4679a53d5fffe606551aa1d6cc1df"
        },
        "date": 1779843940682,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3159157,
            "range": "± 41331",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4793571,
            "range": "± 120825",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5963877,
            "range": "± 21190",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2217177,
            "range": "± 19886",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2220184,
            "range": "± 6534",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2224821,
            "range": "± 6320",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8192188,
            "range": "± 16769",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10845914,
            "range": "± 51240",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12658282,
            "range": "± 23468",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10261409,
            "range": "± 66874",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 14990462,
            "range": "± 25734",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17743014,
            "range": "± 29725",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6217696,
            "range": "± 32309",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8308815,
            "range": "± 19758",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9584224,
            "range": "± 18094",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4160255,
            "range": "± 66943",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5710720,
            "range": "± 18360",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6848158,
            "range": "± 14192",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8897219,
            "range": "± 42878",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12262828,
            "range": "± 20500",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13572017,
            "range": "± 25436",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6198297,
            "range": "± 12890",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8545222,
            "range": "± 35569",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10192173,
            "range": "± 42530",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3898850,
            "range": "± 15770",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6271179,
            "range": "± 119004",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7548182,
            "range": "± 162490",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3676334,
            "range": "± 11645",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5687314,
            "range": "± 21140",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7097095,
            "range": "± 20757",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7027766,
            "range": "± 26760",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9647635,
            "range": "± 31108",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11280832,
            "range": "± 25357",
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
          "id": "a2e7b08be097cd8b01b79f7721da59d9645cf25d",
          "message": "feat(cosmo-pd101): add user FX module presets with IndexedDB storage (#249)\n\n- New fxModulePresetStorage.ts for user FX preset CRUD in IndexedDB\n- Bumped preset storage DB to v2 with fxModulePresets object store\n- useFxModuleController now loads user presets, merges with builtins\n- Auto-selects first preset when a new FX module type is added\n- ModulePresetPopover adds Save/Delete options (builtins protected)\n- Save dialog uses DaisyUI modal pattern (native <dialog>)\n- All 6 custom renderers pass through new preset management props",
          "timestamp": "2026-05-27T09:56:14-04:00",
          "tree_id": "225910fb8edcf956ed34a57a1b0fac58f0767caa",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/a2e7b08be097cd8b01b79f7721da59d9645cf25d"
        },
        "date": 1779890563115,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3344714,
            "range": "± 122255",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5163848,
            "range": "± 58536",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6398242,
            "range": "± 84760",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2349970,
            "range": "± 22801",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2371864,
            "range": "± 23760",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2346241,
            "range": "± 22195",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8647564,
            "range": "± 75259",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11897474,
            "range": "± 60012",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14004780,
            "range": "± 102784",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10454782,
            "range": "± 95191",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15378731,
            "range": "± 68239",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18152356,
            "range": "± 126671",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6657877,
            "range": "± 69169",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9018735,
            "range": "± 75594",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10370780,
            "range": "± 67581",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4418629,
            "range": "± 32808",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6218317,
            "range": "± 63949",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7366141,
            "range": "± 61461",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9194811,
            "range": "± 72331",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12824553,
            "range": "± 52286",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14091117,
            "range": "± 46771",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6591632,
            "range": "± 36872",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9402043,
            "range": "± 316822",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11201926,
            "range": "± 81323",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4185258,
            "range": "± 32116",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6676410,
            "range": "± 47861",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8315477,
            "range": "± 40494",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3756260,
            "range": "± 22069",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5867011,
            "range": "± 35737",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7201397,
            "range": "± 46160",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7346498,
            "range": "± 41396",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10230155,
            "range": "± 36609",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11792379,
            "range": "± 42774",
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
          "id": "073d2c2e6b160a00824d1fa0f18e3fce00315f6a",
          "message": "fix: disable auto-select of first FX module preset",
          "timestamp": "2026-05-27T10:20:55-04:00",
          "tree_id": "c4305a381540f7dd3148e481d140ff00ce1f8b08",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/073d2c2e6b160a00824d1fa0f18e3fce00315f6a"
        },
        "date": 1779892042567,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3158718,
            "range": "± 20065",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4827461,
            "range": "± 161632",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5978324,
            "range": "± 208339",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2238765,
            "range": "± 67025",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2241999,
            "range": "± 46830",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2238300,
            "range": "± 14526",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8181784,
            "range": "± 37159",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10896291,
            "range": "± 28485",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12698665,
            "range": "± 1116348",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10114070,
            "range": "± 34083",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 14712926,
            "range": "± 34258",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17462380,
            "range": "± 178322",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6248316,
            "range": "± 165253",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8404731,
            "range": "± 81162",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9731256,
            "range": "± 89758",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4154951,
            "range": "± 16093",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5779137,
            "range": "± 179458",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6935424,
            "range": "± 32213",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8770850,
            "range": "± 285143",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12002808,
            "range": "± 74384",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13242717,
            "range": "± 58595",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6217624,
            "range": "± 139175",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8572787,
            "range": "± 160016",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10229422,
            "range": "± 162641",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3935775,
            "range": "± 122497",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6078238,
            "range": "± 33881",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7575028,
            "range": "± 156915",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3636186,
            "range": "± 163814",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5649514,
            "range": "± 22417",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7064765,
            "range": "± 124413",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 6901951,
            "range": "± 169972",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9429816,
            "range": "± 41633",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11002894,
            "range": "± 299325",
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
          "id": "bb3f6b3dc83ea1f4dc1fa73ee965186174f6b27f",
          "message": "refactor: move FX Presets ownership to engine (#251)\n\n* Refactor FX Presets to Use Structs for Improved Maintainability\n\n- Introduced preset structs for various effects (Multimode Filter, Phase Mod, Phaser, Reverb, Ring Mod, Rotary Speaker, Shimmer Verb, Stereo Widener, Tremolo, Vibrato, Wavefolder).\n- Replaced hardcoded preset values in apply functions with structured data, enhancing readability and reducing duplication.\n- Added new LFO and Mod Envelope presets with corresponding data structures.\n- Updated apply functions to utilize new preset data structures for cleaner code and easier future modifications.\n\n* chore: remove baseview subproject dependency\n\n* test: add comprehensive tests for LFO and Mod Env presets",
          "timestamp": "2026-05-28T17:34:49Z",
          "tree_id": "c919052eea627c1939e9710be1421c64a36d796f",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/bb3f6b3dc83ea1f4dc1fa73ee965186174f6b27f"
        },
        "date": 1779990068909,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3156786,
            "range": "± 54316",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4857821,
            "range": "± 112835",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6008742,
            "range": "± 34843",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2248943,
            "range": "± 30632",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2256320,
            "range": "± 26421",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2271641,
            "range": "± 30054",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8129864,
            "range": "± 233203",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10814753,
            "range": "± 36338",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12601966,
            "range": "± 63453",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10127404,
            "range": "± 82862",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 14588089,
            "range": "± 53895",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17264315,
            "range": "± 79651",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6256858,
            "range": "± 42005",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8350040,
            "range": "± 40436",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9621473,
            "range": "± 21876",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4132388,
            "range": "± 9263",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5739553,
            "range": "± 130521",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6895610,
            "range": "± 158102",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8679560,
            "range": "± 26866",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 11796835,
            "range": "± 34138",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13151724,
            "range": "± 37218",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6099612,
            "range": "± 137988",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8601976,
            "range": "± 122979",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10202150,
            "range": "± 55671",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3808285,
            "range": "± 158759",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6052621,
            "range": "± 22930",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7584335,
            "range": "± 21178",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3679337,
            "range": "± 34999",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5659288,
            "range": "± 16377",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7071434,
            "range": "± 16397",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 6781576,
            "range": "± 216208",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9292940,
            "range": "± 163739",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 10906117,
            "range": "± 34149",
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
          "id": "b13e82b719bf4ff0a599311f56dcbfff6bf4a2f2",
          "message": "feat(cosmo-pd101): categorized FX type selector panel with icons (#248)\n\n* feat(cosmo-pd101): replace FX type dropdown with categorized popover panel\n\nReplace the single-column scrolling dropdown with a 480px popover panel\nfeaturing 6 categorized effect groups, inline SVG icons for all 22 FX\ntypes, and a compact grid layout with color-coded tiles.\n\n- Add fxTypeCategories.ts with category definitions and SVG icon paths\n- Add FxTypeSelectorPopover.tsx with portal-based categorized grid panel\n- Update FxSlotFrame.tsx to use new popover component\n\n* feat(fx): restructure FX type selector to 3-column layout with full labels",
          "timestamp": "2026-05-28T14:17:49-04:00",
          "tree_id": "35360e4b62724fa91b3b70bad460cf8ef37bc60a",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/b13e82b719bf4ff0a599311f56dcbfff6bf4a2f2"
        },
        "date": 1779992657362,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3169923,
            "range": "± 44456",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4871512,
            "range": "± 66898",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6010742,
            "range": "± 25454",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2232473,
            "range": "± 74533",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2232745,
            "range": "± 25004",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2236635,
            "range": "± 67507",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8126853,
            "range": "± 76407",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10811792,
            "range": "± 89516",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12596428,
            "range": "± 58318",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10002438,
            "range": "± 47661",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 14571386,
            "range": "± 95385",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17263599,
            "range": "± 105980",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6226077,
            "range": "± 82971",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8299795,
            "range": "± 68266",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9549322,
            "range": "± 180289",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4123616,
            "range": "± 99106",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5698321,
            "range": "± 42805",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6828184,
            "range": "± 30499",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8572885,
            "range": "± 55733",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 11749611,
            "range": "± 198577",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 12974878,
            "range": "± 135939",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6116242,
            "range": "± 41622",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8571638,
            "range": "± 236271",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10224755,
            "range": "± 67198",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3861259,
            "range": "± 31534",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6087766,
            "range": "± 103115",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7594556,
            "range": "± 35406",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3653953,
            "range": "± 22309",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5547064,
            "range": "± 34151",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6861836,
            "range": "± 39523",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 6766768,
            "range": "± 151479",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9243348,
            "range": "± 57005",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 10705692,
            "range": "± 61139",
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
          "id": "2ea9ff0208210d0402098b95642a82500c6527a4",
          "message": "update audio start overlay message",
          "timestamp": "2026-05-28T16:19:06-04:00",
          "tree_id": "b7bb758c31ef316c96cf3975ba8f0f9294548f20",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/2ea9ff0208210d0402098b95642a82500c6527a4"
        },
        "date": 1779999932537,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3243939,
            "range": "± 58318",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5062277,
            "range": "± 40634",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6286720,
            "range": "± 27988",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2319441,
            "range": "± 12201",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2326895,
            "range": "± 4397",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2326865,
            "range": "± 15685",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8426993,
            "range": "± 24094",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11519827,
            "range": "± 22383",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13534761,
            "range": "± 24061",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10193912,
            "range": "± 54557",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15136773,
            "range": "± 23622",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17889424,
            "range": "± 116290",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6452577,
            "range": "± 13277",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8857355,
            "range": "± 22566",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10244389,
            "range": "± 20933",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4297804,
            "range": "± 15507",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6052374,
            "range": "± 10027",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7240839,
            "range": "± 48925",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8997883,
            "range": "± 25661",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12529791,
            "range": "± 65811",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13851269,
            "range": "± 54712",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6448491,
            "range": "± 17464",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9200753,
            "range": "± 86072",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11010867,
            "range": "± 66761",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4111975,
            "range": "± 17043",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6559112,
            "range": "± 40225",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8190218,
            "range": "± 41792",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3677189,
            "range": "± 43243",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5762020,
            "range": "± 75499",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7129196,
            "range": "± 99682",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7143098,
            "range": "± 27162",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10073378,
            "range": "± 249569",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11766381,
            "range": "± 79934",
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
          "id": "eaacff67cba1ffc881630d234da60a4c0d5325bc",
          "message": "refactor: add unified popover system for all popovers (#253)\n\n* refactor: add unified popover system for all popovers\n\n* fix lib build",
          "timestamp": "2026-05-28T20:30:20Z",
          "tree_id": "07aebc1b820c78fea17d2d646e7903d73ffdd471",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/eaacff67cba1ffc881630d234da60a4c0d5325bc"
        },
        "date": 1780000602618,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3291885,
            "range": "± 80902",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5239424,
            "range": "± 53486",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6451536,
            "range": "± 61670",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2365621,
            "range": "± 24234",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2384453,
            "range": "± 15289",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2378732,
            "range": "± 19726",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8628760,
            "range": "± 66583",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11732123,
            "range": "± 84046",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13703325,
            "range": "± 40051",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10308678,
            "range": "± 103876",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15408722,
            "range": "± 81103",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18178566,
            "range": "± 457731",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6524308,
            "range": "± 31702",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8986871,
            "range": "± 54151",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10302102,
            "range": "± 144233",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4351526,
            "range": "± 51941",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6152396,
            "range": "± 27885",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7383949,
            "range": "± 64221",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9203709,
            "range": "± 46017",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12825073,
            "range": "± 35421",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14149483,
            "range": "± 29879",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6596987,
            "range": "± 36381",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9368988,
            "range": "± 40633",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11201949,
            "range": "± 48116",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4151652,
            "range": "± 25960",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6648825,
            "range": "± 32289",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8328394,
            "range": "± 35033",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3729689,
            "range": "± 100025",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5870190,
            "range": "± 58980",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7325031,
            "range": "± 52228",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7313707,
            "range": "± 62081",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10202284,
            "range": "± 45788",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11918553,
            "range": "± 53883",
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
          "id": "21e17e2a77ae0d8589af736ea074371b239e278d",
          "message": "fix(plugin): restore preset state on GUI reopen (#252)\n\n* fix(plugin): restore preset state on GUI reopen\n\nHydration no longer bails out when IPC bridge isn't ready yet\n- retries with up to 500ms x 10 polling, mirroring existing getParams retry logic\n- opens outbound gate immediately for responsive controls while waiting\n\nRemove duplicate usePluginParamBridge() call in PluginPage.tsx\n\nFix load_state() not updating cached params version, causing stale DAW\nFloatParam values to overwrite restored state on next process() call\n\n* refactor: simplify state management in synth preset manager and related components\n\n* feat(preset): implement preset name persistence and IPC communication\n\n- Added functionality to set and get preset names via IPC.\n- Updated state management to include preset name in save/load operations.\n- Created tests to ensure preset name is correctly stored and retrieved.\n- Enhanced PluginPage and LivePage to handle preset session changes.\n\n* lint",
          "timestamp": "2026-05-28T23:10:12-04:00",
          "tree_id": "490e89dc68ba4564c4eceaf7f3c3d062f2297c43",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/21e17e2a77ae0d8589af736ea074371b239e278d"
        },
        "date": 1780024592329,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3253126,
            "range": "± 61098",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5067082,
            "range": "± 19895",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6296641,
            "range": "± 33428",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2325552,
            "range": "± 10866",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2331973,
            "range": "± 14533",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2331319,
            "range": "± 17503",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8479090,
            "range": "± 259053",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11567747,
            "range": "± 52126",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13585953,
            "range": "± 78904",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10264038,
            "range": "± 57472",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15215673,
            "range": "± 57816",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17968831,
            "range": "± 99491",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6514296,
            "range": "± 95644",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8922333,
            "range": "± 46042",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10306674,
            "range": "± 61503",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4294843,
            "range": "± 20770",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6050814,
            "range": "± 35864",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7238582,
            "range": "± 15034",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9043244,
            "range": "± 85142",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12595008,
            "range": "± 43660",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13925701,
            "range": "± 47323",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6505053,
            "range": "± 48576",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9254163,
            "range": "± 33816",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11059031,
            "range": "± 56978",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4105745,
            "range": "± 12339",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6569524,
            "range": "± 23954",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8199783,
            "range": "± 24966",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3667106,
            "range": "± 25417",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5733468,
            "range": "± 21225",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7100527,
            "range": "± 32409",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7157936,
            "range": "± 57289",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10059189,
            "range": "± 115900",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11736315,
            "range": "± 91056",
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
          "id": "1343e3776c15ea066b7320b5656b7960b1446c49",
          "message": "refactor: replace modals with popovers for mini keyboard settings and macro label editor (#254)\n\n* refactor: replace modals with popovers for mini keyboard settings and macro label editor\n\n* refactor(tests): format macroLabels array for better readability",
          "timestamp": "2026-05-29T03:31:13Z",
          "tree_id": "30360c264378f2db0f4045004132764234e8ae47",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/1343e3776c15ea066b7320b5656b7960b1446c49"
        },
        "date": 1780025854481,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3150193,
            "range": "± 99643",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4845400,
            "range": "± 12039",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5983514,
            "range": "± 119289",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2215843,
            "range": "± 9866",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2222576,
            "range": "± 12719",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2222223,
            "range": "± 6895",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8116507,
            "range": "± 107857",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10799148,
            "range": "± 99251",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12602319,
            "range": "± 128962",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10001446,
            "range": "± 110641",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 14600524,
            "range": "± 113844",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17269270,
            "range": "± 100043",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6208036,
            "range": "± 102884",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8302547,
            "range": "± 110264",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9530634,
            "range": "± 108680",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4118113,
            "range": "± 14174",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5680913,
            "range": "± 24865",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6800819,
            "range": "± 30818",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8593075,
            "range": "± 102115",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 11777325,
            "range": "± 99953",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13020744,
            "range": "± 102387",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6108110,
            "range": "± 103925",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8554665,
            "range": "± 119595",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10230284,
            "range": "± 100574",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3817372,
            "range": "± 44659",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6052520,
            "range": "± 16891",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7576213,
            "range": "± 56590",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3634961,
            "range": "± 9113",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5537926,
            "range": "± 28947",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6853662,
            "range": "± 14478",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 6766722,
            "range": "± 412687",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9252018,
            "range": "± 100770",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 10713907,
            "range": "± 106322",
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
          "id": "87edc1fd7b8add4f4bde90bf3a21f34f8a5694a4",
          "message": "feat: improve lofi fx (#256)\n\n* improve lofi fx\n\n* fix perf",
          "timestamp": "2026-05-29T09:21:38-04:00",
          "tree_id": "dac2b275a574a38bf6408abc8ca807ea3b986bbf",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/87edc1fd7b8add4f4bde90bf3a21f34f8a5694a4"
        },
        "date": 1780061291752,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3315792,
            "range": "± 118326",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5107674,
            "range": "± 68554",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6411907,
            "range": "± 169372",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2338693,
            "range": "± 26823",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2356808,
            "range": "± 28005",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2392451,
            "range": "± 32617",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8818561,
            "range": "± 95970",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11966489,
            "range": "± 84658",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13983899,
            "range": "± 293593",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10529717,
            "range": "± 221932",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15497052,
            "range": "± 678438",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18306808,
            "range": "± 605408",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6737372,
            "range": "± 129961",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9112038,
            "range": "± 62013",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10480455,
            "range": "± 92451",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4429387,
            "range": "± 108402",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6244784,
            "range": "± 162045",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7671272,
            "range": "± 148253",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9309171,
            "range": "± 316536",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12824786,
            "range": "± 292901",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14176512,
            "range": "± 401927",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6642477,
            "range": "± 67178",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9392396,
            "range": "± 102898",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11137607,
            "range": "± 95748",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4151709,
            "range": "± 124982",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6585812,
            "range": "± 53173",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8156232,
            "range": "± 201976",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3663507,
            "range": "± 30325",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5710890,
            "range": "± 231963",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7057147,
            "range": "± 165428",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7115240,
            "range": "± 54158",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9952077,
            "range": "± 193988",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11614972,
            "range": "± 72904",
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
          "id": "b9ac1b5ddc0569f1a558a2956d10684bb3ad54e5",
          "message": "fix: lofi fx issues",
          "timestamp": "2026-05-30T08:46:52-04:00",
          "tree_id": "21000bb394271639af0ab281a998df4cba2cf48a",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/b9ac1b5ddc0569f1a558a2956d10684bb3ad54e5"
        },
        "date": 1780145603770,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3145551,
            "range": "± 111663",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4792993,
            "range": "± 31473",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5945638,
            "range": "± 68743",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2245301,
            "range": "± 9801",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2250486,
            "range": "± 69054",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2253495,
            "range": "± 10439",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8331332,
            "range": "± 139388",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11123511,
            "range": "± 165363",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12995287,
            "range": "± 192131",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10337990,
            "range": "± 205870",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 14964874,
            "range": "± 170950",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17621981,
            "range": "± 182961",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6418998,
            "range": "± 190745",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8580667,
            "range": "± 180080",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9898960,
            "range": "± 334640",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4138264,
            "range": "± 26195",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5699436,
            "range": "± 59138",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6793269,
            "range": "± 51191",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8897757,
            "range": "± 143551",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12151619,
            "range": "± 427312",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13390488,
            "range": "± 179585",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6435841,
            "range": "± 149578",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8824297,
            "range": "± 171740",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10472931,
            "range": "± 195903",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3905939,
            "range": "± 79198",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6087582,
            "range": "± 75129",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7598091,
            "range": "± 102116",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3587888,
            "range": "± 15172",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5643911,
            "range": "± 171921",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7038896,
            "range": "± 39560",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7033376,
            "range": "± 155872",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9613856,
            "range": "± 172935",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11232237,
            "range": "± 283895",
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
          "id": "f2d1dd6514d2eb349218b07e59e08e9b721f6a59",
          "message": "Refactor code structure for improved readability and maintainability",
          "timestamp": "2026-06-03T12:10:03-04:00",
          "tree_id": "61110c4cacaaedfb5dc50af529dc5bb8a90dc80d",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/f2d1dd6514d2eb349218b07e59e08e9b721f6a59"
        },
        "date": 1780503409131,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3137080,
            "range": "± 51411",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4803329,
            "range": "± 86395",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5898792,
            "range": "± 197248",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2239361,
            "range": "± 8963",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2241796,
            "range": "± 12610",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2274661,
            "range": "± 20930",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8137535,
            "range": "± 320108",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10865048,
            "range": "± 57876",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12723006,
            "range": "± 40427",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10100756,
            "range": "± 923866",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 14665350,
            "range": "± 289722",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17341682,
            "range": "± 81701",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6213202,
            "range": "± 138446",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8356775,
            "range": "± 35369",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9624276,
            "range": "± 42931",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4150616,
            "range": "± 24354",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5718524,
            "range": "± 27165",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6806642,
            "range": "± 45428",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8704133,
            "range": "± 202316",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 11889353,
            "range": "± 81061",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13147941,
            "range": "± 43194",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6209942,
            "range": "± 133549",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8582602,
            "range": "± 46923",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10241798,
            "range": "± 305542",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3938497,
            "range": "± 42534",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6114988,
            "range": "± 343354",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7631665,
            "range": "± 37037",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3610108,
            "range": "± 15062",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5664369,
            "range": "± 169501",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7051705,
            "range": "± 20727",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 6839636,
            "range": "± 36887",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9359514,
            "range": "± 42738",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 10938198,
            "range": "± 39081",
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
          "id": "b9ac1b5ddc0569f1a558a2956d10684bb3ad54e5",
          "message": "fix: lofi fx issues",
          "timestamp": "2026-05-30T08:46:52-04:00",
          "tree_id": "21000bb394271639af0ab281a998df4cba2cf48a",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/b9ac1b5ddc0569f1a558a2956d10684bb3ad54e5"
        },
        "date": 1780512111403,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3335071,
            "range": "± 51452",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5186254,
            "range": "± 75294",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6400904,
            "range": "± 102646",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2376693,
            "range": "± 103790",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2375307,
            "range": "± 29933",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2386514,
            "range": "± 54527",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8688217,
            "range": "± 66588",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11729047,
            "range": "± 74894",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13742861,
            "range": "± 71872",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10399569,
            "range": "± 92846",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15353767,
            "range": "± 81614",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18147765,
            "range": "± 65793",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6655270,
            "range": "± 55622",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9065706,
            "range": "± 53651",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10409920,
            "range": "± 66702",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4376759,
            "range": "± 50630",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6176634,
            "range": "± 69876",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7340882,
            "range": "± 121918",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9070483,
            "range": "± 79403",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12728413,
            "range": "± 44215",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14052605,
            "range": "± 91484",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6623616,
            "range": "± 55641",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9418945,
            "range": "± 56192",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11146070,
            "range": "± 62715",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4209629,
            "range": "± 50903",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6665524,
            "range": "± 66387",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8331180,
            "range": "± 71825",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3729055,
            "range": "± 30987",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5805544,
            "range": "± 51592",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7212859,
            "range": "± 36863",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7270599,
            "range": "± 51759",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10083387,
            "range": "± 53507",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11814237,
            "range": "± 158779",
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
          "id": "9ee8fd233074a4b829fe8eed32991f4432afe8f6",
          "message": "feat: add codegen for default presets (#260)\n\n* Refactor code structure for improved readability and maintainability\n\n* Implement refactoring of core modules for improved performance and maintainability",
          "timestamp": "2026-06-03T18:47:12Z",
          "tree_id": "82cba3c7b1022bcd48cf2135f4efcfe1e6c4ada6",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/9ee8fd233074a4b829fe8eed32991f4432afe8f6"
        },
        "date": 1780512820890,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3142616,
            "range": "± 42667",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4769096,
            "range": "± 63004",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5902205,
            "range": "± 49687",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2241872,
            "range": "± 8110",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2244690,
            "range": "± 12082",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2249434,
            "range": "± 32039",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8073538,
            "range": "± 43932",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10820384,
            "range": "± 67861",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12713823,
            "range": "± 46713",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10053746,
            "range": "± 29130",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 14605801,
            "range": "± 108074",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17267359,
            "range": "± 40578",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6147755,
            "range": "± 21761",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8288805,
            "range": "± 18607",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9565843,
            "range": "± 18307",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4150652,
            "range": "± 49751",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5711357,
            "range": "± 412289",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6797628,
            "range": "± 174667",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8643424,
            "range": "± 20618",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 11823266,
            "range": "± 23287",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13077058,
            "range": "± 28204",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6124099,
            "range": "± 17396",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8499114,
            "range": "± 22078",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10141926,
            "range": "± 30525",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3902848,
            "range": "± 38385",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6079660,
            "range": "± 80520",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7588830,
            "range": "± 21455",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3587504,
            "range": "± 12763",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5632955,
            "range": "± 22627",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7025999,
            "range": "± 21830",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 6756043,
            "range": "± 26758",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9281679,
            "range": "± 127571",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 10858168,
            "range": "± 389843",
            "unit": "ns/iter"
          }
        ]
      }
    ]
  }
}