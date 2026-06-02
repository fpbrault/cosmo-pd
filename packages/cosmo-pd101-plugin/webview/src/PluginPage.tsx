import {
	computeRendererFrameLayout,
	SYNTH_RENDERER_DESIGN_HEIGHT,
	SYNTH_RENDERER_MIN_ASPECT_RATIO,
	SynthRenderer,
	useSynthPresetManager,
	useSynthStore,
	useSynthUiStore,
} from "@cosmo/cosmo-pd101";
import {
	type CSSProperties,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { usePluginParamBridge } from "./hooks/usePluginParamBridge";
import { usePluginSynthRuntime } from "./hooks/usePluginSynthRuntime";

type PluginPageProps = {
	utilityExtra?: ReactNode;
};

const MIN_PLUGIN_KEYBOARD_HEIGHT = 64;
const MAX_PLUGIN_KEYBOARD_HEIGHT = 160;
const MAX_KEYBOARD_VIEWPORT_RATIO = 0.28;

export function clampPluginKeyboardHeight({
	keyboardHeight,
	viewportHeight,
	frameScale,
}: {
	keyboardHeight: number;
	viewportHeight: number;
	frameScale: number;
}) {
	const scaledViewportMax =
		frameScale > 0
			? Math.floor((viewportHeight * MAX_KEYBOARD_VIEWPORT_RATIO) / frameScale)
			: MAX_PLUGIN_KEYBOARD_HEIGHT;
	const maxHeight = Math.max(
		MIN_PLUGIN_KEYBOARD_HEIGHT,
		Math.min(MAX_PLUGIN_KEYBOARD_HEIGHT, scaledViewportMax),
	);
	return Math.round(
		Math.max(MIN_PLUGIN_KEYBOARD_HEIGHT, Math.min(maxHeight, keyboardHeight)),
	);
}

export default function PluginPage({ utilityExtra }: PluginPageProps = {}) {
	const isIosHost = window.__czHostPlatform === "ios";
	const isLikelyIosDevice =
		/iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
		(window.navigator.platform === "MacIntel" &&
			window.navigator.maxTouchPoints > 1);
	const gatherState = useSynthStore((s) => s.gatherState);
	const applyPreset = useSynthStore((s) => s.applyPreset);
	const keyboardHeight = useSynthUiStore((s) => s.keyboardHeight);
	const setKeyboardHeight = useSynthUiStore((s) => s.setKeyboardHeight);

	const frameRef = useRef<HTMLDivElement | null>(null);
	const [rendererFrame, setRendererFrame] = useState(() =>
		computeRendererFrameLayout({
			availableWidth:
				SYNTH_RENDERER_DESIGN_HEIGHT * SYNTH_RENDERER_MIN_ASPECT_RATIO,
			availableHeight: SYNTH_RENDERER_DESIGN_HEIGHT,
			targetAspectRatio: SYNTH_RENDERER_MIN_ASPECT_RATIO,
		}),
	);
	const sendNativeEngineEvent = useCallback(
		(type: string, payload: Record<string, unknown>) => {
			window.ipc?.postMessage(
				JSON.stringify({ id: 0, method: type, args: [payload] }),
			);
		},
		[],
	);
	const runtime = usePluginSynthRuntime({ eventSink: sendNativeEngineEvent });

	const syncInstanceBRef =
		useRef<(name: string, options?: { isDirty?: boolean }) => void>();
	const [presetSession, setPresetSession] = useState<{
		activePresetId: string | null;
		activePresetNameBase: string;
		isDirty: boolean;
	}>({
		activePresetId: null,
		activePresetNameBase: "Current State",
		isDirty: false,
	});
	const presetSessionRef = useRef(presetSession);
	useEffect(() => {
		presetSessionRef.current = presetSession;
	}, [presetSession]);
	const {
		loadPresetData,
		getPresetSession,
		setPresetSession: persistPresetSession,
	} = usePluginParamBridge({
		onExternalParamChange: () => {
			setPresetSession((current) =>
				current.isDirty ? current : { ...current, isDirty: true },
			);
			syncInstanceBRef.current?.(
				presetSessionRef.current.activePresetNameBase,
				{
					isDirty: true,
				},
			);
		},
	});

	useEffect(() => {
		const element = frameRef.current;
		if (!element) {
			return;
		}

		const updateFrameSize = () => {
			const bounds = element.getBoundingClientRect();
			if (bounds.width <= 0 || bounds.height <= 0) {
				return;
			}

			const targetAspectRatio =
				isIosHost || isLikelyIosDevice
					? undefined
					: SYNTH_RENDERER_MIN_ASPECT_RATIO;
			const nextLayout = computeRendererFrameLayout({
				availableWidth: bounds.width,
				availableHeight: bounds.height,
				targetAspectRatio,
			});
			if (!nextLayout) {
				return;
			}

			const clampedKeyboardHeight = clampPluginKeyboardHeight({
				keyboardHeight,
				viewportHeight: bounds.height,
				frameScale: nextLayout.frameScale,
			});
			if (clampedKeyboardHeight !== keyboardHeight) {
				setKeyboardHeight(clampedKeyboardHeight);
			}

			setRendererFrame((current) => {
				if (
					current &&
					Math.abs(current.frameWidth - nextLayout.frameWidth) < 0.5 &&
					Math.abs(current.frameHeight - nextLayout.frameHeight) < 0.5 &&
					Math.abs(current.frameScale - nextLayout.frameScale) < 0.001
				) {
					return current;
				}
				return nextLayout;
			});
		};

		updateFrameSize();
		window.addEventListener("resize", updateFrameSize);

		const resizeObserver = new ResizeObserver(updateFrameSize);
		resizeObserver.observe(element);

		return () => {
			resizeObserver.disconnect();
			window.removeEventListener("resize", updateFrameSize);
		};
	}, [isIosHost, isLikelyIosDevice, keyboardHeight, setKeyboardHeight]);

	const handlePluginPresetSessionChange = useCallback(
		(session: {
			activePresetId: string | null;
			activePresetNameBase: string;
			isDirty: boolean;
		}) => {
			setPresetSession(session);
			void persistPresetSession(session);
		},
		[persistPresetSession],
	);

	const onLoadPresetData = useCallback(
		async (id: string) => {
			const name = await loadPresetData(id);
			return name;
		},
		[loadPresetData],
	);

	const { handleSyncPresetSelection } = useSynthPresetManager({
		gatherPresetState: gatherState,
		applyPreset,
		libraryPresets: [],
		onLoadPresetData,
		initialIsPresetDirty: presetSession.isDirty,
	});

	useEffect(() => {
		window.__czOnHostPresetSelected = (name: string) => {
			handleSyncPresetSelection(name, { isDirty: false });
			syncInstanceBRef.current?.(name, { isDirty: false });
		};
		return () => {
			window.__czOnHostPresetSelected = undefined;
		};
	}, [handleSyncPresetSelection]);

	useEffect(() => {
		const restore = async () => {
			const session = await getPresetSession();
			if (
				session?.activePresetNameBase &&
				session.activePresetNameBase !== "Current State"
			) {
				setPresetSession(session);
				syncInstanceBRef.current?.(session.activePresetNameBase, {
					isDirty: session.isDirty,
				});
			}
		};
		void restore();
	}, [getPresetSession]);

	useEffect(() => {
		const fetchLibrary = async () => {
			const result = await window.__czGetPresetLibrary?.();
			if (
				result &&
				typeof result === "object" &&
				"entries" in (result as Record<string, unknown>)
			) {
				console.log("[PluginPage] fetched preset library", result);
			}
		};
		fetchLibrary().catch(() => {
			// Plugin bridge may not be ready yet.
		});
	}, []);

	const combinedScale = rendererFrame?.frameScale ?? 1;
	const frameWidth =
		rendererFrame?.frameWidth ??
		SYNTH_RENDERER_DESIGN_HEIGHT * SYNTH_RENDERER_MIN_ASPECT_RATIO;
	const frameHeight =
		rendererFrame?.frameHeight ?? SYNTH_RENDERER_DESIGN_HEIGHT;
	const sidebarMinWidthRem = rendererFrame?.sidebarMinWidthRem ?? 18;
	const scaledWidth = frameWidth * combinedScale;
	const scaledHeight = frameHeight * combinedScale;

	const zoomStyle: CSSProperties = {
		width: frameWidth,
		height: frameHeight,
		transform: `scale(${combinedScale})`,
		transformOrigin: "top left",
	};

	return (
		<div
			ref={frameRef}
			className="relative flex h-full w-full items-center justify-center overflow-hidden bg-cz-panel"
		>
			<div
				className="relative shrink-0 overflow-hidden"
				style={{
					width: scaledWidth,
					height: scaledHeight,
				}}
			>
				<div className="absolute top-0 left-0" style={zoomStyle}>
					<SynthRenderer
						runtime={runtime}
						bottomBarExtra={utilityExtra}
						disableAudioGate
						sidebarMinWidthRem={sidebarMinWidthRem}
						miniKeyboard={{
							activeNotes: runtime.activeNotes,
							onNoteOn: runtime.sendNoteOn,
							onNoteOff: runtime.sendNoteOff,
							onPolyAftertouch: runtime.sendPolyAftertouch,
						}}
						onInitPresetSession={(fn) => {
							syncInstanceBRef.current = fn;
						}}
						onPresetSessionChange={handlePluginPresetSessionChange}
					/>
				</div>
			</div>
		</div>
	);
}
