import Button from "@/components/controls/Button";
import ControlKnob from "@/components/controls/ControlKnob";
import { useFxModuleController } from "@/components/panels/drawer-modules/custom/useFxModuleController";
import {
	asNumber,
	getButtonGroupControl,
	getFxControlLabel,
	getFxControlOptionLabel,
	getKnobControl,
	getModDestinationByParam,
	getTooltip,
} from "@/components/panels/drawer-modules/custom/utils";
import type { FxSlotModuleConfig } from "@/components/panels/drawer-modules/fxSlotModuleConfig";
import ModuleFrame from "@/components/primitives/ModuleFrame";
import ModulePresetPopover from "@/components/primitives/ModulePresetPopover";
import { useHostTransport } from "@/features/synth/hooks/useHostTransport";
import { useMidiLearnTarget } from "@/features/synth/hooks/useMidiLearnTarget";
import { useSynthParam } from "@/features/synth/SynthParamController";
import type { LfoSyncDivision } from "@/lib/synth/bindings/synth";

const SYNC_DIVISIONS: readonly {
	value: LfoSyncDivision;
	label: string;
}[] = [
	{ value: "whole", label: "1/1" },
	{ value: "half", label: "1/2" },
	{ value: "dottedQuarter", label: "1/4." },
	{ value: "quarter", label: "1/4" },
	{ value: "dottedEighth", label: "1/8." },
	{ value: "quarterTriplet", label: "1/4T" },
	{ value: "eighth", label: "1/8" },
	{ value: "eighthTriplet", label: "1/8T" },
	{ value: "sixteenth", label: "1/16" },
	{ value: "thirtySecond", label: "1/32" },
];

function getDivisionIndex(value: LfoSyncDivision): number {
	return Math.max(
		0,
		SYNC_DIVISIONS.findIndex((entry) => entry.value === value),
	);
}

