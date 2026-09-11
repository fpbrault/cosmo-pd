import type { PropsWithChildren } from "react";

type PerformanceEffectSlotShellProps = PropsWithChildren<{
	className?: string;
}>;

export default function PerformanceEffectSlotShell({
	children,
	className = "",
}: PerformanceEffectSlotShellProps) {
	return (
		<div
			className={`relative flex min-w-0 flex-1 flex-col items-center justify-center rounded-lg border border-cz-border bg-cz-body/45 px-1 pt-6 pb-2 shadow-inner ${className}`}
		>
			{children}
		</div>
	);
}
