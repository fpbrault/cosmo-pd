import { useCallback, useEffect, useMemo, useState } from "react";
import type { LibraryPreset } from "@/features/synth/types/libraryPreset";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";
import {
	DEFAULT_PRESET,
	deletePreset,
	exportPreset,
	getPresetMetadata,
	importPreset,
	listPresets,
	loadCurrentPresetSession,
	loadCurrentState,
	loadPreset,
	loadShowLibraryPresets,
	type PresetMetadata,
	renamePreset,
	saveCurrentPresetSession,
	saveCurrentState,
	savePreset,
	saveShowLibraryPresets,
	updatePresetMetadata,
} from "@/lib/synth/presetStorage";
import type { FrontendPresetV1 } from "@/lib/synth/presetTypes";

type UseSynthPresetManagerOptions = {
	builtinPresets: Record<string, FrontendPresetV1>;
	gatherState: () => SynthPresetV1;
	applyPreset: (data: SynthPresetV1) => void;
	onBeforeApplyPreset?: () => void;
	libraryPresets?: LibraryPreset[];
	onLoadLibraryPreset?: (preset: LibraryPreset) => void;
	shouldLoadCurrentState?: () => boolean;
	presetStateKey?: string;
};

type UseSynthPresetManagerResult = {
	allPresetEntries: PresetEntry[];
	visiblePresetEntries: PresetEntry[];
	showLibraryPresets: boolean;
	handleToggleLibraryPresets: () => void;
	activePresetId: string | null;
	activePresetNameBase: string;
	activePresetName: string;
	loadedPresetFingerprint: string | null;
	pendingPresetChange: PendingPresetChange | null;
	handleSyncBuiltinSelection: (name: string) => void;
	handleLoadLocal: (name: string) => void;
	handleLoadBuiltin: (name: string) => void;
	handleLoadLibrary: (preset: LibraryPreset) => void;
	handleStepPreset: (direction: -1 | 1) => void;
	handleSavePreset: (name: string) => void;
	handleDeletePreset: (name: string) => void;
	handleRenamePreset: (oldName: string, newName: string) => void;
	handleSetPresetFavorite: (name: string, favorite: boolean) => void;
	handleSetPresetCategory: (name: string, category: string) => void;
	handleSetPresetTags: (name: string, tags: string[]) => void;
	handleInitPreset: () => void;
	handleExportPreset: (name: string) => void;
	handleImportPreset: (json: string, filename: string) => void;
	handleExportCurrentState: (name: string) => void;
	handleSavePendingPresetChange: (name?: string) => void;
	handleDiscardPendingPresetChange: () => void;
	handleCancelPendingPresetChange: () => void;
};

type PendingNavigation =
	| { type: "local"; entryId: string; name: string }
	| { type: "builtin"; entryId: string; name: string }
	| { type: "library"; entryId: string; preset: LibraryPreset };

type PendingPresetChange = {
	activePresetName: string;
	activeLocalName: string | null;
	suggestedName: string;
	changes: PendingPresetDiffEntry[];
};

type PendingPresetDiffEntry = {
	path: string;
	previous: string;
	next: string;
};

type JsonLike = null | boolean | number | string | JsonLike[] | JsonLikeObject;

type JsonLikeObject = {
	[key: string]: JsonLike | undefined;
};

type LocalPresetIndexEntry = {
	name: string;
	favorite: boolean;
	category: string;
	tags: string[];
};

const getBuiltinPresetEntryId = (name: string) => `builtin:${name}`;
const getLocalPresetEntryId = (name: string) => `local:${name}`;
const getLibraryPresetEntryId = (presetId: string) => `library:${presetId}`;
const presetNameCollator = new Intl.Collator(undefined, {
	numeric: true,
	sensitivity: "base",
});

const PRESET_TAG_MAPPINGS: Record<string, string[]> = {
	bass: ["bass", "jaco", "fretless", "slap", "p-bass", "j-bass", "bassline"],
	guitar: ["guitar", "gtr", "guit", "koto"],
	piano: ["pian", "ep", "rhodes", "clav", "harpsi", "key", "kalim", "pluck"],
	synth: ["synth"],
	effect: ["effect", "fx"],
	drum: [
		"drum",
		"kick",
		"snare",
		"hihat",
		"cymbal",
		"tom",
		"perc",
		"conga",
		"bongo",
		"tabla",
	],
	organ: ["organ"],
	pad: ["pad", "str", "string", "swell", "warm", "ambient"],
	lead: ["lead", "solo", "brass", "trumpet", "sax"],
	brass: ["brass", "horn", "trumpet", "trombone", "sax", "flugel"],
	wind: ["flute", "oboe", "clarinet", "wind", "whistle"],
	voice: ["vox", "voice", "choir", "vocal"],
	bell: ["bell", "chime", "mallet"],
	pluck: ["pluck", "plucki", "pick", "harp"],
	keys: ["keys", "key"],
};

