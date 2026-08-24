import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDrawerPanelState } from "./useDrawerPanelState";

describe("useDrawerPanelState", () => {
	it("maps non-drawer modes to closed state", () => {
		const { result } = renderHook(() => useDrawerPanelState("phase"));
		expect(result.current.drawerOpen).toBe(false);
		expect(result.current.activeDrawerPanel).toBe("fx");
	});

	it("tracks drawer mode transitions and direction", () => {
		const { result, rerender } = renderHook(
			({ mode }) => useDrawerPanelState(mode),
			{ initialProps: { mode: "fx" as "fx" | "mod" | "phase" } },
		);
		expect(result.current.drawerOpen).toBe(true);
		expect(result.current.activeDrawerPanel).toBe("fx");
		rerender({ mode: "mod" as "fx" | "mod" | "phase" });
		expect(result.current.activeDrawerPanel).toBe("mod");
		expect(result.current.drawerSlideDirection).toBe(1);
	});
});
