import { memo, useEffect } from "react";
import { useSynthUiStore } from "@/features/synth/synthUiStore";

export const SIMPLE_EDIT_TOGGLE_CLASS =
	"btn btn-xs size-8 min-h-0 rounded-sm border border-cz-border p-0 font-mono text-[0.62rem] aria-pressed:border-current aria-pressed:text-white";

export default memo(function CompactLineEditToggle({
	line1Editable,
	line2Editable,
}: {
	line1Editable: boolean;
	line2Editable: boolean;
}) {
	const line = useSynthUiStore((state) => state.simpleEditedLine);
	const setLine = useSynthUiStore((state) => state.setSimpleEditedLine);

	useEffect(() => {
		if (line === 1 && !line1Editable && line2Editable) setLine(2);
		if (line === 2 && !line2Editable && line1Editable) setLine(1);
	}, [line, line1Editable, line2Editable, setLine]);

	return (
		<div className="flex flex-col items-center gap-1">
			<span className="font-mono text-[0.44rem] text-cz-cream/65 uppercase tracking-[0.14em]">
				Line
			</span>
			<div className="flex gap-1">
				{([1, 2] as const).map((value) => (
					<button
						key={value}
						type="button"
						aria-label={`Edit line ${value}`}
						aria-pressed={line === value}
						disabled={value === 1 ? !line1Editable : !line2Editable}
						onClick={() => setLine(value)}
						className={`${SIMPLE_EDIT_TOGGLE_CLASS} ${line === value ? (value === 1 ? "border-[#7f9de4] bg-[#7f9de4] text-white" : "border-[#c45c5c] bg-[#c45c5c] text-white") : value === 1 ? "bg-cz-inset text-[#7f9de4]" : "bg-cz-inset text-[#c45c5c]"} disabled:opacity-30`}
					>
						{value}
					</button>
				))}
			</div>
		</div>
	);
});
