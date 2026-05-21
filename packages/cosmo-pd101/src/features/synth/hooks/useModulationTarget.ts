import { useCallback } from "react";
import type { ModDestination } from "@/lib/synth/bindings/synth";
import { useModulationTargetStore } from "../modulationTargetStore";

type ModulationTargetVisualState = "available" | "targeted" | null;

type UseModulationTargetOptions = {
	destination: ModDestination;
};

export function useModulationTarget({
	destination,
}: UseModulationTargetOptions) {
	const modMode = useModulationTargetStore((state) => state.modMode);
	const pendingDestination = useModulationTargetStore(
		(state) => state.pendingDestination,
	);

	const handleTarget = useCallback(() => {
		const store = useModulationTargetStore.getState();
		if (!store.modMode) {
			return;
		}
		store.setPendingDestination(destination);
	}, [destination]);

	const handleClose = useCallback(() => {
		const store = useModulationTargetStore.getState();
		if (store.pendingDestination === destination) {
			store.clearPendingDestination();
		}
	}, [destination]);

	const modulationTargetState: ModulationTargetVisualState = !modMode
		? null
		: pendingDestination === destination
			? "targeted"
			: "available";

	return {
		modMode,
		modulationTargetState,
		interactionLocked: modMode && !pendingDestination,
		isTargeted: pendingDestination === destination,
		onTarget: handleTarget,
		onClose: handleClose,
	};
}
