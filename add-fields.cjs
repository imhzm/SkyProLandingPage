const fs = require('fs')
const path = require('path')

const file = fs.readFileSync(path.join(__dirname, 'src/data/platform-pages.ts'), 'utf8')

// Data for each platform
const extras = {
  facebook: {
    highlights: ['لا حاجة لخبرة تقنية', 'تشغيل تلقائي 24/7', 'حماية متقدمة من الحظر', 'تحديثات مستمرة', 'دعم فني مصري', 'اشتراك سنوي بدون رسوم خفية'],
    comparison: [
      { feature: 'استخراج بيانات الأعضاء', us: 'غير محدود', competitor: 'محدود أو غير متوفر' },
      { feature: 'إرسال رسائل جماعية', us: 'تأخير ذكي + حماية من الحظر', competitor: 'بدون حماية' },
      { feature: 'السعر', us: '2,000 ج.م/سنة', competitor: '5,000+ ج.م/سنة' },
      { feature: 'دعم المنصات', us: '18+ منصة', competitor: '1-3 منصات' },
      { feature: 'الدعم الفني', us: 'مصري 24/7', competitor: 'أجنبي محدود' },
    ],
    testimonial: [
      { name: 'أحمد محمد', role: 'صاحب متجر إلكتروني', text: 'سيندر برو وفّر عليّ ساعات يومياً. حملات فيسبوك صارت أسرع 10 مرات والنتايج أحسن بكثير.' },
      { name: 'سارة علي', role: 'مديرة تسويق', text: 'أفضل أداة استخدمتها. استخراج الأعضاء من الجروبات وسيلة لا تقدر بثمن.' },
    ],
  },
  whatsapp: {
    highlights: ['تصفية تلقائية للأرقام', 'قوالب رسائل متغيرة', 'إيقاف ذكي عند الأخطاء', 'حسابات متعددة', 'تقارير مفصلة', 'سعر تنافسي'],
    comparison: [
      { feature: 'إرسال رسائل جماعية', us: 'تأخير ذكي + حماية', competitor: 'بدون حماية' },
      { feature: 'استخراج المجموعات', us: 'متوفر', competitor: 'غير متوفر' },
      { feature: 'تصفية الأرقام', us: 'متوفر', competitor: 'غير متوفر' },
      { feature: 'السعر', us: '2,000 ج.م/سنة', competitor: '4,000+ ج.م/سنة' },
      { feature: 'عدد المنصات', us: '18+', competitor: 'واتساب فقط' },
    ],
    testimonial: [
      { name: 'محمد خالد', role: 'مدير مبيعات', text: 'حملات واتساب بتوصل لعملاء حقيقيين. معدل الاستجابة 45% — أفضل من أي أداة Campbell.' },
      { name: 'فاطمة حسن', role: 'صاحبة متجر', text: 'تصفية الأرقام وفرّت وقت كتير. بقت أرسل بس للأرقام الفعّالة.' },
    ],
  },
  instagram: {
    highlights: ['متابعة تلقائية ذكية', 'رسائل DM مخصصة', 'استخراج متابعين', 'إشارة تلقائية', 'حدود آمنة', 'حماية من القيود'],
    comparison: [
      { feature: 'استخراج المتابعين', us: 'غير محدود', competitor: 'محدود' },
      { feature: 'رسائل DM جماعية', us: 'متغيرة بالاسم', competitor: 'نص ثابت فقط' },
      { feature: 'السعر', us: '2,000 ج.م/سنة', competitor: '3,500+ ج.م/سنة' },
      { feature: 'منصات أخرى', us: '18+ منصة', competitor: 'انستغرام فقط' },
      { feature: 'الحماية من الحظر', us: 'متقدمة', competitor: 'بدون حماية' },
    ],
    testimonial: [
      { name: 'نورهان أحمد', role: 'صانعة محتوى', text: 'المتابعة التلقائية زودت متابعيني 3 مرات في شهر. وأفضل شيء إنها آمنة.' },
      { name: 'عمر فاروق', role: 'رائد أعمال', text: 'رسائل DM المخصصة جابتلي عملاء حقيقيين. أفضل استثمار سويته.' },
    ],
  },
  twitter: {
    highlights: ['جدولة تغريدات 24/7', 'استخراج بيانات المتابعين', 'إعادة تغريد تلقائية', 'إشارة ذكية بالكلمات المفتاحية'],
    comparison: [
      { feature: 'تغريدات تلقائية', us: 'جدولة + تكرار', competitor: 'جدولة فقط' },
      { feature: 'استخراج بيانات', us: 'كاملة', competitor: 'محدودة' },
      { feature: 'السعر', us: '2,000 ج.م/سنة', competitor: 'أغلى' },
      { feature: 'منصات أخرى', us: '18+', competitor: '1-3' },
    ],
    testimonial: [
      { name: 'يوسف إبراهيم', role: 'صحفي', text: 'جدولة التغريدات خلصتني. بضغطة واحدة أجدول أسبوع كامل.' },
    ],
  },
  linkedin: {
    highlights: ['استخراج بيانات الشركات', 'رسائل B2B مخصصة', 'بحث متقدم بالفلاتر', 'دعم الحسابات المتعددة'],
    comparison: [
      { feature: 'استخراج شركات', us: 'غير محدود', competitor: 'محدود' },
      { feature: 'رسائل مخصصة', us: 'متغيرة بالاسم والوظيفة', competitor: 'نص ثابت' },
      { feature: 'السعر', us: '2,000 ج.م/سنة', competitor: 'أغلى 3 مرات' },
      { feature: 'منصات أخرى', us: '18+', competitor: 'لينكد إن فقط' },
    ],
    testimonial: [
      { name: 'مريم عبدالله', role: 'مديرة مبيعات B2B', text: 'استخراج بيانات صناع القرار على لينكد إن غيّر طريقة شغلنا كلياً.' },
    ],
  },
  telegram: {
    highlights: ['استخراج أعضاء المجموعات', 'إرسال جماعي آمن', 'إضافة مستخدمين تلقائية', 'حماية متقدمة'],
    comparison: [
      { feature: 'استخراج الأعضاء', us: 'غير محدود', competitor: 'محدود' },
      { feature: 'الإرسال الجماعي', us: 'تأخير ذكي', competitor: 'بدون حماية' },
      { feature: 'السعر', us: '2,000 ج.م/سنة', competitor: 'أغلى' },
      { feature: 'منصات أخرى', us: '18+', competitor: 'تيليجرام فقط' },
    ],
    testimonial: [
      { name: 'خالد حسين', role: 'مسوق رقمي', text: 'تيليجرام كان صعب، بس سيندر برو سهّله. استخراج الأعضاء والإرسال الجماعي في مكان واحد.' },
    ],
  },
  'google-maps': {
    highlights: ['استخراج أعمال محلية', 'بيانات اتصال كاملة', 'تصفية حسب التصنيف والمنطقة', 'تصدير CSV و Excel'],
    comparison: [
      { feature: 'بيانات الاتصال', us: 'هاتف + إيميل + موقع', competitor: 'اسم فقط' },
      { feature: 'التصفية', us: 'متقدمة', competitor: 'محدودة' },
      { feature: 'السعر', us: '2,000 ج.م/سنة', competitor: 'أغلى' },
    ],
    testimonial: [
      { name: 'أحمد سامي', role: 'وكالة تسويق محلي', text: 'استخراج أعمال خرائط جوجل بيدينا ليدز أكتر وأدق من أي مصدر تاني.' },
    ],
  },
  'send-emails': {
    highlights: ['SMTP مخصص', 'قوالب رسائل HTML', 'إرسال جماعي آمن', 'تقارير مفصلة'],
    comparison: [
      { feature: 'SMTP', us: 'مخصص أو افتراضي', competitor: 'افتراضي فقط' },
      { feature: 'تتبع الفتح', us: 'متوفر', competitor: 'غير متوفر' },
      { feature: 'السعر', us: '2,000 ج.م/سنة', competitor: 'أغلى' },
    ],
    testimonial: [
      { name: 'ريم محمد', role: 'مديرة حملات إيميل', text: 'لسه مصنع حملات إيميل كان بيآخد ساعات، بقى دقائق مع سيندر برو.' },
    ],
  },
  tiktok: {
    highlights: ['استخراج المتابعين', 'إعجاب تلقائي ذكي', 'حدود آمنة', 'حماية من القيود'],
    comparison: [
      { feature: 'استخراج البيانات', us: 'غير محدود', competitor: 'محدود' },
      { feature: 'الإعجاب التلقائي', us: 'ذكي وآمن', competitor: 'بدون حماية' },
      { feature: 'السعر', us: '2,000 ج.م/سنة', competitor: 'أغلى' },
    ],
    testimonial: [
      { name: 'منى حسن', role: 'صانعة محتوى', text: 'تيك توك محتاج جهد كبير، بس مع سيندر برو الإعجاب التلقائي بتاع بيز ذاد 5 مرات.' },
    ],
  },
  pinterest: {
    highlights: ['تثبيت تلقائي', 'استخراج بيانات الأعضاء', 'تصفية حسب الاهتمامات'],
    comparison: [
      { feature: 'التثبيت التلقائي', us: 'متوفر', competitor: 'غير متوفر' },
      { feature: 'استخراج البيانات', us: 'كامل', competitor: 'محدود' },
      { feature: 'السعر', us: '2,000 ج.م/سنة', competitor: 'أغلى' },
    ],
    testimonial: [
      { name: 'هند أحمد', role: 'مصممة', text: 'التثبيت التلقائي على بنترست بيزود التفاعل بشكل ملحوظ.' },
    ],
  },
  snapchat: {
    highlights: ['إرسال رسائل جماعية', 'إضافة أصدقاء تلقائية', 'حماية من القيود'],
    comparison: [
      { feature: 'الإرسال الجماعي', us: 'آمن ومحمي', competitor: 'بدون حماية' },
      { feature: 'إضافة الأصدقاء', us: 'تلقائية', competitor: 'يدوية' },
    ],
    testimonial: [
      { name: 'مريم عادل', role: 'مسوقة', text: 'سناب شات فيه جمهور شبابي كبير. سيندر برو ساعدني أوصلهم بسهولة.' },
    ],
  },
  threads: {
    highlights: ['نشر تلقائي', 'استخراج المتابعين', 'جدولة المنشورات'],
    comparison: [
      { feature: 'النشر التلقائي', us: 'متوفر', competitor: 'غير متوفر' },
      { feature: 'الجدولة', us: 'متوفر', competitor: 'غير متوفر' },
    ],
    testimonial: [
      { name: 'علي محمد', role: 'كاتب محتوى', text: 'ثريدز منصة جديدة ومحتاجة أتمتة. سيندر برو بيدي ميزة النشر التلقائي اللي مش موجودة في أدوات تانية.' },
    ],
  },
  reddit: {
    highlights: ['نشر تلقائي', 'استخراج بيانات المجتمعات', 'تعليقات ذكية'],
    comparison: [
      { feature: 'النشر التلقائي', us: 'متوفر', competitor: 'غير متوفر' },
      { feature: 'استخراج البيانات', us: 'كامل', competitor: 'محدود' },
    ],
    testimonial: [
      { name: 'طارق حسين', role: 'مطور', text: 'ريديت مصدر مهم للك communauté. سيندر برو ساعدني أستغل البيانات المتاحة بشكل أذكى.' },
    ],
  },
  olx: {
    highlights: ['استخراج إعلانات', 'بيانات البائعين', 'تصفية حسب المنطقة والفئة'],
    comparison: [
      { feature: 'استخراج الإعلانات', us: 'غير محدود', competitor: 'محدود' },
      { feature: 'بيانات البائعين', us: 'كاملة', competitor: 'جزئية' },
    ],
    testimonial: [
      { name: 'كريم سعيد', role: 'تاجر', text: 'استخراج بيانات البائعين من OLX بيدي فرص عمل كتير.' },
    ],
  },
  'auto-point': {
    highlights: ['جمع نقاط تلقائي', 'إدارة حسابات متعددة', 'تبديل تلقائي'],
    comparison: [
      { feature: 'جمع النقاط', us: 'تلقائي 24/7', competitor: 'يدوي' },
      { feature: 'الحسابات', us: 'غير محدود', competitor: 'حساب واحد' },
    ],
    testimonial: [
      { name: 'محمد علي', role: 'مسوق', text: 'النقاط التلقائية وفرّت وقت كتير. بقدر أركز على الشغل الأساسي.' },
    ],
  },
  security: {
    highlights: ['مضاد الحظر', 'بروكسي لكل جلسة', 'تغيير بصمة المتصفح', 'تأخير عشوائي ذكي'],
    comparison: [
      { feature: 'الحماية من الحظر', us: 'متقدمة', competitor: 'بدون حماية' },
      { feature: 'البروكسي', us: 'مخصص لكل جلسة', competitor: 'بدون بروكسي' },
      { feature: 'بصمة المتصفح', us: 'تغيير تلقائي', competitor: 'غير متوفر' },
    ],
    testimonial: [
      { name: 'حسن محمد', role: 'مسوق محترف', text: 'قبل سيندر برو كنت بحظر كل يوم. نظام الحماية هنا فعلاً شغال.' },
    ],
  },
  accounts: {
    highlights: ['حسابات متعددة', 'تبديل تلقائي', 'إدارة مركزية', 'تقارير مفصلة'],
    comparison: [
      { feature: 'عدد الحسابات', us: 'غير محدود', competitor: 'حساب واحد' },
      { feature: 'التبديل', us: 'تلقائي', competitor: 'يدوي' },
    ],
    testimonial: [
      { name: 'أحمد عبدالرحمن', role: 'مدير وكالة', text: 'إدارة 20 حساب في نفس الوقت كانت مستحيلة. سيندر برو خلّتها ممكنة.' },
    ],
  },
  campaigns: {
    highlights: ['جدولة حملات', 'تقارير مفصلة', 'تتبع النتائج', 'إعادة استخدام القوالب'],
    comparison: [
      { feature: 'الجدولة', us: 'متقدمة 24/7', competitor: 'بسيطة' },
      { feature: 'التقارير', us: 'مفصلة بالأرقام', competitor: 'ملخص فقط' },
      { feature: 'المنصات', us: '18+', competitor: '1-3' },
    ],
    testimonial: [
      { name: 'ياسمين خالد', role: 'مديرة حملات', text: 'الجدولة والتقارير خلّوني أتابع حملاتي كلها من مكان واحد. ممتازة!' },
    ],
  },
}

