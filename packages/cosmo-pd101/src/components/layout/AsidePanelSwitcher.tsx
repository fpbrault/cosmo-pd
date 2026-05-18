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
	| "phaser"
	| "midi";

const TOGGLE_TAB_IDS = new Set(["polymode", "portamentoenabled"]);

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
	const normalizeTabId = (tabId: T): string => String(tabId).toLowerCase();

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
		const en = getSlotEnabled(slot);
		setFxSlotEnabled(slot, !en);
	};

	const isTabEnabled = (tabId: T): boolean => {
		const normalized = normalizeTabId(tabId);
		const slot = FX_TAB_SLOT_INDEX[normalized];
		if (slot != null) {
			return getSlotEnabled(slot);
		}

		switch (normalized) {
			case "polymode":
				return polyMode === "mono";
			case "portamentoenabled":
				return portamentoEnabled as boolean;
			default:
				return false;
		}
	};

	const getTabColor = (tabId: T): CzTabButtonColor => {
		const normalizedTabId = normalizeTabId(tabId);
		if (
			normalizedTabId === "polymode" ||
			normalizedTabId === "portamentoenabled"
		) {
			return "blue";
		}
		if (normalizedTabId === "global") {
			return "cyan";
		}

		return "black";
	};

	const isToggleTab = (tabId: T): boolean => {
		const normalized = normalizeTabId(tabId);
		return (
			TOGGLE_TAB_IDS.has(normalized) || FX_TAB_SLOT_INDEX[normalized] != null
		);
	};

	const isFxModuleTab = (tabId: T): boolean =>
		FX_TAB_SLOT_INDEX[normalizeTabId(tabId)] != null;

	const getCustomTabColor = (tabId: T): string | undefined => {
		const normalizedTabId = normalizeTabId(tabId);
		const slot = FX_TAB_SLOT_INDEX[normalizedTabId];
		if (slot != null) {
			const slotType = (fxSlots[slot]?.type ?? "empty") as FxSlotType;
			return FX_TYPE_COLORS[slotType];
		}
		return undefined;
	};

	const toggleTab = (tabId: T) => {
		const normalized = normalizeTabId(tabId);
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
			!isToggleTab(activeTab),
	);

	const visibleTabs = panelElements.map((child) => {
		const panelType = child.type as AsidePanelComponent<T>;
		const normalizedTabId = String(panelType.panelId).toLowerCase();
		const slot = FX_TAB_SLOT_INDEX[normalizedTabId];
		if (slot != null) {
			const type = (fxSlots[slot]?.type ?? "empty") as FxSlotType;
			return {
				id: panelType.panelId,
				topLabel: `FX${slot + 1}`,
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
		(tab) => normalizeTabId(tab.id) === "global",
	);
	const scopeTab = visibleTabs.find(
		(tab) => normalizeTabId(tab.id) === "scope",
	);
	const fxTabs = visibleTabs
		.filter((tab) => FX_TAB_SLOT_INDEX[normalizeTabId(tab.id)] != null)
		.sort(
			(a, b) =>
				FX_TAB_SLOT_INDEX[normalizeTabId(a.id)] -
				FX_TAB_SLOT_INDEX[normalizeTabId(b.id)],
		);
	const otherTabs = visibleTabs.filter((tab) => {
		const normalized = normalizeTabId(tab.id);
		return (
			normalized !== "global" &&
			normalized !== "scope" &&
			FX_TAB_SLOT_INDEX[normalized] == null
		);
	});

	const leftTabs = [
		...(globalTab ? [globalTab] : []),
		...(scopeTab ? [scopeTab] : []),
		...utilityToggleTabs,
		...otherTabs,
	];

	const renderTabButton = (tab: AsidePanelButtonTab<T>) => (
		<CzTabButton
			key={tab.id}
			color={getCustomTabColor(tab.id) ? "black" : getTabColor(tab.id)}
			customColor={getCustomTabColor(tab.id)}
			active={isToggleTab(tab.id) ? isTabEnabled(tab.id) : activeTab === tab.id}
			ledColor={getTabLedColor(tab.id, activeTab === tab.id)}
			onClick={() => handleTabClick(tab.id)}
			onLongPress={
				isFxModuleTab(tab.id) ? () => handleTabLongPress(tab.id) : undefined
			}
			topLabel={tab.topLabel}
			bottomLabel={tab.bottomLabel}
		/>
	);

	return (
		<div className="space-y-2 px-2 pb-2">
			<div className="mt-2 grid grid-cols-[2fr_3fr] gap-1.5">
				<div className="grid grid-cols-2 gap-1 gap-y-2">
					{leftTabs.map(renderTabButton)}
				</div>
				<div className="grid grid-cols-3 gap-1 gap-y-2">
					{fxTabs.map(renderTabButton)}
				</div>
			</div>
			{activePanel}
		</div>
	);
}
