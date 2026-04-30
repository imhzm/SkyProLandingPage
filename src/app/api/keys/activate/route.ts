/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse, getErrorMessage } from '@/lib/api'
import { isKeyExpired, getActivationExpiry } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { key, userId } = await req.json()

    if (!key) {
      return NextResponse.json(errorResponse('مفتاح التفعيل مطلوب'), { status: 400 })
    }

    const activationKey = await prisma.activationKey.findUnique({
      where: { keyCode: key },
      include: { devices: true }
    })

    if (!activationKey) {
      return NextResponse.json(errorResponse('مفتاح التفعيل غير صالح'), { status: 404 })
    }

    if (activationKey.status === 'revoked') {
      return NextResponse.json(errorResponse('تم إلغاء هذا المفتاح'), { status: 403 })
    }

    if (activationKey.status === 'expired' || isKeyExpired(activationKey.expiresAt)) {
      return NextResponse.json(errorResponse('انتهت صلاحية هذا المفتاح'), { status: 403 })
    }

    if (activationKey.status === 'active' && activationKey.userId && activationKey.userId !== userId) {
      return NextResponse.json(errorResponse('هذا المفتاح مخصص لمستخدم آخر'), { status: 403 })
    }

    const expiresAt = activationKey.expiresAt || getActivationExpiry()

    const updateData: any = {
      status: 'active',
      activatedAt: new Date(),
      expiresAt
    }

    if (userId) {
      updateData.userId = userId
    }

    await prisma.activationKey.update({
      where: { id: activationKey.id },
      data: updateData
    })

    if (userId) {
      await prisma.subscription.upsert({
        where: { id: activationKey.id },
        create: {
          userId,
          keyId: activationKey.id,
          status: 'active',
          startedAt: new Date(),
          expiresAt,
          amount: 2000,
          currency: 'EGP'
        },
        update: {
          status: 'active',
          startedAt: new Date(),
          expiresAt
        }
      })
    }

    return NextResponse.json(successResponse({
      key: activationKey.keyCode,
      status: 'active',
      expiresAt,
      maxDevices: activationKey.maxDevices
    }, 'تم تفعيل المفتاح بنجاح'))
  } catch (err) {
    console.error('Activate key error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}