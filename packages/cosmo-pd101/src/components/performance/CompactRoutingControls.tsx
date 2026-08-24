import { memo, useRef, useState } from "react";
import Popover from "@/components/primitives/Popover";
import { useSynthParam } from "@/features/synth/SynthParamController";
import type { LineSelect, ModMode } from "@/lib/synth/bindings/synth";
import { getEnumTooltip } from "@/lib/synth/paramMeta";

const LINE_SELECT_OPTIONS: LineSelect[] = ["L1", "L2", "L1+L1'", "L1+L2'"];
const MOD_MODE_OPTIONS: ModMode[] = ["normal", "ring", "noise"];

function formatLineSelect(value: LineSelect) {
	return value.replaceAll("+", " + ").replaceAll("'", "′");
}

type CompactPickerProps<T extends string> = {
	label: string;
	value: T;
	options: readonly T[];
	formatValue: (value: T) => string;
	isDisabled?: (value: T) => boolean;
	onChange: (value: T) => void;
};

function CompactPicker<T extends string>({
	label,
	value,
	options,
	formatValue,
	isDisabled,
	onChange,
}: CompactPickerProps<T>) {
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				aria-label={`${label}: ${formatValue(value)}`}
				aria-haspopup="dialog"
				aria-expanded={open}
				onClick={() => setOpen((current) => !current)}
				className="flex min-h-0 flex-1 flex-col items-center justify-center rounded border border-cz-border bg-cz-inset/70 px-1 text-cz-gold hover:border-cz-light-blue focus:outline-none focus:ring-1 focus:ring-cz-light-blue"
			>
				<span className="mb-0.5 font-mono text-[0.42rem] text-cz-cream/65 uppercase tracking-[0.12em]">
					{label}
				</span>
				<span className="mt-1 whitespace-nowrap font-mono text-[0.52rem] text-cz-gold uppercase tracking-[0.02em]">
					{formatValue(value)} ▾
				</span>
			</button>
			<Popover
				open={open}
				onClose={() => setOpen(false)}
				triggerRef={triggerRef}
				ariaLabel={label}
				placement="top"
			>
				<div className="p-2">
					<div className="mb-2 text-center font-mono text-[0.62rem] text-cz-cream uppercase tracking-[0.18em]">
						{label}
					</div>
					<div className={options.length === 4 ? "grid grid-cols-2" : "flex"}>
						{options.map((option) => {
							const disabled = isDisabled?.(option) ?? false;
							return (
								<button
									key={option}
									type="button"
									disabled={disabled}
									aria-pressed={option === value}
									title={getEnumTooltip(
										label === "Line Select" ? "lineSelect" : "modMode",
										option,
									)}
									onClick={() => {
										onChange(option);
										setOpen(false);
									}}
									className="flex h-12 w-28 items-center justify-center border border-cz-border bg-cz-surface font-mono text-cz-gold text-xs uppercase hover:border-cz-light-blue disabled:cursor-not-allowed disabled:opacity-30 aria-pressed:border-cz-light-blue aria-pressed:bg-cz-inset aria-pressed:text-white"
								>
									{formatValue(option)}
								</button>
							);
						})}
					</div>
				</div>
			</Popover>
		</>
	);
}

export default memo(function CompactRoutingControls() {
	const { value: lineSelect, setValue: setLineSelect } =
		useSynthParam("lineSelect");
	const { value: modMode, setValue: setModMode } = useSynthParam("modMode");
	const dualLineMode = lineSelect === "L1+L1'" || lineSelect === "L1+L2'";

	return (
		<div
			className="flex w-[5.2rem] shrink-0 flex-col gap-1 border-cz-border border-r pr-1"
			data-testid="simple-routing-controls"
		>
			<CompactPicker
				label="Line Select"
				value={lineSelect}
				options={LINE_SELECT_OPTIONS}
				formatValue={formatLineSelect}
				onChange={setLineSelect}
			/>
			<CompactPicker
				label="Line Mod"
				value={modMode}
				options={MOD_MODE_OPTIONS}
				formatValue={(value) => value[0].toUpperCase() + value.slice(1)}
				isDisabled={(value) => value !== "normal" && !dualLineMode}
				onChange={setModMode}
			/>
		</div>
	);
});
