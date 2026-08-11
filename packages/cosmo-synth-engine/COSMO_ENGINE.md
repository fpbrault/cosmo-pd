# Cosmo PD-101 Synth Engine

A phase distortion (PD) synthesiser DSP core written in Rust. Compiles to native (Tauri desktop, VST3/AU) and WebAssembly (AudioWorklet).

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     CosmoProcessor                               │
│  ┌──────────┐  ┌──────────────────────────────────────────┐     │
│  │ MIDI In  │  │              Process Loop                │     │
│  │ Note On  │  │  ┌──────┐ ┌──────────┐ ┌─────────────┐  │     │
│  │ Note Off │──▶│  │ LFO1 │ │  Voice   │ │    FX       │  │     │
│  │ PitchBend│  │  │ LFO2 │ │  x8 (4   │ │  Chain 6    │──▶───▶──Out
│  │ ModWheel │  │  │ Rand │ │ SIMD)    │ │  Slots      │  │     │
│  │ Sustain  │  │  └──────┘ └──────────┘ └─────────────┘  │     │
│  └──────────┘  │  ┌──────────┐                           │     │
│                │  │ Mod      │←── Mod Matrix (7→51)      │     │
│                │  │ Sources  │                           │     │
│                │  └──────────┘                           │     │
│                └──────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Audio Graph — Sample-by-Sample Signal Flow

```mermaid
flowchart LR
    sublegend[("<i>W = Warp Algo<br/>W0-W15 = Algo control params<br/>BW = Base Waveform (cos/sin/tri/saw/sq)</i>")]
    style sublegend fill:#1a1a2e,stroke:#555,color:#ccc

    subgraph input ["MIDI Input"]
        MIDI["MIDI Note On/Off<br/>Pitch Bend, Mod Wheel<br/>Aftertouch, Sustain"]
    end

    subgraph lfos ["Modulation Sources"]
        LFO1["LFO 1<br/><small>rate|depth|symmetry|offset</small>"]
        LFO2["LFO 2<br/><small>rate|depth|symmetry|offset</small>"]
        RAND["Random S&H<br/><small>sample-rate</small>"]
        MODENV["ADSR Mod Env<br/><small>A|D|S|R</small>"]
        VEL["Velocity"]
        MW["Mod Wheel"]
        AT["Aftertouch"]
    end

    subgraph modmatrix ["Mod Matrix (7 sources → 51 destinations)"]
        MATRIX["∑(source × amount)<br/>clamped to [-1, +1]"]
    end

    subgraph voice ["Voice (×8, rendered in SIMD-4 batches)"]
        direction TB
        subgraph line1 ["Line 1 (Oscillator)"]
            L1_DCO_ENV["DCO Envelope<br/><small>8-step, pitch → semitones</small>"]
            L1_FREQ["Line Frequency<br/><small>base × 2^oct/det/dco</small>"]
            L1_PITCH["Pitch Mod<br/><small>bend+vibrato+porta</small>"]
            L1_PM["Phase Mod<br/><small>internal PM pre/post</small>"]
            L1_PRIMARY["Primary Algo (W)<br/>warp_phase(φ, dcw, W0..W3)"]
            L1_SECONDARY["Secondary Algo (W')<br/><small>blended with primary</small>"]
            L1_BW["Base Waveform<br/><small>sample(warped φ + pm)</small>"]
            L1_DCW_ENV["DCW Envelope<br/><small>8-step, shapes warp depth</small>"]
            L1_DCA_ENV["DCA Envelope<br/><small>8-step, amplitude</small>"]
            L1_WIN["Window<br/><small>amplitude gate</small>"]
            L1_OUT[("Line 1 Sample")]
        end

        subgraph line2 ["Line 2 (Oscillator)"]
            L2_DCO_ENV["DCO Envelope"]
            L2_FREQ["Line Frequency"]
            L2_PITCH["Pitch Mod"]
            L2_PM["Phase Mod"]
            L2_PRIMARY["Primary Algo"]
            L2_SECONDARY["Secondary Algo"]
            L2_BW["Base Waveform"]
            L2_DCW_ENV["DCW Envelope"]
            L2_DCA_ENV["DCA Envelope"]
            L2_WIN["Window"]
            L2_OUT[("Line 2 Sample")]
        end

        subgraph mix ["Line Mixer"]
            MODE{"ModMode"}
            RING["Ring Mod<br/>s1 × s2 × ring_gain"]
            NOISE["Noise Mod<br/>s + s × noise"]
            NORMAL["Normal<br/>L1 / L2 / L1+L2"]
            LINESEL{"LineSelect<br/>L1 | L2 | L1+L1' | L1+L2'"}
        end
    end

    subgraph output_stage ["Output Stage"]
        VOL["Volume + Mod<br/><small>∑voices / √8 × volume</small>"]
        FX["FX Chain<br/><small>6 serial slots</small>"]
        DAC["CZ DAC Color<br/><small>optional</small>"]
        CLIP["Soft Clip<br/><small>tanh</small>"]
        FINAL["Final Out<br/><small>clamp[-1,+1]</small>"]
    end

    MIDI --> voice
    LFO1 & LFO2 & RAND & MODENV & VEL & MW & AT --> MATRIX
    MATRIX -..-> voice
    MATRIX -..-> lfos
    MATRIX -..-> output_stage

    L1_DCO_ENV --> L1_FREQ
    L1_FREQ --> L1_PITCH
    L1_PITCH --> L1_PM
    L1_PM --> L1_PRIMARY
    L1_DCW_ENV --> L1_PRIMARY
    L1_PRIMARY & L1_SECONDARY --> L1_BW
    L1_BW --> L1_WIN
    L1_DCA_ENV --> L1_WIN
    L1_WIN --> L1_OUT

    L2_DCO_ENV --> L2_FREQ
    L2_FREQ --> L2_PITCH
    L2_PITCH --> L2_PM
    L2_PM --> L2_PRIMARY
    L2_DCW_ENV --> L2_PRIMARY
    L2_PRIMARY & L2_SECONDARY --> L2_BW
    L2_BW --> L2_WIN
    L2_DCA_ENV --> L2_WIN
    L2_WIN --> L2_OUT

    L1_OUT & L2_OUT --> mix
    MODE --> RING & NOISE & NORMAL
    LINESEL --> NORMAL
    RING & NOISE & NORMAL --> VOL
    VOL --> FX --> DAC --> CLIP --> FINAL
```

