import { useCallback, useEffect, useRef } from "react";

import { useSynthStore } from "@/features/synth/synthStore";
import type { UiParamChange } from "@/lib/synth/bindings/plugin-bridge";
import type {
	EnvelopeProgramV1,
	StepEnvData,
	SynthPresetV1,
} from "@/lib/synth/bindings/synth";
import { sanitizeSynthParamsForEngine } from "@/lib/synth/fxSlotSanitizer";
import {
	type EnvelopeKind,
	rawLevelToHuman,
	rawRateToHuman,
} from "./envelopeConversion";

type UsePluginBridgeSynthEngineOptions = {
	enabled?: boolean;
	onExternalParamChange?: () => void;
};

declare global {
	interface Window {
		__czAuv3HostActive?: boolean;
	}
}

function isAuv3BridgeHostActive(): boolean {
	return window.__czAuv3HostActive !== false;
}

/**
 * Returns `true` only when the pending-param-changes IPC is actually supported
 * by the current bridge. AUv3 disables it (native does not implement the
 * method), so polling must not start — otherwise every animation frame issues a
 * failing IPC to an unknown native method.
 */
function supportsPendingParamChanges(): boolean {
	if (window.__czBridgeCapabilities?.__czGetPendingParamChanges === false) {
		return false;
	}
	return typeof window.__czGetPendingParamChanges === "function";
}

export type PluginPresetSession = {
	activePresetId: string | null;
	loadedPresetId?: string | null;
	activePresetNameBase: string;
	isDirty: boolean;
};

type StepEnv = StepEnvData;

function stepProgram(program: EnvelopeProgramV1): StepEnv | null {
	return program.type === "step" ? program.params : null;
}

function mapProgram(
	program: EnvelopeProgramV1,
	kind: EnvelopeKind,
): EnvelopeProgramV1 {
	const env = stepProgram(program);
	return env === null
		? program
		: { type: "step", params: mapEnvelope(env, kind) };
}

function mapEnvelope(env: StepEnv, kind: EnvelopeKind): StepEnv {
	return {
		...env,
		steps: env.steps.map((step) => ({
			...step,
			level: rawLevelToHuman(kind, step.level ?? 0),
			rate: rawRateToHuman(kind, step.rate ?? 0),
		})),
	};
}

function hasRawEnvelopeValues(params: SynthPresetV1["params"]): boolean {
	const line1 = params.line1;
	const line2 = params.line2;

	if (!line1 || !line2) {
		return false;
	}

	const envelopes = [
		line1.envelopes.pitch,
		line1.envelopes.timbre,
		line1.envelopes.amplitude,
		line2.envelopes.pitch,
		line2.envelopes.timbre,
		line2.envelopes.amplitude,
	];

	for (const program of envelopes) {
		const envelope = stepProgram(program);
		if (!envelope) continue;
		for (const step of envelope.steps) {
			if ((step.level ?? 0) > 99 || (step.rate ?? 0) > 99) {
				return true;
			}
		}
	}

	return false;
}

function normalizeHostParamsIfRaw(
	params: SynthPresetV1["params"],
): SynthPresetV1["params"] {
	if (!hasRawEnvelopeValues(params)) {
		return params;
	}

	return {
		...params,
		line1: {
			...params.line1,
			envelopes: {
				...params.line1.envelopes,
				pitch: mapProgram(params.line1.envelopes.pitch, "dco"),
				timbre: mapProgram(params.line1.envelopes.timbre, "dcw"),
				amplitude: mapProgram(params.line1.envelopes.amplitude, "dca"),
			},
		},
		line2: {
			...params.line2,
			envelopes: {
				...params.line2.envelopes,
				pitch: mapProgram(params.line2.envelopes.pitch, "dco"),
				timbre: mapProgram(params.line2.envelopes.timbre, "dcw"),
				amplitude: mapProgram(params.line2.envelopes.amplitude, "dca"),
			},
		},
	};
}

function normalizeHostParams(params: SynthPresetV1["params"]): {
	params: SynthPresetV1["params"];
	convertedRawEnvelopeValues: boolean;
} {
	if (!hasRawEnvelopeValues(params)) {
		return { params, convertedRawEnvelopeValues: false };
	}

	return {
		params: normalizeHostParamsIfRaw(params),
		convertedRawEnvelopeValues: true,
	};
}

