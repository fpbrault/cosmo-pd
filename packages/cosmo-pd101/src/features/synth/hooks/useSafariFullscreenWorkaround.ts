import { useCallback, useEffect, useRef, useState } from "react";

const IS_IOS_SAFARI =
	typeof navigator !== "undefined" && /iPhone|iPod/.test(navigator.userAgent);

const CSS_ID = "isl-workaround-style";
const SPACER_ID = "isl-spacer";
const LOCK_CLASS = "is-locked-isl";

function injectStyles() {
	if (document.getElementById(CSS_ID)) return;
	const style = document.createElement("style");
	style.id = CSS_ID;
	style.textContent = `
html.${LOCK_CLASS},
html.${LOCK_CLASS} body {
	overflow: hidden !important;
	position: relative !important;
	height: 100dvh !important;
	overscroll-behavior: none !important;
}
`;
	document.head.appendChild(style);
}

function removeStyles() {
	document.getElementById(CSS_ID)?.remove();
}

function getSpacer(): HTMLDivElement {
	let spacer = document.getElementById(SPACER_ID) as HTMLDivElement | null;
	if (!spacer) {
		spacer = document.createElement("div");
		spacer.id = SPACER_ID;
		spacer.style.cssText = "display:none;width:1px;height:2000vh;";
		document.body.appendChild(spacer);
	}
	return spacer;
}

function removeSpacer() {
	document.getElementById(SPACER_ID)?.remove();
}

export function useSafariFullscreenWorkaround() {
	const [overlayVisible, setOverlayVisible] = useState(false);
	const [isLocked, setIsLocked] = useState(false);
	const rafRef = useRef<number | null>(null);
	const tabsOpenRef = useRef(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const measure = useCallback(() => {
		if (rafRef.current !== null) {
			cancelAnimationFrame(rafRef.current);
		}

		rafRef.current = requestAnimationFrame(() => {
			const viewport = window.visualViewport;
			if (!viewport) return;

			const screenShort = Math.min(window.screen.width, window.screen.height);
			const open = viewport.height + viewport.offsetTop < screenShort - 20;

			if (open === tabsOpenRef.current) return;
			tabsOpenRef.current = open;

			if (timerRef.current !== null) {
				clearTimeout(timerRef.current);
			}

			timerRef.current = setTimeout(
				() => {
					if (open) {
						document.documentElement.classList.remove(LOCK_CLASS);
						getSpacer().style.display = "block";
						setOverlayVisible(true);
						setIsLocked(false);
					} else {
						document.documentElement.classList.add(LOCK_CLASS);
						getSpacer().style.display = "none";
						setOverlayVisible(false);
						setIsLocked(true);
					}
				},
				open ? 0 : 100,
			);
		});
	}, []);

	useEffect(() => {
		if (!IS_IOS_SAFARI || !window.visualViewport) return;

		injectStyles();
		measure();

		window.addEventListener("resize", measure, { passive: true });
		window.addEventListener("orientationchange", measure, {
			passive: true,
		});
		window.addEventListener("scroll", measure, { passive: true });
		window.visualViewport.addEventListener("resize", measure, {
			passive: true,
		});
		window.visualViewport.addEventListener("scroll", measure, {
			passive: true,
		});

		return () => {
			if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
			if (timerRef.current !== null) clearTimeout(timerRef.current);
			window.removeEventListener("resize", measure);
			window.removeEventListener("orientationchange", measure);
			window.removeEventListener("scroll", measure);
			window.visualViewport?.removeEventListener("resize", measure);
			window.visualViewport?.removeEventListener("scroll", measure);
			document.documentElement.classList.remove(LOCK_CLASS);
			removeStyles();
			removeSpacer();
		};
	}, [measure]);

	return { overlayVisible, isLocked };
}
