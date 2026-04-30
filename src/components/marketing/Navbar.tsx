'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold gradient-text">سيندر برو</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-indigo-500 transition-colors text-sm font-medium">المميزات</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-indigo-500 transition-colors text-sm font-medium">كيف يعمل</a>
            <a href="#pricing" className="text-gray-600 hover:text-indigo-500 transition-colors text-sm font-medium">الأسعار</a>
            <a href="#faq" className="text-gray-600 hover:text-indigo-500 transition-colors text-sm font-medium">الأسئلة الشائعة</a>
            <Link href="/auth/login" className="text-indigo-500 hover:text-indigo-600 font-semibold text-sm transition-colors">تسجيل الدخول</Link>
            <Link href="/auth/register" className="btn-primary text-sm !py-2 !px-4">جرّب مجاناً</Link>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-3">
            <a href="#features" onClick={() => setOpen(false)} className="block text-gray-600 hover:text-indigo-500 font-medium">المميزات</a>
            <a href="#how-it-works" onClick={() => setOpen(false)} className="block text-gray-600 hover:text-indigo-500 font-medium">كيف يعمل</a>
            <a href="#pricing" onClick={() => setOpen(false)} className="block text-gray-600 hover:text-indigo-500 font-medium">الأسعار</a>
            <a href="#faq" onClick={() => setOpen(false)} className="block text-gray-600 hover:text-indigo-500 font-medium">الأسئلة الشائعة</a>
            <Link href="/auth/login" className="block text-indigo-500 font-semibold">تسجيل الدخول</Link>
            <Link href="/auth/register" className="block btn-primary text-center">جرّب مجاناً</Link>
          </div>
        </div>
      )}
    </nav>
  )
}