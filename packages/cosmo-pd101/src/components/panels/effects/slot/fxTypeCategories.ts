import type { FxSlotType } from "@/lib/synth/bindings/synth";
import { FX_UI_META } from "../modules/core/fxSlotModuleConfig";

export interface FxCategory {
	id: string;
	label: string;
	effects: FxSlotType[];
}

export const FX_CATEGORIES: FxCategory[] = [
	{
		id: "delay-reverb",
		label: "Delay / Reverb",
		effects: ["delay", "grainDelay", "reverb", "shimmerVerb"],
	},
	{
		id: "modulation",
		label: "Modulation",
		effects: [
			"chorus",
			"junoChorus",
			"phaser",
			"flanger",
			"vibrato",
			"tremolo",
			"ringMod",
			"phaseMod",
		],
	},
	{
		id: "dynamics",
		label: "Dynamics",
		effects: ["compressor"],
	},
	{
		id: "filter-eq",
		label: "Filter / EQ",
		effects: ["multimodeFilter", "eq8Band"],
	},
	{
		id: "distortion",
		label: "Distortion",
		effects: ["distortion", "bitcrusher", "wavefolder", "loFi"],
	},
];

export function getFxTypeLabel(type: FxSlotType): string {
	return FX_UI_META[type]?.title ?? "Effect";
}

// SVG path data for each FX type — 24×24 viewBox, stroke-only, ~1.5 strokeWidth
export const FX_TYPE_ICONS: Record<FxSlotType, string> = {
	empty: "",
	delay: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z M12 8v4l3 3",
	grainDelay:
		"M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z M8 9h1 M10 7h1 M14 15h1 M17 14h1",
	reverb: "M4 12a8 6 0 0 0 16 0 M7 12a5 4 0 0 0 10 0 M10 12a2 2 0 0 0 4 0",
	shimmerVerb: "M4 12a8 6 0 0 0 16 0 M7 12a5 4 0 0 0 10 0 M12 4v2 M12 18v2",
	chorus: "M4 14q2-4 4 0t4 0t4 0t4 0 M4 10q2 4 4 0t4 0t4 0t4 0",
	junoChorus: "M4 12q2-4 4 0t4 0 M14 12q2-4 4 0t4 0",
	phaser: "M4 14q2-4 4 0t4 0t4 0t4 0 M6 10q2 4 4 0t4 0t4 0t2 0",
	flanger: "M4 8v8 M8 8v8 M12 8v8 M16 8v8 M20 8v8 M22 12l-2-2v4z",
	vibrato: "M4 12q2-5 4 0t4 0t4 0t4 0",
	tremolo: "M4 14q2-5 4 2t4-4t4 2t4-5",
	ringMod: "M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0 M8 8l8 8 M16 8l-8 8",
	phaseMod: "M4 12q2-4 4 0t4-3 4 0t4 0 M4 16q2 2 4-1t4 2 4-2",
	compressor: "M6 6v12 M18 6v12 M8 10h8 M8 14h8 M12 8v8",
	eq8Band: "M4 6v12 M7 4v16 M10 8v8 M13 10v4 M16 2v18 M19 6v12",
	multimodeFilter: "M4 20h4l4-8 4 4h8 M4 20h4l4-12 4 8h8",

	distortion: "M4 12q2-6 4 4t4 0t4 0t4-6 M6 16h12",
	bitcrusher: "M4 14h4v-4h4v6h4v-4h4v6",
	wavefolder: "M4 16l4-8 4 8 4-8 4 8",
	loFi: "M4 14q2-5 4 2t4-3t4 3t4-5 M8 8h1 M16 14h1 M12 18h1",
};
