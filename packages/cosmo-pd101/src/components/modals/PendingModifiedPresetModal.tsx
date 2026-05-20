import { useEffect, useState } from "react";
import Button from "@/components/controls/Button";
import type { SynthHeaderProps } from "@/components/preset/SynthHeader";
import { SynthOverlayModal } from "./SynthOverlayModal";

type PendingModifiedPresetModalProps = {
	pendingPresetChange: SynthHeaderProps["pendingPresetChange"];
	onSave?: (name?: string) => void;
	onDiscard?: () => void;
	onCancel?: () => void;
};

export function PendingModifiedPresetModal({
	pendingPresetChange,
	onSave,
	onDiscard,
	onCancel,
}: PendingModifiedPresetModalProps) {
	const [pendingSaveName, setPendingSaveName] = useState("");
	const open = pendingPresetChange !== null;

	useEffect(() => {
		if (!pendingPresetChange) return;
		setPendingSaveName(pendingPresetChange.suggestedName);
	}, [pendingPresetChange]);

	return (
		<SynthOverlayModal
			open={open}
			onClose={() => onCancel?.()}
			title="Save Modified Preset"
			ariaLabel="Save modified preset"
			widthClassName="w-[min(36rem,94vw)]"
		>
			<div className="space-y-4 text-cz-cream">
				<p className="text-cz-cream-dim text-sm">
					{pendingPresetChange?.activePresetName} has unsaved changes.
				</p>
				{pendingPresetChange?.changes.length ? (
					<div className="rounded-md border border-cz-border bg-cz-inset/70 p-2">
						<p className="mb-2 font-mono text-3xs text-cz-light-blue uppercase tracking-[0.24em]">
							Changed Parameters ({pendingPresetChange.changes.length})
						</p>
						<ul className="max-h-44 space-y-1 overflow-y-auto pr-1">
							{pendingPresetChange.changes.map((change) => (
								<li
									key={`${change.path}-${change.previous}-${change.next}`}
									className="rounded border border-cz-border/60 bg-black/20 px-2 py-1 text-[0.7rem] leading-tight"
								>
									<p className="font-mono text-cz-cream">{change.path}</p>
									<p className="font-mono text-cz-cream-dim">
										{change.previous} → {change.next}
									</p>
								</li>
							))}
						</ul>
					</div>
				) : null}
				{pendingPresetChange?.activeLocalName ? null : (
					<input
						type="text"
						className="input w-full border-cz-border bg-cz-inset text-cz-cream"
						placeholder="Preset name"
						value={pendingSaveName}
						onChange={(event) => setPendingSaveName(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter" && pendingSaveName.trim()) {
								onSave?.(pendingSaveName);
							}
						}}
					/>
				)}
				<div className="flex justify-end gap-2 pt-1">
					<Button
						type="button"
						className="btn border-cz-border bg-cz-inset text-cz-cream"
						onClick={onCancel}
					>
						Cancel
					</Button>
					<Button
						type="button"
						className="btn border-cz-border bg-cz-inset text-cz-cream"
						onClick={onDiscard}
					>
						Discard
					</Button>
					<Button
						type="button"
						className="btn btn-primary"
						aria-label="Save modified preset"
						disabled={
							!pendingPresetChange?.activeLocalName && !pendingSaveName.trim()
						}
						onClick={() => onSave?.(pendingSaveName)}
					>
						Save
					</Button>
				</div>
			</div>
		</SynthOverlayModal>
	);
}
