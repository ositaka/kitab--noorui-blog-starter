---
id: "bidirectional-text-bidi"
title: "Bidirectional Text and the Unicode BiDi Algorithm"
excerpt: "Learn how computers handle mixed RTL and LTR text using the Unicode Bidirectional Algorithm."
category: "rtl-ltr-concepts"
author: "karim-benali"
publishedAt: "2025-01-06"
readingTime: 13
featured: false
featuredImage: "/images/posts/bidirectional-text.jpg"
tags: ["bidi", "unicode", "rtl", "algorithms", "text-rendering"]
---

## Introduction

What happens when Arabic text contains English words? Or when a Hebrew sentence includes numbers? When left-to-right and right-to-left text appear together, things get complicated fast.

Consider this mixed text:
```
The word "مرحبا" means hello.
```

The Arabic word "مرحبا" (marhaba) needs to be rendered right-to-left, while the surrounding English is left-to-right. How does a computer know which direction each character should flow?

The answer is the **Unicode Bidirectional Algorithm** (BiDi)—a sophisticated set of rules that governs how mixed-direction text is displayed. Understanding BiDi is essential for any developer working with multilingual text.

## What is Bidirectional Text?

### The Problem

Writing systems have different inherent directions:
- **LTR (Left-to-Right)**: Latin, Greek, Cyrillic, Thai, etc.
- **RTL (Right-to-Left)**: Arabic, Hebrew, Syriac, Thaana

When text from different directional systems appears together, the rendering engine must determine:
1. The overall direction of the paragraph
2. The direction of each segment within the paragraph
3. How to handle neutral characters (spaces, punctuation, numbers)

### A Simple Example

Consider an Arabic sentence with an English brand name:

```
Right-to-left base direction:
← أنا أستخدم Microsoft Word يومياً ←
```

This sentence should be read as:
1. "أنا أستخدم" (I use) - RTL
2. "Microsoft Word" - LTR (embedded)
3. "يومياً" (daily) - RTL

The challenge is displaying this correctly while maintaining logical character order in memory.

## The Unicode Bidirectional Algorithm

### Overview

The Unicode BiDi Algorithm (UBA), defined in **Unicode Standard Annex #9**, specifies exactly how to determine and render text direction. It's implemented in every modern browser, operating system, and text rendering engine.

### Key Concepts

#### Character Types

Every Unicode character has a **bidirectional class** property. Main categories:

| Class | Name | Examples |
|-------|------|----------|
| L | Left-to-Right | A-Z, Latin letters |
| R | Right-to-Left | Hebrew letters |
| AL | Arabic Letter | Arabic letters |
| EN | European Number | 0-9 |
| AN | Arabic Number | ٠-٩ (Arabic-Indic) |
| ET | European Number Terminator | # $ % |
| ES | European Number Separator | + - |
| CS | Common Number Separator | , . : |
| NSM | Nonspacing Mark | Combining diacritics |
| BN | Boundary Neutral | Formatting characters |
| B | Paragraph Separator | Line breaks |
| S | Segment Separator | Tab |
| WS | Whitespace | Space |
| ON | Other Neutral | Most punctuation |

#### Embedding Levels

The algorithm assigns an **embedding level** to each character:
- Even levels (0, 2, 4...) = LTR
- Odd levels (1, 3, 5...) = RTL

The base paragraph level is typically determined by the first strong directional character (L, R, or AL).

### The Algorithm Steps

The BiDi algorithm consists of several phases:

#### Phase 1: Determine Paragraph Level

Find the base direction by scanning for the first strong character:
```
P1. Split text into paragraphs
P2. Find first strong character (L, R, or AL)
P3. If L: paragraph level = 0 (LTR)
    If R or AL: paragraph level = 1 (RTL)
    If none found: use default paragraph direction
```

#### Phase 2: Determine Explicit Levels

Process explicit directional formatting codes:
- LRE (U+202A): Left-to-Right Embedding
- RLE (U+202B): Right-to-Left Embedding
- LRO (U+202D): Left-to-Right Override
- RLO (U+202E): Right-to-Left Override
- PDF (U+202C): Pop Directional Format

And the newer isolate controls:
- LRI (U+2066): Left-to-Right Isolate
- RLI (U+2067): Right-to-Left Isolate
- FSI (U+2068): First Strong Isolate
- PDI (U+2069): Pop Directional Isolate

#### Phase 3: Resolve Weak Types

Handle characters whose direction depends on context:
```
W1. Examine NSM (combining marks)
W2. Change EN (European number) to AN (Arabic number) after AL
W3. Change AL to R
W4. Handle separators between numbers
W5. Handle terminators around numbers
W6. Change remaining separators to ON
W7. Change EN to L when preceded by L
```

#### Phase 4: Resolve Neutral Types

Handle spaces, punctuation, and other neutral characters:
```
N1. Neutrals between same-direction characters take that direction
N2. Remaining neutrals take the embedding direction
```

#### Phase 5: Resolve Implicit Levels

Adjust levels based on character types:
```
I1. For LTR levels: R → level+1, AN/EN → level+2
I2. For RTL levels: L/EN/AN → level+1
```

#### Phase 6: Reorder for Display

Finally, reverse runs at each level:
```
L1. Reset whitespace levels
L2. Find highest level
L3. From highest to lowest, reverse each run at that level
L4. Result is visual order
```

### A Worked Example

Let's trace through: `car means سيارة`

