import type { ReactNode } from "react";
import { MdPiano, MdSettings } from "react-icons/md";
import Button from "@/components/controls/Button";

type SynthInfoBarProps = {
	infoText: string;
	bottomBarExtra?: ReactNode;
	showKeyboardToggle: boolean;
	keyboardVisible: boolean;
	onKeyboardToggle: () => void;
	onKeyboardSettingsClick?: () => void;
};

export default function SynthInfoBar({
	infoText,
	bottomBarExtra,
	showKeyboardToggle,
	keyboardVisible,
	onKeyboardToggle,
	onKeyboardSettingsClick,
}: SynthInfoBarProps) {
	return (
		<div className="relative z-20 mt-1 flex min-h-8 flex-nowrap items-center gap-x-3 gap-y-1 rounded-t-sm border border-cz-border/80 bg-cz-body px-3 py-1 font-mono text-[0.62rem] text-cz-cream/80 uppercase tracking-[0.22em] shadow-inner">
			<span className="text-cz-light-blue/80">Info</span>
			<span className="min-w-0 flex-1 truncate whitespace-nowrap">
				{infoText}
			</span>
			{bottomBarExtra ? (
				<div className="flex items-center gap-2 text-[0.54rem] tracking-[0.18em]">
					{bottomBarExtra}
				</div>
			) : null}
			{showKeyboardToggle ? (
				<div className="flex items-center gap-1">
					<Button
						type="button"
						onClick={onKeyboardToggle}
						className={`btn btn-sm px-2 py-1 ${
							keyboardVisible
								? "border-cz-gold bg-cz-gold/10 text-cz-gold"
								: "border-cz-border bg-transparent text-cz-cream/70 hover:text-cz-cream"
						}`}
					>
						<MdPiano className="h-3.5 w-3.5" />
					</Button>
					{onKeyboardSettingsClick ? (
						<Button
							type="button"
							onClick={onKeyboardSettingsClick}
							className="btn btn-sm border-cz-border bg-transparent px-2 py-1 text-cz-cream/70 hover:text-cz-cream"
						>
							<MdSettings className="h-3 w-3" />
						</Button>
					) : null}
				</div>
			) : null}
		</div>
	);
}
