import { useEffect, useMemo, useState } from "react";
import Button from "@/components/controls/Button";
import { ControlKnob } from "@/components/controls/ControlKnob";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import type { SynthParamKey } from "@/features/synth/SynthParamController";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { resolveTargetFromMetadata } from "@/lib/synth/modTargets";
import { getLfoModulePatch, LFO_PRESETS } from "@/lib/synth/modulePresets";
import { PARAM_META } from "@/lib/synth/paramMeta";

interface LfoModuleProps {
	id: 1 | 2;
	color: string;
}

const LFO_RATE_MAX_HZ = 200;
const LFO_RATE_EXPONENT = 5.643856189774724; // 50% travel ~= 4Hz

function clamp01(value: number): number {
	return Math.max(0, Math.min(1, value));
}

function normToLfoRate(norm: number): number {
	return LFO_RATE_MAX_HZ * clamp01(norm) ** LFO_RATE_EXPONENT;
}

function lfoRateToNorm(hz: number): number {
	if (hz <= 0) {
		return 0;
	}
	return clamp01((hz / LFO_RATE_MAX_HZ) ** (1 / LFO_RATE_EXPONENT));
}

function formatCompactValue(value: number): string {
	if (!Number.isFinite(value) || value <= 0) {
		return "0";
	}
	if (value >= 100) {
		return value.toFixed(0);
	}
	if (value >= 10) {
		return value.toFixed(1);
	}
	if (value >= 1) {
		return value.toFixed(2);
	}
	return value.toFixed(3);
}