---

## Per-Voice Render Pipeline

```mermaid
flowchart TD
    START(["render_voice(voice, params, mods, ...)"]) --> SILENT{voice.is_silent?}

    SILENT -- yes --> ADV_SILENT["advance_silent_voice()<br/><small>advance phase only</small>"]
    ADV_SILENT --> ZERO["return 0.0"]

    SILENT -- no --> ENV["advance_envelopes()<br/><small>DCO/DCW/DCA 8-step envs</small>"]
    ENV --> MODENV_ADV["advance mod envelope (ADSR)"]
    MODENV_ADV --> STATE["build_signal_state()<br/><small>effective freq, DCW depth, DCA level<br/>+ mod matrix offsets</small>"]
    STATE --> DCW["apply_dcw_dezipper()<br/><small>1.5ms low-pass on DCW jumps</small>"]
    DCW --> PITCH["apply_pitch_mod()<br/><small>portamento + pitch bend + vibrato + pitch mod</small>"]
    PITCH --> PHASE["build_phase_frame()<br/><small>phase accumulation, internal PM<br/>(pre or post warp)</small>"]
    PHASE --> RENDER_L1["algo_runtime.render_line1()<br/><small>warp_phase(φ, DCW, controls) → base waveform</small>"]
    PHASE --> RENDER_L2["algo_runtime.render_line2()"]
    RENDER_L1 & RENDER_L2 --> MIX["mix_line_outputs()<br/><small>Normal/Ring/Noise mode<br/>LineSelect routing</small>"]
    MIX --> VOLMOD["volume × (1 + volume_mod)"]
    VOLMOD --> CLICK["anti-click attack ramp"]
    CLICK --> SUPPRESS["suppress_sample_discontinuity()<br/><small>pop suppression</small>"]
    SUPPRESS --> PHASE_ADV["advance_voice_phase()<br/><small>φ += freq/sr, wrap, cycle_count++</small>"]

    PHASE_ADV --> FADE{"anti_click_fade > 0?"}
    FADE -- yes --> FADE_RAMP["apply fade ramp"]
    FADE_RAMP --> ZERO_CROSS{"zero_cross_stop_pending?"}
    ZERO_CROSS -- yes --> FINALIZE["finalize_voice_silence()"]
    FINALIZE --> RETURN["return output"]
```

