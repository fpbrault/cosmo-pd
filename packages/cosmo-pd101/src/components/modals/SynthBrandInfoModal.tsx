import { useEffect } from "react";
import logoSrc from "@/assets/logo.png";
import Button from "@/components/controls/Button";

export function SynthBrandInfoModal({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
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
			className="absolute inset-0 z-40 flex items-center justify-center"
			role="dialog"
			aria-modal="true"
			aria-label="Synthesizer lab information"
		>
			<button
				type="button"
				className="absolute inset-0 bg-cz-body/80 backdrop-blur-sm"
				onClick={onClose}
				aria-label="Close synthesizer information"
			/>
			<div className="relative w-[min(32rem,94%)] rounded-md border border-cz-border bg-cz-surface p-5 text-cz-cream shadow-2xl">
				<div className="mb-4 flex items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<img
							src={logoSrc}
							alt="Cosmo PD101 logo"
							className="h-16 w-16 rounded-md object-contain"
						/>
						<div>
							<p className="font-mono text-4xs text-cz-light-blue uppercase tracking-[0.3em]">
								Phase Distortion
							</p>
							<h3 className="mt-1 font-mono font-semibold text-cz-cream text-sm uppercase tracking-[0.18em]">
								Synthesizer Lab
							</h3>
						</div>
					</div>
					<Button
						type="button"
						className="btn btn-sm border-cz-border bg-cz-inset text-cz-cream"
						onClick={onClose}
					>
						Close
					</Button>
				</div>

				<div className="space-y-2 rounded-md border border-cz-border bg-cz-inset/60 p-4">
					<p className="font-mono text-cz-cream text-xs">Felix Perron-Brault</p>
					<p className="font-mono text-2xs text-cz-cream-dim uppercase tracking-[0.14em]">
						Version: 0.1.0
					</p>
					<p className="font-mono text-2xs text-cz-cream-dim uppercase tracking-[0.14em]">
						Year: 2026
					</p>
					<p className="pt-2 text-cz-gold text-sm">
						For my cats, Basil, Lola, and Latte
					</p>
				</div>
			</div>
		</div>
	);
}
