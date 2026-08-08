import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { EngineParamUiMetaWithRangeV1 } from "@/lib/synth/paramMeta";
import SynthParamKnob from "./SynthParamKnob";

const {
	mockMetaByKey,
	mockParamMeta,
	mockGetDefault,
	mockSetParam,
	mockUseHostTransport,
	mockUseMidiLearnTarget,
	mockUseOptionalSynthController,
	mockUseSynthStore,
	mockSynthState,
	ControlKnobMock,
} = vi.hoisted(() => ({
	mockMetaByKey: {} as Partial<Record<string, EngineParamUiMetaWithRangeV1>>,
	mockParamMeta: {} as Partial<Record<string, { tooltip: string }>>,
	mockGetDefault: vi.fn(),
	mockSetParam: vi.fn(),
	mockUseHostTransport: vi.fn(() => ({
		available: false,
		tempo: 120,
		playing: false,
		positionBeats: 0,
		timeSigNum: 4,
		timeSigDen: 4,
		loopActive: false,
	})),
	mockUseMidiLearnTarget: vi.fn((_options?: unknown) => ({
		onClick: vi.fn(),
		onContextMenu: vi.fn(),
		interactionLocked: false,
		midiLearnState: null,
	})),
	mockUseOptionalSynthController: vi.fn(() => ({
		setParam: mockSetParam,
	})),
	mockSynthState: {
		volume: 0.5,
		lfoRate: 2,
		lfoRateMode: "hz",
		lfoSyncDivision: "quarter",
		lfo2Rate: 2,
		lfo2RateMode: "hz",
		lfo2SyncDivision: "quarter",
		tempoBpm: 120,
		warpAAmount: 0,
		warpBAmount: 0,
		pitchBendRange: 0,
		portamentoRate: 0,
		portamentoEnabled: 0,
		modEnvAttack: 100,
		modEnvRelease: 1,
		algo2A: 0,
		algo2B: 0,
	} as Record<string, unknown>,
	mockUseSynthStore: vi.fn(
		(selector: (state: Record<string, unknown>) => unknown) =>
			selector(mockSynthState),
	),
	ControlKnobMock: vi.fn(
		({
			children,
			...props
		}: {
			children?: ReactNode;
			[key: string]: unknown;
		}) => (
			<div
				data-testid="control-knob"
				{...Object.fromEntries(
					Object.entries(props).map(([k, v]) => [
						`data-prop-${k}`,
						typeof v === "function" ? "fn" : String(v ?? ""),
					]),
				)}
			>
				{children}
			</div>
		),
	),
}));

vi.mock("@/components/controls/parameters/ControlKnob", () => ({
	default: (props: Record<string, unknown> & { children?: ReactNode }) =>
		ControlKnobMock(props),
}));

vi.mock("@/lib/synth/paramMeta", () => ({
	ENGINE_PARAM_UI_META_BY_KEY: mockMetaByKey,
	PARAM_META: mockParamMeta,
	getEngineParamDefault: (...args: unknown[]) => mockGetDefault(...args),
}));

vi.mock("@/features/synth/hooks/useHostTransport", () => ({
	useHostTransport: () => mockUseHostTransport(),
}));

vi.mock("@/features/synth/hooks/useMidiLearnTarget", () => ({
	useMidiLearnTarget: (options: unknown) => mockUseMidiLearnTarget(options),
}));

vi.mock("@/features/synth/SynthParamController", async () => {
	const actual = await vi.importActual<
		typeof import("@/features/synth/SynthParamController")
	>("@/features/synth/SynthParamController");
	return {
		...actual,
		useOptionalSynthController: () => mockUseOptionalSynthController(),
	};
});

vi.mock("@/features/synth/synthStore", () => ({
	useSynthStore: (selector: (state: Record<string, unknown>) => unknown) =>
		mockUseSynthStore(selector),
}));

function buildMeta(
	overrides: Record<string, unknown>,
): EngineParamUiMetaWithRangeV1 {
	return {
		key: "test",
		paramDefault: null,
		...overrides,
	} as EngineParamUiMetaWithRangeV1;
}

