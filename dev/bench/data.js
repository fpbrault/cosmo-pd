window.BENCHMARK_DATA = {
  "lastUpdate": 1781122576551,
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
          "id": "6c9fcbbdca40378731b6a434b3d3a3afdbccac5b",
          "message": "refactor: rename CZ101 to Classic in various files for consistency",
          "timestamp": "2026-06-09T08:58:05-04:00",
          "tree_id": "6c3d8927d8d448de7fa95505fae449bd15840188",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/6c9fcbbdca40378731b6a434b3d3a3afdbccac5b"
        },
        "date": 1781010444481,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4347504,
            "range": "± 24531",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5971923,
            "range": "± 31939",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7165669,
            "range": "± 37678",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3417054,
            "range": "± 35608",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3443691,
            "range": "± 22308",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3445630,
            "range": "± 22874",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9507388,
            "range": "± 50212",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12154261,
            "range": "± 49882",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13932957,
            "range": "± 126286",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11385304,
            "range": "± 46731",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 15998661,
            "range": "± 56988",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18826422,
            "range": "± 89991",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7502014,
            "range": "± 89274",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9685211,
            "range": "± 68844",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10947414,
            "range": "± 52915",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5385788,
            "range": "± 68088",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 6974854,
            "range": "± 47889",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8127249,
            "range": "± 40152",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9881723,
            "range": "± 59641",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13143069,
            "range": "± 66640",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14477013,
            "range": "± 256450",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7340573,
            "range": "± 52202",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9859102,
            "range": "± 58689",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11498316,
            "range": "± 52999",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5041469,
            "range": "± 44366",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7361758,
            "range": "± 52379",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8886959,
            "range": "± 59623",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4871953,
            "range": "± 17956",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 6882870,
            "range": "± 56769",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 8289700,
            "range": "± 55069",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8060961,
            "range": "± 107972",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10615808,
            "range": "± 52609",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12058197,
            "range": "± 161863",
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
          "id": "251086683b44673e2c0bc5225fa2c1be0992550f",
          "message": "fix: set default volume to 1.0 for cz presets (#281)",
          "timestamp": "2026-06-09T13:20:06Z",
          "tree_id": "7ef0e6cd904d1943b0a2253681ab33245325c377",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/251086683b44673e2c0bc5225fa2c1be0992550f"
        },
        "date": 1781011762880,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4181433,
            "range": "± 34955",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6010988,
            "range": "± 114704",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7217293,
            "range": "± 36449",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3246598,
            "range": "± 14300",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3268423,
            "range": "± 89264",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3262171,
            "range": "± 44308",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9514913,
            "range": "± 215179",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12739737,
            "range": "± 40455",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14862012,
            "range": "± 73869",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11270370,
            "range": "± 41792",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16215228,
            "range": "± 64973",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19004591,
            "range": "± 62697",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7664743,
            "range": "± 70856",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10259975,
            "range": "± 80797",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11767789,
            "range": "± 65455",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5352587,
            "range": "± 85654",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7107943,
            "range": "± 133204",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8272213,
            "range": "± 48635",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10110866,
            "range": "± 130567",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13708037,
            "range": "± 55633",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15080807,
            "range": "± 121097",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7637014,
            "range": "± 58191",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10498972,
            "range": "± 50301",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12393925,
            "range": "± 95215",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5203880,
            "range": "± 30140",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7799732,
            "range": "± 47717",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9538635,
            "range": "± 37408",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4657809,
            "range": "± 40179",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 6716562,
            "range": "± 56651",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 8094010,
            "range": "± 42686",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8265781,
            "range": "± 50167",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11257911,
            "range": "± 68273",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12976200,
            "range": "± 63470",
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
          "id": "6b1c4c51ca3d04ca44a503fd9256c0f4dab63a21",
          "message": "refactor: phase line algorithms and envelope handling (#282)\n\n* Refactor phase line algorithms and envelope handling\n\n- Removed `usePerLineWarp.ts` and replaced its functionality with `usePhaseLineAlgorithms.ts`, `usePhaseLineEnvelopeMarkers.ts`, and `usePhaseLineModel.ts`.\n- Introduced new hooks to manage phase line algorithms and envelope markers, improving code organization and readability.\n- Updated the logic for handling algorithm changes and envelope markers to enhance performance and maintainability.\n- Ensured compatibility with existing synth parameters and control bindings.\n\n* refactor: improve layout and responsiveness of algorithm controls and display components\n\n* refactor: enhance layout and responsiveness of various components",
          "timestamp": "2026-06-09T15:50:06Z",
          "tree_id": "b610fa9c153c791fe54eea84b616cb2900072a7c",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/6b1c4c51ca3d04ca44a503fd9256c0f4dab63a21"
        },
        "date": 1781020760341,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4149154,
            "range": "± 24594",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 5973308,
            "range": "± 105558",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7178363,
            "range": "± 51659",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3226956,
            "range": "± 7952",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3241836,
            "range": "± 14363",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3250564,
            "range": "± 12286",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9470733,
            "range": "± 25199",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12705243,
            "range": "± 27261",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14855348,
            "range": "± 89163",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11237869,
            "range": "± 49121",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16182061,
            "range": "± 108537",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18969872,
            "range": "± 55896",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7576637,
            "range": "± 29170",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10110947,
            "range": "± 32703",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11588653,
            "range": "± 105792",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5277369,
            "range": "± 17234",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7034448,
            "range": "± 26078",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8233852,
            "range": "± 35899",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10057936,
            "range": "± 135713",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13628265,
            "range": "± 33884",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15002425,
            "range": "± 41066",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7569115,
            "range": "± 18605",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10454649,
            "range": "± 40244",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12376885,
            "range": "± 36882",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5193430,
            "range": "± 25362",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7799149,
            "range": "± 26701",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9534664,
            "range": "± 30629",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 4639231,
            "range": "± 22408",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 6673069,
            "range": "± 17047",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 8038494,
            "range": "± 23019",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8206472,
            "range": "± 44894",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11214457,
            "range": "± 37698",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12907664,
            "range": "± 65017",
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
          "id": "b0e802d1aedf6788742156873c966b4c7e6dbba5",
          "message": "fix: make rust defaults apply everywhere (#283)\n\n* Refactor phase line algorithms and envelope handling\n\n- Removed `usePerLineWarp.ts` and replaced its functionality with `usePhaseLineAlgorithms.ts`, `usePhaseLineEnvelopeMarkers.ts`, and `usePhaseLineModel.ts`.\n- Introduced new hooks to manage phase line algorithms and envelope markers, improving code organization and readability.\n- Updated the logic for handling algorithm changes and envelope markers to enhance performance and maintainability.\n- Ensured compatibility with existing synth parameters and control bindings.\n\n* refactor: improve layout and responsiveness of algorithm controls and display components\n\n* refactor: enhance layout and responsiveness of various components\n\n* fix tests\n\n* fix: apply rust engine defaults everywhere\n\n* fix: update default algorithms to 'saw' in synth parameters",
          "timestamp": "2026-06-09T20:43:00-04:00",
          "tree_id": "bbb331a052e6d8352b5489040fe428260af63792",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/b0e802d1aedf6788742156873c966b4c7e6dbba5"
        },
        "date": 1781052731550,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4285813,
            "range": "± 57050",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6055910,
            "range": "± 20591",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7331795,
            "range": "± 40746",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3371742,
            "range": "± 9277",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3366262,
            "range": "± 8801",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3368679,
            "range": "± 16374",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9233230,
            "range": "± 38078",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 11910429,
            "range": "± 27770",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13767499,
            "range": "± 32773",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11656097,
            "range": "± 29627",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16220887,
            "range": "± 35414",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18623099,
            "range": "± 206698",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7420026,
            "range": "± 19519",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9584702,
            "range": "± 109060",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 10903045,
            "range": "± 20743",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5376484,
            "range": "± 14881",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7089416,
            "range": "± 29124",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8344117,
            "range": "± 19358",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 9964965,
            "range": "± 57301",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13139864,
            "range": "± 34058",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14462875,
            "range": "± 26681",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7367485,
            "range": "± 38688",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9847774,
            "range": "± 22334",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11579140,
            "range": "± 15529",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5109880,
            "range": "± 19262",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7398061,
            "range": "± 28458",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 8988518,
            "range": "± 16162",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5193339,
            "range": "± 16080",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7757149,
            "range": "± 17309",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9636023,
            "range": "± 12629",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8015590,
            "range": "± 32520",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10687821,
            "range": "± 18995",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12451547,
            "range": "± 29858",
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
          "id": "2081e7d558d0d3e14367418445302ba0fd5dc872",
          "message": "feat: improve responsive layout (#284)\n\n* improve responsive layout\n\n* wasm build",
          "timestamp": "2026-06-10T01:02:32Z",
          "tree_id": "995040b2c215b72db3930ec296eee84e58fb0e0a",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/2081e7d558d0d3e14367418445302ba0fd5dc872"
        },
        "date": 1781053905440,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4240994,
            "range": "± 48998",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6135750,
            "range": "± 163753",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7420527,
            "range": "± 35819",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3358309,
            "range": "± 11671",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3383492,
            "range": "± 13474",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3395713,
            "range": "± 16213",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9552811,
            "range": "± 71609",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12793697,
            "range": "± 41953",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14953678,
            "range": "± 60815",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11791784,
            "range": "± 54520",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16712169,
            "range": "± 81408",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19094657,
            "range": "± 175500",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7629999,
            "range": "± 42601",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10217873,
            "range": "± 80742",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11694344,
            "range": "± 42618",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5504443,
            "range": "± 71092",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7358924,
            "range": "± 46944",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8601433,
            "range": "± 29885",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10131105,
            "range": "± 41897",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13695738,
            "range": "± 66082",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15013154,
            "range": "± 75778",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7646329,
            "range": "± 29395",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10638767,
            "range": "± 48949",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12646064,
            "range": "± 95251",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5256098,
            "range": "± 63233",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7909989,
            "range": "± 26208",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9729907,
            "range": "± 41020",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5277259,
            "range": "± 35779",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8015767,
            "range": "± 120652",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9872379,
            "range": "± 58092",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8283721,
            "range": "± 30907",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11268212,
            "range": "± 26576",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12990248,
            "range": "± 94005",
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
          "id": "2b5264a80e1177cdb5b39ebc3e7a032ee5bf7bb4",
          "message": "fix macro knobs",
          "timestamp": "2026-06-09T21:35:31-04:00",
          "tree_id": "874c2c2133ed914c9f2c99a9565189dce7c36363",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/2b5264a80e1177cdb5b39ebc3e7a032ee5bf7bb4"
        },
        "date": 1781055891833,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4319314,
            "range": "± 50609",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6110523,
            "range": "± 76606",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7391760,
            "range": "± 55921",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3366955,
            "range": "± 24760",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3402948,
            "range": "± 16713",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3407225,
            "range": "± 24671",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 9374150,
            "range": "± 59175",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12050069,
            "range": "± 45771",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 13904613,
            "range": "± 42339",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 11764498,
            "range": "± 86475",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 16321997,
            "range": "± 52657",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 18574551,
            "range": "± 295894",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 7506377,
            "range": "± 77939",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 9698637,
            "range": "± 360266",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11023583,
            "range": "± 206193",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5446382,
            "range": "± 73341",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7186210,
            "range": "± 55777",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8421208,
            "range": "± 59270",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10093000,
            "range": "± 49601",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13253145,
            "range": "± 45811",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 14609800,
            "range": "± 58512",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 7455698,
            "range": "± 37472",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 9981124,
            "range": "± 124373",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 11727018,
            "range": "± 79594",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5144521,
            "range": "± 44017",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7427011,
            "range": "± 46359",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9038455,
            "range": "± 98378",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5215613,
            "range": "± 24455",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7797048,
            "range": "± 47199",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9687718,
            "range": "± 64885",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8145891,
            "range": "± 177725",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 10789879,
            "range": "± 449316",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 12569843,
            "range": "± 98197",
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
      }
    ]
  }
}