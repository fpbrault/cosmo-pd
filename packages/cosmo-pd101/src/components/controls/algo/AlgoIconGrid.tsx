import { useEffect, useRef, useState } from "react";
import {
	getPdAlgoBehaviorDescription,
	PD_ALGOS,
	type PdAlgo,
} from "@/lib/synth/pdAlgorithms";
import { HoverInfoTrigger } from "../../layout/HoverInfo";

export default function AlgoIconGrid({
	value,
	onChange,
	size = 68,
	disabled = false,
	color,
}: {
	value: PdAlgo;
	onChange: (v: PdAlgo) => void;
	size?: number;
	disabled?: boolean;
	rows?: number;
	columns?: number;
	color?: string;
}) {
	const [popoverOpen, setPopoverOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement | null>(null);

	const currentIndex = PD_ALGOS.findIndex((a) => a.value === value);
	const currentAlgo = PD_ALGOS[Math.max(0, currentIndex)];
	const iconSize = size - 12;

	const navigate = (dir: 1 | -1) => {
		if (disabled) return;
		const newIndex = (currentIndex + dir + PD_ALGOS.length) % PD_ALGOS.length;
		onChange(PD_ALGOS[newIndex].value);
	};

	useEffect(() => {
		if (!popoverOpen) return;
		const handlePointerDown = (e: PointerEvent) => {
			if (rootRef.current?.contains(e.target as Node)) return;
			setPopoverOpen(false);
		};
		document.addEventListener("pointerdown", handlePointerDown);
		return () => document.removeEventListener("pointerdown", handlePointerDown);
	}, [popoverOpen]);

	const tooltipText = `Algorithm ${currentIndex + 1}: ${getPdAlgoBehaviorDescription(value)}`;

	return (
		<div
			ref={rootRef}
			className={[
				"relative w-fit",
				disabled ? "opacity-30 pointer-events-none" : "",
			].join(" ")}
		>
			{/* Main widget: icon + arrows */}
			<div className="flex items-stretch border border-cz-border bg-cz-surface">
				{/* Clickable icon — opens popover */}
				<HoverInfoTrigger message={tooltipText}>
					{(hoverHandlers) => (
						<button
							type="button"
							{...hoverHandlers}
							onClick={() => setPopoverOpen((o) => !o)}
							aria-label={`Algorithm ${currentIndex + 1}: ${currentAlgo.label}. Click to change.`}
							className={[
								"flex items-center justify-center text-cz-gold transition-colors focus:outline-none",
								popoverOpen ? "bg-cz-inset" : "hover:bg-cz-inset",
							].join(" ")}
							style={{ width: size + 8, height: size }}
						>
							<svg
								viewBox="0 0 24 24"
								width={iconSize}
								height={iconSize}
								stroke="currentColor"
								strokeWidth="1.5"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<title>{currentAlgo.label}</title>
								<path d={currentAlgo.icon} />
							</svg>
						</button>
					)}
				</HoverInfoTrigger>
				{/* Up / down arrows */}
				<div className="flex flex-col border-l border-cz-border">
					<button
						type="button"
						onClick={() => navigate(-1)}
						aria-label="Previous algorithm"
						className="flex flex-1 items-center justify-center px-1.5 transition-colors hover:bg-cz-inset focus:outline-none border-b border-cz-border text-xs"
						style={color ? { color } : undefined}
					>
						▲
					</button>
					<button
						type="button"
						onClick={() => navigate(1)}
						aria-label="Next algorithm"
						className="flex flex-1 items-center justify-center px-1.5 transition-colors hover:bg-cz-inset focus:outline-none text-xs"
						style={color ? { color } : undefined}
					>
						▼
					</button>
				</div>
			</div>

			{/* Label */}
			<div
				className="mt-1 text-center font-mono text-xs tracking-widest uppercase"
				style={color ? { color } : undefined}
			>
				{currentAlgo.label}
			</div>

			{/* Popover grid */}
			<div
				className={[
					"absolute left-1/2 -translate-x-1/2 top-full z-20 mt-1 bg-cz-surface border border-cz-border p-1 origin-top transition-all duration-150 ease-out",
					popoverOpen
						? "opacity-100 scale-100 pointer-events-auto"
						: "opacity-0 scale-95 pointer-events-none",
				].join(" ")}
			>
				<div className="grid" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
					{PD_ALGOS.map((algo, index) => (
						<HoverInfoTrigger
							key={algo.key}
							message={`Algorithm ${index + 1}: ${getPdAlgoBehaviorDescription(algo.value)}`}
						>
							{(hoverHandlers) => (
								<div className="tooltip tooltip-top" data-tip={algo.label}>
									<button
										type="button"
										{...hoverHandlers}
										disabled={disabled}
										onClick={() => {
											if (disabled) return;
											onChange(algo.value);
											setPopoverOpen(false);
										}}
										aria-label={algo.label}
										className={[
											"flex flex-col items-center justify-center p-1 border transition-colors focus:outline-none text-cz-gold",
											algo.value === value
												? "border-cz-light-blue bg-cz-inset text-white"
												: "border-transparent hover:border-cz-light-blue hover:text-white",
										].join(" ")}
									>
										<span className="text-4xs leading-none mb-0.5">
											{index + 1}
										</span>
										<svg
											viewBox="0 0 24 24"
											width={24}
											height={24}
											stroke="currentColor"
											strokeWidth="1.5"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
											aria-hidden="true"
										>
											<title>{algo.label}</title>
											<path d={algo.icon} />
										</svg>
									</button>
								</div>
							)}
						</HoverInfoTrigger>
					))}
				</div>
			</div>
		</div>
	);
}
