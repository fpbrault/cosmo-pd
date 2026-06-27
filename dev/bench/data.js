window.BENCHMARK_DATA = {
  "lastUpdate": 1782566247798,
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
          "id": "ff61cece145392c400378da6861e623bb17c2765",
          "message": "fix web position",
          "timestamp": "2026-06-17T21:45:21-04:00",
          "tree_id": "fae8ffd239f746fc43cd010b591b40cbdf33d7f1",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/ff61cece145392c400378da6861e623bb17c2765"
        },
        "date": 1781747671008,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4333226,
            "range": "± 17449",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6259126,
            "range": "± 101110",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7562212,
            "range": "± 28118",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3414350,
            "range": "± 8981",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3425415,
            "range": "± 11010",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3442538,
            "range": "± 9189",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10341336,
            "range": "± 43376",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13472211,
            "range": "± 60563",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15506562,
            "range": "± 272873",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12501847,
            "range": "± 35833",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17321384,
            "range": "± 54063",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19732115,
            "range": "± 53459",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8353864,
            "range": "± 35382",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10835006,
            "range": "± 38306",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12273206,
            "range": "± 75983",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5385528,
            "range": "± 21119",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7260135,
            "range": "± 137262",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8503525,
            "range": "± 34079",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10883283,
            "range": "± 40760",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14380637,
            "range": "± 55884",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15691832,
            "range": "± 47769",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8396736,
            "range": "± 51440",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11378397,
            "range": "± 33238",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13316697,
            "range": "± 52017",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5278523,
            "range": "± 23555",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7892014,
            "range": "± 62162",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9654837,
            "range": "± 70129",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5309060,
            "range": "± 23025",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7975690,
            "range": "± 24820",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9881156,
            "range": "± 34492",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9006640,
            "range": "± 33281",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11961890,
            "range": "± 55950",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13655531,
            "range": "± 44964",
            "unit": "ns/iter"
          }
        ]
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
          "id": "cc7ed6ef0162752e0f1e78a41cc8bb5265265857",
          "message": "fix: dont queue ipc responses (#312)\n\nDont queue ipc responses",
          "timestamp": "2026-06-18T02:04:42Z",
          "tree_id": "5fedb1c89cef387a8bde6bc8326a9f140493e913",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/cc7ed6ef0162752e0f1e78a41cc8bb5265265857"
        },
        "date": 1781748817567,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4488004,
            "range": "± 26005",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6295083,
            "range": "± 22169",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7494159,
            "range": "± 23305",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3577766,
            "range": "± 13778",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3593623,
            "range": "± 17153",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3595292,
            "range": "± 109653",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10211765,
            "range": "± 120926",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12802013,
            "range": "± 132256",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14639708,
            "range": "± 115338",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12615819,
            "range": "± 62490",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17113856,
            "range": "± 41826",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19324032,
            "range": "± 48882",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8278972,
            "range": "± 34004",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10480722,
            "range": "± 39631",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11824673,
            "range": "± 65029",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5575033,
            "range": "± 41207",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7348086,
            "range": "± 27026",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8590015,
            "range": "± 29323",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10901440,
            "range": "± 39774",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14083259,
            "range": "± 21230",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15323068,
            "range": "± 26054",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8393717,
            "range": "± 17352",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10748275,
            "range": "± 26069",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12485518,
            "range": "± 24245",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5296111,
            "range": "± 15634",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7543102,
            "range": "± 17734",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9133812,
            "range": "± 213323",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5361807,
            "range": "± 15031",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7935660,
            "range": "± 20298",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9790517,
            "range": "± 147952",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8921650,
            "range": "± 200729",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11626076,
            "range": "± 20241",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13327111,
            "range": "± 18551",
            "unit": "ns/iter"
          }
        ]
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
          "id": "6c1a995bee676fa7a019822a86247e169f6df432",
          "message": "fix: poly voice stealing clip (#313)\n\nfix poly voice stealing clip",
          "timestamp": "2026-06-18T09:11:34-04:00",
          "tree_id": "dacc49534911af557da61e440324f5e7dc0a8ee2",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/6c1a995bee676fa7a019822a86247e169f6df432"
        },
        "date": 1781788837280,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4470861,
            "range": "± 41342",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6263979,
            "range": "± 102408",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7424028,
            "range": "± 23899",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3579352,
            "range": "± 10784",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3593166,
            "range": "± 9774",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3594399,
            "range": "± 37524",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10251446,
            "range": "± 36853",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12921468,
            "range": "± 33167",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14721029,
            "range": "± 46549",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12767508,
            "range": "± 66458",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17291805,
            "range": "± 159353",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19438466,
            "range": "± 77063",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8341964,
            "range": "± 137962",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10420225,
            "range": "± 86306",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11715916,
            "range": "± 424915",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5484544,
            "range": "± 81542",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7215360,
            "range": "± 55158",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8371770,
            "range": "± 30778",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10817321,
            "range": "± 27868",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13983345,
            "range": "± 45752",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15222665,
            "range": "± 84219",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8235318,
            "range": "± 21930",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10771752,
            "range": "± 22388",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12474097,
            "range": "± 275457",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5282479,
            "range": "± 99482",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7535966,
            "range": "± 26496",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9076123,
            "range": "± 12882",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5376531,
            "range": "± 17659",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7873762,
            "range": "± 103317",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9735188,
            "range": "± 87291",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8932863,
            "range": "± 37127",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11656142,
            "range": "± 50467",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13295693,
            "range": "± 77098",
            "unit": "ns/iter"
          }
        ]
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
          "id": "8efbb1c2db120147af48e4658417b35a1a1467e7",
          "message": "fix: voice alloc not working on auv3 (#314)\n\nfix voice alloc not working on auv3",
          "timestamp": "2026-06-18T09:28:09-04:00",
          "tree_id": "29e5fecd2233e7d19a184a6206f4e7957e977d70",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/8efbb1c2db120147af48e4658417b35a1a1467e7"
        },
        "date": 1781789838905,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4538309,
            "range": "± 56689",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6498873,
            "range": "± 41940",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7766813,
            "range": "± 32187",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3591362,
            "range": "± 34122",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3596100,
            "range": "± 28474",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3613137,
            "range": "± 25838",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10626174,
            "range": "± 56928",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13732097,
            "range": "± 118661",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15854224,
            "range": "± 127279",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12826224,
            "range": "± 85230",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17635349,
            "range": "± 38813",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19969786,
            "range": "± 81383",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8630435,
            "range": "± 37983",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 11192840,
            "range": "± 81828",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12673537,
            "range": "± 41403",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5650506,
            "range": "± 44449",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7543486,
            "range": "± 26396",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8759883,
            "range": "± 35081",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11207220,
            "range": "± 116169",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14727238,
            "range": "± 50198",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 16050788,
            "range": "± 138804",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8635641,
            "range": "± 77579",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11513449,
            "range": "± 126649",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13524687,
            "range": "± 145437",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5518505,
            "range": "± 31615",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 8099575,
            "range": "± 39556",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9862737,
            "range": "± 52043",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5574362,
            "range": "± 76201",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7336400,
            "range": "± 35017",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9188265,
            "range": "± 26316",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8355623,
            "range": "± 48670",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11280007,
            "range": "± 114802",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12946238,
            "range": "± 56335",
            "unit": "ns/iter"
          }
        ]
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
          "id": "99509b1022d85b3c72674b9f60de145e97c87cec",
          "message": "fix: cut notes on preset change (#315)\n\ncut notes on preset change",
          "timestamp": "2026-06-18T13:32:57Z",
          "tree_id": "a56147258978a06dbe8eed6ab16846f628ba70d4",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/99509b1022d85b3c72674b9f60de145e97c87cec"
        },
        "date": 1781790131794,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4336829,
            "range": "± 102691",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6259139,
            "range": "± 50922",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7548369,
            "range": "± 54594",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3438963,
            "range": "± 21286",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3460894,
            "range": "± 13547",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3473808,
            "range": "± 25882",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10248892,
            "range": "± 43977",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13383757,
            "range": "± 54693",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15408231,
            "range": "± 231853",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12518048,
            "range": "± 63365",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17305688,
            "range": "± 33952",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19624050,
            "range": "± 235958",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8367789,
            "range": "± 27016",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10923310,
            "range": "± 203993",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12362798,
            "range": "± 47321",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5454173,
            "range": "± 21260",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7340284,
            "range": "± 213086",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8559648,
            "range": "± 31542",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10844600,
            "range": "± 37044",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14409681,
            "range": "± 73595",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15699809,
            "range": "± 137720",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8363794,
            "range": "± 26971",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11342664,
            "range": "± 32872",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13230420,
            "range": "± 33352",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5265230,
            "range": "± 87570",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7861270,
            "range": "± 74644",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9603519,
            "range": "± 35590",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5332215,
            "range": "± 26845",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8008651,
            "range": "± 84096",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9911172,
            "range": "± 24683",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9028811,
            "range": "± 26917",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12031349,
            "range": "± 35620",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13696703,
            "range": "± 36051",
            "unit": "ns/iter"
          }
        ]
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
          "id": "a04e409cd427899c83d32597864fa3ca9dfd2143",
          "message": "WIP: 6c1a995b fix: poly voice stealing clip (#313)",
          "timestamp": "2026-06-18T09:42:21-04:00",
          "tree_id": "0dc4b9e7efba88c8aa7fc128a460884fa2f8b444",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/a04e409cd427899c83d32597864fa3ca9dfd2143"
        },
        "date": 1781790702711,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4504154,
            "range": "± 56193",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6303482,
            "range": "± 62968",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7496834,
            "range": "± 159401",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3610877,
            "range": "± 22639",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3619971,
            "range": "± 13950",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3636965,
            "range": "± 20148",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10425085,
            "range": "± 45546",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13309422,
            "range": "± 89417",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15139163,
            "range": "± 220232",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12910306,
            "range": "± 71772",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17460378,
            "range": "± 123106",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19718526,
            "range": "± 85716",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8473348,
            "range": "± 90443",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10587267,
            "range": "± 48947",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11866691,
            "range": "± 178383",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5531389,
            "range": "± 60925",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7408129,
            "range": "± 290455",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8495142,
            "range": "± 61199",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10849572,
            "range": "± 33312",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14042096,
            "range": "± 62928",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15302857,
            "range": "± 434177",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8309498,
            "range": "± 57133",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10851246,
            "range": "± 285086",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12596995,
            "range": "± 89256",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5331826,
            "range": "± 49793",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7679551,
            "range": "± 61177",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9287907,
            "range": "± 199143",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5503324,
            "range": "± 32715",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8129107,
            "range": "± 73551",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10049045,
            "range": "± 177617",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9102568,
            "range": "± 299416",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11865755,
            "range": "± 238757",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13504879,
            "range": "± 153757",
            "unit": "ns/iter"
          }
        ]
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
          "id": "9f9aa511409259e39ccbcb4574566a13d0dd14f4",
          "message": "perf: add benchmarks for plugin and webview (#319)\n\n* perf: add benchmarks for plugin and webview\n\n* fix(ci): handle missing benchmark baselines\n\n* ci: split performance benchmark jobs\n\n* ci: install linux deps for plugin benchmarks\n\n* ci: recombine benchmark workflow",
          "timestamp": "2026-06-19T22:01:00-04:00",
          "tree_id": "5865f32583a365395815dfa86a1c3e9a36beb47a",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/9f9aa511409259e39ccbcb4574566a13d0dd14f4"
        },
        "date": 1781921411729,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4342319,
            "range": "± 24277",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6253790,
            "range": "± 104560",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7540726,
            "range": "± 24781",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3422494,
            "range": "± 20609",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3436623,
            "range": "± 10512",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3447435,
            "range": "± 8128",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10276839,
            "range": "± 50027",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13354991,
            "range": "± 143725",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15413886,
            "range": "± 55592",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12519616,
            "range": "± 65099",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17304095,
            "range": "± 80409",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19646214,
            "range": "± 314769",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8393149,
            "range": "± 96152",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10899679,
            "range": "± 34275",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12358191,
            "range": "± 29107",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5382072,
            "range": "± 25215",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7268729,
            "range": "± 67896",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8516912,
            "range": "± 142906",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10834753,
            "range": "± 87023",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14419240,
            "range": "± 241788",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15634977,
            "range": "± 89770",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8409387,
            "range": "± 30967",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11464755,
            "range": "± 360265",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13336641,
            "range": "± 391841",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5327442,
            "range": "± 36205",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7885053,
            "range": "± 74995",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9591463,
            "range": "± 57376",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5328034,
            "range": "± 42489",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8071504,
            "range": "± 45868",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10001374,
            "range": "± 253596",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9081351,
            "range": "± 52851",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11976090,
            "range": "± 88868",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13673289,
            "range": "± 52559",
            "unit": "ns/iter"
          }
        ]
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
          "id": "049d98bdef8b6275673ba145d85fd74cad6b41c3",
          "message": "Revert \"perf: add benchmarks for plugin and webview (#319)\"\n\nThis reverts commit 9f9aa511409259e39ccbcb4574566a13d0dd14f4.",
          "timestamp": "2026-06-20T09:04:44-04:00",
          "tree_id": "0dc4b9e7efba88c8aa7fc128a460884fa2f8b444",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/049d98bdef8b6275673ba145d85fd74cad6b41c3"
        },
        "date": 1781961229082,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4422330,
            "range": "± 71205",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6384843,
            "range": "± 52382",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7660872,
            "range": "± 297705",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3485218,
            "range": "± 46680",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3495433,
            "range": "± 27636",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3499270,
            "range": "± 28574",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10392838,
            "range": "± 75698",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13505374,
            "range": "± 62631",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15559673,
            "range": "± 261071",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12621519,
            "range": "± 68282",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17476332,
            "range": "± 198230",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19886893,
            "range": "± 78073",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8490487,
            "range": "± 99529",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10985805,
            "range": "± 115853",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12432191,
            "range": "± 62248",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5465468,
            "range": "± 49500",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7334573,
            "range": "± 28599",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8611942,
            "range": "± 142464",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10946783,
            "range": "± 169193",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14466583,
            "range": "± 230494",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15784323,
            "range": "± 67967",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8412727,
            "range": "± 67715",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11371895,
            "range": "± 52389",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13289461,
            "range": "± 283237",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5339478,
            "range": "± 41676",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7928384,
            "range": "± 125898",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9653734,
            "range": "± 44564",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5360376,
            "range": "± 43915",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8076704,
            "range": "± 109690",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9972573,
            "range": "± 169471",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9109031,
            "range": "± 121297",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12074048,
            "range": "± 288787",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13715372,
            "range": "± 71399",
            "unit": "ns/iter"
          }
        ]
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
          "id": "e558b729076aa21b6a339cee5c436310886b56a3",
          "message": "ci: add Rust tests job to CI pipeline (#317)\n\n* ci: add Rust tests job to CI pipeline\n\nAdd rust-tests job that runs cargo test for all workspace crates.\nPlugin crate uses --test-threads=1 to work around known\nvoice_limit_round_trips_through_save_load race condition.\n\n* fix tests\n\n* fix tests",
          "timestamp": "2026-06-20T13:17:43Z",
          "tree_id": "5271e5ae486559c352ffaa71d8ec10a6548a7632",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/e558b729076aa21b6a339cee5c436310886b56a3"
        },
        "date": 1781962013067,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4361752,
            "range": "± 47564",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6289673,
            "range": "± 107000",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7574783,
            "range": "± 33270",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3446098,
            "range": "± 12429",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3509258,
            "range": "± 12211",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3512132,
            "range": "± 10701",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10378345,
            "range": "± 384735",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13482645,
            "range": "± 50513",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15537209,
            "range": "± 89767",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12593693,
            "range": "± 48858",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17359878,
            "range": "± 76225",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19680153,
            "range": "± 49212",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8439846,
            "range": "± 29826",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10978569,
            "range": "± 50444",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12408824,
            "range": "± 57013",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5397001,
            "range": "± 15729",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7312296,
            "range": "± 34637",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8539960,
            "range": "± 35919",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10925760,
            "range": "± 48747",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14506671,
            "range": "± 55210",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15836689,
            "range": "± 169251",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8413520,
            "range": "± 34616",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11356319,
            "range": "± 36636",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13262444,
            "range": "± 46504",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5307434,
            "range": "± 26627",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7901032,
            "range": "± 27410",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9603557,
            "range": "± 28740",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5357187,
            "range": "± 18242",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8033028,
            "range": "± 104928",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9933092,
            "range": "± 131321",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9046589,
            "range": "± 40984",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12065482,
            "range": "± 42161",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13738343,
            "range": "± 47924",
            "unit": "ns/iter"
          }
        ]
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
      }
    ]
  }
}