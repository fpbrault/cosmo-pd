import type {
	AsidePanelComponent,
	AsidePanelTab,
} from "@/components/layout/AsidePanelSwitcher";
import FxSlotModuleRenderer from "@/components/panels/drawer-modules/FxSlotModuleRenderer";
import { FX_SLOT_MODULE_CONFIGS } from "@/components/panels/drawer-modules/fxSlotModuleConfig";
import { useSynthStore } from "@/features/synth/synthStore";

function FxSlotPanelInner({ slot }: { slot: number }) {
	const rawSlot = useSynthStore((s) => s.fxSlots[slot]);
	if (!rawSlot || rawSlot.type === "empty") {
		return (
			<p className="p-4 font-mono text-cz-cream-dim text-sm">
				No FX loaded in slot {slot + 1}.
			</p>
		);
	}
	const config = FX_SLOT_MODULE_CONFIGS[rawSlot.type];
	if (!config) {
		return (
			<p className="p-4 font-mono text-cz-cream-dim text-sm">{rawSlot.type}</p>
		);
	}
	return <FxSlotModuleRenderer config={config} slot={slot} />;
}

const FX_SLOT_PANEL_DEFS: [AsidePanelTab, number][] = [
	["chorus", 0],
	["delay", 1],
	["reverb", 2],
	["vibrato", 3],
	["phaseMod", 4],
	["phaser", 5],
];

export const FX_SLOT_PANELS: AsidePanelComponent<AsidePanelTab>[] =
	FX_SLOT_PANEL_DEFS.map(([panelId, slot]) =>
		Object.assign(
			function FxSlotPanel() {
				return <FxSlotPanelInner slot={slot} />;
			},
			{
				panelId,
				panelTab: { topLabel: `FX${slot + 1}`, bottomLabel: "" },
			},
		),
	);