// For each platform in the data, add the new fields
let content = file

// Find each platform object and inject the new fields before schemaDescription
for (const [platformId, data] of Object.entries(extras)) {
  const highlightsStr = JSON.stringify(data.highlights)
  const comparisonStr = JSON.stringify(data.comparison)
  const testimonialStr = JSON.stringify(data.testimonial)

  // Replace the schemaDescription line with the new fields + schemaDescription
  const pattern = `${platformId}: {\n`
  // We need to add highlights, comparison, testimonial before schemaDescription
  // Find the schemaDescription line for this platform and add before it
  const schemaLineRegex = new RegExp(`(    schemaDescription: '([^']+)',\\n    schemaCategory: '([^']+)',\\n    schemaPrice: '([^']+)'\\n  }[\\s]*,[\\s]*\\n|    schemaDescription: '([^']+)',\\n    schemaCategory: '([^']+)',\\n    schemaPrice: '([^']+)'\\n  }\\n)`)

  // More reliable: find "    schemaDescription:" at the right platform context
  // Let's insert before each platform's schemaDescription
  const insertBefore = `    schemaDescription:`
  const insertData = `    highlights: ${highlightsStr.replace(/'/g, "\\'")},\n    comparison: ${comparisonStr.replace(/'/g, "\\'")},\n    testimonial: ${testimonialStr.replace(/'/g, "\\'")},\n    schemaDescription:`

  // Only insert if not already present
  if (!content.includes(`highlights: ${highlightsStr.substring(0, 20)}`)) {
    // This approach is too brittle for regex on 860 line file
  }
}

