---
id: "numbers-in-rtl-languages"
title: "Les nombres dans les langues RTL : guide du développeur"
excerpt: "Comprendre comment les nombres fonctionnent en arabe, hébreu et autres langues de droite à gauche."
category: "rtl-ltr-concepts"
author: "karim-benali"
publishedAt: "2025-01-04"
readingTime: 7
featured: false
featuredImage: "/images/posts/numbers-rtl.jpg"
tags: ["nombres", "rtl", "arabe", "localisation", "i18n"]
---

## Introduction

L'un des aspects les plus déroutants des langues RTL pour les développeurs est la gestion des nombres. Les nombres s'inversent-ils aussi ? Quel système de chiffres devrait-on utiliser ? Comment fonctionnent les numéros de téléphone, les dates et les devises ?

Ce guide répond à ces questions avec des exemples pratiques et des extraits de code.

## La réponse rapide

**Les nombres se lisent de gauche à droite, même dans un texte RTL.**

Que vous écriviez 123 en français ou ١٢٣ en arabe, les chiffres sont lus dans le même ordre : un-deux-trois, pas trois-deux-un.

Cela surprend de nombreux développeurs qui supposent que tout s'inverse en RTL. La logique est sensée : la notation mathématique est universelle, et changer l'ordre des chiffres changerait les valeurs numériques.

## Les systèmes de chiffres

### Chiffres arabes occidentaux (0-9)

Les chiffres que la majeure partie du monde utilise :
```
0 1 2 3 4 5 6 7 8 9
```

Bien qu'appelés « chiffres arabes » en Occident (parce que l'Europe les a appris des mathématiciens arabes), ils sont en fait dérivés des chiffres indiens via le monde islamique.

### Chiffres arabes orientaux (٠-٩)

Utilisés dans les pays arabophones du Moyen-Orient :
```
٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩
0 1 2 3 4 5 6 7 8 9
```

### Chiffres persans (۰-۹)

Variantes légères utilisées en Iran, Afghanistan et Pakistan :
```
۰ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹
```

Notez que ۴ (4) et ۶ (6) ont une apparence différente de leurs équivalents arabes ٤ et ٦.

### Lequel utiliser ?

Les préférences régionales varient :

| Région | Pratique courante |
|--------|------------------|
| Égypte, Moyen-Orient | Arabe oriental (٠-٩) |
| Maroc, Tunisie, Libye | Arabe occidental (0-9) |
| Iran, Afghanistan | Persan (۰-۹) |
| Israël | Arabe occidental (0-9) |
| Pakistan | Mélange persan et occidental |

## Formater les nombres en JavaScript

### Utilisation de Intl.NumberFormat

L'API d'internationalisation de JavaScript gère le formatage des nombres :

```javascript
// Formatage basique des nombres
const num = 1234567.89;

// Arabe avec chiffres orientaux
new Intl.NumberFormat('ar-EG').format(num)
// Résultat : "١٬٢٣٤٬٥٦٧٫٨٩"

// Arabe avec chiffres occidentaux (Maroc)
new Intl.NumberFormat('ar-MA').format(num)
// Résultat : "1.234.567,89"

// Persan
new Intl.NumberFormat('fa-IR').format(num)
// Résultat : "۱٬۲۳۴٬۵۶۷٫۸۹"

// Hébreu
new Intl.NumberFormat('he-IL').format(num)
// Résultat : "1,234,567.89"
```

### Formatage des devises

```javascript
const montant = 1234.56;

// Arabe (Égypte) - Livre égyptienne
new Intl.NumberFormat('ar-EG', {
  style: 'currency',
  currency: 'EGP'
}).format(montant)
// Résultat : "١٬٢٣٤٫٥٦ ج.م.‏"

// Arabe (Arabie Saoudite) - Riyal saoudien
new Intl.NumberFormat('ar-SA', {
  style: 'currency',
  currency: 'SAR'
}).format(montant)
// Résultat : "١٬٢٣٤٫٥٦ ر.س.‏"
```

