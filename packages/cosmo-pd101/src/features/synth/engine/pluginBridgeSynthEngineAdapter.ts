import { useCallback, useEffect, useRef } from "react";

import { useSynthStore } from "@/features/synth/synthStore";
import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";
import { sanitizeSynthParamsForEngine } from "@/lib/synth/fxSlotSanitizer";

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

type EnvelopeKind = "dco" | "dcw" | "dca";

type StepEnv = SynthPresetV1["params"]["line1"]["dcoEnv"];

const PARAMS_VERSION_POLL_INTERVAL_MS = 200;

function clampRounded(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, Math.round(value)));
}

function rawRateToHuman(kind: EnvelopeKind, raw: number): number {
	const b = clampRounded(raw, 0, 127);
	switch (kind) {
		case "dco":
			if (b === 0) return 0;
			if (b === 127) return 99;
			return Math.floor((b * 99) / 127) + 1;
		case "dcw":
			if (b <= 8) return 0;
			if (b >= 127) return 99;
			return Math.floor(((b - 8) * 99) / 119) + 1;
		case "dca":
			if (b === 0) return 0;
			if (b >= 119) return 99;
			return Math.floor((b * 99) / 119) + 1;
	}
}

function rawLevelToHuman(kind: EnvelopeKind, raw: number): number {
	const b = clampRounded(raw, 0, 127);
	switch (kind) {
		case "dco":
			return b > 63 ? b - 4 : b;
		case "dcw":
			if (b === 0) return 0;
			if (b === 127) return 99;
			return Math.floor((b * 99) / 127) + 1;
		case "dca":
			return b === 0 ? 0 : Math.max(0, b - 28);
	}
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
	const lastSeenParamsVersionRef = useRef<number | null>(null);
	const initialHydrationCompleteRef = useRef(false);

	const send = useCallback((params: SynthPresetV1["params"]) => {
		const sanitized = sanitizeSynthParamsForEngine(params);
		const json = JSON.stringify(sanitized);
		if (sentParamsRef.current === json) return;
		sentParamsRef.current = json;
		window.__czSetParams?.(sanitized);
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
				window.__czSetParams?.(sanitizeSynthParamsForEngine(uiParams));
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
				applyHostParams(params);
			} catch (e) {
				console.error("[PluginBridge] Failed to parse params from Rust:", e);
			}
		};
		return () => {
			window.__czOnParams = undefined;
		};
	}, [enabled, applyHostParams]);

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

	// Host automation and MIDI mappings can change plugin params without going
	// through React. Poll the cheap native version and hydrate only on changes.
	useEffect(() => {
		if (!enabled) return;
		let cancelled = false;
		let intervalId = 0;

		const parseVersion = (value: unknown) => {
			if (typeof value === "number" && Number.isFinite(value)) return value;
			if (typeof value === "string") {
				const parsed = Number(value);
				return Number.isFinite(parsed) ? parsed : null;
			}
			return null;
		};

		const refreshIfChanged = async () => {
			const getVersion = window.__czGetParamsVersion;
			const getParams = window.__czGetParams;
			if (!getVersion || !getParams) return;
			try {
				const version = parseVersion(await getVersion());
				if (version === null || version === lastSeenParamsVersionRef.current) {
					return;
				}
				lastSeenParamsVersionRef.current = version;
				const result = await getParams();
				if (cancelled || !result || typeof result !== "object") return;
				applyHostParams(result as SynthPresetV1["params"]);
				if (initialHydrationCompleteRef.current) {
					onExternalParamChange?.();
				}
			} catch {
				// The native bridge may not be ready during editor startup.
			}
		};

		intervalId = window.setInterval(() => {
			void refreshIfChanged();
		}, PARAMS_VERSION_POLL_INTERVAL_MS);
		void refreshIfChanged();

		return () => {
			cancelled = true;
			window.clearInterval(intervalId);
		};
	}, [enabled, applyHostParams, onExternalParamChange]);

	// Hydration: getParams from Rust once on mount
	useEffect(() => {
		if (!enabled) return;
		let cancelled = false;
		let retryCount = 0;
		const MAX_RETRIES = 10;
		const RETRY_DELAY_MS = 500;
		let retryId = 0;
		let fallbackId = 0;

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

		return () => {
			cancelled = true;
			window.clearTimeout(retryId);
			window.clearTimeout(fallbackId);
		};
	}, [enabled, applyHostParams]);

	const loadPresetData = useCallback(async (id: string): Promise<string> => {
		const result = await window.__czLoadPreset?.(id);
		const name = result?.presetName ?? "";
		if (name) {
			window.__czSetPresetName?.(name);
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
