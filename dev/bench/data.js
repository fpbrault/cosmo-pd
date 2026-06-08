window.BENCHMARK_DATA = {
  "lastUpdate": 1780931840340,
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
          "id": "eaec4dcaaa2f9c185cbe04b4f3aa1e55702c5bda",
          "message": "fix: portamento defaults to time mode with 0.10s time (#274)\n\n* fix: portamento defaults to time mode with 0.10s time\n\nFour locations defaulted to rate mode or incorrect values:\n- PortamentoMode enum had #[default] on Rate instead of Time\n- applyPreset fell back to 'rate' instead of 'time'\n- czPresetConverter hardcoded mode to 'rate'\n- DAW plugin params had mismatched rate=30.0 and time=0.0 defaults\n  (engine expects rate=85.0, time=0.1)\n\n* fix(factory-presets): change all portamento mode from rate to time\n\n* fix preset portamento time\n\n* Engine build\n\n* fix: update delay and grainDelay time parameters for consistency",
          "timestamp": "2026-06-07T18:02:44Z",
          "tree_id": "3b5d0521fef553197a1cb7f257fc4f456c6f8980",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/eaec4dcaaa2f9c185cbe04b4f3aa1e55702c5bda"
        },
        "date": 1780855925984,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3174240,
            "range": "± 135026",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4790392,
            "range": "± 60488",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5954304,
            "range": "± 73844",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2239218,
            "range": "± 22522",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2244177,
            "range": "± 26999",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2247128,
            "range": "± 23189",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8109251,
            "range": "± 86285",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10790626,
            "range": "± 220720",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12639134,
            "range": "± 40177",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10033770,
            "range": "± 22990",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 14645926,
            "range": "± 175891",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17367979,
            "range": "± 217743",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6252436,
            "range": "± 70726",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8357990,
            "range": "± 61254",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9647848,
            "range": "± 104099",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4121381,
            "range": "± 8786",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5710263,
            "range": "± 47799",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6818802,
            "range": "± 95850",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8622472,
            "range": "± 146771",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 11760730,
            "range": "± 46542",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13075676,
            "range": "± 23617",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6043971,
            "range": "± 41433",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8529679,
            "range": "± 14540",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10153483,
            "range": "± 31458",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3791768,
            "range": "± 20264",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6068125,
            "range": "± 53867",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7554693,
            "range": "± 116201",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3636670,
            "range": "± 37449",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5583013,
            "range": "± 14899",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6958940,
            "range": "± 95405",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 6773016,
            "range": "± 50678",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9245633,
            "range": "± 131238",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 10792429,
            "range": "± 150058",
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
          "id": "04c9b834f165ac136835ea28c51f0fc05c24012c",
          "message": "feat: implement save, list, and delete functionality for FX module presets (#272)\n\n* feat(fx): implement save, list, and delete functionality for FX module presets\n\n* engine\n\n* feat(preset): update library schema version and add migration for fx module presets timestamp",
          "timestamp": "2026-06-07T18:43:17Z",
          "tree_id": "03599742697d1bcd69659df640eda961c5d7064c",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/04c9b834f165ac136835ea28c51f0fc05c24012c"
        },
        "date": 1780858359562,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3183106,
            "range": "± 113308",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4808975,
            "range": "± 38511",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5986795,
            "range": "± 40510",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2226749,
            "range": "± 29315",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2237841,
            "range": "± 20803",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2242554,
            "range": "± 33122",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8179168,
            "range": "± 54674",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10841827,
            "range": "± 39949",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 12679194,
            "range": "± 142332",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10102887,
            "range": "± 22657",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 14678796,
            "range": "± 29819",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 17390428,
            "range": "± 55192",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6308276,
            "range": "± 59015",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8432418,
            "range": "± 35950",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9720756,
            "range": "± 41471",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4141610,
            "range": "± 23416",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5754398,
            "range": "± 42367",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6896309,
            "range": "± 61790",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8732481,
            "range": "± 50663",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 11839907,
            "range": "± 127448",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13176203,
            "range": "± 28284",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6082731,
            "range": "± 75092",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8561244,
            "range": "± 77832",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 10276188,
            "range": "± 38796",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3801530,
            "range": "± 34079",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6097180,
            "range": "± 69347",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 7700069,
            "range": "± 46191",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3644382,
            "range": "± 15308",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5611691,
            "range": "± 29046",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7001732,
            "range": "± 27161",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 6827722,
            "range": "± 27612",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 9302897,
            "range": "± 28730",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 10873980,
            "range": "± 37768",
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
          "id": "7b6dfa08448d38fa769524562fcd5c759341251e",
          "message": "fix(site): make livepage synth fill viewport on iPad/tablet (#277)\n\n* fix(site): make livepage synth fill viewport on iPad/tablet\n\n- Extend isMobile() check with { tablet: true } to detect iPad\n- Remove aspect ratio constraint on mobile/tablet for full viewport fit\n- Hide fullscreen button on mobile/tablet (synth already fills the screen)\n\n* fix(site): disable iOS overscroll bounce on livepage",
          "timestamp": "2026-06-07T19:52:34Z",
          "tree_id": "f5d38e38524cbb10e058b749b25fd2b73bef7f3d",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/7b6dfa08448d38fa769524562fcd5c759341251e"
        },
        "date": 1780862511154,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3308716,
            "range": "± 100195",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5170942,
            "range": "± 56598",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6388715,
            "range": "± 68193",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2345034,
            "range": "± 26646",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2344539,
            "range": "± 46633",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2367009,
            "range": "± 43642",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8596032,
            "range": "± 61662",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11868869,
            "range": "± 69074",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14055862,
            "range": "± 195500",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10305744,
            "range": "± 82621",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15276579,
            "range": "± 111737",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18009328,
            "range": "± 141811",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6618961,
            "range": "± 31221",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9159693,
            "range": "± 161065",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10656746,
            "range": "± 199011",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4322692,
            "range": "± 24044",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6087188,
            "range": "± 18090",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7331941,
            "range": "± 118160",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9172359,
            "range": "± 55793",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12783021,
            "range": "± 166052",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14103088,
            "range": "± 182006",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6597155,
            "range": "± 67031",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9515375,
            "range": "± 48593",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11426647,
            "range": "± 58744",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4280528,
            "range": "± 48994",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6920169,
            "range": "± 54644",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8678518,
            "range": "± 53905",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3733418,
            "range": "± 19288",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5840603,
            "range": "± 88037",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7236307,
            "range": "± 57352",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7399794,
            "range": "± 45848",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10398657,
            "range": "± 61321",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12137024,
            "range": "± 113774",
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
          "id": "77baface3c6ceec89652faf92490a6384f4316dc",
          "message": "feat(site): make live demo a PWA with installable service worker (#275)\n\n* feat(site): make live demo a PWA with installable service worker\n\n* feat(site): hide fancy background in PWA standalone mode, use fullscreen layout\n\n* fix(site): use full viewport layout in PWA standalone; add install button\n\n* fix(site): always show install button on live page, hide when in PWA mode\n\n* fix(site): add manifest link to index.html for PWA install prompt\n\n* fix(site): capture beforeinstallprompt early to avoid React mount race\n\n* chore: remove InstallPwaButton - users add PWA manually",
          "timestamp": "2026-06-07T20:26:44Z",
          "tree_id": "4e83711aa6f1024eeb68d6bf83cd5ecf2b387608",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/77baface3c6ceec89652faf92490a6384f4316dc"
        },
        "date": 1780864553255,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3273234,
            "range": "± 91457",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5117845,
            "range": "± 40318",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6352538,
            "range": "± 24548",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2318730,
            "range": "± 37384",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2323483,
            "range": "± 4057",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2332031,
            "range": "± 7698",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8576310,
            "range": "± 24164",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11805924,
            "range": "± 37887",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13962871,
            "range": "± 28055",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10307966,
            "range": "± 24581",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15269683,
            "range": "± 143154",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18009009,
            "range": "± 53932",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6587212,
            "range": "± 17348",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9120132,
            "range": "± 22229",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10619404,
            "range": "± 225548",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4307905,
            "range": "± 7503",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6061216,
            "range": "± 32570",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7278420,
            "range": "± 110834",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9104593,
            "range": "± 28309",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12699290,
            "range": "± 39556",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14091236,
            "range": "± 39646",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6590812,
            "range": "± 31264",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9459956,
            "range": "± 26768",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11368971,
            "range": "± 33975",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4222917,
            "range": "± 11939",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6827764,
            "range": "± 35898",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8570472,
            "range": "± 31528",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3675743,
            "range": "± 13999",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5755478,
            "range": "± 18511",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7121370,
            "range": "± 35740",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7265568,
            "range": "± 31179",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10260159,
            "range": "± 31419",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11993838,
            "range": "± 30217",
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
          "id": "92fdd4a7fa2f408a8167a7d7ba8cb7b297d375dd",
          "message": "fix(deps): update rust crate dirs to v6 (#279)\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>",
          "timestamp": "2026-06-08T09:36:35-04:00",
          "tree_id": "995aaee868df3c7da784ce02c2e4ad93b4f8eb04",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/92fdd4a7fa2f408a8167a7d7ba8cb7b297d375dd"
        },
        "date": 1780926354796,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3265255,
            "range": "± 114405",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5138129,
            "range": "± 22922",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6380800,
            "range": "± 22130",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2352152,
            "range": "± 20583",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2359215,
            "range": "± 25359",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2391772,
            "range": "± 24069",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8625849,
            "range": "± 75312",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11840275,
            "range": "± 73604",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13943648,
            "range": "± 128798",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10315119,
            "range": "± 29131",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15262285,
            "range": "± 42166",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18049436,
            "range": "± 144473",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6601908,
            "range": "± 25935",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9128541,
            "range": "± 41421",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10589003,
            "range": "± 33204",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4299048,
            "range": "± 14570",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6050641,
            "range": "± 38257",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7261494,
            "range": "± 46016",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9077282,
            "range": "± 37908",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12664246,
            "range": "± 29982",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14027950,
            "range": "± 34532",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6576096,
            "range": "± 60684",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9437898,
            "range": "± 19586",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11333825,
            "range": "± 19863",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4215938,
            "range": "± 20447",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 6799823,
            "range": "± 56201",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8537206,
            "range": "± 16830",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3664125,
            "range": "± 13045",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5846026,
            "range": "± 41620",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7120728,
            "range": "± 20971",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7267121,
            "range": "± 24064",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10279837,
            "range": "± 36662",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 11960973,
            "range": "± 45469",
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
          "id": "4533571232b06cf61ab5858db7a81e5981461478",
          "message": "chore: remove old cosmo-synth-debug harness package (#280)",
          "timestamp": "2026-06-08T09:44:47-04:00",
          "tree_id": "09b2222381902cfadbe311b249eb18ffd0b9d038",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/4533571232b06cf61ab5858db7a81e5981461478"
        },
        "date": 1780926839907,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4460599,
            "range": "± 56449",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6070400,
            "range": "± 40206",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7246274,
            "range": "± 35663",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3458178,
            "range": "± 35535",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3476930,
            "range": "± 43392",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3461150,
            "range": "± 31077",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9515594,
            "range": "± 498692",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12216635,
            "range": "± 187325",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14088366,
            "range": "± 266556",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11436802,
            "range": "± 68870",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15988757,
            "range": "± 30086",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18768996,
            "range": "± 44824",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7572625,
            "range": "± 227645",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9668456,
            "range": "± 44019",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10990946,
            "range": "± 46543",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5404682,
            "range": "± 34467",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7028262,
            "range": "± 87639",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8199548,
            "range": "± 53924",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10049485,
            "range": "± 38791",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13259701,
            "range": "± 332245",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14552767,
            "range": "± 31795",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7398676,
            "range": "± 42874",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9893545,
            "range": "± 40580",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11624126,
            "range": "± 33474",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5104767,
            "range": "± 28905",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7456081,
            "range": "± 38723",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8984921,
            "range": "± 39882",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4912592,
            "range": "± 41995",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 6885915,
            "range": "± 82146",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 8256822,
            "range": "± 58529",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8131697,
            "range": "± 42118",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10540874,
            "range": "± 50232",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12068635,
            "range": "± 68915",
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
          "id": "83a0b681fc00fed2ca0244b2134f70df23171dbb",
          "message": "chore(deps): update bun non-major dependencies to v0.3.1 (#278)\n\n* chore(deps): update bun non-major dependencies to v0.3.1\n\n* fix bunlock\n\n---------\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>\nCo-authored-by: Felix Perron-Brault <fpbrault@gmail.com>",
          "timestamp": "2026-06-08T13:54:39Z",
          "tree_id": "d0e83a7ef1fc2e65c1b94aa33d7d712a22d2a244",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/83a0b681fc00fed2ca0244b2134f70df23171dbb"
        },
        "date": 1780927434205,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4346138,
            "range": "± 24193",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5986298,
            "range": "± 101297",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7170186,
            "range": "± 46800",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3423800,
            "range": "± 25241",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3426610,
            "range": "± 43463",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3416561,
            "range": "± 13623",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9396694,
            "range": "± 58803",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12058641,
            "range": "± 33229",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13890251,
            "range": "± 39958",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11307634,
            "range": "± 28608",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15875965,
            "range": "± 44701",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18691168,
            "range": "± 339978",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7489314,
            "range": "± 55099",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9599262,
            "range": "± 61271",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10889883,
            "range": "± 59260",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5355647,
            "range": "± 24606",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6938568,
            "range": "± 32488",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8080100,
            "range": "± 64359",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9912917,
            "range": "± 56384",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13073025,
            "range": "± 158038",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14403734,
            "range": "± 57799",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7294553,
            "range": "± 110921",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9793343,
            "range": "± 38270",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11474373,
            "range": "± 42882",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5027320,
            "range": "± 49146",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7332958,
            "range": "± 32992",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8860854,
            "range": "± 41349",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4868940,
            "range": "± 15102",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 6848028,
            "range": "± 69735",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 8229056,
            "range": "± 61509",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8038884,
            "range": "± 34719",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10518308,
            "range": "± 45873",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12019607,
            "range": "± 31554",
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
          "id": "520317bb969a25ccf79e3bea70c0b5b3125042b7",
          "message": "feat: enhance preset management with bank support (#273)\n\n* feat(fx): implement save, list, and delete functionality for FX module presets\n\n* feat: enhance preset management with bank support\n\n- Added bank metadata to preset entries, including bankId and bankName.\n- Implemented functionality to import preset banks through the native plugin bridge.\n- Updated the preset library to filter and display presets by bank.\n- Enhanced tests to cover new bank-related features and ensure correct mapping of bank metadata.\n- Modified various components and hooks to accommodate the new bank filtering and display logic.\n\n* feat: refactor preset filtering to use radio buttons and checkboxes; enhance filter options management\n\n* lint fix\n\n* feat: update references from \"Cosmo Library\" to \"Cosmo Factory Library\"",
          "timestamp": "2026-06-08T14:54:31Z",
          "tree_id": "5628b4fa1c3912f13cddb1366c3e369ff131cda9",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/520317bb969a25ccf79e3bea70c0b5b3125042b7"
        },
        "date": 1780931022255,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4344009,
            "range": "± 51926",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5954173,
            "range": "± 71296",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7175474,
            "range": "± 265694",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3395195,
            "range": "± 9349",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3398610,
            "range": "± 15260",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3409932,
            "range": "± 9568",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9393921,
            "range": "± 46558",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12088142,
            "range": "± 161136",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13916758,
            "range": "± 92472",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11327137,
            "range": "± 32460",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15966756,
            "range": "± 50387",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18653967,
            "range": "± 70373",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7512955,
            "range": "± 56139",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9632294,
            "range": "± 150539",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10906195,
            "range": "± 61775",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5362068,
            "range": "± 33912",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6971348,
            "range": "± 81100",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8222510,
            "range": "± 85647",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9923667,
            "range": "± 107673",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13105584,
            "range": "± 152549",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14377573,
            "range": "± 167683",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7331237,
            "range": "± 45816",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9810716,
            "range": "± 156378",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11549264,
            "range": "± 48666",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5036089,
            "range": "± 23476",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7350610,
            "range": "± 97199",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8894335,
            "range": "± 49577",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4876197,
            "range": "± 33838",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 6834293,
            "range": "± 29455",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 8204141,
            "range": "± 42146",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8087265,
            "range": "± 53544",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10504916,
            "range": "± 59437",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12065966,
            "range": "± 55100",
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
          "id": "b1b2b353e5984ea30fafbdd338ea4d155e74e4fe",
          "message": "fix(deps): update cargo non-major dependencies (#258)\n\n* fix(deps): update cargo non-major dependencies\n\n* fix(deps): update bitflags to version 2.13.0 and other dependencies\n\n* build: replace vendored truce crates with fpbrault/truce fork\n\nAll truce-* dependencies now resolve from https://github.com/fpbrault/truce.git\nvia subdir workspace deps. The vendor/ directory is removed.\n\nFork carries cosmo-specific patches:\n- IMidiMapping COM support in truce-vst3\n- CLAP_NOTE_DIALECT_MIDI in truce-clap\n- dispatch_async fix in truce-au\n\n---------\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>\nCo-authored-by: Felix Perron-Brault <fpbrault@gmail.com>",
          "timestamp": "2026-06-08T11:08:07-04:00",
          "tree_id": "f2907f80f873f20d7f2c6efffc8043b48abac3f2",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/b1b2b353e5984ea30fafbdd338ea4d155e74e4fe"
        },
        "date": 1780931837793,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4337368,
            "range": "± 119688",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5987760,
            "range": "± 76755",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7145451,
            "range": "± 98947",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3408687,
            "range": "± 15612",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3407449,
            "range": "± 36661",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3408925,
            "range": "± 11799",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9422618,
            "range": "± 31036",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12104094,
            "range": "± 64257",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13923559,
            "range": "± 50105",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11356721,
            "range": "± 126889",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16023608,
            "range": "± 56642",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18783066,
            "range": "± 203072",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7532359,
            "range": "± 47827",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9704004,
            "range": "± 33814",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11038767,
            "range": "± 231204",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5412179,
            "range": "± 39822",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7014119,
            "range": "± 70586",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8164990,
            "range": "± 86095",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9921547,
            "range": "± 66058",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12990144,
            "range": "± 40929",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14341162,
            "range": "± 292496",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7290468,
            "range": "± 31827",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9799688,
            "range": "± 151544",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11487490,
            "range": "± 51279",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5022306,
            "range": "± 57288",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7332025,
            "range": "± 114374",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8874018,
            "range": "± 80492",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4870603,
            "range": "± 141859",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 6865240,
            "range": "± 43588",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 8290871,
            "range": "± 89036",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8141455,
            "range": "± 43144",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10605979,
            "range": "± 142428",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12168227,
            "range": "± 33718",
            "unit": "ns/iter"
          }
        ]
      }
    ]
  }
}