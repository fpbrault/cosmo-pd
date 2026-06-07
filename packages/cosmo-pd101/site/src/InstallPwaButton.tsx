import { useCallback, useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPwaButton() {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);

	useEffect(() => {
		const handler = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);
		};
		window.addEventListener("beforeinstallprompt", handler);
		return () => window.removeEventListener("beforeinstallprompt", handler);
	}, []);

	useEffect(() => {
		const handler = () => setDeferredPrompt(null);
		window.addEventListener("appinstalled", handler);
		return () => window.removeEventListener("appinstalled", handler);
	}, []);

	const handleInstall = useCallback(async () => {
		if (!deferredPrompt) return;
		deferredPrompt.prompt();
		const result = await deferredPrompt.userChoice;
		if (result.outcome === "accepted") {
			setDeferredPrompt(null);
		}
	}, [deferredPrompt]);

	if (!deferredPrompt) return null;

	return (
		<button
			type="button"
			onClick={handleInstall}
			className="btn btn-sm border-cz-light-blue/50 bg-cz-light-blue/5 px-2 py-1 text-cz-light-blue/80 no-underline hover:border-cz-light-blue hover:bg-cz-light-blue/10 hover:text-cz-light-blue"
		>
			Install App
		</button>
	);
}
