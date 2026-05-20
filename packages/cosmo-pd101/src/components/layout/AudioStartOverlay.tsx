import { AnimatePresence, motion } from "motion/react";
import Button from "@/components/controls/Button";

export type AudioGate = {
	ready: boolean;
	onResume: () => void;
};

export default function AudioStartOverlay({
	audioGate,
}: {
	audioGate?: AudioGate;
}) {
	if (!audioGate || audioGate.ready) return null;
	return (
		<AnimatePresence>
			<motion.div
				key="audio-start-overlay"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.2 }}
				className="absolute inset-0 z-50 flex items-center justify-center"
				role="dialog"
				aria-modal="true"
				aria-label="Start audio"
			>
				<div className="absolute inset-0 bg-cz-body/80 backdrop-blur-sm" />
				<div className="relative flex flex-col items-center gap-4 rounded-md border border-cz-border bg-cz-surface px-8 py-6 text-cz-cream shadow-2xl">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="h-8 w-8 opacity-70"
						aria-hidden="true"
						focusable="false"
					>
						<path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.348 2.595.342 1.241 1.519 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
						<path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.061Z" />
					</svg>
					<p className="font-mono text-cz-cream-dim text-sm">
						Audio requires a user interaction to start.
					</p>
					<Button
						type="button"
						autoFocus
						className="btn btn-primary"
						onClick={audioGate.onResume}
					>
						Start Audio
					</Button>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}
