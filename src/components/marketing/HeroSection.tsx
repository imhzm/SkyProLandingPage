'use client'

import { platforms } from '@/data/platforms'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-bl from-indigo-50 via-white to-purple-50">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          أقوى أداة تسويق آلي في الشرق الأوسط
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
          <span className="gradient-text">سيندر برو</span>
          <br />
          <span className="text-gray-900">تسويق آلي احترافي</span>
          <br />
          <span className="text-gray-600 text-3xl sm:text-4xl lg:text-5xl">لـ 18+ منصة تواصل اجتماعي</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          أتمت حملاتك التسويقية على فيسبوك، واتساب، انستغرام، تويتر وغيرها.
          استخرج بيانات العملاء المحتملين، أرسل رسائل جماعية، ودارت حسابات متعددة — كل ذلك من تطبيق واحد.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a href="/auth/register" className="btn-primary text-lg px-8 py-3 shadow-lg shadow-indigo-500/25">
            جرّب مجاناً — يومين
          </a>
          <a href="#how-it-works" className="btn-secondary text-lg px-8 py-3">
            كيف يعمل؟
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
          {platforms.slice(0, 12).map((p) => (
            <span
              key={p.id}
              className="inline-flex items-center gap-1.5 bg-white shadow-sm border border-gray-100 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
            >
              <span>{p.icon}</span>
              {p.name}
            </span>
          ))}
          <span className="inline-flex items-center bg-white shadow-sm border border-gray-100 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-500">
            +6 منصات أخرى
          </span>
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: '18+', label: 'منصة مدعومة' },
            { value: '10K+', label: 'مستخدم نشط' },
            { value: '50M+', label: 'رسالة مرسلة' },
            { value: '99.9%', label: 'وقت التشغيل' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}