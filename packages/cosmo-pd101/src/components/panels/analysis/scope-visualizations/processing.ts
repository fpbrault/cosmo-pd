const TRIGGER_HYSTERESIS = 0.02;

export function sampleAt(
	samples: Uint8Array | Float32Array,
	index: number,
): number {
	const sample = samples[index] ?? 0;
	if (samples instanceof Uint8Array) {
		return (sample - 128) / 128;
	}
	return sample;
}

export function resolveScopeWindow(
	samples: Uint8Array | Float32Array,
	hz: number,
	sampleRate: number,
	cycles: number,
	triggerLevel: number,
	triggerEdge: "rise" | "fall" = "rise",
) {
	const samplesPerCycle = Math.max(8, Math.round(sampleRate / Math.max(1, hz)));
	const requested = Math.max(16, Math.round(samplesPerCycle * cycles));
	const windowSamples = Math.max(8, Math.min(samples.length - 2, requested));
	if (windowSamples <= 2) {
		return { start: 0, count: Math.max(0, samples.length) };
	}
	let start = Math.max(1, Math.floor((samples.length - windowSamples) / 2));
	const trigger = (triggerLevel - 128) / 128;
	for (let i = 1; i < samples.length - windowSamples - 1; i++) {
		const prev = sampleAt(samples, i - 1);
		const curr = sampleAt(samples, i);
		if (
			(triggerEdge === "rise" &&
				prev <= trigger - TRIGGER_HYSTERESIS &&
				curr >= trigger) ||
			(triggerEdge === "fall" &&
				prev >= trigger + TRIGGER_HYSTERESIS &&
				curr <= trigger)
		) {
			start = i;
			break;
		}
	}
	return { start, count: windowSamples, samplesPerCycle };
}

export function normalizeWindowedSamples(
	samples: Uint8Array | Float32Array,
	start: number,
	count: number,
) {
	const out = new Float32Array(Math.max(0, count));
	if (count <= 0) return out;
	let mean = 0;
	for (let i = 0; i < count; i++) {
		const value = sampleAt(samples, start + i);
		out[i] = value;
		mean += value;
	}
	mean /= count;
	for (let i = 0; i < count; i++) {
		out[i] -= mean;
	}
	return out;
}

export function calculateScopeActivity(
	normalized: Float32Array,
	zoom: number,
): { energy: number; motion: number; activity: number; peak: number } {
	let energy = 0;
	let motion = 0;
	let peak = 0;
	for (let i = 0; i < normalized.length; i++) {
		const sample = normalized[i] ?? 0;
		const magnitude = Math.abs(sample);
		energy += magnitude;
		peak = Math.max(peak, magnitude);
		if (i > 0) {
			motion += Math.abs(sample - (normalized[i - 1] ?? 0));
		}
	}
	energy = Math.min(1, (energy / Math.max(1, normalized.length)) * zoom * 2.3);
	motion = Math.min(1, (motion / Math.max(1, normalized.length)) * zoom * 4.2);
	return {
		energy,
		motion,
		peak: Math.min(1, peak * zoom),
		activity: Math.min(1, energy * 0.7 + motion * 0.8),
	};
}

export function calculateFrameMean(samples: Uint8Array | Float32Array): number {
	if (samples.length === 0) return 128;
	let sum = 0;
	if (samples instanceof Uint8Array) {
		for (let i = 0; i < samples.length; i++) sum += samples[i];
		return sum / samples.length;
	}
	for (let i = 0; i < samples.length; i++) sum += samples[i];
	const meanFloat = sum / samples.length;
	return Math.max(0, Math.min(255, meanFloat * 128 + 128));
}
