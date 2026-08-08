import { useHoverInfoHandlers } from "@/components/layout/shell/HoverInfo";
import Button from "@/components/primitives/buttons/Button";

type BadgeToggleProps = {
	active: boolean;
	label: string;
	onClick: () => void;
	tooltip?: string;
	className?: string;
};

export default function BadgeToggle({
	active,
	label,
	onClick,
	tooltip,
	className,
}: BadgeToggleProps) {
	const hoverHandlers = useHoverInfoHandlers(tooltip);

	return (
		<Button
			type="button"
			onClick={onClick}
			data-hover-info={tooltip}
			{...hoverHandlers}
			className={`btn btn-xs min-h-0 justify-self-center px-2 ${
				active
					? "border-amber-500/60 bg-amber-500/20 text-amber-300"
					: "border-cz-border bg-transparent text-cz-cream/60 hover:text-cz-cream/90"
			} ${className ?? ""}`}
		>
			{active ? `● ${label.toUpperCase()}` : `○ ${label.toUpperCase()}`}
		</Button>
	);
}
