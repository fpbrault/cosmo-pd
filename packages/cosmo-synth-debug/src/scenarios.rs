use cosmo_synth_engine::params::{
    Algo, FxSlotConfig, FxSlotType, LineSelect, ModDestination, ModMatrix, ModRoute, ModSource,
    PolyMode, SynthParams,
};

pub fn presets() -> Vec<(&'static str, SynthParams)> {
    vec![
        ("Default", SynthParams::default()),
        ("Fun Bass", build_fun_bass_like()),
        ("Chants", build_chants_like()),
        ("Chops", build_chops_like()),
        ("Mod Heavy", build_mod_heavy()),
        ("FX Heavy", build_fx_heavy()),
        ("Worst Poly", build_worst_poly()),
    ]
}

#[allow(clippy::field_reassign_with_default)]
fn build_fun_bass_like() -> SynthParams {
    let mut p = SynthParams::default();
    p.poly_mode = PolyMode::Mono;
    p.line_select = LineSelect::L1PlusL2Prime;
    p.line1.algo = Algo::Saw;
    p.line1.algo2 = Some(Algo::Skew);
    p.line1.algo_blend = 0.15;
    p.line1.dca_base = 0.85;
    p.line2.algo = Algo::Pulse;
    p.line2.algo2 = Some(Algo::Square);
    p.line2.algo_blend = 0.2;
    p.line2.dca_base = 0.65;
    p.fx_slots = [
        FxSlotConfig::default_for_type(FxSlotType::Compressor),
        FxSlotConfig::Empty,
        FxSlotConfig::Empty,
        FxSlotConfig::Vibrato(Default::default()),
        FxSlotConfig::PhaseMod(Default::default()),
        FxSlotConfig::Empty,
    ];
    p
}

#[allow(clippy::field_reassign_with_default)]
fn build_chants_like() -> SynthParams {
    let mut p = SynthParams::default();
    p.poly_mode = PolyMode::Poly8;
    p.line1.algo = Algo::Fof;
    p.line1.algo2 = Some(Algo::Ripple);
    p.line1.algo_blend = 0.55;
    p.line1.dcw_base = 0.85;
    p.line1.dca_base = 0.8;
    p.line2.algo = Algo::MultiSine;
    p.line2.algo2 = Some(Algo::SawPulse);
    p.line2.algo_blend = 0.45;
    p.line2.dcw_base = 0.9;
    p.line2.dca_base = 0.72;
    p.lfo.rate = 4.2;
    p.lfo2.rate = 6.0;
    p.random.rate = 9.0;
    p.mod_matrix = heavy_mod_matrix();
    p.fx_slots = [
        FxSlotConfig::default_for_type(FxSlotType::Chorus),
        FxSlotConfig::default_for_type(FxSlotType::Delay),
        FxSlotConfig::default_for_type(FxSlotType::Reverb),
        FxSlotConfig::default_for_type(FxSlotType::Phaser),
        FxSlotConfig::default_for_type(FxSlotType::Compressor),
        FxSlotConfig::default_for_type(FxSlotType::Eq5Band),
    ];
    p
}

#[allow(clippy::field_reassign_with_default)]
fn build_chops_like() -> SynthParams {
    let mut p = SynthParams::default();
    p.poly_mode = PolyMode::Poly8;
    p.line1.algo = Algo::Karpunk;
    p.line1.algo2 = Some(Algo::Fold);
    p.line1.algo_blend = 0.6;
    p.line2.algo = Algo::Twist;
    p.line2.algo2 = Some(Algo::Clip);
    p.line2.algo_blend = 0.5;
    p.lfo.rate = 8.0;
    p.lfo2.rate = 12.0;
    p.random.rate = 16.0;
    p.mod_matrix = heavy_mod_matrix();
    p.fx_slots = [
        FxSlotConfig::default_for_type(FxSlotType::Distortion),
        FxSlotConfig::default_for_type(FxSlotType::Delay),
        FxSlotConfig::default_for_type(FxSlotType::RingMod),
        FxSlotConfig::default_for_type(FxSlotType::Wavefolder),
        FxSlotConfig::default_for_type(FxSlotType::Reverb),
        FxSlotConfig::default_for_type(FxSlotType::Compressor),
    ];
    p
}

