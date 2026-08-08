import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ModRouteEditorPanel from "@/components/controls/modulation/ModRouteEditorPanel";
import ModRouteRow from "@/components/controls/modulation/ModRouteRow";
import { MOD_SOURCE_META } from "@/components/controls/modulation/modRouteMeta";
import Button from "@/components/primitives/buttons/Button";
import { useModMatrix } from "@/context/ModMatrixContext";
import type {
	ModDestination,
	ModRoute,
	ModSource,
} from "@/lib/synth/bindings/synth";
import {
	getModDestinationGroups,
	getModDestinationLabel,
} from "@/lib/synth/modTargets";

const DESTINATION_GROUPS = getModDestinationGroups();
function destinationLabel(dest: ModDestination): string {
	return getModDestinationLabel(dest);
}

// ---------------------------------------------------------------------------
// ModMatrixPanel — full mod matrix list with add/remove
// ---------------------------------------------------------------------------

export default function ModMatrixPanel() {
	const { t } = useTranslation("synth");
	const { modMatrix, setModMatrix } = useModMatrix();
	const routes = modMatrix.routes ?? [];
	const nextRouteKeyRef = useRef(0);

	const [isAddPopoverOpen, setIsAddPopoverOpen] = useState(false);
	const [newSource, setNewSource] = useState<ModSource>("lfo1");
	const [newDest, setNewDest] = useState<ModDestination>("volume");
	const [editingRouteIndex, setEditingRouteIndex] = useState<number | null>(
		null,
	);
	const [routeKeys, setRouteKeys] = useState<string[]>(() =>
		routes.map(() => `mod-route-${nextRouteKeyRef.current++}`),
	);
	const renderedRouteKeys = routes.map(
		(_, idx) => routeKeys[idx] ?? `mod-route-pending-${idx}`,
	);

	useEffect(() => {
		if (routeKeys.length === routes.length) {
			return;
		}

		setRouteKeys((currentKeys) => {
			if (currentKeys.length > routes.length) {
				return currentKeys.slice(0, routes.length);
			}

			return [
				...currentKeys,
				...Array.from(
					{ length: routes.length - currentKeys.length },
					() => `mod-route-${nextRouteKeyRef.current++}`,
				),
			];
		});
	}, [routeKeys.length, routes.length]);

	const handleAdd = (source: ModSource, destination: ModDestination) => {
		const route: ModRoute = {
			source,
			destination,
			amount: 0,
			enabled: true,
		};
		setRouteKeys((currentKeys) => [
			...currentKeys,
			`mod-route-${nextRouteKeyRef.current++}`,
		]);
		setModMatrix({ routes: [...routes, route] });
		setIsAddPopoverOpen(false);
	};

	const handleSaveEditedRoute = () => {
		if (editingRouteIndex === null) {
			return;
		}

		const next = routes.map((route, idx) =>
			idx === editingRouteIndex
				? {
						...route,
						source: newSource,
						destination: newDest,
					}
				: route,
		);
		setModMatrix({ routes: next });
		setEditingRouteIndex(null);
	};

	const handleAddFromSelection = () => {
		handleAdd(newSource, newDest);
	};

	const handleRemove = (idx: number) => {
		const next = [...routes];
		next.splice(idx, 1);
		setRouteKeys((currentKeys) =>
			currentKeys.filter((_, keyIndex) => keyIndex !== idx),
		);
		setModMatrix({ routes: next });
	};

	const handleToggle = (idx: number) => {
		const next = routes.map((r, i) =>
			i === idx ? { ...r, enabled: !r.enabled } : r,
		);
		setModMatrix({ routes: next });
	};

	const handleAmount = (idx: number, amount: number) => {
		const next = routes.map((r, i) => (i === idx ? { ...r, amount } : r));
		setModMatrix({ routes: next });
	};

	const isEditingRoute = isAddPopoverOpen || editingRouteIndex !== null;

	return (
		<section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-cz-border bg-cz-surface p-3 shadow-lg">
			{/* Header */}
			<div className="mb-2 flex items-center gap-2">
				<span className="font-bold font-mono text-cz-light-blue text-sm uppercase tracking-[0.3em]">
					{t("modMatrix.title")}
				</span>
				{routes.length > 0 && (
					<span className="rounded-full border border-cz-light-blue/40 bg-cz-light-blue/15 px-1.5 font-bold font-mono text-5xs text-cz-light-blue">
						{routes.length}
					</span>
				)}
			</div>

			{/* Route list / editor */}
			<div className="min-h-0 flex-1 overflow-hidden">
				{isAddPopoverOpen ? (
					<ModRouteEditorPanel
						title={t("modMatrix.addRoute")}
						source={newSource}
						destination={newDest}
						destinationGroups={DESTINATION_GROUPS}
						onSourceChange={setNewSource}
						onDestinationChange={setNewDest}
						onConfirm={handleAddFromSelection}
						onCancel={() => setIsAddPopoverOpen(false)}
						confirmLabel={t("modMatrix.confirmAdd", {
							source: MOD_SOURCE_META[newSource].label,
							destination: destinationLabel(newDest),
						})}
					/>
				) : editingRouteIndex !== null ? (
					<ModRouteEditorPanel
						title={t("modMatrix.editRoute")}
						source={newSource}
						destination={newDest}
						destinationGroups={DESTINATION_GROUPS}
						onSourceChange={setNewSource}
						onDestinationChange={setNewDest}
						onConfirm={handleSaveEditedRoute}
						onCancel={() => setEditingRouteIndex(null)}
						confirmLabel={t("modMatrix.confirmEdit", {
							source: MOD_SOURCE_META[newSource].label,
							destination: destinationLabel(newDest),
						})}
					/>
				) : (
					<div className="scrollbar-thin h-full min-h-0 space-y-1.5 overflow-y-auto pr-0.5">
						<AnimatePresence initial={false}>
							{routes.length === 0 && (
								<motion.div
									key="empty"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="flex h-16 items-center justify-center rounded-lg border border-cz-border/50 border-dashed font-mono text-[0.55rem] text-cz-cream-dim/50 uppercase tracking-[0.18em]"
								>
									{t("modMatrix.noRoutes")}
								</motion.div>
							)}
							{routes.map((route, idx) => (
								<motion.div
									key={renderedRouteKeys[idx]}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 10, height: 0, marginTop: 0 }}
									transition={{ duration: 0.14, ease: "easeOut" }}
								>
									<ModRouteRow
										route={route}
										destinationLabel={destinationLabel(route.destination)}
										showDestination
										onEditRoute={() => {
											setNewSource(route.source);
											setNewDest(route.destination);
											setEditingRouteIndex(idx);
										}}
										onToggleEnabled={() => handleToggle(idx)}
										onRemove={() => handleRemove(idx)}
										onAmountChange={(amount) => handleAmount(idx, amount)}
									/>
								</motion.div>
							))}
						</AnimatePresence>
					</div>
				)}
			</div>

			{/* Add route form */}
			{!isEditingRoute && (
				<div className="mt-2 space-y-1.5 border-cz-border/40 border-t pt-2">
					<div className="font-mono text-5xs text-cz-cream-dim/60 uppercase tracking-[0.2em]">
						{t("modMatrix.addRouteButton")}
					</div>
					<Button
						type="button"
						onClick={() => {
							setNewSource("lfo1");
							setNewDest("volume");
							setEditingRouteIndex(null);
							setIsAddPopoverOpen(true);
						}}
						className="btn btn-sm w-full border-cz-border bg-cz-inset px-2 py-1.5 font-bold font-mono text-[0.55rem] text-cz-light-blue uppercase tracking-[0.15em] hover:border-cz-light-blue/60"
					>
						{t("modMatrix.addRoute")}
					</Button>
				</div>
			)}
		</section>
	);
}
