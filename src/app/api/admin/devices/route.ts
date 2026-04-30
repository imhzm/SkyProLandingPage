/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
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
    const userId = url.searchParams.get('userId')

    const where: any = {}
    if (userId) where.userId = parseInt(userId)

    const [devices, total] = await Promise.all([
      prisma.device.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { lastSeenAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, name: true } },
          key: { select: { keyCode: true, status: true } }
        }
      }),
      prisma.device.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        devices,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (err) {
    console.error('Devices list error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(errorResponse('غير مصرح'), { status: 403 })
    }

    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(errorResponse('معرف الجهاز مطلوب'), { status: 400 })
    }

    const device = await prisma.device.findUnique({ where: { id: parseInt(id) } })
    if (!device) {
      return NextResponse.json(errorResponse('الجهاز غير موجود'), { status: 404 })
    }

    await prisma.device.update({
      where: { id: parseInt(id) },
      data: { isActive: false, resetCount: device.resetCount + 1 }
    })

    await prisma.auditLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: 'admin_reset_device',
        details: { deviceId: id, deviceFingerprint: device.deviceFingerprint },
        ipAddress: req.headers.get('x-forwarded-for') || '0.0.0.0'
      }
    })

    return NextResponse.json({ success: true, message: 'تم إعادة تعيين الجهاز بنجاح' })
  } catch (err) {
    console.error('Reset device error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}