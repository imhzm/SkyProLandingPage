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

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, name: true } },
          key: { select: { keyCode: true, status: true } }
        }
      }),
      prisma.subscription.count()
    ])

    return NextResponse.json({
      success: true,
      data: {
        subscriptions,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (err) {
    console.error('Subscriptions list error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(errorResponse('غير مصرح'), { status: 403 })
    }

    const body = await req.json()
    const { id, status, expiresAt, autoRenew } = body

    if (!id) {
      return NextResponse.json(errorResponse('معرف الاشتراك مطلوب'), { status: 400 })
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (expiresAt) updateData.expiresAt = new Date(expiresAt)
    if (autoRenew !== undefined) updateData.autoRenew = autoRenew

    await prisma.subscription.update({
      where: { id: parseInt(id) },
      data: updateData
    })

    await prisma.auditLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: 'update_subscription',
        details: { subscriptionId: id, updates: updateData },
        ipAddress: req.headers.get('x-forwarded-for') || '0.0.0.0'
      }
    })

    return NextResponse.json({ success: true, message: 'تم تحديث الاشتراك بنجاح' })
  } catch (err) {
    console.error('Update subscription error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}