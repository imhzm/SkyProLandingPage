'use client'

import { useEffect, useState } from 'react'

interface Subscription {
  id: number
  userId: number
  keyId: number
  status: string
  trialEndsAt: string | null
  startedAt: string | null
  expiresAt: string | null
  autoRenew: boolean
  amount: number | null
  currency: string
  createdAt: string
  user: { id: number; email: string; name: string | null }
  key: { keyCode: string; status: string }
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadSubscriptions = () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    fetch(`/api/admin/subscriptions?${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSubscriptions(data.data.subscriptions)
          setTotalPages(data.data.totalPages)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadSubscriptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const updateSubscription = async (id: number, status: string) => {
    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      const data = await res.json()
      if (data.success) loadSubscriptions()
    } catch {
      console.error('Update failed')
    }
  }

  const statusLabel = (status: string) => {
    const map: Record<string, string> = { trial: 'تجريبي', active: 'نشط', expired: 'منتهي', cancelled: 'ملغى' }
    return map[status] || status
  }

  const statusClass = (status: string) => {
    const map: Record<string, string> = { trial: 'badge-warning', active: 'badge-success', expired: 'badge-danger', cancelled: 'badge-danger' }
    return map[status] || 'badge'
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">إدارة الاشتراكات</h1>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>المستخدم</th>
                <th>المفتاح</th>
                <th>الحالة</th>
                <th>نوع الاشتراك</th>
                <th>بداية التجربة</th>
                <th>تاريخ الانتهاء</th>
                <th>المبلغ</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td className="font-medium">{sub.user?.name || sub.user?.email}</td>
                  <td className="text-sm font-mono">{sub.key?.keyCode || '—'}</td>
                  <td><span className={statusClass(sub.status)}>{statusLabel(sub.status)}</span></td>
                  <td>{sub.trialEndsAt ? 'تجريبي' : 'مدفوع'}</td>
                  <td className="text-sm">{sub.startedAt ? new Date(sub.startedAt).toLocaleDateString('ar-EG') : '—'}</td>
                  <td className="text-sm">{sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString('ar-EG') : '—'}</td>
                  <td>{sub.amount ? `${sub.amount} ${sub.currency}` : '—'}</td>
                  <td>
                    <div className="flex gap-1">
                      {sub.status === 'trial' && (
                        <button
                          onClick={() => updateSubscription(sub.id, 'active')}
                          className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded hover:bg-emerald-100"
                        >
                          تفعيل
                        </button>
                      )}
                      {sub.status === 'active' && (
                        <button
                          onClick={() => updateSubscription(sub.id, 'expired')}
                          className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100"
                        >
                          إنهاء
                        </button>
                      )}
                    </div>
                  </td>
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