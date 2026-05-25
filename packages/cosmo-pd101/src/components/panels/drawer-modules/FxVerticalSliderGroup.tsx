import { Children, type ReactNode } from "react";

type FxVerticalSliderGroupProps = {
	children: ReactNode;
	className?: string;
	rulerTickCount?: number;
	rulerLaneWidthClassName?: string;
	rulerTopOffset?: number;
	rulerHeight?: number;
};

function joinClasses(...parts: Array<string | undefined>) {
	return parts.filter(Boolean).join(" ");
}

function isMajorTick(tickIndex: number, tickCount: number) {
	if (tickIndex === 0 || tickIndex === tickCount - 1) {
		return true;
	}

	if (tickCount % 2 === 0) {
		const upperMiddleIndex = tickCount / 2;
		const lowerMiddleIndex = upperMiddleIndex - 1;
		return tickIndex === lowerMiddleIndex || tickIndex === upperMiddleIndex;
	}

	return tickIndex === Math.floor(tickCount / 2);
}

export default function FxVerticalSliderGroup({
	children,
	className,
	rulerTickCount = 7,
	rulerLaneWidthClassName = "w-5",
	rulerTopOffset = 17,
	rulerHeight = 100,
}: FxVerticalSliderGroupProps) {
	const sliderChildren = Children.toArray(children);
	const sliderCount = sliderChildren.length;

	if (sliderCount === 0) {
		return null;
	}

	return (
		<div className={joinClasses("flex items-start justify-center", className)}>
			{sliderChildren.map((child, index) => {
				const childKey =
					typeof child === "object" &&
					child !== null &&
					"key" in child &&
					child.key != null
						? String(child.key)
						: `slider-group-item-${index}`;
				const rulerTicks = Array.from(
					{ length: rulerTickCount },
					(_, tickIndex) => ({
						id: `${tickIndex}`,
						tickIndex,
					}),
				);

				return (
					<div key={childKey} className="flex items-start">
						<div className="min-w-0 flex-1">{child}</div>
						{index < sliderCount - 1 ? (
							<div
								aria-hidden="true"
								className={joinClasses(
									"pointer-events-none mx-1 flex shrink-0 justify-center",
									rulerLaneWidthClassName,
								)}
								style={{ paddingTop: rulerTopOffset }}
							>
								<div
									className="flex flex-col items-center justify-between"
									style={{ height: rulerHeight }}
								>
									{rulerTicks.map((tick) => (
										<div
											key={`ruler-${childKey}-tick-${tick.id}`}
											className="h-px rounded-full bg-cz-cream/65"
											style={{
												width: isMajorTick(tick.tickIndex, rulerTickCount)
													? 22
													: 16,
											}}
										/>
									))}
								</div>
							</div>
						) : null}
					</div>
				);
			})}
		</div>
	);
}
