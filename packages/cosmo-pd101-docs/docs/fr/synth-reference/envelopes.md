---
title: Enveloppes
description: Exploration approfondie des enveloppes à paliers de 8 étapes style CZ.
---

# Enveloppes

Enveloppes à paliers de 8 étapes -- une caractéristique distinctive du Casio CZ-101. Chaque enveloppe possède 8 étapes discrètes, chacune avec un niveau et un taux.

## Types d'enveloppes (par ligne)

| Enveloppe | Contrôle | ID Paramètre |
|-----------|---------|--------------|
| **Enveloppe DCO** | Hauteur (fréquence) | `dcoEnv` |
| **Enveloppe DCW** | Profondeur de déformation | `dcwEnv` |
| **Enveloppe DCA** | Amplitude (volume) | `dcaEnv` |

Plus une **Enveloppe de Modulation** séparée (ADSR à 4 étages) pour le routage de modulation.

## Structure de l'enveloppe à paliers

- 8 étapes, chacune avec **Niveau** (0-127) et **Taux** (0-127)
- **Étape de soutien** -- quelle étape est maintenue lorsque la touche est enfoncée
- **Boucle** -- redémarrer de l'étape 1 après l'étape 8
- **Nombre d'étapes** -- combien des 8 étapes sont actives

## Approximation ADSR classique

Étapes 1-2 = attaque, 3-4 = decay, 5 = soutien, 6-8 = maintien du release.

## Édition dans l'interface

Cliquez pour sélectionner une étape, glissez verticalement pour le niveau, horizontalement pour le taux. Définissez le point de soutien avec le bouton "S". Activez/désactivez l'icône de boucle.

## Enveloppe DCO -- Hauteur

Niveau 0 = hauteur de base, Niveau 127 = +12 demi-tons.

## Enveloppe DCW -- Forme d'onde

Niveau 0 = pas de distorsion (forme d'onde brute), Niveau 127 = distorsion maximale. L'enveloppe la plus expressive.

## Enveloppe DCA -- Amplitude

Niveau 0 = silence, Niveau 127 = volume maximal.

## Conseils sur les enveloppes

:::tip

- **Nappe longue/attaque lente** : L=0,T=60 -> L=100,T=80, étape soutien 2, boucle off
- **Pincement percussif** : L=0,T=2 -> L=127,T=5, étape soutien 2, DCA release court
- **Hauteur arpégée** : alterner L=0/L=30, boucle on
- **Vibrato via boucle DCO** : L=120,T=30 -> L=132,T=30, boucle on

:::

Suivant : [Modulation](/synth-reference/modulation) | Précédent : [Vue d'ensemble](/synth-reference/overview) | [Algorithmes](/synth-reference/algorithms)
