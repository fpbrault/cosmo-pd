import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	active?: boolean;
	className?: string;
}

const ACCESSIBLE_BASE_CLASS =
	"focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-content/70 disabled:cursor-not-allowed";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ children, active, className = "", disabled = false, type, ...props },
		ref,
	) => {
		const resolvedType = type ?? "button";
		const ariaPressed =
			props["aria-pressed"] ?? (active !== undefined ? active : undefined);

		const classes = [
			ACCESSIBLE_BASE_CLASS,
			active ? "btn-active" : "",
			disabled ? "btn-disabled" : "",
			className,
		]
			.filter(Boolean)
			.join(" ");

		return (
			<button
				ref={ref}
				className={classes}
				disabled={disabled}
				type={resolvedType}
				aria-pressed={ariaPressed}
				{...props}
			>
				{children}
			</button>
		);
	},
);

Button.displayName = "Button";

export default Button;
