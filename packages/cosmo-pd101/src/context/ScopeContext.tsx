import {
	createContext,
	type ReactNode,
	type RefObject,
	useContext,
} from "react";

type ScopeFrameCallback = (frame: {
	samples: Float32Array;
	sampleRate: number;
	hz: number;
}) => void;

interface ScopeContextType {
	analyserNodeRef: RefObject<AnalyserNode | null>;
	audioCtxRef: RefObject<AudioContext | null>;
	effectivePitchHz: number;
	scopePerformanceMode?: "standard" | "constrained";
	subscribeScopeFrames?: (onFrame: ScopeFrameCallback) => () => void;
}

const ScopeContext = createContext<ScopeContextType | undefined>(undefined);

export const ScopeProvider = ({
	children,
	analyserNodeRef,
	audioCtxRef,
	effectivePitchHz,
	scopePerformanceMode,
	subscribeScopeFrames,
}: {
	children: ReactNode;
	analyserNodeRef: RefObject<AnalyserNode | null>;
	audioCtxRef: RefObject<AudioContext | null>;
	effectivePitchHz: number;
	scopePerformanceMode?: "standard" | "constrained";
	subscribeScopeFrames?: (onFrame: ScopeFrameCallback) => () => void;
}) => {
	return (
		<ScopeContext.Provider
			value={{
				analyserNodeRef,
				audioCtxRef,
				effectivePitchHz,
				scopePerformanceMode,
				subscribeScopeFrames,
			}}
		>
			{children}
		</ScopeContext.Provider>
	);
};

export const useScopeContext = () => {
	const context = useContext(ScopeContext);
	if (!context) {
		throw new Error("useScopeContext must be used within a ScopeProvider");
	}
	return context;
};
