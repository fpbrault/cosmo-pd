import { describe, expect, it } from "vitest";
import {
	adsrPreviewPath,
	buildAdsrGeometry,
	estimateEnvelopeMarkerForPhase,
	type ModEnvPreviewMode,
} from "./modEnvelopePreview";

const ATTACK = 0.05;
const DECAY = 0.2;
const SUSTAIN = 0.7;
const RELEASE = 0.3;

describe("buildAdsrGeometry", () => {
	it("ADSR: ySustain = bottom - sustain * span", () => {
		const geo = buildAdsrGeometry(ATTACK, DECAY, SUSTAIN, RELEASE, "adsr");
		expect(geo.bottom).toBe(56);
		expect(geo.top).toBe(8);
		const span = (56 - 8) * 0.78;
		expect(geo.ySustain).toBeCloseTo(56 - SUSTAIN * span, 6);
		expect(geo.x3).toBe(geo.x2);
		expect(geo.x4).toBeGreaterThanOrEqual(geo.x3);
	});

	it("ADR: ySustain reflects the sustain level (not baseline)", () => {
		const geo = buildAdsrGeometry(ATTACK, DECAY, SUSTAIN, RELEASE, "adr");
		const span = (56 - 8) * 0.78;
		expect(geo.ySustain).toBeCloseTo(56 - SUSTAIN * span, 6);
		expect(geo.ySustain).toBeLessThan(geo.bottom);
	});

	it("ADR: ySustain tracks sustain value (sustain=1 → ySustain at top)", () => {
		const geo = buildAdsrGeometry(ATTACK, DECAY, 1, RELEASE, "adr");
		const span = (56 - 8) * 0.78;
		expect(geo.ySustain).toBeCloseTo(56 - 1 * span, 6);
	});

	it("default mode is ADSR (ySustain reflects sustain)", () => {
		const explicit = buildAdsrGeometry(ATTACK, DECAY, SUSTAIN, RELEASE, "adsr");
		const defaulted = buildAdsrGeometry(ATTACK, DECAY, SUSTAIN, RELEASE);
		expect(defaulted).toEqual(explicit);
	});
});

describe("adsrPreviewPath", () => {
	function parseCoords(path: string): Array<{ x: number; y: number }> {
		return path
			.split(" ")
			.reduce<Array<{ x: number; y: number }>>((acc, token, idx) => {
				if (token === "M" || token === "L") {
					const x = Number(path.split(" ")[idx + 1]);
					const y = Number(path.split(" ")[idx + 2]);
					acc.push({ x, y });
				}
				return acc;
			}, []);
	}

	it("ADSR path anchors decay segment at ySustain", () => {
		const geo = buildAdsrGeometry(ATTACK, DECAY, SUSTAIN, RELEASE, "adsr");
		const path = adsrPreviewPath(ATTACK, DECAY, SUSTAIN, RELEASE, "adsr");
		const coords = parseCoords(path);
		expect(coords).toHaveLength(5);
		expect(coords[0].x).toBeCloseTo(geo.x0, 1);
		expect(coords[0].y).toBeCloseTo(geo.bottom, 1);
		expect(coords[1].x).toBeCloseTo(geo.x1, 1);
		expect(coords[1].y).toBeCloseTo(geo.top, 1);
		expect(coords[2].x).toBeCloseTo(geo.x2, 1);
		expect(coords[2].y).toBeCloseTo(geo.ySustain, 1);
		expect(coords[3].x).toBeCloseTo(geo.x3, 1);
		expect(coords[3].y).toBeCloseTo(geo.ySustain, 1);
		expect(coords[4].x).toBeCloseTo(geo.x4, 1);
		expect(coords[4].y).toBeCloseTo(geo.bottom, 1);
	});

	it("ADR path lands decay at sustain level and immediately releases", () => {
		const geo = buildAdsrGeometry(ATTACK, DECAY, SUSTAIN, RELEASE, "adr");
		const path = adsrPreviewPath(ATTACK, DECAY, SUSTAIN, RELEASE, "adr");
		const coords = parseCoords(path);
		expect(coords).toHaveLength(5);
		expect(coords[0].x).toBeCloseTo(geo.x0, 1);
		expect(coords[0].y).toBeCloseTo(geo.bottom, 1);
		expect(coords[1].x).toBeCloseTo(geo.x1, 1);
		expect(coords[1].y).toBeCloseTo(geo.top, 1);
		expect(coords[2].y).toBeCloseTo(geo.ySustain, 1);
		expect(coords[3].y).toBeCloseTo(geo.ySustain, 1);
		expect(coords[4].x).toBeCloseTo(geo.x4, 1);
		expect(coords[4].y).toBeCloseTo(geo.bottom, 1);
	});

	it("round-trips through both modes without throwing", () => {
		const modes: ModEnvPreviewMode[] = ["adsr", "adr"];
		for (const mode of modes) {
			expect(() =>
				adsrPreviewPath(ATTACK, DECAY, SUSTAIN, RELEASE, mode),
			).not.toThrow();
		}
	});
});

describe("estimateEnvelopeMarkerForPhase", () => {
	it("places release markers on the release segment without using value deltas", () => {
		const geo = buildAdsrGeometry(ATTACK, DECAY, SUSTAIN, RELEASE, "adsr");
		const marker = estimateEnvelopeMarkerForPhase(
			geo,
			SUSTAIN / 2,
			SUSTAIN,
			"release",
		);

		expect(marker.x).toBeGreaterThan(geo.x3);
		expect(marker.x).toBeLessThan(geo.x4);
		expect(marker.y).toBeGreaterThan(geo.ySustain);
		expect(marker.y).toBeLessThan(geo.bottom);
	});
});
