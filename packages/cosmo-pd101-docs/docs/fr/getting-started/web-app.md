---
title: Application Web
description: Utilisation du Cosmo PD-101 dans le navigateur via la webview.
---

# Application Web

Le Cosmo PD-101 fonctionne dans le navigateur comme un module **AudioWorklet Web Audio** compilé à partir de Rust (via Wasm).

## Ouverture de l'application Web

Naviguez vers `https://cosmo.purraudio.dev` ou exécutez localement :

```bash
cd packages/cosmo-pd101-plugin
bun run dev
```

## Connexion du synthétiseur

Le synthétiseur s'exécute via un **AudioWorklet** -- un processeur audio hors thread principal. Lorsque vous ouvrez l'application :

1. L'application télécharge le binaire Wasm compilé (~200 Ko compressé).
2. Un `AudioContext` est créé et le nœud worklet est instancié.
3. Tout le rendu audio s'effectue hors du thread principal.

:::info
Les navigateurs exigent une action utilisateur (clic/tap) avant de créer un `AudioContext`. Cliquez n'importe où sur la page pour démarrer le moteur audio.
:::

## Jouer avec le clavier d'ordinateur

Le clavier virtuel par défaut correspond à une **gamme diatonique de Do majeur** :

| Touche du clavier | Note | Note MIDI |
|------------------|------|-----------|
| A | C4 | 60 |
| S | D4 | 62 |
| D | E4 | 64 |
| F | F4 | 65 |
| G | G4 | 67 |
| H | A4 | 69 |
| J | B4 | 71 |
| K | C5 | 72 |

Appuyez sur **Espace** pour activer/désactiver le sustain.

## Utilisation d'un contrôleur MIDI physique

L'application web prend en charge le MIDI via l'**API Web MIDI**.

:::warning
Safari prend en charge l'API Web MIDI de manière limitée. Chrome ou Edge sont recommandés pour une expérience MIDI optimale.
:::

## Disposition des panneaux du synthétiseur

- **Lignes de phase** -- Sélectionnez les algorithmes, réglez la hauteur/désaccord, contrôlez le mélange pour chaque ligne.
- **Éditeur d'enveloppes à paliers** -- Modifiez visuellement trois enveloppes de 8 étapes par ligne.
- **Matrice de modulation** -- Grille 7x195 pour router les sources de modulation.
- **Chaîne FX** -- Six emplacements d'effets en série.

## Sauvegarde et chargement des patches

- **Presets du navigateur** : Chargez des patches de démonstration.
- **Presets personnalisés** : Sauvegardez dans IndexedDB (persistant entre les sessions).
- **Exporter** : Téléchargez au format JSON.
- **Importer** : Chargez un preset JSON ou un dump SysEx Casio CZ-101.

Suivant : [Plugin DAW](/getting-started/plugin)
