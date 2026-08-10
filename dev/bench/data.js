window.BENCHMARK_DATA = {
  "lastUpdate": 1786371330290,
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
          "id": "49ce5384770a7707772639d3b7c40798df6f6faa",
          "message": "fix: centered livepage",
          "timestamp": "2026-07-01T15:16:22-04:00",
          "tree_id": "10a5f5e722714504f3a8ebc05e25e4a3e343466e",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/49ce5384770a7707772639d3b7c40798df6f6faa"
        },
        "date": 1782933929556,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4480492,
            "range": "± 26039",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6225010,
            "range": "± 284427",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7356714,
            "range": "± 56842",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3592551,
            "range": "± 31193",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3611253,
            "range": "± 16412",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3590277,
            "range": "± 88061",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10381655,
            "range": "± 129467",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13119725,
            "range": "± 44135",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14914392,
            "range": "± 40893",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12787048,
            "range": "± 32893",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17336159,
            "range": "± 175318",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19568651,
            "range": "± 81484",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8359984,
            "range": "± 35111",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10506504,
            "range": "± 47917",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11788385,
            "range": "± 154786",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5591038,
            "range": "± 52052",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7277335,
            "range": "± 42384",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8339392,
            "range": "± 151800",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10920393,
            "range": "± 33080",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14051939,
            "range": "± 58202",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15268355,
            "range": "± 38676",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8305038,
            "range": "± 64308",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10825758,
            "range": "± 66914",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12488736,
            "range": "± 40781",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5316176,
            "range": "± 57378",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7545465,
            "range": "± 76928",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9137969,
            "range": "± 49434",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5439356,
            "range": "± 39791",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7971170,
            "range": "± 181991",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9815013,
            "range": "± 35117",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9266420,
            "range": "± 30038",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12039542,
            "range": "± 23868",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13810323,
            "range": "± 201782",
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
          "id": "32ca88532d3ebf7e7a691794b59822fbd7f62a13",
          "message": "fix: unique keys on mod matrix panel",
          "timestamp": "2026-07-01T15:17:14-04:00",
          "tree_id": "38f6bc08aba6ec857359edc608721f76c9c25b37",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/32ca88532d3ebf7e7a691794b59822fbd7f62a13"
        },
        "date": 1782933984710,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4393272,
            "range": "± 57934",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6345916,
            "range": "± 38074",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7655172,
            "range": "± 130047",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3495827,
            "range": "± 15324",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3489642,
            "range": "± 27716",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3509562,
            "range": "± 10508",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10472377,
            "range": "± 130768",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13629068,
            "range": "± 245861",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15765970,
            "range": "± 53159",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12677518,
            "range": "± 35189",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17537108,
            "range": "± 32963",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19928721,
            "range": "± 33158",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8448490,
            "range": "± 30101",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10959006,
            "range": "± 105647",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12388459,
            "range": "± 53885",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5471326,
            "range": "± 27324",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7384171,
            "range": "± 54561",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8630923,
            "range": "± 44887",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11058324,
            "range": "± 30096",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14641082,
            "range": "± 141157",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 16000709,
            "range": "± 46690",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8506743,
            "range": "± 21045",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11501392,
            "range": "± 22201",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13450422,
            "range": "± 30832",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5435698,
            "range": "± 20472",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 8059636,
            "range": "± 68156",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9799673,
            "range": "± 36206",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5419005,
            "range": "± 25709",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8140196,
            "range": "± 32223",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10095657,
            "range": "± 24715",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9251527,
            "range": "± 24678",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12273333,
            "range": "± 57352",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13998324,
            "range": "± 52705",
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
          "id": "8eb1ffdbd8c2cab4b24bc7694913e03973d9e23a",
          "message": "fix: resume state on auv3 (#334)\n\n* feat: update UI components to use clear backgrounds and improve error handling\n\n* feat: Add standalone app settings support for AUv3 plugin\n\n- Implemented configuration for standalone AUv3 view controller to support app settings.\n- Added scene phase handling in AudioUnitHostModel to manage background execution.\n- Introduced Info.plist for macOS extension to declare audio background mode.\n- Created StandaloneAppSettings for managing MIDI channel, background execution, and buffer size.\n- Developed Auv3StandaloneSettingsSection component for UI settings management.\n- Enhanced webview communication for standalone settings retrieval and updates.\n- Updated SynthInfoBar and KeyboardSettingsPopover to accommodate new settings.\n- Added tests to ensure proper behavior of plugin bridge with AUv3 host state changes.\n\n* fix resume state\n\n* feat: enhance AUv3 support and improve webview integration\n\n- Updated .gitignore to include daemon runtime artifacts.\n- Removed obsolete daemon.pid file.\n- Modified SimplePlayEngine.swift to configure standalone AUv3 view controller.\n- Changed ViewControllerRepresentable.swift to make configureStandaloneAuv3ViewController public.\n- Adjusted CosmoPD101AUv3Ext_macOSExtensionAudioUnit.swift to support a maximum frame count of 1024 and improved state handling.\n- Enhanced AudioUnitViewController.swift to manage web content reloads and host context changes more effectively.\n- Added tests in auv3BridgeContract.test.ts to verify new AUv3 features and settings.\n- Updated PluginPage.tsx to handle host context changes and display standalone app settings.\n- Improved auv3Bridge.ts to suppress nonessential polling RPCs when the AUv3 host is inactive.\n\n* feat: implement binary scope frame encoding and decoding, enhance AUv3 scope transport\n\n* feat: enhance AUv3 webview handling with reload policy and state management\n\n* feat: Implement WebEditorSession for enhanced web view management\n\n- Added WebEditorSession.swift to manage web view lifecycle and communication.\n- Introduced WebEditorHostContext to encapsulate runtime and fit modes.\n- Enhanced WebViewScriptDispatcher to handle IPC responses and manage pending messages.\n- Updated tests to cover new IPC response handling and lifecycle management.\n- Modified auv3Bridge.ts to improve visibility lifecycle and scope polling behavior.\n- Ensured proper integration of standalone app settings and context publishing in the web view.\n\n* fix typo\n\n* fix(auv3): stabilize telemetry demand tracking\n\n* refactor(auv3): move standalone settings out of fixes branch\n\n* lint",
          "timestamp": "2026-07-07T12:32:42Z",
          "tree_id": "f5d7a8ead7335a40053f0f72f8ceff9d50d86bd8",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/8eb1ffdbd8c2cab4b24bc7694913e03973d9e23a"
        },
        "date": 1783428106744,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4530067,
            "range": "± 115129",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6260894,
            "range": "± 58392",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7364250,
            "range": "± 139907",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3595858,
            "range": "± 29150",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3594915,
            "range": "± 28057",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3614859,
            "range": "± 20874",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10207633,
            "range": "± 23997",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12913400,
            "range": "± 121854",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14746174,
            "range": "± 41017",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12761025,
            "range": "± 145429",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17208874,
            "range": "± 26513",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19467969,
            "range": "± 24372",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8304339,
            "range": "± 40728",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10397146,
            "range": "± 29095",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11698630,
            "range": "± 33491",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5505170,
            "range": "± 31052",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7204611,
            "range": "± 31239",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8307390,
            "range": "± 22446",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10794090,
            "range": "± 37187",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 13939783,
            "range": "± 38581",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15167778,
            "range": "± 52773",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8245591,
            "range": "± 28606",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10731631,
            "range": "± 28620",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12426447,
            "range": "± 146541",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5311975,
            "range": "± 14794",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7493779,
            "range": "± 27339",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9051379,
            "range": "± 27852",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5425348,
            "range": "± 19535",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7865848,
            "range": "± 19716",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9694611,
            "range": "± 13416",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8916976,
            "range": "± 16551",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11671710,
            "range": "± 21339",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13311191,
            "range": "± 35743",
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
          "id": "2984356f2bc5a1198dcf08c35533b9ca51e7c4e2",
          "message": "feat(auv3): add standalone app settings (#337)",
          "timestamp": "2026-07-07T08:55:22-04:00",
          "tree_id": "195e51020e6234d2a4dc68dfac1bfe5e6eccb01a",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/2984356f2bc5a1198dcf08c35533b9ca51e7c4e2"
        },
        "date": 1783429486423,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 3487925,
            "range": "± 24671",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 4838698,
            "range": "± 19521",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 5713356,
            "range": "± 33163",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 2777435,
            "range": "± 19229",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 2775413,
            "range": "± 11420",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 2773654,
            "range": "± 11743",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 7942523,
            "range": "± 32747",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 10041273,
            "range": "± 25045",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 11485453,
            "range": "± 19284",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 9864532,
            "range": "± 18602",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 13331971,
            "range": "± 41725",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 15086167,
            "range": "± 40384",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 6495402,
            "range": "± 85932",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 8135983,
            "range": "± 26775",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 9161557,
            "range": "± 37053",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 4257770,
            "range": "± 27515",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 5610711,
            "range": "± 14652",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 6454376,
            "range": "± 18980",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 8581173,
            "range": "± 20437",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 11052776,
            "range": "± 22385",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 12009665,
            "range": "± 32358",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 6496339,
            "range": "± 20946",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 7374543,
            "range": "± 69250",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 8676024,
            "range": "± 26739",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 3159094,
            "range": "± 24603",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 4836660,
            "range": "± 39992",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 6021105,
            "range": "± 26602",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 3192601,
            "range": "± 17165",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 5173914,
            "range": "± 12907",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 6545649,
            "range": "± 19912",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 5996233,
            "range": "± 30760",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 8084257,
            "range": "± 22139",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 9314218,
            "range": "± 22492",
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
          "id": "6f917d760693a19ee921ad4d728fed00d5431a5d",
          "message": "feat: update truce dependencies (#338)\n\n* feat(auv3): add standalone app settings\n\n* feat: update truce dependencies and enhance CzPluginParams with shared state management\n\n* feat: enhance audio unit connection logic and add tests for teardown behavior",
          "timestamp": "2026-07-08T15:18:38Z",
          "tree_id": "73cb7348d473642ac19997d0fc211c2d39341850",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/6f917d760693a19ee921ad4d728fed00d5431a5d"
        },
        "date": 1783524470451,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4339526,
            "range": "± 62002",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6296907,
            "range": "± 32410",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7606850,
            "range": "± 47446",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3464443,
            "range": "± 25073",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3482012,
            "range": "± 10544",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3499413,
            "range": "± 16394",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10380017,
            "range": "± 220988",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13465483,
            "range": "± 56512",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15558322,
            "range": "± 205302",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12545826,
            "range": "± 102001",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17283977,
            "range": "± 87149",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19609255,
            "range": "± 56424",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8390125,
            "range": "± 34599",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10848411,
            "range": "± 81225",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12343130,
            "range": "± 146476",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5434352,
            "range": "± 47299",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7347453,
            "range": "± 28637",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8613808,
            "range": "± 106092",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10943911,
            "range": "± 160723",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14446832,
            "range": "± 51503",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15744931,
            "range": "± 154522",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8385636,
            "range": "± 51147",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11328866,
            "range": "± 126575",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13267940,
            "range": "± 34245",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5242400,
            "range": "± 16858",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7810542,
            "range": "± 57043",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9535288,
            "range": "± 209657",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5339030,
            "range": "± 61589",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8011838,
            "range": "± 73843",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9942251,
            "range": "± 32136",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9041905,
            "range": "± 128084",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11955050,
            "range": "± 42201",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13619018,
            "range": "± 41810",
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
          "id": "0003be2d34acb2c72b54c6a078553a7e6a1bc114",
          "message": "feat: enhance audio engine with concurrency support and state management (#339)\n\n- Added new status codes for queue full and concurrent render in CosmoPd101FfiStatus.\n- Introduced engine retain functionality to manage engine lifecycle without locking during render.\n- Updated AudioUnitViewController to apply standalone app settings asynchronously.\n- Implemented command queue in the Rust FFI for handling audio engine commands.\n- Enhanced rendering functions to prevent concurrent access and ensure thread safety.\n- Updated tests to validate engine retention and concurrent command execution.\n- Modified runtime voice debug state handling to improve performance and memory management.\n- Updated WASM binaries for the synth engine.",
          "timestamp": "2026-07-09T14:23:08Z",
          "tree_id": "d777f3d64bde4d5bca4bdb0fa2528eb75db49066",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/0003be2d34acb2c72b54c6a078553a7e6a1bc114"
        },
        "date": 1783607534251,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4364232,
            "range": "± 104403",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6303507,
            "range": "± 331224",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7613807,
            "range": "± 88178",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3444475,
            "range": "± 20080",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3458826,
            "range": "± 79524",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3467853,
            "range": "± 20634",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10579479,
            "range": "± 59803",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13763856,
            "range": "± 188965",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15842774,
            "range": "± 48808",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12722943,
            "range": "± 40000",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17588519,
            "range": "± 55969",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19933250,
            "range": "± 41672",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8508438,
            "range": "± 87382",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 11047208,
            "range": "± 68651",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12576628,
            "range": "± 60306",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5526047,
            "range": "± 66315",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7443590,
            "range": "± 76163",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8720099,
            "range": "± 43612",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11090492,
            "range": "± 51734",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14725724,
            "range": "± 266103",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 16095188,
            "range": "± 88980",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8535161,
            "range": "± 63950",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11552756,
            "range": "± 162313",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13529260,
            "range": "± 100580",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5403671,
            "range": "± 23141",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 8067414,
            "range": "± 103762",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9857278,
            "range": "± 33724",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5376685,
            "range": "± 124504",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8090830,
            "range": "± 31305",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9997174,
            "range": "± 145724",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9171399,
            "range": "± 125684",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12197976,
            "range": "± 192276",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13919872,
            "range": "± 77668",
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
          "id": "56c1215c11feb09df0c385f4ba9b2af431a6fbac",
          "message": "feat: update to truce 6 (#341)\n\n* Update dependencies and refactor plugin state management\n\n- Updated `truce` dependencies in `Cargo.toml` to a newer commit.\n- Refactored `CzPlugin` to separate DSP state management into `CzPluginDspState`.\n- Introduced `publish_state_snapshot` to handle state serialization and publishing.\n- Enhanced parameter synchronization methods to accept `CzPluginParams`.\n- Added tests for state snapshot functionality and ensured proper state restoration.\n- Improved handling of audio runtime parameters and UI event processing.\n- Updated `truce.toml` with new AUv2 and AUv3 names for the plugin.\n\n* feat: refactor session state management to use ArcSwap for improved concurrency\n\n* chore: update @biomejs/biome to version 2.5.4 in package.json and bun.lock\n\n* lint",
          "timestamp": "2026-07-19T15:54:12Z",
          "tree_id": "f1f40a9ddb15a8fd12ed934731ac0e65a675b4aa",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/56c1215c11feb09df0c385f4ba9b2af431a6fbac"
        },
        "date": 1784476997135,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4610797,
            "range": "± 115888",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6423996,
            "range": "± 57229",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7636451,
            "range": "± 66341",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3628795,
            "range": "± 103638",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3642728,
            "range": "± 47778",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3651777,
            "range": "± 50237",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10557986,
            "range": "± 258558",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13277766,
            "range": "± 51031",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15073594,
            "range": "± 51375",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12802588,
            "range": "± 187218",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17378474,
            "range": "± 57505",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19645535,
            "range": "± 71936",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8388235,
            "range": "± 25839",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10587825,
            "range": "± 132578",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11943149,
            "range": "± 114147",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5727152,
            "range": "± 56666",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7508851,
            "range": "± 114023",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8795188,
            "range": "± 114397",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10922156,
            "range": "± 60223",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14117702,
            "range": "± 81812",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15392213,
            "range": "± 351183",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8350584,
            "range": "± 49562",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11006924,
            "range": "± 57985",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12789019,
            "range": "± 323432",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5405841,
            "range": "± 52753",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7680562,
            "range": "± 58761",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9303539,
            "range": "± 66177",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5560119,
            "range": "± 76977",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8078105,
            "range": "± 57563",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10056204,
            "range": "± 53026",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9198473,
            "range": "± 58898",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11885736,
            "range": "± 169175",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13667809,
            "range": "± 55063",
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
          "id": "79d3e966e11449ffe510efac92c1aec70d395bc6",
          "message": "feat: update to truce 6.3 (#342)\n\n* Update dependencies and enhance state management in cosmo-pd101-plugin\n\n- Updated `truce` dependencies in Cargo.toml to a newer revision for improved functionality.\n- Modified the validation command in package.json to include the `--clap` flag for stricter validation.\n- Refactored state management in plugin.rs to separate state snapshot publishing and improve version tracking.\n- Added a new `snapshot_version` method to retrieve the current snapshot generation.\n- Enhanced tests in tests.rs to verify state snapshot generation and ensure consistency after state loads.\n- Updated runtime_state.rs to reflect changes in state snapshot versioning.\n- Adjusted JavaScript bindings in cosmo_synth_engine.js for better compatibility with the updated WASM.\n- Updated binary files for cosmo_synth_engine_bg.wasm to reflect changes in the build.\n\n* test(plugin): verify unchanged blocks retain snapshot generation",
          "timestamp": "2026-07-20T02:58:20Z",
          "tree_id": "ce131894dabd9e848134500d0a3f773e0b81cbf3",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/79d3e966e11449ffe510efac92c1aec70d395bc6"
        },
        "date": 1784516849768,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4386112,
            "range": "± 108692",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6380253,
            "range": "± 48300",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7739886,
            "range": "± 41559",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3477631,
            "range": "± 29772",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3490821,
            "range": "± 48080",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3507275,
            "range": "± 52436",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10535240,
            "range": "± 39469",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13711862,
            "range": "± 61903",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 15824639,
            "range": "± 358218",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12694070,
            "range": "± 299454",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17489138,
            "range": "± 198061",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19851893,
            "range": "± 70093",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8540209,
            "range": "± 70076",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 11237606,
            "range": "± 80155",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 12729875,
            "range": "± 49258",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5628087,
            "range": "± 80494",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7550149,
            "range": "± 42431",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8839054,
            "range": "± 40168",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 11188491,
            "range": "± 42687",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14859839,
            "range": "± 41992",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 16181189,
            "range": "± 48711",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8633593,
            "range": "± 75029",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 11688367,
            "range": "± 181488",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 13682067,
            "range": "± 52601",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5429372,
            "range": "± 50040",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 8184531,
            "range": "± 51089",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 10049827,
            "range": "± 50880",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5436822,
            "range": "± 29402",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 8232299,
            "range": "± 163851",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 10197379,
            "range": "± 43972",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9271554,
            "range": "± 57017",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 12319403,
            "range": "± 51458",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 14008313,
            "range": "± 83349",
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
          "id": "e42aff209f8966cd296a9c3cca22032f54282c2f",
          "message": "feat: implement Auv3HostedScrollbar for improved scrolling experience (#340)\n\n* feat: enhance audio engine with concurrency support and state management\n\n- Added new status codes for queue full and concurrent render in CosmoPd101FfiStatus.\n- Introduced engine retain functionality to manage engine lifecycle without locking during render.\n- Updated AudioUnitViewController to apply standalone app settings asynchronously.\n- Implemented command queue in the Rust FFI for handling audio engine commands.\n- Enhanced rendering functions to prevent concurrent access and ensure thread safety.\n- Updated tests to validate engine retention and concurrent command execution.\n- Modified runtime voice debug state handling to improve performance and memory management.\n- Updated WASM binaries for the synth engine.\n\n* feat: implement Auv3HostedScrollbar for improved scrolling experience in hosted AUv3 content\n\n- Added Auv3HostedScrollbar component to manage custom scrollbar behavior for hosted AUv3 content.\n- Updated PluginPage to integrate Auv3HostedScrollbar and adjust layout for hosted environments.\n- Modified CSS to support touch actions and gesture controls for hosted AUv3.\n- Enhanced tests for PluginPage to validate new scrollbar behavior and layout adjustments.\n- Introduced hosted gesture utilities to handle touch interactions more effectively.\n- Updated various components to support gesture controls and improve user interaction in hosted environments.\n\n* feat: remove gesture control attributes and related gesture handling logic for AUv3 components\n\n* cleanup",
          "timestamp": "2026-07-21T14:46:18Z",
          "tree_id": "456595931870602c777f0325d15cbcf65cf548e1",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/e42aff209f8966cd296a9c3cca22032f54282c2f"
        },
        "date": 1784645786342,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 2283460,
            "range": "± 38987",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 3245289,
            "range": "± 5616",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 3915953,
            "range": "± 9240",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 1899621,
            "range": "± 3265",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 1924323,
            "range": "± 5289",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 1944614,
            "range": "± 35964",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 6090064,
            "range": "± 273903",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 7754900,
            "range": "± 71157",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 8915418,
            "range": "± 43638",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 7409779,
            "range": "± 215326",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 9852654,
            "range": "± 222460",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 11192019,
            "range": "± 472165",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 4739681,
            "range": "± 151562",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 6055131,
            "range": "± 68728",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 6846341,
            "range": "± 19856",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 3095513,
            "range": "± 28224",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 4063690,
            "range": "± 9344",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 4737886,
            "range": "± 11291",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 6243480,
            "range": "± 23937",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 8131365,
            "range": "± 412365",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 9016356,
            "range": "± 386760",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 4667452,
            "range": "± 19921",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 5720349,
            "range": "± 19985",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 6748325,
            "range": "± 24544",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 2328706,
            "range": "± 8371",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 3671105,
            "range": "± 221135",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 4605835,
            "range": "± 152807",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 2512205,
            "range": "± 20495",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 4041821,
            "range": "± 8227",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 5108216,
            "range": "± 17529",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 4721535,
            "range": "± 9340",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 6380720,
            "range": "± 19642",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 7383449,
            "range": "± 417188",
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
          "id": "9acb0ea695aa9532312572e01cf6d30c737b4e73",
          "message": "fix(plugin): make runtime telemetry RT-safe (#343)\n\n* fix(plugin): make runtime telemetry RT-safe\n\n* feat: add scope frame subscription management to usePluginSynthRuntime\n\n* feat: add test for scope delivery persistence across display, fx, and mod switches",
          "timestamp": "2026-07-21T14:30:37-04:00",
          "tree_id": "e4a7c864610f494695da2e7b6c35fdcfe1bba40e",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/9acb0ea695aa9532312572e01cf6d30c737b4e73"
        },
        "date": 1784659188824,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4410840,
            "range": "± 45149",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6201528,
            "range": "± 51053",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7372655,
            "range": "± 93424",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3589360,
            "range": "± 39625",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3611459,
            "range": "± 195676",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3586927,
            "range": "± 33918",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10410117,
            "range": "± 44694",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13105203,
            "range": "± 61630",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14904868,
            "range": "± 365310",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12862833,
            "range": "± 270983",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17443708,
            "range": "± 169464",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19701192,
            "range": "± 65984",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8331895,
            "range": "± 150924",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10460829,
            "range": "± 44242",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11776860,
            "range": "± 75488",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5574007,
            "range": "± 96736",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7223346,
            "range": "± 174020",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8338414,
            "range": "± 102661",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10928406,
            "range": "± 31120",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14185564,
            "range": "± 71159",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15426865,
            "range": "± 50805",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8293182,
            "range": "± 30303",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10777215,
            "range": "± 248793",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12490530,
            "range": "± 182821",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5340543,
            "range": "± 48789",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7532721,
            "range": "± 55618",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9108588,
            "range": "± 323757",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5437024,
            "range": "± 58710",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7813526,
            "range": "± 42486",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9690588,
            "range": "± 45005",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9041216,
            "range": "± 128138",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11692260,
            "range": "± 53660",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13315940,
            "range": "± 30600",
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
          "id": "9acb0ea695aa9532312572e01cf6d30c737b4e73",
          "message": "fix(plugin): make runtime telemetry RT-safe (#343)\n\n* fix(plugin): make runtime telemetry RT-safe\n\n* feat: add scope frame subscription management to usePluginSynthRuntime\n\n* feat: add test for scope delivery persistence across display, fx, and mod switches",
          "timestamp": "2026-07-21T14:30:37-04:00",
          "tree_id": "e4a7c864610f494695da2e7b6c35fdcfe1bba40e",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/9acb0ea695aa9532312572e01cf6d30c737b4e73"
        },
        "date": 1785422813689,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4375265,
            "range": "± 149404",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6211693,
            "range": "± 186993",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7326731,
            "range": "± 147948",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3545455,
            "range": "± 13711",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3550858,
            "range": "± 50848",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3548105,
            "range": "± 11450",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10295586,
            "range": "± 128884",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 12959168,
            "range": "± 142547",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14711436,
            "range": "± 21273",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12706680,
            "range": "± 372929",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17264830,
            "range": "± 49797",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19516528,
            "range": "± 667220",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8211184,
            "range": "± 23368",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10413318,
            "range": "± 14489",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11696891,
            "range": "± 41236",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5500857,
            "range": "± 86098",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7164008,
            "range": "± 67158",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8306556,
            "range": "± 115111",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10847438,
            "range": "± 244078",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14068832,
            "range": "± 141030",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15323791,
            "range": "± 51508",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8248326,
            "range": "± 21816",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10745283,
            "range": "± 21873",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12442072,
            "range": "± 23491",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5301196,
            "range": "± 28376",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7528799,
            "range": "± 23171",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9044891,
            "range": "± 16158",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5375766,
            "range": "± 12349",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7887965,
            "range": "± 66990",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9749248,
            "range": "± 26424",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 8977829,
            "range": "± 166731",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11670489,
            "range": "± 141746",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13305217,
            "range": "± 22748",
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
          "id": "5defdf7301f9be866d862d29f8d0fbd10185df5a",
          "message": "fix: update keyboard overlay visibility and adjust note mappings (#348)",
          "timestamp": "2026-08-04T11:53:13-04:00",
          "tree_id": "cf445014a5930aae9c045bdbf4237a35d07771fc",
          "url": "https://github.com/fpbrault/cosmo-pd/commit/5defdf7301f9be866d862d29f8d0fbd10185df5a"
        },
        "date": 1785859347844,
        "tool": "cargo",
        "benches": [
          {
            "name": "default_3_voices",
            "value": 4381811,
            "range": "± 33867",
            "unit": "ns/iter"
          },
          {
            "name": "default_6_voices",
            "value": 6229304,
            "range": "± 26896",
            "unit": "ns/iter"
          },
          {
            "name": "default_8_voices",
            "value": 7429376,
            "range": "± 45894",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_3_voices",
            "value": 3569641,
            "range": "± 33796",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_6_voices",
            "value": 3573173,
            "range": "± 15268",
            "unit": "ns/iter"
          },
          {
            "name": "fun_bass_like_8_voices",
            "value": 3564635,
            "range": "± 44079",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_3_voices",
            "value": 10395182,
            "range": "± 63780",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_6_voices",
            "value": 13050743,
            "range": "± 59812",
            "unit": "ns/iter"
          },
          {
            "name": "chants_like_8_voices",
            "value": 14825776,
            "range": "± 38758",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_3_voices",
            "value": 12840971,
            "range": "± 56035",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_6_voices",
            "value": 17328974,
            "range": "± 36468",
            "unit": "ns/iter"
          },
          {
            "name": "chops_like_8_voices",
            "value": 19565834,
            "range": "± 308139",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_3_voices",
            "value": 8323247,
            "range": "± 33307",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_6_voices",
            "value": 10544478,
            "range": "± 162720",
            "unit": "ns/iter"
          },
          {
            "name": "mod_heavy_8_voices",
            "value": 11839052,
            "range": "± 40668",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_3_voices",
            "value": 5569779,
            "range": "± 40075",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_6_voices",
            "value": 7212217,
            "range": "± 35162",
            "unit": "ns/iter"
          },
          {
            "name": "fx_heavy_8_voices",
            "value": 8381180,
            "range": "± 45419",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_3_voices",
            "value": 10999954,
            "range": "± 35605",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_6_voices",
            "value": 14219702,
            "range": "± 58147",
            "unit": "ns/iter"
          },
          {
            "name": "worst_poly_8_voices",
            "value": 15443068,
            "range": "± 54897",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_3_voices",
            "value": 8378738,
            "range": "± 60291",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_6_voices",
            "value": 10846154,
            "range": "± 33608",
            "unit": "ns/iter"
          },
          {
            "name": "opt_sine_lfo_heavy_8_voices",
            "value": 12581980,
            "range": "± 45730",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_3_voices",
            "value": 5408754,
            "range": "± 55392",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_6_voices",
            "value": 7637354,
            "range": "± 77303",
            "unit": "ns/iter"
          },
          {
            "name": "opt_param_interp_light_8_voices",
            "value": 9167148,
            "range": "± 47393",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_3_voices",
            "value": 5448334,
            "range": "± 46973",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_6_voices",
            "value": 7863837,
            "range": "± 25252",
            "unit": "ns/iter"
          },
          {
            "name": "opt_render_vectorization_8_voices",
            "value": 9845070,
            "range": "± 115197",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_3_voices",
            "value": 9093784,
            "range": "± 354098",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_6_voices",
            "value": 11865026,
            "range": "± 58180",
            "unit": "ns/iter"
          },
          {
            "name": "opt_all_combined_8_voices",
            "value": 13472015,
            "range": "± 257629",
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
      }
    ]
  }
}