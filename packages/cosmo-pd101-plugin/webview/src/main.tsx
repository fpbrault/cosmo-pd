import { initI18n } from "@cosmo/cosmo-pd101";
import { Component, type ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { installGlobalHostErrorHandlers, postHostLog } from "./lib/hostLogger";
import { ensurePluginBridge } from "./lib/pluginBridge";

installGlobalHostErrorHandlers();

// TODO: TEST HARNESS BLOCK — Vite statically eliminates this branch when
// VITE_TEST_HARNESS is not set, so mock modules are excluded from production builds.
const IS_TEST_HARNESS = import.meta.env.VITE_TEST_HARNESS === "1";

initI18n();
postHostLog("info", "main.tsx: initI18n complete");

const root = document.getElementById("root");
if (!root) throw new Error("No #root element found");
const rootContainer = root;

type PluginErrorBoundaryState = {
	hasError: boolean;
	errorMessage: string;
};

class PluginErrorBoundary extends Component<
	{ children: ReactNode },
	PluginErrorBoundaryState
> {
	public constructor(props: { children: ReactNode }) {
		super(props);
		this.state = { hasError: false, errorMessage: "" };
	}

	public static getDerivedStateFromError(
		error: unknown,
	): PluginErrorBoundaryState {
		const message =
			error instanceof Error
				? `${error.name}: ${error.message}`
				: "Unknown plugin UI error";
		return { hasError: true, errorMessage: message };
	}

	public componentDidCatch(error: unknown): void {
		const message =
			error instanceof Error
				? `${error.name}: ${error.message}\n${error.stack ?? ""}`
				: String(error);
		postHostLog("error", `PluginErrorBoundary: ${message}`);
	}

	public render(): ReactNode {
		if (this.state.hasError) {
			return (
				<div className="h-dvh w-full bg-cz-panel p-4 text-cz-cream">
					<div className="rounded border border-cz-border bg-black/35 p-3 font-mono text-xs tracking-[0.04em]">
						Plugin UI failed to initialize.
						<br />
						{this.state.errorMessage}
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

async function init() {
	let RootComponent: React.ComponentType = App;
	postHostLog("info", "main.tsx: init start");

	try {
		const installed = ensurePluginBridge();
		postHostLog("info", `main.tsx: ensurePluginBridge=${installed}`);
	} catch (error) {
		postHostLog(
			"error",
			`main.tsx: ensurePluginBridge threw: ${String(error)}`,
		);
	}

	if (IS_TEST_HARNESS) {
		const [{ installMockPluginBridge }, { default: TestHarness }] =
			await Promise.all([
				import("./test/mockPluginBridge"),
				import("./test/TestHarness"),
			]);
		// Install the mock bridge before React renders so that
		// ensurePluginBridge() inside App finds native ipc immediately.
		installMockPluginBridge();
		RootComponent = TestHarness;
	}

	createRoot(rootContainer).render(
		<StrictMode>
			<PluginErrorBoundary>
				<RootComponent />
			</PluginErrorBoundary>
		</StrictMode>,
	);
	postHostLog("info", "main.tsx: React render dispatched");
}

void init().catch((error) => {
	const message =
		error instanceof Error
			? `${error.name}: ${error.message}\n${error.stack ?? ""}`
			: String(error);
	postHostLog("error", `main.tsx: init failed: ${message}`);
});
