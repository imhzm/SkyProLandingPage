'use client'

import { useEffect, useState } from 'react'
import { RotateCcw } from 'lucide-react'

interface Device {
  id: number
  userId: number
  keyId: number
  deviceFingerprint: string
  deviceName: string | null
  osInfo: string | null
  cpuInfo: string | null
  ramInfo: string | null
  isActive: boolean
  resetCount: number
  maxResetsPerYear: number
  firstSeenAt: string
  lastSeenAt: string
  user: { id: number; email: string; name: string | null }
  key: { keyCode: string; status: string }
}

export default function AdminDevicesPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadDevices = () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    fetch(`/api/admin/devices?${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDevices(data.data.devices)
          setTotalPages(data.data.totalPages)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadDevices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const resetDevice = async (deviceId: number) => {
    if (!confirm('هل أنت متأكد من إعادة تعيين هذا الجهاز؟')) return
    try {
      const res = await fetch(`/api/admin/devices?id=${deviceId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) loadDevices()
    } catch {
      console.error('Reset failed')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">إدارة الأجهزة</h1>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>المستخدم</th>
                <th>المفتاح</th>
                <th>اسم الجهاز</th>
                <th>نظام التشغيل</th>
                <th>المعالج</th>
                <th>الرام</th>
                <th>الحالة</th>
                <th>إعادة التعيين</th>
                <th>آخر نشاط</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id}>
                  <td className="font-medium">{device.user?.name || device.user?.email || '—'}</td>
                  <td className="text-sm font-mono">{device.key?.keyCode || '—'}</td>
                  <td>{device.deviceName || '—'}</td>
                  <td className="text-sm">{device.osInfo || '—'}</td>
                  <td className="text-sm">{device.cpuInfo || '—'}</td>
                  <td>{device.ramInfo || '—'}</td>
                  <td>
                    <span className={`badge ${device.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {device.isActive ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td className="text-sm">{device.resetCount}/{device.maxResetsPerYear}</td>
                  <td className="text-sm">{new Date(device.lastSeenAt).toLocaleDateString('ar-EG')}</td>
                  <td>
                    {device.isActive && (
                      <button
                        onClick={() => resetDevice(device.id)}
                        className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg"
                        title="إعادة تعيين الجهاز"
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}
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