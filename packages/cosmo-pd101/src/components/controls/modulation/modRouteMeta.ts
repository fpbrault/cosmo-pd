import type { ModSource } from "@/lib/synth/bindings/synth";

export const MOD_SOURCE_META: Record<
	ModSource,
	{ label: string; shortLabel: string; colorClass: string; bgClass: string }
> = {
	lfo1: {
		label: "LFO 1",
		shortLabel: "LFO1",
		colorClass: "text-cz-light-blue",
		bgClass: "bg-cz-light-blue/20 border-cz-light-blue/40",
	},
	lfo2: {
		label: "LFO 2",
		shortLabel: "LFO2",
		colorClass: "text-cz-light-blue/60",
		bgClass: "bg-cz-light-blue/10 border-cz-light-blue/20",
	},
	random: {
		label: "Random",
		shortLabel: "RND",
		colorClass: "text-orange-400",
		bgClass: "bg-orange-500/20 border-orange-500/40",
	},
	modEnv: {
		label: "Mod Env",
		shortLabel: "ENV",
		colorClass: "text-pink-400",
		bgClass: "bg-pink-500/20 border-pink-500/40",
	},
	velocity: {
		label: "Velocity",
		shortLabel: "VEL",
		colorClass: "text-emerald-400",
		bgClass: "bg-emerald-500/20 border-emerald-500/40",
	},
	modWheel: {
		label: "Mod Wheel",
		shortLabel: "MW",
		colorClass: "text-violet-400",
		bgClass: "bg-violet-500/20 border-violet-500/40",
	},
	aftertouch: {
		label: "Aftertouch",
		shortLabel: "AT",
		colorClass: "text-amber-400",
		bgClass: "bg-amber-500/20 border-amber-500/40",
	},
	macro1: {
		label: "Macro 1",
		shortLabel: "M1",
		colorClass: "text-cyan-400",
		bgClass: "bg-cyan-500/20 border-cyan-500/40",
	},
	macro2: {
		label: "Macro 2",
		shortLabel: "M2",
		colorClass: "text-teal-400",
		bgClass: "bg-teal-500/20 border-teal-500/40",
	},
	macro3: {
		label: "Macro 3",
		shortLabel: "M3",
		colorClass: "text-sky-400",
		bgClass: "bg-sky-500/20 border-sky-500/40",
	},
	macro4: {
		label: "Macro 4",
		shortLabel: "M4",
		colorClass: "text-indigo-400",
		bgClass: "bg-indigo-500/20 border-indigo-500/40",
	},
};

export const MOD_SOURCE_OPTIONS: { label: string; value: ModSource }[] = [
	{ label: "LFO 1", value: "lfo1" },
	{ label: "LFO 2", value: "lfo2" },
	{ label: "Random", value: "random" },
	{ label: "Mod Env", value: "modEnv" },
	{ label: "Velocity", value: "velocity" },
	{ label: "Mod Wheel", value: "modWheel" },
	{ label: "Aftertouch", value: "aftertouch" },
	{ label: "Macro 1", value: "macro1" },
	{ label: "Macro 2", value: "macro2" },
	{ label: "Macro 3", value: "macro3" },
	{ label: "Macro 4", value: "macro4" },
];
