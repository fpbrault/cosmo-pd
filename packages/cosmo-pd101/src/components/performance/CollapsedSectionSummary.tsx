import type { PropsWithChildren } from "react";
import SimpleSectionHeader from "./SimpleSectionHeader";

type CollapsedSectionSummaryProps = PropsWithChildren<{
	title: string;
	ariaLabel: string;
	testId: string;
	onExpand: () => void;
	className?: string;
	headerClassName?: string;
}>;

export default function CollapsedSectionSummary({
	title,
	ariaLabel,
	testId,
	onExpand,
	className = "",
	headerClassName = "",
	children,
}: CollapsedSectionSummaryProps) {
	return (
		<div
			className={`group relative flex h-full w-full min-w-0 flex-col items-center bg-cz-surface/80 p-0 text-cz-cream transition-colors hover:bg-cz-inset ${className}`}
			data-testid={testId}
		>
			<button
				type="button"
				onClick={onExpand}
				aria-label={ariaLabel}
				className="absolute inset-0 z-10 focus:outline-none focus:ring-1 focus:ring-cz-light-blue focus:ring-inset"
			/>
			<SimpleSectionHeader
				className={`px-0 transition-[filter] group-hover:brightness-125 ${headerClassName}`}
			>
				{title}
			</SimpleSectionHeader>
			{children}
		</div>
	);
}
