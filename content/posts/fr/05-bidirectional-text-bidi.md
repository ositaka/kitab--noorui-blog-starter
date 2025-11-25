---
id: "bidirectional-text-bidi"
title: "Le texte bidirectionnel et l'algorithme BiDi Unicode"
excerpt: "Apprenez comment les ordinateurs gèrent le texte mixte RTL et LTR grâce à l'algorithme bidirectionnel Unicode."
category: "rtl-ltr-concepts"
author: "karim-benali"
publishedAt: "2025-01-06"
readingTime: 13
featured: false
featuredImage: "/images/posts/bidirectional-text.jpg"
tags: ["bidi", "unicode", "rtl", "algorithmes", "rendu-texte"]
---

## Introduction

Que se passe-t-il quand un texte arabe contient des mots anglais ? Ou quand une phrase hébraïque inclut des nombres ? Quand du texte de gauche à droite et de droite à gauche apparaissent ensemble, les choses se compliquent rapidement.

Considérez ce texte mixte :
```
Le mot "مرحبا" signifie bonjour.
```

Le mot arabe « مرحبا » (marhaba) doit être rendu de droite à gauche, tandis que le français environnant va de gauche à droite. Comment un ordinateur sait-il dans quelle direction chaque caractère doit s'écouler ?

La réponse est l'**algorithme bidirectionnel Unicode** (BiDi) — un ensemble sophistiqué de règles qui régit l'affichage du texte à direction mixte. Comprendre le BiDi est essentiel pour tout développeur travaillant avec du texte multilingue.

## Qu'est-ce que le texte bidirectionnel ?

### Le problème

Les systèmes d'écriture ont des directions inhérentes différentes :
- **LTR (gauche à droite)** : Latin, grec, cyrillique, thaï, etc.
- **RTL (droite à gauche)** : Arabe, hébreu, syriaque, thaana

Quand du texte de différents systèmes directionnels apparaît ensemble, le moteur de rendu doit déterminer :
1. La direction globale du paragraphe
2. La direction de chaque segment dans le paragraphe
3. Comment gérer les caractères neutres (espaces, ponctuation, nombres)

### Un exemple simple

Considérez une phrase arabe avec un nom de marque anglais :

```
Direction de base droite à gauche :
← أنا أستخدم Microsoft Word يومياً ←
```

Cette phrase doit être lue comme :
1. « أنا أستخدم » (J'utilise) - RTL
2. « Microsoft Word » - LTR (intégré)
3. « يومياً » (quotidiennement) - RTL

Le défi est d'afficher cela correctement tout en maintenant l'ordre logique des caractères en mémoire.

## L'algorithme bidirectionnel Unicode

### Vue d'ensemble

L'algorithme BiDi Unicode (UBA), défini dans l'**annexe standard Unicode n°9**, spécifie exactement comment déterminer et rendre la direction du texte. Il est implémenté dans chaque navigateur moderne, système d'exploitation et moteur de rendu de texte.

### Concepts clés

#### Types de caractères

Chaque caractère Unicode possède une propriété de **classe bidirectionnelle**. Catégories principales :

| Classe | Nom | Exemples |
|--------|-----|----------|
| L | De gauche à droite | A-Z, lettres latines |
| R | De droite à gauche | Lettres hébraïques |
| AL | Lettre arabe | Lettres arabes |
| EN | Nombre européen | 0-9 |
| AN | Nombre arabe | ٠-٩ (arabo-indiques) |
| WS | Espace blanc | Espace |
| ON | Autre neutre | La plupart de la ponctuation |

#### Niveaux d'imbrication

L'algorithme assigne un **niveau d'imbrication** à chaque caractère :
- Les niveaux pairs (0, 2, 4...) = LTR
- Les niveaux impairs (1, 3, 5...) = RTL

Le niveau de base du paragraphe est typiquement déterminé par le premier caractère directionnel fort (L, R ou AL).

## Implications pratiques

### Contrôles HTML

Utilisez ces attributs et caractères :

```html
<!-- Définir la direction de base -->
<p dir="rtl">Paragraphe arabe avec de l'anglais ici</p>

<!-- Isoler le texte intégré -->
<p>Le mot <bdi>مرحبا</bdi> signifie bonjour.</p>

<!-- Outrepasser l'algorithme -->
<span dir="ltr">Forcer la direction LTR</span>
```

### Caractères de contrôle Unicode

Insérez ces caractères pour contrôler le comportement bidi :

```javascript
const LRM = '\u200E';  // Marque de gauche à droite
const RLM = '\u200F';  // Marque de droite à gauche
const LRI = '\u2066';  // Isolat de gauche à droite
const RLI = '\u2067';  // Isolat de droite à gauche
const FSI = '\u2068';  // Isolat premier fort
const PDI = '\u2069';  // Pop isolat directionnel

// Exemple : Assurer l'anglais dans un contexte RTL
const text = `مرحباً ${LRI}Microsoft${PDI} العالم`;
```

### Cas d'utilisation courants

#### Insérer du texte LTR dans un contexte RTL

```html
<!-- Le nom du produit doit rester LTR -->
<p dir="rtl">
  أنا أستخدم <span dir="ltr">iPhone 15 Pro</span> كل يوم
</p>
```

#### Adresses email

Les adresses email doivent toujours être LTR :
```html
<p dir="rtl">
  البريد الإلكتروني : <bdi dir="ltr">utilisateur@exemple.com</bdi>
</p>
```

## Pièges courants

### Problèmes de ponctuation

La ponctuation est « neutre », prenant sa direction du contexte :

```
Problème : "Hello, world" dans un contexte RTL
Incorrect : "Hello, world"  ← la ponctuation se déplace
Correct :   "Hello, world"  ← avec une isolation appropriée
```

Solution : Utilisez `<bdi>` ou des contrôles d'isolation.

### Nombres et mathématiques

Les nombres se lisent LTR même dans un texte RTL :
```
Arabe : الرقم ٤٢ صحيح (Le nombre 42 est correct)
Ordre de lecture : droite à gauche, mais 42 reste "42" pas "24"
```

Mais attention aux plages :
```
Problème : 10-20 en RTL
Incorrect : 20-10  ← le tiret se déplace, nombres inversés
Correct :   10-20  ← préserver avec isolation LTR
```

## Points clés à retenir

1. **Le BiDi est automatique mais imparfait** : L'algorithme BiDi Unicode gère la plupart des cas mais a besoin d'aide pour les cas limites.

2. **Utilisez les contrôles HTML** : L'attribut `dir` et l'élément `<bdi>` fournissent des solutions sémantiques et accessibles.

3. **Isolez, n'outrepassez pas** : `<bdi>` et les contrôles d'isolation sont plus sûrs que les imbrications ou les outrepassements.

4. **Testez avec du contenu réel** : Les tests synthétiques manquent la complexité du monde réel.

5. **Les caractères neutres ont besoin de contexte** : La ponctuation, les espaces et les nombres se comportent selon la direction du texte environnant.

## Pour aller plus loin

- [Comprendre la direction du texte RTL](/fr/blog/understanding-rtl)
- [Les nombres dans les langues RTL](/fr/blog/numbers-in-rtl-languages)
- [Propriétés logiques CSS pour le support RTL/LTR](/fr/blog/css-logical-properties)
- [Bugs RTL courants et comment les corriger](/fr/blog/common-rtl-bugs)
