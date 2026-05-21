---
title: Effets
description: Référence pour les 17 types d'effets et la chaîne FX à 6 emplacements.
---

# Effets

Chaîne FX série à 6 emplacements traitant le signal mixé final. Chaque emplacement : 1 des 17 types d'effets ou vide.

## Flux du signal de la chaîne FX

Sortie Mixeur Lignes -> Emplacement 1 -> Emplacement 2 -> Emplacement 3 -> Emplacement 4 -> Emplacement 5 -> Emplacement 6 -> Couleur DAC -> Soft Clip -> Sortie Master

## Les 17 types d'effets

1. **Chorus** — Un effet de délai modulé qui épaissit et élargit le son en superposant des copies désaccordées. Paramètres : Taux (0.1-10 Hz), Profondeur (0-5), Mix, Programmes
2. **Delay** — Echo du signal d'entrée avec feedback réglable, mode numérique ou bande, et chaleur de bande. Paramètres : Temps (0.01-2.0s), Feedback (0-99%), Mix, Mode (Numérique/Bande), Chaleur
3. **Reverb** — Simule des espaces acoustiques des petites pièces aux grandes salles avec caractère et pré-délai réglables. Paramètres : Mix, Espace (0-100%), Pré (0-100ms), Dist, Caractère, Programmes
4. **Phaser** — Balaye des crénelures d'annulation de phase dans le spectre pour un mouvement tourbillonnant. Paramètres : Taux (0.1-10 Hz), Profondeur, Feedback (-90% à +90%), Mix
5. **Vibrato** — Module cycliquement la hauteur à l'aide de formes d'onde LFO avec un délai d'attaque réglable. Paramètres : Onde (Tri/Scie/ScieInv/Carré), Taux (1-200), Prof (0-50), Délai (0-5000ms)
6. **Phase Mod** — Synthèse par modulation de phase dans la chaîne FX pour un mouvement spectral complexe. Paramètres : Montant (0-50%), Ratio (0.5-8.0), Pré (On/Off)
7. **Compressor** — Lisse la dynamique avec contrôle complet du seuil, ratio, attaque, release et gain de compensation. Paramètres : Seuil (-60 à 0 dB), Ratio (1:1 à 20:1), Attaque (0.1-200ms), Release (10-2000ms), Compensation (0-24dB), Mix
8. **5-Band EQ** — Cinq bandes de fréquences fixes (80–8000 Hz) pour un façonnage tonal précis avec ±12 dB par bande. Paramètres : Bandes 80, 240, 750, 2200, 8000 Hz ; -12 à +12 dB chacune
9. **Grain Delay** — Délai granulaire qui découpe l'audio en grains pour des échos glitchés, texturés et atmosphériques. Paramètres : Temps (0.01-1.0s), Feedback, Dispersion, Densité, Mix
10. **Bitcrusher** — Réduit la résolution et la fréquence d'échantillonnage pour un crunch numérique lo-fi et des artefacts de repliement. Paramètres : Bits (1-16), Taux (1-32x), Mix
11. **Shimmer Verb** — Réverbération avec une boucle de feedback transposée qui produit des queues éthérées et scintillantes. Paramètres : Shimmer (0-100%), Espace (0-100%), Mix
12. **Distortion** — Types overdrive, distortion et fuzz pour tout aller de la saturation chaude à l'écrêtage agressif. Paramètres : Type (OD/Dist/Fuzz), Drive, Tone, Mix
13. **Juno Chorus** — Émule le circuit de chorus classique du Roland Juno. Les modes I, II et I+II offrent différentes largeurs stéréo et mouvements. Paramètres : Mode (I/II/I+II), Mix
14. **Ring Mod** — Modulation d'amplitude entre le signal et un oscillateur interne pour des sons métalliques, cloche-like et inharmoniques. Paramètres : Fréq (20-4000 Hz), Mix

:::warning
Le Ring Mod fonctionne mais son comportement pourrait légèrement changer dans les futures mises à jour.
:::
15. **Tremolo** — Modulation cyclique du volume avec forme d'onde LFO et profondeur sélectionnables. Paramètres : Taux (0.1-20 Hz), Profondeur (0-100%), Onde (Sin/Tri/Carré), Mix
16. **Wavefolder** — Replie la forme d'onde sur elle-même pour générer de riches harmoniques, de la chaleur subtile au bourdonnement agressif. Paramètres : Drive (0-100%), Plis (0-100%), Mix
17. **LoFi** — Combine la dégradation du signal, l'émulation wow & flutter et le façonnage tonal pour un caractère vinyle ou cassette vintage. Paramètres : Dégradation, Prof Ondulation/Taux, Flutter Prof/Taux, Tone, Mix

## Conseils pour la chaîne FX

:::tip

- **Basse** : Compressor -> EQ -> Distortion (léger)
- **Lead** : Distortion -> Delay -> Reverb
- **Nappe** : EQ -> Chorus -> Reverb -> Shimmer Verb
- **Expérimental** : Bitcrusher -> Grain Delay -> Ring Mod -> Wavefolder

:::

Suivant : [Commandes globales](/synth-reference/global-controls) | [Presets](/presets/managing) | Précédent : [Modulation](/synth-reference/modulation)
