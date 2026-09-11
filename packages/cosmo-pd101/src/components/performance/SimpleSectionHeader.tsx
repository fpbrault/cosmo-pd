import type { PropsWithChildren } from "react";

type SimpleSectionHeaderProps = PropsWithChildren<{
	className?: string;
}>;

export default function SimpleSectionHeader({
	children,
	className = "",
}: SimpleSectionHeaderProps) {
	return (
		<h2
			className={`cz-collapse-header cz-section-slanted-title h-5 shrink-0 justify-center py-0 ${className}`}
		>
			{children}
		</h2>
	);
}
