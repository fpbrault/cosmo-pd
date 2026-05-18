import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	EMPTY_HOST_TRANSPORT,
	useHostTransport,
} from "@/features/synth/hooks/useHostTransport";

describe("useHostTransport", () => {
	it("starts with the empty transport snapshot", () => {
		const { result } = renderHook(() => useHostTransport());
		expect(result.current).toEqual(EMPTY_HOST_TRANSPORT);
	});

	it("updates from host transport events", () => {
		const { result } = renderHook(() => useHostTransport());

		act(() => {
			window.dispatchEvent(
				new CustomEvent("cz-host-transport", {
					detail: {
						playing: true,
						recording: false,
						tempo: 138,
						timeSigNum: 7,
						timeSigDen: 8,
						positionSamples: 4096,
						positionSeconds: 2.75,
						positionBeats: 6.5,
						barStartBeats: 0,
						loopActive: true,
						loopStartBeats: 4,
						loopEndBeats: 12,
					},
				}),
			);
		});

		expect(result.current).toEqual({
			available: true,
			playing: true,
			recording: false,
			tempo: 138,
			timeSigNum: 7,
			timeSigDen: 8,
			positionSamples: 4096,
			positionSeconds: 2.75,
			positionBeats: 6.5,
			barStartBeats: 0,
			loopActive: true,
			loopStartBeats: 4,
			loopEndBeats: 12,
		});
	});
});
