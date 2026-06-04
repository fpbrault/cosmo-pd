import { createContext, type ReactNode, useContext } from "react";
import type { PresetManagerController } from "@/features/synth/useSynthPresetManager";

const PresetManagerContext = createContext<PresetManagerController | undefined>(
	undefined,
);

export const PresetManagerProvider = ({
	children,
	value,
}: {
	children: ReactNode;
	value: PresetManagerController;
}) => {
	return (
		<PresetManagerContext.Provider value={value}>
			{children}
		</PresetManagerContext.Provider>
	);
};

export const usePresetManager = () => {
	const context = useContext(PresetManagerContext);
	if (!context) {
		throw new Error(
			"usePresetManager must be used within a PresetManagerProvider",
		);
	}
	return context;
};
