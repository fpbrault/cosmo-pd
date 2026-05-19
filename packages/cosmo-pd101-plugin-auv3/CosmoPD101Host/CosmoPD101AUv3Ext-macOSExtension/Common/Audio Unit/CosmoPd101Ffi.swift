import Foundation

public enum CosmoPd101FfiStatus: Int32 {
	case ok = 0
	case nullPointer = 1
	case invalidArgument = 2
	case bufferTooSmall = 3
	case jsonError = 4
}

public typealias CosmoPd101FfiEngineRef = OpaquePointer

@_silgen_name("cosmo_pd101_ffi_engine_create")
func cosmo_pd101_ffi_engine_create(_ sampleRate: Float, _ maxFrames: Int) -> CosmoPd101FfiEngineRef?

@_silgen_name("cosmo_pd101_ffi_engine_destroy")
func cosmo_pd101_ffi_engine_destroy(_ engine: CosmoPd101FfiEngineRef?)

@_silgen_name("cosmo_pd101_ffi_reset_audio_state")
func cosmo_pd101_ffi_reset_audio_state(_ engine: CosmoPd101FfiEngineRef?) -> Int32

@_silgen_name("cosmo_pd101_ffi_set_params_json")
func cosmo_pd101_ffi_set_params_json(_ engine: CosmoPd101FfiEngineRef?, _ json: UnsafePointer<CChar>?) -> Int32

@_silgen_name("cosmo_pd101_ffi_get_params_json")
func cosmo_pd101_ffi_get_params_json(_ engine: CosmoPd101FfiEngineRef?, _ output: UnsafeMutablePointer<UInt8>?, _ outputLen: Int) -> Int

@_silgen_name("cosmo_pd101_ffi_get_runtime_voice_states_json")
func cosmo_pd101_ffi_get_runtime_voice_states_json(_ engine: CosmoPd101FfiEngineRef?, _ output: UnsafeMutablePointer<UInt8>?, _ outputLen: Int) -> Int

@_silgen_name("cosmo_pd101_ffi_get_runtime_mod_sources_json")
func cosmo_pd101_ffi_get_runtime_mod_sources_json(_ engine: CosmoPd101FfiEngineRef?, _ output: UnsafeMutablePointer<UInt8>?, _ outputLen: Int) -> Int

@_silgen_name("cosmo_pd101_ffi_get_factory_preset_count")
func cosmo_pd101_ffi_get_factory_preset_count() -> Int

@_silgen_name("cosmo_pd101_ffi_get_factory_preset_name")
func cosmo_pd101_ffi_get_factory_preset_name(_ index: Int, _ output: UnsafeMutablePointer<UInt8>?, _ outputLen: Int) -> Int

@_silgen_name("cosmo_pd101_ffi_get_factory_preset_params_json")
func cosmo_pd101_ffi_get_factory_preset_params_json(_ index: Int, _ output: UnsafeMutablePointer<UInt8>?, _ outputLen: Int) -> Int

@_silgen_name("cosmo_pd101_ffi_get_parameter_value")
func cosmo_pd101_ffi_get_parameter_value(_ engine: CosmoPd101FfiEngineRef?, _ id: UInt32, _ outValue: UnsafeMutablePointer<Float>?) -> Int32

@_silgen_name("cosmo_pd101_ffi_set_parameter_value")
func cosmo_pd101_ffi_set_parameter_value(_ engine: CosmoPd101FfiEngineRef?, _ id: UInt32, _ value: Float) -> Int32

@_silgen_name("cosmo_pd101_ffi_note_on")
func cosmo_pd101_ffi_note_on(_ engine: CosmoPd101FfiEngineRef?, _ note: UInt8, _ frequency: Float, _ velocity: Float) -> Int32

@_silgen_name("cosmo_pd101_ffi_note_off")
func cosmo_pd101_ffi_note_off(_ engine: CosmoPd101FfiEngineRef?, _ note: UInt8) -> Int32

@_silgen_name("cosmo_pd101_ffi_all_notes_off")
func cosmo_pd101_ffi_all_notes_off(_ engine: CosmoPd101FfiEngineRef?) -> Int32

@_silgen_name("cosmo_pd101_ffi_set_sustain")
func cosmo_pd101_ffi_set_sustain(_ engine: CosmoPd101FfiEngineRef?, _ on: Bool) -> Int32

@_silgen_name("cosmo_pd101_ffi_set_pitch_bend")
func cosmo_pd101_ffi_set_pitch_bend(_ engine: CosmoPd101FfiEngineRef?, _ value: Float) -> Int32

@_silgen_name("cosmo_pd101_ffi_set_mod_wheel")
func cosmo_pd101_ffi_set_mod_wheel(_ engine: CosmoPd101FfiEngineRef?, _ value: Float) -> Int32

@_silgen_name("cosmo_pd101_ffi_set_aftertouch")
func cosmo_pd101_ffi_set_aftertouch(_ engine: CosmoPd101FfiEngineRef?, _ value: Float) -> Int32
@_silgen_name("cosmo_pd101_ffi_set_poly_aftertouch")
func cosmo_pd101_ffi_set_poly_aftertouch(_ engine: CosmoPd101FfiEngineRef?, _ note: UInt8, _ value: Float) -> Int32

@_silgen_name("cosmo_pd101_ffi_render_stereo")
func cosmo_pd101_ffi_render_stereo(_ engine: CosmoPd101FfiEngineRef?, _ left: UnsafeMutablePointer<Float>?, _ right: UnsafeMutablePointer<Float>?, _ frames: Int) -> Int32

@_silgen_name("cosmo_pd101_ffi_copy_scope_i8")
func cosmo_pd101_ffi_copy_scope_i8(_ engine: CosmoPd101FfiEngineRef?, _ output: UnsafeMutablePointer<Int8>?, _ outputLen: Int, _ outSampleRate: UnsafeMutablePointer<Float>?, _ outHz: UnsafeMutablePointer<Float>?) -> Int

@_silgen_name("cosmo_pd101_ffi_copy_scope_f32")
func cosmo_pd101_ffi_copy_scope_f32(_ engine: CosmoPd101FfiEngineRef?, _ output: UnsafeMutablePointer<Float>?, _ outputLen: Int, _ outSampleRate: UnsafeMutablePointer<Float>?, _ outHz: UnsafeMutablePointer<Float>?) -> Int