function normalizeTags(tags: string[]): string[] {
	return Array.from(
		new Set(
			tags
				.map((tag) => tag.trim().toLowerCase())
				.filter((tag) => tag.length > 0),
		),
	);
}

function inferTagsFromPresetName(name: string): string[] {
	const normalizedName = name.toLowerCase();
	const inferred: string[] = [];
	for (const [tag, keywords] of Object.entries(PRESET_TAG_MAPPINGS)) {
		if (keywords.some((keyword) => normalizedName.includes(keyword))) {
			inferred.push(tag);
		}
	}
	return normalizeTags(inferred);
}

function sortPresetEntries(entries: PresetEntry[]): PresetEntry[] {
	return [...entries].sort((a, b) => {
		const labelCompare = presetNameCollator.compare(a.label, b.label);
		return labelCompare === 0
			? presetNameCollator.compare(a.id, b.id)
			: labelCompare;
	});
}

function getPresetFingerprint(preset: SynthPresetV1): string {
	return JSON.stringify(preset);
}

function parsePresetFingerprint(fingerprint: string | null): JsonLike | null {
	if (!fingerprint) {
		return null;
	}
	try {
		return JSON.parse(fingerprint) as JsonLike;
	} catch {
		return null;
	}
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function roundNumber(value: number): number {
	return Math.round(value * 1e6) / 1e6;
}

function formatDiffValue(value: unknown): string {
	if (typeof value === "string") return `"${value}"`;
	if (typeof value === "number") return String(roundNumber(value));
	if (typeof value === "boolean" || value === null) {
		return String(value);
	}
	if (Array.isArray(value)) return `[${value.length} items]`;
	if (isPlainObject(value)) return "{...}";
	if (typeof value === "undefined") return "undefined";
	return String(value);
}

function collectPresetDiffs(
	previousValue: unknown,
	nextValue: unknown,
	out: PendingPresetDiffEntry[],
	path = "",
	maxEntries = 200,
): void {
	const normalizedPrev =
		typeof previousValue === "number"
			? roundNumber(previousValue)
			: previousValue;
	const normalizedNext =
		typeof nextValue === "number" ? roundNumber(nextValue) : nextValue;
	if (out.length >= maxEntries || Object.is(normalizedPrev, normalizedNext)) {
		return;
	}

	if (Array.isArray(previousValue) && Array.isArray(nextValue)) {
		if (previousValue.length !== nextValue.length) {
			out.push({
				path: path ? `${path}.length` : "length",
				previous: String(previousValue.length),
				next: String(nextValue.length),
			});
			if (out.length >= maxEntries) return;
		}

		for (
			let index = 0;
			index < Math.max(previousValue.length, nextValue.length);
			index++
		) {
			collectPresetDiffs(
				previousValue[index],
				nextValue[index],
				out,
				`${path}[${index}]`,
				maxEntries,
			);
			if (out.length >= maxEntries) return;
		}
		return;
	}

	if (isPlainObject(previousValue) && isPlainObject(nextValue)) {
		const keys = Array.from(
			new Set([...Object.keys(previousValue), ...Object.keys(nextValue)]),
		).sort();
		for (const key of keys) {
			const nextPath = path ? `${path}.${key}` : key;
			collectPresetDiffs(
				previousValue[key],
				nextValue[key],
				out,
				nextPath,
				maxEntries,
			);
			if (out.length >= maxEntries) return;
		}
		return;
	}

	out.push({
		path: path || "(root)",
		previous: formatDiffValue(previousValue),
		next: formatDiffValue(nextValue),
	});
}

export function useSynthPresetManager({
	builtinPresets,
	gatherState,
	applyPreset,
	onBeforeApplyPreset,
	libraryPresets = [],
	onLoadLibraryPreset,
	shouldLoadCurrentState,
	presetStateKey,
}: UseSynthPresetManagerOptions): UseSynthPresetManagerResult {
	const [localPresetEntries, setLocalPresetEntries] = useState<
		LocalPresetIndexEntry[]
	>([]);
	const shouldHydratePersistedState = useMemo(
		() => (shouldLoadCurrentState ? shouldLoadCurrentState() : true),
		[shouldLoadCurrentState],
	);
	const initialPresetSession = useMemo(
		() => (shouldHydratePersistedState ? loadCurrentPresetSession() : null),
		[shouldHydratePersistedState],
	);
	const [activePresetId, setActivePresetId] = useState<string | null>(
		initialPresetSession?.activePresetId ?? null,
	);
	const [activePresetNameBase, setActivePresetNameBase] = useState(
		initialPresetSession?.activePresetNameBase ?? "Current State",
	);
	const [loadedPresetFingerprint, setLoadedPresetFingerprint] = useState<
		string | null
	>(initialPresetSession?.loadedPresetFingerprint ?? null);
	const [showLibraryPresets, setShowLibraryPresets] = useState<boolean>(() =>
		loadShowLibraryPresets(),
	);
	const [pendingNavigation, setPendingNavigation] =
		useState<PendingNavigation | null>(null);
	const currentPresetFingerprint =
		presetStateKey ?? getPresetFingerprint(gatherState());
	const hasUnsavedChanges =
		loadedPresetFingerprint !== null &&
		currentPresetFingerprint !== loadedPresetFingerprint;
	const activePresetName = hasUnsavedChanges
		? `${activePresetNameBase} *`
		: activePresetNameBase;
	const activeLocalName = activePresetId?.startsWith("local:")
		? activePresetNameBase
		: null;
	const pendingPresetChange = useMemo(() => {
		if (!pendingNavigation) {
			return null;
		}

		const changes: PendingPresetDiffEntry[] = [];
		const previousPreset = parsePresetFingerprint(loadedPresetFingerprint);
		const currentPreset = parsePresetFingerprint(currentPresetFingerprint);

		if (previousPreset !== null && currentPreset !== null) {
			collectPresetDiffs(previousPreset, currentPreset, changes);
		}

		if (changes.length === 0 && hasUnsavedChanges) {
			changes.push({
				path: "(preset)",
				previous: "saved preset",
				next: "current state",
			});
		}

		return {
			activePresetName: activePresetNameBase,
			activeLocalName,
			suggestedName:
				activePresetNameBase === "Current State" ? "" : activePresetNameBase,
			changes,
		};
	}, [
		activeLocalName,
		activePresetNameBase,
		currentPresetFingerprint,
		hasUnsavedChanges,
		loadedPresetFingerprint,
		pendingNavigation,
	]);

	const captureLoadedPresetFingerprint = useCallback(() => {
		setLoadedPresetFingerprint(getPresetFingerprint(gatherState()));
	}, [gatherState]);

	const requestPresetChange = useCallback(
		(navigation: PendingNavigation) => {
			if (!hasUnsavedChanges || navigation.entryId === activePresetId)
				return true;
			setPendingNavigation(navigation);
			return false;
		},
		[activePresetId, hasUnsavedChanges],
	);

	const loadLocalPreset = useCallback(
		(name: string) => {
			const data = loadPreset(name);
			if (!data) return;
			onBeforeApplyPreset?.();
			applyPreset(data);
			setActivePresetId(getLocalPresetEntryId(name));
			setActivePresetNameBase(name);
			captureLoadedPresetFingerprint();
		},
		[applyPreset, captureLoadedPresetFingerprint, onBeforeApplyPreset],
	);

	const loadBuiltinPreset = useCallback(
		(name: string) => {
			const preset = builtinPresets[name];
			if (!preset) return;
			onBeforeApplyPreset?.();
			applyPreset(preset.data);
			setActivePresetId(getBuiltinPresetEntryId(name));
			setActivePresetNameBase(name);
			captureLoadedPresetFingerprint();
		},
		[
			applyPreset,
			builtinPresets,
			captureLoadedPresetFingerprint,
			onBeforeApplyPreset,
		],
	);

	const loadLibraryPreset = useCallback(
		(preset: LibraryPreset) => {
			if (!onLoadLibraryPreset) return;
			onBeforeApplyPreset?.();
			onLoadLibraryPreset(preset);
			setActivePresetId(getLibraryPresetEntryId(preset.id));
			setActivePresetNameBase(preset.name);
			captureLoadedPresetFingerprint();
		},
		[captureLoadedPresetFingerprint, onBeforeApplyPreset, onLoadLibraryPreset],
	);

	const handleLoadLocal = useCallback(
		(name: string) => {
			const nextEntryId = getLocalPresetEntryId(name);
			if (!requestPresetChange({ type: "local", entryId: nextEntryId, name })) {
				return;
			}
			loadLocalPreset(name);
		},
		[loadLocalPreset, requestPresetChange],
	);

	const handleLoadBuiltin = useCallback(
		(name: string) => {
			const nextEntryId = getBuiltinPresetEntryId(name);
			if (
				!requestPresetChange({ type: "builtin", entryId: nextEntryId, name })
			) {
				return;
			}
			loadBuiltinPreset(name);
		},
		[loadBuiltinPreset, requestPresetChange],
	);

	const handleSyncBuiltinSelection = useCallback(
		(name: string) => {
			const hasBuiltinPreset = Object.hasOwn(builtinPresets, name);
			setActivePresetId(hasBuiltinPreset ? getBuiltinPresetEntryId(name) : null);
			setActivePresetNameBase(name);
			captureLoadedPresetFingerprint();
		},
		[builtinPresets, captureLoadedPresetFingerprint],
	);

	const handleLoadLibrary = useCallback(
		(preset: LibraryPreset) => {
			const nextEntryId = getLibraryPresetEntryId(preset.id);
			if (
				!requestPresetChange({ type: "library", entryId: nextEntryId, preset })
			) {
				return;
			}
			loadLibraryPreset(preset);
		},
		[loadLibraryPreset, requestPresetChange],
	);

	const refreshLocalPresetEntries = useCallback(() => {
		const entries = listPresets()
			.map((name) => {
				const metadata = getPresetMetadata(name);
				return {
					name,
					favorite: metadata?.favorite ?? false,
					category: metadata?.category ?? "",
					tags: metadata?.tags ?? [],
				};
			})
			.sort((a, b) => presetNameCollator.compare(a.name, b.name));
		setLocalPresetEntries(entries);
	}, []);

	const getLocalMetadata = useCallback(
		(name: string): PresetMetadata => {
			const localEntry = localPresetEntries.find(
				(entry) => entry.name === name,
			);
			if (!localEntry) {
				return {
					favorite: false,
					category: "",
					tags: [],
				};
			}
			return {
				favorite: localEntry.favorite,
				category: localEntry.category,
				tags: localEntry.tags,
			};
		},
		[localPresetEntries],
	);

	const allPresetEntries = useMemo(
		(): PresetEntry[] => [
			...sortPresetEntries(
				Object.entries(builtinPresets).map(([name, preset]) => {
					const inferredTags = inferTagsFromPresetName(name);
					const builtinTags = normalizeTags(
						preset.tags.length > 0 ? preset.tags : inferredTags,
					);
					return {
						id: getBuiltinPresetEntryId(name),
						label: name,
						type: "builtin" as const,
						sourceLabel: "Built-in",
						starred: true,
						favorite: preset.favorite,
						category: preset.category,
						tags: builtinTags,
					};
				}),
			),
			...sortPresetEntries(
				localPresetEntries.map((entry) => ({
					id: getLocalPresetEntryId(entry.name),
					label: entry.name,
					type: "local" as const,
					sourceLabel: "User",
					starred: false,
					favorite: entry.favorite,
					category: entry.category,
					tags: entry.tags,
				})),
			),
			...sortPresetEntries(
				libraryPresets.map((preset) => {
					const presetTags = normalizeTags(
						preset.tags && preset.tags.length > 0
							? preset.tags
							: inferTagsFromPresetName(preset.name),
					);
					return {
						id: getLibraryPresetEntryId(preset.id),
						label: preset.name,
						type: "library" as const,
						sourceLabel: "CZ library",
						starred: false,
						favorite: false,
						category: preset.category ?? "",
						tags: presetTags,
						preset,
					};
				}),
			),
		],
		[builtinPresets, localPresetEntries, libraryPresets],
	);

	const visiblePresetEntries = useMemo(
		() =>
			showLibraryPresets
				? allPresetEntries
				: allPresetEntries.filter((entry) => entry.type !== "library"),
		[allPresetEntries, showLibraryPresets],
	);

	const handleToggleLibraryPresets = useCallback(() => {
		setShowLibraryPresets((previous) => {
			const next = !previous;
			saveShowLibraryPresets(next);
			return next;
		});
	}, []);

	const activePresetIndex = useMemo(
		() =>
			visiblePresetEntries.findIndex((entry) => entry.id === activePresetId),
		[visiblePresetEntries, activePresetId],
	);

	const handleStepPreset = useCallback(
		(direction: -1 | 1) => {
			if (visiblePresetEntries.length === 0) return;
			let next: number;
			if (activePresetIndex < 0) {
				next = direction === 1 ? 0 : visiblePresetEntries.length - 1;
			} else {
				next =
					(activePresetIndex + direction + visiblePresetEntries.length) %
					visiblePresetEntries.length;
			}
			const entry = visiblePresetEntries[next];
			if (!entry) return;
			if (entry.type === "local") {
				handleLoadLocal(entry.label);
				return;
			}
			if (entry.type === "builtin") {
				handleLoadBuiltin(entry.label);
				return;
			}
			if (entry.type === "library" && "preset" in entry && entry.preset) {
				handleLoadLibrary(entry.preset);
			}
		},
		[
			visiblePresetEntries,
			activePresetIndex,
			handleLoadLocal,
			handleLoadBuiltin,
			handleLoadLibrary,
		],
	);

	const completePendingNavigation = useCallback(
		(navigation: PendingNavigation | null) => {
			if (!navigation) return;
			setPendingNavigation(null);
			if (navigation.type === "local") {
				loadLocalPreset(navigation.name);
				return;
			}
			if (navigation.type === "builtin") {
				loadBuiltinPreset(navigation.name);
				return;
			}
			loadLibraryPreset(navigation.preset);
		},
		[loadBuiltinPreset, loadLibraryPreset, loadLocalPreset],
	);

	const handleSavePendingPresetChange = useCallback(
		(name?: string) => {
			const navigation = pendingNavigation;
			if (!navigation) return;
			const saveName = activeLocalName ?? name?.trim();
			if (!saveName) return;
			savePreset(saveName, gatherState(), getLocalMetadata(saveName));
			refreshLocalPresetEntries();
			captureLoadedPresetFingerprint();
			completePendingNavigation(navigation);
		},
		[
			activeLocalName,
			captureLoadedPresetFingerprint,
			completePendingNavigation,
			gatherState,
			getLocalMetadata,
			pendingNavigation,
			refreshLocalPresetEntries,
		],
	);

	const handleDiscardPendingPresetChange = useCallback(() => {
		completePendingNavigation(pendingNavigation);
	}, [completePendingNavigation, pendingNavigation]);

	const handleCancelPendingPresetChange = useCallback(() => {
		setPendingNavigation(null);
	}, []);

	const handleSavePreset = useCallback(
		(name: string) => {
			const metadataSourceName = activeLocalName ?? name;
			savePreset(name, gatherState(), getLocalMetadata(metadataSourceName));
			refreshLocalPresetEntries();
			setActivePresetId(getLocalPresetEntryId(name));
			setActivePresetNameBase(name);
			captureLoadedPresetFingerprint();
		},
		[
			activeLocalName,
			captureLoadedPresetFingerprint,
			gatherState,
			getLocalMetadata,
			refreshLocalPresetEntries,
		],
	);

	const handleDeletePreset = useCallback(
		(name: string) => {
			deletePreset(name);
			refreshLocalPresetEntries();
			setActivePresetId((prev) =>
				prev === getLocalPresetEntryId(name) ? null : prev,
			);
			setActivePresetNameBase((prev) =>
				prev === name ? "Current State" : prev,
			);
			setLoadedPresetFingerprint((prev) =>
				activePresetId === getLocalPresetEntryId(name) ? null : prev,
			);
		},
		[activePresetId, refreshLocalPresetEntries],
	);

	const handleRenamePreset = useCallback(
		(oldName: string, newName: string) => {
			const trimmed = newName.trim();
			if (!trimmed || trimmed === oldName) return;
			renamePreset(oldName, trimmed);
			refreshLocalPresetEntries();
			setActivePresetId((prev) =>
				prev === getLocalPresetEntryId(oldName)
					? getLocalPresetEntryId(trimmed)
					: prev,
			);
			setActivePresetNameBase((prev) => (prev === oldName ? trimmed : prev));
		},
		[refreshLocalPresetEntries],
	);

	const handleSetPresetFavorite = useCallback(
		(name: string, favorite: boolean) => {
			if (!updatePresetMetadata(name, { favorite })) {
				return;
			}
			refreshLocalPresetEntries();
		},
		[refreshLocalPresetEntries],
	);

	const handleSetPresetCategory = useCallback(
		(name: string, category: string) => {
			if (!updatePresetMetadata(name, { category })) {
				return;
			}
			refreshLocalPresetEntries();
		},
		[refreshLocalPresetEntries],
	);

	const handleSetPresetTags = useCallback(
		(name: string, tags: string[]) => {
			if (!updatePresetMetadata(name, { tags })) {
				return;
			}
			refreshLocalPresetEntries();
		},
		[refreshLocalPresetEntries],
	);

	const handleInitPreset = useCallback(() => {
		onBeforeApplyPreset?.();
		applyPreset(DEFAULT_PRESET);
		setActivePresetId(null);
		setActivePresetNameBase("Current State");
		captureLoadedPresetFingerprint();
	}, [applyPreset, captureLoadedPresetFingerprint, onBeforeApplyPreset]);

	const handleExportPreset = useCallback((name: string) => {
		const json = exportPreset(name);
		if (!json) return;
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${name}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}, []);

	const handleImportPreset = useCallback(
		(json: string, filename: string) => {
			const importedPreset = importPreset(json);
			if (!importedPreset) return;
			const name = filename.trim() || "imported";
			const existing = listPresets();
			let candidate = name;
			let n = 2;
			while (existing.includes(candidate)) {
				candidate = `${name} ${n++}`;
			}
			savePreset(candidate, importedPreset.data, {
				favorite: importedPreset.favorite,
				category: importedPreset.category,
				tags: importedPreset.tags,
			});
			refreshLocalPresetEntries();
			onBeforeApplyPreset?.();
			applyPreset(importedPreset.data);
			setActivePresetId(getLocalPresetEntryId(candidate));
			setActivePresetNameBase(candidate);
			captureLoadedPresetFingerprint();
		},
		[
			applyPreset,
			captureLoadedPresetFingerprint,
			onBeforeApplyPreset,
			refreshLocalPresetEntries,
		],
	);

	const handleExportCurrentState = useCallback(
		(name: string) => {
			const state = gatherState();
			const json = JSON.stringify({ _name: name, ...state }, null, 2);
			const blob = new Blob([json], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${name}.json`;
			a.click();
			URL.revokeObjectURL(url);
		},
		[gatherState],
	);

	useEffect(() => {
		refreshLocalPresetEntries();
		if (!shouldHydratePersistedState) return;
		if (!initialPresetSession) {
			// In test mode, don't auto-load builtin presets to avoid overwriting test param updates
			const isTestMode = import.meta.env.VITE_TEST_HARNESS === "1";
			if (!isTestMode) {
				const firstPresetName = Object.keys(builtinPresets)[0];
				if (firstPresetName) {
					loadBuiltinPreset(firstPresetName);
					return;
				}
			}
		}
		const saved = loadCurrentState();
		if (saved) applyPreset(saved);
	}, [
		applyPreset,
		builtinPresets,
		initialPresetSession,
		loadBuiltinPreset,
		refreshLocalPresetEntries,
		shouldHydratePersistedState,
	]);

	useEffect(() => {
		const timer = setTimeout(() => {
			saveCurrentState(gatherState());
			saveCurrentPresetSession({
				activePresetId,
				activePresetNameBase,
				loadedPresetFingerprint,
			});
		}, 500);
		return () => clearTimeout(timer);
	}, [
		activePresetId,
		activePresetNameBase,
		gatherState,
		loadedPresetFingerprint,
	]);

	return {
		allPresetEntries,
		visiblePresetEntries,
		showLibraryPresets,
		handleToggleLibraryPresets,
		activePresetId,
		activePresetNameBase,
		activePresetName,
		loadedPresetFingerprint,
		pendingPresetChange,
		handleSyncBuiltinSelection,
		handleLoadLocal,
		handleLoadBuiltin,
		handleLoadLibrary,
		handleStepPreset,
		handleSavePreset,
		handleDeletePreset,
		handleRenamePreset,
		handleSetPresetFavorite,
		handleSetPresetCategory,
		handleSetPresetTags,
		handleInitPreset,
		handleExportPreset,
		handleImportPreset,
		handleExportCurrentState,
		handleSavePendingPresetChange,
		handleDiscardPendingPresetChange,
		handleCancelPendingPresetChange,
	};
}
