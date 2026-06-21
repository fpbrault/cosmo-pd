---
title: Matrice de modulation
description: Routage des sources de modulation vers les destinations.
---

# Matrice de modulation

Route les sources de modulation vers les paramètres de tout le synthétiseur avec une profondeur ajustable.

## Sources

| Source | Description |
|--------|-------------|
| **LFO 1** | Sinus, triangle, carré, dent de scie, dent de scie inversée |
| **LFO 2** | Mêmes formes d'onde que LFO 1 |
| **Aléatoire** | Valeur aléatoire sample-and-hold |
| **Env Mod** | Enveloppe de modulation ADSR à 4 étages |
| **Vélocité** | Vélocité MIDI note-on (0-127) |
| **Molette Mod** | CC MIDI 1 |
| **Aftertouch** | Pression de canal ou aftertouch polyphonique |
| **Macro 1-4** | Boutons macro assignables par l'utilisateur (CC MIDI 8, 41, 42, 43) |

## Destinations (195 au total)

| Catégorie | Nb | Exemples |
|-----------|-----|----------|
| **Global** | 2 | Volume, Hauteur |
| **Ligne 1** | 13 | DcwBase, DcaBase, AlgoBlend, Octave, AlgoControl1-8 |
| **Ligne 2** | 12 | DcwBase, DcaBase, AlgoBlend, Désaccord, AlgoControl1-8 |

:::warning
AlgoBlend et Octave/Désaccord sont listés comme destinations de modulation mais ne modulent pas encore le signal. La prise en charge de la modulation pour ces destinations est prévue dans une future mise à jour.
:::
| **Filtre** | 3 | Coupure, Résonance, Amount Env |
| **FX** | 41 | Tous les paramètres d'effets |
| **Modulation** | 13 | Taux/profondeur/symétrie/décalage LFO, Taux Aléatoire |
| **Enveloppes** | 96 | 2 lignes x 3 types env x 8 étapes x 2 champs |
| **Total** | **195** | |

## MIDI Learn

Liez n'importe quel CC MIDI à n'importe quel paramètre modulable pour un contrôle tactile.

1. **Clic droit** (ou **Alt-clic**) sur un paramètre.
2. **Bougez** un bouton ou un fader de votre contrôleur MIDI.
3. La liaison est sauvegardée avec votre preset.

:::info
Tous les contrôles ne supportent pas encore MIDI Learn. Les contrôles Blend, Octave et la gamme 12 octaves n'acceptent pas encore les liaisons MIDI.
:::

## Routage

Chaque route : Source + Destination + Profondeur (positive ou négative).

### Conseils rapides

:::tip

- **Vibrato** : LFO 1 -> Profondeur Vibrato
- **Trémolo** : LFO 2 -> Volume
- **Filtre expressif** : Molette Mod -> CoupureFiltre
- **Auto-wah** : Aftertouch -> CoupureFiltre
- **Nappe ascendante** : Env Mod -> Profondeur Env DCW

:::

Suivant : [Effets](/synth-reference/effects) | Précédent : [Enveloppes](/synth-reference/envelopes)
