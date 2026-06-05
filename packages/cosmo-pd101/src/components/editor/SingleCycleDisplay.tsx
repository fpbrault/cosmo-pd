import { memo, useEffect, useMemo, useRef, useState } from "react";
import Card from "@/components/primitives/Card";
import {
	useOptionalSynthController,
	useSynthParam,
} from "@/features/synth/SynthParamController";
import { useSynthStore } from "@/features/synth/synthStore";
import type {
	Algo,
	AlgoControlValueV1,
	BaseWaveform,
	ModDestination,
	WindowType,
} from "@/lib/synth/bindings/synth";
import { computeWaveform } from "@/lib/synth/waveformPreview";

interface SingleCycleDisplayProps {
	data: Float32Array | number[];
	color: string;
	label: string;
	width?: number;
	height?: number;
}

export const SingleCycleDisplay = memo(function SingleCycleDisplay({
	data,
	color,
	label,
	width = 160,
	height = 60,
}: SingleCycleDisplayProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !data) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const dpr = window.devicePixelRatio || 1;
		const w = width;
		const h = height;
		canvas.width = Math.round(w * dpr);
		canvas.height = Math.round(h * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, w, h);
		ctx.strokeStyle = color;
		ctx.lineWidth = 2;
		ctx.beginPath();
		for (let i = 0; i < data.length; i++) {
			const x = (i / (data.length - 1)) * w;
			const y = h / 2 - data[i] * (h / 2 - 4);
			if (i === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		}
		ctx.stroke();
		ctx.strokeStyle = "#8884";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(0, h / 2);
		ctx.lineTo(w, h / 2);
		ctx.stroke();
	}, [data, color, width, height]);

	return (
		<div className="col-span-2 flex flex-col items-center">
			<span className="mb-1 text-3xs text-base-content/55 uppercase tracking-[0.24em]">
				{label}
			</span>
			<Card
				variant="subtle"
				padding="none"
				className="overflow-hidden shadow-lg"
			>
				<canvas
					ref={canvasRef}
					width={width}
					height={height}
					className="bg-base-300/30"
				/>
			</Card>
		</div>
	);
});

