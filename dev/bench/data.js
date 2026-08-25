window.BENCHMARK_DATA = {
  "lastUpdate": 1787686726078,
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
          "id": "adde53507abc35cad42fbdf1491e011093e91356",
          "message": "fix: adjust algo blend on some presets",
          "timestamp": "2026-08-05T10:56:01-04:00",
          "tree_id": "4cf8141266daa2f8cfd4ed18ad3f9ad32067de11",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/adde53507abc35cad42fbdf1491e011093e91356"
        },
        "date": 1785942311096,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4316264,
            "range": "± 18227",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6194244,
            "range": "± 68004",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7561640,
            "range": "± 46367",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3404422,
            "range": "± 43873",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3413419,
            "range": "± 28514",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3424840,
            "range": "± 20865",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10357798,
            "range": "± 287480",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13466943,
            "range": "± 70594",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15703618,
            "range": "± 119193",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12592763,
            "range": "± 176062",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17364125,
            "range": "± 49133",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19853540,
            "range": "± 109506",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8390904,
            "range": "± 47546",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10788085,
            "range": "± 57821",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12313646,
            "range": "± 213101",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5451083,
            "range": "± 32403",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7379287,
            "range": "± 69005",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8670732,
            "range": "± 36364",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10830634,
            "range": "± 68213",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14367290,
            "range": "± 198646",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15693505,
            "range": "± 82095",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8408316,
            "range": "± 54490",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11382692,
            "range": "± 188948",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13309579,
            "range": "± 127666",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5286720,
            "range": "± 138540",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7891615,
            "range": "± 28810",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9600677,
            "range": "± 51968",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5314859,
            "range": "± 20794",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8008464,
            "range": "± 211622",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9992175,
            "range": "± 136574",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8999810,
            "range": "± 33267",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11996313,
            "range": "± 54410",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13762350,
            "range": "± 63376",
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
          "id": "1fb88b42f3c2cae3d12b85b26e4a3579226db3ff",
          "message": "feat(envelopes): add reusable envelope presets and copying (#350)\n\n* feat(envelopes): add presets and cross-target copying\n\n* adjust env presets\n\n* fix: enhance envelope patch parsing to handle null values and improve validation",
          "timestamp": "2026-08-08T14:14:27Z",
          "tree_id": "0e84c6a0a2f35f8dd37d2beddb68c5292c48f8db",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/1fb88b42f3c2cae3d12b85b26e4a3579226db3ff"
        },
        "date": 1786199026121,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4313685,
            "range": "± 29565",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6218358,
            "range": "± 51780",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7580280,
            "range": "± 81461",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3410589,
            "range": "± 30905",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3427671,
            "range": "± 28429",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3434392,
            "range": "± 36713",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10244596,
            "range": "± 116846",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13330999,
            "range": "± 169252",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15586139,
            "range": "± 135429",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12529041,
            "range": "± 69604",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17304852,
            "range": "± 75063",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19701803,
            "range": "± 343405",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8359180,
            "range": "± 48554",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10846910,
            "range": "± 192868",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12390861,
            "range": "± 134903",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5418880,
            "range": "± 23559",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7322997,
            "range": "± 26832",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8671862,
            "range": "± 46328",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10840213,
            "range": "± 60804",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14333754,
            "range": "± 51543",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15792671,
            "range": "± 280059",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8415129,
            "range": "± 97423",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11387507,
            "range": "± 59049",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13311723,
            "range": "± 118457",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5303918,
            "range": "± 18573",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7857888,
            "range": "± 49506",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9612967,
            "range": "± 114966",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5319154,
            "range": "± 132248",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7980023,
            "range": "± 124453",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10019337,
            "range": "± 102389",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9034967,
            "range": "± 24773",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11993244,
            "range": "± 56403",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13787773,
            "range": "± 93123",
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
          "id": "ab6fc9d3e7b4eebcc6827c0a6b9c106986018633",
          "message": "refactor(ui): share preset popover (#351)",
          "timestamp": "2026-08-09T10:14:44-04:00",
          "tree_id": "c8c3fcdb1d6eff20fb5088490097212214ae4cf9",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/ab6fc9d3e7b4eebcc6827c0a6b9c106986018633"
        },
        "date": 1786285424644,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4327223,
            "range": "± 58480",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6261484,
            "range": "± 145169",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7664593,
            "range": "± 86580",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3430160,
            "range": "± 21973",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3443902,
            "range": "± 56471",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3460250,
            "range": "± 32861",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10335308,
            "range": "± 54621",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13386077,
            "range": "± 54709",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 16023941,
            "range": "± 287905",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12656782,
            "range": "± 241943",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17428322,
            "range": "± 266638",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19959093,
            "range": "± 287458",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8376772,
            "range": "± 84683",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10809439,
            "range": "± 196352",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12479816,
            "range": "± 312340",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5473189,
            "range": "± 63238",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7390692,
            "range": "± 47182",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8755933,
            "range": "± 193792",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10903777,
            "range": "± 169051",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14451088,
            "range": "± 49701",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 16021121,
            "range": "± 365374",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8501858,
            "range": "± 63886",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11498415,
            "range": "± 50182",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13719018,
            "range": "± 137047",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5349429,
            "range": "± 104693",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7980780,
            "range": "± 64418",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9680931,
            "range": "± 171259",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5356235,
            "range": "± 25640",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8013748,
            "range": "± 56108",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10082333,
            "range": "± 48721",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9032918,
            "range": "± 26465",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12058671,
            "range": "± 112239",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 14020858,
            "range": "± 89441",
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
          "id": "c1402a90b981ba77f735f23a9ab522422e4cf462",
          "message": "fix(ui): improve bottom-bar tooltip coverage (#349)\n\n* fix(ui): improve bottom-bar tooltip coverage\n\n* fix(i18n): move tooltip copy into synth locale\n\n* fix(biome): add missing root property to configuration\n\n* fix(i18n): simplify preset library tooltip\n\n* lint fix\n\n* fix lint\n\n* cleanup\n\n* refactor(i18n): parameterize line tooltips\n\n* adjust tooltips\n\n* fix(i18n): resolve lfo waveform labels",
          "timestamp": "2026-08-09T11:03:52-04:00",
          "tree_id": "448af47cee77e7a8aa6072ca9a40344ad7d68b7b",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/c1402a90b981ba77f735f23a9ab522422e4cf462"
        },
        "date": 1786288381101,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4310318,
            "range": "± 134349",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6202031,
            "range": "± 80583",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7550654,
            "range": "± 49515",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3415346,
            "range": "± 14081",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3427295,
            "range": "± 14703",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3444667,
            "range": "± 15109",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10321334,
            "range": "± 264501",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13347558,
            "range": "± 44073",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15598778,
            "range": "± 113463",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12504321,
            "range": "± 94228",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17304662,
            "range": "± 63759",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19691715,
            "range": "± 81094",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8337953,
            "range": "± 30144",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10774660,
            "range": "± 31131",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12346869,
            "range": "± 69192",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5395193,
            "range": "± 41635",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7313384,
            "range": "± 49837",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8636836,
            "range": "± 51894",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10819749,
            "range": "± 26724",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14390011,
            "range": "± 98960",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15801371,
            "range": "± 78393",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8390231,
            "range": "± 31377",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11395106,
            "range": "± 45264",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13410683,
            "range": "± 114888",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5282166,
            "range": "± 23160",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7859300,
            "range": "± 25400",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9670335,
            "range": "± 57549",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5339556,
            "range": "± 19440",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8034386,
            "range": "± 41661",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10047335,
            "range": "± 47328",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9039663,
            "range": "± 30790",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11997789,
            "range": "± 47410",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13820265,
            "range": "± 349638",
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
          "id": "69da451ca490e1e478f7c4ffe7b1282ca254137e",
          "message": "feat(renovate): group Cargo digest updates into a single PR",
          "timestamp": "2026-08-10T09:05:09-04:00",
          "tree_id": "f2bdc8bd80130b17445490c0962561bcf12a509b",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/69da451ca490e1e478f7c4ffe7b1282ca254137e"
        },
        "date": 1786367660061,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4286533,
            "range": "± 27503",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6167175,
            "range": "± 71707",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7448204,
            "range": "± 30876",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3395934,
            "range": "± 16275",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3415916,
            "range": "± 46329",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3420900,
            "range": "± 14305",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10389955,
            "range": "± 79468",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13369272,
            "range": "± 91752",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15301044,
            "range": "± 38921",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12432882,
            "range": "± 72635",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17310374,
            "range": "± 93568",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19651322,
            "range": "± 113005",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8338416,
            "range": "± 58229",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10877085,
            "range": "± 91385",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12297098,
            "range": "± 104655",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5402982,
            "range": "± 22456",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7305269,
            "range": "± 70191",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8569151,
            "range": "± 66939",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10840297,
            "range": "± 78501",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14249908,
            "range": "± 89884",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15682761,
            "range": "± 127343",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8494953,
            "range": "± 91479",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11538157,
            "range": "± 168507",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13315098,
            "range": "± 125703",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5341258,
            "range": "± 55116",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 8053838,
            "range": "± 116925",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9577751,
            "range": "± 64509",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5308898,
            "range": "± 41341",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8012331,
            "range": "± 54649",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10017331,
            "range": "± 84920",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8979959,
            "range": "± 50995",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11968686,
            "range": "± 71551",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13660051,
            "range": "± 91933",
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
          "id": "213a8db338122e4b89a1d201a01dbb2ff75a8c8c",
          "message": "chore: pin to branch instead of commit",
          "timestamp": "2026-08-10T09:16:52-04:00",
          "tree_id": "2242b7772c38f57576c3bab491ccd6012973e5b4",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/213a8db338122e4b89a1d201a01dbb2ff75a8c8c"
        },
        "date": 1786368362633,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4349160,
            "range": "± 19854",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6300045,
            "range": "± 81481",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7602069,
            "range": "± 58748",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3446212,
            "range": "± 27117",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3457310,
            "range": "± 32856",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3470656,
            "range": "± 13047",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10515531,
            "range": "± 138407",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13659041,
            "range": "± 74790",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15765948,
            "range": "± 219384",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12698974,
            "range": "± 91882",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17523267,
            "range": "± 87332",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19845568,
            "range": "± 115217",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8511473,
            "range": "± 69939",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 11017568,
            "range": "± 120948",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12449013,
            "range": "± 47369",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5503626,
            "range": "± 95242",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7516594,
            "range": "± 143534",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8715539,
            "range": "± 82305",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11031679,
            "range": "± 48219",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14577654,
            "range": "± 190243",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15817357,
            "range": "± 47736",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8540724,
            "range": "± 37531",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11571020,
            "range": "± 69609",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13488430,
            "range": "± 68313",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5390219,
            "range": "± 28911",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 8029513,
            "range": "± 53383",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9819680,
            "range": "± 32739",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5418924,
            "range": "± 58314",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8173440,
            "range": "± 38977",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10005754,
            "range": "± 117442",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9134704,
            "range": "± 46425",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12020089,
            "range": "± 29403",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13688059,
            "range": "± 19973",
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
          "id": "dc2313c0276b5b3914dedeb8674de92294f01f37",
          "message": "chore(deps): update bun non-major dependencies (#355)\n\n* chore(deps): update bun non-major dependencies\n\n* fix build\n\n---------\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>\nCo-authored-by: Felix Perron-Brault <fpbrault@gmail.com>",
          "timestamp": "2026-08-10T13:25:23Z",
          "tree_id": "7f1e433af26ac6ccd3236bdc5976172f82b7546b",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/dc2313c0276b5b3914dedeb8674de92294f01f37"
        },
        "date": 1786368884158,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4355148,
            "range": "± 219953",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6262469,
            "range": "± 96076",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7328398,
            "range": "± 54772",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3535556,
            "range": "± 25106",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3540220,
            "range": "± 33747",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3557654,
            "range": "± 23352",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10245814,
            "range": "± 104520",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12958150,
            "range": "± 89640",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14733734,
            "range": "± 173886",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12658963,
            "range": "± 132513",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17215943,
            "range": "± 147506",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19479485,
            "range": "± 37708",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8218150,
            "range": "± 53647",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10386062,
            "range": "± 26813",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11682501,
            "range": "± 154795",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5465566,
            "range": "± 12894",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7113915,
            "range": "± 50098",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8274499,
            "range": "± 21274",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10868730,
            "range": "± 130694",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14100975,
            "range": "± 33049",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15361599,
            "range": "± 139487",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8226441,
            "range": "± 21038",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10699778,
            "range": "± 32418",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12419187,
            "range": "± 41714",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5278231,
            "range": "± 113298",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7484960,
            "range": "± 47503",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9061750,
            "range": "± 55486",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5375328,
            "range": "± 32927",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7775210,
            "range": "± 53300",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9661663,
            "range": "± 33908",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8993005,
            "range": "± 98831",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11678033,
            "range": "± 116589",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13406378,
            "range": "± 199255",
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
          "id": "fa5e803cf99f977862bd3a81dbb44d2e412a1083",
          "message": "chore(deps): update cargo non-major dependencies (#356)\n\n* chore(deps): update cargo non-major dependencies\n\n* fix build\n\n* chore(ci): add workspace lockfile verification step and remove nested Cargo.lock\n\n---------\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>\nCo-authored-by: Felix Perron-Brault <fpbrault@gmail.com>",
          "timestamp": "2026-08-10T10:06:23-04:00",
          "tree_id": "f5ff67462a778e3082d022f88b72720ddfdf34f2",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/fa5e803cf99f977862bd3a81dbb44d2e412a1083"
        },
        "date": 1786371327988,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4348500,
            "range": "± 65566",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6203388,
            "range": "± 112358",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7324302,
            "range": "± 31732",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3532046,
            "range": "± 25483",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3534584,
            "range": "± 79393",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3562162,
            "range": "± 52928",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10354789,
            "range": "± 161447",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13058188,
            "range": "± 302655",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14851713,
            "range": "± 325935",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12681983,
            "range": "± 540124",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17230850,
            "range": "± 39942",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19554652,
            "range": "± 328543",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8298182,
            "range": "± 149679",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10435533,
            "range": "± 539218",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11743765,
            "range": "± 151143",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5486573,
            "range": "± 115922",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7134944,
            "range": "± 42690",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8289397,
            "range": "± 61651",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10930314,
            "range": "± 30633",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14163654,
            "range": "± 262281",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15382905,
            "range": "± 138954",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8260086,
            "range": "± 224148",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10752175,
            "range": "± 206583",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12445027,
            "range": "± 55880",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5265662,
            "range": "± 22312",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7491369,
            "range": "± 56815",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9034523,
            "range": "± 17955",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5370059,
            "range": "± 45626",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7752468,
            "range": "± 38757",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9634661,
            "range": "± 200384",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9038673,
            "range": "± 181593",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11737273,
            "range": "± 163609",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13396050,
            "range": "± 31222",
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
          "id": "6293c0e7e7f80c49c36e666cad45c08665aa7642",
          "message": "feat(mod-matrix): redesign modulation matrix interface (#357)\n\n* feat(mod-matrix): redesign modulation matrix interface\n\n* feat(mod-matrix): refine responsive route controls\n\n* fix(mod-matrix): deduplicate destination registrations\n\n* feat(mod-matrix): implement continuous opacity for route depth in modulation matrix\n\n* feat(mod-matrix): enhance route management by preserving unassigned routes and updating only changed cells\n\n* feat(mod-matrix): update route synchronization to include both represented and unassigned routes",
          "timestamp": "2026-08-10T12:51:52-04:00",
          "tree_id": "7619f6ab75babe1e605b8f78cc80cf2c4eef0952",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/6293c0e7e7f80c49c36e666cad45c08665aa7642"
        },
        "date": 1786381260534,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4364602,
            "range": "± 131939",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6302750,
            "range": "± 70185",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7602959,
            "range": "± 71824",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3456908,
            "range": "± 24602",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3470534,
            "range": "± 20351",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3492991,
            "range": "± 18580",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10416300,
            "range": "± 36217",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13568432,
            "range": "± 55337",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15672437,
            "range": "± 53117",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12734590,
            "range": "± 79257",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17584636,
            "range": "± 78142",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 20119163,
            "range": "± 86771",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8355295,
            "range": "± 33751",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10924101,
            "range": "± 77151",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12415764,
            "range": "± 101240",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5495671,
            "range": "± 35235",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7438264,
            "range": "± 39869",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8698571,
            "range": "± 79504",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11087471,
            "range": "± 42674",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14727246,
            "range": "± 69543",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 16012793,
            "range": "± 78356",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8542832,
            "range": "± 69123",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11643289,
            "range": "± 70667",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13446132,
            "range": "± 85919",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5430681,
            "range": "± 27913",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 8095915,
            "range": "± 42921",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9853884,
            "range": "± 88326",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5402608,
            "range": "± 23990",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8194183,
            "range": "± 35877",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10032815,
            "range": "± 43950",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9210542,
            "range": "± 83453",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12184182,
            "range": "± 55363",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13872795,
            "range": "± 110186",
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
          "id": "646854e71429334daa8bd120b2607f76c1373223",
          "message": "fix(scope): auto-lock complex waveforms (#359)\n\n* fix(scope): auto-lock complex waveforms\n\n* perf(scope): coalesce scope rendering work\n\n* fix(scope): increase maxScopeSamples to 4096 for stable phase locking\n\n* feat(scope): implement windowed sample copying for improved phase locking",
          "timestamp": "2026-08-11T13:49:42Z",
          "tree_id": "7a4a8044a49692a0d77cba0e69fc506f58bc96b3",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/646854e71429334daa8bd120b2607f76c1373223"
        },
        "date": 1786456741381,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4441039,
            "range": "± 62635",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6349303,
            "range": "± 36899",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7654563,
            "range": "± 75563",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3507063,
            "range": "± 53172",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3529292,
            "range": "± 22751",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3539670,
            "range": "± 20362",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10696753,
            "range": "± 124679",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13933011,
            "range": "± 172770",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15849395,
            "range": "± 226978",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12929583,
            "range": "± 193297",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17622483,
            "range": "± 98328",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19831485,
            "range": "± 30526",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8376675,
            "range": "± 116208",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10866196,
            "range": "± 30788",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12316628,
            "range": "± 48174",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5458958,
            "range": "± 156501",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7361772,
            "range": "± 28397",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8634463,
            "range": "± 19800",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11133870,
            "range": "± 37464",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14741124,
            "range": "± 185417",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 16003489,
            "range": "± 68935",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8554060,
            "range": "± 99130",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11617989,
            "range": "± 125596",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13383916,
            "range": "± 34520",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5483380,
            "range": "± 67177",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 8316012,
            "range": "± 37813",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9931674,
            "range": "± 35878",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5481063,
            "range": "± 39032",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8326469,
            "range": "± 53454",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10190245,
            "range": "± 121918",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9465017,
            "range": "± 275190",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12536548,
            "range": "± 195883",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 14164320,
            "range": "± 50307",
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
          "id": "9318bea0d00e507a24a28e4e7d7469ab91fdac40",
          "message": "feat!: remove Karpunk algorithm (#367)\n\n* feat: remove karpunk algo\n\n* feat: update algorithm scenarios and add warp algorithm mappings",
          "timestamp": "2026-08-23T14:14:25-04:00",
          "tree_id": "eab69b9743e61f024699784520e74d7d28813e81",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/9318bea0d00e507a24a28e4e7d7469ab91fdac40"
        },
        "date": 1787509436420,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3226953,
            "range": "± 40247",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4325794,
            "range": "± 24413",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5062677,
            "range": "± 34696",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2694120,
            "range": "± 14456",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2696669,
            "range": "± 64979",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2691781,
            "range": "± 9506",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 7914589,
            "range": "± 22572",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 9806053,
            "range": "± 36402",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 11151256,
            "range": "± 41276",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 9512210,
            "range": "± 42047",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 12702696,
            "range": "± 91577",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 14285258,
            "range": "± 110352",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6267324,
            "range": "± 22588",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 7717916,
            "range": "± 71554",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 8586779,
            "range": "± 37130",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4112065,
            "range": "± 25845",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5200078,
            "range": "± 73664",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 5905414,
            "range": "± 40087",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 8085016,
            "range": "± 30002",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 10117696,
            "range": "± 50665",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 10998529,
            "range": "± 51067",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6309752,
            "range": "± 18533",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8056734,
            "range": "± 33015",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 9295674,
            "range": "± 31379",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3839566,
            "range": "± 14997",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 5330423,
            "range": "± 24886",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6382999,
            "range": "± 29697",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4000401,
            "range": "± 14993",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5892558,
            "range": "± 23775",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 7214149,
            "range": "± 33066",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 7202239,
            "range": "± 26949",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 9356322,
            "range": "± 27030",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 10675338,
            "range": "± 31992",
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
          "id": "3a54ac9240d0ed9faf6ac64804a42e427cc7e949",
          "message": "feat(presets): import multiple SysEx files (#368)\n\n* feat(presets): import multiple SysEx files\n\n* fix(presets): default imported patches to user",
          "timestamp": "2026-08-23T16:33:56-04:00",
          "tree_id": "e4add0d8456ba0a3102ae65a15d556fa77cd7957",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/3a54ac9240d0ed9faf6ac64804a42e427cc7e949"
        },
        "date": 1787517781528,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2673373,
            "range": "± 29705",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 3828451,
            "range": "± 32631",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 4612964,
            "range": "± 29991",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2255966,
            "range": "± 27077",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2292892,
            "range": "± 28128",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2318721,
            "range": "± 23695",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 7390679,
            "range": "± 70820",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 9593829,
            "range": "± 52395",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 10981640,
            "range": "± 85720",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 8949064,
            "range": "± 58850",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 12068721,
            "range": "± 207813",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 13733484,
            "range": "± 98554",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 5896508,
            "range": "± 37054",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 7513802,
            "range": "± 101364",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 8449435,
            "range": "± 58842",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3716942,
            "range": "± 59188",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 4830762,
            "range": "± 129567",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 5628372,
            "range": "± 46660",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 7542885,
            "range": "± 62962",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 9559205,
            "range": "± 70957",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 10460633,
            "range": "± 70204",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 5738241,
            "range": "± 58068",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 7563051,
            "range": "± 74108",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 8792007,
            "range": "± 55185",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3376133,
            "range": "± 33871",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 4994852,
            "range": "± 40872",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6097844,
            "range": "± 68180",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3535917,
            "range": "± 23075",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5455882,
            "range": "± 68019",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6778557,
            "range": "± 47741",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 6685057,
            "range": "± 54320",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 8914415,
            "range": "± 53565",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 10254571,
            "range": "± 85386",
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
          "id": "4af69ec31db1a4a8595737280c6d534892d093c4",
          "message": "feat(presets): improve preset navigator (#369)",
          "timestamp": "2026-08-23T17:13:12-04:00",
          "tree_id": "8d4ee2bff01caee1507ef43a76b3169129efdc7a",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/4af69ec31db1a4a8595737280c6d534892d093c4"
        },
        "date": 1787520153008,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2166855,
            "range": "± 44615",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 3070423,
            "range": "± 75954",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 3705662,
            "range": "± 96985",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 1833586,
            "range": "± 26052",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 1853776,
            "range": "± 35792",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 1879396,
            "range": "± 15642",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 5919858,
            "range": "± 216110",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 7662668,
            "range": "± 248368",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 8882118,
            "range": "± 453734",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 7103148,
            "range": "± 239421",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 9696601,
            "range": "± 219993",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 10801925,
            "range": "± 322501",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 4658332,
            "range": "± 85960",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 5923112,
            "range": "± 249666",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 6661907,
            "range": "± 431307",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 2990994,
            "range": "± 42719",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 3868274,
            "range": "± 134216",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 4452320,
            "range": "± 168224",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 5989783,
            "range": "± 256288",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 7588844,
            "range": "± 260857",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 8390438,
            "range": "± 192865",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 4551068,
            "range": "± 33972",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 6023706,
            "range": "± 222580",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 7028263,
            "range": "± 397738",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 2656940,
            "range": "± 48110",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 3992395,
            "range": "± 213307",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 4909183,
            "range": "± 244026",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 2876778,
            "range": "± 101970",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 4439848,
            "range": "± 43970",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 5511400,
            "range": "± 220207",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 5257709,
            "range": "± 380476",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 7065555,
            "range": "± 52371",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 8187699,
            "range": "± 73279",
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
          "id": "6e68f07c8cf7fab3ad409a80e2adc0087b93c405",
          "message": "feat(ui): add simple mode (#371)\n\n* feat(ui): add simple performance workspace\n\n* fix lag",
          "timestamp": "2026-08-24T00:06:15Z",
          "tree_id": "030f1297f61f58a752728cb5595e7aa5f228bc7f",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/6e68f07c8cf7fab3ad409a80e2adc0087b93c405"
        },
        "date": 1787530542524,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3957025,
            "range": "± 24321",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5484464,
            "range": "± 88892",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6513954,
            "range": "± 36174",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3384209,
            "range": "± 14660",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3399976,
            "range": "± 15490",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3415106,
            "range": "± 17537",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10270325,
            "range": "± 35649",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13262270,
            "range": "± 76087",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15250037,
            "range": "± 52227",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_3_voices",
            "value": 12239761,
            "range": "± 57105",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_6_voices",
            "value": 16662978,
            "range": "± 69520",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_v2_8_voices",
            "value": 18875899,
            "range": "± 654339",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8047765,
            "range": "± 121394",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10164933,
            "range": "± 48632",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11371049,
            "range": "± 56037",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5093722,
            "range": "± 22718",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6607147,
            "range": "± 37772",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 7572612,
            "range": "± 33892",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_3_voices",
            "value": 10541672,
            "range": "± 55961",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_6_voices",
            "value": 13375629,
            "range": "± 44103",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_v2_8_voices",
            "value": 14501516,
            "range": "± 53732",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8021049,
            "range": "± 58828",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10660035,
            "range": "± 368375",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12236614,
            "range": "± 46426",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5007516,
            "range": "± 56335",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7297801,
            "range": "± 46771",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8771892,
            "range": "± 45467",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5123623,
            "range": "± 62549",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7735843,
            "range": "± 205333",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 8530982,
            "range": "± 76967",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_3_voices",
            "value": 8437439,
            "range": "± 48296",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_6_voices",
            "value": 11595561,
            "range": "± 75254",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_v2_8_voices",
            "value": 13473661,
            "range": "± 69446",
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
      }
    ]
  }
}