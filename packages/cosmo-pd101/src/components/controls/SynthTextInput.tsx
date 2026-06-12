import {
	type ChangeEvent,
	forwardRef,
	type KeyboardEvent,
	useRef,
} from "react";

type SynthTextInputProps = {
	value: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
	onCommit?: () => void;
	onCancel?: () => void;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
	id?: string;
	maxLength?: number;
	multiline?: boolean;
	autoFocus?: boolean;
	ariaLabel?: string;
};

export default forwardRef(function SynthTextInput(
	{
		value,
		onChange,
		onBlur,
		onCommit,
		onCancel,
		placeholder,
		className = "",
		disabled,
		id,
		maxLength,
		multiline,
		autoFocus,
		ariaLabel,
	}: SynthTextInputProps,
	ref: React.ForwardedRef<HTMLInputElement | HTMLTextAreaElement>,
) {
	const innerRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

	const handleKeyDown = (e: KeyboardEvent) => {
		e.stopPropagation();

		if (e.key === "Enter") {
			if (multiline) {
				if (e.metaKey || e.ctrlKey) {
					e.preventDefault();
					onCommit?.();
				}
			} else {
				e.preventDefault();
				onCommit?.();
			}
		}
		if (e.key === "Escape") {
			e.preventDefault();
			onCancel?.();
		}
	};

	const setRef = (node: HTMLInputElement | HTMLTextAreaElement | null) => {
		innerRef.current = node;
		if (typeof ref === "function") {
			ref(node);
		} else if (ref) {
			ref.current = node;
		}
	};

	const commonProps = {
		value,
		placeholder,
		disabled,
		id,
		maxLength,
		autoFocus,
		"aria-label": ariaLabel,
		onBlur,
		onKeyDown: handleKeyDown,
		onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
			onChange(e.target.value),
	};

	if (multiline) {
		return (
			<textarea
				ref={setRef}
				className={`textarea textarea-sm min-h-24 w-full resize-y border-cz-border bg-cz-inset text-cz-cream ${className}`}
				{...commonProps}
			/>
		);
	}

	return (
		<input
			ref={setRef}
			type="text"
			className={`input input-sm w-full border-cz-border bg-cz-inset text-cz-cream ${className}`}
			{...commonProps}
		/>
	);
});
