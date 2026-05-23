import { useMemo } from "react";
import DelayModuleRenderer from "@/components/panels/drawer-modules/custom/DelayModuleRenderer";
import GrainDelayModuleRenderer from "@/components/panels/drawer-modules/custom/GrainDelayModuleRenderer";
import PhaseModModuleRenderer from "@/components/panels/drawer-modules/custom/PhaseModModuleRenderer";
import TremoloModuleRenderer from "@/components/panels/drawer-modules/custom/TremoloModuleRenderer";
import VibratoModuleRenderer from "@/components/panels/drawer-modules/custom/VibratoModuleRenderer";
import { FxSlotModuleProvider } from "@/components/panels/drawer-modules/FxSlotModuleContext";
import type { FxSlotModuleConfig } from "@/components/panels/drawer-modules/fxSlotModuleConfig";
import GenericFxSlotModule from "@/components/panels/drawer-modules/GenericFxSlotModule";

const FX_CUSTOM_RENDERERS = {
	delayLegacy: DelayModuleRenderer,
	grainDelayLegacy: GrainDelayModuleRenderer,
	phaseModLegacy: PhaseModModuleRenderer,
	tremoloLegacy: TremoloModuleRenderer,
	vibratoLegacy: VibratoModuleRenderer,
} as const;

export default function FxSlotModuleRenderer({
	config,
	slot,
}: {
	config: FxSlotModuleConfig;
	slot: number;
}) {
	const CustomRenderer = useMemo(() => {
		if (!config.customRenderer) {
			return null;
		}
		return FX_CUSTOM_RENDERERS[config.customRenderer] ?? null;
	}, [config.customRenderer]);

	const Renderer = CustomRenderer ?? GenericFxSlotModule;

	return (
		<FxSlotModuleProvider config={config} slot={slot}>
			<Renderer />
		</FxSlotModuleProvider>
	);
}
