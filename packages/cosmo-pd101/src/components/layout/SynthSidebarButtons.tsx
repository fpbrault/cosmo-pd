import { memo } from "react";
import { useTranslation } from "react-i18next";
import CzTabButton, {
	type CzTabButtonColor,
	type CzTabButtonLedColor,
} from "@/components/primitives/CzTabButton";
import { useMidiLearnStore } from "@/features/synth/midiLearnStore";
import { useModulationTargetStore } from "@/features/synth/modulationTargetStore";
import { useSynthStore } from "@/features/synth/synthStore";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import type { FxSlotType } from "@/lib/synth/bindings/synth";
import { FX_UI_META } from "../panels/drawer-modules/fxSlotModuleConfig";

type SidebarButton = {
	id: string;
};

const FX_BUTTON_SLOT_INDEX: Record<string, number> = {
	fx1: 0,
	fx2: 1,
	fx3: 2,
	fx4: 3,
	fx5: 4,
	fx6: 5,
};

const LEFT_BUTTONS: SidebarButton[] = [
	{ id: "global" },
	{ id: "midiLearn" },
	{ id: "modTarget" },
	{ id: "vintage" },
];

const FX_BUTTONS: SidebarButton[] = [
	{ id: "fx1" },
	{ id: "fx2" },
	{ id: "fx3" },
	{ id: "fx4" },
	{ id: "fx5" },
	{ id: "fx6" },
];

