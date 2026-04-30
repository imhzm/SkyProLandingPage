'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'أحمد محمد',
    role: 'مدير تسويق',
    company: 'شركة النور للتجارة',
    text: 'سيندر برو وفّر علينا ساعات من العمل اليومي. حملاتنا التسويقية على فيسبوك واتساب أصبحت أسرع 10 مرات.',
    rating: 5
  },
  {
    name: 'سارة علي',
    role: 'صاحبة متجر إلكتروني',
    company: 'متجر روز',
    text: 'من أفضل الأدوات اللي استخدمتها. استخراج بيانات العملاء من جوجل مابس ساعدني أوصل لعملاء جداد بسهولة.',
    rating: 5
  },
  {
    name: 'محمد خالد',
    role: 'مدير مبيعات',
    company: 'مجموعة الخليج',
    text: 'إدارة حسابات متعددة في نفس الوقت ميزة رهيبة. والدعم الفني ممتاز - بيردوا في دقائق.',
    rating: 5
  },
  {
    name: 'فاطمة حسن',
    role: 'مسؤولة تسويق',
    company: 'وكالة ديجيتال بلس',
    text: 'نظام الحماية من الحظر فعلاً شغال. قبل سيندر برو كنا بنحظر كل يوم، الحمد لله الموضوع اتظبط.',
    rating: 5
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">ماذا يقول عملاؤنا</h2>
          <p className="section-desc mt-2">آراء حقيقية من مستخدمين يثقون في سيندر برو</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <svg key={si} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-bl from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role} — {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}