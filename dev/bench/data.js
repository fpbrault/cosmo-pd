window.BENCHMARK_DATA = {
  "lastUpdate": 1789407946806,
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
            "email": "fpbrault@gmail.com",
            "name": "Felix Perron-Brault",
            "username": "fpbrault"
          },
          "distinct": true,
          "id": "1e33a08ad04547d8b29e61ed543585d0077de49e",
          "message": "fix: better db version conflict handling",
          "timestamp": "2026-08-23T20:08:50-04:00",
          "tree_id": "0e2ee46218ed946ac1675a1cc68ec418547f6309",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/1e33a08ad04547d8b29e61ed543585d0077de49e"
        },
        "date": 1787530701740,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3945238,
            "range": "± 49030",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5494266,
            "range": "± 114839",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6492285,
            "range": "± 63149",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3363575,
            "range": "± 10539",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3375909,
            "range": "± 96073",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3395975,
            "range": "± 11119",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10233557,
            "range": "± 35175",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13162165,
            "range": "± 31477",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15178617,
            "range": "± 326032",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 12225437,
            "range": "± 42336",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 16642422,
            "range": "± 48048",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 18848523,
            "range": "± 142257",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8049125,
            "range": "± 264431",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10219365,
            "range": "± 40780",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11439211,
            "range": "± 148791",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5090344,
            "range": "± 71256",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6672876,
            "range": "± 93280",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7659991,
            "range": "± 56086",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 10585628,
            "range": "± 65061",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 13494097,
            "range": "± 64370",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 14562665,
            "range": "± 76266",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8102876,
            "range": "± 147434",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10564888,
            "range": "± 194910",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12233764,
            "range": "± 56948",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4956558,
            "range": "± 49016",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7196502,
            "range": "± 33957",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8687811,
            "range": "± 57253",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5181871,
            "range": "± 57016",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7718119,
            "range": "± 80904",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9529836,
            "range": "± 40259",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 9482247,
            "range": "± 56810",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 12674262,
            "range": "± 77992",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 14379679,
            "range": "± 75766",
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
          "id": "82efb47960a9f1eac869623089e77397a8e095a5",
          "message": "perf(bench): add Android web display benchmarks (#373)",
          "timestamp": "2026-08-23T22:47:22-04:00",
          "tree_id": "3f5858dea5c3104933f283d4a7ae5b3dd8eae28f",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/82efb47960a9f1eac869623089e77397a8e095a5"
        },
        "date": 1787540216084,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2257213,
            "range": "± 19584",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 3090253,
            "range": "± 17938",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 3662611,
            "range": "± 13611",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 1906731,
            "range": "± 9403",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 1917652,
            "range": "± 16212",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 1936131,
            "range": "± 11927",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 5594348,
            "range": "± 19659",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 7186301,
            "range": "± 21405",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 8232733,
            "range": "± 69751",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 6853537,
            "range": "± 47388",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 9242158,
            "range": "± 72401",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 10464154,
            "range": "± 43294",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 4353407,
            "range": "± 16142",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 5518953,
            "range": "± 33722",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 6191225,
            "range": "± 33456",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 2817553,
            "range": "± 11725",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 3628151,
            "range": "± 22247",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 4194882,
            "range": "± 64215",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 5831650,
            "range": "± 58967",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 7379389,
            "range": "± 174330",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 8031438,
            "range": "± 47910",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 4347280,
            "range": "± 20975",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 5756811,
            "range": "± 19078",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 6665156,
            "range": "± 19194",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 2700678,
            "range": "± 5666",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 3920338,
            "range": "± 28209",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 4721294,
            "range": "± 33901",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 2791823,
            "range": "± 12864",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 4167299,
            "range": "± 18038",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 5111460,
            "range": "± 15079",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 5087593,
            "range": "± 32697",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 6760148,
            "range": "± 24641",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 7754377,
            "range": "± 36226",
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
          "id": "033bac4af79b87d987ff211ffc684f74c5c58b38",
          "message": "perf(display): smooth simple mode on mobile web (#372)\n\n* perf(bench): add Android web display benchmarks\n\n* perf(display): optimize simple mode rendering\n\n* fix(bench): wait for the requested display\n\n* fix(bench): isolate multi-profile display runs\n\n* perf(bench): shorten CI voice matrix\n\n* perf(bench): generalize web display profiles",
          "timestamp": "2026-08-24T10:29:51-04:00",
          "tree_id": "8a0abb3e3450f6bb4b206e720a708fac9234407a",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/033bac4af79b87d987ff211ffc684f74c5c58b38"
        },
        "date": 1787582339186,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4026964,
            "range": "± 77461",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5508689,
            "range": "± 116909",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6554312,
            "range": "± 31092",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3373919,
            "range": "± 37857",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3382098,
            "range": "± 11788",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3399822,
            "range": "± 24805",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10240339,
            "range": "± 72846",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13260840,
            "range": "± 55790",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15204247,
            "range": "± 402929",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 12238425,
            "range": "± 213400",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 16601390,
            "range": "± 79972",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 18927112,
            "range": "± 89274",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8047668,
            "range": "± 81422",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10178956,
            "range": "± 103020",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11372462,
            "range": "± 52237",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5074269,
            "range": "± 30656",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6608073,
            "range": "± 42307",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7579901,
            "range": "± 37348",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 10699128,
            "range": "± 51750",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 13493972,
            "range": "± 105416",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 14714211,
            "range": "± 64285",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7987034,
            "range": "± 45000",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10477380,
            "range": "± 47883",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12092387,
            "range": "± 60124",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4883173,
            "range": "± 20091",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7098823,
            "range": "± 26665",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8564646,
            "range": "± 34722",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5090767,
            "range": "± 43788",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7647222,
            "range": "± 34353",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9405012,
            "range": "± 34072",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 9490224,
            "range": "± 39013",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 12577256,
            "range": "± 92664",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 14472381,
            "range": "± 49019",
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
          "id": "87ed744433c450fdcc88967e772acccf7a646266",
          "message": "fix(synth): route L1 prime through L1 envelopes (#379)",
          "timestamp": "2026-08-24T12:47:29-04:00",
          "tree_id": "f898ad6bd3fb5152804c1759939aa6548c957f28",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/87ed744433c450fdcc88967e772acccf7a646266"
        },
        "date": 1787590641842,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2572898,
            "range": "± 62345",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 3698744,
            "range": "± 63674",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 4465559,
            "range": "± 13991",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2185453,
            "range": "± 164806",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2204650,
            "range": "± 48558",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2231157,
            "range": "± 11973",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 7216737,
            "range": "± 162917",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 9308653,
            "range": "± 40397",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 10751889,
            "range": "± 219503",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 8661081,
            "range": "± 92892",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 11706112,
            "range": "± 283479",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 13314954,
            "range": "± 388111",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 5680703,
            "range": "± 101739",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 7249771,
            "range": "± 227769",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 8205465,
            "range": "± 232582",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3600931,
            "range": "± 59629",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 4702510,
            "range": "± 19362",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 5447911,
            "range": "± 118713",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 7354273,
            "range": "± 220068",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 9292082,
            "range": "± 251382",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 10171789,
            "range": "± 356035",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 5525619,
            "range": "± 16574",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 7289549,
            "range": "± 189016",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 8485582,
            "range": "± 148192",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3203836,
            "range": "± 52977",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 4772514,
            "range": "± 91156",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 5861777,
            "range": "± 90076",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3412383,
            "range": "± 21831",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5281050,
            "range": "± 188540",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6554352,
            "range": "± 165101",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 6432423,
            "range": "± 30934",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 8617380,
            "range": "± 120077",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 9927065,
            "range": "± 313335",
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
          "distinct": false,
          "id": "b31ef9af5b0aa69fa6e96134802e013ed538d50f",
          "message": "feat(display): unify visualizations and remove waterfall 3d (#377)\n\n* feat(display): unify visualization modes and remove waterfall 3d\n\n* fix(display): stabilize HiDPI visualization scaling",
          "timestamp": "2026-08-24T13:56:46-04:00",
          "tree_id": "c1527a0457618dcf115bf31dd2dc1c8026159d04",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/b31ef9af5b0aa69fa6e96134802e013ed538d50f"
        },
        "date": 1787594741678,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3592746,
            "range": "± 75024",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5219229,
            "range": "± 56085",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6294296,
            "range": "± 68594",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2908474,
            "range": "± 25500",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2957409,
            "range": "± 22364",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2989891,
            "range": "± 41591",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10085911,
            "range": "± 47414",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12931358,
            "range": "± 42150",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14704689,
            "range": "± 109958",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 12198023,
            "range": "± 171251",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 16383179,
            "range": "± 246142",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 18533512,
            "range": "± 75777",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7813206,
            "range": "± 62297",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9884606,
            "range": "± 47114",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11093217,
            "range": "± 111621",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5008134,
            "range": "± 44062",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6589045,
            "range": "± 199200",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7579701,
            "range": "± 194151",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 10064809,
            "range": "± 30114",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 12672708,
            "range": "± 131322",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 13808839,
            "range": "± 36586",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7775811,
            "range": "± 226761",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10210751,
            "range": "± 35224",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11815937,
            "range": "± 32932",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4466485,
            "range": "± 50206",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6634718,
            "range": "± 31473",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8048262,
            "range": "± 26898",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4736137,
            "range": "± 39126",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7285361,
            "range": "± 72876",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9012557,
            "range": "± 31849",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 8957692,
            "range": "± 43275",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 11966952,
            "range": "± 35461",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 13722345,
            "range": "± 27688",
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
          "id": "323fb7e8b7fbf8fe5e5aee76270a40ba44c10ab2",
          "message": "chore(deps): update actions/checkout action to v7 (#375)\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>",
          "timestamp": "2026-08-25T15:29:41-04:00",
          "tree_id": "03fa7e3cc10dd249f80024f692e763d121ce51a4",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/323fb7e8b7fbf8fe5e5aee76270a40ba44c10ab2"
        },
        "date": 1787686722787,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4048677,
            "range": "± 51671",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5394132,
            "range": "± 89825",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6344283,
            "range": "± 49240",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3381611,
            "range": "± 21671",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3370519,
            "range": "± 29463",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3377776,
            "range": "± 40077",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9870143,
            "range": "± 119270",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12191769,
            "range": "± 122834",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13901489,
            "range": "± 170812",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 11883955,
            "range": "± 151963",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 15923628,
            "range": "± 141929",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 17802656,
            "range": "± 143571",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7911287,
            "range": "± 130778",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9718341,
            "range": "± 157811",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10755979,
            "range": "± 94202",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5180035,
            "range": "± 68399",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6655493,
            "range": "± 124797",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7490631,
            "range": "± 96965",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 10106536,
            "range": "± 178386",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 12743707,
            "range": "± 236137",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 13771711,
            "range": "± 186029",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7830563,
            "range": "± 110388",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10139965,
            "range": "± 149697",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11746053,
            "range": "± 195361",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4811538,
            "range": "± 62102",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6651601,
            "range": "± 83435",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8067354,
            "range": "± 93113",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5012137,
            "range": "± 52703",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7311451,
            "range": "± 63039",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9003422,
            "range": "± 94797",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 9038802,
            "range": "± 142025",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 12006481,
            "range": "± 130085",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 13841023,
            "range": "± 143325",
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
          "id": "12e007e0052bf2d2471ef4e3248a2502c4f4c660",
          "message": "chore(deps): update actions/cache action to v6 (#374)\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>\nCo-authored-by: Felix Perron-Brault <fpbrault@gmail.com>",
          "timestamp": "2026-08-25T19:34:34Z",
          "tree_id": "53619f7cafe6ca6270387cdcb0668ee12b35961e",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/12e007e0052bf2d2471ef4e3248a2502c4f4c660"
        },
        "date": 1787687053329,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2169790,
            "range": "± 54019",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 3075641,
            "range": "± 84458",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 3726549,
            "range": "± 151935",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 1833127,
            "range": "± 65117",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 1856245,
            "range": "± 41201",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 1881503,
            "range": "± 63428",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 5938949,
            "range": "± 98292",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 7680884,
            "range": "± 266379",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 8850803,
            "range": "± 389203",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 7094044,
            "range": "± 129340",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 9539467,
            "range": "± 353070",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 10839918,
            "range": "± 493517",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 4679832,
            "range": "± 143536",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 5942410,
            "range": "± 303650",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 6722334,
            "range": "± 277759",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 2985192,
            "range": "± 96126",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 3880609,
            "range": "± 163706",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 4477125,
            "range": "± 195472",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 6018414,
            "range": "± 173317",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 7653293,
            "range": "± 333354",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 8377857,
            "range": "± 60485",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 4820852,
            "range": "± 244952",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 6042146,
            "range": "± 200311",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 7054399,
            "range": "± 169004",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 2642330,
            "range": "± 91861",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 3928867,
            "range": "± 207142",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 4799094,
            "range": "± 101122",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 2842623,
            "range": "± 73854",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 4370553,
            "range": "± 218526",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 5412010,
            "range": "± 255725",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 5279397,
            "range": "± 223918",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 7092054,
            "range": "± 362150",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 8183673,
            "range": "± 331665",
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
          "id": "4f47b138f20b9f32d0555f711171c2f770aa0a4d",
          "message": "feat(simple): add compact sound and envelope controls (#378)\n\n* feat(simple): add compact sound shaping controls\n\nAdd compact routing, algorithm, line parameter, envelope, and FX controls to Simple mode while sharing the existing synth state with Advanced mode.\n\n* fix(renderer): adjust panel size for better layout in SynthRenderer\n\n* test(display): sync adaptive profile expectations\n\n* feat(simple): add dedicated envelope section\n\n* fix(simple): balance compact rack sections\n\n* adjust height\n\n* clean display\n\n* feat(pd101): refine simple sound and envelope controls\n\n* fix(perf): target visualization canvas explicitly\n\n* fix(ui): adjust layout and sizing in performance controls panel\n\n* Improve simple controls\n\n* clean up\n\n* clean up\n\n* fix oct knob\n\n* lint\n\n* apply review changes\n\n* Refactor performance components to use CollapsedSectionSummary and simplify structure\n\n- Introduced CollapsedSectionSummary component to standardize collapsible sections in performance components.\n- Updated CollapsedEffectsSummary, CollapsedEnvelopeSummary, CollapsedSoundSummary, and PerformanceEffectsPanel to utilize the new CollapsedSectionSummary.\n- Created PerformanceEffectEditor for managing effect settings in a more modular way.\n- Added PerformanceEffectSlotShell and PerformanceEmptyEffectSlot to encapsulate slot rendering logic.\n- Removed unnecessary props and components to streamline the codebase.\n- Added SimpleSectionHeader component for consistent section headers across performance components.\n- Updated tests to reflect changes in component structure and behavior.\n\n* cleanup",
          "timestamp": "2026-09-11T08:51:10-04:00",
          "tree_id": "ce8ae92263b162e9c807f4e2de0e24306930469b",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/4f47b138f20b9f32d0555f711171c2f770aa0a4d"
        },
        "date": 1789131621060,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4009229,
            "range": "± 82792",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5575157,
            "range": "± 47245",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6631735,
            "range": "± 29493",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3427499,
            "range": "± 16949",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3427169,
            "range": "± 23403",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3429805,
            "range": "± 14320",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10409577,
            "range": "± 37693",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13325156,
            "range": "± 37707",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15304758,
            "range": "± 58470",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 12358388,
            "range": "± 49691",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 16750173,
            "range": "± 214849",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 18982325,
            "range": "± 53839",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8163719,
            "range": "± 38420",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10314871,
            "range": "± 41466",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11566293,
            "range": "± 36495",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5226221,
            "range": "± 40418",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6795971,
            "range": "± 31699",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7788386,
            "range": "± 74615",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 10577608,
            "range": "± 42377",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 13395900,
            "range": "± 50175",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 14517546,
            "range": "± 49241",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8092223,
            "range": "± 65045",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10625977,
            "range": "± 39583",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12283531,
            "range": "± 43933",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5009933,
            "range": "± 33205",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7359405,
            "range": "± 33013",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8850097,
            "range": "± 46644",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5220849,
            "range": "± 24553",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7776890,
            "range": "± 35775",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 8726633,
            "range": "± 74322",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 8444588,
            "range": "± 125941",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 11619730,
            "range": "± 72007",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 13451063,
            "range": "± 59579",
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
          "id": "a5639090aa81f2d2452cc32a24d4c1db35a46d4e",
          "message": "ci: make Renovate dependency updates reproducible (#385)\n\n* ci: make Renovate dependency updates reproducible\n\n* lint fix",
          "timestamp": "2026-09-11T13:41:42Z",
          "tree_id": "5931a40d7acd9816c4e158e4710fe9bbe06e4d51",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/a5639090aa81f2d2452cc32a24d4c1db35a46d4e"
        },
        "date": 1789134646666,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4004247,
            "range": "± 31159",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5555687,
            "range": "± 32873",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6641611,
            "range": "± 50747",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3384866,
            "range": "± 45266",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3413738,
            "range": "± 28092",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3427475,
            "range": "± 14757",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10489966,
            "range": "± 180459",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13418692,
            "range": "± 115264",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15290939,
            "range": "± 188505",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 12403755,
            "range": "± 136748",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 16852663,
            "range": "± 206261",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 19054636,
            "range": "± 179507",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8299223,
            "range": "± 125346",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10455145,
            "range": "± 171627",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11630969,
            "range": "± 105880",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5167797,
            "range": "± 61478",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6707616,
            "range": "± 22209",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7702031,
            "range": "± 25303",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 10674796,
            "range": "± 215405",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 13561742,
            "range": "± 143568",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 14695255,
            "range": "± 191015",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8301411,
            "range": "± 234140",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10753184,
            "range": "± 115788",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12503631,
            "range": "± 216002",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5003750,
            "range": "± 31197",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7273801,
            "range": "± 63986",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8850545,
            "range": "± 26979",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5158914,
            "range": "± 22562",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7837806,
            "range": "± 175240",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 8841577,
            "range": "± 71344",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 8773744,
            "range": "± 151098",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 11966300,
            "range": "± 125159",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 13798241,
            "range": "± 107946",
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
          "id": "954d5445ee2d6b1cd45498a0186ad728c3e0b0d8",
          "message": "fix(simple): default fresh sessions to Simple mode (#386)\n\n* fix(simple): default fresh sessions to Simple mode\n\n* test(simple): expect Simple mode as UI fallback\n\n* test(plugin): pin Advanced mode for existing e2e coverage",
          "timestamp": "2026-09-11T13:47:56Z",
          "tree_id": "141861ca786b6e3c83aec46112f66f1e59a81c4a",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/954d5445ee2d6b1cd45498a0186ad728c3e0b0d8"
        },
        "date": 1789135065003,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2177281,
            "range": "± 90655",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 3093784,
            "range": "± 135093",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 3723065,
            "range": "± 100084",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 1854952,
            "range": "± 8773",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 1872715,
            "range": "± 25737",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 1905621,
            "range": "± 48050",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 5985386,
            "range": "± 185061",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 7720431,
            "range": "± 32619",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 8897969,
            "range": "± 43089",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 7136576,
            "range": "± 94091",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 9548312,
            "range": "± 18652",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 10837383,
            "range": "± 29955",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 4721940,
            "range": "± 322802",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 6245197,
            "range": "± 232443",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 6752833,
            "range": "± 125663",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3002047,
            "range": "± 96576",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 3887878,
            "range": "± 93550",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 4470639,
            "range": "± 142499",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 6074008,
            "range": "± 185864",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 7683791,
            "range": "± 202338",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 8401338,
            "range": "± 147717",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 4605432,
            "range": "± 25854",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 6069357,
            "range": "± 247988",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 7311157,
            "range": "± 310939",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 2662309,
            "range": "± 48580",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 3946997,
            "range": "± 187226",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 4845532,
            "range": "± 144582",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 2861603,
            "range": "± 99357",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 4374009,
            "range": "± 83616",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 5418219,
            "range": "± 193318",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 5335841,
            "range": "± 138945",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 7146569,
            "range": "± 195513",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 8229767,
            "range": "± 167024",
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
          "id": "4a9e184675edd4f081fa18d668cbd3b23345f538",
          "message": "chore(deps): update dependency @biomejs/biome to v2.5.8 (#366)\n\n* fix(deps): update bun non-major dependencies\n\n* chore(deps): repair lockfiles\n\n---------\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>\nCo-authored-by: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>",
          "timestamp": "2026-09-11T14:06:35Z",
          "tree_id": "2410ac6e28598a6825288578794b39dd44d3ec63",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/4a9e184675edd4f081fa18d668cbd3b23345f538"
        },
        "date": 1789136197246,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3266458,
            "range": "± 30121",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4271436,
            "range": "± 22635",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 4989740,
            "range": "± 65468",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2755905,
            "range": "± 6229",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2753180,
            "range": "± 39623",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2768765,
            "range": "± 24606",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 7908954,
            "range": "± 59100",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 9803212,
            "range": "± 62155",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 11123496,
            "range": "± 59319",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 9615837,
            "range": "± 193554",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 12717960,
            "range": "± 184466",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 14293171,
            "range": "± 59038",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6345097,
            "range": "± 80740",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 7701580,
            "range": "± 88848",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 8536863,
            "range": "± 66509",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4150836,
            "range": "± 29014",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5123937,
            "range": "± 15688",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 5832196,
            "range": "± 29317",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 8148535,
            "range": "± 106071",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 10170133,
            "range": "± 60507",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 10952297,
            "range": "± 57076",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6349877,
            "range": "± 56000",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8051486,
            "range": "± 156130",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9210005,
            "range": "± 51490",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3869823,
            "range": "± 15016",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5274519,
            "range": "± 31810",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6224736,
            "range": "± 23849",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4005596,
            "range": "± 30516",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5763997,
            "range": "± 95468",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7040165,
            "range": "± 17547",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 7252929,
            "range": "± 59555",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 9428295,
            "range": "± 178299",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 10726120,
            "range": "± 52318",
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
          "id": "903350f8e277d48d012792dc817c2149f31f85c8",
          "message": "chore(deps): update rust crate syn to v3 (#383)\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>",
          "timestamp": "2026-09-11T14:15:21Z",
          "tree_id": "4b96cee38e114173f86f918d13117f6106420887",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/903350f8e277d48d012792dc817c2149f31f85c8"
        },
        "date": 1789136911627,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3483860,
            "range": "± 29182",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5176796,
            "range": "± 62902",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6274796,
            "range": "± 33773",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2869789,
            "range": "± 39872",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2898892,
            "range": "± 15148",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2942586,
            "range": "± 17176",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9969192,
            "range": "± 106593",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12727104,
            "range": "± 53385",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14597955,
            "range": "± 37922",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 12031862,
            "range": "± 39954",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 16302758,
            "range": "± 145415",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 18502588,
            "range": "± 39729",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7751812,
            "range": "± 88411",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9822518,
            "range": "± 31214",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11030270,
            "range": "± 61035",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4936483,
            "range": "± 37471",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6502971,
            "range": "± 42958",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7539894,
            "range": "± 24964",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 10048100,
            "range": "± 28112",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 12644918,
            "range": "± 24262",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 13733337,
            "range": "± 26176",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7754898,
            "range": "± 28834",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10172008,
            "range": "± 216014",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11766997,
            "range": "± 27523",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4399504,
            "range": "± 68675",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6527536,
            "range": "± 51812",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8014267,
            "range": "± 102252",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4642646,
            "range": "± 75957",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7175452,
            "range": "± 49606",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 8899641,
            "range": "± 43928",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 8832977,
            "range": "± 44775",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 11910994,
            "range": "± 221057",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 13665467,
            "range": "± 34586",
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
          "id": "4586f081cb05cdc49358f4c71889482f9494d10f",
          "message": "fix(deps): update cargo non-major dependencies (#365)\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>",
          "timestamp": "2026-09-11T14:25:39Z",
          "tree_id": "8eef51aeb93a77176d9759f5407084ad8ab98e45",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/4586f081cb05cdc49358f4c71889482f9494d10f"
        },
        "date": 1789137297227,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4032197,
            "range": "± 71236",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5574508,
            "range": "± 62671",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6651396,
            "range": "± 54523",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3405146,
            "range": "± 45505",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3423928,
            "range": "± 34834",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3433652,
            "range": "± 53188",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10280545,
            "range": "± 195891",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13236088,
            "range": "± 76181",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15285437,
            "range": "± 115763",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 12289847,
            "range": "± 63232",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 16726230,
            "range": "± 73571",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 18984756,
            "range": "± 93444",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8229207,
            "range": "± 53929",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10419696,
            "range": "± 273420",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11703731,
            "range": "± 71540",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5192503,
            "range": "± 38777",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6785585,
            "range": "± 65760",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7743080,
            "range": "± 43650",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 10625903,
            "range": "± 66301",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 13489592,
            "range": "± 73782",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 14701981,
            "range": "± 94935",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8245749,
            "range": "± 82114",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10765662,
            "range": "± 38988",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12421166,
            "range": "± 48176",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5116420,
            "range": "± 79111",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7481213,
            "range": "± 59791",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9043514,
            "range": "± 57268",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5204972,
            "range": "± 68358",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7776785,
            "range": "± 34154",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 8710198,
            "range": "± 80856",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 8513333,
            "range": "± 83767",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 11769076,
            "range": "± 93853",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 13651577,
            "range": "± 96076",
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
          "id": "c974a7373029e82622d257998ef6b3eb28d0ca7b",
          "message": "ci: temporarily disable web display benchmarks (#387)",
          "timestamp": "2026-09-11T14:34:13Z",
          "tree_id": "fc4c10ebc071be3676eb603cd94ca46749693787",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/c974a7373029e82622d257998ef6b3eb28d0ca7b"
        },
        "date": 1789137807009,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4088991,
            "range": "± 344694",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5647358,
            "range": "± 72926",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6666390,
            "range": "± 55445",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3427249,
            "range": "± 44365",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3435723,
            "range": "± 27155",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3455205,
            "range": "± 58998",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10469627,
            "range": "± 117321",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13435303,
            "range": "± 210444",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15351472,
            "range": "± 218298",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 12395588,
            "range": "± 130549",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 16825962,
            "range": "± 122260",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 19358975,
            "range": "± 320036",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8307482,
            "range": "± 154637",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10400357,
            "range": "± 140152",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11624563,
            "range": "± 134153",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5371913,
            "range": "± 106890",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6895952,
            "range": "± 134699",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7925594,
            "range": "± 101355",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 10654564,
            "range": "± 154230",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 13611899,
            "range": "± 168515",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 14663251,
            "range": "± 188029",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8155739,
            "range": "± 76469",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10658899,
            "range": "± 105358",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12369981,
            "range": "± 142307",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5059477,
            "range": "± 53707",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7403614,
            "range": "± 116228",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8987960,
            "range": "± 156493",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5272831,
            "range": "± 91125",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7869686,
            "range": "± 101141",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 8748756,
            "range": "± 127476",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 8547804,
            "range": "± 115670",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 11867448,
            "range": "± 213221",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 13839732,
            "range": "± 279113",
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
          "id": "ad841e1d7c5e1d3056ff5564fbf0c2962e466d17",
          "message": "chore(deps): update dependency @testing-library/jest-dom to v7 (#381)\n\n* chore(deps): update dependency @testing-library/jest-dom to v7\n\n* chore(deps): repair lockfiles\n\n---------\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>\nCo-authored-by: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>",
          "timestamp": "2026-09-11T14:45:08Z",
          "tree_id": "22bee218ee6d330ac481b7e895a1e119fb680609",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/ad841e1d7c5e1d3056ff5564fbf0c2962e466d17"
        },
        "date": 1789138489660,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2958129,
            "range": "± 54849",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4255053,
            "range": "± 146106",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5152952,
            "range": "± 71937",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2510019,
            "range": "± 42601",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2548289,
            "range": "± 35620",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2569072,
            "range": "± 33438",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8348600,
            "range": "± 132467",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10686211,
            "range": "± 153340",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12363732,
            "range": "± 183851",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 9966593,
            "range": "± 133083",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 13530629,
            "range": "± 154136",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 15317212,
            "range": "± 226202",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6523732,
            "range": "± 120561",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8306847,
            "range": "± 123887",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9430009,
            "range": "± 174566",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4240231,
            "range": "± 60144",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5564151,
            "range": "± 101962",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6320326,
            "range": "± 115202",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 8574100,
            "range": "± 164188",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 10950584,
            "range": "± 159583",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 11923862,
            "range": "± 156778",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6542344,
            "range": "± 96813",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8638079,
            "range": "± 281993",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10007682,
            "range": "± 188039",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3872315,
            "range": "± 31741",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5624420,
            "range": "± 75623",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6897208,
            "range": "± 113175",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4036632,
            "range": "± 54336",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 6213723,
            "range": "± 119663",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7776323,
            "range": "± 71875",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 7539475,
            "range": "± 98755",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 10069146,
            "range": "± 125305",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 11524645,
            "range": "± 215601",
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
          "id": "c5581b72dad9133ba0414fa6b09e2b68cdb56cd8",
          "message": "chore(deps): update vitest monorepo to v5 (#384)\n\n* chore(deps): update vitest monorepo to v5\n\n* chore(deps): repair lockfiles\n\n---------\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>\nCo-authored-by: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>",
          "timestamp": "2026-09-13T10:40:28-04:00",
          "tree_id": "a1bf108e6520e3f0f381ea1a3419344ee4564f25",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/c5581b72dad9133ba0414fa6b09e2b68cdb56cd8"
        },
        "date": 1789310976962,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3990730,
            "range": "± 72574",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5550145,
            "range": "± 39256",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6615371,
            "range": "± 35403",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3386172,
            "range": "± 11231",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3399766,
            "range": "± 8520",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3425541,
            "range": "± 17298",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10294327,
            "range": "± 41312",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13232690,
            "range": "± 63862",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15130739,
            "range": "± 42419",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 12211319,
            "range": "± 48164",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 16632674,
            "range": "± 67554",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 18814292,
            "range": "± 162987",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8082736,
            "range": "± 73215",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10209552,
            "range": "± 32391",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11488172,
            "range": "± 173802",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5210704,
            "range": "± 32344",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6765199,
            "range": "± 66116",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7764799,
            "range": "± 46728",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 10474829,
            "range": "± 72721",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 13342514,
            "range": "± 61764",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 14460472,
            "range": "± 57842",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8075999,
            "range": "± 66746",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10533815,
            "range": "± 37079",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12207128,
            "range": "± 43091",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4977690,
            "range": "± 22148",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7267941,
            "range": "± 46784",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8870692,
            "range": "± 39869",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5156526,
            "range": "± 45872",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7753136,
            "range": "± 36208",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 8606913,
            "range": "± 43286",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 8377033,
            "range": "± 65282",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 11478355,
            "range": "± 103633",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 13347296,
            "range": "± 60455",
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
          "id": "da006d725c5ce03d5e124412048887948fdd36b3",
          "message": "chore(deps): update dependency typescript to v7 (#382)\n\n* chore(deps): update dependency typescript to v7\n\n* chore(deps): repair lockfiles\n\n---------\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>\nCo-authored-by: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>",
          "timestamp": "2026-09-13T10:40:32-04:00",
          "tree_id": "6f6e1bb7e7b7d0ca676b564b0f983394ae503da7",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/da006d725c5ce03d5e124412048887948fdd36b3"
        },
        "date": 1789310987427,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2740857,
            "range": "± 53299",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 3906340,
            "range": "± 99396",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 4712117,
            "range": "± 126772",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2319935,
            "range": "± 52096",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2432202,
            "range": "± 71804",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2428591,
            "range": "± 49341",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 7863608,
            "range": "± 194914",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 9811898,
            "range": "± 281513",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 11389503,
            "range": "± 145789",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 9186405,
            "range": "± 244238",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 12250239,
            "range": "± 339213",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 13892891,
            "range": "± 332858",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 5964329,
            "range": "± 26426",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 7584378,
            "range": "± 132137",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 8561490,
            "range": "± 132303",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3774103,
            "range": "± 66021",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 4915457,
            "range": "± 55816",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 5661085,
            "range": "± 23200",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 7937137,
            "range": "± 266041",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 10415703,
            "range": "± 204764",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 11270227,
            "range": "± 380016",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6147028,
            "range": "± 122299",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8197890,
            "range": "± 254959",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9207388,
            "range": "± 140352",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3466994,
            "range": "± 60747",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5056792,
            "range": "± 119517",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6183633,
            "range": "± 212600",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3664087,
            "range": "± 83558",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5523075,
            "range": "± 90530",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6843285,
            "range": "± 101636",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 6787957,
            "range": "± 76322",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 9138294,
            "range": "± 88636",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 10760767,
            "range": "± 210444",
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
          "id": "d7bd4913b932be496d588099ccf773fd98d78ee1",
          "message": "fix(ci): support TypeScript 7 path resolution (#388)\n\n* fix(ci): remove obsolete TypeScript baseUrl\n\n* fix(ci): remove obsolete TypeScript baseUrl\n\n* fix(test): use Vitest jest-dom matchers",
          "timestamp": "2026-09-13T11:08:48-04:00",
          "tree_id": "589e3fccae7cf81d1e363def58fc0843763ff6fd",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/d7bd4913b932be496d588099ccf773fd98d78ee1"
        },
        "date": 1789312703779,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3262971,
            "range": "± 42543",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4289030,
            "range": "± 41491",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5009556,
            "range": "± 38282",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2755226,
            "range": "± 31468",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2759259,
            "range": "± 29618",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2760545,
            "range": "± 30960",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 7952220,
            "range": "± 62083",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 9852239,
            "range": "± 25229",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 11155106,
            "range": "± 70617",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 9570967,
            "range": "± 249817",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 12730540,
            "range": "± 49134",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 14325971,
            "range": "± 31825",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6349930,
            "range": "± 30639",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 7723981,
            "range": "± 24102",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 8552109,
            "range": "± 27136",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4148305,
            "range": "± 29777",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5153164,
            "range": "± 108458",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 5834517,
            "range": "± 26027",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 8179120,
            "range": "± 48733",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 10212931,
            "range": "± 105366",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 11027433,
            "range": "± 55472",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6421821,
            "range": "± 36690",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8072446,
            "range": "± 39177",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9293213,
            "range": "± 39744",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3933580,
            "range": "± 27775",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5288240,
            "range": "± 60597",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6255707,
            "range": "± 72757",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3996272,
            "range": "± 31463",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5795359,
            "range": "± 117605",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7101586,
            "range": "± 20848",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 7297827,
            "range": "± 27212",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 9472469,
            "range": "± 281806",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 10803476,
            "range": "± 53296",
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
          "id": "6646248527904af7942106873fab4d653f51a151",
          "message": "fix(deps): update dependency motion to v13 (#389)\n\n* fix(deps): update dependency motion to v13\n\n* chore(deps): repair lockfiles\n\n---------\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>\nCo-authored-by: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>",
          "timestamp": "2026-09-14T13:32:21-04:00",
          "tree_id": "724aab48850c795bf3ffbc59e0b6a81292147886",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/6646248527904af7942106873fab4d653f51a151"
        },
        "date": 1789407699700,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3105186,
            "range": "± 22788",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4408872,
            "range": "± 56924",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5349652,
            "range": "± 55853",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2603079,
            "range": "± 12056",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2637402,
            "range": "± 20704",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2674016,
            "range": "± 23028",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8745281,
            "range": "± 89059",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11200078,
            "range": "± 57582",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12980584,
            "range": "± 78903",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 10409691,
            "range": "± 45788",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 14056312,
            "range": "± 223533",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 16078656,
            "range": "± 259899",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6850596,
            "range": "± 85778",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8816648,
            "range": "± 28058",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9908848,
            "range": "± 43183",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4373723,
            "range": "± 20182",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5634219,
            "range": "± 83854",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6572538,
            "range": "± 36186",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 8888048,
            "range": "± 97241",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 11250731,
            "range": "± 60439",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 12380444,
            "range": "± 60440",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6736477,
            "range": "± 39211",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8823533,
            "range": "± 105608",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10327426,
            "range": "± 88979",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3937519,
            "range": "± 32436",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5771105,
            "range": "± 37431",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7086009,
            "range": "± 45114",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4131487,
            "range": "± 31309",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 6399957,
            "range": "± 34476",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7908163,
            "range": "± 45562",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 7812785,
            "range": "± 35353",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 10439848,
            "range": "± 135965",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 11953010,
            "range": "± 66791",
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
          "id": "293aa7ac9d7742ad96c818f0b0d2634c3df7fdd4",
          "message": "fix(deps): update rust crate dirs to v7 (#390)\n\n* fix(deps): update rust crate dirs to v7\n\n* chore(deps): repair lockfiles\n\n---------\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>\nCo-authored-by: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>",
          "timestamp": "2026-09-14T17:36:37Z",
          "tree_id": "c0eb7d2fcc5b791e02b658e052b519d6bba56599",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/293aa7ac9d7742ad96c818f0b0d2634c3df7fdd4"
        },
        "date": 1789407944184,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4232091,
            "range": "± 41355",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5580957,
            "range": "± 140233",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6533676,
            "range": "± 37071",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3552618,
            "range": "± 30438",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3542851,
            "range": "± 9932",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3561343,
            "range": "± 27598",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10240880,
            "range": "± 37564",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12709057,
            "range": "± 40090",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14489654,
            "range": "± 58651",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 12378532,
            "range": "± 159441",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 16410432,
            "range": "± 180281",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 18477071,
            "range": "± 68392",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8190337,
            "range": "± 165761",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9977038,
            "range": "± 39299",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10979603,
            "range": "± 171912",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5338810,
            "range": "± 40900",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6582156,
            "range": "± 25577",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7480229,
            "range": "± 20184",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 10541541,
            "range": "± 34843",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 13167531,
            "range": "± 70020",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 14198787,
            "range": "± 65038",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8153048,
            "range": "± 45918",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10315601,
            "range": "± 27514",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11814485,
            "range": "± 45288",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5026412,
            "range": "± 29177",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6805657,
            "range": "± 30752",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8053914,
            "range": "± 65934",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5139801,
            "range": "± 13045",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7436547,
            "range": "± 30831",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9120340,
            "range": "± 118808",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 9379001,
            "range": "± 40777",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 12127991,
            "range": "± 45754",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 13831668,
            "range": "± 47050",
            "unit": "ns/iter"
          }
        ]
      }
    ]
  }
}