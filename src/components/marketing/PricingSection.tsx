'use client'

import { Check } from 'lucide-react'

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">خطة واحدة، كل المميزات</h2>
          <p className="section-desc mt-2">لا رسوم خفية، لا اشتراكات معقدة</p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="card relative overflow-hidden border-2 border-indigo-500 shadow-xl">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
              الأكثر شعبية
            </div>

            <div className="text-center p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">سيندر برو</h3>
              <p className="text-gray-500 mb-6">اشتراك سنوي — كل المميزات متاحة</p>

              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-5xl font-extrabold gradient-text">2,000</span>
                <span className="text-xl text-gray-500">ج.م</span>
              </div>
              <p className="text-sm text-gray-400 mb-8">سنوياً — أقل من 167 ج.م/شهر</p>

              <div className="space-y-3 text-right mb-8">
                {[
                  'جميع المنصات الـ 18+ متاحة',
                  'استخراج بيانات غير محدود',
                  'إرسال رسائل جماعية',
                  'إدارة حسابات متعددة',
                  'نظام حماية مضاد للحظر',
                  'بروكسي مخصص لكل جلسة',
                  'جدولة الحملات',
                  'تحديثات مجانية مدة الاشتراك',
                  'دعم فني على مدار الساعة',
                  'فترة تجريبية يومين مجاناً',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <a href="/auth/register" className="btn-primary w-full block text-center text-lg py-3">
                ابدأ التجربة المجانية
              </a>
              <p className="text-xs text-gray-400 mt-3">لا تحتاج بطاقة ائتمانية — تجربة مجانية يومين</p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: '🔒', title: 'دفع آمن', desc: 'فودافون كاش أو تحويل بنكي' },
            { icon: '🔄', title: 'ضمان استرجاع', desc: '7 أيام استرجاع كامل' },
            { icon: '🛡️', title: 'بيانات محفوظة', desc: 'تشفير كامل وخصوصية تامة' },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <span className="text-3xl">{item.icon}</span>
              <h4 className="font-bold text-gray-900 mt-2">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}