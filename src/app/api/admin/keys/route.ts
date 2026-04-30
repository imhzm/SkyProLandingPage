/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateApiKey } from '@/lib/utils'
import { errorResponse, getErrorMessage } from '@/lib/api'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(errorResponse('غير مصرح'), { status: 403 })
    }

    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const status = url.searchParams.get('status') || ''

    const where: any = {}
    if (status) where.status = status

    const [keys, total] = await Promise.all([
      prisma.activationKey.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, name: true } },
          _count: { select: { devices: true } }
        }
      }),
      prisma.activationKey.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        keys: keys.map(k => ({
          id: k.id,
          keyCode: k.keyCode,
          status: k.status,
          plan: k.plan,
          durationDays: k.durationDays,
          maxDevices: k.maxDevices,
          activatedAt: k.activatedAt,
          expiresAt: k.expiresAt,
          createdAt: k.createdAt,
          user: k.user,
          devicesCount: k._count.devices
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (err) {
    console.error('Keys list error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(errorResponse('غير مصرح'), { status: 403 })
    }

    const body = await req.json()
    const { count = 1, plan = 'pro', durationDays = 365, maxDevices = 1, userId } = body

    if (count < 1 || count > 100) {
      return NextResponse.json(errorResponse('العدد يجب أن يكون بين 1 و 100'), { status: 400 })
    }

    const keys = []
    for (let i = 0; i < count; i++) {
      const keyCode = generateApiKey()
      const key = await prisma.activationKey.create({
        data: {
          keyCode,
          plan,
          durationDays,
          maxDevices,
          userId: userId || null,
          status: userId ? 'assigned' : 'available'
        }
      })
      keys.push(key)
    }

    await prisma.auditLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: 'admin_generate_keys',
        details: { count, plan, userId },
        ipAddress: req.headers.get('x-forwarded-for') || '0.0.0.0'
      }
    })

    return NextResponse.json({
      success: true,
      data: { keys },
      message: `تم إنشاء ${count} مفتاح بنجاح`
    })
  } catch (err) {
    console.error('Admin generate keys error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}