---

## Phase Distortion Algorithms

Each oscillator line runs a **phase distortion algorithm**: a warp function transforms the input phase `φ` before sampling a base waveform. The DCW (Digital Controlled Waveshape) envelope controls warp depth.

### CZ-101 Legacy Waveforms

These emulate the original Casio CZ-101 phase distortion directly:

| Algo | Original CZ Name | Description |
|------|------------------|-------------|
| `Cz101` | (generic) | Variable distortion curve |
| `Saw` | Saw | PD sawtooth |
| `Square` | Square | PD square wave |
| `Pulse` | Pulse | PD pulse wave |
| `Null` | Null | Silence/gate |
| `SinePulse` | Sine + Pulse | Cross-faded sine/pulse |
| `SawPulse` | Saw + Pulse | Cross-faded saw/pulse |
| `MultiSine` | Multi Sine | Layered sine PD |
| `Pulse2` | Pulse 2 | Alternative pulse PD |

### Warp Algorithms (Cosmo-Original)

These go beyond the CZ-101 with custom phase-warping functions. Each has up to 4 control parameters:

```mermaid
flowchart LR
    PHASE_IN["Phase φ"] --> WARP["warp_phase(φ, amt, c0..c3)"]
    WARP --> SAMPLE["sample_base_waveform(warped_φ)"]
    SAMPLE --> OUT["sample × window_gain × DCA"]
```

| Algo | Controls | Description |
|------|----------|-------------|
| `Bend` | curve, bias, knee | Smooth phase bending |
| `Sync` | ratio, phase_offset, curve, window | Hard-sync style phase reset |
| `Pinch` | focus, asym, curve, drive | Squeeze/stretch phase regions |
| `Fold` | stages, tilt, symmetry, softness | Wavefolding via phase inversion |
| `Skew` | bias, curve, spread, tilt | Asymmetric phase stretching |
| `Twist` | harmonics, depth, phase_offset, shape | Harmonic twisting |
| `Clip` | drive, shape, bias, soft | Phase clipping/wrapping |
| `Ripple` | freq, depth, phase_offset, shape | Ripple modulation filter |
| `Mirror` | center, blend, clip, skew | Phase mirroring |
| `Fof` | ratio, tightness, offset, skew | Formant (Fof) synthesis |
| `Sine` | (none) | Pure sine (amt→amp) |
| `Terrain` | x, y, z, scale | 3D terrain lookup noise |
| `Cheby` | order, mix, —, — | Chebyshev polynomials |
| `Stutter` | rate, depth, —, — | Granular stutter |

> **Dual-algo blending**: Each line can blend two algorithms (`algo` + `algo2`) via `algo_blend [0..1]`. When both are set, DCW depth is partitioned: `primary_dcw = dcw × (1-blend)`, `secondary_dcw = dcw × blend`.

### How warp_phase works

```mermaid
flowchart TD
    IN["warp_phase(algo, φ, amt, controls[8], mods[8])"] --> CZ_CHECK{"algo.is_cz_waveform()?"}

    CZ_CHECK -- yes --> CZ_WARP["cz101::warp_phase_for_waveform(φ, amt)"]
    CZ_CHECK -- no --> AMT_ZERO{"amt == 0?"}
    AMT_ZERO -- yes --> DIRECT["return φ (passthrough)"]

    AMT_ZERO -- no --> DEFAULTS{"mods are all zero?"}
    DEFAULTS -- yes --> FAST_PATH["warp_phase_with_default_controls()<br/><small>hardcoded default params</small>"]
    DEFAULTS -- no --> DISPATCH["match algo → 16 warp functions<br/><small>each uses controls[i] + mods[i]</small>"]
    FAST_PATH & DISPATCH --> RESULT
    CZ_WARP --> RESULT["return warped_phase"]
```

