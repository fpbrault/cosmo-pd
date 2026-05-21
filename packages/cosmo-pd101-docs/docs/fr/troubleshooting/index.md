---
title: Dépannage
description: Problèmes courants et comment les résoudre.
---

# Dépannage

## L'audio ne joue pas

:::danger
**Aucun son** : Cliquez sur la page pour démarrer le AudioContext (restriction de lecture automatique du navigateur).
:::

- Pas de son à la première note : Attendez 1-2s que le module Wasm se charge.
- Audio distordu : Réduisez le volume Master.

## MIDI ne fonctionne pas

- Contrôleur non détecté : Autorisez la permission MIDI dans le navigateur.
- Mauvaises touches : A S D F G H J K = C4-C5 gamme diatonique Do majeur.
- Aftertouch ne fonctionne pas : Le contrôleur peut ne pas le supporter.

:::info
L'API Web MIDI nécessite HTTPS (ou localhost). Si vous testez localement, assurez-vous d'utiliser `localhost` plutôt que `127.0.0.1`.
:::

## Problèmes de performance

- Craquements audio : Réduisez la polyphonie ou fermez des onglets.
- CPU élevé : Désactivez les emplacements FX inutilisés.
- Lag de l'interface : Réduisez les routes de modulation.

## Application Web spécifique

- Écran noir : Essayez Chrome/Edge.
- Les presets ne se sauvegardent pas : Videz le cache ou exportez manuellement.

## Plugin spécifique

- Pas dans la DAW : Mauvais format/répertoire, réactualisez.
- Fenêtre noire : Activez l'accélération GPU dans la DAW.
- Latence élevée : Réduisez la taille du buffer à 128-256 échantillons.

## Réinitialisation d'usine

Menu de la bibliothèque de presets -> "Réinitialisation d'usine" -> Confirmez.

## Obtenir de l'aide

Liens vers les Issues et Discussions GitHub fournis.
