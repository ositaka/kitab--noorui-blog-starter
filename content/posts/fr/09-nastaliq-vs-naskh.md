---
id: "nastaliq-vs-naskh"
title: "Nastaliq vs Naskh : comparaison de deux styles majeurs de l'écriture arabe"
excerpt: "Comprendre les différences entre les deux styles calligraphiques les plus importants pour les langues en écriture arabe."
category: "typography"
author: "amira-hassan"
publishedAt: "2024-12-25"
readingTime: 11
featured: false
featuredImage: "/images/posts/nastaliq-vs-naskh.jpg"
tags: ["nastaliq", "naskh", "calligraphie", "typographie", "arabe"]
---

## Introduction

Si vous avez travaillé avec des langues en écriture arabe, vous avez probablement rencontré deux termes qui reviennent sans cesse : **Naskh** et **Nastaliq**. Ceux-ci représentent deux approches fondamentalement différentes de l'écriture arabe, chacune avec sa propre histoire, esthétique et signification culturelle.

Pour les développeurs et les designers, comprendre cette distinction est crucial. Choisir le mauvais style peut faire paraître votre interface « bizarre » aux locuteurs natifs — comme utiliser le Fraktur gothique pour un site web anglais moderne.

Ce guide explore les deux styles en profondeur : leurs origines, caractéristiques visuelles, défis techniques et cas d'utilisation appropriés.

## Naskh : le standard universel

### Qu'est-ce que le Naskh ?

Le Naskh (نسخ, signifiant « copier » ou « transcription ») est le style le plus utilisé pour l'écriture arabe. Quand vous voyez du texte arabe dans un livre, un journal ou un site web, il est presque certainement composé dans une police de style Naskh.

### Développement historique

Le Naskh a émergé au 10e siècle sous la systématisation d'**Ibn Muqla** (886-940 de notre ère), un vizir et maître calligraphe à la cour abbasside de Bagdad. Il a développé un système proportionnel où toutes les lettres se rapportent mathématiquement à :

1. Le **point rhomboïque** (nuqta) : Créé en pressant le calame à 45°
2. L'**alif** : Un trait vertical dont la hauteur détermine les autres proportions

### Caractéristiques visuelles

Le Naskh possède plusieurs caractéristiques définissantes :

1. **Ligne de base horizontale** : Les lettres reposent sur une ligne horizontale constante
2. **Courbes modérées** : Formes arrondies mais pas extrêmes
3. **Formes compactes** : Les lettres s'empilent efficacement
4. **Lisibilité claire** : Le système proportionnel assure que les caractères sont distincts

### Où le Naskh est utilisé

- **Arabe** (tous les pays)
- **Persan** (aux côtés du Nastaliq dans les contextes formels)
- **Ourdou** (pour les textes religieux et certains contextes numériques)
- **Kurde**, **pachto**, **ouïghour** et la plupart des autres langues en écriture arabe

## Nastaliq : l'écriture artistique

### Qu'est-ce que le Nastaliq ?

