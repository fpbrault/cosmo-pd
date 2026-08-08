import { createContext, type ReactNode, useContext, useMemo } from "react";
import type { FxSlotModuleConfig } from "@/components/panels/effects/modules/core/fxSlotModuleConfig";
import { useFxModuleController } from "@/components/panels/effects/modules/custom/useFxModuleController";

type FxSlotModuleContextValue = ReturnType<typeof useFxModuleController> & {
	config: FxSlotModuleConfig;
	slot: number;
};

const FxSlotModuleContext = createContext<FxSlotModuleContextValue | null>(
	null,
);

export function FxSlotModuleProvider({
	config,
	slot,
	children,
}: {
	config: FxSlotModuleConfig;
	slot: number;
	children: ReactNode;
}) {
	const controller = useFxModuleController(config, slot);
	const value = useMemo(
		() => ({
			config,
			slot,
			...controller,
		}),
		[config, controller, slot],
	);

	return (
		<FxSlotModuleContext.Provider value={value}>
			{children}
		</FxSlotModuleContext.Provider>
	);
}

export function useFxSlotModule() {
	const context = useContext(FxSlotModuleContext);
	if (!context) {
		throw new Error("useFxSlotModule must be used within FxSlotModuleProvider");
	}
	return context;
}
