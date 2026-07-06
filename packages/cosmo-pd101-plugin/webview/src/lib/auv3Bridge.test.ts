import { describe, expect, it, vi } from "vitest";
import {
	AUV3_SCOPE_BINARY_URL,
	decodeAuv3BinaryScopeFrame,
	publishAuv3HostActiveFromWeb,
	readAuv3ScopeFrame,
} from "./auv3Bridge";

function binaryScopeFrame(sampleRate: number, hz: number, samples: number[]) {
	const buffer = new ArrayBuffer(8 + samples.length * 4);
	const view = new DataView(buffer);
	view.setFloat32(0, sampleRate, true);
	view.setFloat32(4, hz, true);
	for (const [index, sample] of samples.entries()) {
		view.setFloat32(8 + index * 4, sample, true);
	}
	return buffer;
}

describe("auv3Bridge scope transport", () => {
	it("decodes binary scope frames", () => {
		const frame = decodeAuv3BinaryScopeFrame(
			binaryScopeFrame(48_000, 220, [0.25, -0.5]),
		);

		expect(frame?.sampleRate).toBe(48_000);
		expect(frame?.hz).toBe(220);
		expect(Array.from(frame?.samples ?? [])).toEqual([0.25, -0.5]);
	});

	it("uses binary fetch before RPC fallback", async () => {
		const fetchScope = vi.fn(async () => {
			return new Response(binaryScopeFrame(44_100, 110, [0.1]));
		});
		const invokeScope = vi.fn(async () => ({
			samples: [0.9],
			sampleRate: 48_000,
			hz: 220,
		}));

		const frame = await readAuv3ScopeFrame(fetchScope, invokeScope);

		expect(fetchScope).toHaveBeenCalledWith(AUV3_SCOPE_BINARY_URL);
		expect(invokeScope).not.toHaveBeenCalled();
		expect(frame?.sampleRate).toBe(44_100);
		expect(frame?.hz).toBe(110);
		expect(Array.from(frame?.samples ?? [])).toEqual([0.10000000149011612]);
	});

	it("falls back to legacy RPC scope data when binary fetch fails", async () => {
		const fetchScope = vi.fn(async () => {
			return new Response(null, { status: 404 });
		});
		const invokeScope = vi.fn(async () => ({
			samples: [0.25, null, -0.25],
			sampleRate: 48_000,
			hz: 330,
		}));

		const frame = await readAuv3ScopeFrame(fetchScope, invokeScope);

		expect(fetchScope).toHaveBeenCalledWith(AUV3_SCOPE_BINARY_URL);
		expect(invokeScope).toHaveBeenCalledOnce();
		expect(frame?.sampleRate).toBe(48_000);
		expect(frame?.hz).toBe(330);
		expect(Array.from(frame?.samples ?? [])).toEqual([0.25, -0.25]);
	});

	it("publishes host activity from web visibility without native JavaScript", () => {
		const inactive = vi.fn();
		const active = vi.fn();
		window.__czAuv3HostActive = true;
		window.addEventListener("cz-auv3-host-inactive", inactive);
		window.addEventListener("cz-auv3-host-active", active);

		publishAuv3HostActiveFromWeb(false);
		publishAuv3HostActiveFromWeb(false);
		publishAuv3HostActiveFromWeb(true);

		expect(window.__czAuv3HostActive).toBe(true);
		expect(inactive).toHaveBeenCalledOnce();
		expect(active).toHaveBeenCalledOnce();
	});
});
