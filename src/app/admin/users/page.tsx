'use client'

import { useEffect, useState } from 'react'
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
  const [, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadUsers = () => {
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
  }

  useEffect(() => {
    loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const updateStatus = async (userId: number, status: string) => {
    const res = await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, status })
    })
    const data = await res.json()
    if (data.success) loadUsers()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pr-10"
              onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select-field w-full sm:w-40"
          >
            <option value="">كل الحالات</option>
            <option value="active">نشط</option>
            <option value="suspended">معلق</option>
            <option value="deleted">محذوف</option>
          </select>
          <button onClick={loadUsers} className="btn-primary whitespace-nowrap">بحث</button>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
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
                  <td className="font-medium">{user.name || '—'}</td>
                  <td className="text-sm">{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-info' : 'badge-warning'}`}>
                      {user.role === 'admin' ? 'أدمن' : 'مستخدم'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.status === 'active' ? 'badge-success' : user.status === 'suspended' ? 'badge-danger' : 'badge-warning'}`}>
                      {user.status === 'active' ? 'نشط' : user.status === 'suspended' ? 'معلق' : 'محذوف'}
                    </span>
                  </td>
                  <td>{user.keysCount}</td>
                  <td>{user.devicesCount}</td>
                  <td className="text-sm">{new Date(user.createdAt).toLocaleDateString('ar-EG')}</td>
                  <td>
                    <div className="flex gap-1">
                      {user.status === 'active' && (
                        <button
                          onClick={() => updateStatus(user.id, 'suspended')}
                          className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg"
                          title="تعليق"
                        >
                          <Ban size={16} />
                        </button>
                      )}
                      {user.status === 'suspended' && (
                        <button
                          onClick={() => updateStatus(user.id, 'active')}
                          className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg"
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

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn-secondary !py-1.5 !px-3 disabled:opacity-50"
            >
              السابق
            </button>
            <span className="text-sm text-gray-500">{page} من {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="btn-secondary !py-1.5 !px-3 disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        )}
      </div>
    </div>
  )
}