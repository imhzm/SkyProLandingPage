<div align="center">

![Sky Pro Landing](https://img.shields.io/badge/🌐%20Sky%20Pro-Web%20Platform-6366f1?style=for-the-badge&labelColor=1a1a2e)

### صفحة هبوط + لوحة تحكم إدارية + نظام مصادقة مركزي
**Next.js 14 | Prisma | NextAuth | Tailwind CSS | RTL Arabic**

[![Next.js](https://img.shields.io/badge/Next.js-14-000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[🌐 الموقع](https://skypro.skywaveads.com) · [💻 التطبيق المكتبي](https://github.com/imhzm/SkyPro) · [💬 تواصل](mailto:admin@skywaveads.com)

</div>

---

## 🎯 نظرة عامة

البنية التحتية الويب لسيندر برو — تتكون من 3 أجزاء مترابطة:

1. **Landing Page** — صفحة هبوط RTL احترافية بالعربية
2. **Admin Dashboard** — لوحة تحكم كاملة للمستخدمين والمفاتيح والأجهزة
3. **نظام المصادقة** — تسجيل/دخول + Device Fingerprinting + إدارة اشتراكات

## ✨ المميزات

### صفحة الهبوط
- 🎨 تصميم RTL عربي احترافي
- 📱 متجاوب مع جميع الشاشات
- ✨ حركات Framer Motion
- 🔐 تسجيل بـ Google OAuth + Email/Password
- 💰 قسم أسعار واضح (2,000 ج.م/سنة)
- ❓ أسئلة شائعة مع أكورديون
- ⭐ شهادات عملاء

### لوحة التحكم
- 👥 إدارة المستخدمين (عرض، تعديل، تعليق، حذف)
- 🔑 إدارة مفاتيح التفعيل (إنشاء، تعيين، إلغاء)
- 💻 إدارة الأجهزة + Device Fingerprinting
- 📊 إحصائيات شاملة
- 🔄 إدارة الاشتراكات والفوترة
- 📋 سجل أحداث تفصيلي
- ⚙️ إعدادات النظام

### نظام المصادقة
- 🔐 NextAuth v5 (Google + Credentials)
- 🔒 حماية Brute Force (5 محاولات → قفل 15 دقيقة)
- 📱 بصمة الجهاز (SHA-256 fingerprint)
- 🔄 إعادة تعيين الجهاز (حد أقصى مرتين/سنة)
- ✉️ تأكيد البريد الإلكتروني
- 🔑 إعادة تعيين كلمة المرور

## 🏗️ البنية التقنية

```
skypro-web/
├── src/
│   ├── app/
│   │   ├── (marketing)/     # Landing page
│   │   ├── auth/            # Login, Register, Reset Password
│   │   ├── admin/          # Dashboard, Users, Keys, Devices, etc.
│   │   └── api/            # 28 API endpoints
│   ├── components/
│   │   ├── marketing/      # Hero, Features, Pricing, FAQ, etc.
│   │   └── admin/          # Sidebar
│   ├── data/               # Platform definitions
│   ├── lib/
│   │   ├── auth.ts         # NextAuth config
│   │   ├── db.ts           # Prisma client
│   │   ├── utils.ts        # Hash, crypto, helpers
│   │   ├── validations.ts  # Zod schemas
│   │   └── api.ts          # Response helpers
│   └── types/              # NextAuth types
├── prisma/
│   └── schema.prisma       # 10 models
└── .env                    # Environment variables
```

## 🗄️ قاعدة البيانات

| الجدول | الوصف |
|--------|-------|
| `users` | المستخدمين مع Google OAuth |
| `accounts` | حسابات OAuth |
| `nextauth_sessions` | جلسات NextAuth |
| `activation_keys` | مفاتيح التفعيل (SKY1-PRO2-XXXX-2026) |
| `devices` | بصمة الأجهزة |
| `subscriptions` | الاشتراكات والديمو |
| `audit_log` | سجل الأحداث |
| `system_settings` | إعدادات النظام |
| `verification_tokens` | توكن التحقق |

## 🚀 البدء السريع

### المتطلبات
- Node.js 18+
- MySQL 8+
- npm أو yarn

### التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/imhzm/SkyProLandingPage.git
cd SkyProLandingPage

# تثبيت التبعيات
npm install

# إعداد قاعدة البيانات
cp .env.example .env
# عدّل DATABASE_URL في .env

# إنشاء الجداول
npx prisma db push

# تشغيل في وضع التطوير
npm run dev

# بناء للإنتاج
npm run build
```

### متغيرات البيئة (.env)

```env
DATABASE_URL="mysql://user:password@localhost:3306/skypro"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://skypro.skywaveads.com"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
DEFAULT_TRIAL_DAYS=2
DEFAULT_MAX_DEVICES=1
DEFAULT_MAX_RESETS_PER_YEAR=2
DEFAULT_KEY_PRICE=2000
DEFAULT_KEY_CURRENCY=EGP
DEFAULT_KEY_DURATION_DAYS=365
```

## 🔌 API Endpoints

### المصادقة
| Method | Endpoint | الوصف |
|--------|----------|-------|
| POST | `/api/auth/register` | تسجيل حساب جديد |
| POST | `/api/auth/login` | تسجيل دخول |
| POST | `/api/auth/verify-email` | تأكيد البريد |
| POST | `/api/auth/forgot-password` | نسيت كلمة المرور |
| POST | `/api/auth/reset-password` | إعادة تعيين كلمة المرور |
| POST | `/api/auth/verify-device` | التحقق من الجهاز |
| POST | `/api/auth/reset-device` | إعادة تعيين بصمة الجهاز |
| GET | `/api/auth/me` | بيانات المستخدم |

### الأدمن
| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/api/admin/stats` | إحصائيات عامة |
| GET/PUT/DELETE | `/api/admin/users` | إدارة المستخدمين |
| GET/POST | `/api/admin/keys` | إدارة المفاتيح |
| GET/DELETE | `/api/admin/devices` | إدارة الأجهزة |
| GET/PUT | `/api/admin/subscriptions` | إدارة الاشتراكات |
| GET | `/api/admin/audit-log` | سجل الأحداث |
| GET/POST | `/api/admin/settings` | إعدادات النظام |

## 🚀 النشر

```bash
# بناء
npm run build

# تشغيل بـ PM2
pm2 start npm --name "skypro-web" -- start

# إعداد Nginx reverse proxy
# راجع مستندات النشر التفصيلية
```

## 📞 التواصل

- 📧 البريد: [admin@skywaveads.com](mailto:admin@skywaveads.com)
- 📱 واتساب: +20 106 789 4321
- 🌐 الموقع: [skypro.skywaveads.com](https://skypro.skywaveads.com)
- 💻 التطبيق المكتبي: [github.com/imhzm/SkyPro](https://github.com/imhzm/SkyPro)

---

<div align="center">

**صُنع بـ ❤️ في مصر 🇪🇬**

</div>