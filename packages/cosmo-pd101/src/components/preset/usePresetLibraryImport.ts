import { useCallback, useRef } from "react";

type UsePresetLibraryImportOptions = {
	onImportPreset: (json: string, filename: string) => void;
	setImportError: (value: string | null) => void;
};

export function usePresetLibraryImport({
	onImportPreset,
	setImportError,
}: UsePresetLibraryImportOptions) {
	const importFileRef = useRef<HTMLInputElement>(null);

	const handleImportFile = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (!file) return;
			const filename = file.name.replace(/\.json$/i, "");
			const reader = new FileReader();
			reader.onload = (readerEvent) => {
				const text = readerEvent.target?.result;
				if (typeof text !== "string") return;
				try {
					onImportPreset(text, filename);
					setImportError(null);
				} catch {
					setImportError("Invalid preset file.");
				}
			};
			reader.readAsText(file);
			event.target.value = "";
		},
		[onImportPreset, setImportError],
	);

	const handleImportClick = useCallback(() => {
		importFileRef.current?.click();
	}, []);

	return {
		importFileRef,
		handleImportFile,
		handleImportClick,
	};
}
