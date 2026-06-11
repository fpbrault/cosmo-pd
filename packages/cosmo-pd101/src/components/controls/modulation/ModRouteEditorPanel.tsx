import { useTranslation } from "react-i18next";
import Button from "@/components/controls/Button";
import type { ModDestination, ModSource } from "@/lib/synth/bindings/synth";
import { MOD_SOURCE_META, MOD_SOURCE_OPTIONS } from "./modRouteMeta";

const DESTINATION_GROUP_META: Record<
	string,
	{ colorClass: string; selectedClass: string; idleClass: string }
> = {
	Global: {
		colorClass: "text-cz-gold",
		selectedClass: "border-cz-gold/70 bg-cz-gold/20",
		idleClass: "border-cz-gold/30 bg-cz-gold/8",
	},
	"Line 1": {
		colorClass: "text-cz-light-blue",
		selectedClass: "border-cz-light-blue/80 bg-cz-light-blue/20",
		idleClass: "border-cz-light-blue/30 bg-cz-light-blue/8",
	},
	"Line 2": {
		colorClass: "text-fuchsia-300",
		selectedClass: "border-fuchsia-400/70 bg-fuchsia-400/18",
		idleClass: "border-fuchsia-400/25 bg-fuchsia-400/8",
	},
};

interface ModRouteEditorPanelProps {
	source: ModSource;
	destination: ModDestination;
	destinationGroups: {
		label: string;
		destinations: { label: string; value: ModDestination }[];
	}[];
	onSourceChange: (source: ModSource) => void;
	onDestinationChange: (destination: ModDestination) => void;
	onConfirm: () => void;
	onCancel: () => void;
	confirmLabel: string;
	title: string;
}

export default function ModRouteEditorPanel({
	source,
	destinationGroups,
	onSourceChange,
	onDestinationChange,
	onConfirm,
	onCancel,
	confirmLabel,
	title,
}: ModRouteEditorPanelProps) {
	const { t } = useTranslation("synth");
	return (
		<div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-cz-border/70 bg-cz-panel p-2 shadow-2xl">
			<div className="mb-2 flex items-center justify-between gap-2 border-cz-border/40 border-b pb-2">
				<div className="font-bold font-mono text-5xs text-cz-cream-dim/60 uppercase tracking-[0.2em]">
					{title}
				</div>
				<Button
					type="button"
					onClick={onCancel}
					className="btn btn-ghost btn-square btn-xs h-6 w-6 text-cz-cream-dim/70 hover:bg-cz-border/40 hover:text-cz-cream"
					aria-label={t("modulation.closeRouteEditorAria")}
				>
					✕
				</Button>
			</div>
			<div className="mb-1 font-mono text-5xs text-cz-cream-dim/60 uppercase tracking-[0.18em]">
				{t("modulation.sourceHeading")}
			</div>
			<div className="mb-3 grid grid-cols-2 gap-1">
				{MOD_SOURCE_OPTIONS.map((option) => (
					<Button
						key={option.value}
						type="button"
						onClick={() => onSourceChange(option.value)}
						className={`btn btn-xs justify-start px-2 font-mono text-[0.52rem] uppercase tracking-[0.12em] ${MOD_SOURCE_META[option.value].colorClass} border-current/30 ${source === option.value ? "bg-current/30" : "bg-current/10"} hover:bg-current/20`}
					>
						{option.label}
					</Button>
				))}
			</div>
			<div className="mb-1 font-mono text-5xs text-cz-cream-dim/60 uppercase tracking-[0.18em]">
				{t("modulation.destinationHeading")}
			</div>
			<div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-0.5">
				{destinationGroups.map((group) => (
					<div key={group.label} className="space-y-1">
						<div
							className={`font-mono text-5xs uppercase tracking-[0.16em] ${DESTINATION_GROUP_META[group.label]?.colorClass ?? "text-cz-cream-dim/50"}`}
						>
							{group.label}
						</div>
						<div className="grid grid-cols-2 gap-1">
							{group.destinations.map((option) => (
								<Button
									key={option.value}
									type="button"
									onClick={() => onDestinationChange(option.value)}
									className={`btn btn-sm btn-neutral py-1 font-mono text-4xs uppercase leading-tight tracking-widest`}
								>
									{option.label}
								</Button>
							))}
						</div>
					</div>
				))}
			</div>
			<div className="mt-2">
				<Button
					type="button"
					onClick={onConfirm}
					className="btn btn-sm btn-primary h-auto w-full"
				>
					{confirmLabel}
				</Button>
			</div>
		</div>
	);
}
