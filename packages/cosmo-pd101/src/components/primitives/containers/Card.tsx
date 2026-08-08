import React from "react";

export type CardVariant =
	| "panel"
	| "panel-slanted"
	| "panel-gold"
	| "hero"
	| "subtle"
	| "inset"
	| "ghost";
export type CardPadding = "none" | "sm" | "md" | "lg";

type CardProps<T extends React.ElementType = "div"> = {
	as?: T;
	variant?: CardVariant;
	padding?: CardPadding;
	className?: string;
} & Omit<
	React.ComponentPropsWithoutRef<T>,
	"as" | "variant" | "padding" | "className"
>;

export const CARD_BASE_CLASSES = "card text-cz-cream outline-none";

const CARD_VARIANT_CLASSES: Record<CardVariant, string> = {
	panel: "rounded-2xl  ",
	"panel-slanted": "rounded-none cz-section-slanted",
	"panel-gold": "rounded-none cz-section-gold",
	hero: "rounded-2xl bg-cz-surface",
	subtle: "rounded-none bg-cz-surface/50",
	inset: "rounded-lg bg-cz-inset",
	ghost: "rounded-none bg-transparent",
};

const CARD_PADDING_CLASSES: Record<Exclude<CardPadding, "none">, string> = {
	sm: "p-1",
	md: "p-2",
	lg: "p-3",
};

export function joinClasses(
	...classes: Array<string | false | null | undefined>
) {
	return classes.filter(Boolean).join(" ");
}

export function getCardClassName({
	variant,
	padding,
	className,
	baseClassName = CARD_BASE_CLASSES,
}: {
	variant: CardVariant;
	padding: CardPadding;
	className?: string;
	baseClassName?: string;
}) {
	return joinClasses(
		baseClassName,
		CARD_VARIANT_CLASSES[variant],
		padding !== "none" && CARD_PADDING_CLASSES[padding],
		className,
	);
}

export default function Card<T extends React.ElementType = "div">({
	as,
	variant = "panel",
	padding = "md",
	className = "",
	...props
}: CardProps<T>) {
	const Component = (as ?? "div") as React.ElementType;
	const componentProps = props as React.ComponentPropsWithoutRef<T>;

	return React.createElement(Component, {
		...componentProps,
		className: getCardClassName({ variant, padding, className }),
	});
}
