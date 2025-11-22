---
id: "common-rtl-bugs"
title: "Bugs RTL courants et comment les corriger"
excerpt: "Un guide pratique pour identifier et corriger les problèmes les plus courants lors de l'implémentation du support RTL."
category: "rtl-ltr-concepts"
author: "karim-benali"
publishedAt: "2024-12-28"
readingTime: 12
featured: false
featuredImage: "/images/posts/common-rtl-bugs.jpg"
tags: ["rtl", "débogage", "css", "bugs", "développement-web"]
---

## Introduction

Vous avez ajouté `dir="rtl"` à votre HTML, mais quelque chose ne va pas. Le texte est inversé, mais les boutons sont à des endroits étranges, les icônes pointent dans la mauvaise direction, et ce menu déroulant s'ouvre hors de l'écran.

Les bugs RTL sont frustrants car ils sont souvent subtils et difficiles à repérer si vous ne lisez pas la langue. Ce guide catalogue les problèmes RTL les plus courants avec des exemples avant/après clairs et des solutions testées.

## Bug n°1 : Icônes pointant dans la mauvaise direction

### Le problème

Les icônes directionnelles (flèches, chevrons) pointent toujours vers la gauche quand elles devraient pointer vers la droite :

```
LTR : Suivant →
RTL : التالي →  ← Devrait être : ← التالي
```

### La solution

**Option 1 : Utiliser CSS Transform**

```css
[dir="rtl"] .icon-arrow {
  transform: scaleX(-1);
}
```

**Option 2 : Utiliser des ensembles d'icônes logiques**

```css
.icon-chevron-start::before {
  content: url('chevron-left.svg');
}
.icon-chevron-end::before {
  content: url('chevron-right.svg');
}

[dir="rtl"] .icon-chevron-start::before {
  content: url('chevron-right.svg');
}
[dir="rtl"] .icon-chevron-end::before {
  content: url('chevron-left.svg');
}
```

### Icônes qui ne doivent PAS s'inverser

Gardez celles-ci cohérentes quelle que soit la direction :
- Boutons lecture/pause (contrôles média universels)
- Coches et croix
- Signes plus et moins
- Annuler/Rétablir (direction historique)
- Icônes de lien externe

## Bug n°2 : Problèmes de débordement de texte et ellipse

### Le problème

Le texte tronqué affiche l'ellipse du mauvais côté :

```
LTR : Ceci est un texte très l...
RTL : ...هذا نص طويل جداً ي  ← Mauvais côté !
```

### La solution

```css
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: start; /* Pas 'left' */
}
```

## Bug n°3 : Éléments de formulaire mal alignés

### Le problème

Les labels et inputs ne s'alignent pas correctement.

### La solution

Utilisez les propriétés logiques et flexbox :

```css
.form-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-label {
  text-align: start;
  min-inline-size: 100px;
}

.form-input {
  flex: 1;
  text-align: start;
  padding-inline: 12px;
}
```

## Bug n°4 : Éléments positionnés absolument

### Le problème

Les menus déroulants, tooltips et modales apparaissent aux mauvaises positions :

```css
/* Ceci casse en RTL */
.dropdown {
  position: absolute;
  left: 0;
  top: 100%;
}
```

### La solution

**Option 1 : Propriétés logiques**

```css
.dropdown {
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 100%;
}
```

**Option 2 : JavaScript conscient de la direction**

```javascript
function positionDropdown(trigger, dropdown) {
  const isRTL = getComputedStyle(document.documentElement).direction === 'rtl';
  const rect = trigger.getBoundingClientRect();

  dropdown.style.top = `${rect.bottom}px`;

  if (isRTL) {
    dropdown.style.right = `${window.innerWidth - rect.right}px`;
    dropdown.style.left = 'auto';
  } else {
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.right = 'auto';
  }
}
```

## Bug n°5 : Problèmes de direction d'animation

### Le problème

Les animations de glissement viennent du mauvais côté :

```css
/* Glisse depuis la gauche - incorrect pour RTL ! */
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
```

### La solution

**Utiliser des propriétés CSS personnalisées**

```css
:root {
  --slide-from: -100%;
}

[dir="rtl"] {
  --slide-from: 100%;
}

@keyframes slideIn {
  from { transform: translateX(var(--slide-from)); }
  to { transform: translateX(0); }
}
```

## Bug n°6 : Coins de border-radius incorrects

### Le problème

Le border-radius asymétrique s'applique aux mauvais coins :

```css
/* Arrondit haut-gauche et bas-gauche */
.card {
  border-radius: 8px 0 0 8px;
}
/* En RTL, vous voulez probablement haut-droit et bas-droit */
```

### La solution

```css
.card {
  border-start-start-radius: 8px;
  border-end-start-radius: 8px;
  border-start-end-radius: 0;
  border-end-end-radius: 0;
}
```

## Bug n°7 : Débordement de texte bidirectionnel

### Le problème

Le texte mixte LTR/RTL casse la mise en page :

```html
<p dir="rtl">البريد الإلكتروني: user@example.com</p>
<!-- L'email peut apparaître à une position inattendue -->
```

### La solution

Utilisez `<bdi>` ou `dir="ltr"` sur le contenu intégré :

```html
<p dir="rtl">
  البريد الإلكتروني : <bdi dir="ltr">user@example.com</bdi>
</p>
```

## Bug n°8 : Barres de progression et curseurs

### Le problème

La progression se remplit du mauvais côté :

```css
.progress-fill {
  width: 60%;
  /* Se remplit depuis la gauche, devrait se remplir depuis la droite en RTL */
}
```

### La solution

```css
.progress-bar {
  display: flex;
}

.progress-fill {
  /* Flexbox gère la direction */
  height: 100%;
  background: var(--accent);
}

/* Ou avec positionnement explicite */
.progress-fill {
  position: absolute;
  inset-inline-start: 0;
  width: 60%;
}
```

## Checklist de débogage

Utilisez cette checklist lors des tests RTL :

- [ ] Le texte se lit naturellement de droite à gauche
- [ ] L'ordre de navigation est inversé
- [ ] Les barres latérales sont du bon côté
- [ ] Les icônes indiquent la bonne direction
- [ ] Les labels de formulaire s'alignent avec les inputs
- [ ] Les menus déroulants s'ouvrent dans la bonne direction
- [ ] Le comportement de défilement semble naturel
- [ ] Les animations entrent du bon côté
- [ ] Les indicateurs de progression se remplissent correctement
- [ ] Les modales se centrent correctement
- [ ] Pas de problèmes de débordement de texte
- [ ] Le contenu mixte (emails, URLs) s'affiche correctement

## Points clés à retenir

1. **Testez tôt et souvent** : Les bugs RTL sont plus faciles à corriger quand ils sont détectés tôt.

2. **Utilisez les propriétés logiques** : Elles préviennent la plupart des problèmes de positionnement automatiquement.

3. **N'inversez pas tout** : Certains éléments (icônes, ombres) nécessitent une considération attentive.

4. **Gérez le texte BiDi** : Utilisez `<bdi>` pour le contenu intégré de direction opposée.

5. **Testez avec des locuteurs natifs** : Ils détecteront des problèmes que les tests automatisés manquent.

## Pour aller plus loin

- [Comprendre la direction du texte RTL](/blog/understanding-rtl)
- [Propriétés logiques CSS pour le support RTL/LTR](/blog/css-logical-properties)
- [Le texte bidirectionnel et l'algorithme BiDi Unicode](/blog/bidirectional-text-bidi)
- [Comment la direction de lecture affecte l'expérience utilisateur](/blog/reading-direction-ux)
