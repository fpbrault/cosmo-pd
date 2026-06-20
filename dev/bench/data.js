window.BENCHMARK_DATA = {
  "lastUpdate": 1781963056764,
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
          "id": "ed049b554cdff682999f11fb50be34419ff652cb",
          "message": "feat: better plugin resizing (#308)\n\nimprove plugin resizing",
          "timestamp": "2026-06-16T15:53:00Z",
          "tree_id": "73b4636e9450df9c2764d2254295c63a6c717cd4",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/ed049b554cdff682999f11fb50be34419ff652cb"
        },
        "date": 1781625731510,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4324720,
            "range": "± 69403",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6256489,
            "range": "± 79544",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7554898,
            "range": "± 32014",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3435790,
            "range": "± 21090",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3430870,
            "range": "± 27793",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3446763,
            "range": "± 60980",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10306616,
            "range": "± 56855",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13451281,
            "range": "± 58734",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15410792,
            "range": "± 60246",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12475922,
            "range": "± 82992",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17155695,
            "range": "± 264292",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19610758,
            "range": "± 251363",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8392357,
            "range": "± 39292",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10941786,
            "range": "± 55478",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12405566,
            "range": "± 221993",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5458128,
            "range": "± 33441",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7355801,
            "range": "± 59578",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8589900,
            "range": "± 82909",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10977973,
            "range": "± 53981",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14424522,
            "range": "± 164733",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15725253,
            "range": "± 71137",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8420968,
            "range": "± 48614",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11471307,
            "range": "± 63147",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13333485,
            "range": "± 45779",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5268253,
            "range": "± 55356",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7876498,
            "range": "± 689300",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9688625,
            "range": "± 77889",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5308420,
            "range": "± 33384",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7974338,
            "range": "± 94605",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9867206,
            "range": "± 141707",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8970371,
            "range": "± 180654",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11947756,
            "range": "± 45911",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13603876,
            "range": "± 70334",
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
          "id": "0b86ab688d9bce409542f469ce04bf1743f0d7fc",
          "message": "feat: better auv3 scaling (#306)\n\n* improve scaling for auv3\n\n* remove feom girignore\n\n* chore(auv3): track staged webview assets",
          "timestamp": "2026-06-16T20:44:51Z",
          "tree_id": "68a4dda7b36068d5f7dd22a4b5db5fc8ccf3e174",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/0b86ab688d9bce409542f469ce04bf1743f0d7fc"
        },
        "date": 1781643261035,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3458549,
            "range": "± 47969",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4902955,
            "range": "± 104068",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5782158,
            "range": "± 63130",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2764966,
            "range": "± 42448",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2770252,
            "range": "± 5566",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2767524,
            "range": "± 5996",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 8070143,
            "range": "± 151902",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10122854,
            "range": "± 165978",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 11580424,
            "range": "± 275880",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 9990620,
            "range": "± 142816",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 13470790,
            "range": "± 160027",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 15223570,
            "range": "± 177514",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6617481,
            "range": "± 143000",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8306543,
            "range": "± 162052",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9392527,
            "range": "± 171372",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4275893,
            "range": "± 113722",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5604603,
            "range": "± 32744",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6534860,
            "range": "± 49656",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8612524,
            "range": "± 138467",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 11068866,
            "range": "± 170533",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 12065299,
            "range": "± 166897",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6646807,
            "range": "± 147262",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 8549721,
            "range": "± 172766",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 8858336,
            "range": "± 191864",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3089468,
            "range": "± 36211",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 4817512,
            "range": "± 70729",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6045191,
            "range": "± 90914",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3147530,
            "range": "± 14248",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5162206,
            "range": "± 28182",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6550919,
            "range": "± 33926",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 6145689,
            "range": "± 154400",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 8192841,
            "range": "± 169962",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 9519039,
            "range": "± 183013",
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
          "id": "f3b01e12b57c46a9ca3095462f33bd6e9d4c44cc",
          "message": "fix(auv3): gate webview script dispatch during resume (#309)",
          "timestamp": "2026-06-17T15:07:32-04:00",
          "tree_id": "f1e66d460a607bf54a46a9a8b02401a1890dd6f1",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/f3b01e12b57c46a9ca3095462f33bd6e9d4c44cc"
        },
        "date": 1781723835959,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4343133,
            "range": "± 40928",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6274944,
            "range": "± 18139",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7578238,
            "range": "± 25214",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3428131,
            "range": "± 11562",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3442354,
            "range": "± 9634",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3453208,
            "range": "± 39417",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10216126,
            "range": "± 34494",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13332101,
            "range": "± 39234",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15400199,
            "range": "± 41934",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12429711,
            "range": "± 30679",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17221586,
            "range": "± 168957",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19557797,
            "range": "± 38188",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8343001,
            "range": "± 24199",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10812631,
            "range": "± 257053",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12256081,
            "range": "± 91568",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5391799,
            "range": "± 47881",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7254634,
            "range": "± 38671",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8505403,
            "range": "± 29026",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10798138,
            "range": "± 36260",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14297925,
            "range": "± 37717",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15618801,
            "range": "± 70466",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8424066,
            "range": "± 56736",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11387024,
            "range": "± 239571",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13338794,
            "range": "± 82835",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5319441,
            "range": "± 49585",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7855190,
            "range": "± 42614",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9551088,
            "range": "± 30939",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5302413,
            "range": "± 25577",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7991893,
            "range": "± 29386",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9856893,
            "range": "± 28872",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8998142,
            "range": "± 206737",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11944674,
            "range": "± 76710",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13636233,
            "range": "± 66881",
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
          "id": "f3b01e12b57c46a9ca3095462f33bd6e9d4c44cc",
          "message": "fix(auv3): gate webview script dispatch during resume (#309)",
          "timestamp": "2026-06-17T15:07:32-04:00",
          "tree_id": "f1e66d460a607bf54a46a9a8b02401a1890dd6f1",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/f3b01e12b57c46a9ca3095462f33bd6e9d4c44cc"
        },
        "date": 1781724788027,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4328945,
            "range": "± 115521",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6247324,
            "range": "± 134569",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7544325,
            "range": "± 41663",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3402993,
            "range": "± 12170",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3424111,
            "range": "± 8550",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3434676,
            "range": "± 15875",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10286261,
            "range": "± 27399",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13386137,
            "range": "± 61955",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15434037,
            "range": "± 43760",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12503204,
            "range": "± 56833",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17271036,
            "range": "± 69497",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19653914,
            "range": "± 56598",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8309945,
            "range": "± 29696",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10838609,
            "range": "± 28028",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12283555,
            "range": "± 32259",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5374245,
            "range": "± 27765",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7251943,
            "range": "± 22133",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8501350,
            "range": "± 55228",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10823131,
            "range": "± 42451",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14297926,
            "range": "± 206557",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15567558,
            "range": "± 52979",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8317627,
            "range": "± 17722",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11297245,
            "range": "± 29624",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13234023,
            "range": "± 36892",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5238072,
            "range": "± 19453",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7841204,
            "range": "± 18384",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9541613,
            "range": "± 29971",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5289521,
            "range": "± 14828",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7946124,
            "range": "± 28123",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9855484,
            "range": "± 24527",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8955445,
            "range": "± 24161",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11886286,
            "range": "± 44205",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13565186,
            "range": "± 250983",
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
          "id": "c906689f2b634e0e1615eb3d0538eadeca5a2635",
          "message": "feat: resize auv3 on ios dynamically (#311)\n\n* fix ipad scaling\n\n* center full screen\n\n* fix sizing\n\n* fix auv3 for host\n\n* simpler\n\n* update stuff\n\n* chore(auv3): stop tracking generated extension assets\n\n* revert scaling\n\n* auto build xcframework when needed",
          "timestamp": "2026-06-17T21:30:05-04:00",
          "tree_id": "8f491602a5bf4766fae4241176fcb81d391ac11b",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/c906689f2b634e0e1615eb3d0538eadeca5a2635"
        },
        "date": 1781746751797,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4370565,
            "range": "± 40355",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6305656,
            "range": "± 130864",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7636401,
            "range": "± 36212",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3437454,
            "range": "± 13042",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3471082,
            "range": "± 32700",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3469473,
            "range": "± 24697",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10459123,
            "range": "± 67467",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13555978,
            "range": "± 74892",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15600513,
            "range": "± 207776",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12631204,
            "range": "± 55500",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17514196,
            "range": "± 62192",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19942963,
            "range": "± 62689",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8497990,
            "range": "± 48933",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 11051200,
            "range": "± 95216",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12510375,
            "range": "± 58845",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5520826,
            "range": "± 33947",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7402399,
            "range": "± 68205",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8590220,
            "range": "± 85927",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10942119,
            "range": "± 344613",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14462993,
            "range": "± 56313",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15755778,
            "range": "± 39979",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8453330,
            "range": "± 33013",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11447945,
            "range": "± 117549",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13394653,
            "range": "± 40040",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5353348,
            "range": "± 81044",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7966745,
            "range": "± 52080",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9759575,
            "range": "± 49238",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5360693,
            "range": "± 53677",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8055841,
            "range": "± 87112",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9958207,
            "range": "± 60034",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9093707,
            "range": "± 58731",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12074116,
            "range": "± 43100",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13816303,
            "range": "± 80277",
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
      }
    ]
  }
}