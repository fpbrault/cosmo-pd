import type { PointerEvent as ReactPointerEvent } from "react";

type MiniKeyboardResizeHandleProps = {
	onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
};

export default function MiniKeyboardResizeHandle({
	onPointerDown,
}: MiniKeyboardResizeHandleProps) {
	return (
		<div
			className="flex h-4 cursor-row-resize items-center justify-center gap-1 hover:bg-cz-light-blue/10 active:bg-cz-light-blue/20"
			onPointerDown={onPointerDown}
		>
			<div className="h-0.5 w-0.5 rounded-full bg-cz-cream/40" />
			<div className="h-0.5 w-0.5 rounded-full bg-cz-cream/40" />
			<div className="h-0.5 w-0.5 rounded-full bg-cz-cream/40" />
			<div className="h-0.5 w-0.5 rounded-full bg-cz-cream/40" />
		</div>
	);
}
