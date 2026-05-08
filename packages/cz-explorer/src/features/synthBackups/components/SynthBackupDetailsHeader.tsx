import SelectInput from "@/components/forms/SelectInput";
import Button from "@/components/ui/Button";
import type { SynthBackup } from "@/lib/collections/synthBackupManager";

interface SynthBackupDetailsHeaderProps {
	selectedBackup: SynthBackup;
	restoreBank: "internal" | "cartridge";
	isRestoring: boolean;
	onRestoreBankChange: (bank: "internal" | "cartridge") => void;
	onRestoreBackupToSynth: (
		backupId: string,
		bank: "internal" | "cartridge",
	) => void;
	onExportBackup: (backupId: string) => void;
	onDeleteBackup: (backupId: string) => void;
}

export default function SynthBackupDetailsHeader({
	selectedBackup,
	restoreBank,
	isRestoring,
	onRestoreBankChange,
	onRestoreBackupToSynth,
	onExportBackup,
	onDeleteBackup,
}: SynthBackupDetailsHeaderProps) {
	return (
		<div className="flex items-center justify-between border-base-content/10 border-b bg-base-200/50 p-4">
			<div>
				<div className="font-bold text-lg">{selectedBackup.name}</div>
				<div className="text-xs opacity-70">
					{new Date(selectedBackup.createdAt).toLocaleString()} •{" "}
					{selectedBackup.entries.length} slots
				</div>
			</div>
			<div className="flex gap-2">
				<div className="w-52">
					<SelectInput
						aria-label="Restore destination bank"
						selectSize="sm"
						value={restoreBank}
						onChange={(event) =>
							onRestoreBankChange(
								event.target.value as "internal" | "cartridge",
							)
						}
					>
						<option value="internal">Restore to Internal</option>
						<option value="cartridge">Restore to Cartridge</option>
					</SelectInput>
				</div>
				<Button
					variant="accent"
					size="sm"
					disabled={isRestoring}
					onClick={() => onRestoreBackupToSynth(selectedBackup.id, restoreBank)}
				>
					{isRestoring ? "Restoring..." : "Restore To Synth"}
				</Button>
				<Button
					variant="secondary"
					size="sm"
					onClick={() => onExportBackup(selectedBackup.id)}
				>
					Export JSON
				</Button>
				<Button
					variant="error"
					size="sm"
					onClick={() => onDeleteBackup(selectedBackup.id)}
				>
					Delete
				</Button>
			</div>
		</div>
	);
}
