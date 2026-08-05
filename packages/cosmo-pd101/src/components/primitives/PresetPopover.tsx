import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/controls/Button";
import { useHoverInfoHandlers } from "@/components/layout/HoverInfo";
import Popover from "@/components/primitives/Popover";

export type PresetOption = {
	id: string;
	label?: string;
};

export type PresetPopoverProps = {
	title: string;
	saveDialogTitle?: string;
	value: string;
	options: PresetOption[];
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
	title,
}: {
	open: boolean;
	onClose: () => void;
	onSave: (name: string) => void;
	title: string;
}) {
	const { t } = useTranslation("synth");
	const [name, setName] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const titleId = useId();

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
			aria-labelledby={titleId}
			onCancel={(event) => {
				event.preventDefault();
				onClose();
			}}
		>
			<div className="modal-box rounded-md border border-cz-border bg-cz-panel">
				<h3 id={titleId} className="mb-4 font-bold text-cz-cream-light text-lg">
					{title}
				</h3>
				<input
					ref={inputRef}
					type="text"
					className="input input-bordered w-full rounded-md border-cz-border bg-cz-surface text-cz-cream-light"
					placeholder={t("modulePreset.presetNamePlaceholder")}
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
						{t("modulePreset.cancel")}
					</Button>
					<Button
						type="button"
						onClick={() => onSave(name.trim())}
						disabled={!name.trim()}
						className="btn btn-primary btn-sm"
					>
						{t("modulePreset.save")}
					</Button>
				</div>
			</div>
		</dialog>
	);
}

