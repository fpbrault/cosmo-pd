import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

type MiniKeyboardShellProps = {
	visible: boolean;
	children: ReactNode;
};

export default function MiniKeyboardShell({
	visible,
	children,
}: MiniKeyboardShellProps) {
	return (
		<AnimatePresence initial={false}>
			{visible ? (
				<motion.div
					key="mini-keyboard"
					initial={{ opacity: 0, y: 28 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 22 }}
					transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
					className="pointer-events-none absolute inset-x-0 bottom-8 z-20"
				>
					<div
						data-testid="mini-keyboard-overlay"
						className="pointer-events-auto w-full overflow-hidden rounded-t-2xl rounded-b-none border border-cz-border border-b-0 bg-cz-body px-0 pt-0 pb-1 shadow-xl backdrop-blur-sm"
					>
						{children}
					</div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
