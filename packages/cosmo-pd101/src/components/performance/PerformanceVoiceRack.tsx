import { Children, Fragment, type ReactNode } from "react";
import SimpleSectionHeader from "./SimpleSectionHeader";

export default function PerformanceVoiceRack({
	children,
}: {
	children: ReactNode;
}) {
	let hasPreviousSection = false;
	return (
		<section
			className="flex min-w-0 flex-1 flex-col overflow-hidden bg-cz-surface/80"
			data-testid="simple-voice-rack"
		>
			<SimpleSectionHeader className="text-[0.5rem]">VOICE</SimpleSectionHeader>
			<div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_12.5rem_minmax(0,2fr)_12.5rem_minmax(0,2fr)_9rem_minmax(0,2fr)_8.5rem_minmax(0,1fr)]">
				<span aria-hidden="true" className="min-w-0" />
				{Children.map(children, (section) => {
					const showDivider = hasPreviousSection;
					hasPreviousSection = true;
					return (
						<Fragment>
							{showDivider ? (
								<span
									aria-hidden="true"
									className="my-1 w-px justify-self-center bg-cz-border/80"
								/>
							) : null}
							{section}
						</Fragment>
					);
				})}
				<span aria-hidden="true" className="min-w-0" />
			</div>
		</section>
	);
}
