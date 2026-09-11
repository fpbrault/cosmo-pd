import {
	memo,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import Popover from "@/components/primitives/Popover";
import { useModMatrix } from "@/context/ModMatrixContext";
import { useModulationTarget } from "@/features/synth/hooks/useModulationTarget";
import type {
	ModDestination,
	ModRoute,
	ModSource,
} from "@/lib/synth/bindings/synth";
import ModulationMenu from "./ModulationMenu";

interface ModulatableControlProps {
	destinationId: ModDestination;
	label?: string;
	children: ReactNode;
	accentColor?: string;
	className?: string;
	iconButtonStyle?: React.CSSProperties;
}

const ModulatableControl = memo(function ModulatableControl({
	destinationId,
	label,
	children,
	accentColor,
	className = "",
	iconButtonStyle,
}: ModulatableControlProps) {
	const { modMatrix, setModMatrix } = useModMatrix();
	const { modMode, modulationTargetState, isTargeted, onTarget, onClose } =
		useModulationTarget({
			destination: destinationId,
		});
	const [popoverOpen, setPopoverOpen] = useState(false);
	const wrapperRef = useRef<HTMLDivElement | null>(null);
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
			setModMatrix({ ...modMatrix, routes: [...routes, newRoute] });
			setHighlightedSource(source);
		},
		[routes, destinationId, modMatrix, setModMatrix],
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
			setModMatrix({ ...modMatrix, routes: next });
			setHighlightedSource(null);
		},
		[routes, destinationId, modMatrix, setModMatrix],
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
			setModMatrix({ ...modMatrix, routes: next });
		},
		[routes, destinationId, modMatrix, setModMatrix],
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
			setModMatrix({ ...modMatrix, routes: next });
		},
		[routes, destinationId, modMatrix, setModMatrix],
	);

	const hasActiveRoutes = activeRoutes.length > 0;

	const openPopover = useCallback(() => {
		setPopoverOpen(true);
	}, []);

	const closePopover = useCallback(() => {
		setPopoverOpen(false);
		onClose();
		setHighlightedSource(null);
	}, [onClose]);

	const shouldCaptureTargetEvent = useCallback((target: EventTarget | null) => {
		const node = target instanceof Node ? target : null;
		if (!node) {
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

	return (
		<div
			ref={wrapperRef}
			className={`group relative inline-flex rounded-xl transition-all ${className} ${
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

			<Popover
				open={popoverOpen}
				onClose={closePopover}
				triggerRef={wrapperRef}
				role="dialog"
				ariaLabel={`Modulation for ${label ?? destinationId}`}
				placement="right"
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
			</Popover>
		</div>
	);
});

export default ModulatableControl;
