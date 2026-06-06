window.BENCHMARK_DATA = {
  "lastUpdate": 1780769297791,
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
          "id": "e7dc646fa9583b42e002c37c4716befb7f9bd67a",
          "message": "feat: move presets to engine (#259)\n\n* feat: integrate runtime voice states into IPC and GUI components\n\n* Refactor code structure and remove redundant sections for improved readability and maintainability\n\n* Refactor code structure for improved readability and maintainability\n\n* Enhance session state synchronization and improve preset tag formatting\n\n- Refactored `subscribeEditorState` and `subscribeMidiMappings` functions in `useSessionStateSync.ts` to improve state management and reduce redundancy.\n- Added initial state push for editor and MIDI mappings upon subscription.\n- Reformatted tags in `factoryCzPresets.ts` to use array syntax for consistency and readability.\n\n* feat: enhance MIDI and note handling with new options and runtime types\n\n- Added `applyBindings` option to `useMidiLearnBindings` for conditional binding application.\n- Introduced `keyboardInputEnabled` and `midiInputEnabled` options in `useNoteHandling` to control input handling.\n- Created `synthRuntime.ts` to define types for synth runtime, including performance metrics and note handling.\n- Updated `index.ts` to export new runtime types.\n- Cleaned up factory presets by consolidating tag arrays for better readability.\n\n* fix(plugin): sync DAW automation params to webview GUI\n\n* refactor(plugin): replace MidiMapping with MidiLearnState types in session state\n\n* feat(plugin): move MIDI learn authority from JS to Rust engine\n\n- Replace MidiMapping with MidiLearnBinding/MidiLearnState types\n- Remove setMidiMappings/getMidiMappings IPC handlers\n- Add setMidiLearnMode, setPendingMidiLearnParam, addMidiBinding,\n  removeMidiBinding, clearMidiLearnBindings, getMidiLearnState\n- Rewrite handle_host_event catch-all for learn capture + apply\n- Add version-tracked idle push of MidiLearnState via __czOnMidiLearnState\n\n* refactor(plugin): update MIDI learn bridge methods in IPC and AUv3\n\n* refactor(plugin,ui): move MIDI learn authority to Rust engine and update JS store\n\n* fix(ui): update MidiLearnPanel for engine-based MIDI learn store\n\n* fix(plugin): restore default MIDI learn bindings\n\n* Enhance MIDI Learning Functionality and Update Preset Tags\n\n- Introduced a new type `MidiBindingIdentity` for better binding management.\n- Updated `removeBinding` method to accept `MidiBindingIdentity` instead of just `paramKey`.\n- Implemented `bindingMatches` function to streamline binding comparisons.\n- Added `refreshMidiLearnState` function to fetch and initialize MIDI learn state from the engine.\n- Enhanced `subscribeMidiLearnState` to call `refreshMidiLearnState` on subscription.\n- Reformatted preset tags in `FACTORY_CZ_PRESETS` for consistency and readability.\n\n* feat(global-settings): implement global MIDI learn bindings management\n\n* Add MIDI mapping and input event handling to the synth engine\n\n- Introduced `mapping.rs` to manage MIDI parameter bindings and automation.\n- Implemented functions for setting parameter values, retrieving parameter ranges, and applying MIDI mappings.\n- Created `input.rs` to handle various input events including note on/off, control changes, and transport state.\n- Updated `CosmoProcessor` to integrate input event processing and transport state management.\n- Added tests for MIDI mapping functionality to ensure correct parameter application.\n\n* Refactor factory CZ presets to simplify tag formatting\n\n- Consolidated tag arrays into single-line format for better readability in `factoryCzPresets.ts`.\n- Updated parameter range retrieval logic in `mapping.rs` for improved clarity.\n- Reorganized module imports in `mod.rs` for consistency.\n- Enhanced input event handling in `input.rs` to support parameter changes.\n- Fixed missing newline at the end of `build.rs` for proper formatting.\n\n* Refactor code structure for improved readability and maintainability\n\n* feat(preset-library): enhance favorite management and schema versioning\n\n* Refactor synth preset manager and related tests\n\n- Updated `useSynthPresetManager` to manage preset dirty states more effectively using a new state variable `isPresetDirty`.\n- Removed unused code and tests related to pending preset changes.\n- Simplified preset selection handling by introducing a `commitPresetSelection` function.\n- Adjusted the handling of preset sessions to store a boolean `isDirty` instead of a fingerprint.\n- Updated tests for `useSynthPresetManager` to reflect changes in state management and preset handling.\n- Removed deprecated test file `useSynthPresetManager.test.tsx`.\n- Modified `presetStorage` to accommodate the new `isDirty` state in the current preset session.\n\n* Refactor code structure for improved readability and maintainability\n\n* fix sorting order\n\n* refactor: remove legacy plans and documentation for MIDI learn and preset management\n\n- Deleted PLAN.md, PREDESIGN.md, and SYNTH_RUNTIME_REFACTOR_PLAN.md as they are no longer relevant to the current architecture and implementation strategy.\n- These documents contained outdated information regarding MIDI learn refactor, DAW to webview synchronization, and preset ownership which have been superseded by new designs and implementations.\n\n* removed lv2/vst2/aax for now\n\n* feat: add factory preset code generation functionality\n\n- Implemented `factory_preset_codegen.rs` to handle loading, validating, and generating factory presets.\n- Introduced a new main entry point in `main.rs` to execute the preset generation process.\n- Updated `package.json` to change the command for generating factory presets to use the new module.\n\n* linting\n\n* feat: enhance preset session handling and improve mock bridge tests",
          "timestamp": "2026-06-04T01:04:08Z",
          "tree_id": "f20b027d9ba7e9321b1cf53c0294282649b8eada",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/e7dc646fa9583b42e002c37c4716befb7f9bd67a"
        },
        "date": 1780535435987,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3314317,
            "range": "± 149635",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5108714,
            "range": "± 21672",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6333214,
            "range": "± 45896",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2344360,
            "range": "± 16633",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2329485,
            "range": "± 36150",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2337818,
            "range": "± 15025",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8520837,
            "range": "± 356216",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11660700,
            "range": "± 52316",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13634477,
            "range": "± 442026",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10178931,
            "range": "± 37110",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15018922,
            "range": "± 32146",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18368150,
            "range": "± 375571",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6532419,
            "range": "± 136268",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8919895,
            "range": "± 57298",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10369301,
            "range": "± 267996",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4301444,
            "range": "± 20669",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6048542,
            "range": "± 25502",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7265957,
            "range": "± 188146",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9027407,
            "range": "± 78068",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12599140,
            "range": "± 123339",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13902350,
            "range": "± 69435",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6528330,
            "range": "± 45356",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9284477,
            "range": "± 74595",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11134858,
            "range": "± 267403",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4173733,
            "range": "± 38943",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6586937,
            "range": "± 134228",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8198038,
            "range": "± 47564",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3699238,
            "range": "± 30674",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5778125,
            "range": "± 43558",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7147842,
            "range": "± 239632",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7189197,
            "range": "± 66691",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10024749,
            "range": "± 90483",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11667493,
            "range": "± 115747",
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
          "id": "7520172bdd07cca65eb6d139b206eb4b2e228a9d",
          "message": "refactor: streamline preset management by introducing a new repositor… (#262)\n\n* refactor: streamline preset management by introducing a new repository pattern\n\n- Consolidated preset management logic into a dedicated repository interface.\n- Removed unused imports and functions related to local and library presets.\n- Updated the useSynthPresetManager hook to utilize the new repository for operations.\n- Enhanced preset activation and navigation handling.\n- Improved state management for active presets and navigation entries.\n- Added new types for better type safety and clarity in preset management.\n\n* fix logging and preset nav state restore\n\n* fix tests",
          "timestamp": "2026-06-04T14:07:55Z",
          "tree_id": "c9b93e5aa7a3cdb8df66446fb853fb1f51af516d",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/7520172bdd07cca65eb6d139b206eb4b2e228a9d"
        },
        "date": 1780582463547,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3253357,
            "range": "± 94178",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5097220,
            "range": "± 337334",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6329520,
            "range": "± 64955",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2316171,
            "range": "± 15929",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2323719,
            "range": "± 14709",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2336391,
            "range": "± 13428",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8474167,
            "range": "± 40944",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11566504,
            "range": "± 50768",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13603183,
            "range": "± 89311",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10183476,
            "range": "± 61047",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15025110,
            "range": "± 246656",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17729524,
            "range": "± 121173",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6524185,
            "range": "± 30801",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8917729,
            "range": "± 56222",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10517288,
            "range": "± 44966",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4292197,
            "range": "± 18539",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6042073,
            "range": "± 28500",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7235885,
            "range": "± 48885",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9033989,
            "range": "± 55662",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12555746,
            "range": "± 37112",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13852644,
            "range": "± 36055",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6500633,
            "range": "± 181942",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9221922,
            "range": "± 40581",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11163436,
            "range": "± 189366",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4111920,
            "range": "± 31290",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6688986,
            "range": "± 68608",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8147237,
            "range": "± 22840",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3655609,
            "range": "± 207175",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5716019,
            "range": "± 12882",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7071815,
            "range": "± 28590",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7125258,
            "range": "± 29451",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9982880,
            "range": "± 31081",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11622387,
            "range": "± 32919",
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
          "id": "7c4f4c24b57209faf70c9672ec983e025cc99a57",
          "message": "refactor: remove benchmark API and related perf monitor files (#263)\n\nRefactor performance monitoring: remove benchmark API and related components\n\n- Removed the PerformanceMonitor component and its associated tests.\n- Eliminated the benchmark-related logic from the SynthRenderer and useWebSynthRuntime hooks.\n- Cleaned up the IPCBridge and PluginPage to remove unused performance metrics functions.\n- Updated the CzSynthWorkletProcessor to stop tracking performance metrics.\n- Removed the benchmark harness and related types from the codebase.\n- Adjusted tests to reflect the removal of performance monitoring functionality.",
          "timestamp": "2026-06-04T14:28:08Z",
          "tree_id": "0151b4b51cb3fc5a1eef41e3a966e6c59eaaa66d",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/7c4f4c24b57209faf70c9672ec983e025cc99a57"
        },
        "date": 1780583678527,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3278859,
            "range": "± 112515",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5098154,
            "range": "± 25135",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6311991,
            "range": "± 41690",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2338463,
            "range": "± 72590",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2340884,
            "range": "± 18481",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2347820,
            "range": "± 16375",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8454202,
            "range": "± 63350",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11570931,
            "range": "± 67256",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13653866,
            "range": "± 90317",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10206434,
            "range": "± 158713",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15099285,
            "range": "± 101188",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17867699,
            "range": "± 108137",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6526974,
            "range": "± 39014",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8944523,
            "range": "± 50151",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10326909,
            "range": "± 60023",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4301362,
            "range": "± 20588",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6059144,
            "range": "± 34868",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7242422,
            "range": "± 26243",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9017111,
            "range": "± 61367",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12609217,
            "range": "± 74678",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13949538,
            "range": "± 83339",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6515920,
            "range": "± 38127",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9246344,
            "range": "± 43313",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11150789,
            "range": "± 54708",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4139944,
            "range": "± 25004",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6587302,
            "range": "± 51738",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8244887,
            "range": "± 59634",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3673108,
            "range": "± 20143",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5722784,
            "range": "± 31810",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7085764,
            "range": "± 33092",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7166791,
            "range": "± 46629",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10059079,
            "range": "± 108256",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11786890,
            "range": "± 75085",
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
          "id": "8fe441fa4d0d3d58398c535c994e79fc72596521",
          "message": "feat: enhance keyboard input handling with PC key labels and visibility toggle (#265)",
          "timestamp": "2026-06-05T09:19:54-04:00",
          "tree_id": "ce1116d0cfa2797b4b81711f4e153f27009f6f9f",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/8fe441fa4d0d3d58398c535c994e79fc72596521"
        },
        "date": 1780665980404,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3197579,
            "range": "± 101727",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4846923,
            "range": "± 100672",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5972645,
            "range": "± 47273",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2246949,
            "range": "± 20493",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2247667,
            "range": "± 15819",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2256946,
            "range": "± 18454",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8029543,
            "range": "± 49869",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10741927,
            "range": "± 30127",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12586677,
            "range": "± 48466",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 9903035,
            "range": "± 40807",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 14515080,
            "range": "± 76251",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17186552,
            "range": "± 78307",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6180124,
            "range": "± 28572",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8290061,
            "range": "± 27465",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9587797,
            "range": "± 35266",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4110362,
            "range": "± 16203",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5730309,
            "range": "± 49622",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6853639,
            "range": "± 28448",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8575202,
            "range": "± 34779",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 11754494,
            "range": "± 32717",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13052503,
            "range": "± 36986",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6045501,
            "range": "± 22031",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8500096,
            "range": "± 232838",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10175285,
            "range": "± 189159",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3820485,
            "range": "± 30745",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6083044,
            "range": "± 72936",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7605803,
            "range": "± 145738",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3587465,
            "range": "± 14463",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5593364,
            "range": "± 24823",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6954365,
            "range": "± 44739",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 6696493,
            "range": "± 14297",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9209225,
            "range": "± 174105",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 10727430,
            "range": "± 41857",
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
          "id": "8490e029d564a2f32790f0d5e180f81f57386d23",
          "message": "refactor: split pdalgo (#266)\n\n* feat: enhance keyboard input handling with PC key labels and visibility toggle\n\n* Refactor preset storage import and add waveform preview functionality\n\n- Updated import path for default envelopes in presetStorage.ts\n- Introduced a new file waveformPreview.ts to handle waveform preview generation, including various algorithms and waveform types.\n- Implemented functions for waveform sampling, applying algorithms, and generating SVG paths for waveform visualization.\n\n* test: add unit tests for algoUiCatalog and waveformPreview modules",
          "timestamp": "2026-06-05T13:41:37Z",
          "tree_id": "77bd9868ff18008dfa7b055e051002db0edae2ae",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/8490e029d564a2f32790f0d5e180f81f57386d23"
        },
        "date": 1780667274744,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 1618481,
            "range": "± 39295",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 2495260,
            "range": "± 122765",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 3091561,
            "range": "± 52838",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 1165725,
            "range": "± 21238",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 1197619,
            "range": "± 29019",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 1182093,
            "range": "± 21088",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 4628806,
            "range": "± 80716",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 6463063,
            "range": "± 117947",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 7582008,
            "range": "± 97792",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 5881658,
            "range": "± 229228",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 8724256,
            "range": "± 193939",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 10396213,
            "range": "± 240941",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 3347615,
            "range": "± 170814",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 4610657,
            "range": "± 80208",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 5325428,
            "range": "± 250500",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 2196205,
            "range": "± 31352",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 3055291,
            "range": "± 68425",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 3645375,
            "range": "± 88208",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 4885430,
            "range": "± 100654",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 6814963,
            "range": "± 161951",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 7537149,
            "range": "± 132127",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 3361172,
            "range": "± 63574",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 4798609,
            "range": "± 118894",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 5772777,
            "range": "± 123022",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 2108562,
            "range": "± 31701",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 3375353,
            "range": "± 59691",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 4279234,
            "range": "± 94639",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 1915563,
            "range": "± 31675",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 3095446,
            "range": "± 73465",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 3888275,
            "range": "± 53442",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 3827767,
            "range": "± 91144",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 5445382,
            "range": "± 108846",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 6452078,
            "range": "± 151607",
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
          "id": "97174f1af867b0ebc65972b57725c9a888adcab3",
          "message": "feat: improve update notifier (#267)\n\n* feat: enhance keyboard input handling with PC key labels and visibility toggle\n\n* Refactor preset storage import and add waveform preview functionality\n\n- Updated import path for default envelopes in presetStorage.ts\n- Introduced a new file waveformPreview.ts to handle waveform preview generation, including various algorithms and waveform types.\n- Implemented functions for waveform sampling, applying algorithms, and generating SVG paths for waveform visualization.\n\n* test: add unit tests for algoUiCatalog and waveformPreview modules\n\n* update engine\n\n* fix build\n\n* feat: implement plugin update notification and version handling",
          "timestamp": "2026-06-05T14:16:38Z",
          "tree_id": "7714d537710eafc8042da4f720260c6fdf330c63",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/97174f1af867b0ebc65972b57725c9a888adcab3"
        },
        "date": 1780669388585,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3256495,
            "range": "± 46433",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5089523,
            "range": "± 24285",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6308546,
            "range": "± 409012",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2322004,
            "range": "± 18972",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2324228,
            "range": "± 14588",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2358214,
            "range": "± 15991",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8485249,
            "range": "± 100862",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11581034,
            "range": "± 69562",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13593150,
            "range": "± 44795",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10123939,
            "range": "± 33096",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 14974419,
            "range": "± 78023",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17725938,
            "range": "± 108956",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6506780,
            "range": "± 97193",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8908573,
            "range": "± 47206",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10285473,
            "range": "± 156027",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4288176,
            "range": "± 28149",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6039943,
            "range": "± 22358",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7237336,
            "range": "± 48000",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8947535,
            "range": "± 52368",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12436507,
            "range": "± 54966",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13764579,
            "range": "± 85864",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6493146,
            "range": "± 47813",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9199918,
            "range": "± 50730",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11058726,
            "range": "± 616661",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4109535,
            "range": "± 57766",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6540933,
            "range": "± 18677",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8129212,
            "range": "± 19053",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3651493,
            "range": "± 8653",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5704100,
            "range": "± 10005",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7059215,
            "range": "± 38888",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7091804,
            "range": "± 20595",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9945370,
            "range": "± 37104",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11576922,
            "range": "± 26238",
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
          "id": "94d1f71cebf0d73ef91e88edd152745a3ca95dc7",
          "message": "chore: fix release/version bump flow (#268)",
          "timestamp": "2026-06-05T10:33:01-04:00",
          "tree_id": "c9122e80e262a3ba9f792090bc7d8f4cb0bca766",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/94d1f71cebf0d73ef91e88edd152745a3ca95dc7"
        },
        "date": 1780670372603,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2537251,
            "range": "± 65345",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 3778889,
            "range": "± 80302",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 4664971,
            "range": "± 28710",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 1767411,
            "range": "± 26708",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 1755430,
            "range": "± 26086",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 1763030,
            "range": "± 22757",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 6347950,
            "range": "± 27376",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 8487336,
            "range": "± 44762",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 9900100,
            "range": "± 43272",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 7815046,
            "range": "± 302727",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 11374650,
            "range": "± 54467",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 13455426,
            "range": "± 34228",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 4829722,
            "range": "± 91242",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 6505356,
            "range": "± 39567",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 7481112,
            "range": "± 41204",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3232487,
            "range": "± 27774",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 4493521,
            "range": "± 133030",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 5373479,
            "range": "± 49253",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 6763078,
            "range": "± 33513",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 9226131,
            "range": "± 154240",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 10215378,
            "range": "± 233940",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 4796263,
            "range": "± 22606",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 6673366,
            "range": "± 36725",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 7921290,
            "range": "± 163493",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3003832,
            "range": "± 69594",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 4780585,
            "range": "± 34872",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 5954141,
            "range": "± 59538",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 2843811,
            "range": "± 14255",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 4362830,
            "range": "± 27192",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 5468361,
            "range": "± 161000",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 5274938,
            "range": "± 107296",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 7179557,
            "range": "± 137384",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 8338980,
            "range": "± 269146",
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
          "id": "be2ec4d2314afe1d203edf2dfdc3a47f928b1f49",
          "message": "chore: enhance version bump script to handle missing Xcode project files",
          "timestamp": "2026-06-05T10:51:47-04:00",
          "tree_id": "e1093746b82cd24f5c26b0b247b4d4d7bd6badf4",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/be2ec4d2314afe1d203edf2dfdc3a47f928b1f49"
        },
        "date": 1780671496077,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 1608110,
            "range": "± 82805",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 2510073,
            "range": "± 168843",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 3155122,
            "range": "± 184391",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 1148929,
            "range": "± 33683",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 1143949,
            "range": "± 60888",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 1153627,
            "range": "± 69710",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 4558972,
            "range": "± 121807",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 6351291,
            "range": "± 315063",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 7559097,
            "range": "± 234552",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 5796227,
            "range": "± 278934",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 8813653,
            "range": "± 169333",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 10341975,
            "range": "± 262942",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 3330214,
            "range": "± 198025",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 4492164,
            "range": "± 340498",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 5302227,
            "range": "± 135190",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 2200357,
            "range": "± 112688",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 2927322,
            "range": "± 169384",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 3497137,
            "range": "± 107169",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 4739418,
            "range": "± 103023",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 6724946,
            "range": "± 423058",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 7388011,
            "range": "± 165475",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 3195386,
            "range": "± 86925",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 4715578,
            "range": "± 118346",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 5798886,
            "range": "± 489609",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 2084208,
            "range": "± 203189",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 3375988,
            "range": "± 243701",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 4254384,
            "range": "± 105291",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 1897514,
            "range": "± 56461",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 2974008,
            "range": "± 72294",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 3717344,
            "range": "± 229224",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 3579709,
            "range": "± 90597",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 5115405,
            "range": "± 149593",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 5815276,
            "range": "± 99227",
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
          "id": "1aa5f9d968b17dbea88e16d05fb591008369768b",
          "message": "linting",
          "timestamp": "2026-06-05T11:19:55-04:00",
          "tree_id": "cfe1c48137415867b77f84cb7b29b9774fd6e0fa",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/1aa5f9d968b17dbea88e16d05fb591008369768b"
        },
        "date": 1780673168005,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 1545006,
            "range": "± 49207",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 2479900,
            "range": "± 125238",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 3005108,
            "range": "± 86793",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 1123369,
            "range": "± 25070",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 1169665,
            "range": "± 34663",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 1163897,
            "range": "± 32319",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 4460175,
            "range": "± 179900",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 6142421,
            "range": "± 250633",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 7118902,
            "range": "± 143759",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 5753985,
            "range": "± 259286",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 8257949,
            "range": "± 340350",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 10045048,
            "range": "± 210900",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 3130467,
            "range": "± 50142",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 4363853,
            "range": "± 124462",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 5018542,
            "range": "± 67149",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 2132984,
            "range": "± 103448",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 3002967,
            "range": "± 153308",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 3639600,
            "range": "± 144721",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 4787505,
            "range": "± 175443",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 6567504,
            "range": "± 172621",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 7106153,
            "range": "± 407711",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 3172150,
            "range": "± 147455",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 4554612,
            "range": "± 75108",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 5493356,
            "range": "± 97163",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 1979103,
            "range": "± 33722",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 3201930,
            "range": "± 63696",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 4020635,
            "range": "± 98656",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 1826703,
            "range": "± 35150",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 2927873,
            "range": "± 57411",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 3667920,
            "range": "± 150088",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 3604311,
            "range": "± 151089",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 5079020,
            "range": "± 110952",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 5938603,
            "range": "± 227288",
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
          "id": "659b5cbec620499d1b73f451b84c785b6f2eab4e",
          "message": "chore(bench): adjust benchmark configuration",
          "timestamp": "2026-06-05T11:24:32-04:00",
          "tree_id": "aaa018bb612969db92e8f281ebd4b16c8d082e42",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/659b5cbec620499d1b73f451b84c785b6f2eab4e"
        },
        "date": 1780673654419,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3114763,
            "range": "± 111290",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4862913,
            "range": "± 18748",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6076104,
            "range": "± 145490",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2174967,
            "range": "± 18601",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2180672,
            "range": "± 19996",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2183212,
            "range": "± 29395",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8288763,
            "range": "± 30517",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11223363,
            "range": "± 41534",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13038210,
            "range": "± 184577",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10170253,
            "range": "± 22062",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 14933634,
            "range": "± 30513",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17615139,
            "range": "± 33610",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6324258,
            "range": "± 16935",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8597664,
            "range": "± 1073773",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9814589,
            "range": "± 33168",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4184915,
            "range": "± 59371",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5764575,
            "range": "± 50985",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6947786,
            "range": "± 20608",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8807493,
            "range": "± 28655",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12123453,
            "range": "± 50051",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13363994,
            "range": "± 37925",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6263061,
            "range": "± 17910",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8833663,
            "range": "± 19911",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10426123,
            "range": "± 21355",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4017187,
            "range": "± 13035",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6372188,
            "range": "± 34570",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7836982,
            "range": "± 28560",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3628853,
            "range": "± 20938",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5717573,
            "range": "± 54237",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7156419,
            "range": "± 65079",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 6856235,
            "range": "± 56860",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9521008,
            "range": "± 97901",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11012609,
            "range": "± 45986",
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
          "id": "fffb797a2ee008a72df15dbcd444d297c2022e33",
          "message": "fix(audio): defer startup to user gesture (#269)\n\n* fix(audio): defer startup to user gesture\n\n* build(wasm): bump bundled engine version\n\n* fix(update): use dynamic current version in plugin update checks",
          "timestamp": "2026-06-06T15:28:04Z",
          "tree_id": "c9fb55a28232ff98b695346cbdd9e076393c11e4",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/fffb797a2ee008a72df15dbcd444d297c2022e33"
        },
        "date": 1780760237402,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3283919,
            "range": "± 139821",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5117432,
            "range": "± 39198",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6369035,
            "range": "± 23931",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2352164,
            "range": "± 9302",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2359520,
            "range": "± 10178",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2364854,
            "range": "± 8927",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8567650,
            "range": "± 52595",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11835751,
            "range": "± 57305",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13822382,
            "range": "± 140477",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10317458,
            "range": "± 35396",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15306575,
            "range": "± 41047",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17960334,
            "range": "± 39002",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6587487,
            "range": "± 20658",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9129104,
            "range": "± 24973",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10549212,
            "range": "± 30199",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4327219,
            "range": "± 21057",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6116974,
            "range": "± 68755",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7305962,
            "range": "± 27856",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9075207,
            "range": "± 17821",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12714308,
            "range": "± 72752",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14034152,
            "range": "± 53882",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6620199,
            "range": "± 20561",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9481195,
            "range": "± 31653",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11276337,
            "range": "± 75266",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4248395,
            "range": "± 14148",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6856522,
            "range": "± 16615",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8457698,
            "range": "± 25614",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3710396,
            "range": "± 155602",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5790333,
            "range": "± 29825",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7179086,
            "range": "± 30023",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7246986,
            "range": "± 41755",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10209874,
            "range": "± 47452",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11820721,
            "range": "± 44948",
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
          "id": "56b0efd7f15ed3787538a2e07615e91b134580e4",
          "message": "feat: preset library improvements (#270)\n\n* feat(preset): default new saved user presets to \"User\" author,\nImprove nav in preset library\n\n* feat(preset): add PresetMultiSelect component and enhance tag handling\n\n* feat(preset-library): enhance preset management and filtering features\n\n- Updated the preset library to allow for better tag management, including the ability to add and remove tags dynamically.\n- Introduced new tests to validate the functionality of tag filtering and author filtering.\n- Improved the UI for searching presets, including a clear search button.\n- Refactored the preset library components to streamline state management and improve performance.\n- Added support for new dependencies, including react-select for enhanced select functionality.\n\n* lint",
          "timestamp": "2026-06-06T12:19:06-04:00",
          "tree_id": "67ed31ee7574e37d7ba215005e8ea93f57c04792",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/56b0efd7f15ed3787538a2e07615e91b134580e4"
        },
        "date": 1780763283429,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3312931,
            "range": "± 83697",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5158646,
            "range": "± 132791",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6403459,
            "range": "± 29284",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2382675,
            "range": "± 11128",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2387719,
            "range": "± 28504",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2395576,
            "range": "± 8785",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8807919,
            "range": "± 73582",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11904228,
            "range": "± 59306",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13916616,
            "range": "± 56493",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10321144,
            "range": "± 164939",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15196077,
            "range": "± 41387",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17940031,
            "range": "± 118745",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6599166,
            "range": "± 166366",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9101261,
            "range": "± 146450",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10405452,
            "range": "± 127519",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4381033,
            "range": "± 21165",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6159329,
            "range": "± 67146",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7356692,
            "range": "± 363763",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9133972,
            "range": "± 24769",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12678170,
            "range": "± 33313",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14035023,
            "range": "± 42452",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6626871,
            "range": "± 38809",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9375945,
            "range": "± 39864",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11180002,
            "range": "± 45225",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4206301,
            "range": "± 24173",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6766589,
            "range": "± 46917",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8450705,
            "range": "± 122118",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3786535,
            "range": "± 24119",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5889822,
            "range": "± 36041",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7232655,
            "range": "± 72007",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7170781,
            "range": "± 39066",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10033696,
            "range": "± 97783",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11686663,
            "range": "± 39158",
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
          "id": "6bc4975a835b4f360b4ef4092c18ec21ee28f60f",
          "message": "refactor(fx): remove Rotary Speaker, Stereo Widener, Auto Wah; fix flanger throughZero type (#271)\n\n* refactor(fx): remove Rotary Speaker, Stereo Widener, Auto Wah; fix flanger throughZero type\n\nRemove 3 FX modules (Rotary Speaker, Stereo Widener, Auto Wah) from engine and frontend, including all Rust DSP implementations, param types, presets, UI config, and categories. Fix flanger throughZero field from bool to u8 to match ButtonGroup control values (0/1), resolving serde JSON deserialization error.\n\n* build",
          "timestamp": "2026-06-06T13:58:57-04:00",
          "tree_id": "7754d988cef003120ab605b160492e121ca6322e",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/6bc4975a835b4f360b4ef4092c18ec21ee28f60f"
        },
        "date": 1780769294219,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3291108,
            "range": "± 74339",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5126982,
            "range": "± 38662",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6346476,
            "range": "± 108036",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2321458,
            "range": "± 11662",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2328650,
            "range": "± 12515",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2332127,
            "range": "± 11157",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8522653,
            "range": "± 49255",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11771715,
            "range": "± 30390",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13942166,
            "range": "± 45681",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10301973,
            "range": "± 23051",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15296664,
            "range": "± 310929",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18113130,
            "range": "± 49244",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6595180,
            "range": "± 25062",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9139645,
            "range": "± 22099",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10626623,
            "range": "± 31997",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4312251,
            "range": "± 18549",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6181227,
            "range": "± 107371",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7268775,
            "range": "± 46934",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9094074,
            "range": "± 39148",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12699203,
            "range": "± 227095",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14045732,
            "range": "± 66270",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6609028,
            "range": "± 27896",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9464669,
            "range": "± 42987",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11355824,
            "range": "± 41710",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4239414,
            "range": "± 13870",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6852184,
            "range": "± 26941",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8590133,
            "range": "± 41199",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3686725,
            "range": "± 13945",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5772417,
            "range": "± 42354",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7157796,
            "range": "± 35208",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7257033,
            "range": "± 54526",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10263738,
            "range": "± 23090",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11993477,
            "range": "± 42454",
            "unit": "ns/iter"
          }
        ]
      }
    ]
  }
}