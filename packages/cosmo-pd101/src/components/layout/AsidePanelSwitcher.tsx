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

	const fxSlotTypes = useSynthStore((s) => s.fxSlotTypes);
	const fxSlotChoruses = useSynthStore((s) => s.fxSlotChoruses);
	const fxSlotDelays = useSynthStore((s) => s.fxSlotDelays);
	const fxSlotReverbs = useSynthStore((s) => s.fxSlotReverbs);
	const fxSlotPhasers = useSynthStore((s) => s.fxSlotPhasers);
	const fxSlotCompressors = useSynthStore((s) => s.fxSlotCompressors);
	const fxSlotEqs = useSynthStore((s) => s.fxSlotEqs);
	const fxSlotGrainDelays = useSynthStore((s) => s.fxSlotGrainDelays);
	const fxSlotBitcrushers = useSynthStore((s) => s.fxSlotBitcrushers);
	const fxSlotShimmerVerbs = useSynthStore((s) => s.fxSlotShimmerVerbs);
	const fxSlotDistortions = useSynthStore((s) => s.fxSlotDistortions);
	const fxSlotJunoChoruses = useSynthStore((s) => s.fxSlotJunoChoruses);
	const fxSlotRingMods = useSynthStore((s) => s.fxSlotRingMods);
	const fxSlotTremolos = useSynthStore((s) => s.fxSlotTremolos);
	const fxSlotWavefolders = useSynthStore((s) => s.fxSlotWavefolders);
	const setFxSlotChorus = useSynthStore((s) => s.setFxSlotChorus);
	const setFxSlotDelay = useSynthStore((s) => s.setFxSlotDelay);
	const setFxSlotReverb = useSynthStore((s) => s.setFxSlotReverb);
	const setFxSlotPhaser = useSynthStore((s) => s.setFxSlotPhaser);
	const setFxSlotCompressor = useSynthStore((s) => s.setFxSlotCompressor);
	const setFxSlotEq = useSynthStore((s) => s.setFxSlotEq);
	const setFxSlotGrainDelay = useSynthStore((s) => s.setFxSlotGrainDelay);
	const setFxSlotBitcrusher = useSynthStore((s) => s.setFxSlotBitcrusher);
	const setFxSlotShimmerVerb = useSynthStore((s) => s.setFxSlotShimmerVerb);
	const setFxSlotDistortion = useSynthStore((s) => s.setFxSlotDistortion);
	const setFxSlotJunoChorus = useSynthStore((s) => s.setFxSlotJunoChorus);
	const setFxSlotRingMod = useSynthStore((s) => s.setFxSlotRingMod);
	const setFxSlotTremolo = useSynthStore((s) => s.setFxSlotTremolo);
	const setFxSlotWavefolder = useSynthStore((s) => s.setFxSlotWavefolder);

	const getSlotEnabled = (slot: number, type: FxSlotType): boolean => {
		switch (type) {
			case "chorus":
				return fxSlotChoruses[slot]?.enabled ?? false;
			case "delay":
				return fxSlotDelays[slot]?.enabled ?? false;
			case "reverb":
				return fxSlotReverbs[slot]?.enabled ?? false;
			case "phaser":
				return fxSlotPhasers[slot]?.enabled ?? false;
			case "vibrato":
				return vibratoEnabled;
			case "phaseMod":
				return phaseModEnabled;
			case "compressor": return fxSlotCompressors[slot]?.enabled ?? false;
			case "eq5Band": return fxSlotEqs[slot]?.enabled ?? false;
			case "grainDelay": return fxSlotGrainDelays[slot]?.enabled ?? false;
			case "bitcrusher": return fxSlotBitcrushers[slot]?.enabled ?? false;
			case "shimmerVerb": return fxSlotShimmerVerbs[slot]?.enabled ?? false;
			case "distortion": return fxSlotDistortions[slot]?.enabled ?? false;
			case "junoChorus": return fxSlotJunoChoruses[slot]?.enabled ?? false;
			case "ringMod": return fxSlotRingMods[slot]?.enabled ?? false;
			case "tremolo": return fxSlotTremolos[slot]?.enabled ?? false;
			case "wavefolder": return fxSlotWavefolders[slot]?.enabled ?? false;
			default: return false;
		}
	};

	const toggleSlotEnabled = (slot: number, type: FxSlotType): void => {
		const en = getSlotEnabled(slot, type);
		switch (type) {
			case "chorus":
				setFxSlotChorus(slot, { ...fxSlotChoruses[slot], enabled: !en });
				break;
			case "delay":
				setFxSlotDelay(slot, { ...fxSlotDelays[slot], enabled: !en });
				break;
			case "reverb":
				setFxSlotReverb(slot, { ...fxSlotReverbs[slot], enabled: !en });
				break;
			case "phaser":
				setFxSlotPhaser(slot, { ...fxSlotPhasers[slot], enabled: !en });
				break;
			case "vibrato": setVibratoEnabled(!en); break;
			case "phaseMod": setPhaseModEnabled(!en); break;
			case "compressor": setFxSlotCompressor(slot, { ...fxSlotCompressors[slot], enabled: !en }); break;
			case "eq5Band": setFxSlotEq(slot, { ...fxSlotEqs[slot], enabled: !en }); break;
			case "grainDelay": setFxSlotGrainDelay(slot, { ...fxSlotGrainDelays[slot], enabled: !en }); break;
			case "bitcrusher": setFxSlotBitcrusher(slot, { ...fxSlotBitcrushers[slot], enabled: !en }); break;
			case "shimmerVerb": setFxSlotShimmerVerb(slot, { ...fxSlotShimmerVerbs[slot], enabled: !en }); break;
			case "distortion": setFxSlotDistortion(slot, { ...fxSlotDistortions[slot], enabled: !en }); break;
			case "junoChorus": setFxSlotJunoChorus(slot, { ...fxSlotJunoChoruses[slot], enabled: !en }); break;
			case "ringMod": setFxSlotRingMod(slot, { ...fxSlotRingMods[slot], enabled: !en }); break;
			case "tremolo": setFxSlotTremolo(slot, { ...fxSlotTremolos[slot], enabled: !en }); break;
			case "wavefolder": setFxSlotWavefolder(slot, { ...fxSlotWavefolders[slot], enabled: !en }); break;
		}
	};

	const isTabEnabled = (tabId: T): boolean => {
		const normalized = String(tabId).toLowerCase();
		const slot = FX_TAB_SLOT_INDEX[normalized];
		if (slot != null) {
			return getSlotEnabled(slot, fxSlotTypes[slot]);
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
			return FX_TYPE_COLORS[fxSlotTypes[slot]];
		}
		return undefined;
	};

	const toggleTab = (tabId: T) => {
		const normalized = String(tabId).toLowerCase();
		const slot = FX_TAB_SLOT_INDEX[normalized];
		if (slot != null) {
			toggleSlotEnabled(slot, fxSlotTypes[slot]);
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
			const type = fxSlotTypes[slot];
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
