'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, UserCheck, Ban } from 'lucide-react'

interface User {
  id: number
  email: string
  name: string | null
  role: string
  status: string
  emailVerifiedAt: string | null
  createdAt: string
  keysCount: number
  devicesCount: number
  subscription: Record<string, unknown> | null
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadUsers = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20', search, status: statusFilter })
    fetch(`/api/admin/users?${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsers(data.data.users)
          setTotalPages(data.data.totalPages)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page, search, statusFilter])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const updateStatus = async (userId: number, status: string) => {
    const res = await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, status })
    })
    const data = await res.json()
    if (data.success) loadUsers()
    else alert(data.error || 'فشلت العملية')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">إدارة المستخدمين</h1>

      <div className="admin-card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input pr-10"
              onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select w-full sm:w-40"
          >
            <option value="">كل الحالات</option>
            <option value="active">نشط</option>
            <option value="suspended">معلق</option>
            <option value="deleted">محذوف</option>
          </select>
          <button onClick={loadUsers} className="admin-btn-primary">بحث</button>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>البريد</th>
                  <th>الدور</th>
                  <th>الحالة</th>
                  <th>المفاتيح</th>
                  <th>الأجهزة</th>
                  <th>التسجيل</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="font-medium text-white">{user.name || '—'}</td>
                    <td className="text-slate-400">{user.email}</td>
                    <td>
                      <span className={user.role === 'admin' ? 'admin-badge-info' : 'admin-badge-warning'}>
                        {user.role === 'admin' ? 'أدمن' : 'مستخدم'}
                      </span>
                    </td>
                    <td>
                      <span className={user.status === 'active' ? 'admin-badge-success' : user.status === 'suspended' ? 'admin-badge-danger' : 'admin-badge-warning'}>
                        {user.status === 'active' ? 'نشط' : user.status === 'suspended' ? 'معلق' : 'محذوف'}
                      </span>
                    </td>
                    <td className="text-slate-300">{user.keysCount}</td>
                    <td className="text-slate-300">{user.devicesCount}</td>
                    <td className="text-slate-500">{new Date(user.createdAt).toLocaleDateString('ar-EG')}</td>
                    <td>
                      <div className="flex gap-1">
                        {user.status === 'active' && (
                          <button
                            onClick={() => updateStatus(user.id, 'suspended')}
                            className="p-1.5 text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                            title="تعليق"
                          >
                            <Ban size={16} />
                          </button>
                        )}
                        {user.status === 'suspended' && (
                          <button
                            onClick={() => updateStatus(user.id, 'active')}
                            className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                            title="تفعيل"
                          >
                            <UserCheck size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="admin-btn-secondary !py-1.5 !px-3 disabled:opacity-50"
            >
              السابق
            </button>
            <span className="text-sm text-slate-500">{page} من {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="admin-btn-secondary !py-1.5 !px-3 disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        )}
      </div>
    </div>
  )
}