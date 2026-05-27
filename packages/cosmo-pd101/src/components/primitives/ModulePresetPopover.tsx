import { useEffect, useRef, useState } from "react";
import Button from "@/components/controls/Button";

export type ModulePresetOption = {
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
	builtinPresetIds?: Set<string>;
	onSavePreset?: (name: string) => void;
	onDeletePreset?: (presetId: string) => void;
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

function SaveAsDialog({
	open,
	onClose,
	onSave,
}: {
	open: boolean;
	onClose: () => void;
	onSave: (name: string) => void;
}) {
	const [name, setName] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (open) {
			setName("");
			setTimeout(() => inputRef.current?.focus(), 0);
		}
	}, [open]);

	return (
		<dialog
			className="modal"
			open={open}
			onCancel={(event) => {
				event.preventDefault();
				onClose();
			}}
		>
			<div className="modal-box rounded-md border border-cz-border bg-cz-panel">
				<h3 className="mb-4 font-bold text-cz-cream-light text-lg">
					Save FX Preset As
				</h3>
				<input
					ref={inputRef}
					type="text"
					className="input input-bordered w-full rounded-md border-cz-border bg-cz-surface text-cz-cream-light"
					placeholder="Preset name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && name.trim()) {
							onSave(name.trim());
						}
						if (e.key === "Escape") {
							onClose();
						}
					}}
				/>
				<div className="modal-action">
					<Button
						type="button"
						onClick={onClose}
						className="btn btn-ghost btn-sm text-cz-cream/70"
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={() => onSave(name.trim())}
						disabled={!name.trim()}
						className="btn btn-primary btn-sm"
					>
						Save
					</Button>
				</div>
			</div>
		</dialog>
	);
}

export default function ModulePresetPopover({
	title,
	value,
	options,
	onChange,
	accentColor,
	disabled = false,
	builtinPresetIds,
	onSavePreset,
	onDeletePreset,
}: ModulePresetPopoverProps) {
	const detailsRef = useRef<HTMLDetailsElement | null>(null);
	const borderColor = colorAlpha(accentColor ?? "", 0.65);
	const activeBgColor = colorAlpha(accentColor ?? "", 0.34);
	const [saveDialogOpen, setSaveDialogOpen] = useState(false);

	const hasManageActions = onSavePreset || (onDeletePreset && builtinPresetIds);

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
		<>
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
					className="menu dropdown-content z-9999 mb-1.5 max-h-64 w-44 overflow-y-auto rounded-md border border-cz-border bg-cz-panel p-1 shadow-[0_10px_24px_rgba(0,0,0,0.5)]"
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
									style={
										active ? { backgroundColor: activeBgColor } : undefined
									}
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
					{hasManageActions ? (
						<>
							<li className="divider my-1 h-px bg-cz-border/50" />
							{onSavePreset ? (
								<li>
									<Button
										type="button"
										className="btn btn-ghost btn-sm min-h-0 w-full justify-start px-2 py-1 text-cz-cream-dim text-xs hover:text-cz-cream-light"
										onClick={() => {
											setSaveDialogOpen(true);
											if (detailsRef.current) {
												detailsRef.current.open = false;
											}
										}}
									>
										+ Save
									</Button>
								</li>
							) : null}
							{onDeletePreset &&
							builtinPresetIds &&
							value &&
							!builtinPresetIds.has(value) ? (
								<li>
									<Button
										type="button"
										className="btn btn-ghost btn-sm min-h-0 w-full justify-start px-2 py-1 text-red-400 text-xs hover:text-red-300"
										onClick={() => {
											onDeletePreset(value);
											if (detailsRef.current) {
												detailsRef.current.open = false;
											}
										}}
									>
										Delete
									</Button>
								</li>
							) : null}
						</>
					) : null}
				</ul>
			</details>
			<SaveAsDialog
				open={saveDialogOpen}
				onClose={() => setSaveDialogOpen(false)}
				onSave={(name) => {
					onSavePreset?.(name);
					setSaveDialogOpen(false);
				}}
			/>
		</>
	);
}
