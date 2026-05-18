export type MidiLearnTargetKey = string;

type MidiLearnTargetRegistration = {
	label?: string;
	apply: (rawValue: number) => void;
};

const midiLearnRegistry = new Map<
	MidiLearnTargetKey,
	MidiLearnTargetRegistration
>();

export function registerMidiLearnTarget(
	targetKey: MidiLearnTargetKey,
	registration: MidiLearnTargetRegistration,
) {
	midiLearnRegistry.set(targetKey, registration);

	return () => {
		const current = midiLearnRegistry.get(targetKey);
		if (current === registration) {
			midiLearnRegistry.delete(targetKey);
		}
	};
}

export function applyRegisteredMidiLearnTarget(
	targetKey: MidiLearnTargetKey,
	rawValue: number,
): boolean {
	const registration = midiLearnRegistry.get(targetKey);
	if (!registration) {
		return false;
	}

	registration.apply(rawValue);
	return true;
}

export function getMidiLearnTargetLabel(
	targetKey: MidiLearnTargetKey,
): string | undefined {
	return midiLearnRegistry.get(targetKey)?.label;
}
