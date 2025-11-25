---
id: "css-logical-properties"
title: "RTL/LTR سپورٹ کے لیے CSS منطقی خصوصیات"
excerpt: "سیکھیں کہ CSS منطقی خصوصیات کیسے جدید، دو طرفہ-ریڈی لے آؤٹس بنانے میں مدد کرتی ہیں جو خود بخود RTL اور LTR زبانوں کے مطابق ڈھل جاتی ہیں۔"
category: "rtl-ltr-concepts"
author: "karim-benali"
publishedAt: "2025-01-02"
readingTime: 9
featured: false
featuredImage: "/images/posts/css-logical-properties.jpg"
tags: ["css", "منطقی-خصوصیات", "rtl", "لے-آؤٹ", "i18n"]
---

## تعارف

سالوں سے، ویب ڈویلپرز نے بائیں/دائیں کے لحاظ سے سوچا ہے۔ ہم نے `margin-left` لکھا، `padding-right` سیٹ کیا، اور `left: 0` کے ساتھ پوزیشن کیا۔ یہ طریقہ جب تک ٹھیک کام کرتا تھا جب تک ہر کوئی بائیں سے دائیں پڑھتا تھا۔

لیکن جب آپ کی ویب سائٹ کو عربی، عبرانی، یا اردو کی سپورٹ کی ضرورت ہو تو کیا ہوتا ہے؟ اچانک، وہ تمام "left" اقدار "right" ہونی چاہئیں۔ روایتی طور پر، اس کا مطلب تھا الگ RTL سٹائل شیٹس برقرار رکھنا یا اوور رائیڈز کے ساتھ بھاری ہوشیار ہیکس۔

CSS منطقی خصوصیات اس مسئلے کو ہمیشہ کے لیے حل کرتی ہیں۔

## جسمانی بمقابلہ منطقی خصوصیات

### جسمانی خصوصیات کا مسئلہ

جسمانی خصوصیات جیسے `margin-left` اور `padding-right` اسکرین کی طرف دیکھنے والے شخص کے نقطہ نظر سے متعین ہیں۔ وہ فرض کرتی ہیں کہ ہر کوئی اسی سمت سے پڑھتا ہے:

```css
/* جسمانی خصوصیات - سمت کے مطابق نہیں ڈھلتیں */
.card {
  margin-left: 20px;
  padding-right: 15px;
  border-left: 3px solid blue;
  text-align: left;
}
```

یہ LTR میں ٹھیک نظر آتا ہے، لیکن RTL میں وقفہ الٹے سمت ہو جاتا ہے — متن دائیں سے بائیں بہتا ہے، لیکن مارجن ابھی بھی بائیں طرف ہے۔

### منطقی حل

منطقی خصوصیات جسمانی سمتوں کے بجائے مواد کے بہاؤ کا حوالہ دیتی ہیں:

```css
/* منطقی خصوصیات - خود بخود سمت کے مطابق ڈھلتی ہیں */
.card {
  margin-inline-start: 20px;
  padding-inline-end: 15px;
  border-inline-start: 3px solid blue;
  text-align: start;
}
```

اب یہ سٹائل LTR میں بائیں سے شروع ہوتی ہیں اور RTL میں خود بخود دائیں سے۔

## منطقی خصوصیات کا نقشہ

### افقی (Inline) خصوصیات

| جسمانی | منطقی | LTR میں | RTL میں |
|--------|-------|---------|---------|
| left | inline-start | بائیں | دائیں |
| right | inline-end | دائیں | بائیں |
| margin-left | margin-inline-start | بائیں مارجن | دائیں مارجن |
| margin-right | margin-inline-end | دائیں مارجن | بائیں مارجن |
| padding-left | padding-inline-start | بائیں پیڈنگ | دائیں پیڈنگ |
| padding-right | padding-inline-end | دائیں پیڈنگ | بائیں پیڈنگ |

### عمودی (Block) خصوصیات

| جسمانی | منطقی |
|--------|-------|
| top | block-start |
| bottom | block-end |
| margin-top | margin-block-start |
| margin-bottom | margin-block-end |

### شارٹ ہینڈ خصوصیات

```css
/* دو قدری شارٹ ہینڈ */
.element {
  /* margin-block: اوپر/نیچے، margin-inline: شروع/آخر */
  margin-block: 10px 20px;
  margin-inline: 15px 25px;

  /* padding بھی اسی طرح */
  padding-block: 5px;
  padding-inline: 10px 20px;
}
```

## سائز کی منطقی خصوصیات

### چوڑائی اور اونچائی

```css
.container {
  /* جسمانی */
  width: 300px;
  height: 200px;
  min-width: 100px;
  max-height: 500px;

  /* منطقی مساوی */
  inline-size: 300px;
  block-size: 200px;
  min-inline-size: 100px;
  max-block-size: 500px;
}
```

## عملی مثالیں

### نیویگیشن مینو

```css
.nav-item {
  /* آئیکن اور متن کے درمیان وقفہ */
  margin-inline-end: 12px;
}

.nav-icon {
  /* آئیکن متن سے پہلے */
  margin-inline-end: 8px;
}

.nav-arrow {
  /* تیر آخر میں */
  margin-inline-start: auto;
}
```

