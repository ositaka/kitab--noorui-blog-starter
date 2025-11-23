---
id: "css-logical-properties"
title: "Propriétés logiques CSS pour le support RTL/LTR"
excerpt: "Comment utiliser les propriétés logiques CSS pour créer des mises en page qui s'adaptent automatiquement à n'importe quelle direction d'écriture."
category: "rtl-ltr-concepts"
author: "karim-benali"
publishedAt: "2025-01-02"
readingTime: 10
featured: false
featuredImage: "/images/posts/css-logical-properties.jpg"
tags: ["css", "rtl", "ltr", "propriétés-logiques", "développement-web"]
---

## Introduction

Pendant des années, le CSS a utilisé des propriétés physiques comme `margin-left`, `padding-right`, `border-top` et `text-align: left`. Celles-ci fonctionnent parfaitement pour les langues de gauche à droite, mais échouent quand vous devez supporter les langues RTL comme l'arabe ou l'hébreu.

Voici les **propriétés logiques CSS** — une approche moderne qui utilise `start` et `end` au lieu de `left` et `right`. Avec les propriétés logiques, vos mises en page s'adaptent automatiquement à n'importe quelle direction d'écriture sans une seule ligne de CSS spécifique à la direction.

## Le problème des propriétés physiques

### L'approche traditionnelle

Considérez une mise en page de carte simple :

```css
/* Propriétés physiques traditionnelles */
.card {
  padding-left: 20px;
  margin-right: 16px;
  border-left: 4px solid blue;
  text-align: left;
}
```

Pour LTR, cela semble parfait. Mais pour RTL ? Le padding est du mauvais côté, la marge est à l'envers, et la bordure est au mauvais endroit.

### L'ancienne solution : la duplication

Auparavant, il fallait dupliquer les styles :

```css
/* Styles LTR */
.card {
  padding-left: 20px;
  margin-right: 16px;
  border-left: 4px solid blue;
  text-align: left;
}

/* Surcharges RTL */
[dir="rtl"] .card {
  padding-left: 0;
  padding-right: 20px;
  margin-right: 0;
  margin-left: 16px;
  border-left: none;
  border-right: 4px solid blue;
  text-align: right;
}
```

Cette approche pose des problèmes :
- Duplication de code
- Propriétés facilement oubliées
- Cauchemar de maintenance
- Taille de fichier CSS augmentée

## Les propriétés logiques

### La solution moderne

Les propriétés logiques utilisent le concept de **start** et **end** relatif au mode d'écriture :

```css
/* Propriétés logiques - fonctionne pour LTR et RTL */
.card {
  padding-inline-start: 20px;
  margin-inline-end: 16px;
  border-inline-start: 4px solid blue;
  text-align: start;
}
```

Définissez simplement `dir="rtl"` sur votre HTML, et tout s'inverse automatiquement !

## Comprendre la terminologie

### Relatif au flux vs physique

Les propriétés logiques CSS utilisent deux axes :
- **Axe block** : La direction dans laquelle les blocs s'empilent (typiquement vertical)
- **Axe inline** : La direction dans laquelle le texte s'écoule (horizontal en latin/arabe)

### La correspondance

| Physique | Logique (Inline) | Comportement en RTL |
|----------|------------------|---------------------|
| left | inline-start | Devient right |
| right | inline-end | Devient left |

| Physique | Logique (Block) | Comportement |
|----------|-----------------|--------------|
| top | block-start | Reste généralement top |
| bottom | block-end | Reste généralement bottom |

## Référence complète des propriétés

### Margin

```css
/* Physique */
margin-top: 10px;
margin-right: 20px;
margin-bottom: 10px;
margin-left: 20px;

/* Logique */
margin-block-start: 10px;
margin-inline-end: 20px;
margin-block-end: 10px;
margin-inline-start: 20px;

/* Raccourci */
margin-block: 10px;          /* haut et bas */
margin-inline: 20px;         /* début et fin */
```

