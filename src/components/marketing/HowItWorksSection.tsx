'use client'

import { motion } from 'framer-motion'
import { Rocket, Download, Zap, ArrowLeft } from 'lucide-react'

const steps = [
  {
    icon: Rocket,
    title: 'سجّل حسابك',
    desc: 'أنشئ حسابك مجاناً في أقل من دقيقة عبر البريد الإلكتروني أو Google',
    color: 'from-sky-400 to-blue-600',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
  },
  {
    icon: Download,
    title: 'حمّل التطبيق',
    desc: 'نزّل تطبيق سيندر برو على جهازك وأدخل مفتاح التفعيل',
    color: 'from-violet-400 to-purple-600',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    icon: Zap,
    title: 'ابدأ التسويق',
    desc: 'استخرج بيانات العملاء، أرسل رسائل جماعية، وأدر حملاتك بكل سهولة',
    color: 'from-amber-400 to-orange-600',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  }
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="absolute inset-0 bg-[#060d1b]" />
      <div className="relative z-10 section-shell">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-1.5 text-[12px] font-semibold text-violet-400 mb-4">
            كيف يعمل
          </div>
          <h2 className="section-title">ابدأ في <span className="gradient-text">3 خطوات</span></h2>
          <p className="section-desc mt-3">من التسجيل إلى أول حملة — أقل من 5 دقائق</p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-24 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-sky-500/30 via-violet-500/30 to-amber-500/30" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${step.color} shadow-2xl shadow-black/20`}>
                  <step.icon className="h-9 w-9 text-white" />
                </div>
                <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/6 border border-white/10 text-sm font-bold text-slate-500 mb-4">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowLeft className="hidden md:block absolute top-24 -left-4 h-5 w-5 text-white/20 rotate-180" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <a href="/auth/register" className="btn-primary text-base px-10 py-4 shadow-2xl shadow-sky-500/20">
            ابدأ التجربة المجانية الآن
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </a>
        </div>
      </div>
    </section>
  )
}