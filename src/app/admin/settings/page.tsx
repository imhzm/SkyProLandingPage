'use client'

import { useEffect, useState, useCallback } from 'react'
import { Save } from 'lucide-react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const defaultSettings: Record<string, string> = {
    trial_days: '2',
    max_devices: '1',
    max_resets_per_year: '2',
    key_price: '2000',
    key_currency: 'EGP',
    key_duration_days: '365',
  }

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      if (data.success) {
        setSettings({ ...defaultSettings, ...data.data })
      }
    } catch {
      setSettings(defaultSettings)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { loadSettings() }, [loadSettings])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      for (const [key, value] of Object.entries(settings)) {
        await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value })
        })
      }
      setMessage('تم حفظ الإعدادات بنجاح')
    } catch {
      setMessage('فشل حفظ الإعدادات')
    } finally {
      setSaving(false)
    }
  }

  const fields = [
    { key: 'trial_days', label: 'فترة التجربة (أيام)', type: 'number' },
    { key: 'max_devices', label: 'الحد الأقصى للأجهزة لكل مفتاح', type: 'number' },
    { key: 'max_resets_per_year', label: 'الحد الأقصى لإعادة التعيين (سنوياً)', type: 'number' },
    { key: 'key_price', label: 'سعر المفتاح', type: 'number' },
    { key: 'key_currency', label: 'العملة', type: 'text' },
    { key: 'key_duration_days', label: 'مدة المفتاح (أيام)', type: 'number' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">إعدادات النظام</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary inline-flex items-center gap-2">
          <Save size={18} />
          {saving ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${message.includes('بنجاح') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="label-field">{field.label}</label>
              <input
                type={field.type}
                value={settings[field.key] || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, [field.key]: e.target.value }))}
                className="input-field"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}