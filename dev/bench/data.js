window.BENCHMARK_DATA = {
  "lastUpdate": 1781279246069,
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
          "id": "aa22f3b4d23611be445769e422016f760a7572cc",
          "message": "feat: improve macro panel (#285)\n\n* feat: improve macro panel\n\n* fix tests\n\n* fix midi learn appearance",
          "timestamp": "2026-06-10T20:06:56Z",
          "tree_id": "d83c5e6153f015daa44338fe168e03004642ed36",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/aa22f3b4d23611be445769e422016f760a7572cc"
        },
        "date": 1781122573356,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4213808,
            "range": "± 14300",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6107187,
            "range": "± 594739",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7357327,
            "range": "± 51330",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3339195,
            "range": "± 59309",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3350057,
            "range": "± 7891",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3369406,
            "range": "± 11679",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9466847,
            "range": "± 48728",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12675406,
            "range": "± 36666",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14765201,
            "range": "± 28142",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11668661,
            "range": "± 32201",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16432782,
            "range": "± 25157",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18824294,
            "range": "± 69277",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7580361,
            "range": "± 17651",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10117343,
            "range": "± 14501",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11611096,
            "range": "± 25252",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5393362,
            "range": "± 59628",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7282332,
            "range": "± 35515",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8517194,
            "range": "± 36330",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10077493,
            "range": "± 69065",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13608665,
            "range": "± 35297",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14920907,
            "range": "± 64409",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7608699,
            "range": "± 18431",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10601667,
            "range": "± 31182",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12574273,
            "range": "± 29853",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5255304,
            "range": "± 15296",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7888848,
            "range": "± 20357",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9711367,
            "range": "± 24403",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5243655,
            "range": "± 18306",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7976915,
            "range": "± 19808",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9832507,
            "range": "± 16550",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8250082,
            "range": "± 25267",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11318205,
            "range": "± 28763",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12915698,
            "range": "± 24567",
            "unit": "ns/iter"
          }
        ]
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
          "id": "aba16f0da7f7184b991e62a5d257f82e42a63601",
          "message": "fix: better auv3 (#286)\n\n* fix auv3\n\n* fix other exception\n\n* fix test\n\n* remove old implementation\n\n* fix tests",
          "timestamp": "2026-06-10T20:59:32Z",
          "tree_id": "96d21f607ddd25a99a283125a33b2c4349cd3fde",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/aba16f0da7f7184b991e62a5d257f82e42a63601"
        },
        "date": 1781125728960,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4230019,
            "range": "± 37437",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6123888,
            "range": "± 23089",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7388855,
            "range": "± 39703",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3350624,
            "range": "± 29002",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3366974,
            "range": "± 74231",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3378968,
            "range": "± 9754",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9541482,
            "range": "± 29334",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12735179,
            "range": "± 47911",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14879686,
            "range": "± 29386",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11758761,
            "range": "± 511291",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16585773,
            "range": "± 35766",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18978260,
            "range": "± 45735",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7620757,
            "range": "± 18189",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10141021,
            "range": "± 343087",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11639256,
            "range": "± 26795",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5424353,
            "range": "± 38039",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7326523,
            "range": "± 91565",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8546130,
            "range": "± 64425",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10073899,
            "range": "± 22718",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13627100,
            "range": "± 37192",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14958703,
            "range": "± 50915",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7605658,
            "range": "± 29670",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10615700,
            "range": "± 120748",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12584541,
            "range": "± 19285",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5260565,
            "range": "± 26785",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7906111,
            "range": "± 23212",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9702794,
            "range": "± 13937",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5272404,
            "range": "± 21652",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8029185,
            "range": "± 31911",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9910337,
            "range": "± 28425",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8336806,
            "range": "± 212389",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11305687,
            "range": "± 187011",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13028241,
            "range": "± 78716",
            "unit": "ns/iter"
          }
        ]
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
          "id": "b92ed38f186bd4cf0aff01ca396ed4b45d826a75",
          "message": "feat: rework some presets",
          "timestamp": "2026-06-10T17:01:36-04:00",
          "tree_id": "ced18a42130a6227f323ba914fce7a1aeb6bdb18",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/b92ed38f186bd4cf0aff01ca396ed4b45d826a75"
        },
        "date": 1781125855605,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4237804,
            "range": "± 39119",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6105999,
            "range": "± 94599",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7371651,
            "range": "± 77177",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3355843,
            "range": "± 29166",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3365771,
            "range": "± 16038",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3385384,
            "range": "± 27994",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9706338,
            "range": "± 68414",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12908693,
            "range": "± 284176",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15026266,
            "range": "± 239627",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11848877,
            "range": "± 242457",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16673222,
            "range": "± 73403",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19073393,
            "range": "± 84543",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7714948,
            "range": "± 88990",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10287951,
            "range": "± 81105",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11707613,
            "range": "± 54995",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5458904,
            "range": "± 49485",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7342407,
            "range": "± 86962",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8552012,
            "range": "± 90300",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10156442,
            "range": "± 60361",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13697799,
            "range": "± 203189",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15055426,
            "range": "± 231666",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7698401,
            "range": "± 66932",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10709274,
            "range": "± 156333",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12658823,
            "range": "± 67085",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5237912,
            "range": "± 30203",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7905470,
            "range": "± 173431",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9711034,
            "range": "± 53981",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5310714,
            "range": "± 86619",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7997274,
            "range": "± 73077",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9902093,
            "range": "± 35642",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8357901,
            "range": "± 79970",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11369218,
            "range": "± 180653",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13056986,
            "range": "± 95015",
            "unit": "ns/iter"
          }
        ]
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
          "id": "6f313e2289c75495661752b74766a8f6ac295c17",
          "message": "fix tests",
          "timestamp": "2026-06-10T17:04:46-04:00",
          "tree_id": "2d9e7597526505d5bcb8ef04181854fc7990efa2",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/6f313e2289c75495661752b74766a8f6ac295c17"
        },
        "date": 1781126044047,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4257147,
            "range": "± 31451",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6155815,
            "range": "± 173380",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7444798,
            "range": "± 28330",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3374491,
            "range": "± 9314",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3389494,
            "range": "± 11867",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3401399,
            "range": "± 12393",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9720537,
            "range": "± 43979",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12983397,
            "range": "± 64405",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15083286,
            "range": "± 257616",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11802324,
            "range": "± 173360",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16722736,
            "range": "± 60485",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19058265,
            "range": "± 125838",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7657697,
            "range": "± 39199",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10153087,
            "range": "± 39375",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11670870,
            "range": "± 50587",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5400976,
            "range": "± 26792",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7281474,
            "range": "± 47682",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8522337,
            "range": "± 68819",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10153893,
            "range": "± 36214",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13730243,
            "range": "± 56750",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15136572,
            "range": "± 66332",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7697695,
            "range": "± 58902",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10693704,
            "range": "± 69854",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12690363,
            "range": "± 55916",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5294799,
            "range": "± 53723",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7991415,
            "range": "± 45424",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9701358,
            "range": "± 34057",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5284843,
            "range": "± 22815",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8041329,
            "range": "± 26812",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9889876,
            "range": "± 33313",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8289576,
            "range": "± 56075",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11291298,
            "range": "± 57558",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12997377,
            "range": "± 71725",
            "unit": "ns/iter"
          }
        ]
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
          "id": "f64cea1233f1b9eee8b70b6922383a658c382a46",
          "message": "add bank col for library",
          "timestamp": "2026-06-10T17:07:53-04:00",
          "tree_id": "34da2026f3dab32e1b3352dcff87895bca49d3f2",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/f64cea1233f1b9eee8b70b6922383a658c382a46"
        },
        "date": 1781126234317,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4284302,
            "range": "± 45206",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6156717,
            "range": "± 154304",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7427510,
            "range": "± 82758",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3384780,
            "range": "± 9806",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3403887,
            "range": "± 9742",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3403979,
            "range": "± 29102",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9501546,
            "range": "± 27444",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12188115,
            "range": "± 36987",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14033358,
            "range": "± 68605",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11952017,
            "range": "± 300898",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16487356,
            "range": "± 315042",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18774107,
            "range": "± 52474",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7564520,
            "range": "± 96359",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9755143,
            "range": "± 246534",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11091743,
            "range": "± 49304",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5486713,
            "range": "± 46962",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7212123,
            "range": "± 22706",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8446505,
            "range": "± 361406",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9991481,
            "range": "± 30082",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13177277,
            "range": "± 324245",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14498404,
            "range": "± 72615",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7505866,
            "range": "± 59560",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9902100,
            "range": "± 51049",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11756270,
            "range": "± 159544",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5164752,
            "range": "± 50881",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7515228,
            "range": "± 117193",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9094265,
            "range": "± 19384",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5206465,
            "range": "± 26502",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7870939,
            "range": "± 60645",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9762825,
            "range": "± 138676",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8175487,
            "range": "± 121018",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10857494,
            "range": "± 170075",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12593341,
            "range": "± 36346",
            "unit": "ns/iter"
          }
        ]
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
          "id": "d24996602553fb73f796ded2c3d93a6bc48320ab",
          "message": "increase default keyboard range",
          "timestamp": "2026-06-10T17:32:01-04:00",
          "tree_id": "594f1ffb91c2e523ccb4d8f265e6364b3bedee68",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/d24996602553fb73f796ded2c3d93a6bc48320ab"
        },
        "date": 1781127780450,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3698040,
            "range": "± 56946",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5622328,
            "range": "± 97541",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 6913578,
            "range": "± 59250",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2855007,
            "range": "± 21146",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2908065,
            "range": "± 41893",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2901506,
            "range": "± 27799",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9284151,
            "range": "± 39715",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12153156,
            "range": "± 48402",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14083272,
            "range": "± 114428",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11549596,
            "range": "± 31872",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16200157,
            "range": "± 122393",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18494654,
            "range": "± 67985",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7138349,
            "range": "± 41034",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9438597,
            "range": "± 44407",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10803720,
            "range": "± 27647",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5140363,
            "range": "± 65099",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6959273,
            "range": "± 74990",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8173397,
            "range": "± 104111",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9562348,
            "range": "± 29097",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 12728330,
            "range": "± 159697",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 13962701,
            "range": "± 24974",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7038968,
            "range": "± 38102",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9592243,
            "range": "± 26198",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11303932,
            "range": "± 147707",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 4599473,
            "range": "± 29485",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7038895,
            "range": "± 62670",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8598514,
            "range": "± 44822",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4722834,
            "range": "± 34778",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7384615,
            "range": "± 52898",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9201203,
            "range": "± 57885",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 7867961,
            "range": "± 35208",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10601854,
            "range": "± 144850",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12234892,
            "range": "± 124648",
            "unit": "ns/iter"
          }
        ]
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
          "id": "407a8669d6afd306de472f08f1bfdf740dba495b",
          "message": "codegraph gitignore",
          "timestamp": "2026-06-10T20:47:36-04:00",
          "tree_id": "52207a5e8229026b17ed119b1c78a5cd4ac8979e",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/407a8669d6afd306de472f08f1bfdf740dba495b"
        },
        "date": 1781139416471,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4236469,
            "range": "± 21114",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6096286,
            "range": "± 73336",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7361730,
            "range": "± 17079",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3337024,
            "range": "± 19989",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3360479,
            "range": "± 15523",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3366299,
            "range": "± 10828",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9416268,
            "range": "± 36978",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12561025,
            "range": "± 22798",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14670249,
            "range": "± 34418",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11592396,
            "range": "± 53350",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16376410,
            "range": "± 74425",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18790994,
            "range": "± 217405",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7566984,
            "range": "± 36668",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10103537,
            "range": "± 39090",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11566533,
            "range": "± 45164",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5405468,
            "range": "± 23127",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7268424,
            "range": "± 42487",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8510956,
            "range": "± 314324",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10035483,
            "range": "± 37829",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13536240,
            "range": "± 55030",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14864044,
            "range": "± 55766",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7588217,
            "range": "± 35158",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10582214,
            "range": "± 35644",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12526272,
            "range": "± 136300",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5270949,
            "range": "± 23219",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7898854,
            "range": "± 25725",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9653862,
            "range": "± 22763",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5242936,
            "range": "± 14984",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7987922,
            "range": "± 42022",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9849414,
            "range": "± 35256",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8210909,
            "range": "± 43297",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11174155,
            "range": "± 30732",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12874254,
            "range": "± 27114",
            "unit": "ns/iter"
          }
        ]
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
          "id": "6b3e72ad92545edde5b5b4aa36c3d2fc271c82c2",
          "message": "fix tests",
          "timestamp": "2026-06-11T08:56:55-04:00",
          "tree_id": "6f9871d432a0caabd54484bcbe8b4ac017a2ad3f",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/6b3e72ad92545edde5b5b4aa36c3d2fc271c82c2"
        },
        "date": 1781183175734,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4218152,
            "range": "± 89734",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6127077,
            "range": "± 197097",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7375648,
            "range": "± 35331",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3341202,
            "range": "± 36407",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3358919,
            "range": "± 52517",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3372341,
            "range": "± 11066",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9410354,
            "range": "± 33947",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12609666,
            "range": "± 46761",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14731902,
            "range": "± 131378",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11658165,
            "range": "± 275213",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16485106,
            "range": "± 78942",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18833960,
            "range": "± 90146",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7591311,
            "range": "± 70142",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10111032,
            "range": "± 28569",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11549166,
            "range": "± 16659",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5364949,
            "range": "± 14249",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7298308,
            "range": "± 88791",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8541675,
            "range": "± 338195",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10108057,
            "range": "± 112921",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13596027,
            "range": "± 116424",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14953264,
            "range": "± 83725",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7637947,
            "range": "± 57972",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10611072,
            "range": "± 45315",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12579693,
            "range": "± 40019",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5228733,
            "range": "± 28297",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7950931,
            "range": "± 67767",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9731573,
            "range": "± 110832",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5260797,
            "range": "± 33953",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8012765,
            "range": "± 90278",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9868646,
            "range": "± 37794",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8222568,
            "range": "± 34209",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11160495,
            "range": "± 32322",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12963411,
            "range": "± 82495",
            "unit": "ns/iter"
          }
        ]
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
          "id": "407a8669d6afd306de472f08f1bfdf740dba495b",
          "message": "codegraph gitignore",
          "timestamp": "2026-06-10T20:47:36-04:00",
          "tree_id": "52207a5e8229026b17ed119b1c78a5cd4ac8979e",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/407a8669d6afd306de472f08f1bfdf740dba495b"
        },
        "date": 1781183321557,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4333079,
            "range": "± 31708",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6170914,
            "range": "± 90556",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7419345,
            "range": "± 228111",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3447633,
            "range": "± 38426",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3445059,
            "range": "± 97551",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3473898,
            "range": "± 55702",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9609602,
            "range": "± 179712",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12317903,
            "range": "± 171175",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14164137,
            "range": "± 70012",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11940741,
            "range": "± 147647",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16546756,
            "range": "± 333922",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18778616,
            "range": "± 82240",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7549589,
            "range": "± 59420",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9785301,
            "range": "± 42664",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11188039,
            "range": "± 218758",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5467446,
            "range": "± 54571",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7320623,
            "range": "± 102590",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8514267,
            "range": "± 117681",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9911086,
            "range": "± 52120",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13059932,
            "range": "± 250978",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14390342,
            "range": "± 165026",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7522443,
            "range": "± 99059",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10109918,
            "range": "± 160223",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11826487,
            "range": "± 146273",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5186969,
            "range": "± 49175",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7477137,
            "range": "± 61083",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9189547,
            "range": "± 174414",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5392491,
            "range": "± 87076",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8143673,
            "range": "± 183343",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10048034,
            "range": "± 178523",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8216979,
            "range": "± 88851",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10844285,
            "range": "± 65635",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12647947,
            "range": "± 147597",
            "unit": "ns/iter"
          }
        ]
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
          "id": "d0f014a8df8e58f83a3fa6f4461148ac2518d79c",
          "message": "feat: add more i18n strings (#289)\n\n* add more dynamic strings\n\n* fix tests\n\n* fix engine\n\n* fix tests\n\n* lint\n\n* fix tests",
          "timestamp": "2026-06-11T09:11:37-04:00",
          "tree_id": "8cd7b7270fe85f5dd16ced5047f0d8de66c016eb",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/d0f014a8df8e58f83a3fa6f4461148ac2518d79c"
        },
        "date": 1781184049377,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4345262,
            "range": "± 85647",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6129397,
            "range": "± 54631",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7398244,
            "range": "± 57837",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3398585,
            "range": "± 10024",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3423743,
            "range": "± 32360",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3424584,
            "range": "± 17651",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9322936,
            "range": "± 27221",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12067638,
            "range": "± 161252",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13847094,
            "range": "± 59732",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11790965,
            "range": "± 78683",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16341840,
            "range": "± 176848",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18512528,
            "range": "± 42489",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7459393,
            "range": "± 50354",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9654659,
            "range": "± 70220",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11066345,
            "range": "± 75854",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5417088,
            "range": "± 49650",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7158604,
            "range": "± 82176",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8417169,
            "range": "± 62316",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9969011,
            "range": "± 39535",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13161150,
            "range": "± 164031",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14536525,
            "range": "± 135946",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7433329,
            "range": "± 48555",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9928438,
            "range": "± 116263",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11736660,
            "range": "± 133336",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5162583,
            "range": "± 48510",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7470957,
            "range": "± 38018",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9131961,
            "range": "± 146112",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5237725,
            "range": "± 41606",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7890731,
            "range": "± 74979",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9809075,
            "range": "± 77741",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8106938,
            "range": "± 199579",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10746448,
            "range": "± 90312",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12479104,
            "range": "± 176385",
            "unit": "ns/iter"
          }
        ]
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
          "id": "18ca21d2f6bdeb0c112e957b0cd49f48305c06cd",
          "message": "fix preset volume",
          "timestamp": "2026-06-11T09:11:57-04:00",
          "tree_id": "1a6e855e615c1c4e58b3c09fe8fb02af05ba929d",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/18ca21d2f6bdeb0c112e957b0cd49f48305c06cd"
        },
        "date": 1781184063011,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4285529,
            "range": "± 52085",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6073497,
            "range": "± 124356",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7321461,
            "range": "± 60902",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3391091,
            "range": "± 14527",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3399973,
            "range": "± 24584",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3413209,
            "range": "± 43718",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9272154,
            "range": "± 46696",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11915846,
            "range": "± 145226",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13846625,
            "range": "± 76472",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11695514,
            "range": "± 53555",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16276924,
            "range": "± 138453",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18573134,
            "range": "± 60329",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7455100,
            "range": "± 57231",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9664016,
            "range": "± 192940",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11041488,
            "range": "± 179430",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5426921,
            "range": "± 35391",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7173373,
            "range": "± 41920",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8401468,
            "range": "± 65429",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9955632,
            "range": "± 50049",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13057667,
            "range": "± 184784",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14414309,
            "range": "± 48249",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7403169,
            "range": "± 67976",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9944098,
            "range": "± 239280",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11593623,
            "range": "± 153565",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5172067,
            "range": "± 37698",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7408211,
            "range": "± 52582",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9013368,
            "range": "± 37032",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5187513,
            "range": "± 20402",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7782256,
            "range": "± 34209",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9641439,
            "range": "± 147197",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8039220,
            "range": "± 60332",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10719575,
            "range": "± 38968",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12422450,
            "range": "± 62474",
            "unit": "ns/iter"
          }
        ]
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
          "id": "c1090b972911ca334ad72fd5a733fcab195d16e6",
          "message": "chore: clean up auv3 (#290)\n\n* add more dynamic strings\n\n* fix tests\n\n* fix engine\n\n* fix tests\n\n* lint\n\n* fix tests\n\n* clean up auv3 implementation",
          "timestamp": "2026-06-11T13:24:27Z",
          "tree_id": "30f4a86d89fb8d60f18fa023a4e24c037192e176",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/c1090b972911ca334ad72fd5a733fcab195d16e6"
        },
        "date": 1781184824210,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4247787,
            "range": "± 28013",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6112968,
            "range": "± 72518",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7369863,
            "range": "± 23125",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3337176,
            "range": "± 16301",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3358598,
            "range": "± 12764",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3373236,
            "range": "± 16327",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9549921,
            "range": "± 56861",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12660763,
            "range": "± 24143",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14798453,
            "range": "± 143767",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11662497,
            "range": "± 49365",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16479006,
            "range": "± 30108",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18847504,
            "range": "± 84778",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7571879,
            "range": "± 25187",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10112078,
            "range": "± 24648",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11585390,
            "range": "± 23180",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5449704,
            "range": "± 50500",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7294191,
            "range": "± 41047",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8569966,
            "range": "± 31347",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10095871,
            "range": "± 35467",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13653921,
            "range": "± 78887",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15007945,
            "range": "± 38981",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7643420,
            "range": "± 29065",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10662127,
            "range": "± 225741",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12629029,
            "range": "± 40221",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5282433,
            "range": "± 32249",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7921450,
            "range": "± 21240",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9734442,
            "range": "± 25907",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5308770,
            "range": "± 52036",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8067221,
            "range": "± 32583",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9913752,
            "range": "± 69324",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8265204,
            "range": "± 31660",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11285227,
            "range": "± 41268",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13033682,
            "range": "± 43743",
            "unit": "ns/iter"
          }
        ]
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
          "id": "b644ee29371cbb6185ccd06dc103fe2e263a77cd",
          "message": "feat: improve panel handles (#291)",
          "timestamp": "2026-06-11T13:32:41Z",
          "tree_id": "c28e8240a285c3d1d6dc3d5b44c9b922bb3026ea",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/b644ee29371cbb6185ccd06dc103fe2e263a77cd"
        },
        "date": 1781185323124,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4222767,
            "range": "± 20489",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6113274,
            "range": "± 41132",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7376847,
            "range": "± 154410",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3343011,
            "range": "± 6663",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3354632,
            "range": "± 18587",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3367493,
            "range": "± 11481",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9397303,
            "range": "± 44823",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12599901,
            "range": "± 47569",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14738862,
            "range": "± 36722",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11609778,
            "range": "± 149022",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16449671,
            "range": "± 36202",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18859695,
            "range": "± 60567",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7587857,
            "range": "± 63864",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10171287,
            "range": "± 64486",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11684445,
            "range": "± 62943",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5517043,
            "range": "± 105079",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7294944,
            "range": "± 101178",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8546532,
            "range": "± 74547",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10038553,
            "range": "± 84590",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13568192,
            "range": "± 57939",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14887032,
            "range": "± 33513",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7600915,
            "range": "± 81774",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10583795,
            "range": "± 38972",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12569381,
            "range": "± 36287",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5255547,
            "range": "± 49395",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7924110,
            "range": "± 116487",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9684333,
            "range": "± 37143",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5241580,
            "range": "± 18500",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8018473,
            "range": "± 22059",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9853493,
            "range": "± 22203",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8211723,
            "range": "± 22350",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11194298,
            "range": "± 30167",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12918820,
            "range": "± 38700",
            "unit": "ns/iter"
          }
        ]
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
          "id": "48d63d07005e2dd4a45c77116ea8ac397f3650fb",
          "message": "feat: add mod and pitch wheels (#292)\n\n* feat: add mod and pitch wheels\n\n* fix disappearing wheel indicator\n\n* auv3 changes",
          "timestamp": "2026-06-11T20:04:33Z",
          "tree_id": "e50c10b6683db434a96148388df281efb520564e",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/48d63d07005e2dd4a45c77116ea8ac397f3650fb"
        },
        "date": 1781208824527,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4413787,
            "range": "± 61611",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6188299,
            "range": "± 42490",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7406547,
            "range": "± 134520",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3513496,
            "range": "± 51463",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3481087,
            "range": "± 75628",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3514454,
            "range": "± 54150",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9576414,
            "range": "± 122400",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12328942,
            "range": "± 75081",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14225086,
            "range": "± 330359",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11865809,
            "range": "± 45098",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16505304,
            "range": "± 181556",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18718453,
            "range": "± 292336",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7567586,
            "range": "± 89328",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9737160,
            "range": "± 139432",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11044723,
            "range": "± 69851",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5513214,
            "range": "± 34925",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7215985,
            "range": "± 186253",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8380739,
            "range": "± 120669",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10045689,
            "range": "± 106796",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13244184,
            "range": "± 46531",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14520479,
            "range": "± 189515",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7499740,
            "range": "± 133741",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9961053,
            "range": "± 27168",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11662281,
            "range": "± 28041",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5236169,
            "range": "± 137742",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7502298,
            "range": "± 23519",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9063968,
            "range": "± 189356",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5377099,
            "range": "± 147479",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7910091,
            "range": "± 76197",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9728645,
            "range": "± 106514",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8249181,
            "range": "± 60559",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10978185,
            "range": "± 152193",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12628252,
            "range": "± 112388",
            "unit": "ns/iter"
          }
        ]
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
          "id": "f9e4357b434d58f462acdaabb24029802617ee94",
          "message": "fix envelope issues",
          "timestamp": "2026-06-11T17:01:28-04:00",
          "tree_id": "2b89c84c035cacfa31e202fd53063d90d8f3ee5a",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/f9e4357b434d58f462acdaabb24029802617ee94"
        },
        "date": 1781212243223,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4278448,
            "range": "± 34002",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6188599,
            "range": "± 104821",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7490392,
            "range": "± 43042",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3348744,
            "range": "± 33231",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3371071,
            "range": "± 32554",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3387512,
            "range": "± 30411",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10626766,
            "range": "± 48333",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13932882,
            "range": "± 59151",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 16126589,
            "range": "± 256048",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12684329,
            "range": "± 74173",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17581213,
            "range": "± 140484",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19953984,
            "range": "± 102271",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8392305,
            "range": "± 51182",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10934315,
            "range": "± 103348",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12382877,
            "range": "± 56547",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5408026,
            "range": "± 22632",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7285702,
            "range": "± 36467",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8551337,
            "range": "± 54901",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10870368,
            "range": "± 83781",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14454860,
            "range": "± 188184",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15782509,
            "range": "± 55750",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8430295,
            "range": "± 37950",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11437228,
            "range": "± 38927",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13407823,
            "range": "± 30464",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5277536,
            "range": "± 19452",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7915534,
            "range": "± 40912",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9696010,
            "range": "± 28934",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5279715,
            "range": "± 23118",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8046820,
            "range": "± 40525",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9934987,
            "range": "± 86336",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9166873,
            "range": "± 76319",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12189284,
            "range": "± 43324",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13983243,
            "range": "± 61383",
            "unit": "ns/iter"
          }
        ]
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
          "id": "c6a0d2807560a6564cd3fd5695a0261c6e0aa724",
          "message": "engine build",
          "timestamp": "2026-06-11T17:01:49-04:00",
          "tree_id": "6804f2e490343dac82ba338e9b9381345b8dbedf",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/c6a0d2807560a6564cd3fd5695a0261c6e0aa724"
        },
        "date": 1781212252456,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4229279,
            "range": "± 26629",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6134061,
            "range": "± 129380",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7421982,
            "range": "± 67665",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3310320,
            "range": "± 8682",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3326131,
            "range": "± 17193",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3344433,
            "range": "± 17182",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10457833,
            "range": "± 139618",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13664244,
            "range": "± 395427",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15803003,
            "range": "± 174913",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12513996,
            "range": "± 41219",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17323331,
            "range": "± 97023",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19705568,
            "range": "± 74738",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8368121,
            "range": "± 51280",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10918394,
            "range": "± 33720",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12395427,
            "range": "± 47635",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5379110,
            "range": "± 31284",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7290941,
            "range": "± 56214",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8541558,
            "range": "± 40708",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10876929,
            "range": "± 64071",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14455957,
            "range": "± 469421",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15745571,
            "range": "± 42458",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8421728,
            "range": "± 121684",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11436550,
            "range": "± 76859",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13411336,
            "range": "± 145614",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5275345,
            "range": "± 53774",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7918382,
            "range": "± 73486",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9687805,
            "range": "± 47826",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5264587,
            "range": "± 15460",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8019499,
            "range": "± 23645",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9861588,
            "range": "± 29434",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9070366,
            "range": "± 108926",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12110167,
            "range": "± 129128",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13851129,
            "range": "± 157838",
            "unit": "ns/iter"
          }
        ]
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
      }
    ]
  }
}