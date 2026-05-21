import { useEffect, useState } from "react";
import {
	ATTACK_WIDTH_SCALE,
	clamp01,
	clientToSvgPoint,
	DECAY_WIDTH_SCALE,
	type EnvelopeHandle,
	MOD_ENV_X_MAX,
	RELEASE_WIDTH_SCALE,
	widthToSeconds,
} from "./modEnvelopePreview";

type UseModEnvelopePreviewDragOptions = {
	envGeometry: {
		x0: number;
		x1: number;
		x2: number;
		x3: number;
		x4: number;
		top: number;
		bottom: number;
	};
	previewSvgRef: React.RefObject<SVGSVGElement | null>;
	setModEnvAttack: (value: number) => void;
	setModEnvDecay: (value: number) => void;
	setModEnvSustain: (value: number) => void;
	setModEnvRelease: (value: number) => void;
};

const MOD_ENV_SUSTAIN_SPAN = (56 - 8) * 0.78;

export function useModEnvelopePreviewDrag({
	envGeometry,
	previewSvgRef,
	setModEnvAttack,
	setModEnvDecay,
	setModEnvSustain,
	setModEnvRelease,
}: UseModEnvelopePreviewDragOptions) {
	const [dragHandle, setDragHandle] = useState<EnvelopeHandle | null>(null);

	useEffect(() => {
		if (!dragHandle) {
			return;
		}

		const onPointerMove = (event: PointerEvent) => {
			const svg = previewSvgRef.current;
			if (!svg) {
				return;
			}

			const point = clientToSvgPoint(event, svg);
			const geo = envGeometry;

			if (dragHandle === "attack") {
				const x = Math.max(geo.x0, Math.min(geo.x2 - 2, point.x));
				setModEnvAttack(widthToSeconds(x - geo.x0, ATTACK_WIDTH_SCALE));
				return;
			}

			if (dragHandle === "decaySustain") {
				const x = Math.max(geo.x1 + 2, Math.min(geo.x4 - 2, point.x));
				const y = Math.max(geo.top, Math.min(geo.bottom, point.y));
				setModEnvDecay(widthToSeconds(x - geo.x1, DECAY_WIDTH_SCALE));
				setModEnvSustain(clamp01((geo.bottom - y) / MOD_ENV_SUSTAIN_SPAN));
				return;
			}

			const x = Math.max(geo.x3 + 2, Math.min(MOD_ENV_X_MAX, point.x));
			setModEnvRelease(widthToSeconds(x - geo.x3, RELEASE_WIDTH_SCALE));
		};

		const onPointerUp = () => {
			setDragHandle(null);
		};

		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", onPointerUp);
		return () => {
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", onPointerUp);
		};
	}, [
		dragHandle,
		envGeometry,
		previewSvgRef,
		setModEnvAttack,
		setModEnvDecay,
		setModEnvRelease,
		setModEnvSustain,
	]);

	return {
		dragHandle,
		setDragHandle,
	};
}