function lfoPreviewPath(
	waveform: string,
	symmetry: number,
	offset: number,
	depth: number,
): string {
	const width = 220;
	const height = 56;
	const centerY = height / 2;
	const points = 72;
	const amp = 6 + clamp01(depth) * 14;
	const cycles = 1;

	let d = "";
	for (let i = 0; i < points; i++) {
		const x = (i / (points - 1)) * width;
		const phase = ((i / (points - 1)) * cycles) % 1;
		const sample = sampleLfoWaveform(waveform, symmetry, phase, i);
		const shaped = Math.max(-1, Math.min(1, sample + offset));
		const y = centerY - shaped * amp;
		d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)} `;
	}

	return d.trim();
}

function warpPhase(phase: number, symmetry: number): number {
	const p = ((phase % 1) + 1) % 1;
	const center = 0.5;
	const offset = (clamp01(symmetry) - center) * 0.8;
	const pivot = Math.max(0.1, Math.min(0.9, center + offset));
	if (p <= pivot) {
		return (p / pivot) * 0.5;
	}
	return 0.5 + ((p - pivot) / (1 - pivot)) * 0.5;
}

function sampleLfoWaveform(
	waveform: string,
	symmetry: number,
	phase: number,
	index: number,
): number {
	const sym = clamp01(symmetry);
	const p = ((phase % 1) + 1) % 1;
	const warped = warpPhase(p, sym);
	const duty = Math.max(0.1, Math.min(0.9, 0.5 + (sym - 0.5) * 0.8));

	switch (waveform) {
		case "triangle": {
			return warped < duty
				? -1 + (warped / duty) * 2
				: 1 - ((warped - duty) / (1 - duty)) * 2;
		}
		case "square":
			return warped < duty ? 1 : -1;
		case "saw":
			return warped * 2 - 1;
		case "invertedSaw":
			return 1 - warped * 2;
		default:
			return Math.sin(warped * Math.PI * 2 + index * 0.001);
	}
}

function lfoPointFromPhase({
	waveform,
	symmetry,
	offset,
	depth,
	phase,
}: {
	waveform: string;
	symmetry: number;
	offset: number;
	depth: number;
	phase: number;
}) {
	const width = 220;
	const centerY = 28;
	const amp = 6 + clamp01(depth) * 14;
	const x = (((phase % 1) + 1) % 1) * width;
	const sample = sampleLfoWaveform(waveform, symmetry, phase, Math.floor(x));
	const shaped = Math.max(-1, Math.min(1, sample + offset));
	const y = centerY - shaped * amp;
	return { x, y };
}

export default function LfoModule({ id, color }: LfoModuleProps) {
	const [selectedPreset, setSelectedPreset] = useState<string>("");
	const [playheadPhase, setPlayheadPhase] = useState(0);
	const lfoWaveformKey = id === 1 ? "lfoWaveform" : "lfo2Waveform";
	const lfoRateKey = id === 1 ? "lfoRate" : "lfo2Rate";
	const lfoDepthKey = id === 1 ? "lfoDepth" : "lfo2Depth";
	const lfoSymmetryKey = id === 1 ? "lfoSymmetry" : "lfo2Symmetry";
	const lfoRetriggerKey = id === 1 ? "lfoRetrigger" : "lfo2Retrigger";
	const lfoOffsetKey = id === 1 ? "lfoOffset" : "lfo2Offset";

	const { value: lfoWaveform, setValue: setLfoWaveform } =
		useSynthParam(lfoWaveformKey);
	const { value: lfoRate, setValue: setLfoRate } = useSynthParam(lfoRateKey);
	const { value: lfoDepth, setValue: setLfoDepth } = useSynthParam(lfoDepthKey);
	const { value: lfoSymmetry, setValue: setLfoSymmetry } =
		useSynthParam(lfoSymmetryKey);
	const { value: lfoRetrigger, setValue: setLfoRetrigger } =
		useSynthParam(lfoRetriggerKey);
	const { value: lfoOffset, setValue: setLfoOffset } =
		useSynthParam(lfoOffsetKey);
	const lfoRateNorm = lfoRateToNorm(lfoRate as number);

	useEffect(() => {
		let rafId = 0;
		let last = performance.now();
		const tick = (now: number) => {
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			setPlayheadPhase(
				(prev) => (prev + dt * Math.max(0, lfoRate as number)) % 1,
			);
			rafId = requestAnimationFrame(tick);
		};
		rafId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafId);
	}, [lfoRate]);

	const lfoPlayheadPoint = useMemo(() => {
		return lfoPointFromPhase({
			waveform: lfoWaveform as string,
			symmetry: lfoSymmetry as number,
			offset: lfoOffset as number,
			depth: lfoDepth as number,
			phase: playheadPhase,
		});
	}, [lfoDepth, lfoOffset, lfoSymmetry, lfoWaveform, playheadPhase]);

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		const preset = LFO_PRESETS.find((entry) => entry.id === presetId);
		if (!preset) {
			return;
		}

		setLfoWaveform(preset.patch.waveform);
		setLfoRate(preset.patch.rate);
		setLfoDepth(preset.patch.depth);
		setLfoSymmetry(preset.patch.symmetry);
		setLfoRetrigger(preset.patch.retrigger);
		setLfoOffset(preset.patch.offset);
		requestApplyModulePreset({
			module: id === 1 ? "lfo1" : "lfo2",
			preset: preset.id,
			patch: getLfoModulePatch(id, preset.patch),
		});
	};

	return (
		<ModuleFrame
			title={`LFO ${id}`}
			color={color}
			enabled
			headerControl={
				<ModulePresetPopover
					title={`LFO ${id} Presets`}
					value={selectedPreset}
					options={LFO_PRESETS}
					onChange={handlePresetChange}
				/>
			}
		>
			<div className="col-span-4 rounded-md border border-cz-border/55 bg-cz-bg/35 px-2 py-0.5">
				<svg viewBox="0 0 220 56" className="h-10 w-full" aria-hidden="true">
					<defs>
						<linearGradient
							id={`lfo-preview-${id}`}
							x1="0"
							y1="0"
							x2="1"
							y2="0"
						>
							<stop offset="0%" stopColor={color} stopOpacity="0.55" />
							<stop offset="100%" stopColor={color} stopOpacity="0.9" />
						</linearGradient>
					</defs>
					<line
						x1="0"
						y1="28"
						x2="220"
						y2="28"
						stroke="rgba(255,255,255,0.1)"
						strokeWidth="1"
					/>
					<path
						d={lfoPreviewPath(
							lfoWaveform as string,
							lfoSymmetry as number,
							lfoOffset as number,
							lfoDepth as number,
						)}
						fill="none"
						stroke={`url(#lfo-preview-${id})`}
						strokeWidth="2"
						strokeLinecap="round"
					/>
					<circle
						cx={lfoPlayheadPoint.x}
						cy={lfoPlayheadPoint.y}
						r={4.5}
						fill={color}
						stroke={color}
						strokeWidth="1"
					/>
				</svg>
			</div>
			<div className="col-span-4 flex items-center gap-1.5">
				<div className="join flex-1 overflow-hidden rounded-md border border-cz-border/65">
					{(
						[
							["sine", "sine"],
							["tri", "triangle"],
							["sq", "square"],
							["saw", "saw"],
							["inv", "invertedSaw"],
						] as const
					).map(([label, w]) => (
						<Button
							key={w}
							type="button"
							className={`join-item btn btn-xs h-7 min-h-0 flex-1 rounded-none border-0 px-1.5 ${
								(lfoWaveform as string) === w ? "btn-secondary" : "btn-outline"
							}`}
							onClick={() => setLfoWaveform(w)}
							title={`Select ${label} waveform for LFO ${id}.`}
						>
							{label}
						</Button>
					))}
				</div>
				<Button
					type="button"
					className={`btn btn-xs h-7 min-h-0 px-1.5 ${
						(lfoRetrigger as boolean) ? "btn-secondary" : "btn-outline"
					}`}
					onClick={() => setLfoRetrigger(!(lfoRetrigger as boolean))}
					title={PARAM_META[lfoRetriggerKey as SynthParamKey]?.tooltip}
				>
					Retrig
				</Button>
			</div>
			<ControlKnob
				value={lfoRateNorm}
				onChange={(nextNorm) => setLfoRate(normToLfoRate(nextNorm))}
				min={0}
				max={1}
				defaultValue={lfoRateToNorm(2)}
				color="#27588f"
				size={54}
				label="Rate"
				tooltip={PARAM_META[lfoRateKey as SynthParamKey]?.tooltip}
				modDestination={resolveTargetFromMetadata("lfo.rate", { lfoIndex: id })}
				valueFormatter={(nextNorm) =>
					`${formatCompactValue(normToLfoRate(nextNorm))}Hz`
				}
			/>
			<SynthParamKnob
				paramKey={lfoDepthKey}
				value={lfoDepth as number}
				onChange={setLfoDepth}
				color="#27588f"
				size={54}
				label="Depth"
				valueFormatter={(value) => `${Math.round((value as number) * 100)}%`}
				modDestination={resolveTargetFromMetadata("lfo.depth", {
					lfoIndex: id,
				})}
			/>
			<SynthParamKnob
				paramKey={lfoOffsetKey}
				value={lfoOffset as number}
				onChange={setLfoOffset}
				min={-1}
				max={1}
				bipolar
				color="#27588f"
				size={54}
				label="Offset"
				valueFormatter={(value) =>
					`${(value as number) >= 0 ? "+" : ""}${(value as number).toFixed(2)}`
				}
				modDestination={resolveTargetFromMetadata("lfo.offset", {
					lfoIndex: id,
				})}
			/>
			<SynthParamKnob
				paramKey={lfoSymmetryKey}
				value={lfoSymmetry as number}
				onChange={setLfoSymmetry}
				color="#27588f"
				size={54}
				label="Sym."
				modDestination={resolveTargetFromMetadata("lfo.symmetry", {
					lfoIndex: id,
				})}
			/>
			<div className="col-span-4 h-0" />
		</ModuleFrame>
	);
}
