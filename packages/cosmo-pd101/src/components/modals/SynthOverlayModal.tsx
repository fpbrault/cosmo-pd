import type { ReactNode } from "react";
import { useEffect } from "react";
import Button from "@/components/controls/Button";

export function SynthOverlayModal({
	open,
	onClose,
	title,
	ariaLabel,
	widthClassName,
	children,
}: {
	open: boolean;
	onClose: () => void;
	title: string;
	ariaLabel: string;
	widthClassName: string;
	children: ReactNode;
}) {
	useEffect(() => {
		if (!open) return;
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			event.preventDefault();
			onClose();
		};
		window.addEventListener("keydown", handleEscape);
		return () => window.removeEventListener("keydown", handleEscape);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			className="absolute inset-0 z-45 flex items-center justify-center"
			role="dialog"
			aria-modal="true"
			aria-label={ariaLabel}
		>
			<button
				type="button"
				className="absolute inset-0 bg-cz-body/80 backdrop-blur-sm"
				onClick={onClose}
				aria-label={`Close ${ariaLabel}`}
			/>
			<div
				className={`relative rounded-md border border-cz-border bg-cz-surface p-4 shadow-2xl ${widthClassName}`}
			>
				<div className="mb-2 flex items-center justify-between px-1">
					<p className="font-mono text-2xs text-cz-cream-dim uppercase tracking-[0.18em]">
						{title}
					</p>
					<Button
						type="button"
						className="btn btn-sm border-cz-border bg-cz-inset text-cz-cream"
						onClick={onClose}
					>
						Close
					</Button>
				</div>
				{children}
			</div>
		</div>
	);
}
