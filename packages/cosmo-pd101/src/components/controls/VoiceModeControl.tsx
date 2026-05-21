import CzButton from "@/components/primitives/CzButton";
import { useSynthParam } from "@/features/synth/SynthParamController";

export default function VoiceModeControl() {
	const { value: polyMode, setValue: setPolyMode } = useSynthParam("polyMode");
	const { value: portamentoEnabled, setValue: setPortamentoEnabled } =
		useSynthParam("portamentoEnabled");

	return (
		<div className="shrink-0">
			<div className="cz-light-blue mb-1">Voice</div>
			<div className="grid grid-cols-2 gap-1">
				<CzButton
					active={polyMode === "mono"}
					onClick={() => setPolyMode(polyMode === "poly8" ? "mono" : "poly8")}
					tooltip="Toggle between Poly8 and Mono voice modes."
				>
					{polyMode === "mono" ? "Mono" : "Poly8"}
				</CzButton>
				<CzButton
					active={Boolean(portamentoEnabled)}
					onClick={() => setPortamentoEnabled(!portamentoEnabled)}
					tooltip="Toggle portamento glide between notes."
				>
					Porta
				</CzButton>
			</div>
		</div>
	);
}