---

## Envelopes

### 8-Step CZ-Style Envelope (DCO / DCW / DCA)

Each oscillator line has 3 independent 8-step envelope generators — one per DCO, DCW, DCA:

```
Step: [0]──→[1]──→[2]──→[3]──→[4]──→[5]──→[6]──→[7]
       ↑     ↑     ↑     ↑
       │     │     │     └── sustain step (hold until note-off)
       │     │     └──────── optional loop-back
       │     └──────────────
       └──────────────────── rate(0..99) × level distance
```

Key behaviour:
- Each step defines: `rate (0-99)`, `level (0-127 raw / 0-99 human)`
- Step duration = `rate_to_seconds(rate) × |target_level - prev_level|`
- Sustain step holds until note-off, then release steps continue
- Optional loop mode repeats from step 0
- Rate curves differ per envelope kind: DCO (235s→4ms), DCA/DCW (104s→4ms)

### ADSR Mod Envelope

A simpler 4-stage envelope used as a modulation source (routes to any destination via mod matrix):
Attack → Decay → Sustain → Release

### Envelope Timing Curves (measured from original CZ-101)

```
DCO:   t(rate) = 235.64 × exp(-13.984 × rate/99)
DCA:   t(rate) = 104.04 × (0.004/104.04)^(rate/99)
DCW:   (same as DCA)
```

---

## Modulation Matrix

```mermaid
flowchart LR
    src["7 Sources<br/>────────<br/>LFO 1<br/>LFO 2<br/>Random S&H<br/>Mod Env (ADSR)<br/>Velocity<br/>Mod Wheel<br/>Aftertouch"] --> MAT["Mod Matrix<br/>──────────────<br/>∑(amount × src_value)<br/>clamped [-1, +1]"]
    MAT --> dest["51 Destinations<br/>───────────────<br/>Volume, Pitch<br/>Line1/2: DCW, DCA, AlgoBlend<br/>Line1/2: AlgoControl 1-8<br/>Line1/2: Octave, Detune<br/>Line1/2: EnvStep level/rate<br/>Vibrato rate/depth<br/>IntPM Ratio<br/>LFO1/2: rate, depth, sym, offset<br/>Phaser: rate, depth, fb, mix<br/>Random rate<br/>(and more...)"]
```

Each route: `source × amount → destination`, summed per destination and clamped. The mod matrix is pre-cached per sample frame (`ModMatrixCache`) for O(1) per-destination lookups during voice rendering.

### Modulation Sources

| Source | Range | Description |
|--------|-------|-------------|
| LFO 1 | [-1, +1] | Multi-waveform, 0.01-40 Hz, symmetry control |
| LFO 2 | [-1, +1] | Independent LFO, same feature set |
| Random | [-1, +1] | Sample-and-hold, 0-200 Hz rate |
| Mod Env | [0, +1] | ADSR envelope triggered by note-on |
| Velocity | [0, +1] | Note-on velocity |
| Mod Wheel | [0, +1] | MIDI CC 1 |
| Aftertouch | [0, +1] | Channel pressure |

> Envelope step modulation (rate/level per step) is supported as a special case — if any routes target env step destinations, full envelope data is cloned and mutated per-sample to reflect live mod.

---

## FX Chain

```mermaid
flowchart LR
    IN["Mixed Voice Sum"] --> SLOT0["Slot 0"]
    SLOT0 --> SLOT1["Slot 1"]
    SLOT1 --> SLOT2["Slot 2"]
    SLOT2 --> SLOT3["Slot 3"]
    SLOT3 --> SLOT4["Slot 4"]
    SLOT4 --> SLOT5["Slot 5"]
    SLOT5 --> OUT["Output"]
```

6 serial FX slots. Empty/Vibrato/PhaseMod slots pass through (those operate at voice level). The 17 effect types:

