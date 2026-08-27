import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	HoverInfoTrigger,
	useHoverInfoHandlers,
} from "@/components/layout/HoverInfo";
import Popover from "@/components/primitives/Popover";
import {
	getPdAlgoBehaviorDescription,
	PD_ALGOS,
} from "@/lib/synth/algoUiCatalog";
import { useAlgoUiText } from "@/lib/synth/i18nAlgo";
import type { PdAlgo } from "@/lib/synth/pdAlgorithms";
import AlgorithmMark from "./AlgorithmMark";

type AlgoIconGridProps = {
	value: PdAlgo | null;
	onChange: (value: PdAlgo | null) => void;
	size?: number;
	disabled?: boolean;
	color?: string;
	variant?: "standard" | "compact";
	allowNone?: boolean;
	ariaLabel?: string;
	popoverAriaLabel?: string;
	onOpen?: () => void;
	className?: string;
};

export default function AlgoIconGrid({
	value,
	onChange,
	size = 80,
	disabled = false,
	color,
	variant = "standard",
	allowNone = false,
	ariaLabel,
	popoverAriaLabel,
	onOpen,
	className,
}: AlgoIconGridProps) {
	const { t } = useTranslation("synth");
	const [popoverOpen, setPopoverOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement | null>(null);
	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const previousLabel = useAlgoUiText("previousAlgorithm");
	const nextLabel = useAlgoUiText("nextAlgorithm");
	const previousTooltip = t("tooltips.algorithm.previous");
	const nextTooltip = t("tooltips.algorithm.next");
	const previousHoverHandlers = useHoverInfoHandlers(previousTooltip);
	const nextHoverHandlers = useHoverInfoHandlers(nextTooltip);
	const behaviorPrefix = useAlgoUiText("behaviorTooltip");
	const changeAlgorithmLabel = useAlgoUiText("changeAlgorithm");
	const options: Array<PdAlgo | null> = [
		...PD_ALGOS.map((algorithm) => algorithm.value),
		...(allowNone ? [null] : []),
	];
	const currentIndex = options.indexOf(value);
	const normalizedIndex = currentIndex >= 0 ? currentIndex : 0;
	const currentAlgo =
		value === null
			? null
			: (PD_ALGOS.find((algorithm) => algorithm.value === value) ??
				PD_ALGOS[0]);
	const currentLabel = currentAlgo?.label ?? "None";

	const navigate = (direction: 1 | -1) => {
		if (disabled) return;
		const nextIndex =
			(normalizedIndex + direction + options.length) % options.length;
		onChange(options[nextIndex]);
	};

	const togglePopover = () => {
		if (disabled) return;
		onOpen?.();
		setPopoverOpen((open) => !open);
	};

	useEffect(() => {
		if (variant === "compact" || !popoverOpen) return;
		const handlePointerDown = (event: PointerEvent) => {
			if (rootRef.current?.contains(event.target as Node)) return;
			setPopoverOpen(false);
		};
		document.addEventListener("pointerdown", handlePointerDown);
		return () => document.removeEventListener("pointerdown", handlePointerDown);
	}, [popoverOpen, variant]);

	const tooltipText = currentAlgo
		? behaviorPrefix
				.replace("{{index}}", `${normalizedIndex + 1}`)
				.replace(
					"{{behavior}}",
					getPdAlgoBehaviorDescription(currentAlgo.value),
				)
		: "No algorithm selected";
	const algoButtonLabel =
		ariaLabel ??
		(currentAlgo
			? changeAlgorithmLabel
					.replace("{{index}}", `${normalizedIndex + 1}`)
					.replace("{{label}}", currentAlgo.label)
			: "Select algorithm");

	const picker = (
		<div
			data-testid="algorithm-picker-grid"
			className="grid w-max grid-cols-5 p-1"
		>
			{PD_ALGOS.map((algorithm, index) => {
				const optionTooltip = behaviorPrefix
					.replace("{{index}}", `${index + 1}`)
					.replace(
						"{{behavior}}",
						getPdAlgoBehaviorDescription(algorithm.value),
					);
				return (
					<HoverInfoTrigger key={algorithm.key} message={optionTooltip}>
						{(hoverHandlers) => (
							<button
								type="button"
								disabled={disabled}
								aria-label={algorithm.label}
								aria-pressed={algorithm.value === value}
								data-hover-info={optionTooltip}
								{...hoverHandlers}
								onClick={() => {
									onChange(algorithm.value);
									setPopoverOpen(false);
								}}
								className="flex size-16 flex-col items-center justify-center border border-cz-border bg-cz-surface font-mono text-[0.45rem] text-cz-gold uppercase hover:border-cz-light-blue hover:text-white aria-pressed:border-cz-light-blue aria-pressed:bg-cz-inset aria-pressed:text-white"
							>
								<AlgorithmMark value={algorithm.value} size="popover" />
								<span className="max-w-14 truncate">{algorithm.label}</span>
							</button>
						)}
					</HoverInfoTrigger>
				);
			})}
			{allowNone ? (
				<HoverInfoTrigger message="None: Disable this algorithm slot.">
					{(hoverHandlers) => (
						<button
							type="button"
							disabled={disabled}
							aria-label="None"
							aria-pressed={value === null}
							data-hover-info="None: Disable this algorithm slot."
							{...hoverHandlers}
							onClick={() => {
								onChange(null);
								setPopoverOpen(false);
							}}
							className="flex size-16 flex-col items-center justify-center border border-cz-border bg-cz-surface font-mono text-[0.45rem] text-cz-gold uppercase hover:border-cz-light-blue hover:text-white aria-pressed:border-cz-light-blue aria-pressed:bg-cz-inset aria-pressed:text-white"
						>
							<span className="text-2xl">—</span>
							<span>None</span>
						</button>
					)}
				</HoverInfoTrigger>
			) : null}
		</div>
	);

	if (variant === "compact") {
		return (
			<>
				<div
					className={`grid shrink-0 grid-cols-[1fr_1.25rem] grid-rows-[1.1rem_1fr_1fr_1.35rem] overflow-hidden border border-cz-border bg-cz-surface [grid-template-areas:'spacer_spacer''icon_up''icon_down''label_label'] focus-within:ring-1 focus-within:ring-cz-light-blue ${disabled ? "opacity-35" : ""} ${className ?? "w-[4.25rem]"}`}
				>
					<span
						aria-hidden="true"
						className="border-cz-border border-b bg-cz-inset [grid-area:spacer]"
					/>
					<button
						ref={triggerRef}
						type="button"
						disabled={disabled}
						aria-label={algoButtonLabel}
						aria-haspopup="dialog"
						aria-expanded={popoverOpen}
						onClick={togglePopover}
						className="flex items-center justify-center text-cz-gold transition-colors [grid-area:icon] hover:bg-cz-inset focus:outline-none"
					>
						{currentAlgo ? (
							<AlgorithmMark value={currentAlgo.value} size="compact" />
						) : (
							<span className="font-mono text-2xl">—</span>
						)}
					</button>
					<button
						type="button"
						disabled={disabled}
						aria-label={previousLabel}
						onClick={() => navigate(-1)}
						className="flex items-center justify-center border-cz-border border-b text-[0.55rem] transition-colors [grid-area:up] hover:bg-cz-inset focus:outline-none disabled:cursor-not-allowed"
						style={color ? { color } : undefined}
					>
						▲
					</button>
					<button
						type="button"
						disabled={disabled}
						aria-label={nextLabel}
						onClick={() => navigate(1)}
						className="flex items-center justify-center text-[0.55rem] transition-colors [grid-area:down] hover:bg-cz-inset focus:outline-none disabled:cursor-not-allowed"
						style={color ? { color } : undefined}
					>
						▼
					</button>
					<button
						type="button"
						disabled={disabled}
						aria-label={`${ariaLabel ?? "Algorithm"} name: ${currentLabel}`}
						aria-haspopup="dialog"
						aria-expanded={popoverOpen}
						onClick={togglePopover}
						className="flex min-w-0 items-center justify-center border-cz-border border-t bg-cz-inset px-1 font-mono text-[0.52rem] uppercase tracking-[0.1em] transition-colors [grid-area:label] hover:bg-cz-inset focus:outline-none"
						style={color ? { color } : undefined}
					>
						<span className="max-w-full truncate">{currentLabel}</span>
					</button>
				</div>
				<Popover
					open={popoverOpen}
					onClose={() => setPopoverOpen(false)}
					triggerRef={triggerRef}
					ariaLabel={popoverAriaLabel ?? ariaLabel ?? "Select algorithm"}
					placement="top"
				>
					{picker}
				</Popover>
			</>
		);
	}

	return (
		<div
			ref={rootRef}
			className={`relative w-30 bg-base-100 ${disabled ? "pointer-events-none opacity-30" : ""}`}
		>
			<div className="grid @max-[780px]:grid-cols-[auto_1fr_auto] grid-cols-[auto_auto] @max-[780px]:grid-rows-[auto] grid-rows-[1fr_1fr_auto] items-stretch border border-cz-border bg-cz-surface @max-[780px]:[grid-template-areas:'prev_label_next'] [grid-template-areas:'icon_up''icon_down''label_label'] [@container_phase_(max-height:500px)]:grid-cols-[auto_1fr_auto] [@container_phase_(max-height:500px)]:grid-rows-[auto] [@container_phase_(max-height:500px)]:[grid-template-areas:'prev_label_next']">
				<div className="flex @max-[780px]:hidden items-center justify-center [grid-area:icon] [@container_phase_(max-height:500px)]:hidden">
					<HoverInfoTrigger message={tooltipText}>
						{(hoverHandlers) => (
							<button
								type="button"
								{...hoverHandlers}
								onClick={togglePopover}
								aria-label={algoButtonLabel}
								className="flex items-center justify-center text-cz-gold transition-colors hover:bg-cz-inset focus:outline-none"
								style={{ width: size, height: size - 8 }}
							>
								{currentAlgo ? (
									<AlgorithmMark value={currentAlgo.value} />
								) : (
									<span className="font-mono text-2xl">—</span>
								)}
							</button>
						)}
					</HoverInfoTrigger>
				</div>
				<button
					type="button"
					disabled={disabled}
					onClick={() => navigate(-1)}
					aria-label={previousLabel}
					title={previousTooltip}
					data-hover-info={previousTooltip}
					{...previousHoverHandlers}
					className="flex items-center justify-center border-cz-border @max-[780px]:border-r border-b @max-[780px]:px-1.5 text-xs transition-colors @max-[780px]:[grid-area:prev] [grid-area:up] hover:bg-cz-inset focus:outline-none [@container_phase_(max-height:500px)]:border-r [@container_phase_(max-height:500px)]:px-1.5 [@container_phase_(max-height:500px)]:[grid-area:prev]"
					style={color ? { color } : undefined}
				>
					▲
				</button>
				<button
					type="button"
					disabled={disabled}
					onClick={() => navigate(1)}
					aria-label={nextLabel}
					title={nextTooltip}
					data-hover-info={nextTooltip}
					{...nextHoverHandlers}
					className="flex items-center justify-center @max-[780px]:px-1.5 text-xs transition-colors @max-[780px]:[grid-area:next] [grid-area:down] hover:bg-cz-inset focus:outline-none [@container_phase_(max-height:500px)]:px-1.5 [@container_phase_(max-height:500px)]:[grid-area:next]"
					style={color ? { color } : undefined}
				>
					▼
				</button>
				<HoverInfoTrigger message={tooltipText}>
					{(hoverHandlers) => (
						<button
							type="button"
							{...hoverHandlers}
							onClick={togglePopover}
							aria-label={algoButtonLabel}
							className="flex items-center justify-center bg-cz-inset px-1 py-1 font-mono text-xs uppercase tracking-widest transition-colors [grid-area:label] hover:bg-cz-inset focus:outline-none"
							style={color ? { color } : undefined}
						>
							{currentLabel}
						</button>
					)}
				</HoverInfoTrigger>
			</div>
			<div
				className={`absolute top-full left-1/2 z-20 mt-1 origin-top -translate-x-1/2 border border-cz-border bg-cz-surface p-1 transition-all duration-150 ease-out ${popoverOpen ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
			>
				{picker}
			</div>
		</div>
	);
}
