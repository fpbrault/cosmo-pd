import type { ChangeEvent, DragEvent } from "react";
import { useCallback, useRef, useState } from "react";
import type { PresetImportBatchResult } from "@/features/synth/presetManagerRepository";
import type { PresetImportFile } from "@/lib/synth/presetImport";

type UsePresetLibraryImportOptions = {
	onImportPresetFiles: (
		files: PresetImportFile[],
	) => Promise<PresetImportBatchResult>;
	onImportComplete: (result: PresetImportBatchResult) => void;
	onImportFailure: () => void;
};

export function usePresetLibraryImport({
	onImportPresetFiles,
	onImportComplete,
	onImportFailure,
}: UsePresetLibraryImportOptions) {
	const importFileRef = useRef<HTMLInputElement>(null);
	const dragDepthRef = useRef(0);
	const [isDragActive, setIsDragActive] = useState(false);

	const importFiles = useCallback(
		async (files: File[]) => {
			if (files.length === 0) return;
			try {
				const importFiles = await Promise.all(
					files.map(
						async (file): Promise<PresetImportFile> => ({
							filename: file.name,
							data: new Uint8Array(await file.arrayBuffer()),
						}),
					),
				);
				const result = await onImportPresetFiles(importFiles);
				onImportComplete(result);
			} catch {
				onImportFailure();
			}
		},
		[onImportComplete, onImportFailure, onImportPresetFiles],
	);

	const handleImportFile = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(event.target.files ?? []);
			event.target.value = "";
			void importFiles(files);
		},
		[importFiles],
	);

	const handleImportClick = useCallback(() => {
		importFileRef.current?.click();
	}, []);

	const hasFiles = useCallback((event: DragEvent<HTMLDivElement>) => {
		return Array.from(event.dataTransfer.types).includes("Files");
	}, []);

	const handleDragEnter = useCallback(
		(event: DragEvent<HTMLDivElement>) => {
			if (!hasFiles(event)) return;
			event.preventDefault();
			event.dataTransfer.dropEffect = "copy";
			dragDepthRef.current += 1;
			setIsDragActive(true);
		},
		[hasFiles],
	);

	const handleDragOver = useCallback(
		(event: DragEvent<HTMLDivElement>) => {
			if (!hasFiles(event)) return;
			event.preventDefault();
			event.dataTransfer.dropEffect = "copy";
		},
		[hasFiles],
	);

	const handleDragLeave = useCallback(
		(event: DragEvent<HTMLDivElement>) => {
			if (!hasFiles(event)) return;
			event.preventDefault();
			dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
			if (dragDepthRef.current === 0) setIsDragActive(false);
		},
		[hasFiles],
	);

	const handleDrop = useCallback(
		(event: DragEvent<HTMLDivElement>) => {
			if (!hasFiles(event)) return;
			event.preventDefault();
			dragDepthRef.current = 0;
			setIsDragActive(false);
			void importFiles(Array.from(event.dataTransfer.files));
		},
		[hasFiles, importFiles],
	);

	return {
		importFileRef,
		handleImportFile,
		handleImportClick,
		isDragActive,
		handleDragEnter,
		handleDragOver,
		handleDragLeave,
		handleDrop,
	};
}
