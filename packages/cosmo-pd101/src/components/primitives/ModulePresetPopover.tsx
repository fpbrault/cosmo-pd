import { useRef } from "react";

type ModulePresetOption = {
	id: string;
	label: string;
};

type ModulePresetPopoverProps = {
	title: string;
	value: string;
	options: ModulePresetOption[];
	onChange: (value: string) => void;
};

export default function ModulePresetPopover({
	title,
	value,
	options,
	onChange,
}: ModulePresetPopoverProps) {
	const detailsRef = useRef<HTMLDetailsElement | null>(null);

	return (
		<details
			ref={detailsRef}
			className="dropdown dropdown-end [&_summary::-webkit-details-marker]:hidden"
		>
			<summary
				className="flex h-5 cursor-pointer items-center gap-1.5 rounded-full border border-cyan-400/35 bg-cyan-950/35 px-2 text-[0.52rem] font-mono uppercase tracking-[0.14em] text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-900/55"
				aria-label={`${title} presets`}
			>
				<span>presets</span>
				<span className="text-cyan-300/80">&lt;&gt;</span>
			</summary>
			<ul className="menu dropdown-content z-[90] mt-1.5 w-44 rounded-sm border border-cyan-300/30 bg-[#11141d] p-1 shadow-[0_10px_24px_rgba(0,0,0,0.45)]">
				<li className="menu-title px-2 py-1 text-[0.58rem] font-mono uppercase tracking-[0.14em] text-cyan-200/70">
					{title}
				</li>
				{options.map((option) => {
					const active = option.id === value;
					return (
						<li key={option.id}>
							<button
								type="button"
								className={`min-h-0 rounded px-2 py-1 text-left text-xs ${
									active ? "bg-cyan-500/25 text-cyan-100" : "text-zinc-100"
								}`}
								onClick={() => {
									onChange(option.id);
									if (detailsRef.current) {
										detailsRef.current.open = false;
									}
								}}
							>
								{option.label}
							</button>
						</li>
					);
				})}
			</ul>
		</details>
	);
}
