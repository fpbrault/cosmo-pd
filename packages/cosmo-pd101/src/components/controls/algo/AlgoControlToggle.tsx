import { memo } from "react";
import { useHoverInfoHandlers } from "@/components/layout/shell/HoverInfo";
import { useAlgoControl } from "@/lib/synth/i18nAlgo";
import AlgoControlTooltip from "./AlgoControlTooltip";
import type {
	AlgoControlBinding,
	AlgoControlRuntime,
} from "./algoControlTypes";

interface AlgoControlToggleProps {
	control: AlgoControlRuntime;
	disabled?: boolean;
	binding?: AlgoControlBinding;
}

function AlgoControlToggleInner({
	control,
	disabled = false,
	binding,
}: AlgoControlToggleProps) {
	const translated = useAlgoControl(control.algo, control.id);
	const label = translated.label || control.label || control.id;
	const description = translated.description || control.description || "";
	const toggleValue = binding?.getToggle?.() ?? control.defaultToggle ?? false;
	const hoverHandlers = useHoverInfoHandlers(description ?? label ?? "");

	return (
		<div className="flex items-center justify-between rounded-md bg-cz-inset/70 px-2 py-1.5">
			<div className="flex items-center gap-2">
				<span className="text-4xs text-cz-cream uppercase tracking-[0.18em]">
					{label}
				</span>
				<AlgoControlTooltip description={description} />
			</div>
			<input
				type="checkbox"
				checked={toggleValue}
				onChange={(event) => {
					binding?.setToggle?.(event.target.checked);
				}}
				data-hover-info={description ?? label ?? ""}
				{...hoverHandlers}
				disabled={disabled || !binding?.setToggle}
				className="checkbox checkbox-xs"
			/>
		</div>
	);
}

const AlgoControlToggle = memo(AlgoControlToggleInner);

export default AlgoControlToggle;
