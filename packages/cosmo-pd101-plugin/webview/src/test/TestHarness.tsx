/**
 * TestHarness — Wraps the plugin UI for mock-host E2E testing.
 *
 * Rendered instead of App when VITE_TEST_HARNESS=1.
 * Shows a collapsible Debug Panel with:
 *   - Virtual DSP param snapshot
 *   - Outbound message history (last 20)
 *   - Manual param push controls for inbound simulation
 *
 * Visibility: always shown when VITE_TEST_HARNESS=1.
 * Also toggleable in local dev via VITE_DEBUG_PANEL=1 (opens by default).
 *
 * TODO: Remove when harness is promoted to a permanent CI fixture.
 */
import { useSynthStore } from "@cosmo/cosmo-pd101";
import { useCallback, useEffect, useRef, useState } from "react";
import App from "../App";
import type { MockBridgeMessage } from "./mockPluginBridge";

declare global {
	interface Window {
		__testSetAlgo?: (line: 1 | 2, algo: string) => void;
		__testGetParam?: (key: string) => unknown;
		__testSetParam?: (key: string, value: unknown) => void;
	}
}

// Toggle-open default: respect VITE_DEBUG_PANEL env or fall back to test mode.
const DEBUG_PANEL_DEFAULT_OPEN = import.meta.env.VITE_DEBUG_PANEL === "1";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function MessageRow({ msg }: { msg: MockBridgeMessage }) {
	const color =
		msg.type === "param:set"
			? "text-green-400"
			: msg.type === "param:begin"
				? "text-sky-400"
				: msg.type === "param:end"
					? "text-yellow-400"
					: msg.type === "invoke"
						? "text-purple-400"
						: "text-base-content/60";

	const fullText = JSON.stringify(msg, null, 2);

	return (
		<div
			className={`flex gap-1 border-base-content/5 border-b px-1 py-0.5 ${color} hover:bg-base-content/5`}
		>
			<span className="w-20 shrink-0 font-bold">{msg.type}</span>
			<span className="flex-1 break-words text-base-content/70">
				{fullText}
			</span>
		</div>
	);
}

// ---------------------------------------------------------------------------
// TestHarness
// ---------------------------------------------------------------------------

