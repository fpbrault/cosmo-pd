import { defineConfig } from "rspress/config";

export default defineConfig({
	base: "/cosmo-pd/",
	title: "Cosmo PD-101 Manual",
	description:
		"User manual for the Cosmo PD-101 — a phase distortion synthesizer inspired by the Casio CZ-101.",
	outDir: "dist",
	themeConfig: {
		nav: [
			{ text: "Home", link: "/" },
			{
				text: "Getting Started",
				link: "/getting-started/",
				items: [
					{ text: "Quick Start", link: "/getting-started/" },
					{ text: "Desktop App", link: "/getting-started/desktop-app" },
					{ text: "Web App", link: "/getting-started/web-app" },
					{ text: "DAW Plugin", link: "/getting-started/plugin" },
				],
			},
			{
				text: "Synth Reference",
				link: "/synth-reference/",
				items: [
					{ text: "Overview", link: "/synth-reference/overview" },
					{ text: "Oscillators", link: "/synth-reference/oscillators" },
					{ text: "Envelopes", link: "/synth-reference/envelopes" },
					{ text: "Algorithms", link: "/synth-reference/algorithms" },
					{ text: "Effects", link: "/synth-reference/effects" },
					{ text: "Global Controls", link: "/synth-reference/global-controls" },
				],
			},
			{
				text: "Presets",
				link: "/presets/",
				items: [
					{ text: "Managing Presets", link: "/presets/managing" },
					{ text: "SysEx Import / Export", link: "/presets/sysex" },
				],
			},
			{ text: "Troubleshooting", link: "/troubleshooting" },
		],
		sidebar: {
			"/": [
				{
					text: "Getting Started",
					items: [
						{ text: "Quick Start", link: "/getting-started/" },
						{ text: "Desktop App", link: "/getting-started/desktop-app" },
						{ text: "Web App", link: "/getting-started/web-app" },
						{ text: "DAW Plugin", link: "/getting-started/plugin" },
					],
				},
				{
					text: "Synth Reference",
					items: [
						{ text: "Overview", link: "/synth-reference/overview" },
						{ text: "Oscillators", link: "/synth-reference/oscillators" },
						{ text: "Envelopes", link: "/synth-reference/envelopes" },
						{ text: "Algorithms", link: "/synth-reference/algorithms" },
						{ text: "Effects", link: "/synth-reference/effects" },
						{ text: "Global Controls", link: "/synth-reference/global-controls" },
					],
				},
				{
					text: "Presets",
					items: [
						{ text: "Managing Presets", link: "/presets/managing" },
						{ text: "SysEx Import / Export", link: "/presets/sysex" },
					],
				},
				{
					text: "Support",
					items: [
						{ text: "Troubleshooting", link: "/troubleshooting" },
					],
				},
			],
		},
	},
});