export default function VibratoModuleRenderer({
	config,
	slot,
}: {
	config: FxSlotModuleConfig;
	slot: number;
}) {
	const {
		selectedPreset,
		setFxSlotParams,
		params,
		enabled,
		handlePresetChange,
	} = useFxModuleController(config, slot);

	const waveformControl = getButtonGroupControl(config, "waveform");
	const rateControl = getKnobControl(config, "rate");
	const depthControl = getKnobControl(config, "depth");
	const delayControl = getKnobControl(config, "delay");
	const rateMode = params.rateMode === "sync" ? "sync" : "hz";
	const syncDivision = (params.syncDivision as LfoSyncDivision) ?? "quarter";
	const syncDivisionIndex = getDivisionIndex(syncDivision);
	const transport = useHostTransport();
	const { value: tempoBpm } = useSynthParam("tempoBpm");
	const effectiveTempoBpm =
		transport.available &&
		Number.isFinite(transport.tempo) &&
		transport.tempo > 0
			? transport.tempo
			: tempoBpm;
	const waveformValue = asNumber(params.waveform, 1);
	const modDestinationByParam = getModDestinationByParam(config.type);
	const rateLabel = getFxControlLabel(config.type, "rate", "vibratoRate");
	const depthLabel = getFxControlLabel(config.type, "depth", "vibratoDepth");
	const delayLabel = getFxControlLabel(config.type, "delay", "vibratoDelay");
	const rateMidiLearn = useMidiLearnTarget({
		targetKey: rateControl
			? `fxSlot${slot + 1}Knob${rateControl.sourceIndex + 1}`
			: undefined,
		label: rateControl
			? `FX ${slot + 1} Knob ${rateControl.sourceIndex + 1}`
			: undefined,
		apply: rateControl
			? (rawValue) => {
					if (rateMode === "hz") {
						setFxSlotParams(slot, {
							rate:
								rateControl.min +
								(rawValue / 127) * (rateControl.max - rateControl.min),
						});
						return;
					}
					const nextDivision =
						SYNC_DIVISIONS[
							Math.round((rawValue / 127) * (SYNC_DIVISIONS.length - 1))
						] ?? SYNC_DIVISIONS[0];
					setFxSlotParams(slot, { syncDivision: nextDivision.value });
				}
			: undefined,
	});
	const depthMidiLearn = useMidiLearnTarget({
		targetKey: depthControl
			? `fxSlot${slot + 1}Knob${depthControl.sourceIndex + 1}`
			: undefined,
		label: depthControl
			? `FX ${slot + 1} Knob ${depthControl.sourceIndex + 1}`
			: undefined,
		apply: depthControl
			? (rawValue) =>
					setFxSlotParams(slot, {
						depth:
							depthControl.min +
							(rawValue / 127) * (depthControl.max - depthControl.min),
					})
			: undefined,
	});
	const delayMidiLearn = useMidiLearnTarget({
		targetKey: delayControl
			? `fxSlot${slot + 1}Knob${delayControl.sourceIndex + 1}`
			: undefined,
		label: delayControl
			? `FX ${slot + 1} Knob ${delayControl.sourceIndex + 1}`
			: undefined,
		apply: delayControl
			? (rawValue) =>
					setFxSlotParams(slot, {
						delay:
							delayControl.min +
							(rawValue / 127) * (delayControl.max - delayControl.min),
					})
			: undefined,
	});

	return (
		<ModuleFrame
			title={config.title}
			color={config.color}
			columns={3}
			enabled={enabled}
			onToggle={() => setFxSlotParams(slot, { enabled: !enabled })}
			headerControl={
				<ModulePresetPopover
					title={config.presetTitle}
					value={selectedPreset}
					options={config.presets}
					onChange={handlePresetChange}
					accentColor={config.color}
				/>
			}
		>
			<div className="join col-span-3 w-full overflow-hidden rounded-md border border-cz-border/65">
				{waveformControl?.options.map((option) => (
					<Button
						key={option.value}
						type="button"
						className={`join-item btn btn-xs h-8 min-h-0 flex-1 rounded-none border-0 px-2 ${
							waveformValue === option.value
								? "border-amber-500/60 bg-amber-500/20 text-amber-300"
								: "bg-transparent text-cz-cream/60 hover:text-cz-cream/90"
						}`}
						onClick={() => setFxSlotParams(slot, { waveform: option.value })}
					>
						{getFxControlOptionLabel(config.type, "waveform", option.value)}
					</Button>
				))}
			</div>
			{rateControl && rateMode === "hz" ? (
				<ControlKnob
					value={asNumber(params.rate, rateControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { rate: value })}
					min={rateControl.min}
					max={rateControl.max}
					defaultValue={rateControl.defaultValue}
					color={config.color}
					label={rateLabel}
					labelAccessory={
						<button
							type="button"
							className="btn btn-ghost btn-xs h-4 min-h-0 rounded-sm border border-cz-border/65 px-1 font-mono text-[0.52rem] text-cz-gold/85 normal-case tracking-normal"
							onClick={() => setFxSlotParams(slot, { rateMode: "sync" })}
						>
							hz
						</button>
					}
					tooltip={getTooltip("vibratoRate")}
					valueFormatter={rateControl.formatter}
					modDestination={modDestinationByParam.rate}
					onClick={rateMidiLearn.onClick}
					onContextMenu={rateMidiLearn.onContextMenu}
					interactionLocked={rateMidiLearn.interactionLocked}
					midiLearnState={rateMidiLearn.midiLearnState}
				/>
			) : null}
			{rateControl && rateMode === "sync" ? (
				<ControlKnob
					value={syncDivisionIndex}
					onChange={(value) => {
						const nextDivision =
							SYNC_DIVISIONS[Math.round(value)] ?? SYNC_DIVISIONS[0];
						setFxSlotParams(slot, { syncDivision: nextDivision.value });
					}}
					min={0}
					max={SYNC_DIVISIONS.length - 1}
					step={1}
					defaultValue={getDivisionIndex("quarter")}
					color={config.color}
					label={rateLabel}
					labelAccessory={
						<button
							type="button"
							className="btn btn-ghost btn-xs h-4 min-h-0 rounded-sm border border-cz-border/65 px-1 font-mono text-[0.52rem] text-cz-gold/85 normal-case tracking-normal"
							onClick={() => setFxSlotParams(slot, { rateMode: "hz" })}
						>
							sync
						</button>
					}
					tooltip={getTooltip("vibratoRate")}
					valueFormatter={(value) => {
						const division =
							SYNC_DIVISIONS[Math.round(value)] ?? SYNC_DIVISIONS[0];
						return `${division.label} · ${effectiveTempoBpm.toFixed(1)} BPM`;
					}}
					onClick={rateMidiLearn.onClick}
					onContextMenu={rateMidiLearn.onContextMenu}
					interactionLocked={rateMidiLearn.interactionLocked}
					midiLearnState={rateMidiLearn.midiLearnState}
				/>
			) : null}
			{depthControl ? (
				<ControlKnob
					value={asNumber(params.depth, depthControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { depth: value })}
					min={depthControl.min}
					max={depthControl.max}
					defaultValue={depthControl.defaultValue}
					color={config.color}
					label={depthLabel}
					tooltip={getTooltip("vibratoDepth")}
					valueFormatter={depthControl.formatter}
					modDestination={modDestinationByParam.depth}
					onClick={depthMidiLearn.onClick}
					onContextMenu={depthMidiLearn.onContextMenu}
					interactionLocked={depthMidiLearn.interactionLocked}
					midiLearnState={depthMidiLearn.midiLearnState}
				/>
			) : null}
			{delayControl ? (
				<ControlKnob
					value={asNumber(params.delay, delayControl.defaultValue)}
					onChange={(value) => setFxSlotParams(slot, { delay: value })}
					min={delayControl.min}
					max={delayControl.max}
					defaultValue={delayControl.defaultValue}
					color={config.color}
					label={delayLabel}
					tooltip={getTooltip("vibratoDelay")}
					valueFormatter={delayControl.formatter}
					modDestination={modDestinationByParam.delay}
					onClick={delayMidiLearn.onClick}
					onContextMenu={delayMidiLearn.onContextMenu}
					interactionLocked={delayMidiLearn.interactionLocked}
					midiLearnState={delayMidiLearn.midiLearnState}
				/>
			) : null}
		</ModuleFrame>
	);
}
