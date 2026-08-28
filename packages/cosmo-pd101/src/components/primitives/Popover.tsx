import {
	autoUpdate,
	FloatingFocusManager,
	FloatingPortal,
	flip,
	offset,
	type Placement,
	shift,
	useDismiss,
	useFloating,
	useInteractions,
} from "@floating-ui/react";
import { type ReactNode, useEffect, useState } from "react";
import "@/index.css";

export interface PopoverProps {
	open: boolean;
	onClose: () => void;
	triggerRef: React.RefObject<Element | null>;
	children: ReactNode;
	role?: "dialog" | "listbox" | "menu";
	ariaLabel?: string;
	ariaDescribedby?: string;
	ariaLabelledby?: string;
	modal?: boolean;
	closeOnOutsidePress?: boolean;
	placement?: Placement;
	initialFocus?: number;
}

export default function Popover({
	open,
	onClose,
	triggerRef,
	role = "dialog",
	ariaLabel,
	ariaDescribedby,
	ariaLabelledby,
	modal = true,
	closeOnOutsidePress = true,
	placement = "bottom",
	initialFocus,
	children,
}: PopoverProps) {
	const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(() =>
		typeof document !== "undefined"
			? ((document.fullscreenElement as HTMLElement) ?? document.body)
			: null,
	);

	useEffect(() => {
		const updateRoot = () => {
			setPortalRoot(
				typeof document !== "undefined"
					? ((document.fullscreenElement as HTMLElement) ?? document.body)
					: null,
			);
		};
		document.addEventListener("fullscreenchange", updateRoot);
		return () => document.removeEventListener("fullscreenchange", updateRoot);
	}, []);

	const { refs, floatingStyles, context } = useFloating({
		open,
		onOpenChange: (isOpen) => {
			if (!isOpen) onClose();
		},
		placement,
		middleware: [offset(8), flip(), shift({ padding: 12 })],
		whileElementsMounted: autoUpdate,
	});

	useEffect(() => {
		if (triggerRef.current) {
			refs.setReference(triggerRef.current);
		}
	}, [triggerRef, triggerRef.current, refs]);

	const dismiss = useDismiss(context, {
		enabled: open,
		outsidePress: closeOnOutsidePress,
	});
	const { getFloatingProps } = useInteractions([dismiss]);

	if (!portalRoot) return null;

	return (
		<FloatingPortal root={portalRoot}>
			{open ? (
				<FloatingFocusManager
					context={context}
					modal={modal}
					returnFocus
					initialFocus={initialFocus}
				>
					{/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: role is dynamic ("dialog" | "listbox") — both support aria-label */}
					<div
						data-theme="cosmo"
						ref={refs.setFloating}
						style={{
							...floatingStyles,
							zIndex: 9999,
						}}
						role={role}
						aria-label={ariaLabel}
						aria-describedby={ariaDescribedby}
						aria-labelledby={ariaLabelledby}
						aria-modal={modal ? true : undefined}
						className="pointer-events-auto overflow-hidden rounded-lg border border-cz-panel bg-base-200 shadow-xl"
						{...getFloatingProps()}
					>
						{children}
					</div>
				</FloatingFocusManager>
			) : null}
		</FloatingPortal>
	);
}
