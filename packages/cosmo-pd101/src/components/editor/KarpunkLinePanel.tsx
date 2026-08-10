import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import ControlKnob from "@/components/controls/ControlKnob";
import Card from "@/components/primitives/Card";
import { useSynthStore } from "@/features/synth/synthStore";
import type { KarpunkParams } from "@/lib/synth/bindings/synth";
import PerLineParametersCard from "./PerLineParametersCard";
import type { PhaseLineParametersModel } from "./phaseLineTypes";

type KarpunkLinePanelProps = {
	lineIndex: LineIndex;
	color: string;
	parameters: PhaseLineParametersModel;
};

type KarpunkControlKey = keyof KarpunkParams;

function KarpunkControl({
	label,
	value,
	onChange,
	color,
}: {
	label: string;
	value: number;
	onChange: (value: number) => void;
	color: string;
}) {
	return (
		<ControlKnob
			label={label}
			value={value}
			onChange={onChange}
			min={0}
			max={1}
			size={76}
			color={color}
			valueFormatter={(next) => `${Math.round(next * 100)}%`}
		/>
	);
}

export function KarpunkLinePanel({
	lineIndex,
	color,
	parameters,
}: KarpunkLinePanelProps) {
	const params = useSynthStore((state) =>
		lineIndex === 1 ? state.line1Karpunk : state.line2Karpunk,
	);
	const setParams = useSynthStore((state) =>
		lineIndex === 1 ? state.setLine1Karpunk : state.setLine2Karpunk,
	);
	const setControl = (key: KarpunkControlKey, value: number) =>
		setParams({ ...params, [key]: value });

	return (
		<div
			className="grid h-full min-h-0 grid-cols-[minmax(10rem,1fr)_minmax(15rem,1.15fr)_minmax(10rem,1fr)] gap-4 [@container_phase_(max-height:620px)]:gap-2"
			data-testid="karpunk-line-panel"
		>
			<Card variant="subtle" padding="none" className="flex min-h-0 flex-col">
				<div className="bg-cz-inset px-3 py-2 text-center font-bold text-cz-light-blue text-xs uppercase tracking-[0.22em]">
					Excitation
				</div>
				<div className="flex min-h-0 flex-1 flex-col items-center justify-evenly p-3">
					<KarpunkControl
						label="Excite"
						value={params.excitation ?? 0}
						onChange={(value) => setControl("excitation", value)}
						color={color}
					/>
					<KarpunkControl
						label="Brightness"
						value={params.brightness ?? 0.5}
						onChange={(value) => setControl("brightness", value)}
						color="#9cb937"
					/>
				</div>
			</Card>

			<div className="flex min-h-0 flex-col gap-4 [@container_phase_(max-height:620px)]:gap-2">
				<Card
					variant="subtle"
					padding="none"
					className="flex min-h-36 grow flex-col overflow-hidden"
				>
					<div className="px-3 pt-2 text-center text-3xs text-cz-cream uppercase tracking-[0.24em]">
						Plucked String
					</div>
					<svg
						aria-label="Karpunk string response"
						viewBox="0 0 360 150"
						className="min-h-0 w-full flex-1"
						fill="none"
					>
						<path d="M16 122 H344" stroke="#555" strokeWidth="1" />
						<path
							d={`M16 122 C90 ${28 + (1 - (params.excitation ?? 0)) * 45} 132 ${112 - (params.brightness ?? 0.5) * 76} 188 82 S282 ${42 + (1 - (params.decay ?? 0.5)) * 66} 344 122`}
							stroke={color}
							strokeWidth="3"
						/>
					</svg>
				</Card>
				<PerLineParametersCard
					parameters={parameters}
					lineIndex={lineIndex}
					warpLabel="Tone"
				/>
			</div>

			<Card variant="subtle" padding="none" className="flex min-h-0 flex-col">
				<div className="bg-cz-inset px-3 py-2 text-center font-bold text-cz-light-blue text-xs uppercase tracking-[0.22em]">
					String
				</div>
				<div className="flex min-h-0 flex-1 flex-col items-center justify-evenly p-3">
					<KarpunkControl
						label="Damping"
						value={params.damping ?? 0.5}
						onChange={(value) => setControl("damping", value)}
						color="#60a5fa"
					/>
					<KarpunkControl
						label="Decay"
						value={params.decay ?? 0.5}
						onChange={(value) => setControl("decay", value)}
						color="#f97316"
					/>
				</div>
			</Card>
		</div>
	);
}
