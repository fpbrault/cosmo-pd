window.BENCHMARK_DATA = {
  "lastUpdate": 1781789841327,
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
      }
    ]
  }
}