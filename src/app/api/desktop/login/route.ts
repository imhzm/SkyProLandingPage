import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { errorResponse, getErrorMessage, successResponse } from '@/lib/api'
import { generateSessionId, isKeyExpired, verifyPassword } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const desktopLoginSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
  serial: z.string().min(1, 'السيريال مطلوب'),
  deviceFingerprint: z.string().min(1, 'بصمة الجهاز مطلوبة'),
  deviceInfo: z.object({
    hostname: z.string().optional(),
    platform: z.string().optional(),
    arch: z.string().optional(),
    cpu: z.string().optional(),
    cpuCores: z.number().optional(),
    ram: z.string().optional(),
    gpu: z.string().optional(),
    screenResolution: z.string().optional()
  }).optional()
})

export async function POST(req: NextRequest) {
  try {
    const parsed = desktopLoginSchema.safeParse(await req.json())
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message).join(', ')
      return NextResponse.json(errorResponse(errors), { status: 400 })
    }

    const { email, password, serial, deviceFingerprint, deviceInfo } = parsed.data
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '0.0.0.0'

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(errorResponse('بيانات تسجيل الدخول غير صحيحة'), { status: 401 })
    }

    if (user.status !== 'active') {
      return NextResponse.json(errorResponse('الحساب غير نشط. تواصل مع الدعم الفني'), { status: 403 })
    }

    const activationKey = await prisma.activationKey.findUnique({
      where: { keyCode: serial },
      include: { devices: true }
    })

    if (!activationKey) {
      return NextResponse.json(errorResponse('السيريال غير صحيح'), { status: 404 })
    }

    if (activationKey.userId && activationKey.userId !== user.id) {
      return NextResponse.json(errorResponse('السيريال غير مرتبط بهذا الحساب'), { status: 403 })
    }

    if (activationKey.status === 'revoked') {
      return NextResponse.json(errorResponse('تم إلغاء هذا السيريال'), { status: 403 })
    }

    if (activationKey.status === 'expired' || isKeyExpired(activationKey.expiresAt)) {
      return NextResponse.json(errorResponse('انتهت صلاحية هذا السيريال'), { status: 403 })
    }

    const activeDevices = activationKey.devices.filter((device) => device.isActive)
    const existingDevice = activeDevices.find((device) => device.deviceFingerprint === deviceFingerprint)

    let deviceId = existingDevice?.id
    await prisma.$transaction(async (tx) => {
      if (!activationKey.userId) {
        await tx.activationKey.update({
          where: { id: activationKey.id },
          data: {
            userId: user.id,
            status: 'active',
            activatedAt: activationKey.activatedAt || new Date()
          }
        })
      }

      if (existingDevice) {
        await tx.device.update({
          where: { id: existingDevice.id },
          data: { lastSeenAt: new Date() }
        })
      } else {
        if (activeDevices.length >= activationKey.maxDevices) {
          throw new Error(`DEVICE_LIMIT:${activationKey.maxDevices}`)
        }

        const device = await tx.device.create({
          data: {
            userId: user.id,
            keyId: activationKey.id,
            deviceFingerprint,
            deviceName: deviceInfo?.hostname,
            osInfo: deviceInfo?.platform ? `${deviceInfo.platform} ${deviceInfo.arch || ''}`.trim() : undefined,
            cpuInfo: deviceInfo?.cpu,
            ramInfo: deviceInfo?.ram,
            gpuInfo: deviceInfo?.gpu,
            screenResolution: deviceInfo?.screenResolution
          }
        })
        deviceId = device.id
      }

      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'desktop_login',
          details: { keyCode: activationKey.keyCode, deviceFingerprint, deviceId },
          ipAddress
        }
      })
    })

    const sessionId = generateSessionId()
    await prisma.nextAuthSession.create({
      data: {
        sessionToken: sessionId,
        userId: user.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    })

    return NextResponse.json(successResponse({
      token: sessionId,
      email: user.email,
      role: user.role === 'admin' ? 'admin' : 'customer',
      key: activationKey.keyCode,
      status: 'active',
      expiryDate: activationKey.expiresAt?.toISOString() || '',
      deviceId: String(deviceId || deviceFingerprint)
    }, 'تم تسجيل الدخول بنجاح'))
  } catch (err) {
    const message = err instanceof Error ? err.message : ''
    if (message.startsWith('DEVICE_LIMIT:')) {
      const limit = message.split(':')[1]
      return NextResponse.json(errorResponse(`تم تجاوز الحد الأقصى للأجهزة (${limit}). أعد تعيين جهاز أولا`), { status: 403 })
    }

    console.error('Desktop login error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}
