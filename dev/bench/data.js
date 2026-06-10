window.BENCHMARK_DATA = {
  "lastUpdate": 1781127784368,
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
      }
    ]
  }
}