---
title: Manuel Utilisateur Cosmo PD-101
description: Un synthétiseur à distorsion de phase inspiré du Casio CZ-101.
---

# Cosmo PD-101

> Un synthétiseur à distorsion de phase inspiré du légendaire Casio CZ-101 tout en étendant ses concepts, construit en Rust et fonctionnant sur WebAssembly, bureau, et comme plugin DAW.

## Liens rapides

- **[Pour commencer](/getting-started/)** -- Installez, connectez un MIDI, et jouez votre première note.
- **[Application Web](/getting-started/web-app)** -- Utilisez le synthétiseur dans votre navigateur -- sans installation.
- **[Référence du synthétiseur](/synth-reference/overview)** -- Explorez les oscillateurs, algorithmes, enveloppes, modulation et FX.
- **[Presets](/presets/managing)** -- Chargez, sauvegardez, organisez et partagez vos sons.
- **[Dépannage](/troubleshooting)** -- Problèmes courants et leurs solutions.

## À propos de ce synthétiseur

**Cosmo PD-101** s'inspire du moteur de distorsion de phase du Casio CZ-101 mais va plus loin avec :

- **14 algorithmes de génération sonore** -- bend, sync, pinch, fold, skew, twist, clip, ripple, mirror, fof, terrain, stutter, cheby, plus l'algorithme classique CZ-101
- **Deux lignes d'oscillateurs** avec enveloppes indépendantes, désaccord et possibilité de mélanger un algorithme secondaire
- **Enveloppes à paliers de 8 étapes** -- hauteur, forme d'onde et amplitude par ligne
- **Matrice de modulation** -- 11 sources routées vers la plupart des paramètres du synthétiseur
- **Chaîne FX à 6 emplacements** -- 17 types d'effets dont chorus, delay, reverb, phaser, distortion, bitcrusher et lo-fi
- **Polyphonie 8 voix** rendue en lots SIMD-4 pour des performances maximales
- Fonctionne comme **AudioWorklet Web Audio** (Wasm) ou **plugin VST3/CLAP/AUv2**

## Soutenir le projet

Cosmo PD-101 est **gratuit** et open source sous licence GPLv3. Si vous le trouvez utile, un soutien financier aide à couvrir l'hébergement, les outils de développement et les fonctionnalités futures — et est profondément apprécié.

[**purraudio.dev/store**](https://store.purraudio.dev/)

## Liens du projet

| Ressource | Lien |
|-----------|------|
| **Boutique** | [store.purraudio.dev](https://store.purraudio.dev/) |
| **Code source** | github.com/fpbrault/cosmo-pd |
| **Versions** | github.com/fpbrault/cosmo-pd/releases |
| **Documentation moteur** | COSMO_ENGINE.md |
| **Problèmes** | github.com/fpbrault/cosmo-pd/issues |
| **Discussions** | github.com/fpbrault/cosmo-pd/discussions |
