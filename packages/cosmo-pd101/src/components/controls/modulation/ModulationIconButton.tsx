import type React from "react";
import Button from "@/components/controls/Button";

interface ModulationIconButtonProps {
	hasActiveRoutes: boolean;
	routeCount: number;
	label: string;
	onClick: () => void;
	forceVisible?: boolean;
	accentColor?: string;
	triggerRef?: React.RefCallback<HTMLButtonElement>;
	buttonStyle?: React.CSSProperties;
}

export default function ModulationIconButton({
	hasActiveRoutes,
	routeCount,
	label,
	onClick,
	forceVisible = false,
	accentColor,
	triggerRef,
	buttonStyle,
}: ModulationIconButtonProps) {
	return (
		<Button
			type="button"
			aria-label={label}
			onClick={onClick}
			ref={triggerRef}
			className={[
				"absolute top-1 right-1 z-10 flex h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-4xs transition-all focus:outline-none",
				hasActiveRoutes
					? "text-white"
					: "bg-cz-surface border-cz-border text-cz-cream",
				// Always hover-reveal (even when active); always visible on touch
				[
					"opacity-0 pointer-events-none",
					"group-hover:opacity-100 group-hover:pointer-events-auto",
					// Touch devices: always visible so the badge is tappable
					"[@media(hover:none)]:opacity-100 [@media(hover:none)]:pointer-events-auto",
				].join(" "),
				forceVisible ? "opacity-100! pointer-events-auto!" : "",
			].join(" ")}
			style={{
				...buttonStyle,
				...(hasActiveRoutes && accentColor
					? { backgroundColor: accentColor, borderColor: accentColor }
					: {}),
			}}
		>
			{hasActiveRoutes ? routeCount : "+"}
		</Button>
	);
}
