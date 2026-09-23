---
title: Commandes globales
description: Polyphonie, portamento, pitch bend, vélocité et autres réglages globaux.
---

# Commandes globales

## Voix

- **Poly** -- Jouez plusieurs notes, dans la limite du nombre de voix choisi.
- **Mono** -- Jouez une note à la fois.

En mode **Advanced**, ouvrez **Global** pour régler l’allocation de **1 à 16 voix** (défaut **8**). Cette préférence globale est mémorisée séparément du mode Poly/Mono du patch. Une limite plus basse peut réduire la charge de calcul.

## Tempo

Le panneau **Global** propose aussi un tempo manuel de **20 à 300 BPM**. Lorsque le transport de l’hôte est disponible, le tempo suit l’hôte et le champ manuel est désactivé.

## Volume

Sortie master 0-100%, appliqué après la chaîne FX, avant le limiteur soft clip.

## Portamento (Glissé)

Activez le portamento pour glisser entre les notes. Dans **Simple → Sound**, utilisez la commande On/Off du portamento et ouvrez **Time** pour choisir le mode :

- **Time** règle la durée du glissé de **0 à 10 secondes**.
- **Rate** ajuste le taux de glissé de **0,01× à 100×**.

## Pitch Bend

Plage : +/-1 à +/-24 demi-tons (défaut : +/-2).

## Vélocité

Courbe (0-100%) et Montant (0-100%) pour la sensibilité à la vélocité.

## Couleur DAC

Émulation DAC non linéaire optionnelle ajoutant une distorsion harmonique subtile.

:::info
L'émulation DAC CZ approxime l'étage de sortie non linéaire du DAC du Casio CZ-101 d'origine lorsqu'elle est utilisée avec l'algorithme CZ-101 et la fonction Fenêtre.
:::

## Moniteur de performances

Activez/désactivez via le bouton Perf : FPS, Voix, CPU%.

Suivant : [Presets](/presets/managing) | Précédent : [Effets](/synth-reference/effects)
