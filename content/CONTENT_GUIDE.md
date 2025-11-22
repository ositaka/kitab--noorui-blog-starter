# Content Guide for RTL/LTR Educational Blog

This guide helps AI assistants and human contributors create consistent, high-quality content for this multilingual educational blog about writing systems, RTL/LTR concepts, and typography.

## Blog Mission

To be the definitive educational resource explaining right-to-left (RTL) and left-to-right (LTR) writing systems, their history, technical implementation, and cultural significance. Content should be accessible to developers, designers, linguists, and curious learners alike.

## Languages

All posts must be available in **4 languages**:

| Code | Language | Direction | Script | Notes |
|------|----------|-----------|--------|-------|
| `en` | English | LTR | Latin | Primary language, baseline for translations |
| `fr` | French | LTR | Latin | Include proper diacritics (é, è, ê, ç, à, etc.) |
| `ar` | Arabic | RTL | Arabic | Modern Standard Arabic (MSA), Naskh style |
| `ur` | Urdu | RTL | Nastaliq | Pakistani Urdu, Nastaliq script preferred |

## Content Categories

### 1. Scripts & Alphabets (`scripts-alphabets`)
Historical and educational content about writing systems.
- Origins and evolution of scripts
- Comparisons between writing systems
- How scripts spread and adapted

### 2. RTL/LTR Concepts (`rtl-ltr-concepts`)
Technical explanations for developers and designers.
- How bidirectional text works
- Implementation guides
- Common problems and solutions

### 3. Typography (`typography`)
Deep dives into fonts, calligraphy, and visual aspects.
- Script styles (Nastaliq, Naskh, etc.)
- Font selection and pairing
- Spacing, ligatures, diacritics

### 4. Cultural Context (`cultural-context`)
The human side of writing systems.
- Calligraphy as art
- How direction affects cognition/UX
- Historical manuscripts and documents

## Post Structure

Each post should follow this structure:

```markdown
---
id: "unique-slug"
title: "Post Title"
excerpt: "A compelling 1-2 sentence summary (max 160 chars)"
category: "category-slug"
author: "author-id"
publishedAt: "2025-01-15"
readingTime: 8
featured: false
featuredImage: "/images/posts/slug.jpg"
tags: ["tag1", "tag2", "tag3"]
---

## Introduction
Hook the reader with why this topic matters. 2-3 paragraphs.

## Main Content
Break into logical sections with H2 headers.
Include examples, comparisons, and visuals where appropriate.

### Subsections
Use H3 for subsections within main topics.

## Key Takeaways
Summarize 3-5 main points.

## Further Reading
Link to related posts and external resources.
```

## Writing Style

### Tone
- **Educational but engaging** - Not dry academic, not overly casual
- **Respectful of all cultures** - Neutral, appreciative, never dismissive
- **Technically accurate** - Verify facts, cite sources when possible
- **Accessible** - Explain jargon, assume intelligent but non-expert reader

### Length
- **Short posts**: 800-1,200 words (quick concepts)
- **Standard posts**: 1,500-2,500 words (most posts)
- **Deep dives**: 3,000-4,000 words (comprehensive guides)

### Formatting
- Use headers to break up content (H2, H3)
- Include code examples for technical posts (with syntax highlighting)
- Add bullet points for lists
- Include images/diagrams where helpful
- Use blockquotes for important callouts

## Translation Guidelines

### General Rules
1. **Translate meaning, not words** - Adapt idioms and expressions
2. **Maintain technical accuracy** - Keep code/technical terms consistent
3. **Respect cultural context** - Adapt examples when needed
4. **Keep same structure** - Headers, sections, and flow should match

### Language-Specific Notes

#### French (fr)
- Use formal "vous" (not "tu")
- Include all diacritics: é, è, ê, ë, à, â, ù, û, ô, î, ï, ç, œ, æ
- Follow French punctuation rules (space before :, ;, !, ?)
- Technical terms can stay in English if commonly used

#### Arabic (ar)
- Use Modern Standard Arabic (Fusha)
- Right-to-left formatting
- Include proper diacritics (tashkeel) for educational content
- Numbers can be Western (1,2,3) or Eastern Arabic (١،٢،٣) - be consistent

