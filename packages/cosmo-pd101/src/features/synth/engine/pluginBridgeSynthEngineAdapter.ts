import { useCallback, useEffect, useRef } from "react";

import { useSynthStore } from "@/features/synth/synthStore";
import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";

declare global {
	interface Window {
		ipc?: { postMessage: (message: string) => void };
		__czOnParams?: (json: string) => void;
		__czGetParams?: () => Promise<unknown>;
		__czSetParams?: (json: string) => void;
	}
}

type UsePluginBridgeSynthEngineOptions = {
	enabled?: boolean;
};

type EnvelopeKind = "dco" | "dcw" | "dca";

type StepEnv = SynthPresetV1["params"]["line1"]["dcoEnv"];

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
	if (!("steps" in env)) return env;
	return {
		...env,
		steps: env.steps.map((step) => ({
			...step,
			level: rawLevelToHuman(kind, step.level),
			rate: rawRateToHuman(kind, step.rate),
		})),
	};
}

function hasRawEnvelopeValues(params: SynthPresetV1["params"]): boolean {
	const envelopes = [
		params.line1.dcoEnv,
		params.line1.dcwEnv,
		params.line1.dcaEnv,
		params.line2.dcoEnv,
		params.line2.dcwEnv,
		params.line2.dcaEnv,
	];

	for (const envelope of envelopes) {
		if (!("steps" in envelope)) continue;
		for (const step of envelope.steps) {
			if (step.level > 99 || step.rate > 99) {
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

export function usePluginBridgeSynthEngine(
	options: UsePluginBridgeSynthEngineOptions = {},
): void {
	const gatherState = useSynthStore((s) => s.gatherState);
	const applyPreset = useSynthStore((s) => s.applyPreset);
	const enabled = options.enabled ?? true;
	const outboundEnabledRef = useRef(false);
	const sentParamsRef = useRef("");
	const syncRef = useRef<(() => void) | null>(null);

	const send = useCallback((params: SynthPresetV1["params"]) => {
		const json = JSON.stringify(params);
		if (sentParamsRef.current === json) return;
		sentParamsRef.current = json;
		window.__czSetParams?.(json);
	}, []);

	// Inbound: Rust → React state
	useEffect(() => {
		if (!enabled) return;
		window.__czOnParams = (json: string) => {
			try {
				const params = JSON.parse(json) as SynthPresetV1["params"];
				const uiParams = normalizeHostParamsIfRaw(params);
				applyPreset({ schemaVersion: 1, params: uiParams });
			} catch (e) {
				console.error("[PluginBridge] Failed to parse params from Rust:", e);
			}
			outboundEnabledRef.current = true;
			syncRef.current?.();
		};
		return () => {
			window.__czOnParams = undefined;
		};
	}, [enabled, applyPreset]);

	// Outbound: React state → Rust
	useEffect(() => {
		if (!enabled) return;
		const sync = () => {
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
		if (!window.__czGetParams) {
			// Running in WASM/standalone mode — outbound sync can start immediately.
			outboundEnabledRef.current = true;
			return;
		}
		let cancelled = false;
		let retryCount = 0;
		const MAX_RETRIES = 10;
		const RETRY_DELAY_MS = 500;
		let retryId = 0;
		let fallbackId = 0;

		const applyResult = (result: unknown) => {
			if (result && typeof result === "object") {
				try {
					const uiParams = normalizeHostParamsIfRaw(
						result as SynthPresetV1["params"],
					);
					applyPreset({
						schemaVersion: 1,
						params: uiParams,
					});
				} catch {
					// Partial/empty params — ignore, keep current UI state.
				}
			}
			outboundEnabledRef.current = true;
			syncRef.current?.();
		};

		const tryGetParams = () => {
			if (cancelled) return;
			const getParams = window.__czGetParams;
			if (!getParams) return;
			void getParams()
				.then((result) => {
					window.clearTimeout(fallbackId);
					if (cancelled) return;
					applyResult(result);
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
							syncRef.current?.();
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
							syncRef.current?.();
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
	}, [enabled, applyPreset]);
}
