#ifndef COSMO_PD101_FFI_H
#define COSMO_PD101_FFI_H

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct CosmoPd101FfiEngine CosmoPd101FfiEngine;

typedef struct CosmoPd101FfiParamInfo {
    uint32_t id;
    char key[64];
    char label[64];
    float default_value;
    float min_value;
    float max_value;
    uint32_t flags;
} CosmoPd101FfiParamInfo;

typedef enum CosmoPd101FfiStatus {
    CosmoPd101FfiStatusOk = 0,
    CosmoPd101FfiStatusNullPointer = 1,
    CosmoPd101FfiStatusInvalidArgument = 2,
    CosmoPd101FfiStatusBufferTooSmall = 3,
    CosmoPd101FfiStatusJsonError = 4,
} CosmoPd101FfiStatus;

CosmoPd101FfiEngine* cosmo_pd101_ffi_engine_create(float sample_rate, size_t max_frames);
void cosmo_pd101_ffi_engine_destroy(CosmoPd101FfiEngine* engine);

CosmoPd101FfiStatus cosmo_pd101_ffi_reset_audio_state(CosmoPd101FfiEngine* engine);
CosmoPd101FfiStatus cosmo_pd101_ffi_set_params_json(
    CosmoPd101FfiEngine* engine,
    const char* json
);
size_t cosmo_pd101_ffi_get_params_json(
    const CosmoPd101FfiEngine* engine,
    uint8_t* output,
    size_t output_len
);
size_t cosmo_pd101_ffi_get_runtime_voice_states_json(
    const CosmoPd101FfiEngine* engine,
    uint8_t* output,
    size_t output_len
);

size_t cosmo_pd101_ffi_get_parameter_count(void);
CosmoPd101FfiStatus cosmo_pd101_ffi_get_parameter_info(
    size_t index,
    CosmoPd101FfiParamInfo* out_info
);
CosmoPd101FfiStatus cosmo_pd101_ffi_get_parameter_value(
    const CosmoPd101FfiEngine* engine,
    uint32_t id,
    float* out_value
);
CosmoPd101FfiStatus cosmo_pd101_ffi_set_parameter_value(
    CosmoPd101FfiEngine* engine,
    uint32_t id,
    float value
);

CosmoPd101FfiStatus cosmo_pd101_ffi_note_on(
    CosmoPd101FfiEngine* engine,
    uint8_t note,
    float frequency,
    float velocity
);
CosmoPd101FfiStatus cosmo_pd101_ffi_note_off(CosmoPd101FfiEngine* engine, uint8_t note);
CosmoPd101FfiStatus cosmo_pd101_ffi_all_notes_off(CosmoPd101FfiEngine* engine);
CosmoPd101FfiStatus cosmo_pd101_ffi_set_sustain(CosmoPd101FfiEngine* engine, bool on);
CosmoPd101FfiStatus cosmo_pd101_ffi_set_pitch_bend(CosmoPd101FfiEngine* engine, float value);
CosmoPd101FfiStatus cosmo_pd101_ffi_set_mod_wheel(CosmoPd101FfiEngine* engine, float value);
CosmoPd101FfiStatus cosmo_pd101_ffi_set_aftertouch(CosmoPd101FfiEngine* engine, float value);

CosmoPd101FfiStatus cosmo_pd101_ffi_render_mono(
    CosmoPd101FfiEngine* engine,
    float* output,
    size_t frames
);
CosmoPd101FfiStatus cosmo_pd101_ffi_render_stereo(
    CosmoPd101FfiEngine* engine,
    float* output_left,
    float* output_right,
    size_t frames
);

size_t cosmo_pd101_ffi_copy_scope_i8(
    const CosmoPd101FfiEngine* engine,
    int8_t* output,
    size_t output_len,
    float* out_sample_rate,
    float* out_hz
);
size_t cosmo_pd101_ffi_copy_scope_f32(
    const CosmoPd101FfiEngine* engine,
    float* output,
    size_t output_len,
    float* out_sample_rate,
    float* out_hz
);

#ifdef __cplusplus
}
#endif

#endif