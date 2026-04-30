'use client'

import { useEffect, useState } from 'react'
import { Users, Key, Monitor, CreditCard, TrendingUp, DollarSign } from 'lucide-react'

interface Stats {
  totalUsers: number
  activeUsers: number
  totalKeys: number
  availableKeys: number
  activeKeys: number
  expiredKeys: number
  activeDevices: number
  activeSubscriptions: number
  trialSubscriptions: number
  totalRevenue: number
  monthlyRevenue: number
  recentUsers: Array<{ id: number; email: string; name: string; status: string; createdAt: string }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) setStats(data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center text-slate-500 py-20">فشل تحميل البيانات</div>
  }

  const cards = [
    { label: 'إجمالي المستخدمين', value: stats.totalUsers, icon: Users, color: 'from-sky-500 to-blue-600', sub: `${stats.activeUsers} نشط` },
    { label: 'المفاتيح المتاحة', value: stats.availableKeys, icon: Key, color: 'from-emerald-500 to-green-600', sub: `${stats.activeKeys} مفعّل` },
    { label: 'الأجهزة النشطة', value: stats.activeDevices, icon: Monitor, color: 'from-violet-500 to-purple-600', sub: '' },
    { label: 'الاشتراكات النشطة', value: stats.activeSubscriptions, icon: CreditCard, color: 'from-amber-500 to-orange-600', sub: `${stats.trialSubscriptions} تجريبي` },
    { label: 'الإيرادات الإجمالية', value: `${stats.totalRevenue.toLocaleString()} ج.م`, icon: DollarSign, color: 'from-rose-500 to-pink-600', sub: '' },
    { label: 'الإيرادات الشهرية', value: `${stats.monthlyRevenue.toLocaleString()} ج.م`, icon: TrendingUp, color: 'from-indigo-500 to-indigo-600', sub: '' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">لوحة التحكم</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="admin-card">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-400">{card.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{card.value}</div>
            {card.sub && <div className="text-xs text-slate-500 mt-1">{card.sub}</div>}
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h2 className="text-lg font-bold text-white mb-4">آخر المستخدمين المسجلين</h2>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>الحالة</th>
                <th>تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="font-medium text-white">{user.name || '—'}</td>
                  <td className="text-slate-400">{user.email}</td>
                  <td>
                    <span className={user.status === 'active' ? 'admin-badge-success' : user.status === 'suspended' ? 'admin-badge-danger' : 'admin-badge-warning'}>
                      {user.status === 'active' ? 'نشط' : user.status === 'suspended' ? 'معلق' : 'محذوف'}
                    </span>
                  </td>
                  <td className="text-slate-500">{new Date(user.createdAt).toLocaleDateString('ar-EG')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}