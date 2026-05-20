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
}) {
	const keyClassName = black ? BLACK_KEY_CLASS_NAME : WHITE_KEY_CLASS_NAME;
	const activeClassName = black
		? "!border-cz-light-blue !bg-cz-light-blue"
		: "translate-y-px !border-cz-light-blue !bg-cz-light-blue";

	const octave = Math.floor(note / 12) - 1;
	const noteName = `${label}${octave}`;

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
			{!black && label === "C" ? (
				<span className="mb-1 text-center font-semibold text-[0.55rem] text-gray-400 leading-none">
					{noteName}
				</span>
			) : null}
		</Button>
	);
}

type MiniKeyboardKeybedProps = {
	keyboardHeight: number;
	whiteKeys: KeyConfig[];
	blackKeys: KeyConfig[];
	blackKeyWidth: number;
	activeNotes: Set<number>;
	onKeyPointerDown: (
		event: ReactPointerEvent<HTMLButtonElement>,
		note: number,
	) => void;
};

export default function MiniKeyboardKeybed({
	keyboardHeight,
	whiteKeys,
	blackKeys,
	blackKeyWidth,
	activeNotes,
	onKeyPointerDown,
}: MiniKeyboardKeybedProps) {
	return (
		<div className="relative overflow-hidden rounded-none border border-cz-border/70 border-x-0 border-b-0 bg-cz-inset px-2">
			<div
				className="relative flex gap-0.5 overflow-hidden rounded-md border border-cz-border/65 bg-cz-surface p-1"
				style={{ height: keyboardHeight }}
			>
				{whiteKeys.map((key) => (
					<PianoKey
						key={key.note}
						note={key.note}
						label={key.label}
						active={activeNotes.has(key.note)}
						onPointerDown={onKeyPointerDown}
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
					/>
				))}
			</div>
		</div>
	);
}
