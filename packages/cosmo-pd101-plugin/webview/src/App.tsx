import { useEffect, useState } from "react";
import PluginPage from "./PluginPage";
import "@/index.css";
import {
	checkForPluginUpdate,
	type PluginUpdateInfo,
} from "./update/checkPluginUpdate";

declare const __CZ_BUILD_LABEL__: string;

export default function App() {
	const [updateInfo, setUpdateInfo] = useState<PluginUpdateInfo | null>(null);
	const [manualStatus, setManualStatus] = useState<string | null>(null);

	useEffect(() => {
		const isEditableTarget = (target: EventTarget | null): boolean => {
			if (!(target instanceof Element)) {
				return false;
			}
			return Boolean(
				target.closest(
					"input, textarea, [contenteditable='true'], [data-allow-selection='true']",
				),
			);
		};

		const isInsideEditableSelection = (selection: Selection): boolean => {
			const anchorNode = selection.anchorNode;
			const focusNode = selection.focusNode;
			const anchorElement =
				anchorNode instanceof Element
					? anchorNode
					: (anchorNode?.parentElement ?? null);
			const focusElement =
				focusNode instanceof Element
					? focusNode
					: (focusNode?.parentElement ?? null);
			return isEditableTarget(anchorElement) || isEditableTarget(focusElement);
		};

		const handleSelectStart = (event: Event) => {
			if (!isEditableTarget(event.target)) {
				event.preventDefault();
			}
		};

		const handleDragStart = (event: Event) => {
			if (!isEditableTarget(event.target)) {
				event.preventDefault();
			}
		};

		const handleSelectionChange = () => {
			const selection = window.getSelection();
			if (!selection || selection.isCollapsed) {
				return;
			}
			if (!isInsideEditableSelection(selection)) {
				selection.removeAllRanges();
			}
		};

		document.addEventListener("selectstart", handleSelectStart);
		document.addEventListener("dragstart", handleDragStart);
		document.addEventListener("selectionchange", handleSelectionChange);

		return () => {
			document.removeEventListener("selectstart", handleSelectStart);
			document.removeEventListener("dragstart", handleDragStart);
			document.removeEventListener("selectionchange", handleSelectionChange);
		};
	}, []);

	useEffect(() => {
		void (async () => {
			const info = await checkForPluginUpdate();
			setUpdateInfo(info);
		})();
	}, []);

	const handleManualCheck = () => {
		void (async () => {
			const info = await checkForPluginUpdate({ manual: true });
			if (info) {
				setManualStatus(null);
				setUpdateInfo(info);
				return;
			}
			setManualStatus("You are up to date.");
		})();
	};

	return (
		<>
			<PluginPage
				utilityExtra={
					<div className="flex items-center gap-2">
						<span className="text-cz-cream/55">Build {__CZ_BUILD_LABEL__}</span>
						<button
							type="button"
							onClick={handleManualCheck}
							className="rounded-sm border border-cz-border bg-black/25 px-1.5 py-0.5 font-mono text-[0.54rem] text-cz-cream/80 tracking-[0.14em] transition-colors hover:text-cz-cream"
						>
							Check updates
						</button>
						{manualStatus ? (
							<span className="text-cz-cream/70">{manualStatus}</span>
						) : null}
					</div>
				}
			/>
			{updateInfo && (
				<div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/65 p-4">
					<div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-5 text-slate-100 shadow-2xl">
						<h2 className="font-semibold text-lg">New Version Available</h2>
						<p className="mt-2 text-slate-300 text-sm">
							Version v{updateInfo.latestVersion} is available (you are on v
							{updateInfo.currentVersion}).
						</p>
						{updateInfo.forcedByEnv && (
							<p className="mt-1 text-amber-300 text-xs">
								Test mode enabled via VITE_FORCE_UPDATE_NOTIFIER=1.
							</p>
						)}
						<p className="mt-1 text-slate-400 text-xs">
							Open the GitHub release page to download the update.
						</p>
						<div className="mt-4 flex justify-end gap-2">
							<button
								type="button"
								onClick={() => {
									setUpdateInfo(null);
									setManualStatus(null);
								}}
								className="rounded-md border border-slate-600 px-3 py-2 text-slate-200 text-sm hover:bg-slate-800"
							>
								Later
							</button>
							<a
								href={updateInfo.releaseUrl}
								target="_blank"
								rel="noreferrer"
								className="rounded-md bg-sky-500 px-3 py-2 font-medium text-sm text-white hover:bg-sky-400"
							>
								View Release
							</a>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
