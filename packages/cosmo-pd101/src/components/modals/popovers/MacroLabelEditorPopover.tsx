import type { RefObject } from "react";
import SynthTextInput from "@/components/controls/text/SynthTextInput";
import Popover from "@/components/primitives/overlays/Popover";
import { useSynthStore } from "@/features/synth/synthStore";

export function MacroLabelEditorPopover({
	open,
	triggerRef,
	onClose,
}: {
	open: boolean;
	triggerRef: RefObject<Element | null>;
	onClose: () => void;
}) {
	const labels = useSynthStore((s) => s.macroLabels);
	const setMacroLabel = useSynthStore((s) => s.setMacroLabel);

	return (
		<Popover
			open={open}
			onClose={onClose}
			triggerRef={triggerRef}
			role="dialog"
			ariaLabel="Macro label editor"
			placement="top-end"
		>
			<div className="w-[min(30rem,94vw)] p-3">
				<div className="mb-2 flex items-center justify-between px-1">
					<p className="font-mono text-2xs text-cz-cream-dim uppercase tracking-[0.18em]">
						Macro Labels
					</p>
				</div>
				<div className="grid grid-cols-2 gap-2">
					{[0, 1, 2, 3].map((idx) => (
						<label
							key={`macro-label-editor-${idx}`}
							className="flex flex-col gap-1 font-mono text-4xs text-cz-cream-dim uppercase tracking-[0.12em]"
							htmlFor={`macro-label-${idx}`}
						>
							Macro {idx + 1}
							<SynthTextInput
								id={`macro-label-${idx}`}
								value={labels[idx]}
								onChange={(value) => setMacroLabel(idx, value)}
								maxLength={18}
								className="font-mono text-2xs"
							/>
						</label>
					))}
				</div>
			</div>
		</Popover>
	);
}
