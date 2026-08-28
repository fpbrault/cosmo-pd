import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import { useEnvelopePresetController } from "./useEnvelopePresetController";

const storage = vi.hoisted(() => ({
	deleteEnvelopePreset: vi.fn(),
	getEnvelopePresetEnvelope: vi.fn(),
	listEnvelopePresets: vi.fn(),
	saveEnvelopePreset: vi.fn(),
}));

vi.mock("@/lib/synth/envelopePresetStorage", () => storage);

const envelope: StepEnvData = {
	steps: Array.from({ length: 8 }, (_, index) => ({
		level: index,
		rate: index + 10,
	})),
	sustainStep: 0,
	stepCount: 2,
	loop: false,
};

describe("useEnvelopePresetController", () => {
	it("exposes factory shapes and applies them without persistence", async () => {
		storage.listEnvelopePresets.mockResolvedValue([]);
		const onApply = vi.fn();
		const { result } = renderHook(() =>
			useEnvelopePresetController({ envelope, onApply }),
		);

		await waitFor(() => expect(storage.listEnvelopePresets).toHaveBeenCalled());
		expect(result.current.presetOptions.map((option) => option.label)).toEqual([
			"Pluck",
			"Flat",
			"Alternator",
			"Short Swell",
			"Pluck and Rise",
			"Classic Decay",
			"Sustain then Decay",
			"Pulse Loop",
			"Long Swell",
		]);
		expect(result.current.builtinPresetIds).toEqual(
			new Set([
				"pluck",
				"flat",
				"alternator",
				"shortSwell",
				"pluckAndRise",
				"classicDecay",
				"sustainThenDecay",
				"pulseLoop",
				"longSwell",
			]),
		);
		expect(
			result.current.presetOptions.every(
				(option) => option.envelope.steps.length === 8,
			),
		).toBe(true);

		act(() => result.current.handlePresetChange("pulseLoop"));

		expect(onApply).toHaveBeenCalledWith(
			expect.objectContaining({ stepCount: 8, loop: true }),
		);
		expect(storage.saveEnvelopePreset).not.toHaveBeenCalled();
	});
});
