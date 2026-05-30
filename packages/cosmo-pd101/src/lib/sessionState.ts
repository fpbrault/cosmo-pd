export type SessionEditorState = {
	mainPanelMode?: string;
	phaseLinePanelTab?: string;
	activeEnvTab?: string;
	keyboardVisible?: boolean;
	keyboardOctaves?: number;
	keyboardRange?: number;
	keyboardHeight?: number;
	keyboardInputMode?: string;
	libraryModeOpen?: boolean;
	scopeCycles?: number;
	scopeVerticalZoom?: number;
	scopeTriggerLevel?: number;
	scopeVisualizationMode?: string;
	scopeColorTheme?: string;
};

export type SessionMidiMapping = {
	paramKey: string;
	channel: number;
	cc: number;
};

export type SessionState = {
	editorState?: SessionEditorState;
	midiMappings?: SessionMidiMapping[];
};
