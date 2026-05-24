import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMidiLearnTargetRegistration } from "../midiLearnRegistry";
import { useMidiLearnStore } from "../midiLearnStore";
import { useMidiLearnTarget } from "./useMidiLearnTarget";

describe("useMidiLearnTarget", () => {
	beforeEach(() => {
		localStorage.clear();
		useMidiLearnStore.setState({
			learnMode: false,
			bindings: {},
			lastCapturedCc: null,
			pendingLearnParam: null,
		});
	});

	it("returns null state with no target key", () => {
		const { result } = renderHook(() => useMidiLearnTarget({}));
		expect(result.current.midiLearnState).toBeNull();
	});

	it("switches available/targeted/mapped visual states", () => {
		act(() => {
			useMidiLearnStore.getState().setLearnMode(true);
		});
		const { result } = renderHook(() =>
			useMidiLearnTarget({ targetKey: "macro1", apply: vi.fn() }),
		);
		expect(result.current.midiLearnState).toBe("available");

		act(() => result.current.onClick());
		expect(result.current.midiLearnState).toBe("targeted");

		act(() => {
			useMidiLearnStore.getState().addOrReplaceBinding(0, 18, "macro1");
		});
		expect(result.current.midiLearnState).toBe("targeted");
		act(() => {
			useMidiLearnStore.getState().setPendingLearnParam(null);
		});
		expect(result.current.midiLearnState).toBe("mapped");
	});

	it("registers and unregisters custom apply targets", () => {
		const apply = vi.fn();
		const { unmount } = renderHook(() =>
			useMidiLearnTarget({
				targetKey: "custom-target",
				label: "Custom",
				apply,
			}),
		);
		expect(getMidiLearnTargetRegistration("custom-target")).toBeDefined();
		unmount();
		expect(getMidiLearnTargetRegistration("custom-target")).toBeUndefined();
	});
});
