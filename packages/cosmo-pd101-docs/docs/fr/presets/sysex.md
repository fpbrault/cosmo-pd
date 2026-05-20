---
title: Import / Export SysEx
description: Importation et exportation des dumps SysEx Casio CZ-101.
---

# Import / Export SysEx

Le Cosmo PD-101 peut importer des **dumps SysEx de patches Casio CZ-101**.

## Qu'est-ce que le SysEx ?

Messages MIDI System Exclusive. Le CZ-101 stocke chaque patch dans un dump SysEx de 464 octets (charge utile de 256 octets encodée par paires de nibbles).

## Importation d'un patch CZ-101

- **Depuis MIDI** : Connectez l'appareil ou chargez un fichier `.mid` avec SysEx.
- **Depuis un fichier** : Cliquez sur "Importer SysEx", sélectionnez un fichier `.syx` ou `.mid`.

## Processus de décodage

MIDI SysEx (464 octets) -> Décodage par paires de nibbles (256 octets) -> Analyseur de sections (25 sections) -> Mappage des paramètres -> Conversion au format Cosmo -> Chargement.

### Représentation interne

Sections 1-2 : Nom du patch. Sections 3-20 : Algorithme/forme d'onde. Sections 21-22 : Données d'enveloppe. Sections 23-24 : LFO/modulation. Section 25 : Paramètres de performance.

## Exportation de presets

Sélectionnez un preset, cliquez sur "Exporter en SysEx", sauvegardez au format `.syx`.

## Sources de patches compatibles

CZ-101 Librarian, SysexData.com, CZ-101 matériel (MIDI direct), CZ-Explorer.

## Limitations connues

:::warning

- Les algorithmes Cosmo n'ont pas d'équivalent CZ-101 -> repli sur l'algo CZ le plus proche.
- Le mappage de la fonction Fenêtre peut sonner différemment.
- Le CZ-101 n'a pas d'FX intégrés -> les patches SysEx n'incluent pas de réglages FX.

:::

## Référence rapide

| Format | Extension | Contenu |
|--------|-----------|---------|
| Dump SysEx | `.syx` | Données SysEx MIDI brutes |
| Fichier MIDI | `.mid` | MIDI standard avec SysEx intégré |
| Preset Cosmo | `.json` | Preset complet incluant FX et modulation |

Suivant : [Dépannage](/troubleshooting) | Précédent : [Gestion des presets](/presets/managing)
