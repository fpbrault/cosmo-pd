import { beforeEach, describe, expect, it } from "vitest";
import { useModulationTargetStore } from "./modulationTargetStore";

describe("modulationTargetStore", () => {
	beforeEach(() => {
		useModulationTargetStore.setState({
			modMode: false,
			pendingDestination: null,
		});
	});

	it("starts with default state", () => {
		expect(useModulationTargetStore.getState()).toMatchObject({
			modMode: false,
			pendingDestination: null,
		});
	});

	it("toggles mod mode and supports pending destination updates", () => {
		const store = useModulationTargetStore.getState();
		store.setModMode(true);
		expect(useModulationTargetStore.getState().modMode).toBe(true);
		store.setPendingDestination("volume");
		expect(useModulationTargetStore.getState().pendingDestination).toBe(
			"volume",
		);
		store.clearPendingDestination();
		expect(useModulationTargetStore.getState().pendingDestination).toBeNull();
	});
});
