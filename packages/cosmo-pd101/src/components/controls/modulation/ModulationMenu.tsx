import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/controls/Button";
import type { ModRoute, ModSource } from "@/lib/synth/bindings/synth";
import ModRouteRow, { MOD_SOURCE_META } from "./ModRouteRow";

const MOD_SOURCES: { label: string; value: ModSource }[] = [
	{ label: "LFO 1", value: "lfo1" },
	{ label: "LFO 2", value: "lfo2" },
	{ label: "Random", value: "random" },
	{ label: "Mod Env", value: "modEnv" },
	{ label: "Velocity", value: "velocity" },
	{ label: "Mod Wheel", value: "modWheel" },
	{ label: "Aftertouch", value: "aftertouch" },
];

interface ModulationMenuProps {
	title: string;
	routes: ModRoute[];
	onToggleEnabled: (index: number) => void;
	onRemoveRoute: (index: number) => void;
	onAmountChange: (index: number, amount: number) => void;
	onAddRoute: (source: ModSource) => void;
	onClose: () => void;
}

export default function ModulationMenu({
	title,
	routes,
	onToggleEnabled,
	onRemoveRoute,
	onAmountChange,
	onAddRoute,
	onClose,
}: ModulationMenuProps) {
	const nextRouteKeyRef = useRef(0);
	const [selectedSource, setSelectedSource] = useState<ModSource>("lfo1");
	const [routeKeys, setRouteKeys] = useState<string[]>(() =>
		routes.map(() => `mod-route-${nextRouteKeyRef.current++}`),
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

	const handleAddRoute = () => {
		setRouteKeys((currentKeys) => [
			...currentKeys,
			`mod-route-${nextRouteKeyRef.current++}`,
		]);
		onAddRoute(selectedSource);
	};

	const handleRemoveRoute = (index: number) => {
		setRouteKeys((currentKeys) =>
			currentKeys.filter((_, keyIndex) => keyIndex !== index),
		);
		onRemoveRoute(index);
	};

	return (
		<motion.div
			className="w-62 overflow-hidden rounded-xl border border-cz-gold/30 bg-cz-panel shadow-2xl"
			role="dialog"
			aria-label={`Modulation for ${title}`}
			initial={{ opacity: 0, scale: 0.92, y: -6 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.92, y: -6 }}
			transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
			style={{ transformOrigin: "top center" }}
		>
			{/* Header */}
			<div className="flex items-center justify-between border-cz-border/60 border-b bg-cz-surface/80 px-3 py-2">
				<div className="flex items-center gap-2">
					<span className="h-1.5 w-1.5 rounded-full bg-cz-gold" />
					<span className="font-bold font-mono text-[0.62rem] text-cz-cream uppercase tracking-[0.25em]">
						{title}
					</span>
				</div>
				<Button
					type="button"
					onClick={onClose}
					aria-label="Close modulation panel"
					className="btn btn-ghost btn-square btn-xs h-5 w-5 text-cz-cream-dim/60 hover:bg-cz-border/40 hover:text-cz-cream"
				>
					✕
				</Button>
			</div>

			<div className="space-y-2 p-2.5">
				{/* Active routes */}
				{routes.length > 0 ? (
					<div className="space-y-1.5">
						<div className="font-mono text-5xs text-cz-cream-dim/60 uppercase tracking-[0.2em]">
							Active
						</div>
						<AnimatePresence initial={false}>
							{routes.map((route, idx) => (
								<motion.div
									key={routeKeys[idx]}
									initial={{ opacity: 0, x: -8 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 8, height: 0, marginTop: 0 }}
									transition={{
										duration: 0.14,
										ease: "easeOut",
										delay: idx * 0.04,
									}}
								>
									<ModRouteRow
										route={route}
										onToggleEnabled={() => onToggleEnabled(idx)}
										onRemove={() => handleRemoveRoute(idx)}
										onAmountChange={(amount) => onAmountChange(idx, amount)}
									/>
								</motion.div>
							))}
						</AnimatePresence>
					</div>
				) : (
					<div className="flex items-center justify-center rounded-lg border border-cz-border/50 border-dashed py-3 font-mono text-[0.55rem] text-cz-cream-dim/50 uppercase tracking-[0.18em]">
						No modulations
					</div>
				)}

				{/* Add source */}
				<div className="border-cz-border/40 border-t pt-2">
					<div className="mb-1.5 font-mono text-5xs text-cz-cream-dim/60 uppercase tracking-[0.2em]">
						Add source
					</div>
					<div className="flex gap-1.5">
						<div className="relative flex-1">
							<select
								value={selectedSource}
								onChange={(e) => setSelectedSource(e.target.value as ModSource)}
								aria-label="Select modulation source"
								className="w-full appearance-none rounded-md border border-cz-border bg-cz-inset px-2 py-1.5 font-mono text-[0.58rem] text-cz-cream uppercase tracking-widest outline-none transition-colors hover:border-cz-light-blue/60 focus:border-cz-light-blue"
							>
								{MOD_SOURCES.map((src) => (
									<option key={src.value} value={src.value}>
										{src.label}
									</option>
								))}
							</select>
							<span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-5xs text-cz-cream-dim/60">
								▾
							</span>
						</div>
						<Button
							type="button"
							onClick={handleAddRoute}
							className={`btn btn-sm shrink-0 px-2.5 py-1 font-bold font-mono text-[0.55rem] uppercase tracking-[0.15em] ${MOD_SOURCE_META[selectedSource].colorClass} border-current/30 bg-current/10 hover:bg-current/20`}
						>
							Add
						</Button>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