describe("SynthParamKnob", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		for (const key of Object.keys(mockMetaByKey)) {
			delete mockMetaByKey[key];
		}
		for (const key of Object.keys(mockParamMeta)) {
			delete mockParamMeta[key];
		}
		mockGetDefault.mockReset();
		mockUseHostTransport.mockReturnValue({
			available: false,
			tempo: 120,
			playing: false,
			positionBeats: 0,
			timeSigNum: 4,
			timeSigDen: 4,
			loopActive: false,
		});
		mockUseMidiLearnTarget.mockReturnValue({
			onClick: vi.fn(),
			onContextMenu: vi.fn(),
			interactionLocked: false,
			midiLearnState: null,
		});
		mockUseOptionalSynthController.mockReturnValue({
			setParam: mockSetParam,
		});
		mockSetParam.mockReset();
		Object.assign(mockSynthState, {
			volume: 0.5,
			lfoRate: 2,
			lfoRateMode: "hz",
			lfoSyncDivision: "quarter",
			lfo2Rate: 2,
			lfo2RateMode: "hz",
			lfo2SyncDivision: "quarter",
			tempoBpm: 120,
			warpAAmount: 0,
			warpBAmount: 0,
			pitchBendRange: 0,
			portamentoRate: 0,
			portamentoEnabled: 0,
			modEnvAttack: 100,
			modEnvRelease: 1,
			algo2A: 0,
			algo2B: 0,
		});
	});

	it("renders ControlKnob with value, onChange, label", () => {
		const onChange = vi.fn();
		render(
			<SynthParamKnob
				paramKey="volume"
				value={0.5}
				onChange={onChange}
				label="Volume"
			/>,
		);

		const knob = screen.getByTestId("control-knob");
		expect(knob).toBeInTheDocument();
		expect(knob).toHaveAttribute("data-prop-value", "0.5");
		expect(knob).toHaveAttribute("data-prop-onChange", "fn");
		expect(knob).toHaveAttribute("data-prop-label", "Volume");
	});

	it("passes modDestination from prop", () => {
		render(
			<SynthParamKnob
				paramKey="volume"
				value={0}
				onChange={vi.fn()}
				modDestination="volume"
			/>,
		);

		expect(screen.getByTestId("control-knob")).toHaveAttribute(
			"data-prop-modDestination",
			"volume",
		);
	});

	it("resolves modDestination from meta when no prop", () => {
		mockMetaByKey.volume = buildMeta({
			key: "volume",
			readoutFormat: { kind: "percent" },
			modDestination: "dcwBase",
		});
		render(<SynthParamKnob paramKey="volume" value={0} onChange={vi.fn()} />);

		expect(screen.getByTestId("control-knob")).toHaveAttribute(
			"data-prop-modDestination",
			"dcwBase",
		);
	});

	it("uses meta for min, max, step, bipolar defaults", () => {
		mockMetaByKey.lfoRate = buildMeta({
			key: "lfoRate",
			readoutFormat: { kind: "hertz" },
			min: 20,
			max: 20000,
			step: 1,
			bipolar: false,
		});
		render(
			<SynthParamKnob paramKey="lfoRate" value={440} onChange={vi.fn()} />,
		);

		const knob = screen.getByTestId("control-knob");
		expect(knob).toHaveAttribute("data-prop-min", "20");
		expect(knob).toHaveAttribute("data-prop-max", "20000");
		expect(knob).toHaveAttribute("data-prop-step", "1");
		expect(knob).toHaveAttribute("data-prop-bipolar", "false");
	});

	it("falls back to hardcoded defaults when meta is undefined", () => {
		mockMetaByKey.volume = undefined as unknown as EngineParamUiMetaWithRangeV1;
		render(<SynthParamKnob paramKey="volume" value={0.5} onChange={vi.fn()} />);

		const knob = screen.getByTestId("control-knob");
		expect(knob).toHaveAttribute("data-prop-min", "0");
		expect(knob).toHaveAttribute("data-prop-max", "1");
		expect(knob).toHaveAttribute("data-prop-step", "");
		expect(knob).toHaveAttribute("data-prop-bipolar", "false");
	});

	it("prop values override meta defaults", () => {
		mockMetaByKey.lfoRate = buildMeta({
			key: "lfoRate",
			readoutFormat: { kind: "hertz" },
			min: 20,
			max: 20000,
			step: 1,
			bipolar: false,
		});
		render(
			<SynthParamKnob
				paramKey="lfoRate"
				value={440}
				onChange={vi.fn()}
				min={0}
				max={100}
				step={0.1}
				bipolar={true}
			/>,
		);

		const knob = screen.getByTestId("control-knob");
		expect(knob).toHaveAttribute("data-prop-min", "0");
		expect(knob).toHaveAttribute("data-prop-max", "100");
		expect(knob).toHaveAttribute("data-prop-step", "0.1");
		expect(knob).toHaveAttribute("data-prop-bipolar", "true");
	});

	it("passes tooltip from PARAM_META", () => {
		mockParamMeta.volume = { tooltip: "Adjust the output level" };
		render(<SynthParamKnob paramKey="volume" value={0.5} onChange={vi.fn()} />);

		expect(screen.getByTestId("control-knob")).toHaveAttribute(
			"data-prop-tooltip",
			"Adjust the output level",
		);
	});

	it("passes defaultValue from getEngineParamDefault", () => {
		mockGetDefault.mockReturnValue(0.4);
		render(<SynthParamKnob paramKey="volume" value={0.5} onChange={vi.fn()} />);

		expect(screen.getByTestId("control-knob")).toHaveAttribute(
			"data-prop-defaultValue",
			"0.4",
		);
	});

	it("passes curve from meta", () => {
		mockMetaByKey.warpAAmount = buildMeta({
			key: "warpAAmount",
			readoutFormat: { kind: "decimal" },
			curve: "exponential2",
		});
		render(
			<SynthParamKnob paramKey="warpAAmount" value={0} onChange={vi.fn()} />,
		);

		expect(screen.getByTestId("control-knob")).toHaveAttribute(
			"data-prop-curve",
			"exponential2",
		);
	});

	it("defaults curve to linear when meta has none", () => {
		mockMetaByKey.warpBAmount = buildMeta({
			key: "warpBAmount",
			readoutFormat: { kind: "percent" },
		});
		render(
			<SynthParamKnob paramKey="warpBAmount" value={0} onChange={vi.fn()} />,
		);

		expect(screen.getByTestId("control-knob")).toHaveAttribute(
			"data-prop-curve",
			"linear",
		);
	});

	it("passes color, size, variant, disabled, labelClassName", () => {
		render(
			<SynthParamKnob
				paramKey="volume"
				value={0}
				onChange={vi.fn()}
				color="#ff0000"
				size={60}
				variant="accent"
				disabled={true}
				labelClassName="my-label"
			/>,
		);

		const knob = screen.getByTestId("control-knob");
		expect(knob).toHaveAttribute("data-prop-color", "#ff0000");
		expect(knob).toHaveAttribute("data-prop-size", "60");
		expect(knob).toHaveAttribute("data-prop-variant", "accent");
		expect(knob).toHaveAttribute("data-prop-disabled", "true");
		expect(knob).toHaveAttribute("data-prop-labelClassName", "my-label");
	});

	it("maps uiTransform to the control range", () => {
		render(
			<SynthParamKnob
				paramKey="lfoRate"
				value={32}
				uiTransform={{
					toControlValue: (engineValue) => engineValue / 100,
					fromControlValue: (controlValue) => controlValue * 100,
					min: 0,
					max: 1,
					defaultValue: 0.25,
				}}
			/>,
		);

		const knob = screen.getByTestId("control-knob");
		expect(knob).toHaveAttribute("data-prop-value", "0.32");
		expect(knob).toHaveAttribute("data-prop-min", "0");
		expect(knob).toHaveAttribute("data-prop-max", "1");
		expect(knob).toHaveAttribute("data-prop-defaultValue", "0.25");
	});

	it("switches to sync divisions when sync mode is active", () => {
		mockSynthState.lfoRateMode = "sync";
		mockSynthState.lfoSyncDivision = "half";
		mockSynthState.tempoBpm = 132;
		mockUseHostTransport.mockReturnValue({
			available: true,
			tempo: 132,
			playing: true,
			positionBeats: 8,
			timeSigNum: 4,
			timeSigDen: 4,
			loopActive: false,
		});

		render(<SynthParamKnob paramKey="lfoRate" sync />);

		const knob = screen.getByTestId("control-knob");
		expect(knob).toHaveAttribute("data-prop-value", "1");
		expect(knob).toHaveAttribute("data-prop-min", "0");
		expect(knob).toHaveAttribute("data-prop-step", "1");
		expect(knob).toHaveAttribute("data-prop-curve", "linear");
		expect(knob).toHaveAttribute("data-prop-tooltip", "");
		expect(knob).toHaveAttribute("data-prop-labelAccessory", "[object Object]");
	});

	describe("valueFormatter", () => {
		it("uses valueFormatterOverride when provided", () => {
			const formatter = (v: number) => `${v}dB`;
			render(
				<SynthParamKnob
					paramKey="volume"
					value={0.5}
					onChange={vi.fn()}
					valueFormatter={formatter}
				/>,
			);

			const knob = screen.getByTestId("control-knob");
			expect(knob).toHaveAttribute("data-prop-valueFormatter", "fn");
		});

		it("percent format displays rounded percentage", () => {
			mockMetaByKey.volume = buildMeta({
				key: "volume",
				readoutFormat: { kind: "percent" },
			});
			render(
				<SynthParamKnob paramKey="volume" value={0.256} onChange={vi.fn()} />,
			);

			const knob = screen.getByTestId("control-knob");
			expect(knob).toHaveAttribute("data-prop-valueFormatter", "fn");
		});

		it("bipolarPercent format shows + prefix for positive", () => {
			mockMetaByKey.pitchBendRange = buildMeta({
				key: "pitchBendRange",
				readoutFormat: { kind: "bipolarPercent" },
				bipolar: true,
			});
			render(
				<SynthParamKnob
					paramKey="pitchBendRange"
					value={0.5}
					onChange={vi.fn()}
				/>,
			);

			const knob = screen.getByTestId("control-knob");
			expect(knob).toHaveAttribute("data-prop-valueFormatter", "fn");
		});

		it("degrees format", () => {
			mockMetaByKey.portamentoRate = buildMeta({
				key: "portamentoRate",
				readoutFormat: { kind: "degrees" },
			});
			render(
				<SynthParamKnob
					paramKey="portamentoRate"
					value={0.25}
					onChange={vi.fn()}
				/>,
			);
			expect(screen.getByTestId("control-knob")).toHaveAttribute(
				"data-prop-valueFormatter",
				"fn",
			);
		});

		it("integer format", () => {
			mockMetaByKey.algo2A = buildMeta({
				key: "algo2A",
				readoutFormat: { kind: "integer" },
			});
			render(
				<SynthParamKnob paramKey="algo2A" value={3.7} onChange={vi.fn()} />,
			);
			expect(screen.getByTestId("control-knob")).toHaveAttribute(
				"data-prop-valueFormatter",
				"fn",
			);
		});

		it("decimal format", () => {
			mockMetaByKey.algo2B = buildMeta({
				key: "algo2B",
				readoutFormat: { kind: "decimal" },
			});
			render(
				<SynthParamKnob paramKey="algo2B" value={1.234} onChange={vi.fn()} />,
			);
			expect(screen.getByTestId("control-knob")).toHaveAttribute(
				"data-prop-valueFormatter",
				"fn",
			);
		});

		it("hertz format", () => {
			mockMetaByKey.lfoRate = buildMeta({
				key: "lfoRate",
				readoutFormat: { kind: "hertz" },
			});
			render(
				<SynthParamKnob paramKey="lfoRate" value={440} onChange={vi.fn()} />,
			);
			expect(screen.getByTestId("control-knob")).toHaveAttribute(
				"data-prop-valueFormatter",
				"fn",
			);
		});

		it("milliseconds format", () => {
			mockMetaByKey.modEnvAttack = buildMeta({
				key: "modEnvAttack",
				readoutFormat: { kind: "milliseconds" },
			});
			render(
				<SynthParamKnob
					paramKey="modEnvAttack"
					value={50}
					onChange={vi.fn()}
				/>,
			);
			expect(screen.getByTestId("control-knob")).toHaveAttribute(
				"data-prop-valueFormatter",
				"fn",
			);
		});

		it("seconds2 format", () => {
			mockMetaByKey.modEnvRelease = buildMeta({
				key: "modEnvRelease",
				readoutFormat: { kind: "seconds2" },
			});
			render(
				<SynthParamKnob
					paramKey="modEnvRelease"
					value={2.5}
					onChange={vi.fn()}
				/>,
			);
			expect(screen.getByTestId("control-knob")).toHaveAttribute(
				"data-prop-valueFormatter",
				"fn",
			);
		});

		it("semitones format", () => {
			mockMetaByKey.pitchBendRange = buildMeta({
				key: "pitchBendRange",
				readoutFormat: { kind: "semitones" },
			});
			render(
				<SynthParamKnob
					paramKey="pitchBendRange"
					value={5}
					onChange={vi.fn()}
				/>,
			);
			expect(screen.getByTestId("control-knob")).toHaveAttribute(
				"data-prop-valueFormatter",
				"fn",
			);
		});

		it("onOff format returns On for >= 0.5", () => {
			mockMetaByKey.portamentoEnabled = buildMeta({
				key: "portamentoEnabled",
				readoutFormat: { kind: "onOff" },
			});
			render(
				<SynthParamKnob
					paramKey="portamentoEnabled"
					value={1}
					onChange={vi.fn()}
				/>,
			);
			expect(screen.getByTestId("control-knob")).toHaveAttribute(
				"data-prop-valueFormatter",
				"fn",
			);
		});

		it("onOff format returns Off for < 0.5", () => {
			mockMetaByKey.portamentoEnabled = buildMeta({
				key: "portamentoEnabled",
				readoutFormat: { kind: "onOff" },
			});
			render(
				<SynthParamKnob
					paramKey="portamentoEnabled"
					value={0}
					onChange={vi.fn()}
				/>,
			);
			expect(screen.getByTestId("control-knob")).toHaveAttribute(
				"data-prop-valueFormatter",
				"fn",
			);
		});
	});
});
