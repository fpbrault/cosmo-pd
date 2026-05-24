import { describe, expect, it } from "vitest";
import { createPresetId } from "./presetIdentity";
import { DEFAULT_PRESET } from "./presetStorage";

function baseIdentity() {
	return {
		name: "Init",
		source: "user" as const,
		author: "Test",
		starred: false,
		tags: ["synth"],
		data: DEFAULT_PRESET,
	};
}

describe("presetIdentity", () => {
	it("returns deterministic ids for identical inputs", () => {
		const identity = baseIdentity();
		const left = createPresetId(identity);
		const right = createPresetId(identity);
		expect(left).toBe(right);
	});

	it("returns different ids for different inputs", () => {
		const first = createPresetId(baseIdentity());
		const second = createPresetId({
			...baseIdentity(),
			name: "Init 2",
		});
		expect(first).not.toBe(second);
	});

	it("uses the expected preset_ + 16 hex format", () => {
		const id = createPresetId(baseIdentity());
		expect(id).toMatch(/^preset_[0-9a-f]{16}$/);
	});

	it("normalizes NaN, -0, and Infinity before hashing", () => {
		const withInvalids = createPresetId({
			...baseIdentity(),
			data: {
				...DEFAULT_PRESET,
				params: {
					...DEFAULT_PRESET.params,
					volume: Number.NaN,
					line1: {
						...DEFAULT_PRESET.params.line1,
						dcwBase: -0,
					},
					line2: {
						...DEFAULT_PRESET.params.line2,
						dcwBase: Number.POSITIVE_INFINITY,
					},
				},
			},
		});
		const normalized = createPresetId({
			...baseIdentity(),
			data: {
				...DEFAULT_PRESET,
				params: {
					...DEFAULT_PRESET.params,
					volume: 0,
					line1: {
						...DEFAULT_PRESET.params.line1,
						dcwBase: 0,
					},
					line2: {
						...DEFAULT_PRESET.params.line2,
						dcwBase: 0,
					},
				},
			},
		});
		expect(withInvalids).toBe(normalized);
	});

	it("ignores id fields during canonicalization", () => {
		const idWithField = createPresetId({
			...baseIdentity(),
			data: {
				...DEFAULT_PRESET,
				id: "abc",
			} as typeof DEFAULT_PRESET & { id: string },
		});
		const idWithoutField = createPresetId(baseIdentity());
		expect(idWithField).toBe(idWithoutField);
	});
});
