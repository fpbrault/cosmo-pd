import { describe, expect, it } from "vitest";
import {
	type PresetImportFile,
	preparePresetImportFiles,
} from "./presetImport";

function makePacket(manufacturer = 0x44): Uint8Array {
	return new Uint8Array([
		0xf0,
		manufacturer,
		0x00,
		0x00,
		0x70,
		0x20,
		0x60,
		...new Array(256).fill(0x00),
		0xf7,
	]);
}

function createFile(filename: string, data: Uint8Array): PresetImportFile {
	return { filename, data };
}

describe("preparePresetImportFiles", () => {
	it("prepares one CZ SysEx patch using the file name", () => {
		const result = preparePresetImportFiles([
			createFile("Warm Pad.SYX", makePacket()),
		]);

		expect(result.failures).toEqual([]);
		expect(result.imports).toHaveLength(1);
		expect(result.imports[0]?.filename).toBe("Warm Pad");
		expect(JSON.parse(result.imports[0]?.json ?? "null")).toMatchObject({
			schemaVersion: 1,
		});
	});

	it("splits concatenated SysEx messages and names them in order", () => {
		const result = preparePresetImportFiles([
			createFile(
				"Bank.syx",
				new Uint8Array([...makePacket(), ...makePacket()]),
			),
		]);

		expect(result.failures).toEqual([]);
		expect(result.imports.map((entry) => entry.filename)).toEqual([
			"Bank 01",
			"Bank 02",
		]);
	});

	it("keeps valid messages when another message is invalid", () => {
		const result = preparePresetImportFiles([
			createFile(
				"Mixed.syx",
				new Uint8Array([...makePacket(), ...makePacket(0x01)]),
			),
		]);

		expect(result.imports).toHaveLength(1);
		expect(result.failures).toEqual([
			expect.objectContaining({ filename: "Mixed.syx [message 2]" }),
		]);
	});

	it("accepts a single unframed patch and rejects incomplete framing", () => {
		const packet = makePacket();
		const unframed = packet.slice(1, -1);
		expect(
			preparePresetImportFiles([createFile("Unframed.syx", unframed)]).imports,
		).toHaveLength(1);

		const incomplete = packet.slice(0, -1);
		expect(
			preparePresetImportFiles([createFile("Incomplete.syx", incomplete)])
				.failures,
		).toEqual([
			expect.objectContaining({
				filename: "Incomplete.syx",
				reason: expect.stringContaining("terminator"),
			}),
		]);
	});

	it("accepts serialized presets and reports unsupported file types", () => {
		const result = preparePresetImportFiles([
			createFile("preset.json", new TextEncoder().encode("{}")),
			createFile("notes.txt", new TextEncoder().encode("ignored")),
		]);

		expect(result.imports).toEqual([
			expect.objectContaining({ filename: "preset", json: "{}" }),
		]);
		expect(result.failures).toEqual([
			expect.objectContaining({ filename: "notes.txt" }),
		]);
	});
});
