'use client'

import { platforms } from '@/data/platforms'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowDown } from 'lucide-react'
import { PlatformIcon } from '@/components/marketing/PlatformIcon'

const stats = [
  { value: '18+', label: 'منصة مدعومة' },
  { value: '10K+', label: 'مستخدم نشط' },
  { value: '50M+', label: 'رسالة مرسلة' },
  { value: '99.9%', label: 'وقت التشغيل' },
]

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#060d1b] via-[#0a1938] to-[#060d1b]" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-600/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
      </div>

      <div className="relative z-10 section-shell w-full pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-500/20 px-4 py-1.5 text-[12px] font-semibold text-sky-400 mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
            </span>
            منتج من Sky Wave — أقوى أداة تسويق آلي
          </div>

          <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-white">أتمت تسويقك على</span>
            <br />
            <span className="gradient-text-brand">18+ منصة</span>
            <br />
            <span className="text-white">بضغطة واحدة</span>
          </h1>

          <p className={`text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            استخرج بيانات العملاء، أرسل رسائل جماعية، وأدر حسابات متعددة — كل ذلك من تطبيق واحد احترافي.
          </p>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link href="/auth/register" className="btn-primary text-base px-8 py-3.5 shadow-2xl shadow-sky-500/25">
              جرّب مجاناً — يومين
            </Link>
            <a href="#features" className="btn-secondary text-base px-8 py-3.5">
              اكتشف المميزات
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>

          <div className={`flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto mb-16 transition-all duration-700 delay-[400ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {platforms.slice(0, 10).map((p) => (
              <span key={p.id} className="tag">
                <PlatformIcon id={p.id} size={14} />
                {p.name}
              </span>
            ))}
            <span className="inline-flex items-center rounded-full bg-sky-500/10 border border-sky-500/20 px-3 py-1 text-[11px] font-semibold text-sky-400">
              +8 منصات أخرى
            </span>
          </div>

          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto transition-all duration-700 delay-[500ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center glass-card p-4 rounded-2xl">
                <div className="stat-value">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060d1b] to-transparent" />
    </section>
  )
}