export default function PresetPopover({
	title,
	saveDialogTitle,
	value,
	options,
	onChange,
	accentColor,
	disabled = false,
	builtinPresetIds,
	onSavePreset,
	onDeletePreset,
}: PresetPopoverProps) {
	const { t } = useTranslation("synth");
	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const borderColor = colorAlpha(accentColor ?? "", 0.65);
	const activeBgColor = colorAlpha(accentColor ?? "", 0.34);
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [saveDialogOpen, setSaveDialogOpen] = useState(false);
	const [focusedIndex, setFocusedIndex] = useState(-1);
	const presetTooltip = `Choose a ${title} preset.`;
	const presetHoverHandlers = useHoverInfoHandlers(presetTooltip);

	const hasManageActions = onSavePreset || (onDeletePreset && builtinPresetIds);

	const handleTriggerClick = useCallback(() => {
		setPopoverOpen((prev) => !prev);
	}, []);

	const handleClose = useCallback(() => {
		setPopoverOpen(false);
	}, []);

	useEffect(() => {
		if (!popoverOpen) {
			setFocusedIndex(-1);
			return;
		}

		const currentIdx = options.findIndex((o) => o.id === value);
		setFocusedIndex(currentIdx >= 0 ? currentIdx : 0);
	}, [popoverOpen, options, value]);

	const selectOption = useCallback(
		(optionId: string) => {
			onChange(optionId);
			handleClose();
		},
		[onChange, handleClose],
	);

	const handleListboxKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
					break;
				case "ArrowUp":
					e.preventDefault();
					setFocusedIndex((prev) => Math.max(prev - 1, 0));
					break;
				case "Home":
					e.preventDefault();
					setFocusedIndex(0);
					break;
				case "End":
					e.preventDefault();
					setFocusedIndex(options.length - 1);
					break;
				case "Enter":
				case " ":
					e.preventDefault();
					if (focusedIndex >= 0 && focusedIndex < options.length) {
						selectOption(options[focusedIndex].id);
					}
					break;
			}
		},
		[options, focusedIndex, selectOption],
	);

	if (disabled) {
		return (
			<Button
				type="button"
				disabled
				className="btn btn-xs flex h-5 min-h-0 min-w-20 cursor-not-allowed flex-nowrap items-center gap-1.5 rounded-sm border border-cz-border/65 px-2 font-bold font-mono text-[0.54rem] text-cz-cream/40 uppercase tracking-[0.14em] opacity-70"
				aria-label={t("modulePreset.unavailableAria", { title })}
				title={presetTooltip}
				data-hover-info={presetTooltip}
				{...presetHoverHandlers}
			>
				<span className="inline-block h-1 w-1 shrink-0 rounded-full bg-cz-cream/25" />
				<span>{t("modulePreset.presets")}</span>
				<span className="text-cz-cream/30">▾</span>
			</Button>
		);
	}

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				onClick={handleTriggerClick}
				aria-label={t("modulePreset.presetsAria", { title })}
				title={presetTooltip}
				data-hover-info={presetTooltip}
				{...presetHoverHandlers}
				aria-haspopup="listbox"
				aria-expanded={popoverOpen}
				className="btn btn-xs flex h-5 min-h-0 min-w-20 flex-nowrap items-center gap-1.5 rounded-sm border px-2 font-bold font-mono text-[0.54rem] text-cz-cream-light uppercase tracking-[0.14em] shadow-[0_1px_0_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.08)] hover:brightness-125"
			>
				<span
					className="inline-block h-1 w-1 shrink-0 rounded-full"
					style={{ backgroundColor: borderColor }}
				/>
				<span>{t("modulePreset.presets")}</span>
				<span className="text-cz-cream-dim">▾</span>
			</button>

			<Popover
				open={popoverOpen}
				onClose={handleClose}
				triggerRef={triggerRef}
				role="dialog"
				ariaLabel={t("modulePreset.presetsAria", { title })}
				placement="bottom-end"
			>
				<div className="w-44" role="presentation">
					{options.length > 0 ? (
						<div
							role="listbox"
							aria-label={t("modulePreset.presetsAria", { title })}
							aria-activedescendant={
								focusedIndex >= 0 ? `preset-opt-${focusedIndex}` : undefined
							}
							tabIndex={0}
							onKeyDown={handleListboxKeyDown}
							className="max-h-64 overflow-y-auto p-1"
						>
							{options.map((option, idx) => {
								const active = option.id === value;
								return (
									<div
										key={option.id}
										role="option"
										id={`preset-opt-${idx}`}
										tabIndex={-1}
										aria-selected={active}
										onClick={() => selectOption(option.id)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												selectOption(option.id);
											}
										}}
										onPointerEnter={() => setFocusedIndex(idx)}
										className={`cursor-pointer select-none rounded-sm px-2 py-1 text-xs ${
											active
												? "text-cz-cream-light"
												: "text-cz-cream hover:bg-cz-surface"
										} ${focusedIndex === idx ? "ring-1 ring-cz-light-blue/40" : ""}`}
										style={
											active ? { backgroundColor: activeBgColor } : undefined
										}
									>
										{option.label ?? option.id}
									</div>
								);
							})}
						</div>
					) : null}
					{hasManageActions ? (
						<>
							{options.length > 0 ? (
								<hr className="mx-2 border-cz-border/50 border-t" />
							) : null}
							<div className="p-1" role="presentation">
								{onSavePreset ? (
									<button
										type="button"
										onClick={() => {
											handleClose();
											setSaveDialogOpen(true);
										}}
										className="btn btn-ghost btn-sm min-h-0 w-full justify-start px-2 py-1 text-cz-cream-dim text-xs hover:text-cz-cream-light"
									>
										{t("modulePreset.savePlus")}
									</button>
								) : null}
								{onDeletePreset &&
								builtinPresetIds &&
								value &&
								!builtinPresetIds.has(value) ? (
									<button
										type="button"
										onClick={() => {
											onDeletePreset(value);
											handleClose();
										}}
										className="btn btn-ghost btn-sm min-h-0 w-full justify-start px-2 py-1 text-red-400 text-xs hover:text-red-300"
									>
										{t("modulePreset.delete")}
									</button>
								) : null}
							</div>
						</>
					) : null}
				</div>
			</Popover>

			<SaveAsDialog
				open={saveDialogOpen}
				onClose={() => setSaveDialogOpen(false)}
				title={saveDialogTitle ?? t("modulePreset.saveDialogTitle")}
				onSave={(name) => {
					onSavePreset?.(name);
					setSaveDialogOpen(false);
				}}
			/>
		</>
	);
}
