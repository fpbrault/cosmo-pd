import { useEffect, useMemo, useState } from "react";
import Button from "@/components/controls/Button";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import LfoDisplay from "@/components/panels/drawer-modules/LfoDisplay";
import { getSyncCyclesPerBeat } from "@/components/panels/drawer-modules/syncDivisions";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useHostTransport } from "@/features/synth/hooks/useHostTransport";
import type { SynthParamKey } from "@/features/synth/SynthParamController";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { LFO_PRESET_DATA } from "@/lib/synth/bindings/synth";
import { resolveTargetFromMetadata } from "@/lib/synth/modTargets";
import { PARAM_META } from "@/lib/synth/paramMeta";

interface LfoModuleProps {
	id: 1 | 2;
	color: string;
}

const LFO_RATE_MAX_HZ = 200;
const LFO_RATE_EXPONENT = 5.643856189774724; // 50% travel ~= 4Hz

function normToLfoRate(norm: number): number {
	return LFO_RATE_MAX_HZ * Math.max(0, Math.min(1, norm)) ** LFO_RATE_EXPONENT;
}

function lfoRateToNorm(hz: number): number {
	if (hz <= 0) {
		return 0;
	}
	return Math.max(
		0,
		Math.min(1, (hz / LFO_RATE_MAX_HZ) ** (1 / LFO_RATE_EXPONENT)),
	);
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

const LFO_RATE_TRANSFORM = {
	toControlValue: lfoRateToNorm,
	fromControlValue: normToLfoRate,
	min: 0,
	max: 1,
	defaultValue: lfoRateToNorm(2),
	valueFormatter: (_controlValue: number, engineValue: number) =>
		`${formatCompactValue(engineValue)}Hz`,
} as const;

export default function LfoModule({ id, color }: LfoModuleProps) {
	const [selectedPreset, setSelectedPreset] = useState<string>("");
	const [playheadPhase, setPlayheadPhase] = useState(0);
	const transport = useHostTransport();
	const lfoWaveformKey = id === 1 ? "lfoWaveform" : "lfo2Waveform";
	const lfoRateKey = id === 1 ? "lfoRate" : "lfo2Rate";
	const lfoRateModeKey = id === 1 ? "lfoRateMode" : "lfo2RateMode";
	const lfoSyncDivisionKey = id === 1 ? "lfoSyncDivision" : "lfo2SyncDivision";
	const lfoDepthKey = id === 1 ? "lfoDepth" : "lfo2Depth";
	const lfoSymmetryKey = id === 1 ? "lfoSymmetry" : "lfo2Symmetry";
	const lfoRetriggerKey = id === 1 ? "lfoRetrigger" : "lfo2Retrigger";
	const lfoOffsetKey = id === 1 ? "lfoOffset" : "lfo2Offset";
	const { value: tempoBpm } = useSynthParam("tempoBpm");

	const { value: lfoWaveform, setValue: setLfoWaveform } =
		useSynthParam(lfoWaveformKey);
	const { value: lfoRate, setValue: setLfoRate } = useSynthParam(lfoRateKey);
	const { value: lfoRateMode } = useSynthParam(lfoRateModeKey);
	const { value: lfoSyncDivision } = useSynthParam(lfoSyncDivisionKey);
	const { value: lfoDepth, setValue: setLfoDepth } = useSynthParam(lfoDepthKey);
	const { value: lfoSymmetry, setValue: setLfoSymmetry } =
		useSynthParam(lfoSymmetryKey);
	const { value: lfoRetrigger, setValue: setLfoRetrigger } =
		useSynthParam(lfoRetriggerKey);
	const { value: lfoOffset, setValue: setLfoOffset } =
		useSynthParam(lfoOffsetKey);
	const syncCyclesPerBeat = getSyncCyclesPerBeat(lfoSyncDivision);
	const effectiveTempoBpm =
		transport.available &&
		Number.isFinite(transport.tempo) &&
		transport.tempo > 0
			? transport.tempo
			: tempoBpm;
	const previewRateHz =
		lfoRateMode === "sync"
			? Math.max(
					0.01,
					(Math.max(1, effectiveTempoBpm) / 60) * syncCyclesPerBeat,
				)
			: Math.max(0, lfoRate);

	useEffect(() => {
		let rafId = 0;
		let last = performance.now();
		const tick = (now: number) => {
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			setPlayheadPhase((prev) => (prev + dt * previewRateHz) % 1);
			rafId = requestAnimationFrame(tick);
		};
		rafId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafId);
	}, [previewRateHz]);

	const displayPlayheadPhase = useMemo(() => {
		if (lfoRateMode === "sync" && transport.available && transport.playing) {
			const phase = transport.positionBeats * syncCyclesPerBeat;
			return ((phase % 1) + 1) % 1;
		}
		return playheadPhase;
	}, [
		lfoRateMode,
		playheadPhase,
		transport.available,
		transport.playing,
		transport.positionBeats,
		syncCyclesPerBeat,
	]);

	const transportStatus = transport.available
		? `${transport.playing ? "Host Run" : "Host Stop"} ${transport.tempo.toFixed(1)} BPM ${transport.timeSigNum}/${transport.timeSigDen}`
		: `Manual ${tempoBpm.toFixed(1)} BPM`;

	const handlePresetChange = (presetId: string) => {
		setSelectedPreset(presetId);
		const preset = LFO_PRESET_DATA.find((entry) => entry.id === presetId);
		if (!preset) {
			return;
		}

		setLfoWaveform(preset.params.waveform);
		setLfoRate(preset.params.rate as number);
		setLfoDepth(preset.params.depth as number);
		setLfoSymmetry(preset.params.symmetry as number);
		setLfoRetrigger(preset.params.retrigger);
		setLfoOffset(preset.params.offset as number);
		requestApplyModulePreset({
			module: id === 1 ? "lfo1" : "lfo2",
			preset: preset.id,
			patch: preset.params as Record<string, unknown>,
		});
	};

	return (
		<ModuleFrame
			title={`LFO ${id}`}
			color={color}
			enabled
			hideToggle={true}
			presetValue={selectedPreset}
			presetOptions={LFO_PRESET_DATA}
			onPresetChange={handlePresetChange}
		>
			<LfoDisplay
				id={id}
				color={color}
				waveform={lfoWaveform}
				symmetry={lfoSymmetry}
				offset={lfoOffset}
				depth={lfoDepth}
				phase={displayPlayheadPhase}
				transportStatus={transportStatus}
				showLoop={transport.available && transport.loopActive}
			/>
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
								lfoWaveform === w ? "btn-secondary" : "btn-outline"
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
						lfoRetrigger ? "btn-secondary" : "btn-outline"
					}`}
					onClick={() => setLfoRetrigger(!lfoRetrigger)}
					title={PARAM_META[lfoRetriggerKey as SynthParamKey]?.tooltip}
				>
					Retrig
				</Button>
			</div>
			<SynthParamKnob
				paramKey={lfoRateKey}
				label="Rate"
				color="#27588f"
				size={54}
				modDestination={resolveTargetFromMetadata("lfo.rate", {
					lfoIndex: id,
				})}
				midiTargetKey={`lfo${id}RateKnob`}
				midiLabel={`LFO ${id} Rate`}
				uiTransform={LFO_RATE_TRANSFORM}
				sync
			/>
			<SynthParamKnob
				paramKey={lfoDepthKey}
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
