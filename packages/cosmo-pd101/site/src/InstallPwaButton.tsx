import { useCallback, useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstallPwaButtonProps = {
	isPwaStandalone: boolean;
};

export default function InstallPwaButton({
	isPwaStandalone,
}: InstallPwaButtonProps) {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [installed, setInstalled] = useState(false);

	useEffect(() => {
		if (window.__deferredPwaPrompt) {
			setDeferredPrompt(window.__deferredPwaPrompt as BeforeInstallPromptEvent);
			return;
		}
		const handler = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);
		};
		window.addEventListener("beforeinstallprompt", handler);
		return () => window.removeEventListener("beforeinstallprompt", handler);
	}, []);

	useEffect(() => {
		const handler = () => {
			setDeferredPrompt(null);
			setInstalled(true);
		};
		window.addEventListener("appinstalled", handler);
		return () => window.removeEventListener("appinstalled", handler);
	}, []);

	const handleInstall = useCallback(async () => {
		if (!deferredPrompt) return;
		deferredPrompt.prompt();
		const result = await deferredPrompt.userChoice;
		if (result.outcome === "accepted") {
			setDeferredPrompt(null);
			setInstalled(true);
		}
	}, [deferredPrompt]);

	if (isPwaStandalone || installed) return null;

	return (
		<button
			type="button"
			onClick={handleInstall}
			className={`btn btn-sm px-2 py-1 no-underline ${
				deferredPrompt
					? "border-cz-light-blue/50 bg-cz-light-blue/5 text-cz-light-blue/80 hover:border-cz-light-blue hover:bg-cz-light-blue/10 hover:text-cz-light-blue"
					: "border-cz-border/30 bg-transparent text-cz-cream/30"
			}`}
		>
			{deferredPrompt ? "Install App" : "Install App ..."}
		</button>
	);
}
