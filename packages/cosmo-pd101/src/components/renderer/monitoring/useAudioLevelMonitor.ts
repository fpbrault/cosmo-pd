import { useEffect } from "react";

export function useAudioLevelMonitor(
	analyserNodeRef: React.RefObject<AnalyserNode | null>,
	onAudioLevelChange?: (level: number) => void,
) {
	useEffect(() => {
		if (!onAudioLevelChange) {
			return;
		}

		let rafId = 0;
		let smoothLevel = 0;
		let lastSampleTime = 0;
		let lastPublishedLevel = -1;
		let sampleBuffer = new Float32Array(2048);

		const updateAudioLevel = (now: number) => {
			const analyserNode = analyserNodeRef.current;
			if (now - lastSampleTime < 40) {
				rafId = window.requestAnimationFrame(updateAudioLevel);
				return;
			}
			lastSampleTime = now;

			if (!analyserNode) {
				smoothLevel *= 0.9;
				if (
					lastPublishedLevel < 0 ||
					Math.abs(lastPublishedLevel - smoothLevel) > 0.01
				) {
					onAudioLevelChange(smoothLevel);
					lastPublishedLevel = smoothLevel;
				}
				rafId = window.requestAnimationFrame(updateAudioLevel);
				return;
			}

			if (sampleBuffer.length !== analyserNode.fftSize) {
				sampleBuffer = new Float32Array(analyserNode.fftSize);
			}
			analyserNode.getFloatTimeDomainData(sampleBuffer);

			let sumSquares = 0;
			for (const sample of sampleBuffer) {
				sumSquares += sample * sample;
			}

			const rms = Math.sqrt(sumSquares / sampleBuffer.length);
			const normalized = Math.min(1, rms * 7.5);
			smoothLevel = smoothLevel * 0.82 + normalized * 0.18;

			if (
				lastPublishedLevel < 0 ||
				Math.abs(lastPublishedLevel - smoothLevel) > 0.01
			) {
				onAudioLevelChange(smoothLevel);
				lastPublishedLevel = smoothLevel;
			}

			rafId = window.requestAnimationFrame(updateAudioLevel);
		};

		rafId = window.requestAnimationFrame(updateAudioLevel);

		return () => {
			window.cancelAnimationFrame(rafId);
		};
	}, [analyserNodeRef, onAudioLevelChange]);
}
