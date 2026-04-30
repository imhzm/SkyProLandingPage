'use client'

import { platforms } from '@/data/platforms'
import { motion } from 'framer-motion'

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#060d1b] via-[#0a1020] to-[#060d1b]" />
      <div className="relative z-10 section-shell">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-500/20 px-4 py-1.5 text-[12px] font-semibold text-sky-400 mb-4">
            المنصات المدعومة
          </div>
          <h2 className="section-title">أتمت حملاتك على <span className="gradient-text">18+ منصة</span></h2>
          <p className="section-desc mt-3 max-w-2xl mx-auto">استخراج بيانات، إرسال جماعي، إدارة حسابات — كل شيء من مكان واحد</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform, i) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.04, 0.5), duration: 0.4 }}
              className="glass-card p-5 group cursor-default"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl" style={{ background: `${platform.color}18` }}>
                  {platform.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-[15px]">{platform.name}</h3>
                </div>
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: platform.color }} />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {platform.features.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center rounded-lg bg-white/5 border border-white/6 px-2.5 py-1 text-[11px] font-medium text-slate-400 group-hover:border-white/10 group-hover:text-slate-300 transition-colors"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}