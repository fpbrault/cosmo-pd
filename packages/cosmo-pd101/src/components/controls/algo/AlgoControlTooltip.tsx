import Button from "@/components/controls/Button";
import { useHoverInfoHandlers } from "../../layout/HoverInfo";

export default function AlgoControlTooltip({
	description,
}: {
	description?: string | null;
}) {
	const hoverHandlers = useHoverInfoHandlers(description);

	if (!description) {
		return null;
	}

	return (
		<Button
			type="button"
			className="btn btn-ghost btn-circle h-4 min-h-4 w-4 border border-cz-border p-0 font-semibold text-2xs text-cz-cream/70 leading-none hover:border-cz-light-blue hover:text-cz-light-blue"
			aria-label="Show control description"
			data-hover-info={description}
			{...hoverHandlers}
		>
			?
		</Button>
	);
}
