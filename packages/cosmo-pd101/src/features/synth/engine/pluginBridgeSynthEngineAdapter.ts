import { useCallback, useEffect, useRef } from "react";

import { useSynthStore } from "@/features/synth/synthStore";
import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";
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

export type PluginPresetSession = {
	activePresetId: string | null;
	loadedPresetId?: string | null;
	activePresetNameBase: string;
	isDirty: boolean;
};

type StepEnv = SynthPresetV1["params"]["line1"]["dcoEnv"];

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
		line1.dcoEnv,
		line1.dcwEnv,
		line1.dcaEnv,
		line2.dcoEnv,
		line2.dcwEnv,
		line2.dcaEnv,
	];

	for (const envelope of envelopes) {
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
			dcoEnv: mapEnvelope(params.line1.dcoEnv, "dco"),
			dcwEnv: mapEnvelope(params.line1.dcwEnv, "dcw"),
			dcaEnv: mapEnvelope(params.line1.dcaEnv, "dca"),
		},
		line2: {
			...params.line2,
			dcoEnv: mapEnvelope(params.line2.dcoEnv, "dco"),
			dcwEnv: mapEnvelope(params.line2.dcwEnv, "dcw"),
			dcaEnv: mapEnvelope(params.line2.dcaEnv, "dca"),
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

		// Params-version polling fallback: poll ~18ms for native version bumps
		// (e.g., host MIDI mapping changes params). Only hydrate when version
		// changes, and never echo back to native.
		const startPolling = () => {
			const poll = () => {
				if (cancelled) return;
				const getParamsVersion = window.__czGetParamsVersion;
				const getParams = window.__czGetParams;
				if (getParamsVersion && getParams) {
					void getParamsVersion().then((version: number) => {
						if (cancelled) return;
						if (version !== lastParamsVersion) {
							lastParamsVersion = version;
							if (!applyingHostParamsRef.current) {
								void getParams().then((result) => {
									if (cancelled) return;
									applyResult(result);
								});
							}
						}
					});
				}
				if (!cancelled) {
					pollId = window.setTimeout(poll, 18);
				}
			};
			pollId = window.setTimeout(poll, 18);
		};
		startPolling();

		return () => {
			cancelled = true;
			window.clearTimeout(retryId);
			window.clearTimeout(fallbackId);
			window.clearTimeout(pollId);
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
