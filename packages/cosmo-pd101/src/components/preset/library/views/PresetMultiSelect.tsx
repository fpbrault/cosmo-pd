import { memo, useMemo } from "react";
import type { GroupBase, MultiValue } from "react-select";
import Select from "react-select";
import { getPresetTagTone } from "../metadata/presetTagTone";

export type PresetSelectOption = {
	value: string;
	label: string;
};

type PresetMultiSelectProps = {
	label: string;
	inputId: string;
	options: readonly PresetSelectOption[];
	selectedValues: readonly string[];
	onChange: (values: string[]) => void;
	placeholder: string;
	clearButtonLabel: string;
	noOptionsMessage?: string;
	tagTone?: boolean;
};

export default memo(function PresetMultiSelect({
	label,
	inputId,
	options,
	selectedValues,
	onChange,
	placeholder,
	clearButtonLabel,
	noOptionsMessage = "No options",
	tagTone = false,
}: PresetMultiSelectProps) {
	const value = useMemo(
		() => options.filter((option) => selectedValues.includes(option.value)),
		[options, selectedValues],
	);

	return (
		<div className="min-w-0">
			<div className="mb-1 flex items-center justify-between gap-2">
				<label
					htmlFor={inputId}
					className="font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.18em]"
				>
					{label}
				</label>
				<button
					type="button"
					className="btn btn-ghost btn-xs h-6 min-h-0 rounded-sm border border-cz-border/70 px-1.5 text-cz-cream-dim hover:border-cz-light-blue/60 hover:bg-cz-inset hover:text-cz-cream disabled:border-cz-border/30 disabled:text-cz-cream-dim/40"
					aria-label={clearButtonLabel}
					disabled={selectedValues.length === 0}
					onClick={() => onChange([])}
				>
					x
				</button>
			</div>
			<Select<PresetSelectOption, true, GroupBase<PresetSelectOption>>
				unstyled
				isMulti
				closeMenuOnSelect={false}
				hideSelectedOptions={false}
				backspaceRemovesValue
				inputId={inputId}
				options={options}
				value={value}
				placeholder={placeholder}
				noOptionsMessage={() => noOptionsMessage}
				onChange={(nextValue: MultiValue<PresetSelectOption>) =>
					onChange(nextValue.map((option) => option.value))
				}
				classNames={{
					container: () => "w-full",
					control: (state) =>
						`min-h-10 rounded-md border bg-cz-inset px-2 text-sm ${state.isFocused ? "border-cz-light-blue" : "border-cz-border"}`,
					valueContainer: () => "flex flex-wrap gap-1 py-1",
					placeholder: () => "text-cz-cream-dim/70",
					input: () => "text-cz-cream",
					menu: () =>
						"z-30 mt-1 overflow-hidden rounded-md border border-cz-border bg-cz-surface shadow-xl",
					menuList: () => "max-h-56 overflow-y-auto p-1",
					option: (state) =>
						`cursor-pointer rounded-sm px-2 py-1.5 text-sm capitalize ${
							tagTone
								? state.isSelected
									? getPresetTagTone(state.data.value).selectOptionSelected
									: getPresetTagTone(state.data.value).selectOption
								: state.isSelected
									? "bg-cz-light-blue/15 text-cz-cream"
									: "bg-cz-surface text-cz-cream hover:bg-cz-inset"
						}`,
					multiValue: (state) =>
						`rounded-sm ${tagTone ? getPresetTagTone(state.data.value).multiValue : "border border-cz-border/70 bg-cz-inset"}`,
					multiValueLabel: (state) =>
						`px-1.5 py-0.5 font-mono text-4xs uppercase tracking-[0.16em] ${tagTone ? getPresetTagTone(state.data.value).multiValueLabel : "text-cz-cream"}`,
					multiValueRemove: (state) =>
						`rounded-r-sm px-1 text-xs ${tagTone ? getPresetTagTone(state.data.value).multiValueRemove : "text-cz-cream hover:bg-cz-light-blue/15 hover:text-cz-cream"}`,
					clearIndicator: () => "hidden",
					dropdownIndicator: () =>
						"px-1 text-cz-cream-dim transition-colors hover:text-cz-cream",
					indicatorSeparator: () => "hidden",
					noOptionsMessage: () => "px-2 py-2 text-cz-cream-dim text-xs",
				}}
			/>
		</div>
	);
});
