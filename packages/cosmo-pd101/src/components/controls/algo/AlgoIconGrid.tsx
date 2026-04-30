import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/controls/Button";
import {
	getPdAlgoBehaviorDescription,
	PD_ALGOS,
	type PdAlgo,
} from "@/lib/synth/pdAlgorithms";
import { HoverInfoTrigger } from "../../layout/HoverInfo";

export default function AlgoIconGrid({
	value,
	onChange,
	size = 40,
	disabled = false,
	rows = 2,
	columns = 5,
}: {
	value: PdAlgo;
	onChange: (v: PdAlgo) => void;
	size?: number;
	disabled?: boolean;
	rows?: number;
	columns?: number;
}) {
	const [overlayOpen, setOverlayOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement | null>(null);
	const cellWidth = size + 10;
	const iconSize = Math.max(16, size - 12);
	const safeRows = Math.max(1, Math.floor(rows));
	const safeColumns = Math.max(1, Math.floor(columns));
	const gridStyle = useMemo(
		() => ({ gridTemplateColumns: `repeat(${safeColumns}, ${cellWidth}px)` }),
		[cellWidth, safeColumns],
	);
	const totalVisibleSlots = Math.max(2, safeRows * safeColumns);
	const visibleAlgoCount =
		PD_ALGOS.length > totalVisibleSlots
			? totalVisibleSlots - 1
			: totalVisibleSlots;
	const overflowAlgos = useMemo(
		() => PD_ALGOS.slice(visibleAlgoCount),
		[visibleAlgoCount],
	);
	const hasOverflow = overflowAlgos.length > 0;
	const selectedOverflowAlgo = useMemo(
		() =>
			overflowAlgos.find((algo) => algo.value === value) ?? null,
		[overflowAlgos, value],
	);
	const displayedAlgos = useMemo(() => {
		const base = PD_ALGOS.slice(0, visibleAlgoCount);
		if (selectedOverflowAlgo && base.length > 0) {
			base[base.length - 1] = selectedOverflowAlgo;
		}
		return base;
	}, [selectedOverflowAlgo, visibleAlgoCount]);

	useEffect(() => {
		if (!overlayOpen) {
			return;
		}

		const handlePointerDown = (event: PointerEvent) => {
			if (!rootRef.current) {
				return;
			}
			if (rootRef.current.contains(event.target as Node)) {
				return;
			}
			setOverlayOpen(false);
		};

		document.addEventListener("pointerdown", handlePointerDown);
		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
		};
	}, [overlayOpen]);

	const renderAlgoButton = (
		algo: (typeof PD_ALGOS)[number],
		index: number,
		closeOverlayOnSelect = false,
	) => {
		const tooltipText = `Algorithm ${algo.label}: ${getPdAlgoBehaviorDescription(algo.value)}`;

		return (
			<HoverInfoTrigger key={algo.key} message={tooltipText}>
				{(hoverHandlers) => (
					<div
						className="tooltip tooltip-top"
						data-tip={algo.label}
						style={{ width: cellWidth }}
					>
						<Button
							type="button"
							title={algo.label}
							aria-label={algo.label}
							data-hover-info={tooltipText}
							{...hoverHandlers}
							onClick={() => {
								if (disabled) {
									return;
								}
								onChange(algo.value);
								if (closeOverlayOnSelect) {
									setOverlayOpen(false);
								}
							}}
							disabled={disabled}
							className={[
								"flex flex-col items-center justify-center transition-colors focus:outline-none border-t-0 border-b border-l border-r text-cz-gold border-cz-light-blue",
								value === algo.value
									? "border-cz-light-blue bg-cz-inset text-white shadow-sm"
									: "border-cz-border bg-cz-surface  hover:border-cz-light-blue hover:text-white",
							].join(" ")}
							style={{ height: size, width: cellWidth }}
						>
							<div className="text-4xs">{index + 1}</div>
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
								<title>{algo.label}</title>
								<path d={algo.icon} />
							</svg>
						</Button>
					</div>
				)}
			</HoverInfoTrigger>
		);
	};

	return (
		<div
			ref={rootRef}
			className={[
				"relative w-full max-w-fit mx-auto",
				disabled ? "opacity-30" : "",
			].join(" ")}
			style={{ pointerEvents: disabled ? "none" : undefined }}
		>
			<div
				className="grid w-full max-w-fit justify-center transition-opacity"
				style={gridStyle}
			>
				{displayedAlgos.map((algo) => {
					const algoIndex = PD_ALGOS.findIndex(
						(entry) => entry.value === algo.value,
					);
					return renderAlgoButton(algo, Math.max(0, algoIndex));
				})}
				{hasOverflow ? (
					<div
						className="tooltip tooltip-top"
						data-tip="All algorithms"
						style={{ width: cellWidth }}
					>
						<Button
							type="button"
							title={
								overlayOpen ? "Hide extra algorithms" : "Show extra algorithms"
							}
							aria-label={
								overlayOpen ? "Hide extra algorithms" : "Show extra algorithms"
							}
							onClick={() => setOverlayOpen((current) => !current)}
							className={[
								"flex flex-col items-center justify-center transition-colors focus:outline-none border-t-0 border-b border-l border-r text-cz-gold border-cz-light-blue",
								overlayOpen
									? "border-cz-light-blue bg-cz-inset text-white shadow-sm"
									: "border-cz-border bg-cz-surface hover:border-cz-light-blue hover:text-white",
							].join(" ")}
							style={{ height: size, width: cellWidth }}
						>
							<div className="text-xs font-bold">+{overflowAlgos.length}</div>
						</Button>
					</div>
				) : null}
			</div>

			{hasOverflow ? (
				<div
					className={[
						"absolute left-0 top-full z-20  origin-top transition-all duration-150 ease-out",
						overlayOpen
							? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
							: "opacity-0 -translate-y-1 scale-[0.98] pointer-events-none",
					].join(" ")}
				>
					<div
						className="grid w-full max-w-fit justify-center"
						style={gridStyle}
					>
						{overflowAlgos.map((algo, index) =>
							renderAlgoButton(algo, visibleAlgoCount + index, true),
						)}
					</div>
				</div>
			) : null}
		</div>
	);
}
