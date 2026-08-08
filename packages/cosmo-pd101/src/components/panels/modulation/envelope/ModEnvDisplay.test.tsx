import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModEnvDisplay from "./ModEnvDisplay";
import {
	buildAdsrGeometry,
	estimateEnvelopeMarkerForPhase,
} from "./modEnvelopePreview";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

describe("ModEnvDisplay", () => {
	it("renders one marker for each live poly voice", () => {
		const envGeometry = buildAdsrGeometry(0.05, 0.2, 0.7, 0.3, "adsr");
		const envMarkers = [
			{
				id: 0,
				releasing: false,
				...estimateEnvelopeMarkerForPhase(envGeometry, 0.5, 0.7, "attack"),
			},
			{
				id: 1,
				releasing: true,
				...estimateEnvelopeMarkerForPhase(envGeometry, 0.3, 0.7, "release"),
			},
		];

		render(
			<ModEnvDisplay
				previewSvgRef={{ current: null }}
				envGeometry={envGeometry}
				envMarkers={envMarkers}
				attack={0.05}
				decay={0.2}
				sustain={0.7}
				release={0.3}
				mode="adsr"
				onDragHandle={vi.fn()}
			/>,
		);

		expect(screen.getAllByTestId("mod-env-voice-marker")).toHaveLength(2);
	});
});
