use purr_synth_core::telemetry::{LevelMeter, ScopeCapture};

/// Telemetry state for the PD-101 engine, collected during audio rendering.
///
/// This struct is the `Pd101Synth::Telemetry` associated type. The process
/// loop populates it each audio frame; the WASM layer exposes relevant fields
/// through the existing getter API.
///
/// # Scope capacity
/// The scope captures 512 samples with 4× decimation by default, giving
/// ~128 points at 48 kHz (approx. 10 ms look-ahead / look-back).
#[derive(Debug, Clone)]
pub struct Pd101Telemetry {
    /// Captures the post-FX mono output for UI waveform display.
    pub scope: ScopeCapture,
    /// Peak/RMS meter for the post-FX mono output.
    pub level: LevelMeter,
}

impl Pd101Telemetry {
    pub const SCOPE_CAPACITY: usize = 512;
    pub const SCOPE_DECIMATION: usize = 4;

    pub fn new() -> Self {
        Self {
            scope: ScopeCapture::new(Self::SCOPE_CAPACITY, Self::SCOPE_DECIMATION),
            level: LevelMeter::default(),
        }
    }

    /// Push one post-FX output sample into both the scope and the level meter.
    pub fn push(&mut self, sample: f32) {
        self.scope.push(sample);
        self.level.push(sample);
    }

    /// Read the scope value with the given look-back delay in captured samples.
    pub fn scope_sample(&self, delay: usize) -> f32 {
        self.scope.latest(delay)
    }

    /// Current peak level [0, 1].
    pub fn peak(&self) -> f32 {
        self.level.peak()
    }

    /// Current RMS level [0, 1].
    pub fn rms(&self) -> f32 {
        self.level.rms()
    }

    /// Reset accumulated level meter state (e.g. between metering windows).
    pub fn reset_level(&mut self) {
        self.level.reset();
    }
}

impl Default for Pd101Telemetry {
    fn default() -> Self {
        Self::new()
    }
}
