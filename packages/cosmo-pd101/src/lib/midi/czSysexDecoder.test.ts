import { describe, expect, it } from "vitest";
import { decodeCzPatch } from "@/lib/midi/czSysexDecoder";

/** Build a canonical CZ-101 SysEx packet with 256 nibble bytes all set to zero. */
function makeZeroPacket(): Uint8Array {
	return new Uint8Array([
		0xf0,
		0x44,
		0x00,
		0x00,
		0x70,
		0x20,
		0x60, // 7-byte header
		...new Array(256).fill(0x00), // 256 nibble bytes
		0xf7, // terminator
	]);
}

/** Encode a single logical byte value into two nibble bytes at the given logical index. */
function setLogicalByte(
	packet: Uint8Array,
	logIdx: number,
	value: number,
): void {
	const offset = 7 + logIdx * 2;
	packet[offset] = value & 0x0f; // low nibble
	packet[offset + 1] = (value >> 4) & 0x0f; // high nibble
}

describe("decodeCzPatch", () => {
	it("returns null for null/undefined input", () => {
		expect(decodeCzPatch(null as unknown as Uint8Array)).toBeNull();
	});

	it("returns null for data that is too short", () => {
		expect(decodeCzPatch(new Uint8Array([0xf0, 0x44]))).toBeNull();
		expect(decodeCzPatch(new Uint8Array(10))).toBeNull();
	});

	it("returns null when payload contains non-nibble bytes", () => {
		const bad = new Uint8Array([
			0xf0,
			0x44,
			0x00,
			0x00,
			0x70,
			0x20,
			0x60,
			...new Array(256).fill(0xff), // invalid nibble bytes (> 0x0f)
			0xf7,
		]);
		expect(decodeCzPatch(bad)).toBeNull();
	});

	it("returns a DecodedPatch object for a valid all-zeros packet", () => {
		const packet = makeZeroPacket();
		const result = decodeCzPatch(packet);
		expect(result).not.toBeNull();
		expect(typeof result).toBe("object");
	});

	it("decodes default line select as L1 when PFLAG is 0", () => {
		const packet = makeZeroPacket();
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.lineSelect).toBe("L1");
	});

	it("decodes line select L2 when PFLAG bits 0-1 = 1", () => {
		const packet = makeZeroPacket();
		setLogicalByte(packet, 0, 0x01); // lineSelect bits = 01 → L2
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.lineSelect).toBe("L2");
	});

	it("decodes line select L1+1' when PFLAG bits 0-1 = 2", () => {
		const packet = makeZeroPacket();
		setLogicalByte(packet, 0, 0x02); // lineSelect bits = 10 → L1+1'
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.lineSelect).toBe("L1+1'");
	});

	it("decodes line select L1+2' when PFLAG bits 0-1 = 3", () => {
		const packet = makeZeroPacket();
		setLogicalByte(packet, 0, 0x03); // lineSelect bits = 11 → L1+2'
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.lineSelect).toBe("L1+2'");
	});

	it("decodes octave = 0 when PFLAG octave bits = 0", () => {
		const packet = makeZeroPacket();
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.octave).toBe(0);
	});

	it("decodes octave = 1 when PFLAG octave bits = 1", () => {
		const packet = makeZeroPacket();
		setLogicalByte(packet, 0, 0x04); // bits 2-3 = 01 → octave = 1
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.octave).toBe(1);
	});

	it("decodes octave = -1 when PFLAG octave bits = 2", () => {
		const packet = makeZeroPacket();
		setLogicalByte(packet, 0, 0x08); // bits 2-3 = 10 → octave = -1
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.octave).toBe(-1);
	});

	it("decodes detuneDirection as + by default (PDS = 0)", () => {
		const packet = makeZeroPacket();
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.detuneDirection).toBe("+");
	});

	it("decodes detuneDirection as - when PDS = 0x01", () => {
		const packet = makeZeroPacket();
		setLogicalByte(packet, 1, 0x01);
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.detuneDirection).toBe("-");
	});

	it("defaults vibratoWave to 1 when PVK is 0", () => {
		const packet = makeZeroPacket();
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.vibratoWave).toBe(1);
	});

	it("decodes vibratoWave = 2 when PVK = 0x04", () => {
		const packet = makeZeroPacket();
		setLogicalByte(packet, 4, 0x04);
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.vibratoWave).toBe(2);
	});

	it("decodes vibratoWave = 3 when PVK = 0x20", () => {
		const packet = makeZeroPacket();
		setLogicalByte(packet, 4, 0x20);
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.vibratoWave).toBe(3);
	});

	it("decodes vibratoWave = 4 when PVK = 0x02", () => {
		const packet = makeZeroPacket();
		setLogicalByte(packet, 4, 0x02);
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.vibratoWave).toBe(4);
	});

	it("returns envelope objects with 8 steps each", () => {
		const packet = makeZeroPacket();
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		for (const env of [
			result.dca1,
			result.dcw1,
			result.dco1Env,
			result.dca2,
			result.dcw2,
			result.dco2Env,
		]) {
			expect(env.steps).toHaveLength(8);
			expect(typeof env.endStep).toBe("number");
			expect(env.endStep).toBeGreaterThanOrEqual(1);
			expect(env.endStep).toBeLessThanOrEqual(8);
		}
	});

	it("masks DCO step bytes to 7-bit machine values", () => {
		const packet = makeZeroPacket();
		// Section 16 starts at logical index 55: [rate0, level0, ...].
		setLogicalByte(packet, 55, 0x80);
		setLogicalByte(packet, 56, 0x80);
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.dco1Env.steps[0].rate).toBe(0);
		expect(result.dco1Env.steps[0].level).toBe(0);
	});

	it("returns minimum endStep of 1 even when encoded end step byte is 0", () => {
		const packet = makeZeroPacket();
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.dca1.endStep).toBe(1);
	});

	it("decodes key follow values in range 0–9", () => {
		const packet = makeZeroPacket();
		setLogicalByte(packet, 16, 0x07);
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.dca1KeyFollow).toBe(7);
		expect(result.dcw1KeyFollow).toBeGreaterThanOrEqual(0);
		expect(result.dca2KeyFollow).toBeGreaterThanOrEqual(0);
		expect(result.dcw2KeyFollow).toBeGreaterThanOrEqual(0);
	});

	it("decodes DCO1 and DCO2 waveform configs", () => {
		const packet = makeZeroPacket();
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.dco1).toHaveProperty("firstWaveform");
		expect(result.dco1).toHaveProperty("modulation");
		expect(result.dco2).toHaveProperty("firstWaveform");
		expect(result.dco2).toHaveProperty("modulation");
	});

	it("decodes raw 3-bit waveform ids without WT extension remapping", () => {
		const packet = makeZeroPacket();
		// b1 = 111 000 0 0 -> first=111 (pulse2), second disabled.
		setLogicalByte(packet, 14, 0b11100000);
		setLogicalByte(packet, 15, 0);
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.dco1.firstWaveform).toBe(8);
		expect(result.dco1.secondWaveform).toBeNull();
	});

	it("decodes window and modulation bits from MFW", () => {
		const packet = makeZeroPacket();
		// wave1=101 (saw-pulse), wave2=001 (square), second enabled, window=011 (trapezoid), mod=011 (noise)
		setLogicalByte(packet, 14, 0b10100110);
		setLogicalByte(packet, 15, 0b11011000);
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.dco1.firstWaveform).toBe(6);
		expect(result.dco1.secondWaveform).toBe(2);
		expect(result.dco1.windowFunction).toBe(3);
		expect(result.dco1.modulation).toBe("noise");
	});

	it("accepts data without F0/F7 framing and adds it automatically", () => {
		// Provide a packet that lacks the 0xF0/0xF7 framing
		const inner = new Uint8Array([
			0x44,
			0x00,
			0x00,
			0x70,
			0x20,
			0x60,
			...new Array(256).fill(0x00),
		]);
		const result = decodeCzPatch(inner);
		// Should still succeed (ensureFraming adds the missing bytes)
		expect(result).not.toBeNull();
	});

	it("each envelope step has rate, level, and falling properties", () => {
		const packet = makeZeroPacket();
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		for (const step of result.dca1.steps) {
			expect(typeof step.rate).toBe("number");
			expect(typeof step.level).toBe("number");
			expect(typeof step.falling).toBe("boolean");
		}
	});

	it("vibratoDelay, vibratoRate, and vibratoDepth are numbers", () => {
		const packet = makeZeroPacket();
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(typeof result.vibratoDelay).toBe("number");
		expect(typeof result.vibratoRate).toBe("number");
		expect(typeof result.vibratoDepth).toBe("number");
	});

	it("detune values are within expected ranges", () => {
		const packet = makeZeroPacket();
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.detuneFine).toBeGreaterThanOrEqual(0);
		expect(result.detuneOctave).toBeGreaterThanOrEqual(0);
		expect(result.detuneNote).toBeGreaterThanOrEqual(0);
		expect(result.detuneNote).toBeLessThan(12);
	});

	it("decodes fine detune from quarter-unit PDL encoding", () => {
		const packet = makeZeroPacket();
		setLogicalByte(packet, 2, 40);
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.detuneFine).toBe(10);
	});

	it("ignores low PDL bits when decoding fine detune", () => {
		const packet = makeZeroPacket();
		setLogicalByte(packet, 2, 43);
		const result = decodeCzPatch(packet);
		if (!result) throw new Error("Expected patch to be defined");
		expect(result.detuneFine).toBe(10);
	});
});
