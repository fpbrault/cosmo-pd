import { describe, expect, it } from "vitest";
import { DEFAULT_PRESET } from "./presetStorage";
import { exportPresetToToml, parsePresetToml } from "./presetTomlExchange";

describe("presetTomlExchange", () => {
	it("exports full-param TOML without version fields", () => {
		const toml = exportPresetToToml({
			id: "preset-test",
			name: "Full TOML",
			author: "Tester",
			description: "Readable preset.",
			tags: ["lead", "synth"],
			starred: true,
			favorite: true,
			source: "cz-factory",
			data: {
				...DEFAULT_PRESET,
				params: {
					...DEFAULT_PRESET.params,
					volume: 0.42,
					fxSlots: [
						{ type: "empty" },
						{ type: "empty" },
						{ type: "empty" },
						{
							type: "vibrato",
							params: {
								enabled: true,
								waveform: 1,
								rate: 50,
								depth: 26,
								delay: 0,
							},
						},
						{ type: "empty" },
						{ type: "empty" },
					],
					modMatrix: {
						routes: [
							{
								source: "lfo1",
								destination: "filterCutoff",
								amount: 0.3,
								enabled: true,
							},
						],
					},
				},
			},
		});

		expect(toml).toContain('format = "cosmo-preset"');
		expect(toml).not.toContain("formatVersion");
		expect(toml).not.toContain("presetSchemaVersion");
		expect(toml).not.toContain("schemaVersion");
		expect(toml).toContain("[params]");
		expect(toml).toContain("[params.fx.slot4]");
		expect(toml).toContain("[params.fx.slot4.params]");
		expect(toml).toContain("[[params.mod.routes]]");

		const parsed = parsePresetToml(toml);
		expect(parsed).toEqual(
			expect.objectContaining({
				id: "preset-test",
				name: "Full TOML",
				author: "Tester",
				description: "Readable preset.",
				tags: ["lead", "synth"],
				starred: true,
				favorite: true,
			}),
		);
		expect(parsed?.data.schemaVersion).toBe(1);
		expect(parsed?.data.params.volume).toBe(0.42);
		expect(parsed?.data.params.fxSlots?.[3]).toEqual({
			type: "vibrato",
			params: {
				enabled: true,
				waveform: 1,
				rate: 50,
				depth: 26,
				delay: 0,
			},
		});
		expect(parsed?.data.params.modMatrix?.routes).toEqual([
			{
				source: "lfo1",
				destination: "filterCutoff",
				amount: 0.3,
				enabled: true,
			},
		]);
	});

	it("imports omitted no-op structures as empty FX slots and no modulation routes", () => {
		const toml = exportPresetToToml({
			name: "No Ops",
			data: {
				...DEFAULT_PRESET,
				params: {
					...DEFAULT_PRESET.params,
					fxSlots: [
						{ type: "empty" },
						{ type: "empty" },
						{ type: "empty" },
						{ type: "empty" },
						{ type: "empty" },
						{ type: "empty" },
					],
					modMatrix: { routes: [] },
				},
			},
		});

		expect(toml).not.toContain("[params.fx.");
		expect(toml).not.toContain("[[params.mod.routes]]");

		const parsed = parsePresetToml(toml);
		expect(parsed?.data.params.fxSlots).toEqual([
			{ type: "empty" },
			{ type: "empty" },
			{ type: "empty" },
			{ type: "empty" },
			{ type: "empty" },
			{ type: "empty" },
		]);
		expect(parsed?.data.params.modMatrix?.routes).toEqual([]);
	});
});
