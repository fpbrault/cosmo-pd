import { memo, useEffect, useMemo, useRef } from "react";
import Card from "@/components/primitives/Card";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { useSynthStore } from "@/features/synth/synthStore";
import { computeWaveform } from "@/lib/synth/pdAlgorithms";

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
		ctx.clearRect(0, 0, width, height);
		ctx.strokeStyle = color;
		ctx.lineWidth = 2;
		ctx.beginPath();
		for (let i = 0; i < data.length; i++) {
			const x = (i / (data.length - 1)) * width;
			const y = height / 2 - data[i] * (height / 2 - 4);
			if (i === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		}
		ctx.stroke();
		ctx.strokeStyle = "#8884";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(0, height / 2);
		ctx.lineTo(width, height / 2);
		ctx.stroke();
	}, [data, color, width, height]);

	return (
		<div className="flex flex-col items-center col-span-2">
			<span className="mb-1 text-3xs uppercase tracking-[0.24em] text-base-content/55">
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
}: {
	width?: number;
	height?: number;
}) {
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

	const waveform = useMemo(
		() =>
			computeWaveform({
				warpAAmount,
				warpBAmount,
				warpAAlgo,
				warpBAlgo,
				algo2A,
				algo2B,
				algoBlendA,
				algoBlendB,
				intPmAmount: effectiveIntPmAmount,
				intPmRatio,
				extPmAmount: 0,
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
			}),
		[
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
		],
	);

	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const w = canvas.clientWidth || width;
		const h = height;
		canvas.width = w;
		canvas.height = h;
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

		drawLine(waveform.out1, "#ec4899");
		drawLine(waveform.out2, "#2563eb");
	}, [waveform, width, height]);

	return (
		<canvas
			ref={canvasRef}
			className="w-full bg-base-300/30"
			style={{ height: `${height}px` }}
		/>
	);
});
