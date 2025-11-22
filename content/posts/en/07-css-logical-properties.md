---
id: "css-logical-properties"
title: "CSS Logical Properties for RTL/LTR Support"
excerpt: "How to use CSS logical properties to create layouts that automatically adapt to any writing direction."
category: "rtl-ltr-concepts"
author: "nuno-marques"
publishedAt: "2025-01-02"
readingTime: 10
featured: false
featuredImage: "/images/posts/css-logical-properties.jpg"
tags: ["css", "rtl", "ltr", "logical-properties", "web-development"]
---

## Introduction

For years, CSS has used physical properties like `margin-left`, `padding-right`, `border-top`, and `text-align: left`. These work perfectly for left-to-right languages, but break down when you need to support RTL languages like Arabic or Hebrew.

Enter **CSS Logical Properties**—a modern approach that uses `start` and `end` instead of `left` and `right`. With logical properties, your layouts automatically adapt to any writing direction without a single line of direction-specific CSS.

## The Problem with Physical Properties

### The Traditional Approach

Consider a simple card layout:

```css
/* Traditional physical properties */
.card {
  padding-left: 20px;
  margin-right: 16px;
  border-left: 4px solid blue;
  text-align: left;
}
```

For LTR, this looks great. But for RTL? The padding is on the wrong side, the margin is backwards, and the border is in the wrong place.

### The Old Fix: Duplication

Previously, you had to duplicate styles:

```css
/* LTR styles */
.card {
  padding-left: 20px;
  margin-right: 16px;
  border-left: 4px solid blue;
  text-align: left;
}

/* RTL overrides */
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

This approach has problems:
- Code duplication
- Easy to miss properties
- Maintenance nightmare
- Increased CSS file size

## Enter Logical Properties

### The Modern Solution

Logical properties use the concept of **start** and **end** relative to the writing mode:

```css
/* Logical properties - works for both LTR and RTL */
.card {
  padding-inline-start: 20px;
  margin-inline-end: 16px;
  border-inline-start: 4px solid blue;
  text-align: start;
}
```

Just set `dir="rtl"` on your HTML, and everything flips automatically!

## Understanding the Terminology

### Flow-Relative vs. Physical

CSS Logical Properties use two axes:
- **Block axis**: The direction blocks stack (typically vertical)
- **Inline axis**: The direction text flows (horizontal in Latin/Arabic)

### The Mapping

| Physical | Logical (Inline) | Behavior in RTL |
|----------|------------------|-----------------|
| left | inline-start | Becomes right |
| right | inline-end | Becomes left |

| Physical | Logical (Block) | Behavior |
|----------|-----------------|----------|
| top | block-start | Usually stays top |
| bottom | block-end | Usually stays bottom |

## Complete Property Reference

### Margin

```css
/* Physical */
margin-top: 10px;
margin-right: 20px;
margin-bottom: 10px;
margin-left: 20px;

/* Logical */
margin-block-start: 10px;
margin-inline-end: 20px;
margin-block-end: 10px;
margin-inline-start: 20px;

/* Shorthand */
margin-block: 10px;          /* top and bottom */
margin-inline: 20px;         /* start and end */
margin-inline: 20px 30px;    /* start end */
```

### Padding

```css
/* Physical */
padding-left: 15px;
padding-right: 15px;

/* Logical */
padding-inline-start: 15px;
padding-inline-end: 15px;

/* Shorthand */
padding-inline: 15px;        /* both start and end */
padding-block: 10px 20px;    /* start end */
```

### Border

```css
/* Physical */
border-left: 2px solid red;
border-right-width: 1px;

/* Logical */
border-inline-start: 2px solid red;
border-inline-end-width: 1px;

/* Border radius - logical values */
border-start-start-radius: 8px;  /* top-left in LTR */
border-start-end-radius: 8px;    /* top-right in LTR */
border-end-start-radius: 8px;    /* bottom-left in LTR */
border-end-end-radius: 8px;      /* bottom-right in LTR */
```

### Sizing

```css
/* Physical */
width: 300px;
height: 200px;
min-width: 100px;
max-height: 500px;

/* Logical */
inline-size: 300px;
block-size: 200px;
min-inline-size: 100px;
max-block-size: 500px;
```

### Positioning

```css
/* Physical */
position: absolute;
top: 0;
left: 0;
right: auto;
bottom: auto;

/* Logical */
position: absolute;
inset-block-start: 0;
inset-inline-start: 0;
inset-inline-end: auto;
inset-block-end: auto;

/* Shorthand */
inset: 0;                        /* all sides */
inset-block: 10px;               /* top and bottom */
inset-inline: 20px;              /* start and end */
inset: 10px 20px 10px 20px;      /* top right bottom left (physical!) */
```

### Text Alignment

```css
/* Physical */
text-align: left;
text-align: right;

