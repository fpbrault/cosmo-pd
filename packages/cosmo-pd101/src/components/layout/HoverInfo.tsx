import {
	createContext,
	type HTMLAttributes,
	type PropsWithChildren,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

type HoverInfoContextValue = {
	hoverInfo: string | null;
	infoText: string;
	setHoverInfo: (message: string | null | undefined) => void;
	clearHoverInfo: () => void;
};

const HoverInfoContext = createContext<HoverInfoContextValue | null>(null);

type HoverInfoProviderProps = PropsWithChildren<{
	defaultInfoText?: string;
}>;

function formatInfoText(
	hoverInfo: string | null,
	defaultInfoText: string,
): string {
	return hoverInfo ?? defaultInfoText;
}

export function HoverInfoProvider({
	children,
	defaultInfoText = "Hover any control for context.",
}: HoverInfoProviderProps) {
	const [hoverInfo, setHoverInfoState] = useState<string | null>(null);

	const setHoverInfo = useCallback((message: string | null | undefined) => {
		setHoverInfoState(message?.trim() ? message : null);
	}, []);

	const clearHoverInfo = useCallback(() => {
		setHoverInfoState(null);
	}, []);

	const infoText = formatInfoText(hoverInfo, defaultInfoText);

	const value = useMemo(
		() => ({
			hoverInfo,
			infoText,
			setHoverInfo,
			clearHoverInfo,
		}),
		[hoverInfo, infoText, setHoverInfo, clearHoverInfo],
	);

	return (
		<HoverInfoContext.Provider value={value}>
			{children}
		</HoverInfoContext.Provider>
	);
}

export function useHoverInfo() {
	const context = useContext(HoverInfoContext);

	if (!context) {
		return {
			hoverInfo: null,
			infoText: "Hover any control for context.",
			setHoverInfo: (_message: string | null | undefined) => {},
			clearHoverInfo: () => {},
		};
	}

	return context;
}

type HoverInfoHandlersOptions = {
	useCapture?: boolean;
};

type HoverInfoHandlers = Pick<
	HTMLAttributes<HTMLElement>,
	| "onPointerEnter"
	| "onPointerLeave"
	| "onFocus"
	| "onBlur"
	| "onFocusCapture"
	| "onBlurCapture"
>;

export function useHoverInfoHandlers(
	message: string | null | undefined,
	{ useCapture = false }: HoverInfoHandlersOptions = {},
): HoverInfoHandlers {
	const { setHoverInfo, clearHoverInfo } = useHoverInfo();

	return useMemo(() => {
		if (!message?.trim()) {
			return {};
		}

		if (useCapture) {
			return {
				onPointerEnter: () => setHoverInfo(message),
				onPointerLeave: clearHoverInfo,
				onFocusCapture: () => setHoverInfo(message),
				onBlurCapture: clearHoverInfo,
			};
		}

		return {
			onPointerEnter: () => setHoverInfo(message),
			onPointerLeave: clearHoverInfo,
			onFocus: () => setHoverInfo(message),
			onBlur: clearHoverInfo,
		};
	}, [clearHoverInfo, message, setHoverInfo, useCapture]);
}

export function HoverInfoTrigger({
	message,
	children,
	useCapture,
}: {
	message: string;
	children: (handlers: HoverInfoHandlers) => ReactNode;
	useCapture?: boolean;
}) {
	const handlers = useHoverInfoHandlers(message, { useCapture });
	return <>{children(handlers)}</>;
}