export const SynthSingleCycleDisplay = memo(function SynthSingleCycleDisplay({
	width = 120,
	height = 64,
	lineIndex = 1,
	color = "#7f9de4",
}: {
	width?: number;
	height?: number;
	lineIndex?: 1 | 2;
	color?: string;
}) {
	const synthController = useOptionalSynthController();
	const { value: warpAAmount } = useSynthParam("warpAAmount");
	const { value: warpBAmount } = useSynthParam("warpBAmount");
	const { value: warpAAlgo } = useSynthParam("warpAAlgo");
	const { value: warpBAlgo } = useSynthParam("warpBAlgo");
	const { value: algo2A } = useSynthParam("algo2A");
	const { value: algo2B } = useSynthParam("algo2B");
	const { value: algoBlendA } = useSynthParam("algoBlendA");
	const { value: algoBlendB } = useSynthParam("algoBlendB");
	const phaseModSlot = useSynthStore((s) => s.fxSlots[4]);
	const { value: windowType } = useSynthParam("windowType");
	const phaseModParams =
		phaseModSlot?.type === "phaseMod" ? phaseModSlot.params : null;
	const intPmAmount = phaseModParams?.amount ?? 0;
	const intPmRatio = phaseModParams?.ratio ?? 1;
	const pmPre = phaseModParams?.pmPre ?? true;
	const phaseModEnabled = phaseModParams?.enabled ?? false;
	const effectiveIntPmAmount = phaseModEnabled ? intPmAmount : 0;
	const { value: line1Level } = useSynthParam("line1Level");
	const { value: line2Level } = useSynthParam("line2Level");
	const { value: line1BaseWaveformA } = useSynthParam("line1BaseWaveformA");
	const { value: line1BaseWaveformB } = useSynthParam("line1BaseWaveformB");
	const { value: line2BaseWaveformA } = useSynthParam("line2BaseWaveformA");
	const { value: line2BaseWaveformB } = useSynthParam("line2BaseWaveformB");
	const { value: line1AlgoControlsA } = useSynthParam("line1AlgoControlsA");
	const { value: line1AlgoControlsB } = useSynthParam("line1AlgoControlsB");
	const { value: line2AlgoControlsA } = useSynthParam("line2AlgoControlsA");
	const { value: line2AlgoControlsB } = useSynthParam("line2AlgoControlsB");
	const [modulationTick, setModulationTick] = useState(0);

	const previewDestinations = useMemo(
		() =>
			[
				"line1DcwBase",
				"line1DcaBase",
				"line1AlgoBlend",
				"line1AlgoParam1",
				"line1AlgoParam2",
				"line1AlgoParam3",
				"line1AlgoParam4",
				"line1AlgoParam5",
				"line1AlgoParam6",
				"line1AlgoParam7",
				"line1AlgoParam8",
				"line2DcwBase",
				"line2DcaBase",
				"line2AlgoBlend",
				"line2AlgoParam1",
				"line2AlgoParam2",
				"line2AlgoParam3",
				"line2AlgoParam4",
				"line2AlgoParam5",
				"line2AlgoParam6",
				"line2AlgoParam7",
				"line2AlgoParam8",
				"intPmRatio",
			] as ModDestination[],
		[],
	);

	const hasLivePreviewRoutes = useMemo(
		() =>
			previewDestinations.some((destination) =>
				synthController?.hasActiveRoutes(destination),
			),
		[previewDestinations, synthController],
	);

	const liveSources = useMemo(() => {
		void modulationTick;
		return synthController?.getLiveSources() ?? null;
	}, [synthController, modulationTick]);

	useEffect(() => {
		if (!hasLivePreviewRoutes) {
			return;
		}

		const onRuntimeModSources = () => {
			setModulationTick((tick) => (tick + 1) % 1_000_000);
		};

		window.addEventListener("cz-runtime-mod-sources", onRuntimeModSources);
		return () => {
			window.removeEventListener("cz-runtime-mod-sources", onRuntimeModSources);
		};
	}, [hasLivePreviewRoutes]);

	const waveform = useMemo(() => {
		const getLiveValue = (
			destination: ModDestination | undefined,
			baseValue: number,
		) => {
			if (!synthController || !liveSources || !destination) {
				return baseValue;
			}
			return (
				synthController.getModulatedValue({ destination, baseValue }) ??
				baseValue
			);
		};

		const getLiveAlgoControls = (
			controls: AlgoControlValueV1[],
			linePrefix: "line1" | "line2",
		) =>
			controls.map((entry, index) => ({
				...entry,
				value: getLiveValue(
					`${linePrefix}AlgoParam${index + 1}` as ModDestination,
					entry.value ?? 0,
				),
			}));

		return computeWaveform({
			warpAAmount: getLiveValue("line1DcwBase", warpAAmount as number),
			warpBAmount: getLiveValue("line2DcwBase", warpBAmount as number),
			warpAAlgo: warpAAlgo as Algo,
			warpBAlgo: warpBAlgo as Algo,
			algo2A: algo2A as Algo | null,
			algo2B: algo2B as Algo | null,
			algoBlendA: getLiveValue("line1AlgoBlend", algoBlendA as number),
			algoBlendB: getLiveValue("line2AlgoBlend", algoBlendB as number),
			intPmAmount: effectiveIntPmAmount,
			intPmRatio: getLiveValue("intPmRatio", intPmRatio),
			extPmAmount: 0,
			pmPre,
			windowType: windowType as WindowType,
			line1Level: getLiveValue("line1DcaBase", line1Level as number),
			line2Level: getLiveValue("line2DcaBase", line2Level as number),
			line1BaseWaveformA: line1BaseWaveformA as BaseWaveform,
			line1BaseWaveformB: line1BaseWaveformB as BaseWaveform,
			line2BaseWaveformA: line2BaseWaveformA as BaseWaveform,
			line2BaseWaveformB: line2BaseWaveformB as BaseWaveform,
			line1AlgoControlsA: getLiveAlgoControls(
				line1AlgoControlsA as AlgoControlValueV1[],
				"line1",
			),
			line1AlgoControlsB: getLiveAlgoControls(
				line1AlgoControlsB as AlgoControlValueV1[],
				"line1",
			),
			line2AlgoControlsA: getLiveAlgoControls(
				line2AlgoControlsA as AlgoControlValueV1[],
				"line2",
			),
			line2AlgoControlsB: getLiveAlgoControls(
				line2AlgoControlsB as AlgoControlValueV1[],
				"line2",
			),
			sampleCount: 256,
		});
	}, [
		warpAAmount,
		warpBAmount,
		warpAAlgo,
		warpBAlgo,
		algo2A,
		algo2B,
		algoBlendA,
		algoBlendB,
		effectiveIntPmAmount,
		intPmRatio,
		pmPre,
		windowType,
		line1Level,
		line2Level,
		line1BaseWaveformA,
		line1BaseWaveformB,
		line2BaseWaveformA,
		line2BaseWaveformB,
		line1AlgoControlsA,
		line1AlgoControlsB,
		line2AlgoControlsA,
		line2AlgoControlsB,
		liveSources,
		synthController,
	]);

	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const dpr = window.devicePixelRatio || 1;
		const w = canvas.clientWidth || width;
		const h = height;
		canvas.width = Math.round(w * dpr);
		canvas.height = Math.round(h * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, w, h);

		// centre line
		ctx.strokeStyle = "#8884";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(0, h / 2);
		ctx.lineTo(w, h / 2);
		ctx.stroke();

		const drawLine = (data: Float32Array | number[], color: string) => {
			ctx.strokeStyle = color;
			ctx.lineWidth = 2;
			ctx.beginPath();
			for (let i = 0; i < data.length; i++) {
				const x = (i / (data.length - 1)) * w;
				const y = h / 2 - data[i] * (h / 2 - 4);
				if (i === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			}
			ctx.stroke();
		};

		drawLine(lineIndex === 1 ? waveform.out1 : waveform.out2, color);
	}, [waveform, width, height, lineIndex, color]);

	return (
		<canvas
			ref={canvasRef}
			className="w-full bg-base-300/30"
			style={{ height: `${height}px` }}
		/>
	);
});
