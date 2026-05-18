declare global {
	interface Window {
		ipc?: { postMessage: (msg: string) => void };
		__czGetParams?: () => Promise<unknown>;
		__czSetParams?: (json: string) => void;
		__czGetTransportInfo?: () => Promise<unknown>;
		__czOnScope?: (samples: number[], sampleRate: number, hz: number) => void;
	}
}

let installed = false;
let currentParamsJson: string | null = null;

function shouldInstallStandaloneBridge(): boolean {
	const params = new URLSearchParams(window.location.search);
	return params.get("standalone") === "1";
}

export function ensureStandaloneBridge(): boolean {
	if (installed) {
		return true;
	}
	if (!shouldInstallStandaloneBridge()) {
		return false;
	}

	installed = true;
	window.ipc = {
		postMessage() {
			// Standalone UI mode does not have a plugin host to notify.
		},
	};
	window.__czGetParams = async () => {
		if (!currentParamsJson) {
			return null;
		}
		try {
			return JSON.parse(currentParamsJson) as unknown;
		} catch {
			return null;
		}
	};
	window.__czSetParams = (json: string) => {
		currentParamsJson = json;
	};
	window.__czGetTransportInfo = async () => null;
	return true;
}
