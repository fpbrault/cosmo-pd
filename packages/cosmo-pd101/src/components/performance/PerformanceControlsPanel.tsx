import { memo, useRef, useState } from "react";
import {
	MdDeleteOutline,
	MdPowerSettingsNew,
	MdSettings,
} from "react-icons/md";
import ControlKnob from "@/components/controls/ControlKnob";
import FxSlotModuleRenderer from "@/components/panels/drawer-modules/FxSlotModuleRenderer";
import {
	FX_SLOT_MODULE_CONFIGS,
	FX_UI_META,
} from "@/components/panels/drawer-modules/fxSlotModuleConfig";
import FxTypeSelectorPopover from "@/components/panels/FxTypeSelectorPopover";
import { getFxTypeLabel } from "@/components/panels/fxTypeCategories";
import { MacroKnob } from "@/components/panels/macro/MacroKnobsPanel";
import Popover from "@/components/primitives/Popover";
import { useSynthStore } from "@/features/synth/synthStore";
import {
	FX_DEFINITIONS_V1,
	type FxControlV1,
	type FxSlotConfig,
	type FxSlotType,
	type ModDestination,
} from "@/lib/synth/bindings/synth";

function getQuickControl(type: FxSlotType): FxControlV1 | null {
	const definition = FX_DEFINITIONS_V1.find((entry) => entry.slotType === type);
	if (!definition) return null;
	const preferredId =
		type === "vibrato" ? "depth" : type === "phaseMod" ? "intPmAmount" : "mix";
	return (
		definition.controls.find((control) => control.id === preferredId) ?? null
	);
}

