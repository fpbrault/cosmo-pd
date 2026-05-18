import { memo } from "react";
import CzTabButton, {
	type CzTabButtonColor,
	type CzTabButtonLedColor,
} from "@/components/primitives/CzTabButton";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { useSynthStore } from "@/features/synth/synthStore";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import type { FxSlotType } from "@/lib/synth/bindings/synth";

type SynthSidebarButtonsProps = {
	globalOpen: boolean;
	onOpenGlobal: () => void;
};

type SidebarButton = {
	id: string;
	topLabel: string;
	bottomLabel: string;
};

const FX_BUTTON_SLOT_INDEX: Record<string, number> = {
	fx1: 0,
	fx2: 1,
	fx3: 2,
	fx4: 3,
	fx5: 4,
	fx6: 5,
};

const FX_TYPE_COLORS: Record<FxSlotType, string> = {
	empty: "#3b3b3b",
	chorus: "#818cf8",
	phaser: "#a78bfa",
	delay: "#fbbf24",
	reverb: "#f97316",
	vibrato: "#307948",
	phaseMod: "#be3330",
	compressor: "#facc15",
	eq5Band: "#34d399",
	grainDelay: "#f59e0b",
	bitcrusher: "#f87171",
	shimmerVerb: "#60a5fa",
	distortion: "#f59e0b",
	junoChorus: "#22d3ee",
	ringMod: "#e879f9",
	tremolo: "#4ade80",
	wavefolder: "#c084fc",
	loFi: "#38bdf8",
};

const FX_TYPE_SHORT_LABELS: Record<FxSlotType, string> = {
	empty: "—",
	chorus: "Chrs",
	phaser: "Phsr",
	delay: "Dly",
	reverb: "Rvb",
	vibrato: "Vib",
	phaseMod: "PhMd",
	compressor: "Comp",
	eq5Band: "EQ",
	grainDelay: "GrDl",
	bitcrusher: "Bit",
	shimmerVerb: "Shim",
	distortion: "Dist",
	junoChorus: "Juno",
	ringMod: "Ring",
	tremolo: "Trem",
	wavefolder: "Wave",
	loFi: "LoFi",
};

const LEFT_BUTTONS: SidebarButton[] = [
	{ id: "global", topLabel: "Global", bottomLabel: "" },
	{ id: "polyMode", topLabel: "Poly8", bottomLabel: "" },
	{ id: "portamentoEnabled", topLabel: "Porta", bottomLabel: "Mento" },
];

const FX_BUTTONS: SidebarButton[] = [
	{ id: "fx1", topLabel: "FX1", bottomLabel: "" },
	{ id: "fx2", topLabel: "FX2", bottomLabel: "" },
	{ id: "fx3", topLabel: "FX3", bottomLabel: "" },
	{ id: "fx4", topLabel: "FX4", bottomLabel: "" },
	{ id: "fx5", topLabel: "FX5", bottomLabel: "" },
	{ id: "fx6", topLabel: "FX6", bottomLabel: "" },
];

export default memo(function SynthSidebarButtons({
	globalOpen,
	onOpenGlobal,
}: SynthSidebarButtonsProps) {
	const setMainPanelMode = useSynthUiStore((state) => state.setMainPanelMode);
	const { value: polyMode, setValue: setPolyMode } = useSynthParam("polyMode");
	const { value: portamentoEnabled, setValue: setPortamentoEnabled } =
		useSynthParam("portamentoEnabled");

	const fxSlots = useSynthStore((s) => s.fxSlots);
	const setFxSlotType = useSynthStore((s) => s.setFxSlotType);
	const setFxSlotEnabled = useSynthStore((s) => s.setFxSlotEnabled);

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
		if (buttonId === "polyMode") return polyMode === "mono";
		if (buttonId === "portamentoEnabled") return portamentoEnabled as boolean;
		const slot = FX_BUTTON_SLOT_INDEX[buttonId];
		if (slot != null) return getSlotEnabled(slot);
		return false;
	};

	const getButtonColor = (buttonId: string): CzTabButtonColor => {
		if (buttonId === "global") return "cyan";
		if (buttonId === "polyMode" || buttonId === "portamentoEnabled") {
			return "blue";
		}
		return "black";
	};

	const getCustomColor = (buttonId: string): string | undefined => {
		const slot = FX_BUTTON_SLOT_INDEX[buttonId];
		if (slot == null) return undefined;
		const slotType = (fxSlots[slot]?.type ?? "empty") as FxSlotType;
		return FX_TYPE_COLORS[slotType];
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
			onOpenGlobal();
			return;
		}
		if (buttonId === "polyMode") {
			setPolyMode(polyMode === "poly8" ? "mono" : "poly8");
			return;
		}
		if (buttonId === "portamentoEnabled") {
			setPortamentoEnabled(!portamentoEnabled);
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
		const bottomLabel =
			slotType == null
				? button.bottomLabel
				: (FX_TYPE_SHORT_LABELS[slotType as FxSlotType] ?? "");
		const active = button.id === "global" ? globalOpen : isEnabled(button.id);
		const customColor = getCustomColor(button.id);
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
				topLabel={
					button.id === "polyMode"
						? active
							? "Mono"
							: "Poly8"
						: button.topLabel
				}
				bottomLabel={bottomLabel}
			/>
		);
	};

	return (
		<div className="mt-2 grid grid-cols-[2fr_3fr] gap-1.5 px-2">
			<div className="grid grid-cols-2 gap-1 gap-y-2">
				{LEFT_BUTTONS.map(renderButton)}
			</div>
			<div className="grid grid-cols-3 gap-1 gap-y-2">
				{FX_BUTTONS.map(renderButton)}
			</div>
		</div>
	);
});
