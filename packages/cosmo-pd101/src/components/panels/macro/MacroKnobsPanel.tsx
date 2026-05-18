import {
	memo,
	type PointerEvent as ReactPointerEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { ControlKnob } from "@/components/controls/ControlKnob";
import { useSynthStore } from "@/features/synth/synthStore";

function useMacroValue(index: number): number {
	return useSynthStore((s) => {
		if (index === 0) return s.macro1;
		if (index === 1) return s.macro2;
		if (index === 2) return s.macro3;
		return s.macro4;
	});
}

function useMacroSetter(index: number): (v: number) => void {
	return useSynthStore((s) => {
		if (index === 0) return s.setMacro1;
		if (index === 1) return s.setMacro2;
		if (index === 2) return s.setMacro3;
		return s.setMacro4;
	});
}

const MACRO_PANEL_LEFT_KEY = "cz101-macro-panel-left";

type MacroKnobsPanelProps = {
	keyboardVisible: boolean;
};

export default memo(function MacroKnobsPanel({
	keyboardVisible,
}: MacroKnobsPanelProps) {
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [leftPx, setLeftPx] = useState(0);
	const labels = useSynthStore((s) => s.macroLabels);
	const setMacroLabel = useSynthStore((s) => s.setMacroLabel);
	const panelRef = useRef<HTMLDivElement | null>(null);
	const dragStateRef = useRef<{
		pointerId: number;
		startX: number;
		startLeft: number;
	} | null>(null);

	const clampLeft = useCallback((value: number) => {
		const panelWidth = panelRef.current?.offsetWidth ?? 0;
		const parentWidth =
			panelRef.current?.offsetParent instanceof HTMLElement
				? panelRef.current.offsetParent.clientWidth
				: window.innerWidth;
		const maxLeft = Math.max(0, parentWidth - panelWidth - 8);
		return Math.max(0, Math.min(value, maxLeft));
	}, []);

	useEffect(() => {
		const raw = window.localStorage.getItem(MACRO_PANEL_LEFT_KEY);
		if (!raw) return;
		const parsed = Number(raw);
		if (Number.isFinite(parsed)) {
			setLeftPx(clampLeft(parsed));
		}
	}, [clampLeft]);

	useEffect(() => {
		window.localStorage.setItem(
			MACRO_PANEL_LEFT_KEY,
			String(Math.round(leftPx)),
		);
	}, [leftPx]);

	useEffect(() => {
		const handleResize = () => {
			setLeftPx((current) => clampLeft(current));
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [clampLeft]);

	const handlePointerDown = useCallback(
		(event: ReactPointerEvent<HTMLButtonElement>) => {
			const target = event.currentTarget;
			target.setPointerCapture(event.pointerId);
			dragStateRef.current = {
				pointerId: event.pointerId,
				startX: event.clientX,
				startLeft: leftPx,
			};
		},
		[leftPx],
	);

	const handlePointerMove = useCallback(
		(event: ReactPointerEvent<HTMLButtonElement>) => {
			const dragState = dragStateRef.current;
			if (!dragState || dragState.pointerId !== event.pointerId) return;
			const delta = event.clientX - dragState.startX;
			setLeftPx(clampLeft(dragState.startLeft + delta));
		},
		[clampLeft],
	);

	const handlePointerUp = useCallback(
		(event: ReactPointerEvent<HTMLButtonElement>) => {
			const dragState = dragStateRef.current;
			if (!dragState || dragState.pointerId !== event.pointerId) return;
			dragStateRef.current = null;
			if (event.currentTarget.hasPointerCapture(event.pointerId)) {
				event.currentTarget.releasePointerCapture(event.pointerId);
			}
		},
		[],
	);

	return (
		<div
			ref={panelRef}
			className={`absolute z-30 w-[20rem] ${keyboardVisible ? "bottom-[10rem]" : "bottom-10"}`}
			style={{ left: `${Math.round(leftPx)}px` }}
		>
			<div className="overflow-hidden rounded-t-lg border border-cz-border/70 border-b-0 bg-cz-surface/95 shadow-lg backdrop-blur-sm">
				<div className="flex items-center justify-between border-cz-border/60 border-b px-2 py-1">
					<div className="flex items-center gap-1.5">
						<button
							type="button"
							className="btn btn-ghost btn-xs h-6 min-h-0 w-6 cursor-move p-0 text-cz-cream/80"
							aria-label="Drag macro panel"
							onPointerDown={handlePointerDown}
							onPointerMove={handlePointerMove}
							onPointerUp={handlePointerUp}
							onPointerCancel={handlePointerUp}
						>
							<svg
								viewBox="0 0 16 16"
								className="h-3.5 w-3.5 fill-current"
								aria-hidden="true"
								focusable="false"
							>
								<circle cx="5" cy="4" r="1.1" />
								<circle cx="11" cy="4" r="1.1" />
								<circle cx="5" cy="8" r="1.1" />
								<circle cx="11" cy="8" r="1.1" />
								<circle cx="5" cy="12" r="1.1" />
								<circle cx="11" cy="12" r="1.1" />
							</svg>
						</button>
						<span className="font-mono text-2xs text-cz-cream-dim uppercase tracking-[0.16em]">
							Macro Controls
						</span>
					</div>
					<div className="flex items-center gap-0.5">
						<button
							type="button"
							className="btn btn-ghost btn-xs h-6 min-h-0 w-6 p-0 text-cz-cream/90"
							onClick={() => setSettingsOpen((v) => !v)}
							aria-label={
								settingsOpen ? "Hide macro labels" : "Edit macro labels"
							}
						>
							<svg
								viewBox="0 0 24 24"
								className="h-3.5 w-3.5 fill-none stroke-current"
								aria-hidden="true"
								focusable="false"
							>
								<path
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M9.6 3.2h4.8l.5 2.1a6.8 6.8 0 0 1 1.7.98l2.03-.78 2.4 4.15-1.56 1.48c.06.29.09.58.09.88 0 .3-.03.6-.09.88l1.56 1.48-2.4 4.15-2.03-.78c-.53.4-1.1.73-1.7.98l-.5 2.1H9.6l-.5-2.1a6.8 6.8 0 0 1-1.7-.98l-2.03.78-2.4-4.15 1.56-1.48a4.7 4.7 0 0 1 0-1.76L2.97 9.66l2.4-4.15 2.03.78c.53-.4 1.1-.73 1.7-.98l.5-2.1Z"
								/>
								<circle cx="12" cy="12" r="2.6" strokeWidth="1.8" />
							</svg>
						</button>
						<button
							type="button"
							className="btn btn-ghost btn-xs h-6 min-h-0 w-6 p-0 text-cz-cream/90"
							onClick={() => setCollapsed((v) => !v)}
							aria-label={
								collapsed ? "Expand macro panel" : "Collapse macro panel"
							}
						>
							<svg
								viewBox="0 0 24 24"
								className="h-3.5 w-3.5 fill-none stroke-current"
								aria-hidden="true"
								focusable="false"
							>
								<path
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
									d={collapsed ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"}
								/>
							</svg>
						</button>
					</div>
				</div>
				<div
					className={`grid transition-all duration-200 ease-out ${
						collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
					}`}
				>
					<div className="overflow-hidden">
						<div className="grid grid-cols-2 gap-1.5 px-2 py-1.5">
							{[0, 1, 2, 3].map((idx) => (
								<MacroKnob key={idx} macroIndex={idx} label={labels[idx]} />
							))}
						</div>
						<div
							className={`grid transition-all duration-200 ease-out ${
								settingsOpen
									? "grid-rows-[1fr] border-cz-border/60 border-t"
									: "grid-rows-[0fr]"
							}`}
						>
							<div className="overflow-hidden">
								<div className="grid grid-cols-2 gap-2 p-2">
									{[0, 1, 2, 3].map((idx) => (
										<label
											key={`macro-label-${idx}`}
											className="flex flex-col gap-1 font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.12em]"
										>
											Macro {idx + 1}
											<input
												type="text"
												className="input input-xs w-full border-cz-border bg-cz-inset font-mono text-2xs text-cz-cream"
												maxLength={18}
												value={labels[idx]}
												onChange={(event) =>
													setMacroLabel(idx, event.currentTarget.value)
												}
											/>
										</label>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

type MacroKnobProps = {
	macroIndex: number;
	label: string;
};

const MacroKnob = memo(function MacroKnob({
	macroIndex,
	label,
}: MacroKnobProps) {
	const value = useMacroValue(macroIndex);
	const setter = useMacroSetter(macroIndex);

	const handleChange = useCallback(
		(v: number) => {
			setter(v);
			window.dispatchEvent(
				new CustomEvent("cz-macro-value", {
					detail: { index: macroIndex, value: v },
				}),
			);
		},
		[setter, macroIndex],
	);

	return (
		<div className="relative flex flex-col items-center gap-0.5">
			<ControlKnob
				value={value}
				onChange={handleChange}
				min={0}
				max={1}
				label={label}
				variant="accent"
				size={60}
				valueFormatter={(v) => (v * 100).toFixed(0)}
				valueVisibility="hover"
			/>
		</div>
	);
});