/* Logical */
text-align: start;
text-align: end;
```

### Float and Clear

```css
/* Physical */
float: left;
clear: right;

/* Logical */
float: inline-start;
clear: inline-end;
```

## Real-World Examples

### Navigation Component

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

### Card with Icon

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

.card-action {
  margin-inline-start: auto;
}
```

### Form Layout

```css
.form-group {
  margin-block-end: 20px;
}

.form-label {
  display: block;
  margin-block-end: 8px;
  text-align: start;
}

.form-input {
  padding-inline: 12px;
  padding-block: 8px;
  text-align: start;
}

.form-hint {
  margin-block-start: 4px;
  padding-inline-start: 12px;
  font-size: 0.875rem;
}
```

### Sidebar Layout

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

## Browser Support

CSS Logical Properties have excellent modern browser support:

| Browser | Support |
|---------|---------|
| Chrome | 89+ (full) |
| Firefox | 66+ (full) |
| Safari | 15+ (full) |
| Edge | 89+ (full) |

For older browsers, consider using PostCSS with the `postcss-logical` plugin:

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-logical')({
      dir: 'ltr',  // Fallback direction
      preserve: true  // Keep logical properties too
    })
  ]
}
```

This generates fallback physical properties:

```css
/* Input */
.card {
  margin-inline-start: 20px;
}

/* Output */
.card {
  margin-left: 20px;
  margin-inline-start: 20px;
}
```

## Combining with Flexbox and Grid

### Flexbox

Flexbox is inherently logical and respects `direction`:

```css
.container {
  display: flex;
  flex-direction: row; /* Reverses in RTL */
}
```

Items automatically reorder based on direction—no changes needed!

### Grid

CSS Grid also works logically:

```css
.grid {
  display: grid;
  grid-template-columns: 200px 1fr; /* Reverses in RTL */
  gap: 20px;
}
```

Grid areas and track placement follow the document direction automatically.

## Migration Strategy

### Step 1: Audit Current CSS

Find all physical properties that should be logical:

```bash
# Find left/right usage in CSS
grep -r "margin-left\|margin-right\|padding-left\|padding-right" src/
```

### Step 2: Identify What Should Change

Not everything should use logical properties:

**Should be logical:**
- Layout spacing (margins, padding)
- Borders that indicate hierarchy
- Text alignment
- Positioning for UI elements

**Should stay physical:**
- Box shadows (light source stays consistent)
- Visual decorations not tied to reading direction
- Absolutely positioned tooltips (context-dependent)

### Step 3: Gradual Migration

Convert components one at a time:

```css
/* Before */
.button {
  padding: 8px 16px;
  margin-right: 8px;
  text-align: left;
}

/* After */
.button {
  padding-block: 8px;
  padding-inline: 16px;
  margin-inline-end: 8px;
  text-align: start;
}
```

### Step 4: Remove RTL Overrides

Delete direction-specific overrides that are now unnecessary:

```css
/* Remove these */
[dir="rtl"] .button {
  margin-right: 0;
  margin-left: 8px;
  text-align: right;
}
```

## Common Gotchas

### 1. The `inset` Shorthand is Physical!

```css
/* This is still physical! */
inset: 10px 20px 10px 20px;
/* Equivalent to: top right bottom left */

/* Use individual logical properties for RTL support */
inset-block: 10px;
inset-inline: 20px;
```

### 2. Transform and Animation

Transforms use physical coordinates:

```css
/* This doesn't flip in RTL */
transform: translateX(20px);

/* You may need direction-specific values */
[dir="rtl"] .element {
  transform: translateX(-20px);
}
```

### 3. Background Position

Background position is physical:

```css
/* Doesn't flip automatically */
background-position: left center;

/* Need manual override or use logical alternative */
background-position-x: left; /* No logical equivalent yet */
```

## Key Takeaways

1. **Use logical properties by default**: Start with `inline-start`/`inline-end` instead of `left`/`right` for all new CSS.

2. **Leverage Flexbox and Grid**: They handle direction automatically.

3. **Physical isn't always wrong**: Some properties (shadows, decorative borders) should stay physical.

4. **Browser support is excellent**: All modern browsers fully support logical properties.

5. **Migration is incremental**: Convert component by component, removing RTL overrides as you go.

## Further Reading

- [Understanding RTL Text Direction](/blog/understanding-rtl)
- [Common RTL Bugs and How to Fix Them](/blog/common-rtl-bugs)
- [Bidirectional Text and the Unicode BiDi Algorithm](/blog/bidirectional-text-bidi)
- [How Reading Direction Affects User Experience](/blog/reading-direction-ux)
