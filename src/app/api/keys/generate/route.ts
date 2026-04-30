import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateApiKey } from '@/lib/utils'
import { successResponse, errorResponse, getErrorMessage } from '@/lib/api'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(errorResponse('غير مصرح'), { status: 403 })
    }

    const body = await req.json()
    const { count = 1, plan = 'pro', durationDays = 365, maxDevices = 1 } = body

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
          status: 'available'
        }
      })
      keys.push(key)
    }

    await prisma.auditLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: 'generate_keys',
        details: { count, plan },
        ipAddress: req.headers.get('x-forwarded-for') || '0.0.0.0'
      }
    })

    return NextResponse.json(successResponse({ keys }, `تم إنشاء ${count} مفتاح بنجاح`))
  } catch (err) {
    console.error('Generate keys error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}