export default function TestHarness() {
	const [panelOpen, setPanelOpen] = useState(DEBUG_PANEL_DEFAULT_OPEN);
	const [messages, setMessages] = useState<MockBridgeMessage[]>([]);
	const [virtualState, setVirtualState] = useState<Record<string, number>>({});

	// Expose direct store helpers for E2E tests.
	useEffect(() => {
		window.__testSetAlgo = (line: 1 | 2, algo: string) => {
			const s = useSynthStore.getState();
			if (line === 1)
				s.setWarpAAlgo(algo as Parameters<typeof s.setWarpAAlgo>[0]);
			else s.setWarpBAlgo(algo as Parameters<typeof s.setWarpBAlgo>[0]);
		};
		window.__testGetParam = (key: string) => {
			const s = useSynthStore.getState() as Record<string, unknown>;
			return s[key];
		};
		window.__testSetParam = (key: string, value: unknown) => {
			useSynthStore.setState({ [key]: value } as Partial<
				ReturnType<typeof useSynthStore.getState>
			>);
		};
		return () => {
			delete window.__testSetAlgo;
			delete window.__testGetParam;
			delete window.__testSetParam;
		};
	}, []);

	// Inbound simulation form state
	const [pushParamId, setPushParamId] = useState("0");
	const [pushValue, setPushValue] = useState("0.5");
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Subscribe to mock bridge events.
	useEffect(() => {
		const bridge = window.__MOCK_BRIDGE__;
		if (!bridge) return;

		const getFilteredMessages = () =>
			bridge
				.getMessages()
				.filter(
					(msg) => !(msg.type === "invoke" && msg.method === "getScopeData"),
				)
				.slice(-20);

		// Seed with any messages that arrived before mount.
		setMessages(getFilteredMessages());
		setVirtualState(bridge.getState());

		const unsub = bridge.onMessage((msg) => {
			if (!(msg.type === "invoke" && msg.method === "getScopeData")) {
				console.log("[mock-bridge]", msg);
			}
			setMessages(getFilteredMessages());
			setVirtualState(bridge.getState());
		});

		return unsub;
	}, []);

	// Scroll to latest message when messages array changes.
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional — triggers scroll on new messages
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handlePushParam = useCallback(() => {
		const numericId = Number.parseInt(pushParamId, 10);
		const id: string | number = Number.isNaN(numericId)
			? pushParamId
			: numericId;
		const val = Number.parseFloat(pushValue);
		if (!Number.isNaN(val)) {
			window.__MOCK_BRIDGE__?.pushParamUpdate(id, val);
		}
	}, [pushParamId, pushValue]);

	const handleClearMessages = useCallback(() => {
		window.__MOCK_BRIDGE__?.clearMessages();
		setMessages([]);
	}, []);

	return (
		<div className="relative h-dvh" data-testid="test-harness">
			{/* The actual plugin UI — unchanged from production */}
			<App />

			{/* Floating toggle button — always present in test mode */}
			<button
				type="button"
				className="fixed bottom-2 left-2 z-[9999] rounded border border-base-content/30 bg-base-300/90 px-2 py-1 font-mono text-2xs text-base-content/80 shadow backdrop-blur hover:bg-base-300"
				onClick={() => setPanelOpen((o) => !o)}
				data-testid="debug-panel-toggle"
			>
				{panelOpen ? "Hide Mock Debug" : "Mock Debug"}
			</button>

			{/* Debug Panel */}
			{panelOpen && (
				<div
					className="fixed bottom-8 left-2 z-[9998] flex max-h-[60vh] w-96 flex-col overflow-hidden rounded border border-base-content/30 bg-base-300/95 shadow-xl backdrop-blur"
					data-testid="debug-panel"
				>
					{/* Header */}
					<div className="flex items-center justify-between border-base-content/20 border-b px-3 py-1.5">
						<span className="font-bold font-mono text-2xs text-base-content/80">
							MOCK HOST DEBUG
						</span>
						<span
							className="font-mono text-3xs text-base-content/50"
							data-testid="debug-message-count"
						>
							{messages.length} msgs
						</span>
					</div>

					{/* Virtual DSP state */}
					<div className="border-base-content/10 border-b px-3 py-1.5">
						<div className="mb-1 font-mono text-3xs text-base-content/50 uppercase tracking-wider">
							Virtual DSP State
						</div>
						<div
							className="grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono text-3xs"
							data-testid="debug-dsp-state"
						>
							{Object.entries(virtualState).map(([id, val]) => (
								<div
									key={id}
									className="flex justify-between text-base-content/70"
								>
									<span>id:{id}</span>
									<span className="text-primary">{val.toFixed(3)}</span>
								</div>
							))}
						</div>
					</div>

					{/* Inbound push controls */}
					<div className="border-base-content/10 border-b px-3 py-1.5">
						<div className="mb-1 font-mono text-3xs text-base-content/50 uppercase tracking-wider">
							Push Inbound (Numeric or String ID → Value)
						</div>
						<div className="flex gap-1">
							<input
								type="text"
								value={pushParamId}
								onChange={(e) => setPushParamId(e.target.value)}
								className="w-16 rounded border border-base-content/20 bg-base-200 px-1 font-mono text-2xs text-base-content outline-none focus:border-primary"
								placeholder="ID"
								data-testid="debug-push-id"
							/>
							<input
								type="number"
								step="0.1"
								value={pushValue}
								onChange={(e) => setPushValue(e.target.value)}
								className="w-20 rounded border border-base-content/20 bg-base-200 px-1 font-mono text-2xs text-base-content outline-none focus:border-primary"
								placeholder="Value"
								data-testid="debug-push-value"
							/>
							<button
								type="button"
								onClick={handlePushParam}
								className="rounded border border-primary/60 px-2 font-mono text-2xs text-primary hover:bg-primary/10"
								data-testid="debug-push-btn"
							>
								Push
							</button>
						</div>
					</div>

					{/* Message history */}
					<div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-1.5">
						<div className="mb-1 flex items-center justify-between">
							<span className="font-mono text-3xs text-base-content/50 uppercase tracking-wider">
								Message Log
							</span>
							<button
								type="button"
								onClick={handleClearMessages}
								className="font-mono text-3xs text-error/70 hover:text-error"
								data-testid="debug-clear-btn"
							>
								Clear
							</button>
						</div>
						<div
							className="flex-1 overflow-y-auto font-mono text-3xs"
							data-testid="debug-message-log"
						>
							{messages.length === 0 ? (
								<div className="py-2 text-center text-base-content/30">
									No messages yet
								</div>
							) : (
								messages.map((msg, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: display-only list
									<MessageRow key={i} msg={msg} />
								))
							)}
							<div ref={messagesEndRef} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