function EffectSlot({ slot }: { slot: number }) {
	const config = useSynthStore((state) => state.fxSlots[slot]) as
		| FxSlotConfig
		| undefined;
	const setFxSlotType = useSynthStore((state) => state.setFxSlotType);
	const setFxSlotEnabled = useSynthStore((state) => state.setFxSlotEnabled);
	const setFxSlotParams = useSynthStore((state) => state.setFxSlotParams);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const settingsRef = useRef<HTMLButtonElement>(null);
	const [pickerOpen, setPickerOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);

	if (!config || config.type === "empty") {
		return (
			<div className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg border border-cz-border bg-cz-body/45 px-1 pt-6 pb-2 shadow-inner">
				<MdPowerSettingsNew
					aria-hidden="true"
					className="absolute top-2 left-2 size-4 text-cz-cream/25"
				/>
				<MdSettings
					aria-hidden="true"
					className="absolute top-2 right-2 size-4 text-cz-cream/25"
				/>
				<button
					ref={triggerRef}
					type="button"
					aria-label={`Add effect in slot ${slot + 1}`}
					className="btn btn-ghost btn-sm size-[4rem] min-h-0 rounded-full border-2 border-cz-cream/20 border-dashed text-cz-cream/55 text-xl hover:border-cz-light-blue/70 hover:text-cz-light-blue"
					onClick={() => setPickerOpen(true)}
				>
					+
				</button>
				<span className="font-mono text-[0.55rem] text-cz-cream/55 uppercase tracking-[0.12em]">
					Slot {slot + 1}
				</span>
				<FxTypeSelectorPopover
					open={pickerOpen}
					triggerRef={triggerRef}
					currentType="empty"
					showRemove={false}
					onSelect={(type) => {
						if (type !== "empty") setFxSlotType(slot, type);
						setPickerOpen(false);
					}}
					onClose={() => setPickerOpen(false)}
				/>
			</div>
		);
	}

	const params = config.params as Record<string, unknown>;
	const enabled = params.enabled !== false;
	const effectLabel = getFxTypeLabel(config.type);
	const moduleConfig = FX_SLOT_MODULE_CONFIGS[config.type];
	const quickControl = getQuickControl(config.type);
	const quickValue = quickControl
		? Number(
				params[quickControl.id] ??
					quickControl.defaultF32 ??
					quickControl.min ??
					0,
			)
		: 0;
	return (
		<div className="relative flex min-w-0 flex-1 flex-col items-center justify-center rounded-lg border border-cz-border bg-cz-body/45 px-1 pt-6 pb-2 shadow-inner">
			<button
				type="button"
				role="switch"
				aria-checked={enabled}
				aria-label={`${enabled ? "Bypass" : "Enable"} ${effectLabel}`}
				onClick={() => setFxSlotEnabled(slot, !enabled)}
				className={`btn btn-circle btn-ghost absolute top-1 left-1 size-7 min-h-0 p-0 ${enabled ? "text-cyan-300" : "text-cz-cream/40"}`}
			>
				<MdPowerSettingsNew className="size-4" />
			</button>
			<button
				ref={settingsRef}
				type="button"
				aria-label={`Edit ${effectLabel}`}
				onClick={() => setSettingsOpen(true)}
				className="btn btn-circle btn-ghost absolute top-1 right-1 size-7 min-h-0 p-0 text-cz-cream/55 hover:text-cz-light-blue"
			>
				<MdSettings className="size-4" />
			</button>
			<div className={enabled ? "" : "opacity-55"}>
				{quickControl ? (
					<ControlKnob
						label={`${slot + 1} · ${effectLabel}`}
						value={Number.isFinite(quickValue) ? quickValue : 0}
						onChange={(value) =>
							setFxSlotParams(slot, { [quickControl.id]: value })
						}
						min={quickControl.min ?? 0}
						max={quickControl.max ?? 1}
						defaultValue={quickControl.defaultF32 ?? undefined}
						size={72}
						variant="accent"
						color={FX_UI_META[config.type].color}
						modDestination={
							(quickControl.modDestinationKey ?? undefined) as
								| ModDestination
								| undefined
						}
						valueVisibility="hover"
						valueFormatter={(value) =>
							`${Math.round(((value - (quickControl.min ?? 0)) / Math.max(0.0001, (quickControl.max ?? 1) - (quickControl.min ?? 0))) * 100)}%`
						}
					/>
				) : (
					<div className="flex flex-col items-center gap-1">
						<div className="flex size-[4.5rem] items-center justify-center rounded-full border-2 border-cz-border text-cz-cream/60">
							—
						</div>
						<span className="max-w-24 truncate font-mono text-[0.55rem] text-cz-cream uppercase tracking-[0.08em]">
							{slot + 1} · {effectLabel}
						</span>
					</div>
				)}
			</div>
			<Popover
				open={settingsOpen}
				onClose={() => setSettingsOpen(false)}
				triggerRef={settingsRef}
				placement="top"
				ariaLabel={`Edit ${effectLabel}`}
			>
				<div className="flex h-[18rem] w-[min(18rem,calc(100vw-2rem))] flex-col gap-2 p-2">
					<div className="min-h-0 flex-1">
						{moduleConfig ? (
							<FxSlotModuleRenderer config={moduleConfig} slot={slot} />
						) : null}
					</div>
					<button
						type="button"
						aria-label={`Remove ${effectLabel}`}
						onClick={() => {
							setFxSlotType(slot, "empty");
							setSettingsOpen(false);
						}}
						className="btn btn-sm min-h-0 self-end border-red-500/35 bg-red-950/35 text-red-300 hover:bg-red-900/55"
					>
						<MdDeleteOutline className="size-4" />
						Remove effect
					</button>
				</div>
			</Popover>
		</div>
	);
}

export default memo(function PerformanceControlsPanel() {
	return (
		<section
			className="flex h-40 shrink-0 items-stretch gap-4 rounded-xl border border-cz-border bg-cz-surface/95 px-4 py-3 shadow-lg"
			data-testid="performance-controls"
		>
			<div className="flex min-w-0 flex-[1.05] flex-col">
				<h2 className="cz-collapse-header cz-section-slanted-title h-5 shrink-0 justify-center py-0 text-[0.6rem]">
					Macros
				</h2>
				<div className="flex flex-1 items-center justify-around gap-1">
					{[0, 1, 2, 3].map((index) => (
						<MacroKnob key={index} macroIndex={index} size={72} />
					))}
				</div>
			</div>
			<div className="w-px bg-cz-border" />
			<div className="flex min-w-0 flex-[2.2] flex-col">
				<h2 className="cz-collapse-header cz-section-slanted-title h-5 shrink-0 justify-center py-0 text-[0.6rem]">
					Effects
				</h2>
				<div
					className="flex min-h-0 flex-1 gap-1.5"
					data-testid="performance-fx-slots"
				>
					{[0, 1, 2, 3, 4, 5].map((slot) => (
						<EffectSlot key={slot} slot={slot} />
					))}
				</div>
			</div>
		</section>
	);
});