| FX | Type | Key Parameters |
|----|------|----------------|
| **Chorus** | time-based | rate, depth, mix |
| **Delay** | time-based | time, feedback, mix, tape_mode, warmth |
| **Reverb (FDN)** | spatial | mix, space, predelay, distance, character |
| **Phaser** | modulation | rate, depth, mix, feedback |
| **Compressor** | dynamics | threshold, ratio, attack, release, makeup, mix |
| **5-Band EQ** | filter | gain80, gain240, gain750, gain2200, gain8000 |
| **Grain Delay** | granular | time, feedback, scatter, density, mix |
| **Bitcrusher** | lo-fi | bits, rate_reduction, mix |
| **ShimmerVerb** | spatial | shimmer, space, mix |
| **Distortion** | waveshape | mode, drive, tone, mix |
| **Juno Chorus** | modulation | mode (I/II), mix |
| **Ring Mod** | modulation | carrier_hz, mix |
| **Tremolo** | modulation | rate, depth, waveform, mix |
| **Wavefolder** | waveshape | drive, folds, mix |
| **LoFi** | lo-fi | degrade, wow/flutter, tone, mix |
| **Vibrato** | pitch | waveform, rate, depth, delay (voice-level) |
| **PhaseMod** | pitch | amount, ratio, pre/post (voice-level) |

---

## Voice Architecture (8 Voices)

- `NUM_VOICES = 8` polyphonic voices
- Rendered in SIMD-4 batches for efficiency
- Auto-detects SIMD backend: AVX2 (x86), SSE2 (x86 fallback), WASM SIMD, or scalar fallback
- Voice lifecycle: note-on → attack → decay → sustain → note-off → release → fade → zero-cross stop → silence
- Anti-click: 64-sample attack ramp, release fade (1/2 cycle length, up to 1024 samples), zero-cross detection for click-free note-off
- Portamento: Rate mode (exponential glide) or Time mode (linear, fixed duration)
- Line select modes: L1-only, L2-only, L1+L1' (L1 rendered twice with different phase), L1+L2' (L1 + L2 rendered through L1 params)

### Line Mixing Modes

| Mode | Formula | Description |
|------|---------|-------------|
| `Normal` | s1 + s2 (or L1/L2 solo) | Standard additive mix |
| `Ring` | s1 × s2 × ring_gain | Ring modulation |
| `Noise` | mix + mix × noise × 0.5 | Amplitude noise modulation |

### CZ DAC Color (optional)

Disabled by default. Models the non-linear transfer function of the original Casio CZ-101 DAC for authentic lo-fi character.

---

## Parameter Hierarchy

```
SynthParams
├── line1: LineParams
│   ├── algo: Algo (primary phase distortion algorithm)
│   ├── algo2: Option<Algo> (secondary blend)
│   ├── algo_blend: f32 [0..1]
│   ├── base_waveform_a/b: BaseWaveform
│   ├── window: WindowType
│   ├── dca_base / dcw_base: f32
│   ├── octave / detune_note / detune_fine: f32
│   ├── dco_env / dcw_env / dca_env: StepEnvData (8-step)
│   ├── dcw_key_follow: f32
│   ├── dca_key_follow: f32
│   └── algo_controls_a/b: Vec<AlgoControlValueV1>
├── line2: LineParams (same structure as line1)
├── lfo / lfo2: LfoParams
├── mod_matrix: ModMatrix (routes Vec<ModRoute>)
├── mod_env: ModEnvParams (ADSR)
├── random: RandomParams
├── fx_slots: [FxSlotConfig; 6]
├── volume, octave, ring_gain: f32
├── poly_mode: PolyMode | Mono
├── portamento: PortamentoParams
├── pitch_bend_range: f32
└── velocity_curve: f32
```

---

## Build Targets

| Target | Crate Feature | Platform |
|--------|--------------|----------|
| Native (Tauri) | `std` | macOS, Windows, Linux |
| VST3/AU plugin | `std` | DAW host (via truce) |
| WASM AudioWorklet | `wasm` | Browser (via wasm-bindgen) |
| no_std | (none) | Embedded (future) |
