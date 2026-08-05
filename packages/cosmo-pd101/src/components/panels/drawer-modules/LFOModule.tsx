import { useMemo, useState } from "react";
import Button from "@/components/controls/Button";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import {
	HoverInfoTrigger,
	useHoverInfoHandlers,
} from "@/components/layout/HoverInfo";
import LfoDisplay from "@/components/panels/drawer-modules/LfoDisplay";
import { LFO_RATE_TRANSFORM } from "@/components/panels/drawer-modules/lfoRateTransform";
import { getSyncCyclesPerBeat } from "@/components/panels/drawer-modules/syncDivisions";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import { requestApplyModulePreset } from "@/features/synth/engine/modulePresetEvents";
import { useHostTransport } from "@/features/synth/hooks/useHostTransport";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { LFO_PRESET_DATA } from "@/lib/synth/bindings/synth";
import { resolveTargetFromMetadata } from "@/lib/synth/modTargets";
import { getParamTooltip } from "@/lib/synth/paramMeta";

interface LfoModuleProps {
	id: 1 | 2;
	color: string;
}

export default function LfoModule({ id, color }: LfoModuleProps) {
	const [selectedPreset, setSelectedPreset] = useState<string>("");
	const transport = useHostTransport();
	const lfoWaveformKey = id === 1 ? "lfoWaveform" : "lfo2Waveform";
	const lfoRateKey = id === 1 ? "lfoRate" : "lfo2Rate";
	const lfoRateModeKey = id === 1 ? "lfoRateMode" : "lfo2RateMode";
	const lfoSyncDivisionKey = id === 1 ? "lfoSyncDivision" : "lfo2SyncDivision";
	const lfoDepthKey = id === 1 ? "lfoDepth" : "lfo2Depth";
	const lfoSymmetryKey = id === 1 ? "lfoSymmetry" : "lfo2Symmetry";
	const lfoRetriggerKey = id === 1 ? "lfoRetrigger" : "lfo2Retrigger";
	const lfoOffsetKey = id === 1 ? "lfoOffset" : "lfo2Offset";
	const retriggerTooltip = getParamTooltip(lfoRetriggerKey);
	const retriggerHoverHandlers = useHoverInfoHandlers(retriggerTooltip);
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

	const displayPlayheadPhase = useMemo(() => {
		if (lfoRateMode === "sync" && transport.available && transport.playing) {
			const phase = transport.positionBeats * syncCyclesPerBeat;
			return ((phase % 1) + 1) % 1;
		}
		return 0;
	}, [
		lfoRateMode,
		transport.available,
		transport.playing,
		transport.positionBeats,
		syncCyclesPerBeat,
	]);
	const animatePreview =
		!(lfoRateMode === "sync" && transport.available && transport.playing) &&
		previewRateHz > 0;

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
				rateHz={previewRateHz}
				animate={animatePreview}
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
					).map(([label, w]) => {
						const tooltip = `Select a ${label} waveform for LFO ${id}.`;
						return (
							<HoverInfoTrigger key={w} message={tooltip}>
								{(hoverHandlers) => (
									<Button
										type="button"
										className={`join-item btn btn-xs h-7 min-h-0 flex-1 rounded-none border-0 px-1.5 ${
											lfoWaveform === w ? "btn-secondary" : "btn-outline"
										}`}
										onClick={() => setLfoWaveform(w)}
										title={tooltip}
										data-hover-info={tooltip}
										{...hoverHandlers}
									>
										{label}
									</Button>
								)}
							</HoverInfoTrigger>
						);
					})}
				</div>
				<Button
					type="button"
					className={`btn btn-xs h-7 min-h-0 px-1.5 ${
						lfoRetrigger ? "btn-secondary" : "btn-outline"
					}`}
					onClick={() => setLfoRetrigger(!lfoRetrigger)}
					title={retriggerTooltip}
					data-hover-info={retriggerTooltip}
					{...retriggerHoverHandlers}
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
