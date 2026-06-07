type IosFullscreenHintProps = {
	visible: boolean;
};

export function IosFullscreenHint({ visible }: IosFullscreenHintProps) {
	if (!visible) return null;

	return (
		<div className="pointer-events-none fixed inset-0 z-[2147483647] flex items-start justify-center px-3 pt-3">
			<div className="pointer-events-auto max-w-[80vw] rounded-full bg-black/50 px-4 py-3 text-sm text-white backdrop-blur-md">
				Scroll down to hide Safari bars and enter fullscreen
			</div>
		</div>
	);
}
