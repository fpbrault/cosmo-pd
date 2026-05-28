import { useEffect, useRef, useState } from "react";
import { useAlgoUiText } from "@/lib/synth/i18nAlgo";
import {
	getPdAlgoBehaviorDescription,
	PD_ALGOS,
	type PdAlgo,
} from "@/lib/synth/pdAlgorithms";
import { HoverInfoTrigger } from "../../layout/HoverInfo";

function CzMonogramIcon({ size }: { size: number }) {
	return (
		<svg
			viewBox="0 0 24 24"
			width={size}
			height={size}
			stroke="currentColor"
			strokeWidth="1.5"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M10.8 7.8C8.6 7.8 7.2 9.3 7.2 12C7.2 14.7 8.6 16 10.8 16" />
			<path d="M13.8 8H18L13.8 16H18" />
		</svg>
	);
}

export default function AlgoIconGrid({
	value,
	onChange,
	size = 80,
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
	const previousLabel = useAlgoUiText("previousAlgorithm");
	const nextLabel = useAlgoUiText("nextAlgorithm");
	const behaviorPrefix = useAlgoUiText("behaviorTooltip");
	const changeAlgorithmLabel = useAlgoUiText("changeAlgorithm");

	const currentIndex = PD_ALGOS.findIndex((a) => a.value === value);
	const currentAlgo = PD_ALGOS[Math.max(0, currentIndex)];
	const isCz101 = currentAlgo.value === "cz101";

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

	const tooltipText = behaviorPrefix
		.replace("{{index}}", `${currentIndex + 1}`)
		.replace("{{behavior}}", getPdAlgoBehaviorDescription(value));

	return (
		<div
			ref={rootRef}
			className={[
				"relative w-fit bg-base-100",
				disabled ? "pointer-events-none opacity-30" : "",
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
							aria-label={changeAlgorithmLabel
								.replace("{{index}}", `${currentIndex + 1}`)
								.replace("{{label}}", currentAlgo.label)}
							className={[
								"flex items-center justify-center text-cz-gold transition-colors focus:outline-none",
								popoverOpen ? "bg-cz-inset" : "hover:bg-cz-inset",
							].join(" ")}
							style={{ width: size, height: size - 8 }}
						>
							{isCz101 ? (
								<CzMonogramIcon size={size} />
							) : (
								<svg
									viewBox="0 0 24 24"
									width={size}
									height={size}
									stroke="currentColor"
									strokeWidth=".75"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<title>{currentAlgo.label}</title>
									<path d={currentAlgo.icon} />
								</svg>
							)}
						</button>
					)}
				</HoverInfoTrigger>
				{/* Up / down arrows */}
				<div className="flex flex-col border-cz-border border-l">
					<button
						type="button"
						onClick={() => navigate(-1)}
						aria-label={previousLabel}
						className="flex flex-1 items-center justify-center border-cz-border border-b px-1.5 text-xs transition-colors hover:bg-cz-inset focus:outline-none"
						style={color ? { color } : undefined}
					>
						▲
					</button>
					<button
						type="button"
						onClick={() => navigate(1)}
						aria-label={nextLabel}
						className="flex flex-1 items-center justify-center px-1.5 text-xs transition-colors hover:bg-cz-inset focus:outline-none"
						style={color ? { color } : undefined}
					>
						▼
					</button>
				</div>
			</div>

			{/* Label */}
			<div
				className="mt-1 text-center font-mono text-xs uppercase tracking-widest"
				style={color ? { color } : undefined}
			>
				{currentAlgo.label}
			</div>

			{/* Popover grid */}
			<div
				className={[
					"absolute top-full left-1/2 z-20 mt-1 origin-top -translate-x-1/2 border border-cz-border bg-cz-surface p-1 transition-all duration-150 ease-out",
					popoverOpen
						? "pointer-events-auto scale-100 opacity-100"
						: "pointer-events-none scale-95 opacity-0",
				].join(" ")}
			>
				<div className="grid" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
					{PD_ALGOS.map((algo, index) => (
						<HoverInfoTrigger
							key={algo.key}
							message={behaviorPrefix
								.replace("{{index}}", `${index + 1}`)
								.replace(
									"{{behavior}}",
									getPdAlgoBehaviorDescription(algo.value),
								)}
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
											"flex flex-col items-center justify-center border p-1 text-cz-gold transition-colors focus:outline-none",
											algo.value === value
												? "border-cz-light-blue bg-cz-inset text-white"
												: "border-transparent hover:border-cz-light-blue hover:text-white",
										].join(" ")}
									>
										<span className="mb-0.5 text-4xs leading-none">
											{index + 1}
										</span>
										{algo.value === "cz101" ? (
											<CzMonogramIcon size={24} />
										) : (
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
										)}
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
