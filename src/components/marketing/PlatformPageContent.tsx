'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronDown, ArrowRight, Zap, Shield, Clock, Users } from 'lucide-react'
import { PlatformIcon } from '@/components/marketing/PlatformIcon'
import type { PlatformPageData } from '@/data/platform-pages'

const benefitIcons = [Zap, Shield, Clock, Users]

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-right"
      >
        <span className="text-white font-semibold text-[15px]">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-sky-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">{a}</div>
      </motion.div>
    </div>
  )
}

export function PlatformPageContent({ data }: { data: PlatformPageData }) {
  return (
    <main className="min-h-screen bg-[#060d1b]">
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#060d1b] via-[#0a1938] to-[#060d1b]" />
          <div
            className="absolute top-10 w-[700px] h-[500px] rounded-full blur-[160px] opacity-15"
            style={{ background: data.color, right: '5%' }}
          />
          <div
            className="absolute bottom-0 w-[400px] h-[400px] rounded-full blur-[140px] opacity-10"
            style={{ background: '#8B2CF5', left: '5%' }}
          />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        </div>

        <div className="relative z-10 section-shell">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <Link
              href="/platforms"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-8 transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
              جميع المنصات
            </Link>

            <div className="flex items-center justify-center gap-5 mb-6">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-3xl shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${data.color}30, ${data.color}10)`, border: `1px solid ${data.color}30` }}
              >
                <PlatformIcon id={data.id} size={40} style={{ color: data.color }} />
              </div>
              <div className="text-right">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                  {data.arabicName}
                </h1>
                <p className="text-xl sm:text-2xl gradient-text-brand font-bold">سيندر برو</p>
              </div>
            </div>

            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4">
              {data.tagline}
            </p>
            <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
              {data.heroDescription}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Link href="/auth/register" className="btn-primary text-lg px-10 py-4 shadow-2xl shadow-sky-500/20">
                ابدأ مجاناً
              </Link>
              <a href="#features" className="btn-secondary text-lg px-8 py-4">
                تعرّف على المميزات
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {data.stats.map((s, i) => {
              const Icon = benefitIcons[i % benefitIcons.length]
              return (
                <div key={i} className="glass-card p-4 text-center">
                  <Icon className="h-4 w-4 mx-auto mb-2" style={{ color: data.color }} />
                  <div className="stat-value text-2xl sm:text-3xl">{s.value}</div>
                  <div className="text-sm text-slate-400 mt-1">{s.label}</div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="section-shell">
          <Section>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-500/20 px-4 py-1.5 text-[12px] font-semibold text-sky-400 mb-4">
                المميزات
              </div>
              <h2 className="section-title gradient-text mb-3">مميزات {data.arabicName}</h2>
              <p className="section-desc max-w-2xl mx-auto">{data.longDescription}</p>
            </div>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.features.map((f, i) => (
              <Section key={i}>
                <div className="glass-card p-6 h-full">
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                      style={{ background: `${data.color}15` }}
                    >
                      <PlatformIcon id={data.id} size={24} style={{ color: data.color }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{f.title}</h3>
                      <p className="text-slate-400 text-sm">{f.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {f.details.map((d, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-slate-400">
                        <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: data.color }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="section-shell">
          <Section>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-1.5 text-[12px] font-semibold text-violet-400 mb-4">
                كيف يعمل
              </div>
              <h2 className="section-title gradient-text mb-3">كيف يعمل؟</h2>
              <p className="section-desc">ثلاث خطوات بسيطة لبدء التسويق الآلي على {data.arabicName}</p>
            </div>
          </Section>

          <div className="relative">
            <div className="hidden md:block absolute top-20 left-[20%] right-[20%] h-px border-t-2 border-dashed border-white/10" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.howItWorks.map((step, i) => (
                <Section key={i}>
                  <div className="glass-card p-8 text-center h-full relative">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold mb-5 mx-auto"
                      style={{ background: `linear-gradient(135deg, ${data.color}25, ${data.color}10)`, color: data.color, border: `2px solid ${data.color}30` }}
                    >
                      {i + 1}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{step.step}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </Section>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="section-shell">
          <Section>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 text-[12px] font-semibold text-amber-400 mb-4">
                حالات الاستخدام
              </div>
              <h2 className="section-title gradient-text mb-3">من يستخدم {data.arabicName} سيندر برو؟</h2>
              <p className="section-desc">حالات الاستخدام الأكثر شيوعاً</p>
            </div>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.useCases.map((uc, i) => (
              <Section key={i}>
                <div className="glass-card p-6 h-full">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: `${data.color}15` }}
                  >
                    <PlatformIcon id={data.id} size={22} style={{ color: data.color }} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{uc.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{uc.description}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="section-shell max-w-3xl">
          <Section>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-500/20 px-4 py-1.5 text-[12px] font-semibold text-sky-400 mb-4">
                أسئلة شائعة
              </div>
              <h2 className="section-title gradient-text mb-3">أسئلة شائعة عن {data.arabicName}</h2>
              <p className="section-desc">إجابات على أكثر الأسئلة شيوعاً</p>
            </div>
          </Section>

          <div className="space-y-3">
            {data.faq.map((item, i) => (
              <Section key={i}>
                <FAQItem q={item.question} a={item.answer} />
              </Section>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="section-shell">
          <Section>
            <div className="gradient-border p-10 sm:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-violet-500/5" />
              <div className="relative z-10">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl mx-auto mb-6"
                  style={{ background: `${data.color}20`, border: `1px solid ${data.color}30` }}
                >
                  <PlatformIcon id={data.id} size={32} style={{ color: data.color }} />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  جاهز تبدأ التسويق على {data.arabicName}؟
                </h2>
                <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
                  انضم لأكثر من 5,000 مسوق يستخدمون سيندر برو لأتمتة حملاتهم على {data.arabicName} و 18+ منصة أخرى.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="/auth/register" className="btn-primary text-lg px-10 py-4 shadow-2xl shadow-sky-500/20">
                    ابدأ مجاناً الآن
                  </Link>
                  <Link href="/platforms" className="btn-secondary text-lg px-8 py-4">
                    جميع المنصات
                  </Link>
                </div>
                <p className="text-sm text-slate-500 mt-4">لا تحتاج بطاقة ائتمان — فترة تجريبية مجانية</p>
              </div>
            </div>
          </Section>
        </div>
      </section>
    </main>
  )
}