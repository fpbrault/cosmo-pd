import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SynthEngineAdapter } from "./synthEngineAdapter";
import {
	SynthEngineController,
	useSynthEngineController,
} from "./synthEngineAdapter";
import type { SynthEngineSnapshot } from "./synthEngineSnapshot";

describe("SynthEngineController", () => {
	let adapter: SynthEngineAdapter;
	let snapshot: SynthEngineSnapshot;

	beforeEach(() => {
		adapter = { sync: vi.fn() };
		snapshot = { params: {} as SynthEngineSnapshot["params"] };
	});

	it("connect() calls adapter.connect() if provided", () => {
		const connect = vi.fn();
		adapter.connect = connect;
		const controller = new SynthEngineController(adapter);
		controller.connect();
		expect(connect).toHaveBeenCalledOnce();
	});

	it("connect() stores the cleanup function", () => {
		const cleanup = vi.fn();
		adapter.connect = () => cleanup;
		const controller = new SynthEngineController(adapter);
		controller.connect();
		controller.dispose();
		expect(cleanup).toHaveBeenCalledOnce();
	});

	it("connect() handles missing connect method gracefully", () => {
		const controller = new SynthEngineController(adapter);
		expect(() => controller.connect()).not.toThrow();
	});

	it("sync() delegates to adapter.sync()", () => {
		const controller = new SynthEngineController(adapter);
		controller.sync(snapshot);
		expect(adapter.sync).toHaveBeenCalledWith(snapshot);
	});

	it("dispose() calls the stored cleanup", () => {
		const cleanup = vi.fn();
		adapter.connect = () => cleanup;
		const controller = new SynthEngineController(adapter);
		controller.connect();
		controller.dispose();
		expect(cleanup).toHaveBeenCalledOnce();
	});

	it("dispose() handles undefined disconnect gracefully", () => {
		const controller = new SynthEngineController(adapter);
		expect(() => controller.dispose()).not.toThrow();
	});

	it("full lifecycle: connect -> sync -> dispose", () => {
		const cleanup = vi.fn();
		adapter.connect = () => cleanup;
		const controller = new SynthEngineController(adapter);
		controller.connect();
		controller.sync(snapshot);
		controller.dispose();
		expect(adapter.sync).toHaveBeenCalledWith(snapshot);
		expect(cleanup).toHaveBeenCalledOnce();
	});
});

describe("useSynthEngineController", () => {
	it("calls connect on mount and dispose on unmount", () => {
		const cleanup = vi.fn();
		const connect = vi.fn(() => cleanup);
		const adapter: SynthEngineAdapter = { sync: vi.fn(), connect };
		const snapshot: SynthEngineSnapshot = {
			params: {} as SynthEngineSnapshot["params"],
		};

		const { unmount } = renderHook(
			({ adapter, snapshot }) =>
				useSynthEngineController({ adapter, snapshot }),
			{ initialProps: { adapter, snapshot } },
		);

		expect(connect).toHaveBeenCalledOnce();
		expect(adapter.sync).toHaveBeenCalledWith(snapshot);

		unmount();

		expect(cleanup).toHaveBeenCalledOnce();
	});

	it("calls sync when snapshot changes", () => {
		const adapter: SynthEngineAdapter = { sync: vi.fn() };
		const snapshot1: SynthEngineSnapshot = {
			params: { volume: 0.5 } as SynthEngineSnapshot["params"],
		};
		const snapshot2: SynthEngineSnapshot = {
			params: { volume: 0.8 } as SynthEngineSnapshot["params"],
		};

		const { rerender } = renderHook(
			({ adapter, snapshot }) =>
				useSynthEngineController({ adapter, snapshot }),
			{ initialProps: { adapter, snapshot: snapshot1 } },
		);

		expect(adapter.sync).toHaveBeenCalledWith(snapshot1);

		rerender({ adapter, snapshot: snapshot2 });

		expect(adapter.sync).toHaveBeenCalledWith(snapshot2);
	});
});
