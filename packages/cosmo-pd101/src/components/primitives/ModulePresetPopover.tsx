import { useEffect, useRef } from "react";
import Button from "@/components/controls/Button";

type ModulePresetOption = {
	id: string;
	label?: string;
};

type ModulePresetPopoverProps = {
	title: string;
	value: string;
	options: ModulePresetOption[];
	onChange: (value: string) => void;
	accentColor?: string;
	disabled?: boolean;
};

function hexToRgb(hex: string) {
	const normalized = hex.trim();
	if (!/^#[\da-fA-F]{6}$/.test(normalized)) {
		return null;
	}

	return {
		r: Number.parseInt(normalized.slice(1, 3), 16),
		g: Number.parseInt(normalized.slice(3, 5), 16),
		b: Number.parseInt(normalized.slice(5, 7), 16),
	};
}

function colorAlpha(hex: string, alpha: number) {
	const rgb = hexToRgb(hex);
	if (!rgb) {
		return undefined;
	}

	return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export default function ModulePresetPopover({
	title,
	value,
	options,
	onChange,
	accentColor,
	disabled = false,
}: ModulePresetPopoverProps) {
	const detailsRef = useRef<HTMLDetailsElement | null>(null);
	const borderColor = colorAlpha(accentColor ?? "", 0.65);
	const activeBgColor = colorAlpha(accentColor ?? "", 0.34);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				detailsRef.current &&
				!detailsRef.current.contains(e.target as Node)
			) {
				detailsRef.current.open = false;
			}
		};

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && detailsRef.current?.open) {
				detailsRef.current.open = false;
			}
		};

		document.addEventListener("click", handleClickOutside, true);
		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("click", handleClickOutside, true);
			document.removeEventListener("keydown", handleEscape);
		};
	}, []);

	if (disabled) {
		return (
			<Button
				type="button"
				disabled
				className="btn btn-xs flex h-5 min-h-0 min-w-20 cursor-not-allowed flex-nowrap items-center gap-1.5 rounded-sm border border-cz-border/65 px-2 font-bold font-mono text-[0.54rem] text-cz-cream/40 uppercase tracking-[0.14em] opacity-70"
				aria-label={`${title} presets unavailable`}
			>
				<span className="inline-block h-1 w-1 shrink-0 rounded-full bg-cz-cream/25" />
				<span>presets</span>
				<span className="text-cz-cream/30">▾</span>
			</Button>
		);
	}

	return (
		<details
			ref={detailsRef}
			className="dropdown dropdown-top dropdown-end [&_summary::-webkit-details-marker]:hidden"
		>
			<summary
				className="btn btn-xs flex h-5 min-h-0 min-w-20 flex-nowrap items-center gap-1.5 rounded-sm border px-2 font-bold font-mono text-[0.54rem] text-cz-cream-light uppercase tracking-[0.14em] shadow-[0_1px_0_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.08)] hover:brightness-125"
				aria-label={`${title} presets`}
			>
				<span
					className="inline-block h-1 w-1 shrink-0 rounded-full"
					style={{ backgroundColor: borderColor }}
				/>
				<span>presets</span>
				<span className="text-cz-cream-dim">▾</span>
			</summary>
			<ul
				className="menu dropdown-content z-9999 mb-1.5 w-44 rounded-md border border-cz-border bg-cz-panel p-1 shadow-[0_10px_24px_rgba(0,0,0,0.5)]"
				style={{ borderColor: borderColor }}
			>
				{options.map((option) => {
					const active = option.id === value;
					return (
						<li key={option.id}>
							<Button
								type="button"
								className={`btn btn-ghost btn-sm min-h-0 w-full justify-start px-2 py-1 text-xs ${
									active
										? "text-cz-cream-light"
										: "text-cz-cream hover:bg-cz-surface"
								}`}
								style={active ? { backgroundColor: activeBgColor } : undefined}
								onClick={() => {
									onChange(option.id);
									if (detailsRef.current) {
										detailsRef.current.open = false;
									}
								}}
							>
								{option.label ?? option.id}
							</Button>
						</li>
					);
				})}
			</ul>
		</details>
	);
}
