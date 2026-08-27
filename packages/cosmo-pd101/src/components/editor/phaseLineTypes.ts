import type {
	AlgoControlBinding,
	AlgoControlOptionRuntime,
	AlgoControlRuntime,
	LineIndex,
} from "@/components/controls/algo/algoControlTypes";
import type { EnvTab } from "@/features/synth/synthUiStore";
import type {
	AlgoControlValueV1,
	BaseWaveform,
	StepEnvData,
} from "@/lib/synth/bindings/synth";
import type { PdAlgo } from "@/lib/synth/pdAlgorithms";

export type PhaseLineSection = "algos" | "envelopes";

export type PhaseLineMeta = {
	label: string;
	color: string;
	lineIndex: LineIndex;
	isAudible: boolean;
	inactiveModeLabel: string;
};

export type PhaseLineAlgoModel = {
	algoA: PdAlgo;
	setAlgoA: (value: PdAlgo) => void;
	algoB: PdAlgo | null;
	setAlgoB: (value: PdAlgo | null) => void;
	blend: number;
	setBlend: (value: number) => void;
	baseWaveformA: BaseWaveform;
	setBaseWaveformA: (value: BaseWaveform) => void;
	baseWaveformB: BaseWaveform;
	setBaseWaveformB: (value: BaseWaveform) => void;
	controlsA: AlgoControlValueV1[];
	setControlsA: (value: AlgoControlValueV1[]) => void;
	updateControlA: (id: string, value: number) => void;
	controlsB: AlgoControlValueV1[];
	setControlsB: (value: AlgoControlValueV1[]) => void;
	updateControlB: (id: string, value: number) => void;
};

export type PhaseLineParametersModel = {
	warpAmount: number;
	setWarpAmount: (value: number) => void;
	level: number;
	setLevel: (value: number) => void;
	octave: number;
	setOctave: (value: number) => void;
	lineSelect: string;
	detuneDisabled: boolean;
	detuneLabelPrefix: "L1'" | "L2";
	detuneOctave?: number;
	setDetuneOctave?: (value: number) => void;
	detuneNote?: number;
	setDetuneNote?: (value: number) => void;
	fineDetune?: number;
	setFineDetune?: (value: number) => void;
};

export type PhaseLineEnvelopeEntry = {
	title: string;
	env: StepEnvData;
	setEnv: (env: StepEnvData) => void;
	envColor: string;
};

export type PhaseLineEnvelopeTarget = {
	id: string;
	lineIndex: LineIndex;
	envKind: EnvTab;
	label: string;
	env: StepEnvData;
	setEnv: (env: StepEnvData) => void;
};

export type PhaseLineEnvelopeModel = {
	envs: Record<EnvTab, PhaseLineEnvelopeEntry>;
	targets: PhaseLineEnvelopeTarget[];
	dcwKeyFollow: number;
	setDcwKeyFollow: (value: number) => void;
	dcaKeyFollow: number;
	setDcaKeyFollow: (value: number) => void;
};

export type PhaseLineModel = {
	meta: PhaseLineMeta;
	algo: PhaseLineAlgoModel;
	parameters: PhaseLineParametersModel;
	envelopes: PhaseLineEnvelopeModel;
};

export type AlgoSlotViewModel = {
	slotId: "a" | "b";
	value: PdAlgo | null;
	onChange: (value: PdAlgo | null) => void;
	allowNone: boolean;
	controlsDisabled: boolean;
	controls: AlgoControlRuntime[];
	controlBindings: Record<string, AlgoControlBinding>;
	algoControlSlotIndex: Record<string, number>;
	getControlValue: (id: string, fallback: number) => number;
	setControlValue: (id: string, value: number) => void;
	getActiveSelectOption: (
		control: AlgoControlRuntime,
	) => AlgoControlOptionRuntime | null;
	applyOptionAssignments: (option: AlgoControlOptionRuntime) => void;
};