### کارڈ لے آؤٹ

```css
.card {
  padding-inline: 20px;
  padding-block: 16px;
  border-inline-start: 4px solid var(--accent-color);
}

.card-image {
  margin-inline-end: 16px;
  float: inline-start;
}

.card-meta {
  text-align: end;
}
```

### فارم لے آؤٹ

```css
.form-group {
  margin-block-end: 16px;
}

.form-label {
  display: block;
  margin-block-end: 4px;
  text-align: start;
}

.form-input {
  padding-inline: 12px;
  padding-block: 8px;
}

.form-error {
  margin-block-start: 4px;
  padding-inline-start: 12px;
  border-inline-start: 2px solid red;
}
```

## پوزیشننگ

### Inset خصوصیات

```css
.tooltip {
  position: absolute;

  /* جسمانی - RTL میں کام نہیں کرتا */
  /* top: 100%;
     left: 0; */

  /* منطقی - دونوں سمتوں میں کام کرتا ہے */
  inset-block-start: 100%;
  inset-inline-start: 0;
}

/* شارٹ ہینڈ */
.overlay {
  position: absolute;
  inset: 0; /* تمام اطراف 0 */
}

.sidebar {
  position: fixed;
  inset-block: 0;
  inset-inline-start: 0;
  inline-size: 300px;
}
```

## بارڈرز اور ریڈیس

### بارڈرز

```css
.quote {
  border-inline-start: 4px solid var(--quote-color);
  padding-inline-start: 16px;
}

.step {
  border-block-end: 1px solid var(--border-color);
  padding-block: 12px;
}
```

### بارڈر ریڈیس

```css
.button {
  /* جسمانی */
  /* border-radius: 8px 0 0 8px; */

  /* منطقی */
  border-start-start-radius: 8px;
  border-end-start-radius: 8px;
}

.tab {
  border-start-start-radius: 4px;
  border-start-end-radius: 4px;
}
```

## براؤزر سپورٹ

منطقی خصوصیات اب تمام جدید براؤزرز میں مکمل طور پر سپورٹ ہیں:

- Chrome 87+
- Firefox 66+
- Safari 14.1+
- Edge 87+

پرانے براؤزرز کے لیے فال بیک:

```css
.element {
  /* فال بیک - پرانے براؤزرز */
  margin-left: 20px;

  /* جدید براؤزرز یہ استعمال کریں گے */
  margin-inline-start: 20px;
}
```

## Tailwind CSS کے ساتھ

Tailwind CSS v3+ منطقی خصوصیات کی سپورٹ کرتا ہے:

```html
<!-- مارجن -->
<div class="ms-4 me-2">شروع سے 4، آخر سے 2</div>

<!-- پیڈنگ -->
<div class="ps-4 pe-2">شروع پیڈنگ 4، آخر پیڈنگ 2</div>

<!-- بارڈر -->
<div class="border-s-4 border-e-0">شروع بارڈر 4</div>

<!-- ٹیکسٹ الائنمنٹ -->
<div class="text-start">شروع سے منسلک</div>
<div class="text-end">آخر سے منسلک</div>
```

## منتقلی کی حکمت عملی

### مرحلہ وار منتقلی

```css
/* مرحلہ 1: نئے کوڈ میں منطقی خصوصیات استعمال کریں */
.new-component {
  margin-inline-start: 20px;
  padding-inline: 16px;
}

/* مرحلہ 2: آہستہ آہستہ پرانا کوڈ اپڈیٹ کریں */
.old-component {
  /* margin-left: 20px; */
  margin-inline-start: 20px;
}

/* مرحلہ 3: جسمانی خصوصیات کو لنٹر سے بلاک کریں */
```

## اہم نکات

۱. **منطقی خصوصیات مستقبل ہیں**: نئے پراجیکٹس میں شروع سے منطقی خصوصیات استعمال کریں — بعد میں RTL شامل کرنا آسان ہو جائے گا۔

۲. **start/end سوچیں، left/right نہیں**: اپنی سوچ کو \"یہ عنصر شروع میں ہے\" کی طرف منتقل کریں بجائے \"یہ بائیں طرف ہے\"۔

۳. **inline = افقی، block = عمودی**: افقی سمت (LTR/RTL) `inline` ہے، عمودی `block` ہے۔

۴. **براؤزر سپورٹ عمدہ ہے**: تمام جدید براؤزرز منطقی خصوصیات کی سپورٹ کرتے ہیں۔

۵. **آہستہ آہستہ منتقل ہوں**: پرانے پراجیکٹس میں نئے کوڈ سے شروع کریں اور آہستہ آہستہ پرانا کوڈ اپڈیٹ کریں۔

## مزید پڑھیں

- [RTL متن کی سمت کو سمجھنا](/ur/blog/understanding-rtl)
- [عام RTL مسائل اور ان کا حل](/ur/blog/common-rtl-bugs)
- [دو طرفہ متن اور یونیکوڈ BiDi الگورتھم](/ur/blog/bidirectional-text-bidi)
- [پڑھنے کی سمت صارف کے تجربے پر کیسے اثر ڈالتی ہے](/ur/blog/reading-direction-ux)