export default memo(function SynthSidebarButtons() {
	const { t } = useTranslation("synth");
	const globalOpen = useSynthUiStore((s) => s.globalPanelOpen);
	const setGlobalPanelOpen = useSynthUiStore((s) => s.setGlobalPanelOpen);
	const midiLearnOpen = useSynthUiStore((s) => s.midiLearnOpen);
	const setMidiLearnOpen = useSynthUiStore((s) => s.setMidiLearnOpen);
	const setMainPanelMode = useSynthUiStore((state) => state.setMainPanelMode);
	const modTargetMode = useModulationTargetStore((state) => state.modMode);
	const setModTargetMode = useModulationTargetStore(
		(state) => state.setModMode,
	);
	const clearPendingDestination = useModulationTargetStore(
		(state) => state.clearPendingDestination,
	);

	const fxSlots = useSynthStore((s) => s.fxSlots);
	const czDacEnabled = useSynthStore((s) => s.czDacEnabled);
	const setFxSlotType = useSynthStore((s) => s.setFxSlotType);
	const setFxSlotEnabled = useSynthStore((s) => s.setFxSlotEnabled);
	const setCzDacEnabled = useSynthStore((s) => s.setCzDacEnabled);

	const getSlotEnabled = (slot: number): boolean => {
		const config = fxSlots[slot];
		if (!config || config.type === "empty") return false;
		return (
			(config as { params: { enabled?: boolean } }).params?.enabled ?? false
		);
	};

	const toggleSlotEnabled = (slot: number): void => {
		const config = fxSlots[slot];
		if (!config || config.type === "empty") {
			if (slot === 3) setFxSlotType(slot, "vibrato");
			if (slot === 4) setFxSlotType(slot, "phaseMod");
			return;
		}
		setFxSlotEnabled(slot, !getSlotEnabled(slot));
	};

	const isEnabled = (buttonId: string): boolean => {
		if (buttonId === "modTarget") return modTargetMode;
		if (buttonId === "vintage") return czDacEnabled;
		const slot = FX_BUTTON_SLOT_INDEX[buttonId];
		if (slot != null) return getSlotEnabled(slot);
		return false;
	};

	const getButtonColor = (buttonId: string): CzTabButtonColor => {
		if (buttonId === "global") return "grey";
		if (buttonId === "midiLearn") return "red";
		if (buttonId === "modTarget") return "cyan";
		return "blue";
	};

	const getCustomColor = (buttonId: string): string | undefined => {
		const slot = FX_BUTTON_SLOT_INDEX[buttonId];
		if (slot == null) return undefined;
		const slotType = (fxSlots[slot]?.type ?? "empty") as FxSlotType;
		return FX_UI_META[slotType]?.color;
	};

	const getLedColor = (
		buttonId: string,
		active: boolean,
	): CzTabButtonLedColor => {
		const enabled = isEnabled(buttonId);
		if (enabled && active) return "blue";
		if (enabled) return "green";
		if (active) return "red";
		return "off";
	};

	const handleClick = (buttonId: string) => {
		if (buttonId === "global") {
			setGlobalPanelOpen(true);
			return;
		}
		if (buttonId === "midiLearn") {
			setMidiLearnOpen(!midiLearnOpen);
			return;
		}
		if (buttonId === "modTarget") {
			const nextMode = !modTargetMode;
			setModTargetMode(nextMode);
			clearPendingDestination();
			if (nextMode) {
				useMidiLearnStore.getState().setLearnMode(false);
			}
			return;
		}
		if (buttonId === "vintage") {
			setCzDacEnabled(!czDacEnabled);
			return;
		}

		const slot = FX_BUTTON_SLOT_INDEX[buttonId];
		if (slot != null) {
			toggleSlotEnabled(slot);
		}
	};

	const handleLongPress = (buttonId: string) => {
		if (FX_BUTTON_SLOT_INDEX[buttonId] == null) return;
		setMainPanelMode("fx");
	};

	const renderButton = (button: SidebarButton) => {
		const slot = FX_BUTTON_SLOT_INDEX[button.id];
		const slotType = slot != null ? (fxSlots[slot]?.type ?? "empty") : null;
		const topLabel =
			button.id === "global"
				? t("sidebar.global")
				: button.id === "midiLearn"
					? t("sidebar.midi")
					: button.id === "modTarget"
						? t("sidebar.modTarget")
						: button.id === "vintage"
							? t("sidebar.vintageTop")
							: `${t("sidebar.fxPrefix")}${button.id.slice(2)}`;
		const defaultBottomLabel =
			button.id === "midiLearn"
				? t("sidebar.learn")
				: button.id === "vintage"
					? t("sidebar.vintageBottom")
					: "";
		const bottomLabel =
			slotType == null
				? defaultBottomLabel
				: (FX_UI_META[slotType as FxSlotType]?.shortTitle ??
					defaultBottomLabel);
		const active =
			button.id === "global"
				? globalOpen
				: button.id === "midiLearn"
					? midiLearnOpen
					: isEnabled(button.id);
		const customColor = getCustomColor(button.id);
		const effectName =
			slotType && slotType !== "empty"
				? (FX_UI_META[slotType as FxSlotType]?.title ?? bottomLabel)
				: undefined;
		const tooltip =
			button.id === "global"
				? t("tooltips.sidebar.global")
				: button.id === "midiLearn"
					? t("tooltips.sidebar.midiLearn")
					: button.id === "modTarget"
						? t("tooltips.sidebar.modTarget")
						: button.id === "vintage"
							? t("tooltips.sidebar.vintage")
							: t("tooltips.sidebar.effectSlot", {
									effect:
										effectName ??
										t("tooltips.sidebar.effectSlotName", {
											slot: button.id.slice(2),
										}),
								});
		return (
			<CzTabButton
				key={button.id}
				color={customColor ? "black" : getButtonColor(button.id)}
				customColor={customColor}
				active={active}
				ledColor={getLedColor(button.id, active)}
				onClick={() => handleClick(button.id)}
				onLongPress={
					slot != null ? () => handleLongPress(button.id) : undefined
				}
				topLabel={topLabel}
				bottomLabel={bottomLabel}
				tooltip={tooltip}
			/>
		);
	};

	return (
		<div className="mx-auto mt-2 grid max-w-fit grid-cols-[2fr_3fr] gap-1.5 px-2">
			<div className="grid grid-cols-2 gap-1 gap-y-2">
				{LEFT_BUTTONS.map(renderButton)}
			</div>
			<div className="grid grid-cols-3 gap-1 gap-y-2">
				{FX_BUTTONS.map(renderButton)}
			</div>
		</div>
	);
});
