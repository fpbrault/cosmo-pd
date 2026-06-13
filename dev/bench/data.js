window.BENCHMARK_DATA = {
  "lastUpdate": 1781358305550,
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
      }
    ]
  }
}