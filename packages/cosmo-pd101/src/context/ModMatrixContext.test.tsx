import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import {
	ModMatrixProvider,
	useModMatrix,
	useOptionalModMatrix,
} from "./ModMatrixContext";

describe("ModMatrixContext", () => {
	it("throws when useModMatrix is called outside provider", () => {
		expect(() => renderHook(() => useModMatrix())).toThrow(
			"useModMatrix must be used within a ModMatrixProvider",
		);
	});

	it("returns optional context as undefined outside provider", () => {
		const { result } = renderHook(() => useOptionalModMatrix());
		expect(result.current).toBeUndefined();
	});

	it("provides matrix and setter", () => {
		const wrapper = ({ children }: { children: ReactNode }) => (
			<ModMatrixProvider modMatrix={{ routes: [] }} setModMatrix={vi.fn()}>
				{children}
			</ModMatrixProvider>
		);
		const { result } = renderHook(() => useModMatrix(), { wrapper });
		expect(result.current.modMatrix).toEqual({ routes: [] });
	});
});
