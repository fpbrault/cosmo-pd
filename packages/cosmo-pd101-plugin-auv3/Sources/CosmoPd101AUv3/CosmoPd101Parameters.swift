import AudioToolbox
import Foundation

struct CosmoParameterSpec: Sendable {
    let id: AUParameterAddress
    let key: String
    let name: String
    let min: AUValue
    let max: AUValue
    let defaultValue: AUValue
    let unit: AudioUnitParameterUnit
    let flags: AudioUnitParameterOptions
}

let cosmoParameterSpecs: [CosmoParameterSpec] = [
    .init(id: 1, key: "volume", name: "Volume", min: 0, max: 1, defaultValue: 0.4, unit: .generic, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
    .init(id: 2, key: "warpAAmount", name: "Line 1 DCW", min: 0, max: 1, defaultValue: 0, unit: .generic, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
    .init(id: 3, key: "warpBAmount", name: "Line 2 DCW", min: 0, max: 1, defaultValue: 0, unit: .generic, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
    .init(id: 4, key: "algoBlendA", name: "Line 1 Blend", min: 0, max: 1, defaultValue: 0, unit: .generic, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
    .init(id: 5, key: "algoBlendB", name: "Line 2 Blend", min: 0, max: 1, defaultValue: 0, unit: .generic, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
    .init(id: 6, key: "line1Level", name: "Line 1 Level", min: 0, max: 1, defaultValue: 1, unit: .generic, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
    .init(id: 7, key: "line2Level", name: "Line 2 Level", min: 0, max: 1, defaultValue: 1, unit: .generic, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
    .init(id: 8, key: "line1Octave", name: "Octave", min: -2, max: 2, defaultValue: 0, unit: .relativeSemiTones, flags: [.flag_IsWritable, .flag_IsReadable]),
    .init(id: 9, key: "line2Octave", name: "L2 Oct", min: -2, max: 2, defaultValue: 0, unit: .relativeSemiTones, flags: [.flag_IsWritable, .flag_IsReadable]),
    .init(id: 10, key: "line2DetuneNote", name: "L2 Note", min: -11, max: 11, defaultValue: 0, unit: .relativeSemiTones, flags: [.flag_IsWritable, .flag_IsReadable]),
    .init(id: 11, key: "line2DetuneFine", name: "L2 Fine", min: -60, max: 60, defaultValue: 0, unit: .generic, flags: [.flag_IsWritable, .flag_IsReadable]),
    .init(id: 12, key: "velocityCurve", name: "Vel Curve", min: -1, max: 1, defaultValue: 0, unit: .generic, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
    .init(id: 13, key: "pitchBendRange", name: "Bend Range", min: 1, max: 24, defaultValue: 2, unit: .relativeSemiTones, flags: [.flag_IsWritable, .flag_IsReadable]),
    .init(id: 14, key: "portamentoRate", name: "Portamento Rate", min: 0, max: 127, defaultValue: 64, unit: .generic, flags: [.flag_IsWritable, .flag_IsReadable]),
    .init(id: 15, key: "portamentoTime", name: "Portamento Time", min: 0, max: 5, defaultValue: 0.08, unit: .seconds, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
    .init(id: 16, key: "lfoRate", name: "LFO Rate", min: 0.01, max: 30, defaultValue: 5, unit: .hertz, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
    .init(id: 17, key: "lfoDepth", name: "LFO Depth", min: 0, max: 1, defaultValue: 0.2, unit: .generic, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
    .init(id: 18, key: "lfoOffset", name: "LFO Offset", min: -1, max: 1, defaultValue: 0, unit: .generic, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
    .init(id: 19, key: "lfo2Rate", name: "LFO 2 Rate", min: 0.01, max: 30, defaultValue: 5, unit: .hertz, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
    .init(id: 20, key: "lfo2Depth", name: "LFO 2 Depth", min: 0, max: 1, defaultValue: 0.2, unit: .generic, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
    .init(id: 21, key: "lfo2Offset", name: "LFO 2 Offset", min: -1, max: 1, defaultValue: 0, unit: .generic, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
    .init(id: 22, key: "randomRate", name: "Random Rate", min: 0.01, max: 30, defaultValue: 4, unit: .hertz, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
    .init(id: 23, key: "modEnvAttack", name: "Mod Env Attack", min: 0, max: 10, defaultValue: 0.01, unit: .seconds, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
    .init(id: 24, key: "modEnvDecay", name: "Mod Env Decay", min: 0, max: 10, defaultValue: 0.2, unit: .seconds, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
    .init(id: 25, key: "modEnvSustain", name: "Mod Env Sustain", min: 0, max: 1, defaultValue: 0.7, unit: .generic, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
    .init(id: 26, key: "modEnvRelease", name: "Mod Env Release", min: 0, max: 10, defaultValue: 0.4, unit: .seconds, flags: [.flag_IsWritable, .flag_IsReadable, .flag_CanRamp]),
]

func makeCosmoParameterTree() -> AUParameterTree {
    let parameters = cosmoParameterSpecs.map { spec in
        AUParameterTree.createParameter(
            withIdentifier: spec.key,
            name: spec.name,
            address: spec.id,
            min: spec.min,
            max: spec.max,
            unit: spec.unit,
            unitName: nil,
            flags: spec.flags,
            valueStrings: nil,
            dependentParameters: nil
        )
    }
    for (parameter, spec) in zip(parameters, cosmoParameterSpecs) {
        parameter.value = spec.defaultValue
    }
    return AUParameterTree.createTree(withChildren: parameters)
}