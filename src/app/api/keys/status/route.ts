import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse, getErrorMessage } from '@/lib/api'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const key = url.searchParams.get('key')

    if (!key) {
      return NextResponse.json(errorResponse('مفتاح التفعيل مطلوب'), { status: 400 })
    }

    const activationKey = await prisma.activationKey.findUnique({
      where: { keyCode: key },
      include: {
        devices: { where: { isActive: true } },
        user: { select: { id: true, email: true, name: true } }
      }
    })

    if (!activationKey) {
      return NextResponse.json(errorResponse('مفتاح التفعيل غير صالح'), { status: 404 })
    }

    return NextResponse.json(successResponse({
      key: activationKey.keyCode,
      status: activationKey.status,
      plan: activationKey.plan,
      maxDevices: activationKey.maxDevices,
      activatedAt: activationKey.activatedAt,
      expiresAt: activationKey.expiresAt,
      devicesCount: activationKey.devices.length,
      user: activationKey.user
    }))
  } catch (err) {
    console.error('Key status error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}