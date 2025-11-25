---
id: "common-rtl-bugs"
title: "عام RTL مسائل اور ان کا حل"
excerpt: "RTL نفاذ میں سب سے زیادہ پائی جانے والی خرابیوں کو پہچاننا اور ٹھیک کرنا سیکھیں۔"
category: "rtl-ltr-concepts"
author: "karim-benali"
publishedAt: "2024-12-30"
readingTime: 11
featured: false
featuredImage: "/images/posts/common-rtl-bugs.jpg"
tags: ["rtl", "ڈیبگنگ", "css", "مسائل", "حل"]
---

## تعارف

RTL سپورٹ نافذ کرنا مشکل ہو سکتا ہے۔ یہاں تک کہ تجربہ کار ڈویلپرز بھی ایسی خرابیوں کا سامنا کرتے ہیں جو LTR-صرف ماحول میں کبھی ظاہر نہیں ہوتیں۔ اس رہنمائی میں ہم سب سے عام RTL مسائل اور ان کے عملی حل دیکھیں گے۔

## مسئلہ 1: آئیکنز غلط سمت اشارہ کرتے ہیں

### علامت

سمت بتانے والے آئیکنز (تیر، شیورنز) RTL میں غلط سمت اشارہ کرتے ہیں۔

```html
<!-- LTR میں ٹھیک، RTL میں غلط -->
<button>
  اگلا <span class="arrow">→</span>
</button>
```

### حل

```css
/* آئیکنز کو RTL میں پلٹائیں */
[dir="rtl"] .directional-icon {
  transform: scaleX(-1);
}

/* یا منطقی آئیکنز استعمال کریں */
.arrow-end::after {
  content: "→";
}
[dir="rtl"] .arrow-end::after {
  content: "←";
}
```

### کون سے آئیکنز پلٹیں

| پلٹیں | نہ پلٹیں |
|------|---------|
| نیویگیشن تیر | پلے/پاز بٹن |
| شیورنز | چیک مارک |
| اندر/باہر تیر | مائکروفون |
| reply/forward | سرچ آئیکن |
| بیک بٹن | ڈاؤنلوڈ |

## مسئلہ 2: علامات غلط جگہ منتقل ہو جاتی ہیں

### علامت

علامات جیسے قوسین، کولن، یا ڈیش RTL سیاق میں غیر متوقع طور پر حرکت کرتے ہیں۔

```html
<p dir="rtl">
  فون: +92-300-1234567
</p>
<!-- ڈیش یا + غلط جگہ ظاہر ہو سکتا ہے -->
```

### حل

```html
<!-- LTR آئسولیشن استعمال کریں -->
<p dir="rtl">
  فون: <span dir="ltr">+92-300-1234567</span>
</p>

<!-- یا bdi عنصر -->
<p dir="rtl">
  فون: <bdi dir="ltr">+92-300-1234567</bdi>
</p>
```

```css
.phone-number,
.email-address,
.url {
  direction: ltr;
  unicode-bidi: embed;
}
```

## مسئلہ 3: فارم فیلڈز غلط سیدھ

### علامت

ان پٹ فیلڈز، پلیس ہولڈرز، یا لیبلز RTL لے آؤٹ میں غلط طریقے سے سیدھ میں ہیں۔

```css
/* غلط: جسمانی خصوصیات */
.form-input {
  text-align: left;
  padding-left: 12px;
}
```

### حل

```css
/* صحیح: منطقی خصوصیات */
.form-input {
  text-align: start;
  padding-inline-start: 12px;
}

/* یا dir خصوصیت وراثت کریں */
.form-input {
  text-align: inherit;
}
```

```html
<!-- RTL فارم -->
<form dir="rtl">
  <label>نام:</label>
  <input type="text" placeholder="اپنا نام لکھیں">
</form>
```

## مسئلہ 4: Flexbox الٹا نہیں ہوتا

### علامت

Flex آئٹمز RTL میں خود بخود الٹے نہیں ہوتے۔

```css
/* غلط: واضح سمت */
.nav {
  display: flex;
  flex-direction: row;
}
```

### حل

Flexbox خود بخود `dir` خصوصیت کا احترام کرتا ہے، لیکن آپ کو یقینی بنانا ہوگا کہ:

```html
<!-- dir خصوصیت کنٹینر پر یا والدین پر ہونی چاہیے -->
<nav dir="rtl" class="nav">
  <a href="/">گھر</a>
  <a href="/about">ہمارے بارے میں</a>
  <a href="/contact">رابطہ</a>
</nav>
```

```css
.nav {
  display: flex;
  /* flex-direction: row; -- یہ dir کا احترام کرے گا */
}

/* واضح LTR مجبور نہ کریں */
/* غلط: */
.nav {
  flex-direction: row; /* RTL میں بھی بائیں سے دائیں */
}
```

## مسئلہ 5: مطلق پوزیشننگ ٹوٹتی ہے

### علامت

`left: 0` یا `right: 0` کے ساتھ پوزیشن کیے گئے عناصر RTL میں غلط جگہ ہیں۔

```css
/* غلط */
.dropdown {
  position: absolute;
  left: 0;
  top: 100%;
}
```

### حل

```css
/* منطقی inset استعمال کریں */
.dropdown {
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 100%;
}

/* یا دستی اوور رائیڈ */
.dropdown {
  position: absolute;
  left: 0;
}

[dir="rtl"] .dropdown {
  left: auto;
  right: 0;
}
```

