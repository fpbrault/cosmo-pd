import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useSynthStore } from "@/features/synth/synthStore";
import { useSynthParamsToWorklet } from "./useSynthParamsToWorklet";

const syncMock = vi.fn();
const connectMock = vi.fn();
const disposeMock = vi.fn();

vi.mock("@/features/synth/engine/workletSynthEngineAdapter", () => ({
	createWorkletSynthEngineAdapter: vi.fn(() => ({
		sync: syncMock,
	})),
}));

vi.mock("@/features/synth/engine/synthEngineSnapshot", () => ({
	createSynthEngineSnapshot: vi.fn(() => ({ params: { volume: 1 } })),
}));

vi.mock("@/features/synth/engine/synthEngineAdapter", () => ({
	SynthEngineController: class {
		connect() {
			connectMock();
		}
		dispose() {
			disposeMock();
		}
	},
}));

describe("useSynthParamsToWorklet", () => {
	it("connects, syncs, subscribes, and disposes", () => {
		const unsub = vi.fn();
		const subscribeSpy = vi
			.spyOn(useSynthStore, "subscribe")
			.mockImplementation((listener) => {
				listener(useSynthStore.getState(), useSynthStore.getState());
				return unsub;
			});
		const postMessage = vi.fn();
		const workletNodeRef = {
			current: { port: { postMessage } },
		} as unknown as React.MutableRefObject<AudioWorkletNode | null>;
		const paramsRef = {
			current: {} as never,
		} as unknown as React.MutableRefObject<never>;

		const { rerender, unmount } = renderHook(
			({ effectivePitchHz }) =>
				useSynthParamsToWorklet({
					workletNodeRef,
					paramsRef,
					effectivePitchHz,
					gatherState: vi.fn(() => useSynthStore.getState().gatherState()),
				}),
			{ initialProps: { effectivePitchHz: 220 } },
		);

		expect(connectMock).toHaveBeenCalled();
		expect(syncMock).toHaveBeenCalled();
		expect(subscribeSpy).toHaveBeenCalled();

		rerender({ effectivePitchHz: 330 });
		expect(unsub).toHaveBeenCalledTimes(1);

		requestApplyModulePreset({
			module: "lfo1",
			preset: "basic",
			patch: {},
		});
		expect(postMessage).toHaveBeenCalledWith(
			expect.objectContaining({
				type: "applyModulePreset",
				module: "lfo1",
			}),
		);

		unmount();
		expect(disposeMock).toHaveBeenCalled();
	});

	it("no-ops module preset event when worklet is null", () => {
		const workletNodeRef = {
			current: null,
		} as unknown as React.MutableRefObject<AudioWorkletNode | null>;
		const paramsRef = {
			current: {} as never,
		} as unknown as React.MutableRefObject<never>;
		renderHook(() =>
			useSynthParamsToWorklet({
				workletNodeRef,
				paramsRef,
				effectivePitchHz: 440,
				gatherState: vi.fn(() => useSynthStore.getState().gatherState()),
			}),
		);
		expect(() =>
			requestApplyModulePreset({
				module: "lfo2",
				preset: "basic",
				patch: {},
			}),
		).not.toThrow();
	});
});
