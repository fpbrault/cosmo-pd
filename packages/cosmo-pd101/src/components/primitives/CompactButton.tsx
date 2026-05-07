import type React from "react";
import Button from "@/components/controls/Button";
import { useHoverInfoHandlers } from "../layout/HoverInfo";

type CompactButtonProps = {
	active?: boolean;
	onClick?: () => void;
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
	tooltip?: string;
};

/**
 * Compact hardware-style selector button — no LED, no motion.
 * Designed for tight grids where CzButton is too large.
 * Active state inverts colors (light bg / dark text) like a hardware key.
 */
export default function CompactButton({
	active = false,
	onClick,
	children,
	className = "",
	disabled = false,
	tooltip,
}: CompactButtonProps) {
	const resolvedTooltip = tooltip?.trim() ? tooltip.trim() : undefined;
	const hoverHandlers = useHoverInfoHandlers(resolvedTooltip);

	return (
		<Button
			type="button"
			onClick={onClick}
			disabled={disabled}
			data-hover-info={resolvedTooltip}
			{...hoverHandlers}
			className={`inline-flex h-5 min-w-7 cursor-pointer select-none items-center justify-center rounded-xs border px-1 font-bold font-mono text-[0.56rem] uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
				active
					? "border-cz-cream bg-cz-cream text-cz-body"
					: "border-cz-btn-border bg-cz-btn text-cz-cream-dim hover:text-cz-cream"
			} ${className}`}
		>
			{children}
		</Button>
	);
}
