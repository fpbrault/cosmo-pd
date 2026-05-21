---
title: Compiler depuis les sources
description: Compilez le moteur de synthèse, l'application web et le plugin Cosmo PD-101 depuis les sources.
---

# Compiler depuis les sources

## Prérequis

- **Rust**
- **Bun**
- **wasm-pack**

## Cloner

```bash
git clone https://github.com/fpbrault/cosmo-pd.git
cd cosmo-pd
```

## Installer les dépendances

```bash
bun install
```

## Compiler le moteur de synthèse (Rust/WASM)

```bash
bun run build
```

Ceci exécute `wasm-pack` pour compiler le moteur Rust (`packages/cosmo-synth-engine`) en WebAssembly, puis Vite compile l'application web.

## Serveur de développement

```bash
bun run dev
```

Lance le serveur de développement Vite.

## Compiler les plugins

```bash
bun run build:plugin
```

## Structure du projet

| Package | Description |
|---------|-------------|
| `packages/cosmo-synth-engine` | Moteur audio Rust/WASM à distorsion de phase |
| `packages/cosmo-pd101` | Bibliothèque d'interface utilisateur partagée (composants React, hooks) |
| `packages/cosmo-pd101-plugin` | Plugins VST3/CLAP/AUv2 avec webview |
| `packages/cosmo-pd101-docs` | Ce site de documentation |
| `packages/xtask` | Outils de construction |

## Dépannage

- **wasm-pack introuvable** : Installez via `cargo install wasm-pack`
- **Rust nightly non installé** : Exécutez `rustup toolchain install nightly`

Suivant : [Démarrage rapide](/getting-started/)
