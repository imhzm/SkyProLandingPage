'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()

      if (data.success) {
        setSent(true)
      } else {
        setError(data.error || 'فشل إرسال الرابط')
      }
    } catch {
      setError('فشل الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-indigo-50 via-white to-purple-50 px-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold gradient-text">سيندر برو</Link>
        </div>

        <div className="card">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">تم إرسال الرابط</h2>
              <p className="text-gray-600 mb-6">
                إذا كان البريد الإلكتروني مسجلاً، ستصلك رسالة تحتوي على رابط إعادة تعيين كلمة المرور.
              </p>
              <Link href="/auth/login" className="btn-primary inline-block">
                العودة لتسجيل الدخول
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-2">نسيت كلمة المرور؟</h2>
              <p className="text-gray-500 mb-6">أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين</p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label-field">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pr-10"
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'جارٍ الإرسال...' : 'إرسال رابط إعادة التعيين'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-4">
                <Link href="/auth/login" className="text-indigo-500 hover:text-indigo-600 font-semibold inline-flex items-center gap-1">
                  <ArrowRight size={16} />
                  العودة لتسجيل الدخول
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}