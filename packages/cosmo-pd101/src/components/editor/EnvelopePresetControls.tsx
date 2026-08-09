import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/controls/Button";
import Popover from "@/components/primitives/Popover";
import PresetPopover from "@/components/primitives/PresetPopover";
import type { EnvTab } from "@/features/synth/synthUiStore";
import { normalizeEnvelope } from "@/lib/synth/envelopeData";
import type {
	PhaseLineEnvelopeModel,
	PhaseLineEnvelopeTarget,
} from "./phaseLineTypes";
import { useEnvelopePresetController } from "./useEnvelopePresetController";

type EnvelopeCopyPopoverProps = {
	currentTargetId: string;
	targets: PhaseLineEnvelopeTarget[];
	onCopy: (target: PhaseLineEnvelopeTarget) => void;
};

function EnvelopeCopyPopover({
	currentTargetId,
	targets,
	onCopy,
}: EnvelopeCopyPopoverProps) {
	const { t } = useTranslation("synth");
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement | null>(null);

	return (
		<>
			<Button
				ref={triggerRef}
				type="button"
				onClick={() => setOpen((value) => !value)}
				aria-label={t("envelopePreset.copyAria")}
				aria-haspopup="menu"
				aria-expanded={open}
				className="btn btn-xs h-5 min-h-0 shrink-0 rounded-sm border border-cz-border/65 px-2 font-bold font-mono text-[0.54rem] text-cz-cream-light uppercase tracking-[0.14em] shadow-[0_1px_0_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.08)] hover:brightness-125"
			>
				{t("envelopePreset.copy")}
			</Button>
			<Popover
				open={open}
				onClose={() => setOpen(false)}
				triggerRef={triggerRef}
				role="menu"
				modal={false}
				ariaLabel={t("envelopePreset.copyTargetsAria")}
				placement="bottom-end"
			>
				<div className="w-48 p-1">
					<div className="px-2 py-1 font-bold text-[0.55rem] text-cz-cream-dim uppercase tracking-[0.16em]">
						{t("envelopePreset.copyTargets")}
					</div>
					{targets.map((target) => {
						const isCurrent = target.id === currentTargetId;
						return (
							<Button
								key={target.id}
								type="button"
								disabled={isCurrent}
								onClick={() => {
									onCopy(target);
									setOpen(false);
								}}
								role="menuitem"
								className={`btn btn-ghost btn-sm min-h-0 w-full justify-between rounded-sm px-2 py-1 text-left text-xs ${
									isCurrent
										? "text-cz-cream/35"
										: "text-cz-cream hover:bg-cz-surface"
								}`}
							>
								<span>{target.label}</span>
								{isCurrent ? (
									<span className="text-[0.55rem] uppercase tracking-[0.12em]">
										{t("envelopePreset.current")}
									</span>
								) : null}
							</Button>
						);
					})}
				</div>
			</Popover>
		</>
	);
}

type EnvelopePresetControlsProps = {
	envKind: EnvTab;
	lineIndex: 1 | 2;
	envelopes: PhaseLineEnvelopeModel;
};

export function EnvelopePresetControls({
	envKind,
	lineIndex,
	envelopes,
}: EnvelopePresetControlsProps) {
	const { t } = useTranslation("synth");
	const activeEnvelope = envelopes.envs[envKind];
	const currentTargetId = `line${lineIndex}-${envKind}`;
	const { env, setEnv } = activeEnvelope;
	const {
		selectedPreset,
		presetOptions,
		builtinPresetIds,
		handlePresetChange,
		handleSavePreset,
		handleDeletePreset,
	} = useEnvelopePresetController({
		envelope: env,
		onApply: setEnv,
	});

	const handleCopy = (target: PhaseLineEnvelopeTarget) => {
		target.setEnv(
			normalizeEnvelope({
				...env,
				steps: env.steps.map((step) => ({ ...step })),
			}),
		);
	};

	return (
		<div className="flex shrink-0 items-end gap-1">
			<PresetPopover
				title={t("envelopePreset.title")}
				saveDialogTitle={t("envelopePreset.saveDialogTitle")}
				value={selectedPreset}
				options={presetOptions}
				onChange={handlePresetChange}
				accentColor={activeEnvelope.envColor}
				builtinPresetIds={builtinPresetIds}
				onSavePreset={handleSavePreset}
				onDeletePreset={handleDeletePreset}
			/>
			<EnvelopeCopyPopover
				currentTargetId={currentTargetId}
				targets={envelopes.targets}
				onCopy={handleCopy}
			/>
		</div>
	);
}