1. **Characters and types:**
   ```
   c-a-r- -m-e-a-n-s- -س-ي-ا-ر-ة
   L L L WS L L L L L WS AL AL AL AL AL
   ```

2. **Paragraph direction:** First strong is `c` (L), so LTR (level 0)

3. **Resolve levels:**
   ```
   c  a  r     m  e  a  n  s     س  ي  ا  ر  ة
   0  0  0  0  0  0  0  0  0  0  1  1  1  1  1
   ```

4. **Reorder:** Reverse the RTL run (odd level):
   ```
   Display: car means ةراي س → car means سيارة
   (Arabic letters in reverse order = correct Arabic reading order)
   ```

## Practical Implications

### HTML Controls

Use these attributes and characters:

```html
<!-- Set base direction -->
<p dir="rtl">Arabic paragraph with English here</p>

<!-- Isolate embedded text -->
<p>The word <bdi>مرحبا</bdi> means hello.</p>

<!-- Override algorithm -->
<span dir="ltr">Force LTR direction</span>
```

### Unicode Control Characters

Insert these characters to control bidi behavior:

```javascript
const LRM = '\u200E';  // Left-to-Right Mark
const RLM = '\u200F';  // Right-to-Left Mark
const LRE = '\u202A';  // Left-to-Right Embedding
const RLE = '\u202B';  // Right-to-Left Embedding
const PDF = '\u202C';  // Pop Directional Formatting
const LRO = '\u202D';  // Left-to-Right Override
const RLO = '\u202E';  // Right-to-Left Override
const LRI = '\u2066';  // Left-to-Right Isolate
const RLI = '\u2067';  // Right-to-Left Isolate
const FSI = '\u2068';  // First Strong Isolate
const PDI = '\u2069';  // Pop Directional Isolate

// Example: Ensure English in RTL context
const text = `مرحباً ${LRI}Microsoft${PDI} العالم`;
```

### Common Use Cases

#### Inserting LTR Text in RTL Context

```html
<!-- Product name should stay LTR -->
<p dir="rtl">
  أنا أستخدم <span dir="ltr">iPhone 15 Pro</span> كل يوم
</p>
```

#### Email Addresses

Email addresses should always be LTR:
```html
<p dir="rtl">
  البريد الإلكتروني: <bdi dir="ltr">user@example.com</bdi>
</p>
```

#### Numbers with Units

```html
<p dir="rtl">
  السرعة: <bdi dir="ltr">120 km/h</bdi>
</p>
```

### CSS Properties

```css
/* Unicode-bidi property */
.isolate {
  unicode-bidi: isolate;
}

.embed {
  unicode-bidi: embed;
}

.override {
  unicode-bidi: bidi-override;
}

.plaintext {
  unicode-bidi: plaintext; /* Use P rules only */
}
```

## Common Pitfalls

### Punctuation Problems

Punctuation is "neutral," taking direction from context:

```
Problem: "Hello, world" in RTL context
Wrong:   "Hello, world"  ← punctuation moves
Right:   "Hello, world"  ← with proper isolation
```

Solution: Use `<bdi>` or isolate controls.

### Numbers and Math

Numbers read LTR even in RTL text:
```
Arabic: الرقم ٤٢ صحيح (The number 42 is correct)
Reading order: right-to-left, but 42 stays as "42" not "24"
```

But be careful with ranges:
```
Problem: 10-20 in RTL
Wrong:   20-10  ← hyphen moves, numbers reversed
Right:   10-20  ← preserve with LTR isolation
```

### Nested Embeddings

Maximum embedding depth is 125 levels. Exceeding this causes undefined behavior.

```html
<!-- Don't nest too deeply! -->
<p dir="rtl">
  <span dir="ltr">
    <span dir="rtl">
      <!-- Keep it simple -->
    </span>
  </span>
</p>
```

### The "Spillover" Effect

Without isolation, directional text can "leak":

```html
<!-- Problem -->
<p>User: مستخدم (3 new messages)</p>
<!-- The "(" may move next to "مستخدم" -->

<!-- Solution -->
<p>User: <bdi>مستخدم</bdi> (3 new messages)</p>
```

## Testing Bidirectional Text

### Test Strings

Use these strings to test BiDi handling:

```javascript
const testStrings = [
  // Simple mixed
  'Hello مرحبا World',

  // Numbers
  'The price is ٤٢ dollars',

  // Punctuation
  'Quote: "مرحبا بك"',

  // Nested
  'English (عربي (nested) نص) more',

  // Challenging punctuation
  'Item #123 - خاص (special)',
];
```

### Visual Inspection

Rendering should be consistent across:
- Different browsers
- Different operating systems
- Different text renderers
- Copy-paste operations

## Key Takeaways

1. **BiDi is automatic but imperfect**: The Unicode BiDi algorithm handles most cases but needs help with edge cases.

2. **Use HTML controls**: `dir` attribute and `<bdi>` element provide semantic, accessible solutions.

3. **Isolate, don't override**: `<bdi>` and isolate controls are safer than embeddings or overrides.

4. **Test with real content**: Synthetic tests miss real-world complexity.

5. **Neutral characters need context**: Punctuation, spaces, and numbers behave based on surrounding text direction.

## Further Reading

- [Understanding RTL Text Direction](/blog/understanding-rtl)
- [Numbers in RTL Languages](/blog/numbers-in-rtl-languages)
- [CSS Logical Properties for RTL/LTR Support](/blog/css-logical-properties)
- [Common RTL Bugs and How to Fix Them](/blog/common-rtl-bugs)
