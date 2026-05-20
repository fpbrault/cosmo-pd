import { useEffect, useRef, useState } from "react";
import type { PerformanceMetrics } from "@/components/performance/PerformanceMonitor";

export function usePerformanceMetrics(
	workletNodeRef: React.RefObject<AudioWorkletNode | null>,
) {
	const [enabled, setEnabled] = useState(false);
	const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
	const metricsRef = useRef<PerformanceMetrics | null>(null);

	useEffect(() => {
		metricsRef.current = metrics;
	}, [metrics]);

	useEffect(() => {
		const workletNode = workletNodeRef.current;
		workletNode?.port.postMessage({
			type: "setPerformanceMonitorEnabled",
			enabled,
		});
		if (!enabled) {
			setMetrics(null);
		}
	}, [enabled, workletNodeRef]);

	useEffect(() => {
		if (!enabled) {
			return;
		}

		const handleMetrics = (event: Event) => {
			const detail = (event as CustomEvent<PerformanceMetrics | undefined>)
				.detail;
			if (detail) {
				setMetrics(detail);
			}
		};

		const requestMetrics = () => {
			workletNodeRef.current?.port.postMessage({
				type: "setPerformanceMonitorEnabled",
				enabled: true,
			});
			workletNodeRef.current?.port.postMessage({
				type: "getPerformanceMetrics",
			});
		};

		window.addEventListener("cz-performance-metrics", handleMetrics);
		requestMetrics();
		const intervalId = window.setInterval(requestMetrics, 250);

		return () => {
			window.removeEventListener("cz-performance-metrics", handleMetrics);
			window.clearInterval(intervalId);
		};
	}, [enabled, workletNodeRef]);

	return { enabled, setEnabled, metrics, metricsRef };
}