export function usePluginBridgeSynthEngine(
	options: UsePluginBridgeSynthEngineOptions = {},
): {
	loadPresetData: (id: string) => Promise<string>;
	getPresetSession: () => Promise<PluginPresetSession | null>;
	setPresetSession: (session: PluginPresetSession) => Promise<void>;
} {
	const gatherState = useSynthStore((s) => s.gatherState);
	const applyPreset = useSynthStore((s) => s.applyPreset);
	const applyHostUiParamChanges = useSynthStore(
		(s) => s.applyHostUiParamChanges,
	);
	const enabled = options.enabled ?? true;
	const onExternalParamChange = options.onExternalParamChange;
	const outboundEnabledRef = useRef(false);
	const sentParamsRef = useRef("");
	const syncRef = useRef<(() => void) | null>(null);
	const applyingHostParamsRef = useRef(false);
	const initialHydrationCompleteRef = useRef(false);

	const send = useCallback((params: SynthPresetV1["params"]) => {
		const sanitized = sanitizeSynthParamsForEngine(params);
		const json = JSON.stringify(sanitized);
		if (sentParamsRef.current === json) return;
		sentParamsRef.current = json;
		void window.__czSetParams?.(sanitized);
	}, []);

	const applyHostParams = useCallback(
		(params: SynthPresetV1["params"]) => {
			const { params: uiParams, convertedRawEnvelopeValues } =
				normalizeHostParams(params);
			const sanitizedJson = JSON.stringify(
				sanitizeSynthParamsForEngine(uiParams),
			);
			sentParamsRef.current = sanitizedJson;
			applyingHostParamsRef.current = true;
			try {
				applyPreset({ schemaVersion: 1, params: uiParams });
			} finally {
				applyingHostParamsRef.current = false;
			}
			outboundEnabledRef.current = true;
			if (convertedRawEnvelopeValues) {
				void window.__czSetParams?.(sanitizeSynthParamsForEngine(uiParams));
			}
		},
		[applyPreset],
	);

	const applyNativeUiParamChanges = useCallback(
		(changes: UiParamChange[]) => {
			if (changes.length === 0) return;
			applyingHostParamsRef.current = true;
			try {
				applyHostUiParamChanges(changes);
			} finally {
				applyingHostParamsRef.current = false;
			}
			if (initialHydrationCompleteRef.current) {
				onExternalParamChange?.();
			}
		},
		[applyHostUiParamChanges, onExternalParamChange],
	);

	// Inbound: Rust → React state
	useEffect(() => {
		if (!enabled) return;
		window.__czOnParams = (json: string) => {
			try {
				const params = JSON.parse(json) as SynthPresetV1["params"];
				const incomingJson = JSON.stringify(
					sanitizeSynthParamsForEngine(params),
				);
				const externallyChanged = incomingJson !== sentParamsRef.current;
				applyHostParams(params);
				if (externallyChanged && initialHydrationCompleteRef.current) {
					onExternalParamChange?.();
				}
			} catch (e) {
				console.error("[PluginBridge] Failed to parse params from Rust:", e);
			}
		};
		return () => {
			window.__czOnParams = undefined;
		};
	}, [enabled, applyHostParams, onExternalParamChange]);

	// Native-origin param changes via push (cz-param-changes event)
	useEffect(() => {
		if (!enabled) return;
		const handler = (event: Event) => {
			if (applyingHostParamsRef.current) return;
			const changes = (event as CustomEvent).detail as
				| UiParamChange[]
				| undefined;
			if (!changes) return;
			applyNativeUiParamChanges(changes);
		};
		window.addEventListener("cz-param-changes", handler);
		return () => window.removeEventListener("cz-param-changes", handler);
	}, [enabled, applyNativeUiParamChanges]);

	// Native-origin param changes via IPC pull (rAF).
	// Independent of host idle() cadence for lower-latency knob updates.
	// Only starts when the bridge explicitly supports getPendingParamChanges —
	// AUv3 disables it (native does not implement the method), so polling must
	// not start, otherwise every frame issues a failing IPC call.
	useEffect(() => {
		if (!enabled) return;
		if (!supportsPendingParamChanges()) return;
		let rafId = 0;
		let inFlight = false;
		let cancelled = false;
		let paused = !isAuv3BridgeHostActive();
		const schedule = () => {
			if (!cancelled && !paused && rafId === 0) {
				rafId = requestAnimationFrame(poll);
			}
		};
		const poll = () => {
			rafId = 0;
			if (cancelled) return;
			if (paused || !isAuv3BridgeHostActive()) return;
			if (!supportsPendingParamChanges()) return;
			const getPendingParamChanges = window.__czGetPendingParamChanges;
			if (
				getPendingParamChanges &&
				!inFlight &&
				!applyingHostParamsRef.current
			) {
				inFlight = true;
				void getPendingParamChanges()
					.then((changes) => {
						if (cancelled) return;
						if (changes && changes.length > 0) {
							applyNativeUiParamChanges(changes);
						}
					})
					.catch(() => {
						// native bridge may be unavailable during startup/shutdown
					})
					.finally(() => {
						inFlight = false;
					});
			}
			schedule();
		};
		const pause = () => {
			paused = true;
			if (rafId !== 0) {
				cancelAnimationFrame(rafId);
				rafId = 0;
			}
		};
		const resume = () => {
			paused = false;
			schedule();
		};
		window.addEventListener("cz-auv3-host-inactive", pause);
		window.addEventListener("cz-auv3-host-active", resume);
		schedule();
		return () => {
			cancelled = true;
			cancelAnimationFrame(rafId);
			window.removeEventListener("cz-auv3-host-inactive", pause);
			window.removeEventListener("cz-auv3-host-active", resume);
		};
	}, [enabled, applyNativeUiParamChanges]);

	// Outbound: React state → Rust
	useEffect(() => {
		if (!enabled) return;
		const sync = () => {
			if (applyingHostParamsRef.current) return;
			if (!outboundEnabledRef.current) return;
			send(gatherState().params);
		};
		syncRef.current = sync;
		const unsubscribe = useSynthStore.subscribe(sync);
		return () => {
			syncRef.current = null;
			unsubscribe();
		};
	}, [enabled, gatherState, send]);

	// Hydration: getParams from Rust once on mount
	useEffect(() => {
		if (!enabled) return;
		let cancelled = false;
		let paramsVersionPollingPaused = !isAuv3BridgeHostActive();
		let retryCount = 0;
		const MAX_RETRIES = 10;
		const RETRY_DELAY_MS = 500;
		let retryId = 0;
		let fallbackId = 0;
		let pollId = 0;
		let lastParamsVersion = 0;

		const applyResult = (result: unknown) => {
			if (result && typeof result === "object") {
				try {
					applyHostParams(result as SynthPresetV1["params"]);
				} catch {
					// Partial/empty params — ignore, keep current UI state.
				}
			}
		};

		const tryGetParams = () => {
			if (cancelled) return;
			const getParams = window.__czGetParams;
			if (!getParams) {
				// Bridge not ready yet — retry.
				retryCount++;
				// Open the gate so controls work immediately while we wait.
				if (!outboundEnabledRef.current) {
					outboundEnabledRef.current = true;
				}
				if (retryCount <= MAX_RETRIES) {
					retryId = window.setTimeout(tryGetParams, RETRY_DELAY_MS);
				} else {
					window.clearTimeout(fallbackId);
				}
				return;
			}
			void getParams()
				.then((result) => {
					window.clearTimeout(fallbackId);
					if (cancelled) return;
					applyResult(result);
					initialHydrationCompleteRef.current = true;
				})
				.catch((error) => {
					if (cancelled) return;
					retryCount++;
					if (retryCount <= MAX_RETRIES) {
						console.warn(
							`[PluginBridge] getParams failed (attempt ${retryCount}/${MAX_RETRIES}):`,
							error,
						);
						// Open the gate so controls work immediately while we retry.
						if (!outboundEnabledRef.current) {
							outboundEnabledRef.current = true;
						}
						retryId = window.setTimeout(tryGetParams, RETRY_DELAY_MS);
					} else {
						window.clearTimeout(fallbackId);
						console.error(
							"[PluginBridge] getParams failed after all retries:",
							error,
						);
						if (!outboundEnabledRef.current) {
							outboundEnabledRef.current = true;
						}
					}
				});
		};

		// Safety fallback: open the outbound gate after 10 s no matter what.
		fallbackId = window.setTimeout(() => {
			if (!cancelled && !outboundEnabledRef.current) {
				console.warn(
					"[PluginBridge] getParams timed out — opening outbound gate anyway",
				);
				outboundEnabledRef.current = true;
				syncRef.current?.();
			}
		}, 10000);

		tryGetParams();

		// Params-version polling fallback: poll ~200ms for native version bumps
		// (e.g., host MIDI mapping changes params). Only hydrate when version
		// changes, and never echo back to native.
		const pollParamsVersion = () => {
			if (cancelled || paramsVersionPollingPaused) return;
			const getParamsVersion = window.__czGetParamsVersion;
			const getParams = window.__czGetParams;
			if (getParamsVersion && getParams) {
				void getParamsVersion()
					.then((version: number) => {
						if (cancelled || paramsVersionPollingPaused) return;
						if (version !== lastParamsVersion) {
							lastParamsVersion = version;
							if (!applyingHostParamsRef.current) {
								void getParams()
									.then((result) => {
										if (cancelled || paramsVersionPollingPaused) return;
										applyResult(result);
									})
									.catch(() => {
										// native bridge may be unavailable during sleep/resume
									});
							}
						}
					})
					.catch(() => {
						// native bridge may be unavailable during sleep/resume
					})
					.finally(() => {
						if (!cancelled && !paramsVersionPollingPaused) {
							pollId = window.setTimeout(pollParamsVersion, 200);
						}
					});
				return;
			}
			if (!cancelled && !paramsVersionPollingPaused) {
				pollId = window.setTimeout(pollParamsVersion, 200);
			}
		};
		const startParamsVersionPolling = () => {
			if (cancelled || paramsVersionPollingPaused) return;
			window.clearTimeout(pollId);
			pollId = window.setTimeout(pollParamsVersion, 200);
		};
		const pauseParamsVersionPolling = () => {
			paramsVersionPollingPaused = true;
			window.clearTimeout(pollId);
			pollId = 0;
		};
		const resumeParamsVersionPolling = () => {
			paramsVersionPollingPaused = false;
			startParamsVersionPolling();
		};
		window.addEventListener("cz-auv3-host-inactive", pauseParamsVersionPolling);
		window.addEventListener("cz-auv3-host-active", resumeParamsVersionPolling);
		startParamsVersionPolling();

		return () => {
			cancelled = true;
			window.clearTimeout(retryId);
			window.clearTimeout(fallbackId);
			window.clearTimeout(pollId);
			window.removeEventListener(
				"cz-auv3-host-inactive",
				pauseParamsVersionPolling,
			);
			window.removeEventListener(
				"cz-auv3-host-active",
				resumeParamsVersionPolling,
			);
		};
	}, [enabled, applyHostParams]);

	const loadPresetData = useCallback(async (id: string): Promise<string> => {
		const result = await window.__czLoadPreset?.(id);
		const name = result?.presetName ?? "";
		if (name) {
			void window.__czSetPresetName?.(name);
		}
		return name;
	}, []);

	const getPresetSession =
		useCallback(async (): Promise<PluginPresetSession | null> => {
			const result = await window.__czGetPresetSession?.();
			if (!result) {
				return null;
			}
			const loadedPresetId =
				typeof result.loadedPresetId === "string"
					? result.loadedPresetId
					: null;
			return {
				activePresetId: loadedPresetId,
				loadedPresetId,
				activePresetNameBase: result.activePresetNameBase,
				isDirty: result.isDirty ?? false,
			};
		}, []);

	const setPresetSession = useCallback(
		async (session: PluginPresetSession): Promise<void> => {
			await window.__czSetPresetSession?.({
				loadedPresetId: session.activePresetId,
				activePresetNameBase: session.activePresetNameBase,
				isDirty: session.isDirty,
			});
		},
		[],
	);

	return { loadPresetData, getPresetSession, setPresetSession };
}
