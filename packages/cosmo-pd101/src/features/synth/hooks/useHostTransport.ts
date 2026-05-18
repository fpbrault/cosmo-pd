import { useEffect, useState } from "react";

export type HostTransportInfo = {
	available: boolean;
	playing: boolean;
	recording: boolean;
	tempo: number;
	timeSigNum: number;
	timeSigDen: number;
	positionSamples: number;
	positionSeconds: number;
	positionBeats: number;
	barStartBeats: number;
	loopActive: boolean;
	loopStartBeats: number;
	loopEndBeats: number;
};

export const EMPTY_HOST_TRANSPORT: HostTransportInfo = {
	available: false,
	playing: false,
	recording: false,
	tempo: 120,
	timeSigNum: 4,
	timeSigDen: 4,
	positionSamples: 0,
	positionSeconds: 0,
	positionBeats: 0,
	barStartBeats: 0,
	loopActive: false,
	loopStartBeats: 0,
	loopEndBeats: 0,
};

function normalizeTransportInfo(value: unknown): HostTransportInfo | null {
	if (!value || typeof value !== "object") {
		return null;
	}

	const detail = value as Record<string, unknown>;
	const readNumber = (
		key: keyof Omit<
			HostTransportInfo,
			"available" | "playing" | "recording" | "loopActive"
		>,
		fallback: number,
	) => {
		const next = detail[key];
		return typeof next === "number" && Number.isFinite(next) ? next : fallback;
	};

	return {
		available: true,
		playing: detail.playing === true,
		recording: detail.recording === true,
		tempo: readNumber("tempo", EMPTY_HOST_TRANSPORT.tempo),
		timeSigNum: readNumber("timeSigNum", EMPTY_HOST_TRANSPORT.timeSigNum),
		timeSigDen: readNumber("timeSigDen", EMPTY_HOST_TRANSPORT.timeSigDen),
		positionSamples: readNumber(
			"positionSamples",
			EMPTY_HOST_TRANSPORT.positionSamples,
		),
		positionSeconds: readNumber(
			"positionSeconds",
			EMPTY_HOST_TRANSPORT.positionSeconds,
		),
		positionBeats: readNumber(
			"positionBeats",
			EMPTY_HOST_TRANSPORT.positionBeats,
		),
		barStartBeats: readNumber(
			"barStartBeats",
			EMPTY_HOST_TRANSPORT.barStartBeats,
		),
		loopActive: detail.loopActive === true,
		loopStartBeats: readNumber(
			"loopStartBeats",
			EMPTY_HOST_TRANSPORT.loopStartBeats,
		),
		loopEndBeats: readNumber("loopEndBeats", EMPTY_HOST_TRANSPORT.loopEndBeats),
	};
}

export function useHostTransport(): HostTransportInfo {
	const [transport, setTransport] =
		useState<HostTransportInfo>(EMPTY_HOST_TRANSPORT);

	useEffect(() => {
		const onTransport = (event: Event) => {
			const detail = (event as CustomEvent<unknown>).detail;
			const next = normalizeTransportInfo(detail);
			if (next) {
				setTransport(next);
			}
		};

		window.addEventListener("cz-host-transport", onTransport);
		return () => {
			window.removeEventListener("cz-host-transport", onTransport);
		};
	}, []);

	return transport;
}
