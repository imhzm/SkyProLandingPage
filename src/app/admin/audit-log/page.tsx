'use client'

import { useEffect, useState } from 'react'

interface AuditLogEntry {
  id: number
  userId: number | null
  action: string
  details: Record<string, unknown> | null
  ipAddress: string | null
  createdAt: string
  user: { id: number; email: string; name: string | null } | null
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [actionFilter, setActionFilter] = useState('')

  const loadLogs = () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      limit: '25',
      action: actionFilter
    })
    fetch(`/api/admin/audit-log?${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLogs(data.data.logs)
          setTotalPages(data.data.totalPages)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const actionLabels: Record<string, string> = {
    login: 'تسجيل دخول',
    register: 'تسجيل حساب',
    register_google: 'تسجيل بـ Google',
    logout: 'تسجيل خروج',
    verify_email: 'تأكيد البريد',
    password_reset: 'إعادة تعيين كلمة المرور',
    device_verified: 'تحقق من جهاز',
    device_reset: 'إعادة تعيين جهاز',
    update_user: 'تعديل مستخدم',
    delete_user: 'حذف مستخدم',
    admin_generate_keys: 'إنشاء مفاتيح',
    admin_reset_device: 'إعادة تعيين جهاز (أدمن)',
    update_setting: 'تعديل إعدادات',
    update_subscription: 'تعديل اشتراك',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">سجل الأحداث</h1>
        <button onClick={loadLogs} className="btn-secondary text-sm">تحديث</button>
      </div>

      <div className="card mb-4">
        <div className="flex flex-wrap gap-2">
          {['', 'login', 'register', 'register_google', 'device_verified', 'device_reset', 'update_user', 'delete_user', 'admin_generate_keys', 'update_setting'].map((a) => (
            <button
              key={a}
              onClick={() => { setActionFilter(a); setPage(1); }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                actionFilter === a ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {a === '' ? 'الكل' : (actionLabels[a] || a)}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>المستخدم</th>
                  <th>الحدث</th>
                  <th>التفاصيل</th>
                  <th>IP</th>
                  <th>التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="text-sm">{log.user?.email || '—'}</td>
                    <td>
                      <span className="badge bg-gray-100 text-gray-700">
                        {actionLabels[log.action] || log.action}
                      </span>
                    </td>
                    <td className="text-sm text-gray-500 max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details).slice(0, 80) : '—'}
                    </td>
                    <td className="text-sm text-gray-400 font-mono">{log.ipAddress || '—'}</td>
                    <td className="text-sm">{new Date(log.createdAt).toLocaleString('ar-EG')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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