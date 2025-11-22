---
id: "common-rtl-bugs"
title: "Common RTL Bugs and How to Fix Them"
excerpt: "A practical guide to identifying and fixing the most common issues when implementing RTL support."
category: "rtl-ltr-concepts"
author: "karim-benali"
publishedAt: "2024-12-28"
readingTime: 12
featured: false
featuredImage: "/images/posts/common-rtl-bugs.jpg"
tags: ["rtl", "debugging", "css", "bugs", "web-development"]
---

## Introduction

You've added `dir="rtl"` to your HTML, but something looks wrong. Text is mirrored, but buttons are in weird places, icons point the wrong way, and that dropdown menu opens off-screen.

RTL bugs are frustrating because they're often subtle and hard to spot if you don't read the language. This guide catalogs the most common RTL issues with clear before/after examples and tested solutions.

## Bug #1: Icons Pointing the Wrong Direction

### The Problem

Directional icons (arrows, carets, chevrons) still point left when they should point right:

```
LTR: Next →
RTL: التالي →  ← Should be: ← التالي
```

### The Fix

**Option 1: Use CSS Transform**

```css
[dir="rtl"] .icon-arrow {
  transform: scaleX(-1);
}
```

**Option 2: Use Logical Icon Sets**

```html
<!-- Instead of left/right-specific icons -->
<span class="icon-chevron-start"></span>
<span class="icon-chevron-end"></span>
```

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

**Option 3: CSS Logical Properties for Background**

```css
.icon {
  background-image: url('arrow.svg');
}

/* Future CSS (limited support) */
.icon {
  background-position-inline: start;
}
```

### Icons That Should NOT Flip

Keep these consistent regardless of direction:
- Play/pause buttons (universal media controls)
- Checkmarks and X marks
- Plus and minus signs
- Undo/redo (historical direction)
- External link icons

## Bug #2: Text Overflow and Ellipsis Issues

### The Problem

Truncated text shows ellipsis on the wrong side:

```
LTR: This is a very long t...
RTL: ...هذا نص طويل جداً ي  ← Wrong side!
```

### The Fix

```css
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: start; /* Not 'left' */
}
```

For multi-line truncation:

```css
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: start;
}
```

## Bug #3: Form Elements Misaligned

### The Problem

Labels and inputs don't align properly:

```
LTR:  [Label] [____________]
RTL:  [____________] [Label]  ← Looks backwards
```

### The Fix

Use logical properties and flexbox:

```css
.form-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-label {
  /* Logical properties handle direction */
  text-align: start;
  min-inline-size: 100px;
}

.form-input {
  flex: 1;
  text-align: start;
  padding-inline: 12px;
}
```

For stacked layouts:

```css
.form-group-stacked {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.form-label {
  margin-block-end: 8px;
  text-align: start;
}
```

## Bug #4: Absolutely Positioned Elements

### The Problem

Dropdowns, tooltips, and modals appear in wrong positions:

```css
/* This breaks in RTL */
.dropdown {
  position: absolute;
  left: 0;
  top: 100%;
}
```

### The Fix

**Option 1: Logical Properties**

```css
.dropdown {
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 100%;
}
```

**Option 2: Direction-Aware JavaScript**

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

## Bug #5: Scroll Position Issues

### The Problem

Horizontal scrolling doesn't work correctly:

```javascript
// This scrolls wrong direction in RTL
element.scrollLeft = 100;
```

### The Fix

RTL scroll behavior varies by browser. Use this normalizer:

```javascript
function setScrollStart(element, value) {
  const isRTL = getComputedStyle(element).direction === 'rtl';

  if (!isRTL) {
    element.scrollLeft = value;
    return;
  }

  // Browser detection for RTL scroll behavior
  // Firefox: negative values
  // Chrome/Safari: positive values from right
  const maxScroll = element.scrollWidth - element.clientWidth;

  // Normalize to work across browsers
  element.scrollLeft = maxScroll - value;
}

function getScrollStart(element) {
  const isRTL = getComputedStyle(element).direction === 'rtl';

  if (!isRTL) {
    return element.scrollLeft;
  }

  const maxScroll = element.scrollWidth - element.clientWidth;
  return maxScroll - Math.abs(element.scrollLeft);
}
```

## Bug #6: Animation Direction Issues

### The Problem

Slide-in animations come from the wrong side:

```css
/* Slides from left - wrong for RTL! */
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
```

### The Fix

**Option 1: CSS Custom Properties**

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

**Option 2: JavaScript-Controlled Animation**

```javascript
function getSlideDirection() {
  const isRTL = document.documentElement.dir === 'rtl';
  return isRTL ? '100%' : '-100%';
}

element.animate([
  { transform: `translateX(${getSlideDirection()})` },
  { transform: 'translateX(0)' }
], {
  duration: 300,
  easing: 'ease-out'
});
```

## Bug #7: Border Radius Corners Wrong

### The Problem

Asymmetric border radius applies to wrong corners:

