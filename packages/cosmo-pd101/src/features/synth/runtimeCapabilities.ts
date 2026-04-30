export type SynthRuntime = "web" | "plugin";

export type SynthRuntimeCapabilities = {
	showVersionIndicator: boolean;
};

const WEB_CAPABILITIES: SynthRuntimeCapabilities = {
	showVersionIndicator: false,
};

const PLUGIN_CAPABILITIES: SynthRuntimeCapabilities = {
	showVersionIndicator: true,
};

export function getSynthRuntimeCapabilities(
	runtime: SynthRuntime,
): SynthRuntimeCapabilities {
	return runtime === "plugin" ? PLUGIN_CAPABILITIES : WEB_CAPABILITIES;
}
