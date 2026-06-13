window.BENCHMARK_DATA = {
  "lastUpdate": 1781385042954,
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
          "id": "3df52c6a98fe9b4c8f9abe977a41f1667ae2c101",
          "message": "feat: add preset descriptions (#293)\n\n* add preset descriptions\n\n* add one description",
          "timestamp": "2026-06-11T17:07:04-04:00",
          "tree_id": "b75e648e7897bf702e85b166658dbf680d2b953b",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/3df52c6a98fe9b4c8f9abe977a41f1667ae2c101"
        },
        "date": 1781212579318,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4230521,
            "range": "± 90225",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6126561,
            "range": "± 49246",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7406253,
            "range": "± 29862",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3297726,
            "range": "± 16181",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3321203,
            "range": "± 12862",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3335441,
            "range": "± 15787",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10335687,
            "range": "± 60581",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13549179,
            "range": "± 51373",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15715810,
            "range": "± 34178",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12413323,
            "range": "± 96676",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17211552,
            "range": "± 34246",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19572233,
            "range": "± 79258",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8347527,
            "range": "± 36153",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10903182,
            "range": "± 22252",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12338473,
            "range": "± 48503",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5378995,
            "range": "± 40450",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7268851,
            "range": "± 98181",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8535545,
            "range": "± 65252",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10810602,
            "range": "± 26778",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14411176,
            "range": "± 53717",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15741990,
            "range": "± 227396",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8412853,
            "range": "± 43149",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11427582,
            "range": "± 34399",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13363400,
            "range": "± 43867",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5253387,
            "range": "± 24610",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7903427,
            "range": "± 33359",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9703131,
            "range": "± 23840",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5252027,
            "range": "± 32623",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8010945,
            "range": "± 56520",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9862447,
            "range": "± 39023",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8992786,
            "range": "± 25136",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12024322,
            "range": "± 18478",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13819538,
            "range": "± 59148",
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
          "id": "00958416a2d71d035620610e751647e6e267053e",
          "message": "feat: make main panel full width (#294)\n\nmake main panel full width",
          "timestamp": "2026-06-11T22:07:06-04:00",
          "tree_id": "eccac83a788274dd6410a53b41ca6219f26d968f",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/00958416a2d71d035620610e751647e6e267053e"
        },
        "date": 1781230573277,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4478868,
            "range": "± 49717",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6186982,
            "range": "± 70852",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7402328,
            "range": "± 460143",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3572023,
            "range": "± 55711",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3558559,
            "range": "± 53810",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3581858,
            "range": "± 31600",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10350784,
            "range": "± 140088",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12955379,
            "range": "± 127179",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14798245,
            "range": "± 44767",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12644195,
            "range": "± 27113",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17200881,
            "range": "± 643917",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19496153,
            "range": "± 261240",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8367057,
            "range": "± 71714",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10518338,
            "range": "± 364774",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11848581,
            "range": "± 228586",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5522933,
            "range": "± 61346",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7268197,
            "range": "± 95230",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8449008,
            "range": "± 108842",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10964076,
            "range": "± 78322",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14088903,
            "range": "± 72626",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15321855,
            "range": "± 68182",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8229945,
            "range": "± 85774",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10772274,
            "range": "± 59790",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12430432,
            "range": "± 46793",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5179922,
            "range": "± 125101",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7464637,
            "range": "± 48267",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8965967,
            "range": "± 25942",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5345149,
            "range": "± 26624",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7847538,
            "range": "± 179752",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9634272,
            "range": "± 45202",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8965986,
            "range": "± 207105",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11577668,
            "range": "± 52150",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13298923,
            "range": "± 55471",
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
          "id": "268d4423f7cc2cacf28d864c160aeb673083e076",
          "message": "fix scrollbars for plugin banks/authors",
          "timestamp": "2026-06-12T11:21:50-04:00",
          "tree_id": "08e4370750e56877fe78d1d88bb8610e2fb09e3c",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/268d4423f7cc2cacf28d864c160aeb673083e076"
        },
        "date": 1781278269203,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4268494,
            "range": "± 138888",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6189918,
            "range": "± 96775",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7464244,
            "range": "± 57147",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3335092,
            "range": "± 199334",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3350564,
            "range": "± 15819",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3352700,
            "range": "± 26072",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10697838,
            "range": "± 150031",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 14007902,
            "range": "± 72457",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 16176903,
            "range": "± 195836",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12697699,
            "range": "± 62391",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17513491,
            "range": "± 256375",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 20010157,
            "range": "± 419509",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8430054,
            "range": "± 33048",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 11028806,
            "range": "± 153253",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12489665,
            "range": "± 112546",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5441688,
            "range": "± 42034",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7358282,
            "range": "± 54619",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8550915,
            "range": "± 84431",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10883931,
            "range": "± 55017",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14508243,
            "range": "± 53588",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15951896,
            "range": "± 162062",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8490742,
            "range": "± 43872",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11538576,
            "range": "± 66661",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13521276,
            "range": "± 159998",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5296939,
            "range": "± 40646",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7957458,
            "range": "± 53870",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9738409,
            "range": "± 54876",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5296054,
            "range": "± 43097",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8070290,
            "range": "± 69429",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10026284,
            "range": "± 116021",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9267781,
            "range": "± 54911",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12310381,
            "range": "± 51214",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 14077834,
            "range": "± 60902",
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
          "id": "b4399d76a9df30788a8303c717e0980ad45ad0a4",
          "message": "feat: handle db errors better (#295)\n\n* make main panel full width\n\n* fix(presets): recover from library database failures\n\n* fix preset library rebuild",
          "timestamp": "2026-06-12T15:38:21Z",
          "tree_id": "33b13e660bb2f1c21a252a5fec8e4d32d662797d",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/b4399d76a9df30788a8303c717e0980ad45ad0a4"
        },
        "date": 1781279243653,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4332608,
            "range": "± 105562",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6124597,
            "range": "± 94357",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7405219,
            "range": "± 40010",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3311058,
            "range": "± 10028",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3324778,
            "range": "± 20617",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3338765,
            "range": "± 10063",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10444039,
            "range": "± 27924",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13692782,
            "range": "± 44813",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15821464,
            "range": "± 47928",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12510030,
            "range": "± 39747",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17321614,
            "range": "± 37946",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19665588,
            "range": "± 34480",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8376734,
            "range": "± 48909",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10902234,
            "range": "± 26723",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12364372,
            "range": "± 29360",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5392145,
            "range": "± 21415",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7300845,
            "range": "± 108401",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8525651,
            "range": "± 39517",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10882859,
            "range": "± 132766",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14427047,
            "range": "± 45238",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15757479,
            "range": "± 54924",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8399448,
            "range": "± 23679",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11400114,
            "range": "± 60530",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13375903,
            "range": "± 33245",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5280030,
            "range": "± 16717",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7939797,
            "range": "± 18085",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9680123,
            "range": "± 17438",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5256199,
            "range": "± 20006",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8012040,
            "range": "± 23556",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9896375,
            "range": "± 31150",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8992018,
            "range": "± 20002",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12045122,
            "range": "± 32389",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13813847,
            "range": "± 71739",
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
          "id": "4744afcedad1a48a72d5fb4279b4117f0fecbbe4",
          "message": "fix: create unique preset when using save as (#296)\n\n* make main panel full width\n\n* fix(presets): recover from library database failures\n\n* fix preset library rebuild\n\n* fix test\n\n* fix: improve save as feature",
          "timestamp": "2026-06-12T16:05:38Z",
          "tree_id": "27604cbf647ecbe3c5005dcec08934032a00ee35",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/4744afcedad1a48a72d5fb4279b4117f0fecbbe4"
        },
        "date": 1781280886588,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4445918,
            "range": "± 31533",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6135610,
            "range": "± 94614",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7335610,
            "range": "± 301441",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3543051,
            "range": "± 9680",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3576311,
            "range": "± 641581",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3605470,
            "range": "± 36384",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10370133,
            "range": "± 59067",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13043217,
            "range": "± 379081",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14823626,
            "range": "± 78108",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12705312,
            "range": "± 65835",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17285422,
            "range": "± 96379",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19502560,
            "range": "± 59197",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8329400,
            "range": "± 41337",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10503591,
            "range": "± 55576",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11790540,
            "range": "± 77630",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5524160,
            "range": "± 57276",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7242777,
            "range": "± 61158",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8354352,
            "range": "± 47455",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10932998,
            "range": "± 71378",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14067331,
            "range": "± 68410",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15368001,
            "range": "± 207565",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8218894,
            "range": "± 47716",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10762766,
            "range": "± 60929",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12432543,
            "range": "± 30344",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5173698,
            "range": "± 23251",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7444477,
            "range": "± 20703",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9005602,
            "range": "± 105126",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5347111,
            "range": "± 18241",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7842253,
            "range": "± 47577",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9615282,
            "range": "± 41438",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8989413,
            "range": "± 36669",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11561915,
            "range": "± 22093",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13282405,
            "range": "± 21084",
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
          "id": "0042282478750658aa1ceecbce204cd23259afb3",
          "message": "pin tsdown",
          "timestamp": "2026-06-12T12:08:11-04:00",
          "tree_id": "3f128446d3689376a0c6dfeb92c13eeea36963cd",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/0042282478750658aa1ceecbce204cd23259afb3"
        },
        "date": 1781281037231,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4552698,
            "range": "± 138982",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6184165,
            "range": "± 47440",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7417467,
            "range": "± 74469",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3560936,
            "range": "± 61207",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3569145,
            "range": "± 31967",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3570907,
            "range": "± 20739",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10334566,
            "range": "± 67758",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13041427,
            "range": "± 114646",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14872556,
            "range": "± 208865",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12791386,
            "range": "± 41742",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17458445,
            "range": "± 116138",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19665700,
            "range": "± 83005",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8397459,
            "range": "± 63685",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10563320,
            "range": "± 130038",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11845978,
            "range": "± 54134",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5651151,
            "range": "± 90752",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7265109,
            "range": "± 56247",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8454074,
            "range": "± 86206",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10997874,
            "range": "± 45306",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14092306,
            "range": "± 202897",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15385682,
            "range": "± 63267",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8252112,
            "range": "± 29340",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10749425,
            "range": "± 48009",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12460674,
            "range": "± 160314",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5177865,
            "range": "± 24928",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7507811,
            "range": "± 51814",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9062877,
            "range": "± 41216",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5490717,
            "range": "± 62486",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8011801,
            "range": "± 89997",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9829556,
            "range": "± 131814",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9044983,
            "range": "± 59243",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11623374,
            "range": "± 54528",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13357527,
            "range": "± 147835",
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
          "id": "e756c45debeafcf5a27e549d0dc820df321acb2a",
          "message": "fix: capture keyboard input on text fields instead of leaking to DAW (#297)\n\n* fix: capture keyboard input on text fields instead of leaking to DAW\n\n- Add SynthTextInput shared component (controls/SynthTextInput.tsx)\n  calls stopPropagation on React onKeyDown to prevent DAW leak\n- Replace raw inputs/textareas in PresetLibrarySidebar (rename, author,\n  description), PresetLibraryDialogs (save-as), PresetLibraryHeader\n  (search), MacroLabelEditorPopover (4x macro labels)\n- Add capture-phase keydown guard in plugin App.tsx for defense-in-depth\n- SynthTextInput handles multiline (Cmd+Enter to commit) and single-line\n  (Enter to commit, Escape to cancel)\n\n* fix test",
          "timestamp": "2026-06-12T14:19:53-04:00",
          "tree_id": "7a82c27e44a76078d7d9495da933f181e6cae7a0",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/e756c45debeafcf5a27e549d0dc820df321acb2a"
        },
        "date": 1781288928326,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4430470,
            "range": "± 46301",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6160932,
            "range": "± 94512",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7326808,
            "range": "± 127110",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3536645,
            "range": "± 18274",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3539361,
            "range": "± 20179",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3542946,
            "range": "± 61409",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10266060,
            "range": "± 42064",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12936819,
            "range": "± 27310",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14801629,
            "range": "± 244807",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12630265,
            "range": "± 22981",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17194201,
            "range": "± 85964",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19456239,
            "range": "± 111302",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8314813,
            "range": "± 76815",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10510727,
            "range": "± 127715",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11786541,
            "range": "± 163912",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5506801,
            "range": "± 85043",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7179919,
            "range": "± 151742",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8379318,
            "range": "± 227590",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10882069,
            "range": "± 55984",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13991358,
            "range": "± 111935",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15271232,
            "range": "± 52872",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8219701,
            "range": "± 69765",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10702984,
            "range": "± 31791",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12405385,
            "range": "± 194591",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5166172,
            "range": "± 15859",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7476607,
            "range": "± 31558",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9040549,
            "range": "± 155064",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5326250,
            "range": "± 41376",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7835155,
            "range": "± 84867",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9629419,
            "range": "± 60119",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8987038,
            "range": "± 23206",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11580429,
            "range": "± 203008",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13293206,
            "range": "± 182847",
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
          "id": "0a640cacc108a849a01cc9e3f3e7103817327582",
          "message": "feat: make livepage fullscreen",
          "timestamp": "2026-06-12T14:21:25-04:00",
          "tree_id": "e8a959f7fd5b7d2251723da02c14fe0c2c72f4d4",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/0a640cacc108a849a01cc9e3f3e7103817327582"
        },
        "date": 1781289261939,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4246946,
            "range": "± 58331",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6137304,
            "range": "± 105187",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7419503,
            "range": "± 26603",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3304458,
            "range": "± 8899",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3326135,
            "range": "± 19004",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3338146,
            "range": "± 56594",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10314592,
            "range": "± 43801",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13509426,
            "range": "± 44029",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15675839,
            "range": "± 387972",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12432745,
            "range": "± 42672",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17316283,
            "range": "± 53944",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19662224,
            "range": "± 40684",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8374434,
            "range": "± 123535",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10930535,
            "range": "± 180297",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12388328,
            "range": "± 50184",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5416156,
            "range": "± 40813",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7276316,
            "range": "± 60333",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8535982,
            "range": "± 235324",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10839623,
            "range": "± 38510",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14380439,
            "range": "± 58770",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15733110,
            "range": "± 29294",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8404154,
            "range": "± 36013",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11360762,
            "range": "± 35379",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13390668,
            "range": "± 54321",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5240691,
            "range": "± 24854",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7909244,
            "range": "± 70671",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9715728,
            "range": "± 42716",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5275341,
            "range": "± 20004",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8016876,
            "range": "± 36846",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9875208,
            "range": "± 127303",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8988539,
            "range": "± 30013",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12048708,
            "range": "± 64548",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13836265,
            "range": "± 60294",
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
          "id": "8dc403a5973744c2d8b42452f8d1e0677eaf01c1",
          "message": "unskip e2e tests",
          "timestamp": "2026-06-12T14:42:56-04:00",
          "tree_id": "1f7e55ebf805a24899cd034ae35862377fa1fdef",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/8dc403a5973744c2d8b42452f8d1e0677eaf01c1"
        },
        "date": 1781290318782,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4237803,
            "range": "± 25778",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6143828,
            "range": "± 78404",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7422365,
            "range": "± 40560",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3310219,
            "range": "± 19462",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3336019,
            "range": "± 25524",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3335415,
            "range": "± 12708",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10301194,
            "range": "± 47833",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13550962,
            "range": "± 48922",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15810443,
            "range": "± 55391",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12556698,
            "range": "± 230783",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17411757,
            "range": "± 127865",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19852888,
            "range": "± 108012",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8388798,
            "range": "± 36432",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10906700,
            "range": "± 53525",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12364181,
            "range": "± 217156",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5378678,
            "range": "± 36429",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7290328,
            "range": "± 49234",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8515071,
            "range": "± 67271",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10829310,
            "range": "± 44614",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14368590,
            "range": "± 48346",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15727252,
            "range": "± 47179",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8403059,
            "range": "± 57754",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11378520,
            "range": "± 96764",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13362672,
            "range": "± 46854",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5243197,
            "range": "± 17537",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7896847,
            "range": "± 54001",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9664740,
            "range": "± 39115",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5272759,
            "range": "± 52279",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8027260,
            "range": "± 66824",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9922668,
            "range": "± 44021",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8985350,
            "range": "± 29151",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12013781,
            "range": "± 38510",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13829828,
            "range": "± 53125",
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
          "id": "920130363eba6beaf889c70582c831ca3f1c54a5",
          "message": "refactor: split plugin in multiple files (#298)",
          "timestamp": "2026-06-12T16:53:14-04:00",
          "tree_id": "ff83ebf2888496bc175faa8d1c4fad442c58047f",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/920130363eba6beaf889c70582c831ca3f1c54a5"
        },
        "date": 1781298158168,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3464287,
            "range": "± 24207",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4766564,
            "range": "± 28859",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5685459,
            "range": "± 30281",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2777667,
            "range": "± 12143",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2781103,
            "range": "± 13158",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2785545,
            "range": "± 11841",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8192460,
            "range": "± 20396",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10340294,
            "range": "± 24698",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 11818815,
            "range": "± 27750",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 10061033,
            "range": "± 23866",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 13658516,
            "range": "± 38425",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 15404002,
            "range": "± 246289",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6515856,
            "range": "± 44123",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8170515,
            "range": "± 29632",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9173064,
            "range": "± 51022",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4344502,
            "range": "± 29622",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5642387,
            "range": "± 23870",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6517063,
            "range": "± 35849",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8496337,
            "range": "± 20770",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 10884949,
            "range": "± 19487",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 11896268,
            "range": "± 102480",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6435499,
            "range": "± 20493",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8339147,
            "range": "± 13651",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 8697369,
            "range": "± 13047",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3111661,
            "range": "± 56982",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 4879361,
            "range": "± 29664",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6059733,
            "range": "± 32539",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3242477,
            "range": "± 25662",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5174946,
            "range": "± 25133",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6545431,
            "range": "± 35459",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 6130339,
            "range": "± 16640",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 8119424,
            "range": "± 34926",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 9403700,
            "range": "± 18237",
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
          "id": "e03f74ffdbac38a5de8c062eefd03dffea6b8a6a",
          "message": "feat: add shared Rust-generated types for plugin IPC (#299)\n\n* chore: add cosmo-pd101 bridge types crate\n\n* feat(bridge): move all shared DTOs into cosmo-pd101-bridge-types crate\n\n- Add EditorState, MidiLearnBinding, MidiLearnState, ScopeDataResponse,\n  TransportInfoResponse, PresetLibraryEntry, FxModulePresetEntry,\n  PresetBankBundle, PresetBankMetadata, PresetBankEntry DTOs\n- Plugin crate re-exports from bridge-types via session_state.rs,\n  preset_library.rs, runtime_state.rs\n- Fix BigInt types (u64→u32, i64→f64) for specta-typescript compat\n- Exclude preset types with serde_json::Value from specta export\n- Regenerate plugin-bridge.ts with 13 typed exports + PluginIpcMethods\n\n* feat(bridge): add typed IPC variants for editor, midi learn, scope, transport\n\n- Add GetEditorState/SetEditorState, GetMidiLearnState, GetScopeData,\n  GetTransportInfo, GetPresetSession variants to PluginIpcRequest\n- Update PluginIpcMethods contract with typed request/response pairs\n- Regenerate plugin-bridge.ts — 9 typed IPC variants, 9 methods\n- 845 JS + 194 Rust tests pass\n\n* feat(bridge): wire typed IPC through TS bridge\n\nExport bridge types from @cosmo/cosmo-pd101, replace local type aliases\nin IPCBridge.ts and auv3Bridge.ts with proper imports. __czSetEditorState\nnow takes EditorState directly (no JSON parse roundtrip). useSessionStateSync\nuses EditorState type instead of unknown casts.\n\n* feat(bridge): migrate Rust IPC dispatch to typed PluginIpcRequest enum\n\nReplace string-matching dispatch with typed enum matching via\nfrom_legacy() converter. Rewrite all 5 IPC sub-handlers to match\non enum variants. Update IPC coverage test to scan bridge-types\nipc.rs and handle pipe-separated method patterns.\n\n* feat(plugin-ipc-bridge-types): Phase 4 — typed invoke wrappers, consolidated Window types\n\n- Create ipcTypes.ts with shared IpcRpcResponse, PresetSession, Window interface, createTypedInvoke factory\n- Refactor IPCBridge.ts: replace raw invokeRust with typed invoke() constrained by PluginIpcMethods\n- Refactor auv3Bridge.ts: use typed invoke() for router calls, keep invokeAuv3 for subscription/timeout-sensitive calls\n- Remove AUv3-specific Window decls from shared ipcTypes.ts (hosted in auv3Bridge.ts only)\n- Drop redundant Rust coverage section from ipcCoverage.test.ts (compiler-enforced now)\n- Update ipcCoverage.test.ts regex to scan both invokeAuv3() and invoke()\n- Remove dead PluginIpcRequest export from index.ts (no longer in specta output)\n- Fix from_legacy() for addMidiBinding to accept both object and positional formats\n- Fix from_legacy() for loadPreset/loadPresetData — replace or_else chain with match\n\n* feat(plugin-ipc-bridge-types): Phase 5 — build integration, multi-crate specta export, stale binding check\n\n- Extend gen-bindings.mjs to run both synth-engine and bridge-types export binaries\n- Extend spectaBindingsDevPlugin to watch and export both synth and bridge crates\n- Add --check flag to gen-bindings.mjs for stale binding detection (fails if generated files differ from committed state)\n- Add check:bindings script to package.json\n- Update CI build-wasm.yml: generate both binding sets, add stale check step, trigger on bridge-types changes\n- Update CI cache key to include Rust sources affecting binding generation\n- Regenerate plugin-bridge.ts (loadPresetData was missing from committed output)\n\n* fix(bridge-types): addMidiBinding accepts object format, safe loadPreset arg access\n\n- from_legacy() addMidiBinding now accepts both positional [key, ch, cc]\n  and object {paramKey, channel, cc} wire formats (Issue #6)\n- loadPreset/loadPresetData use args.first() instead of args[0] to\n  avoid panic on empty args (Issue #7)\n- Added get_i32() helper for object-based i32 extraction\n- Added test for addMidiBinding object format\n\n* refactor(bridge-types): add Specta derives + typed payload DTOs (#5, #10, #11)\n\n- Replace serde_json::Value IPC variants with typed payload structs:\n  SetParams→SynthParams, AddPreset→AddPresetPayload,\n  SavePreset→SavePresetPayload, ImportPresetBank→PresetBankBundle,\n  SaveFxModulePreset→SaveFxModulePresetPayload\n- Add Specta derives to PresetLibraryEntry, FxModulePresetEntry,\n  PresetBankBundle, PresetBankEntry\n- Register AddPresetPayload + PresetBankMetadata in export binary\n- Hand-author TS types with serde_json::Value fields (Specta can't\n  export BigInt inside Value)\n- Update PluginIpcMethods: replace unknown with concrete DTO names\n- Deserialize typed payloads in from_legacy() instead of passing raw\n  serde_json::Value\n- Remove manual JSON field extraction in plugin handlers — use\n  payload struct fields directly\n\n* refactor(ipc): typed invoke + payload envelope migration (#1, #2, #8, #9, #12)\n\n- ipcTypes.ts: createTypedInvoke accepts payload? instead of ...args;\n  Window interface uses PluginIpcMethods[K][\"response/request\"]\n- IPCBridge.ts: invokeRust(payload?), sends {id,method,payload};\n  SynthParams import; addMidiBinding sends object format\n- auv3Bridge.ts: invokeAuv3(payload?, timeout?); adapter + direct calls\n- gui.rs: try PluginIpcEnvelope deser first, fall back to legacy args\n- ipc/mod.rs: add invoke_envelope(&PluginIpcEnvelope)\n\n* test(bridge-types): add envelope error-path tests (#14)\n\n* review fixes\n\n* review fixes\n\n* more fixes\n\n* update auv3",
          "timestamp": "2026-06-12T21:11:16-04:00",
          "tree_id": "4060a207f0e5a0da0db6d1a3215a421de2a23947",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/e03f74ffdbac38a5de8c062eefd03dffea6b8a6a"
        },
        "date": 1781313614918,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4232291,
            "range": "± 24885",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6128463,
            "range": "± 67419",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7406414,
            "range": "± 56067",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3318485,
            "range": "± 19206",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3325723,
            "range": "± 13836",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3348567,
            "range": "± 11947",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10286079,
            "range": "± 38809",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13495190,
            "range": "± 74333",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15651902,
            "range": "± 37949",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12428584,
            "range": "± 43662",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17291354,
            "range": "± 378362",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19622935,
            "range": "± 82518",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8329194,
            "range": "± 28733",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10866925,
            "range": "± 33126",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12326551,
            "range": "± 23012",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5393875,
            "range": "± 21299",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7251486,
            "range": "± 33770",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8523726,
            "range": "± 157796",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10819565,
            "range": "± 30401",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14336106,
            "range": "± 560658",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15697275,
            "range": "± 39729",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8404928,
            "range": "± 96159",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11381673,
            "range": "± 35000",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13370254,
            "range": "± 28447",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5240549,
            "range": "± 23864",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7877146,
            "range": "± 22380",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9655182,
            "range": "± 22826",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5264284,
            "range": "± 19341",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8003591,
            "range": "± 31235",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9839237,
            "range": "± 18444",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8989316,
            "range": "± 198510",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11991601,
            "range": "± 25160",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13800397,
            "range": "± 52147",
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
          "id": "77c7baea5c37804572057909a3c8756c8a3dcc7f",
          "message": "feat(engine): dynamic global polyphony — user-selectable voice limit 1-16 (#300)",
          "timestamp": "2026-06-13T09:05:36-04:00",
          "tree_id": "e59e15f9e2ef1bd2de0fb7106c5cd19ba92639f4",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/77c7baea5c37804572057909a3c8756c8a3dcc7f"
        },
        "date": 1781356478837,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4459464,
            "range": "± 20575",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6214512,
            "range": "± 29844",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7446147,
            "range": "± 68866",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3562943,
            "range": "± 35067",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3559446,
            "range": "± 12429",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3573002,
            "range": "± 29850",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10139486,
            "range": "± 186004",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12774159,
            "range": "± 248835",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14607777,
            "range": "± 43099",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12634999,
            "range": "± 272317",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17137467,
            "range": "± 163535",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19377006,
            "range": "± 40625",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8268211,
            "range": "± 35483",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10412041,
            "range": "± 81004",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11777058,
            "range": "± 53850",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5445075,
            "range": "± 33602",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7216381,
            "range": "± 21984",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8409937,
            "range": "± 173317",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10748418,
            "range": "± 39674",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13888745,
            "range": "± 233725",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15172027,
            "range": "± 212242",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8227607,
            "range": "± 19613",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10721037,
            "range": "± 145109",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12455003,
            "range": "± 251931",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5265081,
            "range": "± 25348",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7494901,
            "range": "± 148275",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9101152,
            "range": "± 161421",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5359779,
            "range": "± 95941",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7882933,
            "range": "± 98261",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9723369,
            "range": "± 22486",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8896030,
            "range": "± 21457",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11584621,
            "range": "± 31279",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13282540,
            "range": "± 22135",
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
          "id": "7491a5fa3b38778e68137c27758c1501c9028704",
          "message": "refactor: typed plugin bridge globals (#301)\n\n* feat(engine): dynamic global polyphony — phase 1, replace NUM_VOICES=8 with voice limit constants\n\n* feat(engine): limit poly voice allocation to active_voice_limit()\n\nfind_poly_voice_for_note_on_excluding() now searches only within\nactive_voice_limit() range for silent voices and theft candidates.\nTest poly_sustain_same_note_retrigger_steals_oldest_other_voice_when_full\nsets voice_limit to MAX_VOICES to exercise all 16 voices.\n\n* feat(engine): safe voice limit reduction and render loop scoping\n\nPhase 3:\n- set_voice_limit() keeps render_voice_limit expanded on reduction\n- update_render_voice_limit() scans voices above limit, shrinks\n  render limit once release tails finish\n- reset_audio_state() resets render_voice_limit = voice_limit\n- process_inner() calls update_render_voice_limit() each block\n\nPhase 4:\n- render_all_voices() loops use render_voice_limit() instead of\n  MAX_VOICES, only rendering voices within the active limit\n\n* feat(engine): add voiceLimit to RuntimeModSources telemetry\n\nAdds voice_limit: usize field to the runtime modulation sources\nstruct for UI telemetry, and syncs the TS type binding.\n\n* feat(engine): add setVoiceLimit WASM binding and worklet message\n\n* feat(ui): add globalSynthSettingsStore for voice limit persistence\n\n* feat(ui): add voice limit control to GlobalVoicePanel and wire to worklet\n\n* feat(engine): dynamic global polyphony — phases 9-11\n\nPhase 9: voice_limit in PluginGlobalSettings + serde + save/load tests\nPhase 10: voice_limit in AudioRuntime + set_voice_limit + plugin init\nPhase 11: IPC GetVoiceLimit/SetVoiceLimit routing, TS bridge methods,\nSwift AUv3 stubs, audio thread sync in render_audio_block\n\n* apply review fixes\n\n* use dropdown for voice count\n\n* minor fix\n\n* refactor window ipc\n\n* fix build",
          "timestamp": "2026-06-13T13:36:06Z",
          "tree_id": "c851148424f2be06a3d8274988eb9033f5a98299",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/7491a5fa3b38778e68137c27758c1501c9028704"
        },
        "date": 1781358302541,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4364540,
            "range": "± 198614",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6345608,
            "range": "± 98637",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7634268,
            "range": "± 74906",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3443454,
            "range": "± 36690",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3450017,
            "range": "± 31367",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3457743,
            "range": "± 25032",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10262645,
            "range": "± 38789",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13395714,
            "range": "± 60150",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15491107,
            "range": "± 103363",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12555492,
            "range": "± 147509",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17314037,
            "range": "± 139262",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19676804,
            "range": "± 211015",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8341988,
            "range": "± 64896",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10831902,
            "range": "± 68165",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12269952,
            "range": "± 194013",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5441841,
            "range": "± 62140",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7326856,
            "range": "± 45370",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8575097,
            "range": "± 103361",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10855208,
            "range": "± 66357",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14413095,
            "range": "± 87218",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15657126,
            "range": "± 67385",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8398340,
            "range": "± 58148",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11425577,
            "range": "± 136731",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13309853,
            "range": "± 139045",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5263324,
            "range": "± 56268",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7878323,
            "range": "± 55228",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9621188,
            "range": "± 53769",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5357370,
            "range": "± 84982",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8073330,
            "range": "± 71526",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9971441,
            "range": "± 60680",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9090866,
            "range": "± 108010",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12042764,
            "range": "± 109026",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13701290,
            "range": "± 76797",
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
          "id": "3d7c28519302db615390e67691cd84e1416d5b34",
          "message": "fix: improve auv3 perf (#302)\n\n* feat(engine): dynamic global polyphony — phase 1, replace NUM_VOICES=8 with voice limit constants\n\n* feat(engine): limit poly voice allocation to active_voice_limit()\n\nfind_poly_voice_for_note_on_excluding() now searches only within\nactive_voice_limit() range for silent voices and theft candidates.\nTest poly_sustain_same_note_retrigger_steals_oldest_other_voice_when_full\nsets voice_limit to MAX_VOICES to exercise all 16 voices.\n\n* feat(engine): safe voice limit reduction and render loop scoping\n\nPhase 3:\n- set_voice_limit() keeps render_voice_limit expanded on reduction\n- update_render_voice_limit() scans voices above limit, shrinks\n  render limit once release tails finish\n- reset_audio_state() resets render_voice_limit = voice_limit\n- process_inner() calls update_render_voice_limit() each block\n\nPhase 4:\n- render_all_voices() loops use render_voice_limit() instead of\n  MAX_VOICES, only rendering voices within the active limit\n\n* feat(engine): add voiceLimit to RuntimeModSources telemetry\n\nAdds voice_limit: usize field to the runtime modulation sources\nstruct for UI telemetry, and syncs the TS type binding.\n\n* feat(engine): add setVoiceLimit WASM binding and worklet message\n\n* feat(ui): add globalSynthSettingsStore for voice limit persistence\n\n* feat(ui): add voice limit control to GlobalVoicePanel and wire to worklet\n\n* feat(engine): dynamic global polyphony — phases 9-11\n\nPhase 9: voice_limit in PluginGlobalSettings + serde + save/load tests\nPhase 10: voice_limit in AudioRuntime + set_voice_limit + plugin init\nPhase 11: IPC GetVoiceLimit/SetVoiceLimit routing, TS bridge methods,\nSwift AUv3 stubs, audio thread sync in render_audio_block\n\n* apply review fixes\n\n* use dropdown for voice count\n\n* minor fix\n\n* refactor window ipc\n\n* fix auv3 perf\n\n* fix build\n\n* make ios scope same speed\n\n* lint\n\n* fix build",
          "timestamp": "2026-06-13T14:38:32Z",
          "tree_id": "9219406e303a818541c70f97411bd8762825cbf0",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/3d7c28519302db615390e67691cd84e1416d5b34"
        },
        "date": 1781362048063,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4450941,
            "range": "± 86711",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6235259,
            "range": "± 42716",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7447693,
            "range": "± 388237",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3555342,
            "range": "± 50428",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3556679,
            "range": "± 24369",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3563604,
            "range": "± 19301",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10133470,
            "range": "± 52455",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12727195,
            "range": "± 118694",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14562968,
            "range": "± 109209",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12606320,
            "range": "± 23545",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17105393,
            "range": "± 102993",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19364319,
            "range": "± 159686",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8262047,
            "range": "± 231459",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10433736,
            "range": "± 110908",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11794781,
            "range": "± 53197",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5430622,
            "range": "± 51364",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7193199,
            "range": "± 56786",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8408034,
            "range": "± 59170",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10729843,
            "range": "± 188294",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13885679,
            "range": "± 52619",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15184321,
            "range": "± 286698",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8228676,
            "range": "± 41025",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10723390,
            "range": "± 23706",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12466438,
            "range": "± 137413",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5260909,
            "range": "± 53078",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7493938,
            "range": "± 63356",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9128085,
            "range": "± 45547",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5368548,
            "range": "± 34354",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7896533,
            "range": "± 70545",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9767119,
            "range": "± 70402",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8920264,
            "range": "± 109094",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11627043,
            "range": "± 43199",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13323122,
            "range": "± 55618",
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
          "id": "b140fc0255aa38a064c9bb7807ef518ff231a38e",
          "message": "refactor: contract typed plugin window bridge (#303)\n\n* feat(engine): dynamic global polyphony — phase 1, replace NUM_VOICES=8 with voice limit constants\n\n* feat(engine): limit poly voice allocation to active_voice_limit()\n\nfind_poly_voice_for_note_on_excluding() now searches only within\nactive_voice_limit() range for silent voices and theft candidates.\nTest poly_sustain_same_note_retrigger_steals_oldest_other_voice_when_full\nsets voice_limit to MAX_VOICES to exercise all 16 voices.\n\n* feat(engine): safe voice limit reduction and render loop scoping\n\nPhase 3:\n- set_voice_limit() keeps render_voice_limit expanded on reduction\n- update_render_voice_limit() scans voices above limit, shrinks\n  render limit once release tails finish\n- reset_audio_state() resets render_voice_limit = voice_limit\n- process_inner() calls update_render_voice_limit() each block\n\nPhase 4:\n- render_all_voices() loops use render_voice_limit() instead of\n  MAX_VOICES, only rendering voices within the active limit\n\n* feat(engine): add voiceLimit to RuntimeModSources telemetry\n\nAdds voice_limit: usize field to the runtime modulation sources\nstruct for UI telemetry, and syncs the TS type binding.\n\n* feat(engine): add setVoiceLimit WASM binding and worklet message\n\n* feat(ui): add globalSynthSettingsStore for voice limit persistence\n\n* feat(ui): add voice limit control to GlobalVoicePanel and wire to worklet\n\n* feat(engine): dynamic global polyphony — phases 9-11\n\nPhase 9: voice_limit in PluginGlobalSettings + serde + save/load tests\nPhase 10: voice_limit in AudioRuntime + set_voice_limit + plugin init\nPhase 11: IPC GetVoiceLimit/SetVoiceLimit routing, TS bridge methods,\nSwift AUv3 stubs, audio thread sync in render_audio_block\n\n* apply review fixes\n\n* use dropdown for voice count\n\n* minor fix\n\n* refactor window ipc\n\n* fix auv3 perf\n\n* fix build\n\n* refactor bridge\n\n* lint\n\n* fix build",
          "timestamp": "2026-06-13T11:09:10-04:00",
          "tree_id": "d58de7a1eaa6a5ad62259c0ca2aceeb47f894863",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/b140fc0255aa38a064c9bb7807ef518ff231a38e"
        },
        "date": 1781363892922,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4345394,
            "range": "± 41933",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6305729,
            "range": "± 102575",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7571523,
            "range": "± 334294",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3432867,
            "range": "± 23370",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3448878,
            "range": "± 68730",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3446722,
            "range": "± 9290",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10377871,
            "range": "± 28424",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13484287,
            "range": "± 33465",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15549837,
            "range": "± 44296",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12624765,
            "range": "± 42964",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17400168,
            "range": "± 58373",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19822617,
            "range": "± 63287",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8339458,
            "range": "± 39319",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10857947,
            "range": "± 194470",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12302370,
            "range": "± 54692",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5859261,
            "range": "± 54091",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7787827,
            "range": "± 103347",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 9128085,
            "range": "± 79047",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11381441,
            "range": "± 69253",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14840101,
            "range": "± 92613",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 16180612,
            "range": "± 78309",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8838074,
            "range": "± 45279",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11305300,
            "range": "± 31526",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13265885,
            "range": "± 32668",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5271101,
            "range": "± 100688",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7851491,
            "range": "± 19985",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9605753,
            "range": "± 22356",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5330823,
            "range": "± 18870",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7022773,
            "range": "± 60934",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 8849716,
            "range": "± 37543",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8086880,
            "range": "± 77635",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10976694,
            "range": "± 46560",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12641799,
            "range": "± 195030",
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
          "id": "c815fab898fdbc49c6e86de0b0d3b286c6d93afc",
          "message": "fix: detune knob are always enabled when in detune modes",
          "timestamp": "2026-06-13T11:18:00-04:00",
          "tree_id": "cba391b505eb95f0808f03031b8bf953475e9ac3",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/c815fab898fdbc49c6e86de0b0d3b286c6d93afc"
        },
        "date": 1781364449958,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4478760,
            "range": "± 29930",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6250902,
            "range": "± 49935",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7498177,
            "range": "± 74748",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3586409,
            "range": "± 63359",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3590171,
            "range": "± 37813",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3598416,
            "range": "± 49524",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10240408,
            "range": "± 149243",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12859648,
            "range": "± 479264",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14707896,
            "range": "± 428089",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12742587,
            "range": "± 191797",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17302536,
            "range": "± 180066",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19512312,
            "range": "± 580957",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8347001,
            "range": "± 60445",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10537394,
            "range": "± 153964",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11973622,
            "range": "± 191141",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5454094,
            "range": "± 35727",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7242012,
            "range": "± 82479",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8473665,
            "range": "± 103824",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10827870,
            "range": "± 32984",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14006986,
            "range": "± 119913",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15279414,
            "range": "± 32582",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8253948,
            "range": "± 85360",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10829354,
            "range": "± 67658",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12580606,
            "range": "± 285730",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5288794,
            "range": "± 26870",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7539544,
            "range": "± 50209",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9108781,
            "range": "± 126755",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5358413,
            "range": "± 18287",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7850931,
            "range": "± 32371",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9737286,
            "range": "± 20008",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8895329,
            "range": "± 138001",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11580619,
            "range": "± 35078",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13322336,
            "range": "± 21244",
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
          "id": "78079d8233d52c2961a56fd41477762b60c311d0",
          "message": "fix flashing",
          "timestamp": "2026-06-13T12:06:00-04:00",
          "tree_id": "4c26da0c338e3277ba6e612ecb9365fc2e5aac3d",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/78079d8233d52c2961a56fd41477762b60c311d0"
        },
        "date": 1781367316870,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4343100,
            "range": "± 16263",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6259599,
            "range": "± 63769",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7578258,
            "range": "± 28464",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3436634,
            "range": "± 33378",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3451495,
            "range": "± 43360",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3459384,
            "range": "± 31662",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10565280,
            "range": "± 53625",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13660059,
            "range": "± 76287",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15674677,
            "range": "± 285112",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12706434,
            "range": "± 42973",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17513438,
            "range": "± 89228",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19917098,
            "range": "± 295580",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8397303,
            "range": "± 63299",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10925746,
            "range": "± 45952",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12311334,
            "range": "± 32845",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5448470,
            "range": "± 62603",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7318664,
            "range": "± 35022",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8575354,
            "range": "± 69261",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10905807,
            "range": "± 149744",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14378627,
            "range": "± 138097",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15689969,
            "range": "± 181269",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8425104,
            "range": "± 26261",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11371766,
            "range": "± 26782",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13316805,
            "range": "± 110301",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5289847,
            "range": "± 24956",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7890461,
            "range": "± 42627",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9631095,
            "range": "± 25302",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5306636,
            "range": "± 14227",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7977791,
            "range": "± 95885",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9872879,
            "range": "± 88238",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9089406,
            "range": "± 39875",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12077254,
            "range": "± 27834",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13726888,
            "range": "± 23329",
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
          "id": "c815fab898fdbc49c6e86de0b0d3b286c6d93afc",
          "message": "fix: detune knob are always enabled when in detune modes",
          "timestamp": "2026-06-13T11:18:00-04:00",
          "tree_id": "cba391b505eb95f0808f03031b8bf953475e9ac3",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/c815fab898fdbc49c6e86de0b0d3b286c6d93afc"
        },
        "date": 1781367341106,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4438620,
            "range": "± 175395",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6233536,
            "range": "± 52534",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7435991,
            "range": "± 46522",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3549846,
            "range": "± 14426",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3560868,
            "range": "± 20628",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3564154,
            "range": "± 10078",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10181683,
            "range": "± 116375",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12908115,
            "range": "± 173683",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14668216,
            "range": "± 92852",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12599702,
            "range": "± 71215",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17092659,
            "range": "± 50229",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19331430,
            "range": "± 331339",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8277802,
            "range": "± 142854",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10440275,
            "range": "± 27449",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11788898,
            "range": "± 164794",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5431416,
            "range": "± 138948",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7202028,
            "range": "± 20652",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8399829,
            "range": "± 99191",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10772730,
            "range": "± 423062",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13904442,
            "range": "± 42876",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15157248,
            "range": "± 31148",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8255013,
            "range": "± 54838",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10747163,
            "range": "± 155521",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12476454,
            "range": "± 47752",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5274407,
            "range": "± 50642",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7511827,
            "range": "± 27607",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9100030,
            "range": "± 22602",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5347776,
            "range": "± 19541",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7852056,
            "range": "± 13740",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9714803,
            "range": "± 41039",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8912960,
            "range": "± 32111",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11616736,
            "range": "± 38266",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13367671,
            "range": "± 296244",
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
          "id": "09a92f0fe31f81ea6bec2c3c5d33ed72593aa308",
          "message": "fix: prevent flashing auv3 restore (#305)\n\n* fix flashing\n\n* fix from review\n\n* refactor(auv3): consolidate telemetry sources into CosmoPd101AUv3Support\n\n- Rename Sources/CosmoPd101AUv3 -> CosmoPd101AUv3Support (public)\n- Rename tests/CosmoPd101AUv3Tests -> CosmoPd101AUv3SupportTests\n- Replace TelemetryController symlink with canonical public impl\n- Simplify: no timer factory, Timer(timeInterval:) not scheduledTimer\n- Add idempotent guards for startTimer/stopTimer\n- Add WeakScriptMessageHandler to break WKScriptMessageHandler retain cycle\n- Remove unused MidiParser + tests (dead code)\n- Delete duplicate Common/UI TelemetryController + WeakScriptMessageHandler\n- Update AudioUnitViewController import\n- Update README with Swift Source Layout docs\n- Add 5 repeated-lifecycle idempotency tests (27 total, all pass)\n\n* linting",
          "timestamp": "2026-06-13T16:57:28Z",
          "tree_id": "f119a57f66a810ae73eab4c27d92c240702fdf9d",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/09a92f0fe31f81ea6bec2c3c5d33ed72593aa308"
        },
        "date": 1781370401574,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4451402,
            "range": "± 30683",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6335966,
            "range": "± 93370",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7696932,
            "range": "± 111483",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3746041,
            "range": "± 33794",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3710265,
            "range": "± 168923",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3720113,
            "range": "± 58449",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10342436,
            "range": "± 50633",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12965751,
            "range": "± 376165",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14805174,
            "range": "± 55538",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12800141,
            "range": "± 202843",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17334496,
            "range": "± 101158",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19582813,
            "range": "± 382392",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8380149,
            "range": "± 118803",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10539085,
            "range": "± 46789",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11952813,
            "range": "± 213112",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5585891,
            "range": "± 55940",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7332932,
            "range": "± 154109",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8518186,
            "range": "± 51621",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10963481,
            "range": "± 46998",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14077946,
            "range": "± 59509",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15362058,
            "range": "± 354759",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8319962,
            "range": "± 128025",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10906550,
            "range": "± 46180",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12540553,
            "range": "± 50300",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5261468,
            "range": "± 122244",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7511620,
            "range": "± 32633",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9121928,
            "range": "± 30460",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5359878,
            "range": "± 16847",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7880024,
            "range": "± 41161",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9763226,
            "range": "± 33094",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8944079,
            "range": "± 35961",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11647532,
            "range": "± 147641",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13399800,
            "range": "± 75134",
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
          "id": "50a26be022e534cea9466484363fc39a4769d3d6",
          "message": "fix(auv3): default to first factory preset on fresh startup (#304)\n\n* fix(auv3): default to first factory preset on fresh startup\n\nWhen the AUv3 audio unit starts with no restored state and no pending host-selected preset, allocateRenderResources now automatically selects and applies the first factory preset instead of falling back to 'Current State'.\n\nThe currentPresetSession(for:) method in AudioUnitViewController.swift already falls back to audioUnit.currentPreset, so setting selectedFactoryPreset and super.currentPreset in the audio unit is sufficient for native session reporting to return the correct preset id/name.\n\n* lint",
          "timestamp": "2026-06-13T21:01:48Z",
          "tree_id": "65a366f9c2029efc5ff9abe7153c56ba57d4b884",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/50a26be022e534cea9466484363fc39a4769d3d6"
        },
        "date": 1781385040598,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4446637,
            "range": "± 155009",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6225732,
            "range": "± 27760",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7471476,
            "range": "± 234551",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3698885,
            "range": "± 40263",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3703828,
            "range": "± 41836",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3719117,
            "range": "± 36042",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10156490,
            "range": "± 34493",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12748254,
            "range": "± 45646",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14588824,
            "range": "± 42519",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12609294,
            "range": "± 169100",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17100342,
            "range": "± 84143",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19332009,
            "range": "± 198633",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8264999,
            "range": "± 85535",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10428330,
            "range": "± 41612",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11806560,
            "range": "± 55300",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5431815,
            "range": "± 34002",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7191739,
            "range": "± 22603",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8415716,
            "range": "± 54156",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10764851,
            "range": "± 28407",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13920594,
            "range": "± 165955",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15183763,
            "range": "± 55463",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8254133,
            "range": "± 46570",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10747843,
            "range": "± 25604",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12502974,
            "range": "± 35845",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5318932,
            "range": "± 144516",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7513924,
            "range": "± 33444",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9126416,
            "range": "± 139046",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5390130,
            "range": "± 35663",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7844535,
            "range": "± 38848",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9753956,
            "range": "± 55058",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8913817,
            "range": "± 32811",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11622866,
            "range": "± 141756",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13338694,
            "range": "± 44182",
            "unit": "ns/iter"
          }
        ]
      }
    ]
  }
}