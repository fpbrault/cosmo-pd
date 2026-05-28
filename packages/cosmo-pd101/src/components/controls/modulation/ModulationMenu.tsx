import { AnimatePresence, motion } from "motion/react";
import Button from "@/components/controls/Button";
import type { ModRoute, ModSource } from "@/lib/synth/bindings/synth";
import { MOD_SOURCE_META, MOD_SOURCE_OPTIONS } from "./modRouteMeta";

interface ModulationMenuProps {
	title: string;
	routes: ModRoute[];
	onToggleEnabled: (index: number) => void;
	onRemoveRoute: (index: number) => void;
	onAmountChange: (index: number, amount: number) => void;
	onAddRoute: (source: ModSource) => void;
	highlightedSource?: ModSource | null;
	onClose: () => void;
}

export default function ModulationMenu({
	title,
	routes,
	onToggleEnabled,
	onRemoveRoute,
	onAmountChange,
	onAddRoute,
	highlightedSource = null,
	onClose,
}: ModulationMenuProps) {
	const routesBySource = new Map(
		routes.map((route, index) => [route.source, index]),
	);

	return (
		<section
			className="max-h-[calc(100vh-1rem)] w-[35rem] max-w-[calc(100vw-1rem)]"
			aria-label={`Modulation for ${title}`}
		>
			<div className="flex items-center justify-between bg-cz-surface px-3.5 py-2.5">
				<div className="flex items-center gap-3">
					<span className="h-2 w-2 rounded-full bg-cz-light-blue shadow-[0_0_10px_rgba(127,157,228,0.75)]" />
					<div>
						<div className="font-bold font-mono text-[0.7rem] text-cz-cream uppercase tracking-[0.24em]">
							Modulate
						</div>
						<div className="font-mono text-[0.5rem] text-cz-cream-dim/60 uppercase tracking-[0.18em]">
							{title}
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<span className="rounded-full border border-cz-light-blue/35 bg-cz-light-blue/10 px-2 py-0.5 font-mono text-[0.48rem] text-cz-light-blue uppercase tracking-[0.16em]">
						{routes.length} Route{routes.length === 1 ? "" : "s"}
					</span>
					<Button
						type="button"
						onClick={onClose}
						aria-label="Close modulation panel"
						className="btn btn-ghost btn-square btn-xs h-7 w-7 text-cz-cream-dim/60 hover:bg-cz-border/40 hover:text-cz-cream"
					>
						✕
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-3 p-3">
				<div className="flex flex-col gap-2">
					<div className="font-mono text-[0.52rem] text-cz-cream-dim/60 uppercase tracking-[0.22em]">
						Add source
					</div>
					<div className="grid auto-rows-min grid-cols-2 gap-2 pr-1">
						{MOD_SOURCE_OPTIONS.map((source) => {
							const meta = MOD_SOURCE_META[source.value];
							const existingIndex = routesBySource.get(source.value);
							const isExisting = existingIndex !== undefined;
							const isHighlighted = highlightedSource === source.value;

							return (
								<Button
									key={source.value}
									type="button"
									onClick={() => onAddRoute(source.value)}
									className={`btn h-auto min-h-0 justify-between rounded-lg border px-2.5 py-2 text-left font-mono text-[0.64rem] uppercase tracking-[0.16em] ${
										isHighlighted
											? "border-cz-light-blue/80 bg-cz-light-blue/20 shadow-[0_0_0_1px_rgba(127,157,228,0.35)]"
											: isExisting
												? "border-current/45 bg-current/15"
												: "border-current/25 bg-current/8"
									} ${meta.colorClass} hover:bg-current/20`}
								>
									<span>{source.label}</span>
									<span className="text-[0.48rem] text-current/80">
										{isExisting ? "Edit" : "Add"}
									</span>
								</Button>
							);
						})}
					</div>
				</div>

				<div className="flex min-h-0 flex-col gap-2 self-stretch">
					<div className="font-mono text-[0.52rem] text-cz-cream-dim/60 uppercase tracking-[0.22em]">
						Current routes
					</div>
					{routes.length > 0 ? (
						<div className="max-h-[18.5rem] min-h-[18.5rem] space-y-2 overflow-y-auto pr-1">
							<AnimatePresence initial={false}>
								{routes.map((route, idx) => {
									const meta = MOD_SOURCE_META[route.source];
									const isHighlighted = highlightedSource === route.source;
									const amount = route.amount ?? 0;

									return (
										<motion.div
											key={route.source}
											initial={{ opacity: 0, y: 6 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -6 }}
											className={`rounded-xl border px-2.5 py-2.5 transition-colors ${
												route.enabled
													? "border-cz-border/70 bg-cz-inset/90"
													: "border-cz-border/35 bg-cz-inset/35 opacity-70"
											} ${
												isHighlighted
													? "shadow-[0_0_0_1px_rgba(127,157,228,0.42)]"
													: ""
											}`}
										>
											<div className="flex items-start justify-between gap-3">
												<div className="space-y-2">
													<span
														className={`badge border font-bold font-mono text-[0.54rem] uppercase tracking-[0.14em] ${meta.colorClass} ${meta.bgClass}`}
													>
														{meta.label}
													</span>
													<label className="flex items-center gap-2 font-mono text-[0.5rem] text-cz-cream-dim/75 uppercase tracking-[0.14em]">
														<input
															type="checkbox"
															className="toggle toggle-secondary toggle-sm"
															checked={route.enabled}
															onChange={() => onToggleEnabled(idx)}
															aria-label={
																route.enabled ? "Disable route" : "Enable route"
															}
														/>
														{route.enabled ? "Enabled" : "Muted"}
													</label>
												</div>
												<Button
													type="button"
													onClick={() => onRemoveRoute(idx)}
													aria-label={`Remove ${meta.label} route`}
													className="btn btn-ghost btn-sm h-8 min-h-0 rounded-lg border border-cz-border/40 px-2.5 font-mono text-[0.5rem] text-cz-cream-dim/70 uppercase tracking-[0.16em] hover:border-red-400/50 hover:bg-red-400/10 hover:text-red-200"
												>
													Remove
												</Button>
											</div>
											<div className="mt-2.5 flex items-center justify-between gap-2.5">
												<div className="font-mono text-[0.48rem] text-cz-cream-dim/55 uppercase tracking-[0.18em]">
													Depth
												</div>
												<div className="rounded-lg border border-cz-border/60 bg-black/10 px-2 py-1">
													<input
														type="range"
														min={-1}
														max={1}
														step={0.01}
														value={amount}
														onChange={(event) =>
															onAmountChange(idx, Number(event.target.value))
														}
														className="range range-sm w-32"
														aria-label={`${meta.label} depth`}
													/>
													<div className="mt-1 text-center font-mono text-[0.52rem] text-cz-cream uppercase tracking-[0.18em]">
														{amount >= 0 ? "+" : ""}
														{(amount * 100).toFixed(0)}%
													</div>
												</div>
											</div>
										</motion.div>
									);
								})}
							</AnimatePresence>
						</div>
					) : (
						<div className="flex min-h-[18.5rem] items-center justify-center rounded-xl border border-cz-border/40 border-dashed bg-black/10 px-3 py-5 text-center font-mono text-[0.56rem] text-cz-cream-dim/55 uppercase tracking-[0.2em]">
							Tap a source card to create the first route
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