fn build_fx_heavy() -> SynthParams {
    SynthParams {
        fx_slots: [
            FxSlotConfig::default_for_type(FxSlotType::Chorus),
            FxSlotConfig::default_for_type(FxSlotType::Phaser),
            FxSlotConfig::default_for_type(FxSlotType::Delay),
            FxSlotConfig::default_for_type(FxSlotType::Reverb),
            FxSlotConfig::default_for_type(FxSlotType::Compressor),
            FxSlotConfig::default_for_type(FxSlotType::Eq5Band),
        ],
        ..Default::default()
    }
}

#[allow(clippy::field_reassign_with_default)]
fn build_mod_heavy() -> SynthParams {
    let mut p = SynthParams::default();
    p.mod_matrix = heavy_mod_matrix();
    p.lfo.rate = 7.5;
    p.lfo2.rate = 5.25;
    p.random.rate = 11.0;
    p
}

#[allow(clippy::field_reassign_with_default)]
fn build_worst_poly() -> SynthParams {
    let mut p = SynthParams::default();
    p.poly_mode = PolyMode::Poly8;
    p.line_select = LineSelect::L1PlusL2Prime;
    p.line1.algo = Algo::Fof;
    p.line1.algo2 = Some(Algo::Karpunk);
    p.line1.algo_blend = 0.65;
    p.line1.dcw_base = 0.95;
    p.line2.algo = Algo::Karpunk;
    p.line2.algo2 = Some(Algo::Ripple);
    p.line2.algo_blend = 0.65;
    p.line2.dcw_base = 0.95;
    p.mod_matrix = heavy_mod_matrix();
    p.lfo.rate = 9.0;
    p.lfo2.rate = 9.0;
    p.random.rate = 18.0;
    p.fx_slots = [
        FxSlotConfig::default_for_type(FxSlotType::GrainDelay),
        FxSlotConfig::default_for_type(FxSlotType::ShimmerVerb),
        FxSlotConfig::default_for_type(FxSlotType::Distortion),
        FxSlotConfig::default_for_type(FxSlotType::RingMod),
        FxSlotConfig::default_for_type(FxSlotType::Wavefolder),
        FxSlotConfig::default_for_type(FxSlotType::Compressor),
    ];
    p
}

fn heavy_mod_matrix() -> ModMatrix {
    let routes = vec![
        ModRoute {
            source: ModSource::Lfo1,
            destination: ModDestination::Lfo1Rate,
            amount: 0.5,
            enabled: true,
        },
        ModRoute {
            source: ModSource::Lfo2,
            destination: ModDestination::Lfo2Rate,
            amount: 0.5,
            enabled: true,
        },
        ModRoute {
            source: ModSource::ModEnv,
            destination: ModDestination::Line1AlgoBlend,
            amount: 0.8,
            enabled: true,
        },
        ModRoute {
            source: ModSource::Velocity,
            destination: ModDestination::Line2AlgoBlend,
            amount: 0.5,
            enabled: true,
        },
        ModRoute {
            source: ModSource::Lfo1,
            destination: ModDestination::Line1DcwBase,
            amount: 0.7,
            enabled: true,
        },
        ModRoute {
            source: ModSource::Lfo2,
            destination: ModDestination::Line2DcwBase,
            amount: 0.7,
            enabled: true,
        },
        ModRoute {
            source: ModSource::Random,
            destination: ModDestination::Line1AlgoParam1,
            amount: 0.6,
            enabled: true,
        },
        ModRoute {
            source: ModSource::Random,
            destination: ModDestination::Line2AlgoParam2,
            amount: 0.6,
            enabled: true,
        },
        ModRoute {
            source: ModSource::ModWheel,
            destination: ModDestination::ChorusMix,
            amount: 0.8,
            enabled: true,
        },
        ModRoute {
            source: ModSource::Aftertouch,
            destination: ModDestination::ReverbMix,
            amount: 0.4,
            enabled: true,
        },
        ModRoute {
            source: ModSource::ModEnv,
            destination: ModDestination::DelayMix,
            amount: 0.55,
            enabled: true,
        },
        ModRoute {
            source: ModSource::Lfo1,
            destination: ModDestination::Line1DcoEnvStep2Rate,
            amount: 0.6,
            enabled: true,
        },
        ModRoute {
            source: ModSource::Lfo2,
            destination: ModDestination::Line2DcaEnvStep4Rate,
            amount: 0.5,
            enabled: true,
        },
    ];

    ModMatrix { routes }
}