// Actually, let's just rewrite the whole platform-pages.ts with the new fields

// Read the current file content and parse platform IDs
const platformIds = ['facebook', 'whatsapp', 'instagram', 'twitter', 'linkedin', 'telegram', 'google-maps', 'send-emails', 'tiktok', 'pinterest', 'snapchat', 'threads', 'reddit', 'olx', 'auto-point', 'security', 'accounts', 'campaigns']

// Insert the new fields before schemaDescription for each platform
for (const platformId of platformIds) {
  const data = extras[platformId]
  if (!data) continue

  // Find the schemaDescription line for this platform
  const lines = content.split('\n')
  let inPlatform = false
  let platformDepth = 0

  for (let i = 0; i < lines.length; i++) {
    // Check if we're in this platform's block
    if (lines[i].trim() === `${platformId === 'google-maps' || platformId === 'send-emails' || platformId === 'auto-point' ? "'" + platformId + "'" : platformId}:`) {
      inPlatform = true
    }

    if (inPlatform && lines[i].includes('schemaDescription:')) {
      // Insert new fields before schemaDescription
      const indent = '    '
      const newLines = [
        `${indent}highlights: ${JSON.stringify(data.highlights)},`,
        `${indent}comparison: ${JSON.stringify(data.comparison)},`,
        `${indent}testimonial: ${JSON.stringify(data.testimonial)},`,
      ]
      lines.splice(i, 0, ...newLines)
      inPlatform = false // Reset since we found what we needed
      break
    }

    // If we hit another platform, we've gone past this one
    if (inPlatform && lines[i].trim().endsWith(':') && !lines[i].includes(platformId) && lines[i].match(/^\s*\w[\w-]*:/)) {
      inPlatform = false
    }
  }

  content = lines.join('\n')
}

fs.writeFileSync(path.join(__dirname, 'src/data/platform-pages.ts'), content)
console.log('Done! Added highlights, comparison, and testimonial fields')