'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'
import { PlatformIcon } from '@/components/marketing/PlatformIcon'
import type { PlatformPageData } from '@/data/platform-pages'

export function PlatformsListContent({ pages }: { pages: PlatformPageData[] }) {
  return (
    <main className="min-h-screen bg-[#060d1b]">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#060d1b] via-[#0a1938] to-[#060d1b]" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative z-10 section-shell">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-8 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              الرئيسية
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-500/20 px-4 py-1.5 text-[12px] font-semibold text-sky-400 mb-6">
              18+ منصة مدعومة
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              سوّق على <span className="gradient-text-brand">كل المنصات</span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl text-slate-400">من مكان واحد</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              استكشف كل منصة مدعومة بالتفصيل — ادوات، مميزات، كيف يعمل، وأسئلة شائعة لكل منصة.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pages.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.4 }}
              >
                <Link
                  href={`/platforms/${p.id}`}
                  className="glass-card p-6 group block"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl shrink-0"
                      style={{ background: `${p.color}15` }}
                    >
                      <PlatformIcon id={p.id} size={26} style={{ color: p.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white">{p.arabicName}</h3>
                      <p className="text-sm text-slate-500 line-clamp-1">{p.tagline}</p>
                    </div>
                    <ArrowLeft className="h-4 w-4 text-slate-600 group-hover:text-sky-400 transition-all group-hover:-translate-x-1 rotate-180 shrink-0" />
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.features.slice(0, 3).map((f) => (
                      <span key={f.title} className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/8 px-2.5 py-1 text-[11px] font-medium text-slate-400">
                        <Check className="h-2.5 w-2.5" style={{ color: p.color }} />
                        {f.title}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {p.stats.slice(0, 2).map((s, si) => (
                      <div key={si} className="text-center bg-white/[0.03] rounded-lg py-2">
                        <div className="text-sm font-bold" style={{ color: p.color }}>{s.value}</div>
                        <div className="text-[10px] text-slate-500">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sky-400 text-sm font-medium group-hover:gap-3 transition-all">
                    <span>اكتشف المنصة</span>
                    <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link href="/auth/register" className="btn-primary text-lg px-10 py-4 shadow-2xl shadow-sky-500/20">
              جرّب كل المنصات مجاناً
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}