```css
/* Rounds top-left and bottom-left */
.card {
  border-radius: 8px 0 0 8px;
}
/* In RTL, you probably want top-right and bottom-right */
```

### The Fix

```css
.card {
  border-start-start-radius: 8px;
  border-end-start-radius: 8px;
  border-start-end-radius: 0;
  border-end-end-radius: 0;
}
```

Logical border-radius mapping:

| Physical | Logical |
|----------|---------|
| top-left | start-start |
| top-right | start-end |
| bottom-left | end-start |
| bottom-right | end-end |

## Bug #8: Box Shadow Direction

### The Problem

Box shadows that simulate depth look wrong when mirrored:

```css
/* Shadow on right side */
.card {
  box-shadow: 5px 0 10px rgba(0,0,0,0.2);
}
/* In RTL, shadow should probably be on left */
```

### The Fix

Box shadows represent light source, which is often physical. But for UI-indicating shadows:

```css
:root {
  --shadow-offset-x: 5px;
}

[dir="rtl"] {
  --shadow-offset-x: -5px;
}

.card {
  box-shadow: var(--shadow-offset-x) 0 10px rgba(0,0,0,0.2);
}
```

## Bug #9: Bidirectional Text Spillover

### The Problem

Mixed LTR/RTL text breaks layout:

```html
<p dir="rtl">البريد الإلكتروني: user@example.com</p>
<!-- Email may appear in unexpected position -->
```

### The Fix

Use `<bdi>` or `dir="ltr"` on embedded content:

```html
<p dir="rtl">
  البريد الإلكتروني: <bdi dir="ltr">user@example.com</bdi>
</p>
```

Or use Unicode isolates in JavaScript:

```javascript
const LRI = '\u2066'; // Left-to-Right Isolate
const PDI = '\u2069'; // Pop Directional Isolate

const text = `البريد الإلكتروني: ${LRI}${email}${PDI}`;
```

## Bug #10: Table Column Order

### The Problem

Tables don't reverse column order in RTL:

```html
<table>
  <tr>
    <td>First</td>
    <td>Second</td>
    <td>Third</td>
  </tr>
</table>
```

### The Fix

Tables should automatically reverse with `dir="rtl"` on the container. If not:

```css
[dir="rtl"] table {
  direction: rtl;
}

[dir="rtl"] th,
[dir="rtl"] td {
  text-align: start;
}
```

For more control, use flexbox or grid instead of tables for layout:

```css
.data-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
/* Automatically reverses in RTL */
```

## Bug #11: Progress Bars and Sliders

### The Problem

Progress fills from the wrong side:

```css
.progress-fill {
  width: 60%;
  /* Fills from left, should fill from right in RTL */
}
```

### The Fix

```css
.progress-bar {
  display: flex;
}

.progress-fill {
  /* Flexbox handles direction */
  height: 100%;
  background: var(--accent);
}

/* Or with explicit positioning */
.progress-fill {
  position: absolute;
  inset-inline-start: 0;
  width: 60%;
}
```

For range inputs:

```css
input[type="range"] {
  direction: ltr; /* Keep sliders LTR for consistency */
  /* Or handle RTL specifically */
}

[dir="rtl"] input[type="range"] {
  transform: scaleX(-1);
}
```

## Bug #12: Z-Index Stacking Issues

### The Problem

Overlapping elements stack incorrectly when positioned with physical properties.

### The Fix

Ensure all positioned elements use logical properties:

```css
.modal {
  position: fixed;
  inset: 0; /* Full screen */
  z-index: 100;
}

.modal-content {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  transform: translate(-50%, -50%);
}
```

## Debugging Checklist

Use this checklist when testing RTL:

- [ ] Text reads naturally from right to left
- [ ] Navigation order is reversed
- [ ] Sidebars are on the correct side
- [ ] Icons indicate correct direction
- [ ] Form labels align with inputs
- [ ] Dropdowns open in correct direction
- [ ] Scroll behavior feels natural
- [ ] Animations enter from correct side
- [ ] Progress indicators fill correctly
- [ ] Modals center properly
- [ ] No text overflow issues
- [ ] Mixed content (emails, URLs) displays correctly

## Key Takeaways

1. **Test early and often**: RTL bugs are easier to fix when caught early.

2. **Use logical properties**: They prevent most positioning issues automatically.

3. **Don't flip everything**: Some elements (icons, shadows) need careful consideration.

4. **Handle BiDi text**: Use `<bdi>` for embedded opposite-direction content.

5. **Test with native speakers**: They'll catch issues automated testing misses.

## Further Reading

- [Understanding RTL Text Direction](/blog/understanding-rtl)
- [CSS Logical Properties for RTL/LTR Support](/blog/css-logical-properties)
- [Bidirectional Text and the Unicode BiDi Algorithm](/blog/bidirectional-text-bidi)
- [How Reading Direction Affects User Experience](/blog/reading-direction-ux)
