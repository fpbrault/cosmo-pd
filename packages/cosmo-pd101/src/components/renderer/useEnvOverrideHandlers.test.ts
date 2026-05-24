import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useEnvOverrideHandlers } from "./useEnvOverrideHandlers";

describe("useEnvOverrideHandlers", () => {
	it("routes env changes to matching line/env handlers", () => {
		const setLine1DcoEnv = vi.fn();
		const setLine1DcwEnv = vi.fn();
		const setLine1DcaEnv = vi.fn();
		const setLine2DcoEnv = vi.fn();
		const setLine2DcwEnv = vi.fn();
		const setLine2DcaEnv = vi.fn();

		const { result } = renderHook(() =>
			useEnvOverrideHandlers({
				setLine1DcoEnv,
				setLine1DcwEnv,
				setLine1DcaEnv,
				setLine2DcoEnv,
				setLine2DcwEnv,
				setLine2DcaEnv,
			}),
		);

		const env = { steps: [], sustainStep: 0, stepCount: 0, loop: false };
		result.current.onEnvChange(1, "dco", env);
		result.current.onEnvChange(1, "dcw", env);
		result.current.onEnvChange(1, "dca", env);
		result.current.onEnvChange(2, "dco", env);
		result.current.onEnvChange(2, "dcw", env);
		result.current.onEnvChange(2, "dca", env);

		expect(setLine1DcoEnv).toHaveBeenCalledWith(env);
		expect(setLine1DcwEnv).toHaveBeenCalledWith(env);
		expect(setLine1DcaEnv).toHaveBeenCalledWith(env);
		expect(setLine2DcoEnv).toHaveBeenCalledWith(env);
		expect(setLine2DcwEnv).toHaveBeenCalledWith(env);
		expect(setLine2DcaEnv).toHaveBeenCalledWith(env);
	});
});
