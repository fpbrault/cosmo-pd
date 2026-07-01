window.BENCHMARK_DATA = {
  "lastUpdate": 1782928746549,
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
          "id": "48b134a4c8992531e78175a09b049e21b79b86fd",
          "message": "feat: switch to toml for presets (#320)\n\n* feat: switch to toml for presets\n\n* fix: address toml preset pr checks\n\n* linting\n\n* improve format",
          "timestamp": "2026-06-20T13:35:10Z",
          "tree_id": "aa0c6598421f9027e1fed9ae5651b16016ea62a1",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/48b134a4c8992531e78175a09b049e21b79b86fd"
        },
        "date": 1781963054371,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3658018,
            "range": "± 16082",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5452835,
            "range": "± 83901",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6664727,
            "range": "± 28535",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2838999,
            "range": "± 9457",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2867272,
            "range": "± 42701",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2901805,
            "range": "± 7632",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9895487,
            "range": "± 42079",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12871832,
            "range": "± 191649",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14747653,
            "range": "± 248427",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12166207,
            "range": "± 49035",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16817846,
            "range": "± 82313",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19185987,
            "range": "± 84161",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7752379,
            "range": "± 51166",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10014013,
            "range": "± 43126",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11391136,
            "range": "± 47987",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5030440,
            "range": "± 38384",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6765610,
            "range": "± 22953",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7927155,
            "range": "± 42231",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10174619,
            "range": "± 49809",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13292630,
            "range": "± 45246",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14558623,
            "range": "± 71340",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7626899,
            "range": "± 21272",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10216099,
            "range": "± 47656",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11903289,
            "range": "± 188554",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4576509,
            "range": "± 25406",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6890141,
            "range": "± 68624",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8461603,
            "range": "± 36734",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4654578,
            "range": "± 17768",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7226536,
            "range": "± 46519",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 8995363,
            "range": "± 33234",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8433134,
            "range": "± 38148",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11285576,
            "range": "± 48502",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12941839,
            "range": "± 117264",
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
          "id": "0926e215636dc9e84317a85bdd7db146ac6fbec7",
          "message": "fix: atomic global settings persistence with in-memory cache (#318)\n\n* fix: atomic global settings persistence with in-memory cache\n\n- Replace bare fs::write with atomic write-to-temp-then-rename\n- Add in-memory RwLock cache to avoid TOCTOU races\n- save_voice_limit/save_midi_learn_bindings modify cache directly\n- load_or_init_global_settings checks cache before disk read\n- Reset cache between tests to prevent cross-test contamination\n\n* improve",
          "timestamp": "2026-06-20T13:42:10Z",
          "tree_id": "29dd217c9ded5b8d288acfd99f245a4419a71cf4",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/0926e215636dc9e84317a85bdd7db146ac6fbec7"
        },
        "date": 1781963474828,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4476871,
            "range": "± 269875",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6271255,
            "range": "± 73399",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7414788,
            "range": "± 26758",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3577829,
            "range": "± 47213",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3578225,
            "range": "± 22260",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3589733,
            "range": "± 9582",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10243536,
            "range": "± 155227",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12940029,
            "range": "± 273870",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14683149,
            "range": "± 180319",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12680357,
            "range": "± 36018",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17160300,
            "range": "± 58832",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19440893,
            "range": "± 99380",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8311889,
            "range": "± 37224",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10417015,
            "range": "± 196530",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11752131,
            "range": "± 78389",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5490822,
            "range": "± 85838",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7294382,
            "range": "± 95754",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8387142,
            "range": "± 59144",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10852286,
            "range": "± 73284",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14018898,
            "range": "± 53875",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15262670,
            "range": "± 215871",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8274932,
            "range": "± 46269",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10830049,
            "range": "± 38571",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12568653,
            "range": "± 111912",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5295083,
            "range": "± 22095",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7550685,
            "range": "± 26954",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9128627,
            "range": "± 44955",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5366918,
            "range": "± 21860",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7916661,
            "range": "± 29701",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9738574,
            "range": "± 34262",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8942631,
            "range": "± 25277",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11653978,
            "range": "± 39115",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13300513,
            "range": "± 43610",
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
          "id": "d1d49bd7cfa8f9f2c50edac92f6560c759591736",
          "message": "test: add golden-value tests for envelope conversion parity with Rust (#321)\n\n* test: add golden-value tests for envelope conversion parity with Rust\n\n- Export rawRateToHuman/rawLevelToHuman for testing\n- Add 41 golden-value tests verifying TS matches Rust envelope_map.rs\n- Covers all envelope kinds (DCO/DCW/DCA) at boundary values\n\n* refactor: extract envelope conversion helpers into pure module\n\n* lint",
          "timestamp": "2026-06-20T14:03:55Z",
          "tree_id": "815c37f5f29999805bcde8fa27c501808c153445",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/d1d49bd7cfa8f9f2c50edac92f6560c759591736"
        },
        "date": 1781964776683,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4352292,
            "range": "± 60861",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6277859,
            "range": "± 19046",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7540725,
            "range": "± 37115",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3444719,
            "range": "± 19150",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3452032,
            "range": "± 12702",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3455339,
            "range": "± 12255",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10365636,
            "range": "± 112767",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13465502,
            "range": "± 37506",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15511138,
            "range": "± 30852",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12593691,
            "range": "± 43591",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17392298,
            "range": "± 46539",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19694041,
            "range": "± 69838",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8456988,
            "range": "± 92316",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10938551,
            "range": "± 31444",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12394533,
            "range": "± 37023",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5412601,
            "range": "± 69067",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7288354,
            "range": "± 28132",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8513119,
            "range": "± 47680",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10930814,
            "range": "± 143797",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14430498,
            "range": "± 30932",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15763778,
            "range": "± 80824",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8399299,
            "range": "± 30505",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11337256,
            "range": "± 30919",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13292509,
            "range": "± 58043",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5300157,
            "range": "± 153154",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7882270,
            "range": "± 33375",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9597398,
            "range": "± 38491",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5325828,
            "range": "± 20142",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8004344,
            "range": "± 51539",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9879497,
            "range": "± 25552",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9058944,
            "range": "± 33242",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12012775,
            "range": "± 35475",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13720460,
            "range": "± 34482",
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
          "id": "0f16f7ffa534ccbb0663ee4415f8fbe357de20c1",
          "message": "chore: remove xtask pkg",
          "timestamp": "2026-06-20T10:40:31-04:00",
          "tree_id": "d8e6bd1ed110192a50f2ad8ad5689a7bee052503",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/0f16f7ffa534ccbb0663ee4415f8fbe357de20c1"
        },
        "date": 1781966974413,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4492075,
            "range": "± 33551",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6267283,
            "range": "± 87807",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7485515,
            "range": "± 77068",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3595413,
            "range": "± 20118",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3602011,
            "range": "± 21853",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3609293,
            "range": "± 29749",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10244155,
            "range": "± 89572",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12928407,
            "range": "± 253478",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14753432,
            "range": "± 205959",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12680395,
            "range": "± 33152",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17178685,
            "range": "± 66898",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19401054,
            "range": "± 213332",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8314539,
            "range": "± 52369",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10479769,
            "range": "± 52150",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11718994,
            "range": "± 79953",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5489087,
            "range": "± 20147",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7278479,
            "range": "± 58672",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8437510,
            "range": "± 203629",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10802958,
            "range": "± 32327",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13987845,
            "range": "± 52040",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15239176,
            "range": "± 325615",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8257520,
            "range": "± 487265",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10719411,
            "range": "± 32120",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12475190,
            "range": "± 37492",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5300288,
            "range": "± 31041",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7568271,
            "range": "± 80239",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9086527,
            "range": "± 101275",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5407038,
            "range": "± 70032",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7918520,
            "range": "± 59053",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9836038,
            "range": "± 76953",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8958583,
            "range": "± 41292",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11664657,
            "range": "± 186860",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13274948,
            "range": "± 45955",
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
          "id": "073f04a2998e6c844c32db4896416e0f7107e255",
          "message": "update truce",
          "timestamp": "2026-06-20T14:58:05-04:00",
          "tree_id": "f7a0d0e73f0c41263f1341d369577722dd457e8b",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/073f04a2998e6c844c32db4896416e0f7107e255"
        },
        "date": 1781982431806,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4349768,
            "range": "± 36732",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6284136,
            "range": "± 71417",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7596940,
            "range": "± 46155",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3441654,
            "range": "± 30970",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3461477,
            "range": "± 21623",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3465868,
            "range": "± 15170",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10351402,
            "range": "± 41380",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13484293,
            "range": "± 56100",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15550970,
            "range": "± 256339",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12647443,
            "range": "± 72822",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17391353,
            "range": "± 69996",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19674967,
            "range": "± 75034",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8427182,
            "range": "± 43673",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10969180,
            "range": "± 52473",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12435922,
            "range": "± 68147",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5383716,
            "range": "± 20181",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7289653,
            "range": "± 27315",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8549215,
            "range": "± 38061",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10911859,
            "range": "± 33165",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14424580,
            "range": "± 46659",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15773418,
            "range": "± 64693",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8390785,
            "range": "± 56923",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11351629,
            "range": "± 53944",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13266805,
            "range": "± 78298",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5275162,
            "range": "± 18553",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7854683,
            "range": "± 63592",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9610007,
            "range": "± 41046",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5341141,
            "range": "± 23976",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8080344,
            "range": "± 47399",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9957812,
            "range": "± 56199",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9063827,
            "range": "± 27987",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12021758,
            "range": "± 39110",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13738220,
            "range": "± 200460",
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
          "id": "675a36f2302595bc387a8a9d1e7ab24ebccb6021",
          "message": "fix vst3 cc implementation",
          "timestamp": "2026-06-20T19:32:48-04:00",
          "tree_id": "dcf102a0e827c82564e941ddc880ed7d4928732b",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/675a36f2302595bc387a8a9d1e7ab24ebccb6021"
        },
        "date": 1781998914952,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4593012,
            "range": "± 49922",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6337442,
            "range": "± 36829",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7536490,
            "range": "± 34663",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3648115,
            "range": "± 55301",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3631495,
            "range": "± 73231",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3651981,
            "range": "± 36958",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10467929,
            "range": "± 64332",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13180091,
            "range": "± 254942",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14893207,
            "range": "± 331026",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12930225,
            "range": "± 47366",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17357807,
            "range": "± 60240",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19706303,
            "range": "± 60445",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8572664,
            "range": "± 122694",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10641347,
            "range": "± 74706",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11948562,
            "range": "± 202143",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5632448,
            "range": "± 91443",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7417213,
            "range": "± 34435",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8520749,
            "range": "± 54873",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11079985,
            "range": "± 259317",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14268261,
            "range": "± 56071",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15509788,
            "range": "± 539658",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8476243,
            "range": "± 71588",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11004327,
            "range": "± 30026",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12720950,
            "range": "± 325586",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5451277,
            "range": "± 42539",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7728919,
            "range": "± 72428",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9297366,
            "range": "± 139959",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5516545,
            "range": "± 118491",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7992358,
            "range": "± 122620",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9874365,
            "range": "± 127468",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9253414,
            "range": "± 87193",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11968327,
            "range": "± 271243",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13570718,
            "range": "± 60475",
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
          "id": "6ba964c9939fac77fddcbedb6f096ae3716dd6b8",
          "message": "fix: midi mapping issues (#322)\n\n* first pass\n\n* fix lag\n\n* lint\n\n* fix(midi-learn): generic algo-control MIDI targets with plugin local capture\n\nAlgo-control MIDI mappings now use generic slot-based keys\n(lineNAlgoControlN) instead of algo-specific IDs. This means\nmappings persist across algo changes — the same slot controls\nwhichever control occupies that position in the new algo.\n\nPlugin mode: non-native-backed targets (algo controls) are now\ncaptured locally via captureBindingLocally so JS applies them\nimmediately, while native-backed params still defer to the\nplugin host. Removed stale sectionId prop from component chain.\n\nTests: generic key generation, max-8 slot boundary, plugin-mode\nlocal capture for UI-only targets, no-regression for native\ndeferral.\n\n* fix algo control mappings\n\n* make all mappings smooth\n\n* fix line oct",
          "timestamp": "2026-06-21T11:30:14-04:00",
          "tree_id": "572e54e126829d26acaa2d3a4ab85ed7a3930f83",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/6ba964c9939fac77fddcbedb6f096ae3716dd6b8"
        },
        "date": 1782056358642,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4311445,
            "range": "± 18846",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6222784,
            "range": "± 130671",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7554953,
            "range": "± 59837",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3427602,
            "range": "± 68268",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3439359,
            "range": "± 13446",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3468283,
            "range": "± 38324",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10561295,
            "range": "± 37293",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13686257,
            "range": "± 43580",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15739568,
            "range": "± 256710",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12670244,
            "range": "± 54305",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17451020,
            "range": "± 97885",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19821543,
            "range": "± 325730",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8445110,
            "range": "± 56634",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10925005,
            "range": "± 130506",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12289909,
            "range": "± 65845",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5449428,
            "range": "± 30492",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7331848,
            "range": "± 68085",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8555020,
            "range": "± 62378",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11035894,
            "range": "± 59325",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14516634,
            "range": "± 113116",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15695358,
            "range": "± 63124",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8495508,
            "range": "± 41298",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11413775,
            "range": "± 64454",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13262913,
            "range": "± 35164",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5309288,
            "range": "± 25431",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7856920,
            "range": "± 35015",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9556192,
            "range": "± 151363",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5316445,
            "range": "± 17999",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7979944,
            "range": "± 21213",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9872494,
            "range": "± 21887",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9100718,
            "range": "± 46068",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12096104,
            "range": "± 63269",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13748753,
            "range": "± 57776",
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
          "id": "f56b25a8c87d06b9fd6d26567fd2326cc8d2c1a1",
          "message": "feat: add adr to mod env (#325)\n\n* add adr mode\n\n* fix env behavior\n\n* fix env",
          "timestamp": "2026-06-26T12:13:30-04:00",
          "tree_id": "237f06ede76d1352ea1df02a9d7dc1cd845d266c",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/f56b25a8c87d06b9fd6d26567fd2326cc8d2c1a1"
        },
        "date": 1782490947677,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4507671,
            "range": "± 147316",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6287108,
            "range": "± 197059",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7448794,
            "range": "± 172626",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3575932,
            "range": "± 14571",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3584944,
            "range": "± 20744",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3593677,
            "range": "± 36053",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10518465,
            "range": "± 46103",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13262431,
            "range": "± 146403",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15053894,
            "range": "± 22824",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12940249,
            "range": "± 215396",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17515098,
            "range": "± 202277",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19751676,
            "range": "± 81488",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8413751,
            "range": "± 64099",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10667728,
            "range": "± 144615",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12007284,
            "range": "± 272859",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5502149,
            "range": "± 224959",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7312788,
            "range": "± 112975",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8428091,
            "range": "± 450716",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11120105,
            "range": "± 34318",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14361401,
            "range": "± 190291",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15581230,
            "range": "± 199557",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8345079,
            "range": "± 35027",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10958003,
            "range": "± 66894",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12660915,
            "range": "± 157401",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5372850,
            "range": "± 24578",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7679594,
            "range": "± 55146",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9259504,
            "range": "± 131450",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5394354,
            "range": "± 23354",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7907983,
            "range": "± 35402",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9775049,
            "range": "± 43884",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9149254,
            "range": "± 31827",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11920464,
            "range": "± 41341",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13663595,
            "range": "± 62684",
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
          "id": "b56d8e07140460ba9e3facb3606d389860d12567",
          "message": "feat: move preset specific settings out of global menu (#326)\n\n* feat: move voice settings to dedicated panel and update related tests\n\n* fix tests\n\n* fix build",
          "timestamp": "2026-06-26T13:09:00-04:00",
          "tree_id": "408ad0f62d223ade59d3c3314b54cf3147b9e55f",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/b56d8e07140460ba9e3facb3606d389860d12567"
        },
        "date": 1782494294828,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4309548,
            "range": "± 48703",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6024018,
            "range": "± 192750",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7214603,
            "range": "± 166128",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3280146,
            "range": "± 71766",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3320469,
            "range": "± 80216",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3306110,
            "range": "± 69024",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9868908,
            "range": "± 194906",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12824195,
            "range": "± 428024",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14733940,
            "range": "± 225702",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12175183,
            "range": "± 270793",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16730215,
            "range": "± 344386",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18750575,
            "range": "± 380566",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8019774,
            "range": "± 169635",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10462909,
            "range": "± 241341",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11712792,
            "range": "± 240438",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5188286,
            "range": "± 96267",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7023477,
            "range": "± 149775",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8251391,
            "range": "± 166163",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10446984,
            "range": "± 203593",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13779262,
            "range": "± 275509",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15866562,
            "range": "± 211928",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8378468,
            "range": "± 79328",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11333706,
            "range": "± 73715",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12745447,
            "range": "± 272456",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5112501,
            "range": "± 123552",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7534922,
            "range": "± 160139",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9062061,
            "range": "± 197031",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5407430,
            "range": "± 67762",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8071825,
            "range": "± 128604",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10051798,
            "range": "± 22878",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8974760,
            "range": "± 181016",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11822601,
            "range": "± 259281",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13578847,
            "range": "± 227498",
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
          "id": "845f15c48c8868cebc12ea361993eb83a1ae9e07",
          "message": "feat: add more mod targets (#327)\n\nadd more mod targets",
          "timestamp": "2026-06-26T14:58:07-04:00",
          "tree_id": "77b9dbfe4706434c943d6ed6395dcd1ebd3ec0ac",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/845f15c48c8868cebc12ea361993eb83a1ae9e07"
        },
        "date": 1782500828460,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4502443,
            "range": "± 49772",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6256573,
            "range": "± 79008",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7430754,
            "range": "± 41765",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3591285,
            "range": "± 25585",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3604486,
            "range": "± 32841",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3603602,
            "range": "± 24084",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10327276,
            "range": "± 29804",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12945643,
            "range": "± 199466",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14779220,
            "range": "± 334671",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12669133,
            "range": "± 26488",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17197819,
            "range": "± 46303",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19461187,
            "range": "± 42728",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8318153,
            "range": "± 56875",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10441106,
            "range": "± 61927",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11762693,
            "range": "± 33558",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5493894,
            "range": "± 43565",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7228244,
            "range": "± 234935",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8418466,
            "range": "± 96474",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10923816,
            "range": "± 35818",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14097341,
            "range": "± 41795",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15365937,
            "range": "± 239123",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8254952,
            "range": "± 27478",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10750215,
            "range": "± 197625",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12502808,
            "range": "± 54023",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5300853,
            "range": "± 33741",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7526734,
            "range": "± 63199",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9076903,
            "range": "± 89246",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5412753,
            "range": "± 47626",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7880414,
            "range": "± 44593",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9823445,
            "range": "± 174149",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9012373,
            "range": "± 151673",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11691076,
            "range": "± 44669",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13399804,
            "range": "± 246956",
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
          "id": "281bb4c3d94735f13f43f4da30a45c22cd47b881",
          "message": "add missing version bump",
          "timestamp": "2026-06-27T09:08:16-04:00",
          "tree_id": "a49c7f47935d7fd08463a3a9376dfd86ea6229b2",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/281bb4c3d94735f13f43f4da30a45c22cd47b881"
        },
        "date": 1782566244504,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3907568,
            "range": "± 31710",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5753759,
            "range": "± 79152",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6982900,
            "range": "± 62593",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3018260,
            "range": "± 39236",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3035800,
            "range": "± 38046",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3056320,
            "range": "± 33017",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10180322,
            "range": "± 46322",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13060369,
            "range": "± 34375",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15008387,
            "range": "± 95952",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12421389,
            "range": "± 37457",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17051725,
            "range": "± 50537",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19387910,
            "range": "± 240465",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7984671,
            "range": "± 56522",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10300828,
            "range": "± 143835",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11636964,
            "range": "± 27632",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5307823,
            "range": "± 103702",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7079615,
            "range": "± 53892",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8237114,
            "range": "± 128346",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10458933,
            "range": "± 31285",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13659486,
            "range": "± 40958",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14914602,
            "range": "± 38315",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7865006,
            "range": "± 31157",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10484774,
            "range": "± 39506",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12181594,
            "range": "± 58342",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4832459,
            "range": "± 62271",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7184735,
            "range": "± 132630",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8792814,
            "range": "± 31340",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4874208,
            "range": "± 34283",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7432718,
            "range": "± 37014",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9265178,
            "range": "± 33100",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8707318,
            "range": "± 89269",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11549031,
            "range": "± 32036",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13196448,
            "range": "± 29160",
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
          "id": "25c162c87eb917f4dcafda153c37d21a0382b44e",
          "message": "fix: keep modulated slider value indicator visible",
          "timestamp": "2026-06-27T09:14:23-04:00",
          "tree_id": "ebc3eb11fa7d19936f99a9c6f6d9c91106b96a10",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/25c162c87eb917f4dcafda153c37d21a0382b44e"
        },
        "date": 1782566615143,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4330346,
            "range": "± 24161",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6254452,
            "range": "± 70229",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7525328,
            "range": "± 73563",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3454582,
            "range": "± 31373",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3471016,
            "range": "± 24327",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3465164,
            "range": "± 13012",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10404622,
            "range": "± 35458",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13484688,
            "range": "± 189355",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15490120,
            "range": "± 231639",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12553777,
            "range": "± 82768",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17400772,
            "range": "± 394379",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19738853,
            "range": "± 371027",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8373800,
            "range": "± 39013",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10836590,
            "range": "± 23549",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12287412,
            "range": "± 133121",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5469137,
            "range": "± 22305",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7352521,
            "range": "± 69639",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8652725,
            "range": "± 57366",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10992485,
            "range": "± 44030",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14553014,
            "range": "± 145386",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15858730,
            "range": "± 104257",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8402972,
            "range": "± 30217",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11340100,
            "range": "± 251848",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13246980,
            "range": "± 203165",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5297486,
            "range": "± 14604",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7857905,
            "range": "± 175896",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9575528,
            "range": "± 185698",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5409674,
            "range": "± 91789",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8111949,
            "range": "± 56547",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10033314,
            "range": "± 153257",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9085547,
            "range": "± 120020",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12026392,
            "range": "± 32242",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13730738,
            "range": "± 30006",
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
          "id": "aff1666e9e454cc809e93c58290454c35e9aa1ab",
          "message": "feat: add midi learn overlay for buttons (#328)\n\n* add midi learn overlay for buttons\n\n* fix build",
          "timestamp": "2026-06-27T09:47:45-04:00",
          "tree_id": "47b507272064f1f5ac5e2fc3542f18cbdde0aa93",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/aff1666e9e454cc809e93c58290454c35e9aa1ab"
        },
        "date": 1782568617642,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4335505,
            "range": "± 20911",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6264354,
            "range": "± 150787",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7539905,
            "range": "± 57981",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3458733,
            "range": "± 22868",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3459914,
            "range": "± 9726",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3472276,
            "range": "± 28230",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10430616,
            "range": "± 24023",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13552740,
            "range": "± 60166",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15557523,
            "range": "± 52255",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12654120,
            "range": "± 43134",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17542761,
            "range": "± 71357",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19925995,
            "range": "± 160784",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8443167,
            "range": "± 28588",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10890800,
            "range": "± 44478",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12377798,
            "range": "± 48259",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5489183,
            "range": "± 43916",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7384550,
            "range": "± 61848",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8673186,
            "range": "± 27758",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11031423,
            "range": "± 39023",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14615482,
            "range": "± 88170",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15913819,
            "range": "± 147598",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8389295,
            "range": "± 25846",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11401501,
            "range": "± 51104",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13389299,
            "range": "± 165054",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5357910,
            "range": "± 33075",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7919562,
            "range": "± 36645",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9609914,
            "range": "± 84168",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5449103,
            "range": "± 217269",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8247779,
            "range": "± 42565",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10185824,
            "range": "± 113740",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9247806,
            "range": "± 46212",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12248418,
            "range": "± 112342",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13780927,
            "range": "± 58880",
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
          "id": "d108909bbe59536f43d42e09a7efaf13336cd0e5",
          "message": "chore: update truce",
          "timestamp": "2026-06-27T10:50:03-04:00",
          "tree_id": "2ec1f562aa4208c766b73fe108a571987c6860a8",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/d108909bbe59536f43d42e09a7efaf13336cd0e5"
        },
        "date": 1782572343008,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3670089,
            "range": "± 26689",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5494758,
            "range": "± 95107",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6722404,
            "range": "± 53534",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2837566,
            "range": "± 15486",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2862661,
            "range": "± 6846",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2896835,
            "range": "± 10486",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9939618,
            "range": "± 52012",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12885907,
            "range": "± 57459",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14921050,
            "range": "± 67546",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12252344,
            "range": "± 71853",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17010321,
            "range": "± 72535",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19335317,
            "range": "± 26262",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7820467,
            "range": "± 51178",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10137286,
            "range": "± 33047",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11565850,
            "range": "± 77855",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5035841,
            "range": "± 18027",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6799405,
            "range": "± 32208",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7989189,
            "range": "± 121264",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10250715,
            "range": "± 123297",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13456238,
            "range": "± 52383",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14759214,
            "range": "± 50116",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7664868,
            "range": "± 67404",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10328417,
            "range": "± 100937",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12000515,
            "range": "± 72815",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4586469,
            "range": "± 32279",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6965077,
            "range": "± 74808",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8572604,
            "range": "± 72227",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4641700,
            "range": "± 166780",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7199179,
            "range": "± 57249",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9057252,
            "range": "± 51011",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8463228,
            "range": "± 84203",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11371345,
            "range": "± 55568",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13038308,
            "range": "± 46209",
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
          "id": "f6b508b15fa2156b70d662901b894877e7f9014b",
          "message": "chore(deps): update cargo non-major dependencies (#307)\n\n* chore(deps): update cargo non-major dependencies\n\n* update engine\n\n---------\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>\nCo-authored-by: Felix Perron-Brault <fpbrault@gmail.com>",
          "timestamp": "2026-06-27T14:59:29Z",
          "tree_id": "c7d4d965747db286ed2d3920cafe0e3d3df6dd5d",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/f6b508b15fa2156b70d662901b894877e7f9014b"
        },
        "date": 1782572910642,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4335128,
            "range": "± 72353",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6230851,
            "range": "± 242908",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7509811,
            "range": "± 68070",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3425412,
            "range": "± 11966",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3451383,
            "range": "± 19860",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3468398,
            "range": "± 12624",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10399548,
            "range": "± 148287",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13505149,
            "range": "± 52443",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15493226,
            "range": "± 115016",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12496939,
            "range": "± 55594",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17271617,
            "range": "± 58135",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19639254,
            "range": "± 84683",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8337028,
            "range": "± 39685",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10784252,
            "range": "± 172410",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12219659,
            "range": "± 46072",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5452409,
            "range": "± 70795",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7334320,
            "range": "± 25610",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8615574,
            "range": "± 27986",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10917131,
            "range": "± 39141",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14477598,
            "range": "± 48588",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15791988,
            "range": "± 37692",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8377266,
            "range": "± 341594",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11323756,
            "range": "± 33565",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13222426,
            "range": "± 155830",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5294095,
            "range": "± 21298",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7826505,
            "range": "± 23764",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9515620,
            "range": "± 17960",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5372918,
            "range": "± 22907",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8072993,
            "range": "± 19478",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9981890,
            "range": "± 25511",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9029168,
            "range": "± 32186",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12000260,
            "range": "± 33800",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13676308,
            "range": "± 31240",
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
          "id": "9d4e0bc9538eebd8160b03918cafb78dd5ddaa87",
          "message": "fix tests and params uniqueness",
          "timestamp": "2026-06-27T11:15:26-04:00",
          "tree_id": "bc1eaf2819e8f9e0cb78626165316f49ced26e87",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/9d4e0bc9538eebd8160b03918cafb78dd5ddaa87"
        },
        "date": 1782573866781,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4309054,
            "range": "± 141897",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6220317,
            "range": "± 24474",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7485296,
            "range": "± 26408",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3397812,
            "range": "± 10595",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3418096,
            "range": "± 10113",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3428383,
            "range": "± 18727",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10232752,
            "range": "± 151997",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13356140,
            "range": "± 57312",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15373431,
            "range": "± 160707",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12394943,
            "range": "± 133468",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17148359,
            "range": "± 65399",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19473168,
            "range": "± 71308",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8307168,
            "range": "± 29088",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10781065,
            "range": "± 102324",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12175440,
            "range": "± 52466",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5413388,
            "range": "± 52634",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7307369,
            "range": "± 54933",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8575663,
            "range": "± 63049",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10858529,
            "range": "± 37956",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14425111,
            "range": "± 55490",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15732265,
            "range": "± 50835",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8362048,
            "range": "± 18591",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11286303,
            "range": "± 34513",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13177960,
            "range": "± 49301",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5275018,
            "range": "± 43507",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7815611,
            "range": "± 31498",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9486743,
            "range": "± 15055",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5344732,
            "range": "± 15670",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8057284,
            "range": "± 168736",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10010677,
            "range": "± 57961",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8985449,
            "range": "± 44429",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12032942,
            "range": "± 83646",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13691013,
            "range": "± 221801",
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
          "id": "11f8082af65ad41cb2e65b0d92671e07846a1e8c",
          "message": "fix: debounce midi learn on prev/next buttons (#329)\n\n* debounce midi learn on prev/next buttons\n\n* fix test\n\n* trigger tests",
          "timestamp": "2026-06-27T19:12:47Z",
          "tree_id": "ce507aa61888aebd9d4f60bb9d5a0e7dca79fb52",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/11f8082af65ad41cb2e65b0d92671e07846a1e8c"
        },
        "date": 1782588110579,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4313386,
            "range": "± 18637",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6241290,
            "range": "± 98636",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7512388,
            "range": "± 23193",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3418164,
            "range": "± 13781",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3439799,
            "range": "± 53705",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3455533,
            "range": "± 6887",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10235537,
            "range": "± 27705",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13298730,
            "range": "± 64592",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15371202,
            "range": "± 384591",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12473764,
            "range": "± 252327",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17248953,
            "range": "± 45998",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19566685,
            "range": "± 45167",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8305184,
            "range": "± 24152",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10765502,
            "range": "± 29372",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12173531,
            "range": "± 32225",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5441320,
            "range": "± 20756",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7334140,
            "range": "± 38348",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8583147,
            "range": "± 35184",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10842132,
            "range": "± 17517",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14427505,
            "range": "± 39235",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15727692,
            "range": "± 100815",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8363626,
            "range": "± 27738",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11285114,
            "range": "± 25857",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13178174,
            "range": "± 28751",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5264123,
            "range": "± 20998",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7803094,
            "range": "± 30004",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9528418,
            "range": "± 36345",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5346011,
            "range": "± 17952",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8064542,
            "range": "± 32408",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10008605,
            "range": "± 23142",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8985003,
            "range": "± 25228",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11958126,
            "range": "± 32058",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13612002,
            "range": "± 53512",
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
          "id": "17dcb6b16912cc7b92ea4dc61e4bc0b60e373db3",
          "message": "feat: add resize handle for auv2 (#331)\n\n* add resize handle for auv2\n\n* add tests",
          "timestamp": "2026-06-29T11:25:56-04:00",
          "tree_id": "84ffdbe1e183a631d372337a8315911c1c46f7ce",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/17dcb6b16912cc7b92ea4dc61e4bc0b60e373db3"
        },
        "date": 1782747298244,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4500997,
            "range": "± 104985",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6252598,
            "range": "± 20830",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7475484,
            "range": "± 18147",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3530921,
            "range": "± 8041",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3534999,
            "range": "± 18474",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3541388,
            "range": "± 8712",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10338556,
            "range": "± 22035",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12975107,
            "range": "± 23990",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14794740,
            "range": "± 32371",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12728809,
            "range": "± 25888",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17249797,
            "range": "± 38171",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19516785,
            "range": "± 29994",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8321406,
            "range": "± 33301",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10469146,
            "range": "± 18015",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11812486,
            "range": "± 31763",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5511326,
            "range": "± 13848",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7254082,
            "range": "± 17091",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8472483,
            "range": "± 24216",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10915147,
            "range": "± 20908",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14160558,
            "range": "± 29155",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15389067,
            "range": "± 33382",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8252047,
            "range": "± 19723",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10759071,
            "range": "± 37937",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12513009,
            "range": "± 37722",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5312527,
            "range": "± 17703",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7511770,
            "range": "± 22668",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9097088,
            "range": "± 36889",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5378566,
            "range": "± 15912",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7874795,
            "range": "± 24414",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9816662,
            "range": "± 34039",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8994559,
            "range": "± 31000",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11684127,
            "range": "± 34652",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13330283,
            "range": "± 35829",
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
          "id": "deac7d2ff33b89a5f820c9ed9794537daa6454c1",
          "message": "feat: add viz for random mod source (#332)",
          "timestamp": "2026-06-30T15:18:52-04:00",
          "tree_id": "31ade247227cf2cf82092c7b26adf9a83735be38",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/deac7d2ff33b89a5f820c9ed9794537daa6454c1"
        },
        "date": 1782847677231,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4404660,
            "range": "± 29728",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6384623,
            "range": "± 84436",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7772637,
            "range": "± 375208",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3519559,
            "range": "± 40198",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3523655,
            "range": "± 28006",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3572373,
            "range": "± 37315",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10665773,
            "range": "± 49777",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13767939,
            "range": "± 138910",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15861882,
            "range": "± 34875",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12788362,
            "range": "± 71699",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17729517,
            "range": "± 76616",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 20011469,
            "range": "± 246791",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8484107,
            "range": "± 88770",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 11009463,
            "range": "± 96447",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12454800,
            "range": "± 72847",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5665681,
            "range": "± 53050",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7511115,
            "range": "± 56502",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8793002,
            "range": "± 51572",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11224676,
            "range": "± 94947",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14885027,
            "range": "± 127136",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 16154927,
            "range": "± 198762",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8462950,
            "range": "± 85673",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11476812,
            "range": "± 57117",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13473393,
            "range": "± 77047",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5320986,
            "range": "± 45690",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7907003,
            "range": "± 49604",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9612748,
            "range": "± 58574",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5402251,
            "range": "± 45747",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8156468,
            "range": "± 50065",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10130853,
            "range": "± 78128",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9170563,
            "range": "± 108260",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12191824,
            "range": "± 96755",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13899985,
            "range": "± 64486",
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
          "id": "4dbb4af212c6e3ece88c757e51d96b058b0d510e",
          "message": "fix: random mod polish (#333)\n\nimprove perf and add bpm sync for random mod",
          "timestamp": "2026-07-01T13:49:49-04:00",
          "tree_id": "5fbc51fee7cf141468f3eac2e621b8096ae73a2a",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/4dbb4af212c6e3ece88c757e51d96b058b0d510e"
        },
        "date": 1782928744093,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4551780,
            "range": "± 153007",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6497586,
            "range": "± 67272",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7751002,
            "range": "± 69041",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3656277,
            "range": "± 37939",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3676665,
            "range": "± 71508",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3721061,
            "range": "± 42679",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10569173,
            "range": "± 71500",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13784332,
            "range": "± 346984",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15842113,
            "range": "± 109709",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12802577,
            "range": "± 91368",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17747177,
            "range": "± 337549",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 20154892,
            "range": "± 85777",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8528857,
            "range": "± 102269",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 11104957,
            "range": "± 65709",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12607754,
            "range": "± 40165",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5695717,
            "range": "± 50275",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7686674,
            "range": "± 69333",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8900889,
            "range": "± 38239",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11318837,
            "range": "± 50056",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14936568,
            "range": "± 58104",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 16184589,
            "range": "± 327259",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8695819,
            "range": "± 101334",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11721562,
            "range": "± 39803",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13646119,
            "range": "± 291159",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5439561,
            "range": "± 28437",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 8037216,
            "range": "± 98977",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9973757,
            "range": "± 225694",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5582874,
            "range": "± 39472",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8270790,
            "range": "± 89078",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10104313,
            "range": "± 51503",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9258671,
            "range": "± 36694",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12354300,
            "range": "± 91897",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 14207311,
            "range": "± 185352",
            "unit": "ns/iter"
          }
        ]
      }
    ]
  }
}