'use client'

import { motion } from 'framer-motion'
import { Rocket, Download, Zap } from 'lucide-react'

const steps = [
  {
    icon: Rocket,
    title: 'سجّل حسابك',
    desc: 'أنشئ حسابك مجاناً في أقل من دقيقة عبر البريد الإلكتروني أو Google',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Download,
    title: 'حمّل التطبيق',
    desc: 'نزّل تطبيق سيندر برو على جهازك وأدخل مفتاح التفعيل',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Zap,
    title: 'ابدأ التسويق',
    desc: 'استخرج بيانات العملاء، أرسل رسائل جماعية، وأدر حملاتك بكل سهولة',
    color: 'from-pink-500 to-rose-500'
  }
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">كيف يعمل؟</h2>
          <p className="section-desc mt-2">ابدأ في 3 خطوات بسيطة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="text-center"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-l ${step.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-5xl font-bold text-gray-200 mb-2">{i + 1}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}