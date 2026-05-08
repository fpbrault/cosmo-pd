import type { ReactNode } from "react";
import Button from "@/components/controls/Button";

type SynthPanelContainerProps = {
	children?: ReactNode;
	className?: string;
	enabled?: boolean;
	onToggleEnabled?: (next: boolean) => void;
	showEnableToggle?: boolean;
	enableLabel?: string;
	visual?: ReactNode;
	visualTitle?: ReactNode;
	visualMeta?: ReactNode;
	visualClassName?: string;
};

export default function SynthPanelContainer({
	children,
	className,
	enabled = false,
	onToggleEnabled,
	showEnableToggle = false,
	enableLabel = "Enable",
	visual,
	visualTitle,
	visualMeta,
	visualClassName,
}: SynthPanelContainerProps) {
	return (
		<div
			className={[
				"rounded-lg border border-cz-border bg-cz-inset p-3",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			{showEnableToggle ? (
				<div className="mb-2 flex items-center justify-center gap-2">
					<span className="font-mono text-3xs text-cz-cream-dim uppercase tracking-wider">
						{enableLabel}
					</span>
					<Button
						type="button"
						className={`cz-btn-arrow ${enabled ? "bg-cz-gold" : ""}`}
						onClick={() => onToggleEnabled?.(!enabled)}
					>
						<span
							className={`font-bold font-mono text-5xs uppercase tracking-wider ${
								enabled ? "text-white" : "text-cz-cream-dim"
							}`}
						>
							{enabled ? "On" : "Off"}
						</span>
					</Button>
				</div>
			) : null}

			{visual ? (
				<div
					className={[
						"mb-3 overflow-hidden rounded-xl border border-cz-border bg-cz-inset p-3",
						visualClassName,
					]
						.filter(Boolean)
						.join(" ")}
				>
					{visualTitle || visualMeta ? (
						<div className="cz-light-blue mb-2 justify-between">
							<span>{visualTitle}</span>
							<span>{visualMeta}</span>
						</div>
					) : null}
					{visual}
				</div>
			) : null}

			{children}
		</div>
	);
}
