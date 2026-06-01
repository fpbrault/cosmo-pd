import { useCallback, useEffect } from "react";
import {
	type MidiLearnTargetKey,
	registerMidiLearnTarget,
} from "@/features/synth/midiLearnRegistry";
import { useMidiLearnStore } from "@/features/synth/midiLearnStore";

type UseMidiLearnTargetOptions = {
	targetKey?: MidiLearnTargetKey;
	label?: string;
	apply?: (rawValue: number) => void;
	mode?: "continuous" | "edge-trigger";
	threshold?: number;
};

type MidiLearnVisualState = "available" | "mapped" | "targeted" | null;

export function useMidiLearnTarget({
	targetKey,
	label,
	apply,
	mode,
	threshold,
}: UseMidiLearnTargetOptions) {
	const learnMode = useMidiLearnStore((state) => state.learnMode);
	const pendingLearnParam = useMidiLearnStore((state) =>
		targetKey ? state.pendingLearnParam : null,
	);
	const hasMidiBinding = useMidiLearnStore((state) =>
		targetKey
			? state.bindings.some((binding) => binding.paramKey === targetKey)
			: false,
	);

	useEffect(() => {
		if (!targetKey || !apply) {
			return;
		}

		return registerMidiLearnTarget(targetKey, {
			label,
			apply,
			mode,
			threshold,
		});
	}, [apply, label, mode, targetKey, threshold]);

	const handleContextMenu = useCallback(
		(e: React.MouseEvent) => {
			if (!targetKey) return;
			e.preventDefault();
			const store = useMidiLearnStore.getState();
			const bindings = store.getBindingsForParam(targetKey);
			for (const binding of bindings) {
				store.removeBinding(binding);
			}
		},
		[targetKey],
	);

	const handleClick = useCallback(() => {
		const store = useMidiLearnStore.getState();
		if (store.learnMode && targetKey) {
			store.setPendingLearnParam(targetKey);
		}
	}, [targetKey]);

	const midiLearnState: MidiLearnVisualState =
		!learnMode || !targetKey
			? null
			: hasMidiBinding
				? "mapped"
				: pendingLearnParam === targetKey
					? "targeted"
					: "available";

	return {
		learnMode,
		midiLearnState,
		interactionLocked: learnMode,
		onClick: handleClick,
		onContextMenu: handleContextMenu,
	};
}
