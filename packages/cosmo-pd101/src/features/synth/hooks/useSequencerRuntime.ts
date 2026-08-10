import { useEffect, useState } from "react";

export type SequencerRuntimeState = {
	playing: boolean;
	currentStep: number;
	sourceNoteCount: number;
	latched: boolean;
};

export const EMPTY_SEQUENCER_RUNTIME_STATE: SequencerRuntimeState = {
	playing: false,
	currentStep: 0,
	sourceNoteCount: 0,
	latched: false,
};

function normalize(value: unknown): SequencerRuntimeState | null {
	if (!value || typeof value !== "object") return null;
	const detail = value as Record<string, unknown>;
	const readCount = (key: string) => {
		const candidate = detail[key];
		return typeof candidate === "number" && Number.isFinite(candidate)
			? Math.max(0, Math.round(candidate))
			: 0;
	};
	return {
		playing: detail.playing === true,
		currentStep: readCount("currentStep"),
		sourceNoteCount: readCount("sourceNoteCount"),
		latched: detail.latched === true,
	};
}

export function useSequencerRuntime(): SequencerRuntimeState {
	const [state, setState] = useState(EMPTY_SEQUENCER_RUNTIME_STATE);

	useEffect(() => {
		const onRuntimeState = (event: Event) => {
			const next = normalize((event as CustomEvent<unknown>).detail);
			if (next) setState(next);
		};
		window.addEventListener("cz-runtime-sequencer-state", onRuntimeState);
		return () => {
			window.removeEventListener("cz-runtime-sequencer-state", onRuntimeState);
		};
	}, []);

	return state;
}
