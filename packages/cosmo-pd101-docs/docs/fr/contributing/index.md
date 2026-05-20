---
title: Compiler depuis les sources
description: Compilez le moteur de synthèse, l'application web et le plugin Cosmo PD-101 depuis les sources.
---

# Compiler depuis les sources

## Prérequis

| Outil | Version | Utilité |
|-------|---------|---------|
| **Rust** | nightly | Moteur de synthèse Rust/WASM (`cosmo-synth-engine`) |
| **Bun** | dernière | Chaîne d'outils JS, gestion des espaces de travail, scripts de build |
| **wasm-pack** | dernière | Compilation de Rust vers WebAssembly |

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

## Compiler les plugins DAW

La compilation des plugins utilise un processus séparé via le package `xtask` :

```bash
bun run --filter=xtask build-plugin
```

Ceci compile l'hôte nih-plug (`packages/cosmo-pd101-plugin`) et empaquète la webview aux formats VST3, CLAP et AUv2.

## Structure du projet

| Package | Description |
|---------|-------------|
| `packages/cosmo-synth-engine` | Moteur audio Rust/WASM à distorsion de phase |
| `packages/cosmo-pd101` | Bibliothèque d'interface utilisateur partagée (composants React, hooks) |
| `packages/cosmo-pd101-plugin` | Hôte nih-plug VST3/CLAP/AUv2 avec webview |
| `packages/cosmo-pd101-docs` | Ce site de documentation |
| `packages/xtask` | Outils de construction |

## Dépannage

- **wasm-pack introuvable** : Installez via `cargo install wasm-pack`
- **Rust nightly non installé** : Exécutez `rustup toolchain install nightly`
- **Échec de compilation du plugin** : Assurez-vous d'avoir les dépendances spécifiques à votre plateforme (voir [docs nih-plug](https://github.com/robbert-vdh/nih-plug))

Suivant : [Démarrage rapide](/getting-started/)