## Numéros de téléphone

Les numéros de téléphone présentent un défi unique : ils doivent toujours s'afficher dans un format cohérent et reconnaissable, quelle que soit la direction de la langue.

### Meilleure pratique : toujours LTR

```html
<p dir="rtl">
  رقم الهاتف : <span dir="ltr">+33 1 23 45 67 89</span>
</p>
```

```css
.numero-telephone {
  direction: ltr;
  unicode-bidi: embed;
}
```

## Dates et heures

### Formatage des dates

Utilisez l'API d'internationalisation :

```javascript
const date = new Date('2025-01-15');

// Arabe (Égypte)
new Intl.DateTimeFormat('ar-EG').format(date)
// Résultat : "١٥‏/١‏/٢٠٢٥"

// Arabe (Arabie Saoudite) - Calendrier différent
new Intl.DateTimeFormat('ar-SA').format(date)
// Résultat : "١٥‏/٧‏/١٤٤٦ هـ" (calendrier hégirien)

// Persan (Iran) - Calendrier solaire hégirien
new Intl.DateTimeFormat('fa-IR').format(date)
// Résultat : "۱۴۰۳/۱۰/۲۶"
```

## Plages numériques

Les plages comme « 10-20 » ou « pages 5-10 » peuvent se casser en RTL :

```html
<!-- Le tiret peut se déplacer incorrectement -->
<p dir="rtl">صفحات 5-10</p>

<!-- Solution 1 : Isolation LTR -->
<p dir="rtl">صفحات <span dir="ltr">5-10</span></p>

<!-- Solution 2 : Utiliser un tiret demi-cadratin approprié -->
<p dir="rtl">صفحات 5–10</p>

<!-- Solution 3 : Texte arabe pour les plages -->
<p dir="rtl">صفحات ٥ إلى ١٠</p>
```

## Erreurs courantes

### 1. Inverser l'ordre des chiffres

```javascript
// INCORRECT : N'inversez pas les chiffres pour RTL
const mauvaisRTL = '123'.split('').reverse().join('');
// Résultat : "321" - Cela change la valeur !

// CORRECT : Laissez le navigateur gérer l'affichage
// Utilisez simplement le nombre tel quel
const correct = '123';
```

### 2. Coder en dur les systèmes de chiffres

```javascript
// INCORRECT : Supposer un seul système de chiffres
function formaterPrix(prix) {
  return `${prix}€`;
}

// CORRECT : Utiliser la localisation
function formaterPrix(prix, locale) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR'
  }).format(prix);
}
```

### 3. Ignorer les séparateurs décimaux

Différentes locales utilisent différents séparateurs :

| Locale | Nombre |
|--------|--------|
| en-US | 1,234.56 |
| fr-FR | 1 234,56 |
| ar-EG | ١٬٢٣٤٫٥٦ |
| de-DE | 1.234,56 |

Utilisez toujours `Intl.NumberFormat` plutôt qu'un formatage manuel.

## Points clés à retenir

1. **Les nombres sont LTR** : Même dans les langues RTL, l'ordre des chiffres reste le même (123, pas 321).

2. **Choisissez les bons chiffres** : Arabe oriental (٠-٩), persan (۰-۹) ou occidental (0-9) selon la locale.

3. **Utilisez l'API Intl** : `Intl.NumberFormat` et `Intl.DateTimeFormat` de JavaScript gèrent la localisation automatiquement.

4. **Isolez quand nécessaire** : Les numéros de téléphone, plages et mathématiques doivent être explicitement LTR.

5. **Testez avec de vraies locales** : Les pays arabophones ont des préférences différentes.

## Pour aller plus loin

- [Comprendre la direction du texte RTL](/blog/understanding-rtl)
- [Le texte bidirectionnel et l'algorithme BiDi Unicode](/blog/bidirectional-text-bidi)
- [Bugs RTL courants et comment les corriger](/blog/common-rtl-bugs)
- [Propriétés logiques CSS pour le support RTL/LTR](/blog/css-logical-properties)
