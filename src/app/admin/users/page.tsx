'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, UserCheck, Ban, Plus, Check, Copy, Mail } from 'lucide-react'

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

interface NewUser {
  email: string
  name: string
  sendEmail: boolean
  emailSent?: boolean
  emailError?: string
  password?: string
  serial?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [showAdd, setShowAdd] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [sendEmail, setSendEmail] = useState(true)
  const [creating, setCreating] = useState(false)
  const [createdUser, setCreatedUser] = useState<NewUser | null>(null)
  const [copied, setCopied] = useState('')

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

  const handleCreate = async () => {
    if (!newEmail.trim()) return
    setCreating(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail.trim(), name: newName.trim(), sendEmail })
      })
      const data = await res.json()
      if (data.success) {
        setCreatedUser({
          email: data.data.user.email,
          name: data.data.user.name || '',
          password: data.data.password,
          serial: data.data.serial,
          sendEmail,
          emailSent: data.data.emailSent,
          emailError: data.data.emailError
        })
        setNewEmail('')
        setNewName('')
        loadUsers()
      } else {
        alert(data.error || 'فشل إنشاء المستخدم')
      }
    } catch {
      alert('فشل الاتصال بالخادم')
    } finally {
      setCreating(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">إدارة المستخدمين</h1>
        <button onClick={() => { setShowAdd(!showAdd); setCreatedUser(null) }} className="admin-btn-primary">
          <Plus size={18} />
          {showAdd ? 'إلغاء' : 'إضافة مستخدم'}
        </button>
      </div>

      {showAdd && (
        <div className="admin-card mb-6 !border-sky-500/30 !border">
          <h3 className="text-lg font-bold text-white mb-4">إضافة مستخدم جديد</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="admin-label">البريد الإلكتروني *</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="admin-input"
                placeholder="user@example.com"
                dir="ltr"
              />
            </div>
            <div>
              <label className="admin-label">الاسم (اختياري)</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="admin-input"
                placeholder="اسم المستخدم"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="sendEmail"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="sendEmail" className="text-sm text-slate-300 cursor-pointer">
              <Mail size={14} className="inline ml-1" />
              إرسال بيانات التفعيل عبر الإيميل
            </label>
          </div>
          <button
            onClick={handleCreate}
            disabled={creating || !newEmail.trim()}
            className="admin-btn-success disabled:opacity-50"
          >
            {creating ? 'جارٍ الإنشاء...' : 'إنشاء مستخدم وسيريال'}
          </button>

          {createdUser && (
            <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <h4 className="text-emerald-400 font-bold mb-2">تم الإنشاء بنجاح!</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">البريد:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-white" dir="ltr">{createdUser.email}</code>
                    <button onClick={() => copyToClipboard(createdUser.email, 'email')}>
                      {copied === 'email' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                {createdUser.password && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">كلمة المرور:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-white font-mono" dir="ltr">{createdUser.password}</code>
                      <button onClick={() => copyToClipboard(createdUser.password!, 'pass')}>
                        {copied === 'pass' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                )}
                {createdUser.serial && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">السيريال:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-white font-mono" dir="ltr">{createdUser.serial}</code>
                      <button onClick={() => copyToClipboard(createdUser.serial!, 'serial')}>
                        {copied === 'serial' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                )}
                {createdUser.sendEmail && createdUser.emailSent && (
                  <p className="text-emerald-400 text-xs">تم إرسال الإيميل بنجاح ✓</p>
                )}
                {createdUser.sendEmail && createdUser.emailSent === false && (
                  <p className="text-amber-400 text-xs">
                    تم إنشاء الحساب لكن فشل إرسال الإيميل. استخدم البيانات المعروضة أو راجع إعدادات SMTP.
                    {createdUser.emailError ? ` (${createdUser.emailError})` : ''}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

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
