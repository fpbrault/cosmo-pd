import type React from "react";
import { createContext, useContext } from "react";

/**
 * Shared context between FxSlotFrame (provider) and ModuleFrame (consumer).
 * Injects dnd-kit drag handle props and the type-selector control into the
 * module header without requiring ModuleFrame to know about FX slot mechanics.
 */
export type FxSlotContextValue = {
	/** dnd-kit event listeners — spread onto the drag handle element */
	dragListeners:
		| Record<string, React.EventHandler<React.SyntheticEvent>>
		| undefined;
	/** dnd-kit accessibility attributes — spread onto the drag handle element */
	dragAttributes: Record<string, string | boolean | number | undefined>;
	/** Type-selector trigger ReactNode — rendered in the header right corner */
	typeSelector: React.ReactNode;
};

export const FxSlotContext = createContext<FxSlotContextValue | null>(null);

export function useFxSlotContext(): FxSlotContextValue | null {
	return useContext(FxSlotContext);
}
