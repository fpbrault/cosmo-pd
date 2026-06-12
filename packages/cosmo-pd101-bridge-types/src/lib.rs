#[cfg(feature = "specta-bindings")]
extern crate specta;

mod session;
mod ipc;

pub use session::PresetSession;
pub use ipc::{PluginIpcRequest, PluginIpcEnvelope, LoadPresetPayload};
