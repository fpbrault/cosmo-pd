import type { SynthesisMethod } from "./bindings/synth";

export interface SynthesisEngineUiDefinition {
	name: string;
	primaryPageLabel: string;
	secondaryPageLabel: string;
}

export const SYNTHESIS_ENGINE_UI_DEFINITIONS = {
	pd: {
		name: "PD / Warp",
		primaryPageLabel: "WAVE FORM",
		secondaryPageLabel: "ENV",
	},
	karpunk: {
		name: "Karpunk",
		primaryPageLabel: "STRING",
		secondaryPageLabel: "ENV",
	},
} satisfies Record<SynthesisMethod, SynthesisEngineUiDefinition>;
