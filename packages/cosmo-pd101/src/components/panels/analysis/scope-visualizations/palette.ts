import type { ScopeColorTheme, ScopeThemePalette } from "./types";

export function withAlpha(color: string, alpha: number): string {
	const clampedAlpha = Math.max(0, Math.min(1, alpha));
	const hex = color.startsWith("#") ? color.slice(1) : color;
	if (hex.length === 3) {
		const r = Number.parseInt(hex[0] + hex[0], 16);
		const g = Number.parseInt(hex[1] + hex[1], 16);
		const b = Number.parseInt(hex[2] + hex[2], 16);
		return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
	}
	if (hex.length >= 6) {
		const r = Number.parseInt(hex.slice(0, 2), 16);
		const g = Number.parseInt(hex.slice(2, 4), 16);
		const b = Number.parseInt(hex.slice(4, 6), 16);
		return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
	}
	return color;
}

export function getScopeThemePalette(
	theme: ScopeColorTheme,
): ScopeThemePalette {
	if (theme === "amber") {
		return {
			theme,
			background: "#100804",
			backgroundOverlay: "#160b05",
			grid: "#7a3d12",
			centerLine: "#bf6b1d",
			accent: "#ffb24a",
			accentSoft: "#ffd28a",
			accentDim: "#8a4e1e",
			glow: "#ffc15f",
			light: "#fff4d6",
			accentSecondary: "#ff7048",
			warm: "#ff8a2a",
			dim: "#ffd28a",
			medium: "#e98937",
			bright: "#ffe59a",
			alert: "#ff7048",
			highlight: "#fff0bf",
			soft: "#7a3d12",
			spectrogramLow: "#3a1708",
			spectrogramMid: "#ff8a2a",
			spectrogramHigh: "#fff0bf",
		};
	}

	if (theme === "plasma") {
		return {
			theme,
			background: "#08051a",
			backgroundOverlay: "#120a2f",
			grid: "#4730a3",
			centerLine: "#8f61ff",
			accent: "#9ef7ff",
			accentSoft: "#c0fbff",
			accentDim: "#315f99",
			glow: "#9ef7ff",
			light: "#e9fdff",
			accentSecondary: "#ff61d8",
			warm: "#ff8f3d",
			dim: "#c0fbff",
			medium: "#ffb46b",
			bright: "#ffdc69",
			alert: "#ff61d8",
			highlight: "#fff0ad",
			soft: "#5c3fd8",
			spectrogramLow: "#21124d",
			spectrogramMid: "#ff61d8",
			spectrogramHigh: "#fff0ad",
		};
	}

	return {
		theme,
		background: "#051005",
		backgroundOverlay: "#000802",
		grid: "#007800",
		centerLine: "#1a8f1a",
		accent: "#7cff7c",
		accentSoft: "#b8ffb8",
		accentDim: "#347a34",
		glow: "#7cff7c",
		light: "#ddffdd",
		accentSecondary: "#b8ffb8",
		warm: "#a8ffa8",
		dim: "#9cff9c",
		medium: "#a5ff98",
		bright: "#d6ffd6",
		alert: "#b8ffb8",
		highlight: "#ecffec",
		soft: "#46be82",
		spectrogramLow: "#063806",
		spectrogramMid: "#7cff7c",
		spectrogramHigh: "#ecffec",
	};
}
