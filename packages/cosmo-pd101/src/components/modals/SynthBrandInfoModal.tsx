import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import logoSrc from "@/assets/logo.png";
import Button from "@/components/controls/Button";

export function SynthBrandInfoModal({
	open,
	onClose,
	appVersion,
}: {
	open: boolean;
	onClose: () => void;
	appVersion: string;
}) {
	const { t } = useTranslation("synth");
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
			aria-label={t("brandInfo.ariaLabel")}
		>
			<button
				type="button"
				className="absolute inset-0 bg-cz-body/80 backdrop-blur-sm"
				onClick={onClose}
				aria-label={t("brandInfo.closeAriaLabel")}
			/>
			<div className="relative w-[min(32rem,94%)] rounded-md border border-cz-border bg-cz-surface p-5 text-cz-cream shadow-2xl">
				<div className="mb-4 flex items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<img
							src={logoSrc}
							alt={t("brandInfo.logoAlt")}
							className="h-16 w-16 rounded-md object-contain"
						/>
						<div>
							<p className="font-mono text-4xs text-cz-light-blue uppercase tracking-[0.3em]">
								{t("brandInfo.title")}
							</p>
							<h3 className="mt-1 font-mono font-semibold text-cz-cream text-sm uppercase tracking-[0.18em]">
								{t("brandInfo.subtitle")}
							</h3>
						</div>
					</div>
					<Button
						type="button"
						className="btn btn-sm border-cz-border bg-cz-inset text-cz-cream"
						onClick={onClose}
					>
						{t("brandInfo.close")}
					</Button>
				</div>

				<div className="space-y-2 rounded-md border border-cz-border bg-cz-inset/60 p-4">
					<p className="font-mono text-cz-cream text-xs">
						{t("brandInfo.author")}
					</p>
					<p className="font-mono text-2xs text-cz-cream-dim uppercase tracking-[0.14em]">
						Version: {appVersion}
					</p>
					<p className="font-mono text-2xs text-cz-cream-dim uppercase tracking-[0.14em]">
						{t("brandInfo.version", { year: 2026 })}
					</p>
					<p className="pt-2 text-cz-gold text-sm">
						{t("brandInfo.catsDedication")}
					</p>
				</div>
			</div>
		</div>
	);
}
