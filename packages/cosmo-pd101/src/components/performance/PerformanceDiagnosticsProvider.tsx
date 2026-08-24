import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import type { SynthRuntime } from "@/features/synth/runtime/synthRuntime";
import {
	type DisplayQualityOverride,
	useSynthUiStore,
} from "@/features/synth/synthUiStore";
import {
	type PerformanceDiagnosticsSnapshot,
	performanceDiagnosticsRegistry,
} from "./performanceDiagnostics";

type PerformanceDiagnosticsContextValue = {
	snapshot: PerformanceDiagnosticsSnapshot;
	debugEnabled: boolean;
	displayQualityOverride: DisplayQualityOverride;
};

const PerformanceDiagnosticsContext =
	createContext<PerformanceDiagnosticsContextValue | null>(null);

export function PerformanceDiagnosticsProvider({
	runtime,
	children,
}: {
	runtime: SynthRuntime;
	children: ReactNode;
}) {
	const debugEnabled = useSynthUiStore((state) => state.debugEnabled);
	const displayQualityOverride = useSynthUiStore(
		(state) => state.displayQualityOverride,
	);
	const [snapshot, setSnapshot] = useState(() =>
		performanceDiagnosticsRegistry.getSnapshot(),
	);

	useEffect(() => {
		let rafId = 0;
		const recordUiFrame = (timestamp: number) => {
			performanceDiagnosticsRegistry.recordUiFrame(timestamp);
			rafId = window.requestAnimationFrame(recordUiFrame);
		};
		rafId = window.requestAnimationFrame(recordUiFrame);

		const unsubscribe = performanceDiagnosticsRegistry.subscribe(() => {
			setSnapshot(performanceDiagnosticsRegistry.getSnapshot());
		});
		const intervalId = window.setInterval(() => {
			const audio = runtime.performanceMonitor?.getSnapshot() ?? null;
			performanceDiagnosticsRegistry.setAudioMetrics(audio);
			setSnapshot(performanceDiagnosticsRegistry.getSnapshot());
		}, 500);

		let observer: PerformanceObserver | null = null;
		let longTaskObserverActive = false;
		if (typeof PerformanceObserver !== "undefined") {
			try {
				observer = new PerformanceObserver((list) => {
					for (const entry of list.getEntries()) {
						performanceDiagnosticsRegistry.recordLongTask(
							entry.duration,
							entry.startTime + entry.duration,
						);
					}
				});
				observer.observe({ entryTypes: ["longtask"] });
				longTaskObserverActive = true;
			} catch {
				observer = null;
			}
		}

		// Some embedded webviews expose PerformanceObserver but not the longtask
		// entry type. Keep a low-cost scheduler-gap fallback so the HUD still
		// reports blocked main-thread time in those hosts.
		const fallbackIntervalMs = 250;
		let fallbackTimerId: number | undefined;
		if (!longTaskObserverActive) {
			let nextDeadline = performance.now() + fallbackIntervalMs;
			fallbackTimerId = window.setInterval(() => {
				const timestamp = performance.now();
				if (document.hidden) {
					nextDeadline = timestamp + fallbackIntervalMs;
					return;
				}
				const delayMs = timestamp - nextDeadline;
				if (delayMs > 50) {
					performanceDiagnosticsRegistry.recordLongTask(delayMs, timestamp);
				}
				nextDeadline = timestamp + fallbackIntervalMs;
			}, fallbackIntervalMs);
		}

		return () => {
			window.cancelAnimationFrame(rafId);
			window.clearInterval(intervalId);
			if (fallbackTimerId !== undefined) {
				window.clearInterval(fallbackTimerId);
			}
			observer?.disconnect();
			unsubscribe();
		};
	}, [runtime]);

	useEffect(() => {
		runtime.performanceMonitor?.setEnabled(debugEnabled);
	}, [debugEnabled, runtime.performanceMonitor]);

	const value = useMemo(
		() => ({ snapshot, debugEnabled, displayQualityOverride }),
		[snapshot, debugEnabled, displayQualityOverride],
	);
	return (
		<PerformanceDiagnosticsContext.Provider value={value}>
			{children}
		</PerformanceDiagnosticsContext.Provider>
	);
}

export function usePerformanceDiagnostics(): PerformanceDiagnosticsContextValue {
	const context = useContext(PerformanceDiagnosticsContext);
	if (context) return context;
	return {
		snapshot: performanceDiagnosticsRegistry.getSnapshot(),
		debugEnabled: false,
		displayQualityOverride: "auto",
	};
}
