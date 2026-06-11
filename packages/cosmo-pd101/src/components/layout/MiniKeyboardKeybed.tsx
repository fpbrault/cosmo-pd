import type { PointerEvent as ReactPointerEvent } from "react";
import Button from "@/components/controls/Button";
import type { KeyConfig } from "./miniKeyboardLayout";

const WHITE_KEY_CLASS_NAME =
	"relative flex h-full flex-1 flex-col justify-end rounded-b-xs border border-cz-border/75 bg-white shadow-sm transition-all";
const BLACK_KEY_CLASS_NAME =
	"absolute top-0 z-10 h-5/7 -translate-x-1/2 rounded-b-xs border border-cz-border/80 bg-cz-inset shadow-md transition-all";

function PianoKey({
	note,
	label,
	active,
	black,
	left,
	widthPercent,
	onPointerDown,
	pcKeyLabel,
}: {
	note: number;
	label: string;
	active: boolean;
	black?: boolean;
	left?: number;
	widthPercent?: number;
	onPointerDown: (
		event: ReactPointerEvent<HTMLButtonElement>,
		note: number,
	) => void;
	pcKeyLabel?: string;
}) {
	const keyClassName = black ? BLACK_KEY_CLASS_NAME : WHITE_KEY_CLASS_NAME;
	const activeClassName = black
		? "!border-cz-light-blue !bg-cz-light-blue"
		: "translate-y-px !border-cz-light-blue !bg-cz-light-blue";

	const octave = Math.floor(note / 12) - 1;
	const noteName = `${label}${octave}`;
	const showOctaveLabel = !black && label === "C";
	const whitePcLabelClassName =
		"pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 text-center font-bold font-mono text-[0.68rem] text-cz-cream-dim leading-none";
	const blackPcLabelClassName =
		"pointer-events-none absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-bold font-mono text-[0.7rem] text-cz-cream-dim leading-none";

	return (
		<Button
			type="button"
			aria-label={`Play ${label}`}
			className={`${keyClassName} ${active ? activeClassName : ""} touch-none`}
			data-mini-note={note}
			style={
				black && left !== undefined
					? { left: `${left}%`, width: `${widthPercent}%` }
					: undefined
			}
			onPointerDown={(event) => onPointerDown(event, note)}
		>
			{pcKeyLabel ? (
				<span
					className={black ? blackPcLabelClassName : whitePcLabelClassName}
					data-mini-pc-label={note}
				>
					{pcKeyLabel}
				</span>
			) : null}
			{showOctaveLabel ? (
				<span
					className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-center font-mono font-semibold text-[0.72rem] text-gray-500 leading-none"
					data-mini-note-label={note}
				>
					{noteName}
				</span>
			) : null}
		</Button>
	);
}

type MiniKeyboardKeybedProps = {
	whiteKeys: KeyConfig[];
	blackKeys: KeyConfig[];
	blackKeyWidth: number;
	activeNotes: Set<number>;
	onKeyPointerDown: (
		event: ReactPointerEvent<HTMLButtonElement>,
		note: number,
	) => void;
	pcKeyLabels?: Record<number, string>;
};

export default function MiniKeyboardKeybed({
	whiteKeys,
	blackKeys,
	blackKeyWidth,
	activeNotes,
	onKeyPointerDown,
	pcKeyLabels,
}: MiniKeyboardKeybedProps) {
	return (
		<div className="relative h-full min-w-0 flex-1 overflow-hidden rounded-none border border-cz-border/70 border-x-0 border-b-0 bg-cz-inset px-2">
			<div className="relative flex h-full gap-0.5 overflow-hidden rounded-md border border-cz-border/65 bg-cz-surface p-1">
				{whiteKeys.map((key) => (
					<PianoKey
						key={key.note}
						note={key.note}
						label={key.label}
						active={activeNotes.has(key.note)}
						onPointerDown={onKeyPointerDown}
						pcKeyLabel={pcKeyLabels?.[key.note]}
					/>
				))}
				{blackKeys.map((key) => (
					<PianoKey
						key={key.note}
						note={key.note}
						label={key.label}
						black
						left={key.left}
						widthPercent={blackKeyWidth}
						active={activeNotes.has(key.note)}
						onPointerDown={onKeyPointerDown}
						pcKeyLabel={pcKeyLabels?.[key.note]}
					/>
				))}
			</div>
		</div>
	);
}
