import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { errorResponse, getErrorMessage } from '@/lib/api'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(errorResponse('غير مصرح'), { status: 403 })
    }

    const [
      totalUsers,
      activeUsers,
      totalKeys,
      availableKeys,
      activeKeys,
      expiredKeys,
      activeDevices,
      totalSubscriptions,
      activeSubscriptions,
      trialSubscriptions,
      recentUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'active' } }),
      prisma.activationKey.count(),
      prisma.activationKey.count({ where: { status: 'available' } }),
      prisma.activationKey.count({ where: { status: 'active' } }),
      prisma.activationKey.count({ where: { status: 'expired' } }),
      prisma.device.count({ where: { isActive: true } }),
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.subscription.count({ where: { status: 'trial' } }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, name: true, status: true, createdAt: true }
      })
    ])

    const totalRevenue = activeKeys * 2000
    const monthlyRevenue = Math.round(totalRevenue / 12)

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalKeys,
        availableKeys,
        activeKeys,
        expiredKeys,
        activeDevices,
        totalSubscriptions,
        activeSubscriptions,
        trialSubscriptions,
        totalRevenue,
        monthlyRevenue,
        recentUsers
      }
    })
  } catch (err) {
    console.error('Stats error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}