---
title: Import / Export SysEx
description: Importation et exportation des dumps SysEx Casio CZ-101.
---

# Import / Export SysEx

Le Cosmo PD-101 peut importer des **dumps SysEx de patches Casio CZ-101** dans la bibliothèque de presets.

## Qu'est-ce que le SysEx ?

Messages MIDI System Exclusive. Un patch CZ-101 canonique occupe 264 octets bruts : une charge utile de 256 octets encodée par paires de nibbles, avec son en-tête et son encadrement SysEx.

## Importation d'un patch CZ-101

- **Depuis des fichiers** : Ouvrez la bibliothèque de presets, cliquez sur **Importer**, puis sélectionnez un ou plusieurs fichiers `.syx`, `.json` ou `.toml`.
- **Par glisser-déposer** : Déposez les fichiers n'importe où dans la bibliothèque ouverte. Les fichiers valides sont importés même si un autre fichier du lot est invalide.
- Un fichier `.syx` peut contenir plusieurs messages CZ concaténés ; chaque message devient un preset distinct.

## Processus de décodage

MIDI SysEx (264 octets) -> Décodage par paires de nibbles (128 octets logiques) -> Analyse des sections -> Mappage des paramètres -> Conversion au format Cosmo -> Chargement.

### Représentation interne

Sections 1-2 : Nom du patch. Sections 3-20 : Algorithme/forme d'onde. Sections 21-22 : Données d'enveloppe. Sections 23-24 : LFO/modulation. Section 25 : Paramètres de performance.

## Sources de patches compatibles

CZ-101 Librarian, SysexData.com, CZ-101 matériel (MIDI direct), CZ-Explorer.

## Limitations connues

:::warning

- Les algorithmes Cosmo n'ont pas d'équivalent CZ-101 -> repli sur l'algo CZ le plus proche.
- Le mappage de la fonction Fenêtre peut sonner différemment.
- Le CZ-101 n'a pas d'FX intégrés -> les patches SysEx n'incluent pas de réglages FX.
- Les fichiers MIDI standard `.mid` ne sont pas encore analysés par la bibliothèque.

:::

## Référence rapide

| Format | Extension | Contenu |
|--------|-----------|---------|
| Dump SysEx | `.syx` | Données SysEx MIDI brutes |
| Preset Cosmo | `.json` | Preset complet incluant FX et modulation |

Suivant : [Dépannage](/troubleshooting) | Précédent : [Gestion des presets](/presets/managing)
