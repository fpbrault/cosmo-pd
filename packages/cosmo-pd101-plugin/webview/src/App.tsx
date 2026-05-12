import { useEffect } from "react";
import PluginPage from "./PluginPage";
import "@/index.css";

export default function App() {
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

	return <PluginPage />;
}
