---
title: Vue d'ensemble
description: Architecture et flux du signal du synthétiseur Cosmo PD-101.
---

# Vue d'ensemble du synthétiseur

Le **Cosmo PD-101** est un synthétiseur à distorsion de phase (PD) inspiré de la série Casio CZ. Il génère du son en déformant la phase d'un oscillateur avant d'échantillonner une forme d'onde de base.

## Flux du signal

:::details{title="Schéma du flux du signal"}

```
Entrée MIDI
    |
    v
Sources de modulation (LFO 1, LFO 2, Random S&H, Env Mod ADSR, Vélocité, Molette Mod, Aftertouch)
    |
    v
Matrice de modulation (11 sources -> 195+ destinations, chacune avec profondeur)
    |
    v
Voix (polyphonie x8)
  Ligne 1 (Env DCO -> Algorithme + Env DCW -> Onde de base -> Env DCA)
  Ligne 2 (même structure)
    |
    v
Mixeur de lignes (Normal / Ring Mod / Noise / L1 / L2 / L1+L1' / L1+L2')
    |
    v
Sortie : Volume + Mod -> Chaîne FX (6 emplacements) -> Soft Clip (tanh) -> Audio Out
```

:::

## Distorsion de phase -- Comment ça fonctionne

Normal : Phase -> Table d'ondes -> Sortie
PD :     Phase -> [ALGORITHME DE DÉFORMATION] -> Table d'ondes -> Sortie

L'algorithme de déformation remodèle la courbe de phase, modifiant le contenu harmonique en temps réel.

### Les deux lignes d'oscillateurs

Chaque ligne possède son propre algorithme, trois enveloppes à 8 étapes (DCO/DCW/DCA), une hauteur/désaccord/octave indépendants, et un sélecteur de forme d'onde de base.

## Concepts clés

| Terme | Signification |
|-------|---------------|
| **DCO** | Oscillateur contrôlé numériquement -- hauteur/fréquence |
| **DCW** | Formeur d'onde contrôlé numériquement -- quantité de déformation |
| **DCA** | Amplificateur contrôlé numériquement -- amplitude |
| **Algorithme** | Fonction mathématique qui déforme la phase |
| **Enveloppe** | 8 étapes à palier contrôlant un paramètre dans le temps |
| **Matrice de modulation** | Route 11 sources vers 195+ destinations |
| **Chaîne FX** | 6 emplacements d'effets en série traitant l'audio final |

Suivant : [Oscillateurs](/synth-reference/oscillators) | [Algorithmes](/synth-reference/algorithms) | [Enveloppes](/synth-reference/envelopes)
