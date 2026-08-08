import { useMemo } from "react";
import { FxSlotModuleProvider } from "@/components/panels/effects/modules/core/FxSlotModuleContext";
import type { FxSlotModuleConfig } from "@/components/panels/effects/modules/core/fxSlotModuleConfig";
import GenericFxSlotModule from "@/components/panels/effects/modules/core/GenericFxSlotModule";
import DelayModuleRenderer from "@/components/panels/effects/modules/custom/DelayModuleRenderer";
import Eq8BandModuleRenderer from "@/components/panels/effects/modules/custom/Eq8BandModuleRenderer";
import GrainDelayModuleRenderer from "@/components/panels/effects/modules/custom/GrainDelayModuleRenderer";
import PhaseModModuleRenderer from "@/components/panels/effects/modules/custom/PhaseModModuleRenderer";
import TremoloModuleRenderer from "@/components/panels/effects/modules/custom/TremoloModuleRenderer";
import VibratoModuleRenderer from "@/components/panels/effects/modules/custom/VibratoModuleRenderer";

const FX_CUSTOM_RENDERERS = {
	delayModuleRenderer: DelayModuleRenderer,
	eq8BandModuleRenderer: Eq8BandModuleRenderer,
	grainDelayModuleRenderer: GrainDelayModuleRenderer,
	phaseModModuleRenderer: PhaseModModuleRenderer,
	tremoloModuleRenderer: TremoloModuleRenderer,
	vibratoModuleRenderer: VibratoModuleRenderer,
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
