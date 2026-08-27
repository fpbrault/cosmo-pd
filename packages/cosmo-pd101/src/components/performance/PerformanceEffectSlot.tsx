import { useRef, useState } from "react";
import {
	MdClose,
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

export default function PerformanceEffectSlot({ slot }: { slot: number }) {
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
				aria-haspopup="dialog"
				aria-expanded={settingsOpen}
				onClick={() => setSettingsOpen((current) => !current)}
				className={`btn btn-circle btn-ghost absolute top-1 right-1 size-7 min-h-0 p-0 hover:text-cz-light-blue ${settingsOpen ? "bg-cz-inset text-cz-light-blue ring-1 ring-cz-light-blue/60" : "text-cz-cream/55"}`}
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
				closeOnOutsidePress={false}
				modal={false}
				placement="top"
				ariaLabel={`Edit ${effectLabel}`}
			>
				<div className="flex h-[18rem] w-[min(18rem,calc(100vw-2rem))] flex-col gap-2 p-2">
					<div className="flex shrink-0 items-center justify-between border-cz-border border-b pb-1">
						<span className="font-bold font-mono text-[0.55rem] text-cz-cream uppercase tracking-[0.14em]">
							{effectLabel}
						</span>
						<button
							type="button"
							aria-label={`Close ${effectLabel} editor`}
							onClick={() => setSettingsOpen(false)}
							className="btn btn-ghost btn-xs size-6 min-h-0 rounded-sm p-0 text-cz-cream/65 hover:text-cz-cream"
						>
							<MdClose className="size-4" />
						</button>
					</div>
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
