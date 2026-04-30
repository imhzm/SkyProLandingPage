'use client'

import { platforms } from '@/data/platforms'
import { motion } from 'framer-motion'

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">منصات مدعومة</h2>
          <p className="section-desc mt-2">أتمت حملاتك التسويقية على أكثر من 18 منصة تواصل اجتماعي</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform, i) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.05, 0.5) }}
              className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{platform.icon}</span>
                <h3 className="text-lg font-bold text-gray-900">{platform.name}</h3>
                <span
                  className="w-3 h-3 rounded-full mr-auto"
                  style={{ backgroundColor: platform.color }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {platform.features.map((f) => (
                  <span
                    key={f}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"
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