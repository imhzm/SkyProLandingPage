'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Key,
  Monitor,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/admin/users', label: 'المستخدمين', icon: Users },
  { href: '/admin/keys', label: 'المفاتيح', icon: Key },
  { href: '/admin/devices', label: 'الأجهزة', icon: Monitor },
  { href: '/admin/subscriptions', label: 'الاشتراكات', icon: CreditCard },
  { href: '/admin/audit-log', label: 'سجل الأحداث', icon: FileText },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <Link href="/admin" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <span className="text-2xl font-bold gradient-text">سيندر برو</span>
        </Link>
        {!collapsed && <p className="text-xs text-gray-400 mt-1">لوحة التحكم الإدارية</p>}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-500/20 text-indigo-400 font-semibold'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={20} />
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded-lg shadow-lg"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 h-screen bg-gray-900 z-40 transition-all duration-300
        ${collapsed ? 'w-16' : 'w-64'}
        ${mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        lg:translate-x-0
      `}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute top-1/2 -left-3 w-6 h-6 bg-gray-700 rounded-full items-center justify-center text-white hover:bg-gray-600"
        >
          <ChevronLeft size={14} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      {/* Main content offset */}
      <div className={`transition-all duration-300 ${collapsed ? 'lg:mr-16' : 'lg:mr-64'}`} />
    </>
  )
}