Le Nastaliq (نستعلیق, une combinaison de « Naskh » + « Ta'liq ») est un style calligraphique développé en Perse. Il est caractérisé par son flux diagonal dramatique, où les lettres semblent pendre d'une ligne inclinée invisible.

### Développement historique

Le Nastaliq a émergé en Iran aux 14e-15e siècles, traditionnellement attribué à **Mir Ali Tabrizi** (mort en 1446). La légende dit qu'il a rêvé d'oies en vol, dont la formation a inspiré le balayage diagonal distinctif de l'écriture.

### Caractéristiques visuelles

Le Nastaliq est visuellement frappant :

1. **Ligne de base diagonale** : S'incline dramatiquement du haut-droite vers le bas-gauche
2. **Lettres suspendues** : Les lettres semblent pendre de la ligne de base
3. **Contraste extrême** : Variation dramatique entre traits épais et fins
4. **Empilement vertical** : Les lettres s'empilent fréquemment les unes sur les autres
5. **Jambages profonds** : Les lettres avec queues descendent loin sous la ligne de base

### Où le Nastaliq est utilisé

- **Ourdou** (l'écriture principale et préférée)
- **Pendjabi** (écriture Shahmukhi au Pakistan)
- **Cachemiri** (au Cachemire sous administration pakistanaise)
- **Persan** (pour la poésie et les applications artistiques)

## Comparaison côte à côte

| Aspect | Naskh | Nastaliq |
|--------|-------|----------|
| Ligne de base | Horizontale | Diagonale (45-60°) |
| Empilement des lettres | Minimal | Extensif |
| Contraste des traits | Modéré | Élevé |
| Profondeur des jambages | Modérée | Profonde |
| Nombre de glyphes | ~500 | ~20 000+ |
| Hauteur de ligne nécessaire | 1.5-1.8 | 2.0-2.5+ |
| Maturité numérique | Excellente | En amélioration |
| Langues principales | Arabe, persan | Ourdou, pendjabi |

## Implications techniques

### Sélection de police

```css
/* Pour le contenu arabe - Naskh */
.texte-arabe {
  font-family: 'Noto Naskh Arabic', 'Traditional Arabic', serif;
  line-height: 1.8;
}

/* Pour le contenu ourdou - Nastaliq */
.texte-ourdou {
  font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif;
  line-height: 2.4; /* Le Nastaliq a besoin de plus d'espace vertical */
}
```

### Considérations de hauteur de ligne

L'empilement vertical et les jambages profonds du Nastaliq nécessitent une hauteur de ligne significativement plus grande :

```css
/* Naskh */
.paragraphe-naskh {
  line-height: 1.6;
  margin-block: 1em;
}

/* Nastaliq */
.paragraphe-nastaliq {
  line-height: 2.2;
  margin-block: 1.5em;
  /* Prévenir le chevauchement des jambages et ascendantes */
}
```

## Considérations culturelles

### Attentes des lecteurs

Utiliser le mauvais style d'écriture crée une dissonance cognitive :

- **Lecteurs arabes** : S'attendent au Naskh. Le Nastaliq semble étranger et ornemental.
- **Lecteurs ourdous** : Préfèrent fortement le Nastaliq. Le Naskh semble comme « lire de l'arabe » et perd l'identité ourdoue.
- **Lecteurs persans** : Acceptent les deux, mais associent le Nastaliq à la poésie et le Naskh au texte quotidien.

### Guide des cas d'utilisation

| Contexte | Arabe | Ourdou | Persan |
|----------|-------|--------|--------|
| Site d'actualités | Naskh | Nastaliq | Naskh |
| Interface d'app mobile | Naskh | Nastaliq | Naskh |
| Livre de poésie | Naskh (ou coufique) | Nastaliq | Nastaliq |
| Texte religieux | Naskh | Naskh/Nastaliq | Naskh |
| Design de logo | Variable | Nastaliq | Variable |

## Points clés à retenir

1. **Le Naskh est universel** : Il fonctionne pour l'arabe et la plupart des langues en écriture arabe, avec un excellent support numérique.

2. **Le Nastaliq est culturellement essentiel** : Pour les locuteurs ourdous, le Nastaliq n'est pas qu'une préférence — c'est une identité.

3. **La complexité technique diffère dramatiquement** : Le Nastaliq nécessite 40 fois plus de glyphes et une logique de positionnement 2D.

4. **La hauteur de ligne est importante** : Le Nastaliq a besoin d'au moins 2.0-2.4 de hauteur de ligne pour éviter les chevauchements.

5. **Connaissez votre public** : Utiliser le mauvais style aliène les lecteurs instantanément.

## Pour aller plus loin

- [L'histoire de l'écriture arabe](/fr/blog/history-of-arabic-script)
- [L'ourdou et le Nastaliq : l'élégante écriture de l'Asie du Sud](/fr/blog/urdu-nastaliq-script)
- [Les ligatures arabes : comprendre les lettres connectées](/fr/blog/arabic-ligatures)
- [La calligraphie islamique : un art sacré et son héritage moderne](/fr/blog/islamic-calligraphy)
