import { defineConfig } from "rspress/config";

export default defineConfig({
	base: "/",
	lang: "en",
	locales: [
		{
			lang: "en",
			label: "English",
			title: "Cosmo PD-101 Manual",
			description:
				"User manual for the Cosmo PD-101 — a phase distortion synthesizer inspired by the Casio CZ-101.",
		},
		{
			lang: "fr",
			label: "Français",
			title: "Manuel Cosmo PD-101",
			description:
				"Manuel d'utilisation du Cosmo PD-101 — un synthétiseur à distorsion de phase inspiré du Casio CZ-101.",
		},
	],
	outDir: "dist",
	themeConfig: {
		locales: [
			{
				lang: "en",
				label: "English",
				nav: [
					{ text: "Home", link: "/" },
					{
						text: "Getting Started",
						link: "/getting-started/",
						items: [
							{ text: "Quick Start", link: "/getting-started/" },
							{ text: "Web App", link: "/getting-started/web-app" },
							{ text: "DAW Plugin", link: "/getting-started/plugin" },
							{
								text: "Building from Source",
								link: "/contributing/",
							},
						],
					},
					{
						text: "Synth Reference",
						link: "/synth-reference/overview",
						items: [
							{ text: "Overview", link: "/synth-reference/overview" },
							{ text: "Oscillators", link: "/synth-reference/oscillators" },
							{ text: "Algorithms", link: "/synth-reference/algorithms" },
							{ text: "Envelopes", link: "/synth-reference/envelopes" },
							{ text: "Modulation", link: "/synth-reference/modulation" },
							{ text: "Effects", link: "/synth-reference/effects" },
							{
								text: "Global Controls",
								link: "/synth-reference/global-controls",
							},
						],
					},
					{
						text: "Presets",
						link: "/presets/managing",
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
								{ text: "Web App", link: "/getting-started/web-app" },
								{ text: "DAW Plugin", link: "/getting-started/plugin" },

								{ text: "Building from Source", link: "/contributing/" },
							],
						},
						{
							text: "Synth Reference",
							items: [
								{ text: "Overview", link: "/synth-reference/overview" },
								{ text: "Oscillators", link: "/synth-reference/oscillators" },
								{ text: "Envelopes", link: "/synth-reference/envelopes" },
								{ text: "Algorithms", link: "/synth-reference/algorithms" },
								{ text: "Modulation", link: "/synth-reference/modulation" },
								{ text: "Effects", link: "/synth-reference/effects" },
								{
									text: "Global Controls",
									link: "/synth-reference/global-controls",
								},
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
							items: [{ text: "Troubleshooting", link: "/troubleshooting" }],
						},
					],
				},
			},
			{
				lang: "fr",
				label: "Français",
				langRoutePrefix: "/fr",
				nav: [
					{ text: "Accueil", link: "/fr/" },
					{
						text: "Pour commencer",
						link: "/fr/getting-started/",
						items: [
							{ text: "Démarrage rapide", link: "/fr/getting-started/" },
							{ text: "Application web", link: "/fr/getting-started/web-app" },
							{ text: "Plugin DAW", link: "/fr/getting-started/plugin" },
							{
								text: "Compiler depuis les sources",
								link: "/fr/contributing/",
							},
						],
					},
					{
						text: "Référence du synthétiseur",
						link: "/fr/synth-reference/overview",
						items: [
							{ text: "Aperçu", link: "/fr/synth-reference/overview" },
							{ text: "Oscillateurs", link: "/fr/synth-reference/oscillators" },
							{ text: "Algorithmes", link: "/fr/synth-reference/algorithms" },
							{ text: "Enveloppes", link: "/fr/synth-reference/envelopes" },
							{ text: "Modulation", link: "/fr/synth-reference/modulation" },
							{ text: "Effets", link: "/fr/synth-reference/effects" },
							{
								text: "Commandes globales",
								link: "/fr/synth-reference/global-controls",
							},
						],
					},
					{
						text: "Presets",
						link: "/fr/presets/managing",
						items: [
							{ text: "Gérer les presets", link: "/fr/presets/managing" },
							{ text: "Import / Export SysEx", link: "/fr/presets/sysex" },
						],
					},
					{ text: "Dépannage", link: "/fr/troubleshooting" },
				],
				sidebar: {
					"/": [
						{
							text: "Pour commencer",
							items: [
								{ text: "Démarrage rapide", link: "/fr/getting-started/" },
								{
									text: "Application web",
									link: "/fr/getting-started/web-app",
								},
								{ text: "Plugin DAW", link: "/fr/getting-started/plugin" },
								{
									text: "Compiler depuis les sources",
									link: "/fr/contributing/",
								},
							],
						},
						{
							text: "Référence du synthétiseur",
							items: [
								{ text: "Aperçu", link: "/fr/synth-reference/overview" },
								{
									text: "Oscillateurs",
									link: "/fr/synth-reference/oscillators",
								},
								{ text: "Enveloppes", link: "/fr/synth-reference/envelopes" },
								{ text: "Algorithmes", link: "/fr/synth-reference/algorithms" },
								{ text: "Modulation", link: "/fr/synth-reference/modulation" },
								{ text: "Effets", link: "/fr/synth-reference/effects" },
								{
									text: "Commandes globales",
									link: "/fr/synth-reference/global-controls",
								},
							],
						},
						{
							text: "Presets",
							items: [
								{ text: "Gérer les presets", link: "/fr/presets/managing" },
								{ text: "Import / Export SysEx", link: "/fr/presets/sysex" },
							],
						},
						{
							text: "Support",
							items: [{ text: "Dépannage", link: "/fr/troubleshooting" }],
						},
					],
				},
			},
		],
	},
});
