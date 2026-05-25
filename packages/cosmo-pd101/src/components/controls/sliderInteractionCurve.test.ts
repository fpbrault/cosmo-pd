import { describe, expect, it } from "vitest";
import { mapPointerValueWithCurve } from "./sliderInteractionCurve";

describe("mapPointerValueWithCurve", () => {
	it("keeps linear mode as absolute mapping", () => {
		const mapped = mapPointerValueWithCurve({
			absoluteValue: 10,
			currentValue: 2,
			curveMode: "linear",
			min: 0,
			max: 20,
		});
		expect(mapped).toBe(10);
	});

	it("moves less aggressively in fine mode", () => {
		const mapped = mapPointerValueWithCurve({
			absoluteValue: 10,
			currentValue: 2,
			curveMode: "fine",
			min: 0,
			max: 20,
		});
		expect(mapped).toBeCloseTo(4.8, 6);
	});

	it("moves even less aggressively in ultrafine mode", () => {
		const mapped = mapPointerValueWithCurve({
			absoluteValue: 10,
			currentValue: 2,
			curveMode: "ultrafine",
			min: 0,
			max: 20,
		});
		expect(mapped).toBeCloseTo(3.2, 6);
	});
});