## مسئلہ 6: CSS Transforms غلط

### علامت

`translateX` یا `rotate` والے ایلیمنٹس RTL میں غلط سمت حرکت کرتے ہیں۔

```css
/* LTR میں دائیں سلائیڈ، RTL میں بھی دائیں */
.slide-in {
  transform: translateX(100%);
}
```

### حل

```css
/* RTL کے لیے الگ قدر */
.slide-in {
  transform: translateX(100%);
}

[dir="rtl"] .slide-in {
  transform: translateX(-100%);
}

/* یا CSS متغیرات */
:root {
  --direction-multiplier: 1;
}

[dir="rtl"] {
  --direction-multiplier: -1;
}

.slide-in {
  transform: translateX(calc(100% * var(--direction-multiplier)));
}
```

## مسئلہ 7: بارڈر ریڈیس غیر متوازن

### علامت

گول کونے RTL میں غلط اطراف پر ہیں۔

```css
/* LTR میں بائیں گول، RTL میں بھی بائیں */
.tab {
  border-radius: 8px 0 0 8px;
}
```

### حل

```css
/* منطقی بارڈر ریڈیس */
.tab {
  border-start-start-radius: 8px;
  border-end-start-radius: 8px;
}

/* یا دستی اوور رائیڈ */
.tab {
  border-radius: 8px 0 0 8px;
}

[dir="rtl"] .tab {
  border-radius: 0 8px 8px 0;
}
```

## مسئلہ 8: text-overflow: ellipsis غلط سمت

### علامت

کٹا ہوا متن غلط سمت سے کٹتا ہے۔

```css
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### حل

```css
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* سمت وراثت یقینی بنائیں */
  direction: inherit;
}
```

## مسئلہ 9: Scrollbar غلط طرف

### علامت

RTL مواد میں سکرول بار غلط طرف ظاہر ہوتا ہے۔

### حل

جدید براؤزرز `dir="rtl"` کا احترام کرتے ہیں:

```html
<div dir="rtl" class="scrollable">
  <!-- سکرول بار بائیں طرف ہوگا -->
</div>
```

```css
.scrollable {
  overflow-y: auto;
  /* سکرول بار خود بخود بائیں طرف (RTL کے لیے شروع) */
}
```

## مسئلہ 10: JavaScript میں سمت نظرانداز

### علامت

JavaScript اینیمیشنز یا DOM ہیرا پھیری RTL سمت کو نظرانداز کرتی ہیں۔

```javascript
// غلط: ہارڈ کوڈڈ سمت
element.style.left = '100px';

// غلط: فرض کرنا LTR ہے
const x = element.getBoundingClientRect().left;
```

### حل

```javascript
// صحیح: سمت چیک کریں
const isRTL = document.dir === 'rtl' ||
              document.documentElement.dir === 'rtl';

if (isRTL) {
  element.style.right = '100px';
} else {
  element.style.left = '100px';
}

// بہتر: CSS متغیرات استعمال کریں
element.style.setProperty('--position-offset', '100px');
```

```css
.element {
  inset-inline-start: var(--position-offset);
}
```

## ڈیبگنگ ٹولز

### براؤزر DevTools

```javascript
// سمت جلدی بدلنے کے لیے
document.documentElement.dir = 'rtl';

// یا
document.body.setAttribute('dir', 'rtl');
```

### RTL ٹیسٹنگ چیک لسٹ

```markdown
□ نیویگیشن ترتیب الٹی ہے
□ سمت والے آئیکنز پلٹے ہوئے ہیں
□ فارم لیبلز اور ان پٹس صحیح سیدھ میں ہیں
□ ٹیکسٹ اوور فلو صحیح سمت سے کٹتا ہے
□ موڈلز اور ڈراپ ڈاؤنز صحیح جگہ ہیں
□ اینیمیشنز صحیح سمت ہیں
□ فون نمبر اور URLs صحیح ہیں
□ تاریخیں اور نمبر صحیح فارمیٹ میں ہیں
```

## اہم نکات

۱. **منطقی خصوصیات استعمال کریں**: `margin-inline-start` بجائے `margin-left` — یہ زیادہ تر مسائل سے بچاتا ہے۔

۲. **آئیکنز کی درجہ بندی کریں**: سمت والے آئیکنز (تیر) الگ اور عام آئیکنز (چیک مارک) الگ۔

۳. **LTR مواد آئسولیٹ کریں**: فون نمبر، URLs، کوڈ ہمیشہ `dir="ltr"` میں رکھیں۔

۴. **جلدی ٹیسٹ کریں**: ڈویلپمنٹ کے دوران باقاعدگی سے RTL میں ٹیسٹ کریں۔

۵. **حقیقی صارفین شامل کریں**: مقامی RTL بولنے والے ایسے مسائل پکڑیں گے جو آپ نہیں دیکھ سکتے۔

## مزید پڑھیں

- [RTL متن کی سمت کو سمجھنا](/ur/blog/understanding-rtl)
- [RTL/LTR سپورٹ کے لیے CSS منطقی خصوصیات](/ur/blog/css-logical-properties)
- [دو طرفہ متن اور یونیکوڈ BiDi الگورتھم](/ur/blog/bidirectional-text-bidi)
- [RTL زبانوں میں نمبر](/ur/blog/numbers-in-rtl-languages)
