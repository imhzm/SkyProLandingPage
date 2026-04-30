'use client'

import { useEffect, useState } from 'react'
import { Plus, Copy, Check } from 'lucide-react'

interface ActivationKey {
  id: number
  keyCode: string
  status: string
  plan: string
  durationDays: number
  maxDevices: number
  activatedAt: string | null
  expiresAt: string | null
  createdAt: string
  user: { id: number; email: string; name: string | null } | null
  devicesCount: number
}

export default function AdminKeysPage() {
  const [keys, setKeys] = useState<ActivationKey[]>([])
  const [, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showGenerate, setShowGenerate] = useState(false)
  const [generateCount, setGenerateCount] = useState(1)
  const [generateMaxDevices, setGenerateMaxDevices] = useState(1)
  const [copied, setCopied] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  const loadKeys = () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20', status: statusFilter })
    fetch(`/api/admin/keys?${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setKeys(data.data.keys)
          setTotalPages(data.data.totalPages)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadKeys()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/admin/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: generateCount, maxDevices: generateMaxDevices })
      })
      const data = await res.json()
      if (data.success) {
        setShowGenerate(false)
        loadKeys()
      }
    } catch {
      console.error('Generate failed')
    } finally {
      setGenerating(false)
    }
  }

  const copyKey = (keyCode: string) => {
    navigator.clipboard.writeText(keyCode)
    setCopied(keyCode)
    setTimeout(() => setCopied(null), 2000)
  }

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      available: 'متاح',
      assigned: 'مخصص',
      active: 'مفعّل',
      expired: 'منتهي',
      revoked: 'ملغى'
    }
    return map[status] || status
  }

  const statusClass = (status: string) => {
    const map: Record<string, string> = {
      available: 'badge-info',
      assigned: 'badge-warning',
      active: 'badge-success',
      expired: 'badge-danger',
      revoked: 'badge-danger'
    }
    return map[status] || 'badge'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">إدارة المفاتيح</h1>
        <button onClick={() => setShowGenerate(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus size={18} />
          إنشاء مفاتيح
        </button>
      </div>

      {showGenerate && (
        <div className="card mb-6 border-2 border-indigo-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">إنشاء مفاتيح جديدة</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label-field">عدد المفاتيح</label>
              <input
                type="number"
                min="1"
                max="100"
                value={generateCount}
                onChange={(e) => setGenerateCount(parseInt(e.target.value) || 1)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">الحد الأقصى للأجهزة لكل مفتاح</label>
              <input
                type="number"
                min="1"
                max="10"
                value={generateMaxDevices}
                onChange={(e) => setGenerateMaxDevices(parseInt(e.target.value) || 1)}
                className="input-field"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleGenerate} disabled={generating} className="btn-success">
              {generating ? 'جارٍ الإنشاء...' : 'إنشاء'}
            </button>
            <button onClick={() => setShowGenerate(false)} className="btn-secondary">إلغاء</button>
          </div>
        </div>
      )}

      <div className="card mb-4">
        <div className="flex gap-2 mb-4">
          {['', 'available', 'active', 'expired', 'revoked'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${statusFilter === s ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {s === '' ? 'الكل' : statusLabel(s)}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>المفتاح</th>
                <th>الحالة</th>
                <th>الخطة</th>
                <th>الأجهزة</th>
                <th>المستخدم</th>
                <th>الانتهاء</th>
                <th>إنشاء</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key.id}>
                  <td>
                    <div className="flex items-center gap-1">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{key.keyCode}</code>
                      <button onClick={() => copyKey(key.keyCode)} className="p-1 text-gray-400 hover:text-indigo-500">
                        {copied === key.keyCode ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </td>
                  <td><span className={statusClass(key.status)}>{statusLabel(key.status)}</span></td>
                  <td className="font-medium">{key.plan}</td>
                  <td>{key.devicesCount}/{key.maxDevices}</td>
                  <td className="text-sm">{key.user?.email || '—'}</td>
                  <td className="text-sm">{key.expiresAt ? new Date(key.expiresAt).toLocaleDateString('ar-EG') : '—'}</td>
                  <td className="text-sm">{new Date(key.createdAt).toLocaleDateString('ar-EG')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="btn-secondary !py-1.5 !px-3 disabled:opacity-50">السابق</button>
            <span className="text-sm text-gray-500">{page} من {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="btn-secondary !py-1.5 !px-3 disabled:opacity-50">التالي</button>
          </div>
        )}
      </div>
    </div>
  )
}