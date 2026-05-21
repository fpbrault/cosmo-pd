import { motion } from "motion/react";
import {
	memo,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { useModMatrix } from "@/context/ModMatrixContext";
import { useModulationTarget } from "@/features/synth/hooks/useModulationTarget";
import type {
	ModDestination,
	ModRoute,
	ModSource,
} from "@/lib/synth/bindings/synth";
import ModulationMenu from "./ModulationMenu";

interface ModulatableControlProps {
	/** The mod-matrix destination this control maps to. */
	destinationId: ModDestination;
	/** The label shown next to the mod indicator. */
	label?: string;
	children: ReactNode;
	/** CSS color used for the active-state indicator badge. */
	accentColor?: string;
	/** Optional absolute positioning override for the modulation badge. */
	iconButtonStyle?: React.CSSProperties;
}

/** Panel dimensions used for edge-flip calculation. */
const PANEL_WIDTH = 560;
const PANEL_HEIGHT_ESTIMATE = 360;
const VIEWPORT_GAP = 12;

/**
 * Wraps any synth control (knob, slider) with a modulation indicator badge
 * and an affordance to add/edit/remove mod-matrix routes for the control's
 * destination.
 */
const ModulatableControl = memo(function ModulatableControl({
	destinationId,
	label,
	children,
	accentColor,
	iconButtonStyle,
}: ModulatableControlProps) {
	const { modMatrix, setModMatrix } = useModMatrix();
	const { modMode, modulationTargetState, isTargeted, onTarget, onClose } =
		useModulationTarget({
			destination: destinationId,
		});
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({
		position: "fixed",
		zIndex: 9999,
		top: 0,
		left: 0,
		maxWidth: `calc(100vw - ${VIEWPORT_GAP * 2}px)`,
		maxHeight: `calc(100vh - ${VIEWPORT_GAP * 2}px)`,
	});
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const panelRef = useRef<HTMLDivElement | null>(null);
	const routes = modMatrix.routes ?? [];
	const [highlightedSource, setHighlightedSource] = useState<ModSource | null>(
		null,
	);

	const activeRoutes = useMemo(
		() => routes.filter((r) => r.destination === destinationId),
		[routes, destinationId],
	);

	const handleAddRoute = useCallback(
		(source: ModSource) => {
			const existingRoute = routes.find(
				(route) =>
					route.destination === destinationId && route.source === source,
			);
			if (existingRoute) {
				setHighlightedSource(source);
				return;
			}

			const newRoute: ModRoute = {
				source,
				destination: destinationId,
				amount: 0.5,
				enabled: true,
			};
			setModMatrix({ routes: [...routes, newRoute] });
			setHighlightedSource(source);
		},
		[routes, destinationId, setModMatrix],
	);

	const handleRemoveRoute = useCallback(
		(index: number) => {
			let destinationIndex = -1;
			const globalIndex = routes.findIndex((r) => {
				if (r.destination !== destinationId) {
					return false;
				}
				destinationIndex += 1;
				return destinationIndex === index;
			});
			if (globalIndex < 0) return;
			const next = [...routes];
			next.splice(globalIndex, 1);
			setModMatrix({ routes: next });
			setHighlightedSource(null);
		},
		[routes, destinationId, setModMatrix],
	);

	const handleAmountChange = useCallback(
		(index: number, amount: number) => {
			let destIdx = -1;
			const next = routes.map((r) => {
				if (r.destination === destinationId) {
					destIdx++;
					if (destIdx === index) return { ...r, amount };
				}
				return r;
			});
			setModMatrix({ routes: next });
		},
		[routes, destinationId, setModMatrix],
	);

	const handleToggleEnabled = useCallback(
		(index: number) => {
			let destIdx = -1;
			const next = routes.map((r) => {
				if (r.destination === destinationId) {
					destIdx++;
					if (destIdx === index) return { ...r, enabled: !r.enabled };
				}
				return r;
			});
			setModMatrix({ routes: next });
		},
		[routes, destinationId, setModMatrix],
	);

	const hasActiveRoutes = activeRoutes.length > 0;

	/** Compute viewport-fixed panel position from the control wrapper. */
	const openPopover = useCallback(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper) {
			setPopoverOpen(true);
			return;
		}
		const r = wrapper.getBoundingClientRect();
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const openRight = r.right + VIEWPORT_GAP + PANEL_WIDTH <= vw;
		const unclampedLeft = openRight
			? r.right + VIEWPORT_GAP
			: r.left - PANEL_WIDTH - VIEWPORT_GAP;
		const openBelow = r.bottom + VIEWPORT_GAP + PANEL_HEIGHT_ESTIMATE <= vh;
		const unclampedTop = openBelow
			? r.bottom + VIEWPORT_GAP
			: r.top - PANEL_HEIGHT_ESTIMATE - VIEWPORT_GAP;

		setPanelStyle({
			position: "fixed",
			zIndex: 9999,
			left: Math.max(VIEWPORT_GAP, unclampedLeft),
			top: Math.max(VIEWPORT_GAP, unclampedTop),
			maxWidth: `calc(100vw - ${VIEWPORT_GAP * 2}px)`,
			maxHeight: `calc(100vh - ${VIEWPORT_GAP * 2}px)`,
		});
		setPopoverOpen(true);
	}, []);

	const clampPanelToViewport = useCallback(() => {
		const panel = panelRef.current;
		if (!panel) {
			return;
		}

		const rect = panel.getBoundingClientRect();
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const maxLeft = Math.max(VIEWPORT_GAP, vw - rect.width - VIEWPORT_GAP);
		const maxTop = Math.max(VIEWPORT_GAP, vh - rect.height - VIEWPORT_GAP);

		setPanelStyle((current) => ({
			...current,
			left: Math.min(
				Math.max(VIEWPORT_GAP, Number(current.left ?? 0)),
				maxLeft,
			),
			top: Math.min(Math.max(VIEWPORT_GAP, Number(current.top ?? 0)), maxTop),
			maxWidth: `calc(100vw - ${VIEWPORT_GAP * 2}px)`,
			maxHeight: `calc(100vh - ${VIEWPORT_GAP * 2}px)`,
		}));
	}, []);

	const closePopover = useCallback(() => {
		setPopoverOpen(false);
		onClose();
		setHighlightedSource(null);
	}, [onClose]);

	const portalTarget =
		typeof document !== "undefined"
			? (document.fullscreenElement ?? document.body)
			: null;

	const shouldCaptureTargetEvent = useCallback((target: EventTarget | null) => {
		const node = target instanceof Node ? target : null;
		if (!node) {
			return false;
		}

		if (panelRef.current?.contains(node)) {
			return false;
		}

		return wrapperRef.current?.contains(node) ?? false;
	}, []);

	useEffect(() => {
		if (!isTargeted) {
			setPopoverOpen(false);
			setHighlightedSource(null);
			return;
		}
		openPopover();
	}, [isTargeted, openPopover]);

	useEffect(() => {
		if (!popoverOpen) {
			return;
		}

		const frame = window.requestAnimationFrame(() => {
			clampPanelToViewport();
		});

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closePopover();
			}
		};

		const onResize = () => {
			clampPanelToViewport();
		};

		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("resize", onResize);
		return () => {
			window.cancelAnimationFrame(frame);
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("resize", onResize);
		};
	}, [popoverOpen, closePopover, clampPanelToViewport]);

	// Close on outside click (capture phase so it fires before any bubbling stops)
	useEffect(() => {
		if (!popoverOpen) return;
		const handler = (e: PointerEvent) => {
			const target = e.target as Node | null;
			if (
				panelRef.current &&
				!panelRef.current.contains(target) &&
				wrapperRef.current &&
				!wrapperRef.current.contains(target)
			) {
				closePopover();
			}
		};
		document.addEventListener("pointerdown", handler, true);
		return () => document.removeEventListener("pointerdown", handler, true);
	}, [popoverOpen, closePopover]);

	return (
		<div
			ref={wrapperRef}
			className={`group relative inline-flex rounded-xl transition-all ${
				modulationTargetState === "targeted"
					? "ring-2 ring-cz-light-blue/90 ring-offset-2 ring-offset-cz-panel"
					: modulationTargetState === "available"
						? "ring-1 ring-cz-light-blue/28 ring-offset-1 ring-offset-transparent"
						: ""
			}`}
			onPointerDownCapture={(event) => {
				if (!modMode) {
					return;
				}
				if (!shouldCaptureTargetEvent(event.target)) {
					return;
				}
				event.preventDefault();
				event.stopPropagation();
				onTarget();
			}}
			onClickCapture={(event) => {
				if (!modMode) {
					return;
				}
				if (!shouldCaptureTargetEvent(event.target)) {
					return;
				}
				event.preventDefault();
				event.stopPropagation();
			}}
			onKeyDownCapture={(event) => {
				if (!modMode) {
					return;
				}
				if (!shouldCaptureTargetEvent(event.target)) {
					return;
				}
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					event.stopPropagation();
					onTarget();
				}
			}}
		>
			{children}
			{modMode && hasActiveRoutes ? (
				<div
					className="pointer-events-none absolute z-10 flex items-center gap-1 rounded-full border border-cz-light-blue/45 bg-cz-panel/92 px-1.5 py-0.5 font-mono text-[0.48rem] text-cz-light-blue shadow-lg"
					style={
						iconButtonStyle ?? {
							right: 2,
							top: 2,
						}
					}
				>
					<span
						className="h-1.5 w-1.5 rounded-full"
						style={{
							backgroundColor: accentColor ?? "var(--color-cz-light-blue)",
						}}
					/>
					<span>{activeRoutes.length}</span>
				</div>
			) : null}

			{portalTarget
				? createPortal(
						popoverOpen ? (
							<motion.div
								ref={panelRef}
								style={panelStyle}
								className="pointer-events-auto"
								initial={{ opacity: 0, scale: 0.92, y: -6 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
								onPointerDown={(event) => {
									event.stopPropagation();
								}}
								onClick={(event) => {
									event.stopPropagation();
								}}
							>
								<ModulationMenu
									title={label ?? destinationId}
									routes={activeRoutes}
									onToggleEnabled={handleToggleEnabled}
									onRemoveRoute={handleRemoveRoute}
									onAmountChange={handleAmountChange}
									onAddRoute={handleAddRoute}
									highlightedSource={highlightedSource}
									onClose={closePopover}
								/>
							</motion.div>
						) : null,
						portalTarget,
					)
				: null}
		</div>
	);
});

export default ModulatableControl;
