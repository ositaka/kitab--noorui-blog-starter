# Kitab Blog: New Content Guide for Claude Code

This document provides direction for generating new blog posts for Kitab, the multilingual blog starter built with noorui-rtl.

---

## Available MDX Components

Kitab has custom MDX components that make blog posts more engaging. **Use these throughout the new posts** where appropriate.

### Blockquotes

Three variants for quoted text:

```mdx
<Blockquote>
Default blockquote style for standard quotes.
</Blockquote>

<Blockquote variant="accent" author="Author Name">
Accent variant with colored left border and author attribution.
</Blockquote>

<Blockquote variant="quote">
Quote variant for more formal or literary citations.
</Blockquote>
```

**When to use:** Expert quotes, historical references, citing documentation.

---

### Pull Quotes

Large, emphasized quotes that break up the text:

```mdx
<PullQuote>
"The soul of the place where the light enters you."
</PullQuote>
```

**When to use:** Key insights, memorable statements, section emphasis. Use sparingly — one per post maximum.

---

### Callouts

Highlighted boxes for tips, warnings, and important information:

```mdx
<Callout type="info">
Did you know? This is useful background information.
</Callout>

<Callout type="warning">
Be careful! This highlights a common mistake or gotcha.
</Callout>

<Callout type="success">
Pro tip! This is a recommended best practice.
</Callout>

<Callout type="error">
Don't do this! This highlights what to avoid.
</Callout>
```

**When to use:**
- `info` — Background context, definitions, "did you know" facts
- `warning` — Common mistakes, browser inconsistencies, gotchas
- `success` — Best practices, recommendations, pro tips
- `error` — Anti-patterns, what not to do

Aim for 2-3 callouts per post.

---

### Figures

Images with captions:

```mdx
<Figure
  src="/images/posts/example.jpg"
  alt="Description of image"
  caption="Caption text explaining the image"
/>
```

**When to use:** Screenshots, diagrams, visual examples. Every post should have at least one figure.

---

### Wide Box

Content that breaks out of the standard content width:

```mdx
<WideBox>
Content here spans wider than the normal text column.
Great for tables, comparison charts, or large code examples.
</WideBox>
```

**When to use:** Comparison tables, large code blocks, side-by-side examples.

---

### Image Grid

Display multiple images in a grid layout:

```mdx
<ImageGrid columns={2}>
  <Figure src="/images/example1.jpg" alt="First image" />
  <Figure src="/images/example2.jpg" alt="Second image" />
</ImageGrid>

<ImageGrid columns={3}>
  <Figure src="/images/example1.jpg" alt="First" />
  <Figure src="/images/example2.jpg" alt="Second" />
  <Figure src="/images/example3.jpg" alt="Third" />
</ImageGrid>
```

**When to use:** Comparing scripts, showing variations, before/after examples.

---

### Code Blocks

Syntax-highlighted code with language support:

````mdx
```css
.element {
  margin-inline-start: 1rem;
  padding-inline-end: 0.5rem;
}
```

```tsx
const direction = locale === 'ar' ? 'rtl' : 'ltr';
```

```bash
npm install noorui-rtl
```
````

**When to use:** Any technical post with CSS, JavaScript, or terminal commands.

---

### Media Embeds

#### YouTube Videos

```mdx
<YouTube id="dQw4w9WgXcQ" />
```

#### URL/Link Embeds

```mdx
<UrlEmbed url="https://example.com/article" />
```

**When to use:** Reference videos, external resources, related articles.

---

## New Blog Posts to Create

### 1. The Shared Roots of Arabic and Urdu Script

**Author:** Amira Hassan
**Category:** Scripts & Alphabets
**Reading time:** ~10 min

**Direction:**
- Explain how Urdu adopted the Arabic alphabet when Islam spread to South Asia
- Show the additional characters Urdu needed: ٹ (ṭ), ڈ (ḍ), ڑ (ṛ), ں (nasalization), ے (final yeh)
- Visual comparison: write the same word in Arabic and Urdu, highlight differences
- Explain Nastaliq (Urdu calligraphic style) vs Naskh (Arabic standard)
- Connect to why Kitab supports both languages