#### Urdu (ur)
- Use formal register
- Nastaliq script is preferred but Naskh is acceptable
- Include proper diacritics (اعراب)
- Maintain Urdu vocabulary over Arabic/Persian alternatives when possible

## Authors

### Default Authors (for seed content)

```yaml
- id: "noor-team"
  name: "Noor UI Team"
  nameAr: "فريق نور"
  nameFr: "Équipe Noor UI"
  nameUr: "نور ٹیم"
  bio: "The team behind Noor UI, building accessible multilingual interfaces."
  avatar: "/images/authors/noor-team.png"

- id: "calligraphy-expert"
  name: "Dr. Amira Hassan"
  nameAr: "د. أميرة حسن"
  nameFr: "Dr. Amira Hassan"
  nameUr: "ڈاکٹر عمیرہ حسن"
  bio: "Calligraphy historian and typography researcher."
  avatar: "/images/authors/amira-hassan.png"

- id: "dev-advocate"
  name: "Karim Benali"
  nameAr: "كريم بن علي"
  nameFr: "Karim Benali"
  nameUr: "کریم بن علی"
  bio: "Developer advocate specializing in internationalization."
  avatar: "/images/authors/karim-benali.png"
```

## The 12 Seed Posts

| # | Slug | Category | Length |
|---|------|----------|--------|
| 1 | `history-of-arabic-script` | scripts-alphabets | Standard |
| 2 | `urdu-nastaliq-script` | scripts-alphabets | Standard |
| 3 | `phoenician-origins-alphabets` | scripts-alphabets | Deep Dive |
| 4 | `understanding-rtl` | rtl-ltr-concepts | Standard |
| 5 | `bidirectional-text-bidi` | rtl-ltr-concepts | Standard |
| 6 | `numbers-in-rtl-languages` | rtl-ltr-concepts | Short |
| 7 | `css-logical-properties` | rtl-ltr-concepts | Standard |
| 8 | `common-rtl-bugs` | rtl-ltr-concepts | Standard |
| 9 | `nastaliq-vs-naskh` | typography | Standard |
| 10 | `arabic-ligatures` | typography | Standard |
| 11 | `islamic-calligraphy` | cultural-context | Deep Dive |
| 12 | `reading-direction-ux` | cultural-context | Standard |

## File Naming Convention

```
content/
├── CONTENT_GUIDE.md          # This file
├── posts/
│   ├── en/                   # English posts
│   │   ├── 01-history-of-arabic-script.md
│   │   ├── 02-urdu-nastaliq-script.md
│   │   └── ...
│   ├── fr/                   # French posts
│   │   ├── 01-history-of-arabic-script.md
│   │   └── ...
│   ├── ar/                   # Arabic posts
│   │   ├── 01-history-of-arabic-script.md
│   │   └── ...
│   └── ur/                   # Urdu posts
│       ├── 01-history-of-arabic-script.md
│       └── ...
├── categories/
│   └── categories.json       # Category definitions
└── authors/
    └── authors.json          # Author profiles
```

## AI Content Generation Prompt Template

When asking an AI to generate content, use this template:

```
Create a blog post for a multilingual educational blog about RTL/LTR writing systems.

**Topic**: [Topic title]
**Category**: [Category name]
**Target Length**: [800-1200 / 1500-2500 / 3000-4000] words
**Language**: [en/fr/ar/ur]

**Requirements**:
1. Follow the structure: Introduction → Main Content (with H2 sections) → Key Takeaways → Further Reading
2. Tone: Educational but engaging, respectful of all cultures
3. Include practical examples where relevant
4. For technical topics, include code snippets
5. End with 3-5 key takeaways

**Context**: This post will be translated into English, French, Arabic, and Urdu. Write in a way that translates well across cultures.

[Additional specific instructions for this post]
```

## Quality Checklist

Before publishing, verify:

- [ ] All 4 language versions exist
- [ ] Frontmatter is complete and consistent
- [ ] Headers follow hierarchy (H2 → H3)
- [ ] No broken links or missing images
- [ ] Code examples are tested (for technical posts)
- [ ] Reading time is accurate
- [ ] Excerpt is under 160 characters
- [ ] Tags are relevant and consistent
- [ ] Cultural sensitivity review passed
