---
title: Oscillateurs
description: Deux lignes d'oscillateurs, formes d'onde de base, désaccord et mélange.
---

# Oscillateurs

Deux lignes d'oscillateurs indépendantes, chacune avec son propre algorithme, forme d'onde de base, octave, désaccord (fin et grossier), enveloppe et mélange d'algorithme.

## Sélection de ligne

| Réglage | Effet |
|---------|-------|
| **L1** | Seule la ligne 1 est audible |
| **L2** | Seule la ligne 2 est audible |
| **L1 + L1'** | Ligne 1 + copie désaccordée de la ligne 1 |
| **L1 + L2'** | Ligne 1 + ligne 2 désaccordée |

## Formes d'onde de base

| Forme d'onde | Caractère |
|--------------|-----------|
| **Cosinus** | Doux, harmoniques paires |
| **Sinus** | Fondamentale pure, sons creux et clairs |
| **Triangle** | Harmoniques impaires, plus doux que la dent de scie |
| **Dent de scie** | Série harmonique complète, brillant et bourdonnant |
| **Carré** | Harmoniques impaires uniquement, creux et nasillard |

## Désaccord

- Désaccord (Octave) -- octaves entières
- Désaccord (Grossier) -- demi-tons entiers
- Désaccord (Fin) -- cents sous le demi-ton

:::warning
Le contrôle Désaccord (Octave) ne supporte pas encore la modulation. Il est listé comme destination de modulation pour une utilisation future.
:::

## Mélange d'algorithme

Chaque ligne a un algorithme secondaire fondu via le bouton `Algo Blend` (0-100%).

:::warning
Algo Blend ne supporte pas encore la modulation. Il est listé comme destination de modulation pour une utilisation future.
:::

## Mode de modulation

| Mode | Comportement |
|------|--------------|
| **Normal** | Mélange additif standard |
| **Ring** | Modulation en anneau : L1 x L2 x gainAnneau |
| **Noise** | Composante de bruit mise à l'échelle par le niveau du signal |

:::warning
La modulation de bruit ne fonctionne pas comme prévu. Des changements sont prévus dans une future version.
:::

:::warning
La modulation en anneau fonctionne mais son comportement pourrait légèrement changer dans les futures mises à jour.
:::

Suivant : [Algorithmes](/synth-reference/algorithms) | Précédent : [Vue d'ensemble](/synth-reference/overview)
