# Cosmo PD-101 Documentation

This package contains the **user manual** for the [Cosmo PD-101](https://fpbrault.github.io/cosmo-pd/) synthesizer, built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build/).

## Structure

```
src/content/docs/
├── index.md               ← Landing page (splash)
├── getting-started/
│   ├── index.md           ← Quick start guide
│   ├── web-app.md         ← Browser usage
│   ├── desktop-app.md     ← Tauri standalone
│   └── plugin.md          ← DAW plugin (VST3/CLAP/AUv2)
├── synth-reference/
│   ├── overview.md        ← Architecture & signal flow
│   ├── oscillators.md     ← Dual lines, waveforms, detune, blending
│   ├── algorithms.md      ← All 25 PD algorithms with params
│   ├── envelopes.md       ← 8-step CZ envelope deep-dive
│   ├── modulation.md      ← Mod matrix sources, destinations, routing
│   ├── effects.md         ← All 17 FX types with parameter tables
│   └── global-controls.md ← Polyphony, portamento, pitch bend, velocity
├── presets/
│   ├── managing.md        ← Load, save, organize, share presets
│   └── sysex.md           ← CZ-101 SysEx import/export
└── troubleshooting.md     ← Common issues and solutions
```

## Development

```bash
# Install dependencies
bun install

# Run dev server
bun run dev

# Build for production
bun run build

# Preview the build locally
bun run preview
```

## Deploying to GitHub Pages

The site is deployed automatically via GitHub Actions (`.github/workflows/deploy-docs.yml`). The workflow triggers on pushes to `main` that touch files in `packages/cosmo-pd101-docs/`.

Manual deploy:
1. Push to `main`
2. Go to **Actions** → **Deploy Docs to GitHub Pages**
3. The output URL is shown on the workflow summary page

The site is served at: `https://fpbrault.github.io/cosmo-pd/`

Ensure GitHub Pages is configured in repo settings to use **GitHub Actions** as the source (not a branch).

## Image Placeholders

Throughout the docs, `<!-- IMAGE_PLACEHOLDER: description -->` markers indicate where screenshots should be added. Source images in `src/assets/images/`.

## Adding New Pages

1. Create a new `.md` file in `src/content/docs/<section>/`
2. Add the page to the sidebar in `astro.config.mjs`
3. Follow existing formatting conventions (frontmatter, parameter tables, image placeholders)