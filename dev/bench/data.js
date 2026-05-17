window.BENCHMARK_DATA = {
  "lastUpdate": 1779038396983,
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
      }
    ]
  }
}