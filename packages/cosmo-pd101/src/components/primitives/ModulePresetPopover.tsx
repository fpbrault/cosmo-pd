import { useEffect, useRef } from "react";
import Button from "@/components/controls/Button";

type ModulePresetOption = {
	id: string;
	label: string;
};

type ModulePresetPopoverProps = {
	title: string;
	value: string;
	options: ModulePresetOption[];
	onChange: (value: string) => void;
	accentColor?: string;
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
}: ModulePresetPopoverProps) {
	const detailsRef = useRef<HTMLDetailsElement | null>(null);
	const borderColor = colorAlpha(accentColor ?? "", 0.65);
	const softBorderColor = colorAlpha(accentColor ?? "", 0.5);
	const activeBgColor = colorAlpha(accentColor ?? "", 0.34);
	const triggerBgColor = colorAlpha(accentColor ?? "", 0.3);

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

	return (
		<details
			ref={detailsRef}
			className="dropdown dropdown-end [&_summary::-webkit-details-marker]:hidden"
		>
			<summary
				className="flex h-5 min-w-20 cursor-pointer items-center justify-center gap-1.5 rounded-[4px] border border-cz-border bg-cz-inset px-2 text-[0.54rem] font-mono font-bold uppercase tracking-[0.14em] text-cz-cream-light shadow-[0_1px_0_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors hover:bg-cz-surface"
				style={{
					borderColor: softBorderColor,
					backgroundColor: triggerBgColor,
				}}
				aria-label={`${title} presets`}
			>
				<span
					className="inline-block h-1 w-1 rounded-full"
					style={{ backgroundColor: borderColor }}
				/>
				<span>presets</span>
				<span className="text-cz-cream-dim">▾</span>
			</summary>
			<ul
				className="menu dropdown-content z-[9999] mt-1.5 w-44 rounded-md border border-cz-border bg-cz-panel p-1 shadow-[0_10px_24px_rgba(0,0,0,0.5)]"
				style={{ borderColor: borderColor }}
			>
				{options.map((option) => {
					const active = option.id === value;
					return (
						<li key={option.id}>
							<Button
								type="button"
								className={`btn btn-ghost btn-sm justify-start w-full min-h-0 px-2 py-1 text-xs ${
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
								{option.label}
							</Button>
						</li>
					);
				})}
			</ul>
		</details>
	);
}
