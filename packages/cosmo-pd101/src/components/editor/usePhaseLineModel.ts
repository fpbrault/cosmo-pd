import { useMemo } from "react";
import type { LineIndex } from "@/components/controls/algo/algoControlTypes";
import { useSynthParam } from "@/features/synth/SynthParamController";
import type {
	Algo,
	AlgoControlValueV1,
	BaseWaveform,
} from "@/lib/synth/bindings/synth";
import type { PhaseLineModel } from "./phaseLineTypes";

const isLineAudible = (lineIndex: LineIndex, lineSelect: unknown): boolean => {
	if (lineSelect === "L1+L2'") return true;
	if (lineSelect === "L1" || lineSelect === "L1+L1'") return lineIndex === 1;
	if (lineSelect === "L2") return lineIndex === 2;
	return true;
};

export function usePhaseLineModel(lineIndex: LineIndex): PhaseLineModel {
	const { value: warpAAmount, setValue: setWarpAAmount } =
		useSynthParam("warpAAmount");
	const { value: warpBAmount, setValue: setWarpBAmount } =
		useSynthParam("warpBAmount");
	const { value: warpAAlgo, setValue: setWarpAAlgo } =
		useSynthParam("warpAAlgo");
	const { value: warpBAlgo, setValue: setWarpBAlgo } =
		useSynthParam("warpBAlgo");
	const { value: algo2A, setValue: setAlgo2A } = useSynthParam("algo2A");
	const { value: algo2B, setValue: setAlgo2B } = useSynthParam("algo2B");
	const { value: algoBlendA, setValue: setAlgoBlendA } =
		useSynthParam("algoBlendA");
	const { value: algoBlendB, setValue: setAlgoBlendB } =
		useSynthParam("algoBlendB");
	const { value: line1Level, setValue: setLine1Level } =
		useSynthParam("line1Level");
	const { value: line2Level, setValue: setLine2Level } =
		useSynthParam("line2Level");
	const { value: lineOctave, setValue: setLineOctave } =
		useSynthParam("lineOctave");
	const { value: line2DetuneOctave, setValue: setLine2DetuneOctave } =
		useSynthParam("line2DetuneOctave");
	const { value: line2DetuneNote, setValue: setLine2DetuneNote } =
		useSynthParam("line2DetuneNote");
	const { value: line2DetuneFine, setValue: setLine2DetuneFine } =
		useSynthParam("line2DetuneFine");
	const { value: line1DcoEnv, setValue: setLine1DcoEnv } =
		useSynthParam("line1DcoEnv");
	const { value: line1DcwKeyFollow, setValue: setLine1DcwKeyFollow } =
		useSynthParam("line1DcwKeyFollow");
	const { value: line1DcaKeyFollow, setValue: setLine1DcaKeyFollow } =
		useSynthParam("line1DcaKeyFollow");
	const { value: line1DcwEnv, setValue: setLine1DcwEnv } =
		useSynthParam("line1DcwEnv");
	const { value: line1DcaEnv, setValue: setLine1DcaEnv } =
		useSynthParam("line1DcaEnv");
	const { value: line1AlgoControlsA, setValue: setLine1AlgoControlsA } =
		useSynthParam("line1AlgoControlsA");
	const { value: line1AlgoControlsB, setValue: setLine1AlgoControlsB } =
		useSynthParam("line1AlgoControlsB");
	const { value: line1BaseWaveformA, setValue: setLine1BaseWaveformA } =
		useSynthParam("line1BaseWaveformA");
	const { value: line1BaseWaveformB, setValue: setLine1BaseWaveformB } =
		useSynthParam("line1BaseWaveformB");
	const { value: line2DcoEnv, setValue: setLine2DcoEnv } =
		useSynthParam("line2DcoEnv");
	const { value: line2DcwKeyFollow, setValue: setLine2DcwKeyFollow } =
		useSynthParam("line2DcwKeyFollow");
	const { value: line2DcaKeyFollow, setValue: setLine2DcaKeyFollow } =
		useSynthParam("line2DcaKeyFollow");
	const { value: line2DcwEnv, setValue: setLine2DcwEnv } =
		useSynthParam("line2DcwEnv");
	const { value: line2DcaEnv, setValue: setLine2DcaEnv } =
		useSynthParam("line2DcaEnv");
	const { value: line2AlgoControlsA, setValue: setLine2AlgoControlsA } =
		useSynthParam("line2AlgoControlsA");
	const { value: line2AlgoControlsB, setValue: setLine2AlgoControlsB } =
		useSynthParam("line2AlgoControlsB");
	const { value: line2BaseWaveformA, setValue: setLine2BaseWaveformA } =
		useSynthParam("line2BaseWaveformA");
	const { value: line2BaseWaveformB, setValue: setLine2BaseWaveformB } =
		useSynthParam("line2BaseWaveformB");
	const { value: lineSelect } = useSynthParam("lineSelect");

	const label = lineIndex === 1 ? "Line 1" : "Line 2";
	const lineSelectLabel = lineSelect as string;
	const detuneDisabled = lineSelect === "L1" || lineSelect === "L2";
	const detuneLabelPrefix = lineSelect === "L1+L1'" ? "L1'" : "L2";

	return useMemo<PhaseLineModel>(() => {
		const isLine1 = lineIndex === 1;
		return {
			meta: {
				label,
				color: isLine1 ? "#7f9de4" : "#c45c5c",
				lineIndex,
				isAudible: isLineAudible(lineIndex, lineSelect),
				inactiveModeLabel: lineSelectLabel,
			},
			algo: {
				algoA: (isLine1 ? warpAAlgo : warpBAlgo) as Algo,
				setAlgoA: (isLine1 ? setWarpAAlgo : setWarpBAlgo) as (
					value: Algo,
				) => void,
				algoB: (isLine1 ? algo2A : algo2B) as Algo | null,
				setAlgoB: (isLine1 ? setAlgo2A : setAlgo2B) as (
					value: Algo | null,
				) => void,
				blend: (isLine1 ? algoBlendA : algoBlendB) as number,
				setBlend: isLine1 ? setAlgoBlendA : setAlgoBlendB,
				baseWaveformA: (isLine1
					? line1BaseWaveformA
					: line2BaseWaveformA) as BaseWaveform,
				setBaseWaveformA: isLine1
					? setLine1BaseWaveformA
					: setLine2BaseWaveformA,
				baseWaveformB: (isLine1
					? line1BaseWaveformB
					: line2BaseWaveformB) as BaseWaveform,
				setBaseWaveformB: isLine1
					? setLine1BaseWaveformB
					: setLine2BaseWaveformB,
				controlsA: (isLine1
					? line1AlgoControlsA
					: line2AlgoControlsA) as AlgoControlValueV1[],
				setControlsA: isLine1 ? setLine1AlgoControlsA : setLine2AlgoControlsA,
				controlsB: (isLine1
					? line1AlgoControlsB
					: line2AlgoControlsB) as AlgoControlValueV1[],
				setControlsB: isLine1 ? setLine1AlgoControlsB : setLine2AlgoControlsB,
			},
			parameters: {
				warpAmount: (isLine1 ? warpAAmount : warpBAmount) as number,
				setWarpAmount: isLine1 ? setWarpAAmount : setWarpBAmount,
				level: (isLine1 ? line1Level : line2Level) as number,
				setLevel: isLine1 ? setLine1Level : setLine2Level,
				octave: lineOctave as number,
				setOctave: setLineOctave,
				lineSelect: lineSelectLabel,
				detuneDisabled,
				detuneLabelPrefix,
				detuneOctave: line2DetuneOctave as number,
				setDetuneOctave: setLine2DetuneOctave,
				detuneNote: line2DetuneNote as number,
				setDetuneNote: setLine2DetuneNote,
				fineDetune: line2DetuneFine as number,
				setFineDetune: setLine2DetuneFine,
			},
			envelopes: {
				envs: {
					dco: {
						title: `${label} DCO`,
						env: isLine1 ? line1DcoEnv : line2DcoEnv,
						setEnv: isLine1 ? setLine1DcoEnv : setLine2DcoEnv,
						envColor: "#9cb937",
					},
					dcw: {
						title: `${label} DCW`,
						env: isLine1 ? line1DcwEnv : line2DcwEnv,
						setEnv: isLine1 ? setLine1DcwEnv : setLine2DcwEnv,
						envColor: "#60a5fa",
					},
					dca: {
						title: `${label} DCA`,
						env: isLine1 ? line1DcaEnv : line2DcaEnv,
						setEnv: isLine1 ? setLine1DcaEnv : setLine2DcaEnv,
						envColor: "#f97316",
					},
				},
				dcwKeyFollow: (isLine1
					? line1DcwKeyFollow
					: line2DcwKeyFollow) as number,
				setDcwKeyFollow: isLine1 ? setLine1DcwKeyFollow : setLine2DcwKeyFollow,
				dcaKeyFollow: (isLine1
					? line1DcaKeyFollow
					: line2DcaKeyFollow) as number,
				setDcaKeyFollow: isLine1 ? setLine1DcaKeyFollow : setLine2DcaKeyFollow,
			},
		};
	}, [
		lineIndex,
		label,
		lineSelect,
		lineSelectLabel,
		detuneDisabled,
		detuneLabelPrefix,
		warpAAmount,
		setWarpAAmount,
		warpBAmount,
		setWarpBAmount,
		warpAAlgo,
		setWarpAAlgo,
		warpBAlgo,
		setWarpBAlgo,
		algo2A,
		setAlgo2A,
		algo2B,
		setAlgo2B,
		algoBlendA,
		setAlgoBlendA,
		algoBlendB,
		setAlgoBlendB,
		line1Level,
		setLine1Level,
		line2Level,
		setLine2Level,
		lineOctave,
		setLineOctave,
		line2DetuneOctave,
		setLine2DetuneOctave,
		line2DetuneNote,
		setLine2DetuneNote,
		line2DetuneFine,
		setLine2DetuneFine,
		line1DcoEnv,
		setLine1DcoEnv,
		line2DcoEnv,
		setLine2DcoEnv,
		line1DcwEnv,
		setLine1DcwEnv,
		line2DcwEnv,
		setLine2DcwEnv,
		line1DcaEnv,
		setLine1DcaEnv,
		line2DcaEnv,
		setLine2DcaEnv,
		line1DcwKeyFollow,
		setLine1DcwKeyFollow,
		line2DcwKeyFollow,
		setLine2DcwKeyFollow,
		line1DcaKeyFollow,
		setLine1DcaKeyFollow,
		line2DcaKeyFollow,
		setLine2DcaKeyFollow,
		line1AlgoControlsA,
		setLine1AlgoControlsA,
		line2AlgoControlsA,
		setLine2AlgoControlsA,
		line1AlgoControlsB,
		setLine1AlgoControlsB,
		line2AlgoControlsB,
		setLine2AlgoControlsB,
		line1BaseWaveformA,
		setLine1BaseWaveformA,
		line2BaseWaveformA,
		setLine2BaseWaveformA,
		line1BaseWaveformB,
		setLine1BaseWaveformB,
		line2BaseWaveformB,
		setLine2BaseWaveformB,
	]);
}
