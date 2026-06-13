import { postPluginIpc } from "./postPluginIpc";

export type HostLogLevel = "debug" | "info" | "warn" | "error";

let installed = false;
let postingToHost = false;
let originalConsoleError: typeof console.error | null = null;
let originalConsoleWarn: typeof console.warn | null = null;

function stringifyUnknownError(error: unknown): string {
	if (error instanceof Error) {
		return `${error.name}: ${error.message}${error.stack ? `\n${error.stack}` : ""}`;
	}
	return String(error);
}

export function postHostLog(level: HostLogLevel, message: string) {
	if (postingToHost) {
		return;
	}
	try {
		postingToHost = true;
		if (window.ipc?.postMessage) {
			postPluginIpc(window.ipc.postMessage.bind(window.ipc), "clientLog", {
				level,
				message,
			});
		}
	} catch {
		// Ignore logging failures in browser/test harness mode.
	} finally {
		postingToHost = false;
	}
}

function patchConsoleMethod(
	method: "error" | "warn",
	original: typeof console.error,
) {
	return (...args: unknown[]) => {
		original(...args);
		const message = args.map((arg) => stringifyUnknownError(arg)).join(" ");
		postHostLog(method, `console.${method}: ${message}`);
	};
}

export function installGlobalHostErrorHandlers() {
	if (installed) {
		return;
	}
	installed = true;

	window.addEventListener("error", (event) => {
		const message =
			event.error instanceof Error
				? stringifyUnknownError(event.error)
				: `${String(event.message)} @ ${event.filename}:${event.lineno}:${event.colno}`;
		postHostLog("error", `window.onerror: ${message}`);
	});

	window.addEventListener("unhandledrejection", (event) => {
		postHostLog(
			"error",
			`unhandledrejection: ${stringifyUnknownError(event.reason)}`,
		);
	});

	originalConsoleError ??= console.error.bind(console);
	originalConsoleWarn ??= console.warn.bind(console);
	console.error = patchConsoleMethod("error", originalConsoleError);
	console.warn = patchConsoleMethod("warn", originalConsoleWarn);
}

export function __resetHostLoggerForTests() {
	installed = false;
	postingToHost = false;
	if (originalConsoleError) {
		console.error = originalConsoleError;
	}
	if (originalConsoleWarn) {
		console.warn = originalConsoleWarn;
	}
	originalConsoleError = null;
	originalConsoleWarn = null;
}
