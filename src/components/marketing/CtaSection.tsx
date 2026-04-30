'use client'

import Link from 'next/link'

export function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-bl from-indigo-600 to-purple-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          ابدأ تسويقك الآلي اليوم
        </h2>
        <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
          جرّب سيندر برو مجاناً ليومين. بدون بطاقة ائتمانية. بدون التزامات.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/register" className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors shadow-lg text-lg">
            جرّب مجاناً — يومين
          </Link>
          <a href="#pricing" className="text-white border-2 border-white/40 hover:border-white py-3 px-8 rounded-lg font-semibold transition-colors text-lg">
            عرض الأسعار
          </a>
        </div>
      </div>
    </section>
  )
}