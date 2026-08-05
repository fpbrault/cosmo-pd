# Bottom-bar tooltip audit

Audit date: 2026-08-05

Scope: shared synth UI controls that should provide contextual help in the bottom information bar on pointer hover or keyboard focus.

## Root cause

`paramMeta.ts` resolved translated parameter and enum text at module evaluation time. The web and plugin entry points initialize i18n after imports have evaluated that module, so controls fell back to their visible parameter or option labels. Parameter and enum descriptions now resolve at render/use time.

## Existing descriptions that must remain contextual

- Voice settings: portamento rate/time, bend range, and velocity curve.
- Main controls: volume, line levels/octaves, detune, line select, modulation mode, and polyphony.
- Phase modulation and vibrato controls.
- LFO 1/2 rate, sync, depth, symmetry, offset, and retrigger.
- Modulation-envelope attack, decay, sustain, release, mode, and retrigger.
- FX knobs routed through the shared FX tooltip resolver.

## Controls requiring bottom-bar coverage

### Editor and phase lines

- Base Wave A/B: cosine, sine, triangle, saw, and square descriptions.
- Line 1/2 waveform and envelope tabs.
- DCO, DCW, and DCA envelope previews.
- Envelope key-follow controls.
- Envelope `SUS` and `END` step actions.
- Previous/next algorithm navigation.
- Line octave and line 2 detune-octave controls.

### Voice, global, and macro controls

- Portamento Rate/Time mode selector.
- Manual tempo input and voice-limit selector.
- Macro 1-4 knobs, including the current user label.
- Global, MIDI Learn, MOD+, Vintage, and FX sidebar buttons.
- On-screen keyboard toggle and keyboard settings.

### Presets and modulation utilities

- Previous preset, preset library/current preset, and next preset controls.
- LFO waveform buttons and LFO retrigger.
- Random rate mode and sync division.
- Modulation-envelope retrigger buttons.
- FX bypass/power buttons and module preset selectors.

### FX option groups

- Generic FX button groups must describe the selected option rather than repeat its label.
- Delay Digital/Tape, Vibrato/Tremolo waveforms, Distortion type, and Juno Chorus mode need concise option descriptions.

## Text quality rules

- Describe the audible, musical, or UI effect of the control.
- Do not use short visible labels such as `Porta`, `Bend`, `Vel`, `Rate`, `Mode`, or `Wave` as the contextual fallback.
- Enum choices such as line select must explain which oscillator lines are active.
- Native `title` attributes may remain as a fallback but must not be the only contextual-help path.

## Verification checklist

- Hover and keyboard-focus each covered control in the web app and plugin webview.
- Confirm the bottom bar clears after pointer leave or focus loss.
- Confirm disabled controls do not leave stale help text.
- Run `bun run lint`, `bun run build`, and `bun run test`.