**Components to use:**
- `ImageGrid` — Compare Arabic vs Urdu letter forms
- `Callout type="info"` — Explain why Urdu uses Arabic script instead of Devanagari
- `Blockquote variant="accent"` — Quote about the historical spread
- `Figure` — Map showing spread of Arabic script to South Asia

---

### 2. Why Numbers Stay Left-to-Right in Arabic Text

**Author:** Karim Benali
**Category:** RTL/LTR Concepts
**Reading time:** ~7 min

**Direction:**
- Start with the counterintuitive fact: في عام 2024 — the numbers don't flip
- Historical explanation: numerals came from India, traveled westward
- "Arabic numerals" aren't actually Arabic — Arabs call them "Indian numerals" (أرقام هندية)
- Show Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) vs Western Arabic numerals (0123456789)
- Practical implications: phone numbers, prices, dates in RTL contexts
- Code example showing how CSS handles this automatically

**Components to use:**
- `PullQuote` — The irony that "Arabic numerals" aren't Arabic
- `Callout type="warning"` — Don't try to reverse number strings in RTL!
- `CodeBlock` — Show Unicode bidirectional algorithm handling
- `WideBox` — Table comparing numeral systems

---

### 3. Diacritics Across Scripts: From French Accents to Arabic Tashkeel

**Author:** Amira Hassan
**Category:** Typography
**Reading time:** ~9 min

