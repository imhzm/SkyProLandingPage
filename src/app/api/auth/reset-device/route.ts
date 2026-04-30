import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { resetDeviceSchema } from '@/lib/validations'
import { successResponse, errorResponse, getErrorMessage } from '@/lib/api'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = resetDeviceSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message).join(', ')
      return NextResponse.json(errorResponse(errors), { status: 400 })
    }

    const { key, deviceFingerprint } = parsed.data

    const activationKey = await prisma.activationKey.findUnique({
      where: { keyCode: key },
      include: { devices: true }
    })

    if (!activationKey) {
      return NextResponse.json(errorResponse('مفتاح التفعيل غير صالح'), { status: 404 })
    }

    const device = activationKey.devices.find(
      (d) => d.deviceFingerprint === deviceFingerprint && d.isActive
    )

    if (!device) {
      return NextResponse.json(errorResponse('الجهاز غير مسجل'), { status: 404 })
    }

    if (device.resetCount >= device.maxResetsPerYear) {
      return NextResponse.json(errorResponse(
        `تم تجاوز الحد الأقصى لإعادة التعيين (${device.maxResetsPerYear} مرات/سنة)`
      ), { status: 403 })
    }

    await prisma.device.update({
      where: { id: device.id },
      data: {
        isActive: false,
        resetCount: device.resetCount + 1
      }
    })

    if (activationKey.userId) {
      await prisma.auditLog.create({
        data: {
          userId: activationKey.userId,
          action: 'device_reset',
          details: { deviceFingerprint, previousDeviceId: device.id },
          ipAddress: req.headers.get('x-forwarded-for') || '0.0.0.0'
        }
      })
    }

    return NextResponse.json(successResponse(null, 'تم إعادة تعيين الجهاز بنجاح. سجّل الدخول مرة أخرى'))
  } catch (err) {
    console.error('Reset device error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}