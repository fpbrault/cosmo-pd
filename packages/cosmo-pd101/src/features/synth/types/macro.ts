import type { ModDestination } from "@/lib/synth/bindings/synth";

export type MacroAssignment = {
	macroIndex: number;
	destination: ModDestination;
	depth: number;
	enabled: boolean;
};
