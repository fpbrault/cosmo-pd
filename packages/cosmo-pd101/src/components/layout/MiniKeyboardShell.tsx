import type { ReactNode } from "react";

type MiniKeyboardShellProps = {
	children: ReactNode;
};

export default function MiniKeyboardShell({
	children,
}: MiniKeyboardShellProps) {
	return (
		<div
			data-testid="mini-keyboard-overlay"
			className="flex h-full w-full flex-col overflow-hidden border-cz-border border-t bg-cz-body"
		>
			{children}
		</div>
	);
}
