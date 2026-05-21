import { useSynthStore } from "@/features/synth/synthStore";
import { SynthOverlayModal } from "./SynthOverlayModal";

export function MacroLabelEditorModal({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const labels = useSynthStore((s) => s.macroLabels);
	const setMacroLabel = useSynthStore((s) => s.setMacroLabel);

	return (
		<SynthOverlayModal
			open={open}
			onClose={onClose}
			title="Macro Labels"
			ariaLabel="Macro label editor"
			widthClassName="w-[min(30rem,94vw)]"
		>
			<div className="grid grid-cols-2 gap-2">
				{[0, 1, 2, 3].map((idx) => (
					<label
						key={`macro-label-editor-${idx}`}
						className="flex flex-col gap-1 font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.12em]"
					>
						Macro {idx + 1}
						<input
							type="text"
							className="input input-sm w-full border-cz-border bg-cz-inset font-mono text-2xs text-cz-cream"
							maxLength={18}
							value={labels[idx]}
							onChange={(event) =>
								setMacroLabel(idx, event.currentTarget.value)
							}
						/>
					</label>
				))}
			</div>
		</SynthOverlayModal>
	);
}
