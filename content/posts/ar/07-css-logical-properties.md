---
id: "css-logical-properties"
title: "خصائص CSS المنطقية لدعم RTL/LTR"
excerpt: "كيفية استخدام خصائص CSS المنطقية لإنشاء تخطيطات تتكيف تلقائياً مع أي اتجاه كتابة."
category: "rtl-ltr-concepts"
author: "karim-benali"
publishedAt: "2025-01-02"
readingTime: 10
featured: false
featuredImage: "/images/posts/css-logical-properties.jpg"
tags: ["css", "rtl", "ltr", "خصائص-منطقية", "تطوير-الويب"]
---

## مقدمة

لسنوات، استخدم CSS خصائص فيزيائية مثل `margin-left` و `padding-right` و `border-top` و `text-align: left`. تعمل هذه بشكل مثالي للغات من اليسار إلى اليمين، لكنها تفشل عندما تحتاج لدعم لغات RTL مثل العربية أو العبرية.

تقدم **خصائص CSS المنطقية** — نهجاً حديثاً يستخدم `start` و `end` بدلاً من `left` و `right`. مع الخصائص المنطقية، تتكيف تخطيطاتك تلقائياً مع أي اتجاه كتابة دون سطر واحد من CSS خاص بالاتجاه.

## مشكلة الخصائص الفيزيائية

### النهج التقليدي

تأمل تخطيط بطاقة بسيط:

```css
/* خصائص فيزيائية تقليدية */
.card {
  padding-left: 20px;
  margin-right: 16px;
  border-left: 4px solid blue;
  text-align: left;
}
```

لـ LTR، يبدو هذا رائعاً. لكن لـ RTL؟ الحشو في الجانب الخطأ، والهامش معكوس، والحدود في المكان الخطأ.

### الحل القديم: التكرار

سابقاً، كان عليك تكرار الأنماط:

```css
/* أنماط LTR */
.card {
  padding-left: 20px;
  margin-right: 16px;
  border-left: 4px solid blue;
  text-align: left;
}

/* تجاوزات RTL */
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

هذا النهج له مشاكل:
- تكرار الكود
- سهولة نسيان الخصائص
- كابوس صيانة
- زيادة حجم ملف CSS

## الخصائص المنطقية

### الحل الحديث

تستخدم الخصائص المنطقية مفهوم **start** و **end** نسبة لوضع الكتابة:

```css
/* خصائص منطقية - تعمل لكل من LTR و RTL */
.card {
  padding-inline-start: 20px;
  margin-inline-end: 16px;
  border-inline-start: 4px solid blue;
  text-align: start;
}
```

فقط عيّن `dir="rtl"` على HTML الخاص بك، وكل شيء ينعكس تلقائياً!

## فهم المصطلحات

### نسبي للتدفق مقابل الفيزيائي

تستخدم خصائص CSS المنطقية محورين:
- **محور block**: اتجاه تراكم الكتل (عادة عمودي)
- **محور inline**: اتجاه تدفق النص (أفقي في اللاتينية/العربية)

### المقابلة

| فيزيائي | منطقي (Inline) | السلوك في RTL |
|---------|----------------|---------------|
| left | inline-start | يصبح right |
| right | inline-end | يصبح left |

## مرجع كامل للخصائص

### Margin

```css
/* فيزيائي */
margin-left: 20px;
margin-right: 20px;

/* منطقي */
margin-inline-start: 20px;
margin-inline-end: 20px;

/* اختصار */
margin-inline: 20px;        /* البداية والنهاية */
```

### Padding

```css
/* فيزيائي */
padding-left: 15px;
padding-right: 15px;

/* منطقي */
padding-inline-start: 15px;
padding-inline-end: 15px;

/* اختصار */
padding-inline: 15px;
```

### Border

```css
/* فيزيائي */
border-left: 2px solid red;

/* منطقي */
border-inline-start: 2px solid red;

/* نصف قطر الحدود - قيم منطقية */
border-start-start-radius: 8px;  /* أعلى اليسار في LTR */
border-start-end-radius: 8px;    /* أعلى اليمين في LTR */
border-end-start-radius: 8px;    /* أسفل اليسار في LTR */
border-end-end-radius: 8px;      /* أسفل اليمين في LTR */
```

### محاذاة النص

```css
/* فيزيائي */
text-align: left;
text-align: right;

/* منطقي */
text-align: start;
text-align: end;
```

## أمثلة من العالم الحقيقي

### مكون التنقل

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

### بطاقة مع أيقونة

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

### تخطيط مع شريط جانبي

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

## دعم المتصفحات

خصائص CSS المنطقية لها دعم ممتاز في المتصفحات الحديثة:

| المتصفح | الدعم |
|---------|-------|
| Chrome | 89+ (كامل) |
| Firefox | 66+ (كامل) |
| Safari | 15+ (كامل) |
| Edge | 89+ (كامل) |

## الدمج مع Flexbox و Grid

### Flexbox

Flexbox منطقي بطبيعته ويحترم `direction`:

```css
.container {
  display: flex;
  flex-direction: row; /* ينعكس في RTL */
}
```

العناصر تعيد ترتيب نفسها تلقائياً بناءً على الاتجاه — لا حاجة لتغييرات!

### Grid

CSS Grid يعمل أيضاً بشكل منطقي:

```css
.grid {
  display: grid;
  grid-template-columns: 200px 1fr; /* ينعكس في RTL */
  gap: 20px;
}
```

## النقاط الرئيسية

١. **استخدم الخصائص المنطقية افتراضياً**: ابدأ بـ `inline-start`/`inline-end` بدلاً من `left`/`right` لكل CSS جديد.

٢. **استفد من Flexbox و Grid**: يتعاملان مع الاتجاه تلقائياً.

٣. **الفيزيائي ليس دائماً خطأ**: بعض الخصائص (الظلال، الحدود الزخرفية) يجب أن تبقى فيزيائية.

٤. **دعم المتصفحات ممتاز**: جميع المتصفحات الحديثة تدعم الخصائص المنطقية بالكامل.

٥. **الترحيل تدريجي**: حوّل مكوناً بمكون، وأزل تجاوزات RTL أثناء ذلك.

## للمزيد من القراءة

- [فهم اتجاه النص RTL](/blog/understanding-rtl)
- [الأخطاء الشائعة في RTL وكيفية إصلاحها](/blog/common-rtl-bugs)
- [النص ثنائي الاتجاه وخوارزمية يونيكود BiDi](/blog/bidirectional-text-bidi)
- [كيف يؤثر اتجاه القراءة على تجربة المستخدم](/blog/reading-direction-ux)
