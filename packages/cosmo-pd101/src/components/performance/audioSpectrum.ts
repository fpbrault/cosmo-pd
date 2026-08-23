const MIN_FREQUENCY_HZ = 20;

function sampleToFloat(sample: number, byteSamples: boolean): number {
	return byteSamples ? (sample - 128) / 128 : sample;
}

export function calculateLogFrequencyBands(
	samples: Float32Array | Uint8Array,
	sampleRate: number,
	bandCount: number,
): Float32Array {
	const bands = new Float32Array(Math.max(1, bandCount));
	if (samples.length < 2 || sampleRate <= 0) return bands;

	const windowSize = Math.min(samples.length, 1024);
	const offset = samples.length - windowSize;
	const maxFrequency = Math.min(20_000, sampleRate / 2);
	const byteSamples = samples instanceof Uint8Array;

	for (let band = 0; band < bands.length; band++) {
		const ratio = band / Math.max(1, bands.length - 1);
		const frequency =
			MIN_FREQUENCY_HZ * (maxFrequency / MIN_FREQUENCY_HZ) ** ratio;
		const angularStep = (2 * Math.PI * frequency) / sampleRate;
		let real = 0;
		let imaginary = 0;
		for (let index = 0; index < windowSize; index++) {
			const hann =
				0.5 - 0.5 * Math.cos((2 * Math.PI * index) / (windowSize - 1));
			const value =
				sampleToFloat(samples[offset + index] ?? 0, byteSamples) * hann;
			const phase = angularStep * index;
			real += value * Math.cos(phase);
			imaginary -= value * Math.sin(phase);
		}
		const magnitude = (2 * Math.hypot(real, imaginary)) / windowSize;
		bands[band] = Math.min(1, Math.sqrt(Math.max(0, magnitude * 2.5)));
	}

	return bands;
}

export function resampleFrequencyBins(
	bins: Uint8Array,
	sampleRate: number,
	bandCount: number,
): Float32Array {
	const bands = new Float32Array(Math.max(1, bandCount));
	if (bins.length === 0 || sampleRate <= 0) return bands;
	const maxFrequency = Math.min(20_000, sampleRate / 2);

	for (let band = 0; band < bands.length; band++) {
		const ratio = band / Math.max(1, bands.length - 1);
		const frequency =
			MIN_FREQUENCY_HZ * (maxFrequency / MIN_FREQUENCY_HZ) ** ratio;
		const index = Math.min(
			bins.length - 1,
			Math.round((frequency / (sampleRate / 2)) * (bins.length - 1)),
		);
		bands[band] = (bins[index] ?? 0) / 255;
	}

	return bands;
}

export function resampleWaveformWindow(
	samples: Float32Array | Uint8Array,
	start: number,
	count: number,
	pointCount: number,
): Float32Array {
	const points = new Float32Array(Math.max(1, pointCount));
	if (samples.length === 0) return points;

	const safeStart = Math.min(
		samples.length - 1,
		Math.max(0, Math.round(start)),
	);
	const safeCount = Math.max(
		1,
		Math.min(Math.round(count), samples.length - safeStart),
	);
	const byteSamples = samples instanceof Uint8Array;

	for (let point = 0; point < points.length; point++) {
		const ratio = point / Math.max(1, points.length - 1);
		const sampleIndex =
			safeStart + Math.floor(ratio * Math.max(0, safeCount - 1));
		points[point] = Math.max(
			-1,
			Math.min(1, sampleToFloat(samples[sampleIndex] ?? 0, byteSamples)),
		);
	}

	return points;
}
