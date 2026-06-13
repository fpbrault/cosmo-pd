import type { PluginBridgeWindowFacade, SynthParams } from "@cosmo/cosmo-pd101";

let installed = false;
let currentParams: SynthParams | null = null;

const standaloneMethods = {
	__czGetParams: async () => {
		if (!currentParams) {
			throw new Error("[standaloneBridge] synth params not initialized");
		}
		return currentParams;
	},
	__czSetParams: (params) => {
		currentParams = params;
	},
	__czGetVoiceLimit: async () => 8,
	__czSetVoiceLimit: () => {},
	__czGetTransportInfo: async () => ({
		playing: false,
		recording: false,
		tempo: 120,
		timeSigNum: 4,
		timeSigDen: 4,
		positionSamples: 0,
		positionSeconds: 0,
		positionBeats: 0,
		barStartBeats: 0,
		loopActive: false,
		loopStartBeats: 0,
		loopEndBeats: 0,
	}),
} satisfies Partial<PluginBridgeWindowFacade>;

function shouldInstallStandaloneBridge(): boolean {
	const params = new URLSearchParams(window.location.search);
	return params.get("standalone") === "1";
}

export function ensureStandaloneBridge(): boolean {
	if (installed) {
		return true;
	}
	if (!shouldInstallStandaloneBridge()) {
		return false;
	}

	installed = true;
	window.ipc = {
		postMessage() {
			// Standalone UI mode does not have a plugin host to notify.
		},
	};
	Object.assign(window, standaloneMethods);
	return true;
}
