import { memo } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/primitives/buttons/Button";
import type { ModRoute } from "@/lib/synth/bindings/synth";
import ControlKnob from "../parameters/ControlKnob";
import { MOD_SOURCE_META } from "./modRouteMeta";

interface ModRouteRowProps {
	route: ModRoute;
	/** Human-readable destination label. Falls back to raw destination id. */
	destinationLabel?: string;
	/** Whether to show the destination label (hide in per-destination menus). */
	showDestination?: boolean;
	onToggleEnabled: () => void;
	onRemove: () => void;
	onAmountChange: (amount: number) => void;
	onEditRoute?: () => void;
}

const ModRouteRow = memo(function ModRouteRow({
	route,
	destinationLabel,
	showDestination = false,
	onToggleEnabled,
	onRemove,
	onAmountChange,
	onEditRoute,
}: ModRouteRowProps) {
	const { t } = useTranslation("synth");
	const meta = MOD_SOURCE_META[route.source];

	return (
		<div
			className={`rounded-lg border px-2 py-1.5 transition-colors ${
				route.enabled
					? "border-cz-border/60 bg-cz-inset/80"
					: "border-cz-border/30 bg-cz-inset/30 opacity-60"
			}`}
		>
			<div className="flex flex-col pr-1">
				<div className="flex w-full items-center justify-between gap-2">
					<div className="grow">
						<input
							type="checkbox"
							className="toggle toggle-secondary toggle-xs ml-3"
							checked={route.enabled}
							onChange={onToggleEnabled}
							aria-label={
								route.enabled
									? t("modulation.disableRouteAria")
									: t("modulation.enableRouteAria")
							}
						/>
					</div>
					<span
						className={`badge badge-xs shrink-0 font-bold font-mono text-[0.52rem] uppercase tracking-[0.15em] ${meta.colorClass} ${meta.bgClass}`}
					>
						{meta.shortLabel}
					</span>
					{showDestination ? (
						<div className="flex min-w-0 items-center gap-1">
							<span className="text-[0.55rem] text-cz-cream-dim/50">→</span>
							<span
								className="min-w-0 truncate font-mono text-[0.55rem] text-cz-cream-dim uppercase tracking-widest"
								title={destinationLabel}
							>
								{destinationLabel ?? route.destination}
							</span>
						</div>
					) : null}
				</div>
				<div className="mt-1 flex w-full items-center justify-between">
					<ControlKnob
						value={route.amount ?? 0}
						onChange={onAmountChange}
						min={-1}
						max={1}
						bipolar
						color="#7f9de4"
						size={48}
						tooltip={t("modulation.routeTooltip")}
						valueFormatter={(v) => v.toFixed(2)}
						valueVisibility="hover"
					/>

					<div className="flex gap-2">
						{onEditRoute ? (
							<Button
								type="button"
								onClick={onEditRoute}
								aria-label={t("modulation.editRouteAria")}
								className="btn btn-accent btn-xs"
							>
								{t("modulation.editButton")}
							</Button>
						) : null}{" "}
						<Button
							type="button"
							onClick={onRemove}
							aria-label="Remove route"
							className="btn btn-error btn-xs"
						>
							✕
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
});

export default ModRouteRow;
