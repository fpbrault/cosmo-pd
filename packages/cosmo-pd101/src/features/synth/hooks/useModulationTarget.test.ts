import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useModulationTargetStore } from "../modulationTargetStore";
import { useModulationTarget } from "./useModulationTarget";

describe("useModulationTarget", () => {
	beforeEach(() => {
		useModulationTargetStore.setState({
			modMode: false,
			pendingDestination: null,
		});
	});

	it("returns null state when mod mode is off", () => {
		const { result } = renderHook(() =>
			useModulationTarget({ destination: "volume" }),
		);
		expect(result.current.modulationTargetState).toBeNull();
	});

	it("targets and clears only matching destination", () => {
		useModulationTargetStore.getState().setModMode(true);
		const { result } = renderHook(() =>
			useModulationTarget({ destination: "volume" }),
		);
		act(() => result.current.onTarget());
		expect(result.current.modulationTargetState).toBe("targeted");
		act(() => result.current.onClose());
		expect(useModulationTargetStore.getState().pendingDestination).toBeNull();
	});
});