### Padding

```css
/* Physique */
padding-left: 15px;
padding-right: 15px;

/* Logique */
padding-inline-start: 15px;
padding-inline-end: 15px;

/* Raccourci */
padding-inline: 15px;        /* début et fin */
```

### Border

```css
/* Physique */
border-left: 2px solid red;

/* Logique */
border-inline-start: 2px solid red;

/* Border radius - valeurs logiques */
border-start-start-radius: 8px;  /* haut-gauche en LTR */
border-start-end-radius: 8px;    /* haut-droite en LTR */
border-end-start-radius: 8px;    /* bas-gauche en LTR */
border-end-end-radius: 8px;      /* bas-droite en LTR */
```

### Dimensionnement

```css
/* Physique */
width: 300px;
height: 200px;

/* Logique */
inline-size: 300px;
block-size: 200px;
```

### Positionnement

```css
/* Physique */
position: absolute;
top: 0;
left: 0;

/* Logique */
position: absolute;
inset-block-start: 0;
inset-inline-start: 0;
```

### Alignement du texte

```css
/* Physique */
text-align: left;
text-align: right;

/* Logique */
text-align: start;
text-align: end;
```

## Exemples concrets

### Composant de navigation

```css
.nav {
  display: flex;
  padding-inline: 20px;
}

.nav-logo {
  margin-inline-end: auto;
}

.nav-link {
  padding-inline: 16px;
  border-inline-end: 1px solid #ccc;
}

.nav-link:last-child {
  border-inline-end: none;
}
```

### Carte avec icône

```css
.card {
  display: flex;
  align-items: center;
  padding: 16px;
  border-inline-start: 4px solid var(--accent-color);
}

.card-icon {
  margin-inline-end: 12px;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  text-align: start;
}
```

### Mise en page avec barre latérale

```css
.layout {
  display: flex;
}

.sidebar {
  inline-size: 250px;
  padding-inline-end: 24px;
  border-inline-end: 1px solid #e5e5e5;
}

.main-content {
  flex: 1;
  padding-inline-start: 24px;
}
```

## Support navigateur

Les propriétés logiques CSS ont un excellent support dans les navigateurs modernes :

| Navigateur | Support |
|------------|---------|
| Chrome | 89+ (complet) |
| Firefox | 66+ (complet) |
| Safari | 15+ (complet) |
| Edge | 89+ (complet) |

## Combinaison avec Flexbox et Grid

### Flexbox

Flexbox est intrinsèquement logique et respecte la `direction` :

```css
.container {
  display: flex;
  flex-direction: row; /* S'inverse en RTL */
}
```

Les éléments se réordonnent automatiquement selon la direction — aucun changement nécessaire !

### Grid

CSS Grid fonctionne aussi de manière logique :

```css
.grid {
  display: grid;
  grid-template-columns: 200px 1fr; /* S'inverse en RTL */
  gap: 20px;
}
```

## Points clés à retenir

1. **Utilisez les propriétés logiques par défaut** : Commencez avec `inline-start`/`inline-end` au lieu de `left`/`right` pour tout nouveau CSS.

2. **Exploitez Flexbox et Grid** : Ils gèrent la direction automatiquement.

3. **Le physique n'est pas toujours faux** : Certaines propriétés (ombres, bordures décoratives) doivent rester physiques.

4. **Le support navigateur est excellent** : Tous les navigateurs modernes supportent entièrement les propriétés logiques.

5. **La migration est incrémentale** : Convertissez composant par composant, en supprimant les surcharges RTL au fur et à mesure.

## Pour aller plus loin

- [Comprendre la direction du texte RTL](/blog/understanding-rtl)
- [Bugs RTL courants et comment les corriger](/blog/common-rtl-bugs)
- [Le texte bidirectionnel et l'algorithme BiDi Unicode](/blog/bidirectional-text-bidi)
- [Comment la direction de lecture affecte l'expérience utilisateur](/blog/reading-direction-ux)
