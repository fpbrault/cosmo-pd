import {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import type { PresetLibraryFilters } from "./presetLibraryFilters";
import type { PresetLibrarySortState } from "./presetLibrarySort";

type PresetLibraryFiltersContextValue = PresetLibraryFilters & {
	setSearch: Dispatch<SetStateAction<string>>;
	setAuthorFilter: Dispatch<SetStateAction<string | null>>;
	setBankFilter: Dispatch<SetStateAction<string | null>>;
	setTagFilters: Dispatch<SetStateAction<string[]>>;
	sortState: PresetLibrarySortState;
	setSortState: Dispatch<SetStateAction<PresetLibrarySortState>>;
	clearFilters: () => void;
};

const PresetLibraryFiltersContext =
	createContext<PresetLibraryFiltersContextValue | null>(null);

export function PresetLibraryFiltersProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [search, setSearch] = useState("");
	const [authorFilter, setAuthorFilter] = useState<string | null>(null);
	const [bankFilter, setBankFilter] = useState<string | null>(null);
	const [tagFilters, setTagFilters] = useState<string[]>([]);
	const [sortState, setSortState] = useState<PresetLibrarySortState>({
		key: "star",
		direction: "desc",
	});

	const clearFilters = useCallback(() => {
		setSearch("");
		setAuthorFilter(null);
		setBankFilter(null);
		setTagFilters([]);
	}, []);

	const value = useMemo<PresetLibraryFiltersContextValue>(
		() => ({
			search,
			authorFilter,
			bankFilter,
			tagFilters,
			sortState,
			setSearch,
			setAuthorFilter,
			setBankFilter,
			setTagFilters,
			setSortState,
			clearFilters,
		}),
		[authorFilter, bankFilter, clearFilters, search, sortState, tagFilters],
	);

	return (
		<PresetLibraryFiltersContext.Provider value={value}>
			{children}
		</PresetLibraryFiltersContext.Provider>
	);
}

export function usePresetLibraryFilters(): PresetLibraryFiltersContextValue {
	const value = useContext(PresetLibraryFiltersContext);
	if (!value) {
		throw new Error(
			"usePresetLibraryFilters must be used within PresetLibraryFiltersProvider",
		);
	}
	return value;
}