**Direction:**
- Define diacritics: marks added to letters to modify pronunciation
- French section: é è ê ë, ç, à â, etc. — pronunciation guides essential to meaning
- Arabic section: tashkeel (fatḥa, kasra, ḍamma, sukūn, shadda) — vowel markers
- Why Arabic websites usually drop diacritics (readers infer from context)
- When you MUST include Arabic diacritics (Quran, children's books, poetry, disambiguation)
- Brief mention of Urdu diacritics
- Web font implications: ensure fonts include diacritic support

**Components to use:**
- `ImageGrid columns={2}` — French vs Arabic diacritics visual comparison
- `Callout type="info"` — Why Arabic can be read without vowels
- `Callout type="success"` — When to include tashkeel
- `Figure` — The word "كتب" with and without diacritics (showing different meanings)

---

### 4. The Anatomy of Arabic Letters: Dots, Shapes, and Positions

**Author:** Amira Hassan
**Category:** Scripts & Alphabets
**Reading time:** ~11 min

**Direction:**
- Arabic letters change shape based on position (initial, medial, final, isolated)
- Show example: ع becomes عـ ـعـ ـع depending on position
- The dot system: ب ت ث ن are the same base shape, dots differentiate them
- How this affects font rendering and text shaping engines
- Why Arabic fonts are more complex than Latin fonts
- Ligatures: certain letter combinations join into special forms (لا)
- Implications for developers: never split Arabic text mid-word

**Components to use:**
- `WideBox` — Large table showing all letter positions
- `ImageGrid columns={4}` — Show one letter in all 4 positions
- `Callout type="warning"` — Never use `letter-spacing` on Arabic text
- `Callout type="info"` — How OpenType handles Arabic shaping
- `Figure` — Common ligatures in Arabic

---

### 5. Building Accessible Forms for Arabic Users

**Author:** Karim Benali
**Category:** RTL/LTR Concepts
**Reading time:** ~12 min

**Direction:**
- Label placement: above the input works better than inline-start for Arabic
- Text alignment inside inputs: `text-align: start` not `left`
- Placeholder text direction
- Validation messages: position and language
- Mixed input challenge: Arabic name + international phone number + email
- Password fields: should stay LTR (English characters)
- Code examples using CSS logical properties throughout
- Accessibility: ARIA labels in Arabic, screen reader considerations

**Components to use:**
- `CodeBlock` — Multiple CSS and HTML examples
- `Callout type="success"` — Best practice for label placement
- `Callout type="warning"` — Don't force RTL on email/password fields
- `Figure` — Screenshot of well-designed Arabic form
- `WideBox` — Comparison table of form patterns

---

### 6. Icon Direction: What Flips and What Doesn't

**Author:** Karim Benali
**Category:** RTL/LTR Concepts
**Reading time:** ~8 min

**Direction:**
- The rule: directional icons flip, semantic icons don't
- Directional icons (FLIP): back arrow, forward arrow, chevrons, reply, undo/redo
- Semantic icons (DON'T FLIP): search, close X, download, upload, settings, checkmark, plus/minus
- Edge cases: play button (don't flip), text alignment icons (flip), list bullets (don't flip)
- Implementation: CSS transform vs swapping icon vs conditional rendering
- How icon libraries handle this (Lucide, Heroicons, etc.)
- Testing checklist for icon direction

**Components to use:**
- `ImageGrid columns={2}` — Flip vs Don't Flip visual examples
- `WideBox` — Complete reference table of common icons
- `Callout type="info"` — The "physical metaphor" test for deciding
- `CodeBlock` — CSS and React implementation examples
- `Callout type="warning"` — Don't flip logos or brand icons

---

### 7. Choosing Arabic Fonts for the Web

**Author:** Amira Hassan
**Category:** Typography
**Reading time:** ~10 min

**Direction:**
- Overview of Arabic web font landscape
- Font comparison (with visual examples):
  - **Noto Sans Arabic** — Google's universal solution, good coverage
  - **Cairo** — Modern, geometric, popular in Egypt
  - **IBM Plex Sans Arabic** — Corporate, clean, pairs with IBM Plex
  - **Tajawal** — Lightweight, good for UI
  - **Amiri** — Traditional Naskh, good for body text
  - **Readex Pro** — Variable font, modern
- Performance: file sizes, subsetting strategies
- Pairing Arabic and Latin fonts (similar x-height, weight, personality)
- Loading strategies: font-display, preload
- When to use Naskh style vs Kufi style

**Components to use:**
- `WideBox` — Font comparison table with file sizes
- `Figure` — Visual samples of each font
- `ImageGrid columns={2}` — Good vs bad font pairings
- `Callout type="success"` — Recommended pairings for web apps
- `CodeBlock` — Font-face declarations and loading strategies

---

### 8. Responsive Design in Both Directions

**Author:** Karim Benali
**Category:** RTL/LTR Concepts
**Reading time:** ~9 min

**Direction:**
- Good news: breakpoints work identically in RTL and LTR
- Sidebar placement: use `inline-start` not `left`
- Mobile navigation: hamburger menu position, drawer slide direction
- Cards and grids: CSS Grid and Flexbox handle direction automatically
- Images with text: be careful with directional imagery
- Testing: must check all breakpoints in both directions
- Common mistakes: absolute positioning breaking on RTL

**Components to use:**
- `CodeBlock` — CSS Grid and Flexbox examples
- `Callout type="success"` — Let CSS do the work with logical properties
- `Callout type="warning"` — Avoid `position: absolute` with `left/right`
- `ImageGrid columns={2}` — Mobile layout comparison LTR vs RTL
- `Figure` — Dashboard responsive example

---

### 9. Designing for Bilingual Users: Code-Switching in UI

**Author:** Amira Hassan
**Category:** Cultural Context
**Reading time:** ~10 min

**Direction:**
- What is code-switching: mixing languages naturally in speech and text
- Very common in GCC: Arabic + English in same sentence
- Examples from real apps (Careem, Talabat, Noon) — how they handle mixed content
- Arabizi phenomenon: Arabic written in Latin letters (7abibti, ma3lesh)
- Design implications: don't force users into one language
- Let users choose language vs auto-detect (pros and cons)
- Mixed content in UI: Arabic label, English value (product names, brands)

**Components to use:**
- `Blockquote variant="accent"` — Example of natural code-switching
- `Callout type="info"` — What is Arabizi and why it exists
- `Figure` — Screenshots of bilingual app interfaces
- `Callout type="success"` — Best practices for handling mixed content
- `PullQuote` — Key insight about not forcing language purity

---

### 10. Dates, Times, and Calendars: A Multilingual Challenge

**Author:** Karim Benali
**Category:** RTL/LTR Concepts
**Reading time:** ~11 min

**Direction:**
- Date formats vary wildly: DD/MM/YYYY vs MM/DD/YYYY vs YYYY-MM-DD
- The Hijri calendar: lunar, ~11 days shorter than Gregorian year
- When to show Hijri, Gregorian, or both (depends on context)
- Time formatting: 12-hour vs 24-hour, AM/PM in Arabic
- The Islamic week starts on Saturday (not Sunday or Monday)
- Prayer times: a unique time system based on sun position
- JavaScript: Intl.DateTimeFormat with Arabic locale
- Libraries: date-fns, Day.js with Hijri plugins

**Components to use:**
- `WideBox` — Table of date formats across locales
- `CodeBlock` — JavaScript Intl.DateTimeFormat examples
- `Callout type="info"` — Why Hijri dates move ~11 days each Gregorian year
- `Callout type="success"` — When to show dual calendars
- `Figure` — Example of dual-calendar date picker from noorui-rtl

---

### 11. Reading Patterns: How Layout Should Follow the Eye

**Author:** Amira Hassan
**Category:** Cultural Context
**Reading time:** ~8 min

**Direction:**
- F-pattern in LTR: users scan horizontally then down the left edge
- Mirrored F-pattern in RTL: same behavior, but right edge becomes anchor
- Where to place key content, CTAs, navigation
- Studies on Arabic website eye-tracking (cite any available research)
- Why direct mirroring isn't always correct — some elements stay put
- Logo placement debate: always top-left, or top-right in RTL?
- Real examples from successful RTL websites

**Components to use:**
- `ImageGrid columns={2}` — F-pattern vs mirrored F-pattern diagrams
- `Figure` — Heatmap visualization of reading patterns
- `Callout type="info"` — The science behind scanning patterns
- `Callout type="warning"` — Don't mirror everything blindly
- `Blockquote variant="accent"` — Quote from UX research on RTL

---

## Writing Guidelines

### Tone
- Educational and helpful, not promotional
- Write as if teaching a colleague who's smart but new to RTL
- Friendly but professional

### Length
- 800-1200 words per post
- Enough depth to be genuinely useful
- Not so long it feels padded

### Structure
- Start with a hook or interesting fact
- Use clear subheadings (##) to break up content
- End with a practical takeaway or summary

### Examples
- Use real-world examples (Careem, Noon, etc.) where natural
- Don't force GCC references — only when they're the best example
- Include code samples for technical posts

### Images
- Flag where images are needed: `[IMAGE NEEDED: description]`
- Suggest what the image should show
- Every post needs at least one visual

### Cross-References
- Link to existing Kitab posts when relevant
- Example: "As we covered in [Arabic Ligatures](/blog/arabic-ligatures)..."

### Author Assignment
- **Amira Hassan** — Cultural, historical, typography, scripts
- **Karim Benali** — Technical, developer-focused, code-heavy

---

## Post Metadata Template

Each post needs:

```yaml
---
title: "Post Title Here"
titleAr: "العنوان بالعربية"
titleFr: "Titre en français"
titleUr: "اردو میں عنوان"
slug: "post-slug-here"
excerpt: "A brief 1-2 sentence summary of the post."
excerptAr: "ملخص قصير للمقال"
excerptFr: "Un bref résumé de l'article"
excerptUr: "مضمون کا مختصر خلاصہ"
author: "amira-hassan" | "karim-benali"
category: "scripts-alphabets" | "rtl-ltr-concepts" | "typography" | "cultural-context"
readingTime: 10
featured: false
publishedAt: "2025-01-XX"
image: "/images/posts/post-slug.jpg"
---
```

---

## Priority Order

If creating posts in batches, prioritize:

1. **Why Numbers Stay Left-to-Right in Arabic Text** — Counterintuitive, shareable, shows expertise
2. **Icon Direction: What Flips and What Doesn't** — Extremely practical, reference material
3. **The Shared Roots of Arabic and Urdu Script** — Connects Kitab's two RTL languages
4. **Building Accessible Forms for Arabic Users** — Developer gold, real code value
5. **Dates, Times, and Calendars: A Multilingual Challenge** — Practical, ties to noorui-rtl components

---

*This guide is for Claude Code to generate content for Kitab, the multilingual blog starter showcasing noorui-rtl.*
