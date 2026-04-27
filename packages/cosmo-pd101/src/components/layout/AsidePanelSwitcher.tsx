import {
	Children,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from "react";
import CzTabButton, {
	type CzTabButtonColor,
	type CzTabButtonLedColor,
} from "@/components/primitives/CzTabButton";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { useSynthStore } from "@/features/synth/synthStore";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import type { FxSlotType } from "@/lib/synth/bindings/synth";

export type AsidePanelButtonTab<T extends string> = {
	id: T;
	topLabel: string;
	bottomLabel: string;
};

export type AsidePanelTab =
	| "scope"
	| "global"
	| "phaseMod"
	| "vibrato"
	| "chorus"
	| "delay"
	| "reverb"
	| "phaser";

const TOGGLE_TAB_IDS = new Set([
	"polymode",
	"portamentoenabled",
	"phasemod",
	"vibrato",
	"chorus",
	"delay",
	"reverb",
	"phaser",
]);

const FX_MODULE_TAB_IDS = new Set([
	"phasemod",
	"vibrato",
	"chorus",
	"delay",
	"reverb",
	"phaser",
]);

const FX_TAB_SLOT_INDEX: Record<string, number> = {
	chorus: 0,
	delay: 1,
	reverb: 2,
	vibrato: 3,
	phasemod: 4,
	phaser: 5,
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
};

export type AsidePanelTabMeta = {
	topLabel: string;
	bottomLabel: string;
};

export type AsidePanelComponent<T extends string = string> = {
	(props: object): ReactElement;
	panelId: T;
	panelTab: AsidePanelTabMeta;
};

type AsidePanelSwitcherProps<T extends string> = {
	activeTab: T;
	onTabChange: (tab: T) => void;
	children: ReactNode;
};

export default function AsidePanelSwitcher<T extends string>({
	activeTab,
	onTabChange,
	children,
}: AsidePanelSwitcherProps<T>) {
	const setMainPanelMode = useSynthUiStore((state) => state.setMainPanelMode);
	const { value: polyMode, setValue: setPolyMode } = useSynthParam("polyMode");
	const { value: portamentoEnabled, setValue: setPortamentoEnabled } =
		useSynthParam("portamentoEnabled");
	const { value: phaseModEnabled } = useSynthParam("phaseModEnabled");
	const { value: vibratoEnabled } = useSynthParam("vibratoEnabled");
	const { setValue: setPhaseModEnabled } = useSynthParam("phaseModEnabled");
	const { setValue: setVibratoEnabled } = useSynthParam("vibratoEnabled");

	const fxSlots = useSynthStore((s) => s.fxSlots);
	const setFxSlotEnabled = useSynthStore((s) => s.setFxSlotEnabled);

	const getSlotEnabled = (slot: number): boolean => {
		const config = fxSlots[slot];
		if (!config) return false;
		if (config.type === "empty") return false;
		if (config.type === "phaseMod") return phaseModEnabled;
		if (config.type === "vibrato") return vibratoEnabled;
		return (
			(config as { params: { enabled?: boolean } }).params?.enabled ?? false
		);
	};

	const toggleSlotEnabled = (slot: number): void => {
		const config = fxSlots[slot];
		if (!config || config.type === "empty") return;
		const en = getSlotEnabled(slot);
		if (config.type === "vibrato") {
			setVibratoEnabled(!en);
			return;
		}
		if (config.type === "phaseMod") {
			setPhaseModEnabled(!en);
			return;
		}
		setFxSlotEnabled(slot, !en);
	};

	const isTabEnabled = (tabId: T): boolean => {
		const normalized = String(tabId).toLowerCase();
		const slot = FX_TAB_SLOT_INDEX[normalized];
		if (slot != null) {
			return getSlotEnabled(slot);
		}

		switch (normalized) {
			case "polymode":
				return polyMode === "mono";
			case "portamentoenabled":
				return portamentoEnabled;
			default:
				return false;
		}
	};

	const getTabColor = (tabId: T): CzTabButtonColor => {
		const normalizedTabId = String(tabId).toLowerCase();

		if (normalizedTabId === "phasemod" || normalizedTabId === "vibrato") {
			return "red";
		}

		if (
			normalizedTabId === "chorus" ||
			normalizedTabId === "delay" ||
			normalizedTabId === "reverb" ||
			normalizedTabId === "phaser"
		) {
			return "blue";
		}
		if (normalizedTabId === "scope" || normalizedTabId === "global") {
			return "cyan";
		}

		return "black";
	};

	const isToggleTab = (tabId: T): boolean =>
		TOGGLE_TAB_IDS.has(String(tabId).toLowerCase());

	const isFxModuleTab = (tabId: T): boolean =>
		FX_MODULE_TAB_IDS.has(String(tabId).toLowerCase());

	const getCustomTabColor = (tabId: T): string | undefined => {
		const normalizedTabId = String(tabId).toLowerCase();
		const slot = FX_TAB_SLOT_INDEX[normalizedTabId];
		if (slot != null) {
			return FX_TYPE_COLORS[fxSlots[slot]?.type as FxSlotType];
		}
		return undefined;
	};

	const toggleTab = (tabId: T) => {
		const normalized = String(tabId).toLowerCase();
		const slot = FX_TAB_SLOT_INDEX[normalized];
		if (slot != null) {
			toggleSlotEnabled(slot);
			return;
		}

		switch (normalized) {
			case "polymode":
				setPolyMode(polyMode === "poly8" ? "mono" : "poly8");
				break;
			case "portamentoenabled":
				setPortamentoEnabled(!portamentoEnabled);
				break;
		}
	};

	const handleTabClick = (tabId: T) => {
		if (isToggleTab(tabId)) {
			toggleTab(tabId);
			return;
		}

		onTabChange(tabId);
	};

	const handleTabLongPress = (tabId: T) => {
		if (!isFxModuleTab(tabId)) {
			return;
		}

		setMainPanelMode("fx");
	};

	const getTabLedColor = (tabId: T, isActive: boolean): CzTabButtonLedColor => {
		const isEnabled = isTabEnabled(tabId);
		if (isEnabled && isActive) {
			return "blue";
		}

		if (isEnabled) {
			return "green";
		}

		if (isActive) {
			return "red";
		}

		return "off";
	};

	const panelElements = Children.toArray(children).filter(
		(child): child is ReactElement => isValidElement(child),
	);

	const activePanel = panelElements.find(
		(child) =>
			(child.type as AsidePanelComponent).panelId === String(activeTab) &&
			!TOGGLE_TAB_IDS.has(String(activeTab).toLowerCase()),
	);

	const visibleTabs = panelElements.map((child) => {
		const panelType = child.type as AsidePanelComponent<T>;
		const normalizedTabId = String(panelType.panelId).toLowerCase();
		const slot = FX_TAB_SLOT_INDEX[normalizedTabId];
		if (slot != null) {
			const type = fxSlots[slot]?.type as FxSlotType;
			return {
				id: panelType.panelId,
				topLabel: `S${slot + 1}`,
				bottomLabel: FX_TYPE_SHORT_LABELS[type] ?? type,
			};
		}
		return {
			id: panelType.panelId,
			topLabel: panelType.panelTab.topLabel,
			bottomLabel: panelType.panelTab.bottomLabel,
		};
	});

	const utilityToggleTabs = [
		{
			id: "polyMode" as T,
			topLabel: polyMode === "poly8" ? "Poly8" : "Mono",
			bottomLabel: "",
		},
		{
			id: "portamentoEnabled" as T,
			topLabel: "Porta",
			bottomLabel: "Mento",
		},
	];

	const globalTab = visibleTabs.find(
		(tab) => String(tab.id).toLowerCase() === "global",
	);
	const nonGlobalTabs = visibleTabs.filter(
		(tab) => String(tab.id).toLowerCase() !== "global",
	);
	const allTabs = [
		...(globalTab ? [globalTab] : []),
		...utilityToggleTabs,
		...nonGlobalTabs,
	];

	return (
		<div className="px-2 pb-2 space-y-2">
			<div className="grid grid-cols-5 gap-1 gap-y-2 mt-2">
				{allTabs.map((tab) => (
					<CzTabButton
						key={tab.id}
						color={getCustomTabColor(tab.id) ? "black" : getTabColor(tab.id)}
						customColor={getCustomTabColor(tab.id)}
						active={
							isToggleTab(tab.id) ? isTabEnabled(tab.id) : activeTab === tab.id
						}
						ledColor={getTabLedColor(tab.id, activeTab === tab.id)}
						onClick={() => handleTabClick(tab.id)}
						onLongPress={
							isFxModuleTab(tab.id)
								? () => handleTabLongPress(tab.id)
								: undefined
						}
						topLabel={tab.topLabel}
						bottomLabel={tab.bottomLabel}
					/>
				))}
			</div>
			{activePanel}
		</div>
	);
}
