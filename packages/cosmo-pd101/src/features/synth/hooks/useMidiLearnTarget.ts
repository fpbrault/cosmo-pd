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
};

type MidiLearnVisualState = "available" | "mapped" | "targeted" | null;

export function useMidiLearnTarget({
	targetKey,
	label,
	apply,
}: UseMidiLearnTargetOptions) {
	const learnMode = useMidiLearnStore((state) => state.learnMode);
	const pendingLearnParam = useMidiLearnStore((state) =>
		targetKey ? state.pendingLearnParam : null,
	);
	const midiBinding = useMidiLearnStore((state) =>
		targetKey ? state.getBindingForParam(targetKey) : undefined,
	);

	useEffect(() => {
		if (!targetKey || !apply) {
			return;
		}

		return registerMidiLearnTarget(targetKey, {
			label,
			apply,
		});
	}, [apply, label, targetKey]);

	const handleContextMenu = useCallback(
		(e: React.MouseEvent) => {
			if (!targetKey) return;
			e.preventDefault();
			const store = useMidiLearnStore.getState();
			const bindings = store.getBindingsForParam(targetKey);
			if (bindings.length > 0) {
				store.removeBindingsForParam(targetKey);
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
			: pendingLearnParam === targetKey
				? "targeted"
				: midiBinding
					? "mapped"
					: "available";

	return {
		learnMode,
		midiLearnState,
		interactionLocked: learnMode,
		onClick: handleClick,
		onContextMenu: handleContextMenu,
	};
}
