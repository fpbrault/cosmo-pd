import { useEffect, useRef, useState } from "react";
import {
	getPdAlgoBehaviorDescription,
	PD_ALGOS,
} from "@/lib/synth/algoUiCatalog";
import { useAlgoUiText } from "@/lib/synth/i18nAlgo";
import type { PdAlgo } from "@/lib/synth/pdAlgorithms";
import { HoverInfoTrigger, useHoverInfoHandlers } from "../../layout/HoverInfo";

function CzMonogramIcon({
	size,
	className,
}: {
	size?: number;
	className?: string;
}) {
	return (
		<svg
			viewBox="0 0 24 24"
			width={size}
			height={size}
			className={className}
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
	const previousHoverHandlers = useHoverInfoHandlers(
		"Select the previous phase-distortion algorithm.",
	);
	const nextHoverHandlers = useHoverInfoHandlers(
		"Select the next phase-distortion algorithm.",
	);
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

	const algoButtonLabel = changeAlgorithmLabel
		.replace("{{index}}", `${currentIndex + 1}`)
		.replace("{{label}}", currentAlgo.label);

	return (
		<div
			ref={rootRef}
			className={[
				"relative w-30 bg-base-100",
				disabled ? "pointer-events-none opacity-30" : "",
			].join(" ")}
		>
			<div
				className={[
					"grid items-stretch border border-cz-border bg-cz-surface",
					"@max-[780px]:grid-cols-[auto_1fr_auto] @max-[780px]:grid-rows-[auto] @max-[780px]:[grid-template-areas:'prev_label_next']",
					"[@container_phase_(max-height:500px)]:grid-cols-[auto_1fr_auto] [@container_phase_(max-height:500px)]:grid-rows-[auto] [@container_phase_(max-height:500px)]:[grid-template-areas:'prev_label_next']",
					"grid-cols-[auto_auto] grid-rows-[1fr_1fr_auto] [grid-template-areas:'icon_up''icon_down''label_label']",
				].join(" ")}
			>
				<div className="flex @max-[780px]:hidden items-center justify-center [grid-area:icon] [@container_phase_(max-height:500px)]:hidden">
					<HoverInfoTrigger message={tooltipText}>
						{(hoverHandlers) => (
							<button
								type="button"
								{...hoverHandlers}
								onClick={() => setPopoverOpen((o) => !o)}
								aria-label={algoButtonLabel}
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
				</div>

				<button
					type="button"
					onClick={() => navigate(-1)}
					aria-label={previousLabel}
					data-hover-info="Select the previous phase-distortion algorithm."
					{...previousHoverHandlers}
					className={[
						"@max-[780px]:border-r @max-[780px]:px-1.5 @max-[780px]:[grid-area:prev]",
						"[@container_phase_(max-height:500px)]:border-r [@container_phase_(max-height:500px)]:px-1.5 [@container_phase_(max-height:500px)]:[grid-area:prev]",
						"border-cz-border border-b [grid-area:up]",
						"flex items-center justify-center text-xs transition-colors hover:bg-cz-inset focus:outline-none",
					].join(" ")}
					style={color ? { color } : undefined}
				>
					<span className="@max-[780px]:hidden [@container_phase_(max-height:500px)]:hidden">
						▲
					</span>
					<span
						className="@max-[780px]:inline hidden [@container_phase_(max-height:500px)]:inline"
						style={{ transform: "rotate(180deg)" }}
					>
						▼
					</span>
				</button>

				<button
					type="button"
					onClick={() => navigate(1)}
					aria-label={nextLabel}
					data-hover-info="Select the next phase-distortion algorithm."
					{...nextHoverHandlers}
					className={[
						"@max-[780px]:px-1.5 @max-[780px]:[grid-area:next]",
						"[@container_phase_(max-height:500px)]:px-1.5 [@container_phase_(max-height:500px)]:[grid-area:next]",
						"[grid-area:down]",
						"flex items-center justify-center text-xs transition-colors hover:bg-cz-inset focus:outline-none",
					].join(" ")}
					style={color ? { color } : undefined}
				>
					<span className="@max-[780px]:hidden [@container_phase_(max-height:500px)]:hidden">
						▼
					</span>
					<span
						className="@max-[780px]:inline hidden [@container_phase_(max-height:500px)]:inline"
						style={{ transform: "rotate(180deg)" }}
					>
						▲
					</span>
				</button>

				<HoverInfoTrigger message={tooltipText}>
					{(hoverHandlers) => (
						<button
							type="button"
							{...hoverHandlers}
							onClick={() => setPopoverOpen((o) => !o)}
							aria-label={algoButtonLabel}
							className={[
								"[grid-area:label]",
								"flex items-center justify-center bg-base-100 px-1 py-1 font-mono text-xs uppercase tracking-widest transition-colors focus:outline-none",
								popoverOpen ? "bg-cz-inset" : "hover:bg-cz-inset",
							].join(" ")}
							style={color ? { color } : undefined}
						>
							{currentAlgo.label}
						</button>
					)}
				</HoverInfoTrigger>
			</div>

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
