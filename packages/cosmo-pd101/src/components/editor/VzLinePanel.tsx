import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import ControlKnob from "@/components/controls/ControlKnob";
import Card from "@/components/primitives/Card";
import type {
	VzLineParams,
	VzModuleParams,
	VzPairMode,
	VzPairParams,
	VzWaveform,
} from "@/lib/synth/bindings/synth";

type VzLinePanelProps = {
	lineIndex: LineIndex;
	color: string;
	vz: VzLineParams;
	onChange: (vz: VzLineParams) => void;
};

const WAVEFORM_OPTIONS: VzWaveform[] = [
	"sine",
	"saw1",
	"saw2",
	"saw3",
	"saw4",
	"saw5",
	"noise",
	"noiseSine",
];

const WAVEFORM_LABELS: Record<VzWaveform, string> = {
	sine: "Sine",
	saw1: "Saw 1",
	saw2: "Saw 2",
	saw3: "Saw 3",
	saw4: "Saw 4",
	saw5: "Saw 5",
	noise: "Noise",
	noiseSine: "Noise+Sine",
};

const PAIR_MODE_OPTIONS: VzPairMode[] = ["mix", "ring", "phase"];

const PAIR_MODE_LABELS: Record<VzPairMode, string> = {
	mix: "Mix",
	ring: "Ring",
	phase: "Phase",
};

const SELECT_CLASS_NAME =
	"select select-xs h-6 min-h-0 w-full rounded border-cz-border bg-cz-inset px-1 font-mono text-[0.55rem] text-cz-cream uppercase";

function ModuleStrip({
	index,
	module,
	onChange,
	color,
}: {
	index: number;
	module: VzModuleParams;
	onChange: (module: VzModuleParams) => void;
	color: string;
}) {
	return (
		<Card
			variant="inset"
			padding="sm"
			className="flex flex-col items-center gap-2"
			data-testid={`vz-module-${index}`}
		>
			<div className="flex w-full items-center justify-between">
				<span className="font-bold text-2xs text-cz-cream tracking-[0.12em]">
					M{index + 1}
				</span>
				<label className="flex items-center gap-1 text-2xs text-cz-cream/80">
					<input
						type="checkbox"
						checked={module.enabled}
						onChange={(event) =>
							onChange({ ...module, enabled: event.target.checked })
						}
					/>
					On
				</label>
			</div>
			<select
				aria-label={`Module ${index + 1} waveform`}
				className={SELECT_CLASS_NAME}
				value={module.waveform}
				onChange={(event) =>
					onChange({ ...module, waveform: event.target.value as VzWaveform })
				}
			>
				{WAVEFORM_OPTIONS.map((waveform) => (
					<option key={waveform} value={waveform}>
						{WAVEFORM_LABELS[waveform]}
					</option>
				))}
			</select>
			<div className="grid grid-cols-2 gap-2">
				<ControlKnob
					label="OCT"
					value={module.octave ?? 0}
					onChange={(v) => onChange({ ...module, octave: v })}
					min={-4}
					max={4}
					step={1}
					size={44}
					color={color}
				/>
				<ControlKnob
					label="LEVEL"
					value={module.level ?? 0}
					onChange={(v) => onChange({ ...module, level: v })}
					min={0}
					max={1}
					size={44}
					color={color}
					valueFormatter={(v) => `${Math.round(v * 100)}%`}
				/>
				<ControlKnob
					label="NOTE"
					value={module.detuneNote ?? 0}
					onChange={(v) => onChange({ ...module, detuneNote: v })}
					min={-11}
					max={11}
					step={1}
					size={44}
					color={color}
				/>
				<ControlKnob
					label="FINE"
					value={module.detuneFine ?? 0}
					onChange={(v) => onChange({ ...module, detuneFine: v })}
					min={-60}
					max={60}
					size={44}
					color={color}
				/>
			</div>
		</Card>
	);
}

function PairStrip({
	index,
	pair,
	onChange,
	color,
}: {
	index: number;
	pair: VzPairParams;
	onChange: (pair: VzPairParams) => void;
	color: string;
}) {
	return (
		<Card
			variant="inset"
			padding="sm"
			className="flex items-center gap-3"
			data-testid={`vz-pair-${index}`}
		>
			<span className="font-bold text-2xs text-cz-cream tracking-[0.12em]">
				Pair {index + 1} (M{index * 2 + 1}+M{index * 2 + 2})
			</span>
			<select
				aria-label={`Pair ${index + 1} mode`}
				className={SELECT_CLASS_NAME}
				value={pair.mode}
				onChange={(event) =>
					onChange({ ...pair, mode: event.target.value as VzPairMode })
				}
			>
				{PAIR_MODE_OPTIONS.map((mode) => (
					<option key={mode} value={mode}>
						{PAIR_MODE_LABELS[mode]}
					</option>
				))}
			</select>
			{index === 1 && (
				<label className="flex items-center gap-1 text-2xs text-cz-cream/80">
					<input
						type="checkbox"
						checked={pair.externalPhase}
						onChange={(event) =>
							onChange({ ...pair, externalPhase: event.target.checked })
						}
					/>
					Cascade from Pair 1
				</label>
			)}
		</Card>
	);
}

export function VzLinePanel({
	lineIndex,
	color,
	vz,
	onChange,
}: VzLinePanelProps) {
	const updateModule = (index: number, next: VzModuleParams) => {
		const modules = [...vz.modules] as VzLineParams["modules"];
		modules[index] = next;
		onChange({ ...vz, modules });
	};
	const updatePair = (index: number, next: VzPairParams) => {
		const pairs = [...vz.pairs] as VzLineParams["pairs"];
		pairs[index] = next;
		onChange({ ...vz, pairs });
	};

	return (
		<div
			data-testid="vz-line-panel"
			className="flex h-full min-h-0 flex-col gap-2 overflow-y-auto p-1"
		>
			<div className="grid @min-[560px]:grid-cols-4 grid-cols-2 gap-2">
				{vz.modules.map((module, index) => (
					<ModuleStrip
						// biome-ignore lint/suspicious/noArrayIndexKey: fixed 4-slot hardware module array (M1-M4), never reordered
						key={`${lineIndex}-module-${index}`}
						index={index}
						module={module}
						onChange={(next) => updateModule(index, next)}
						color={color}
					/>
				))}
			</div>
			<div className="flex flex-col gap-2">
				{vz.pairs.map((pair, index) => (
					<PairStrip
						// biome-ignore lint/suspicious/noArrayIndexKey: fixed 2-slot pair array, never reordered
						key={`${lineIndex}-pair-${index}`}
						index={index}
						pair={pair}
						onChange={(next) => updatePair(index, next)}
						color={color}
					/>
				))}
			</div>
		</div>
	);
}
