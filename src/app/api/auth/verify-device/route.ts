import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyDeviceSchema } from '@/lib/validations'
import { successResponse, errorResponse, getErrorMessage } from '@/lib/api'
import { isKeyExpired, getActivationExpiry } from '@/lib/utils'

const ACCOUNT_SUSPENDED_MESSAGE = 'تم حظر حسابك من SkyPro. تم إيقاف الدخول إلى البرنامج، يرجى مراجعة بريدك الإلكتروني أو التواصل مع الدعم.'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = verifyDeviceSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message).join(', ')
      return NextResponse.json(errorResponse(errors), { status: 400 })
    }

    const { key, deviceFingerprint, deviceInfo } = parsed.data

    const activationKey = await prisma.activationKey.findUnique({
      where: { keyCode: key },
      include: {
        devices: true,
        user: { select: { id: true, status: true } }
      }
    })

    if (!activationKey) {
      return NextResponse.json(errorResponse('مفتاح التفعيل غير صالح'), { status: 404 })
    }

    if (activationKey.user?.status === 'suspended' || activationKey.status === 'suspended') {
      return NextResponse.json(errorResponse(ACCOUNT_SUSPENDED_MESSAGE), { status: 403 })
    }

    if (activationKey.user && activationKey.user.status !== 'active') {
      return NextResponse.json(errorResponse('الحساب غير نشط. تواصل مع الدعم الفني'), { status: 403 })
    }

    if (activationKey.status === 'revoked') {
      return NextResponse.json(errorResponse('تم إلغاء هذا المفتاح'), { status: 403 })
    }

    if (activationKey.status === 'expired' || isKeyExpired(activationKey.expiresAt)) {
      return NextResponse.json(errorResponse('انتهت صلاحية هذا المفتاح'), { status: 403 })
    }

    const existingDevice = activationKey.devices.find(
      (d) => d.deviceFingerprint === deviceFingerprint && d.isActive
    )
    const inactiveDevice = activationKey.devices.find(
      (d) => d.deviceFingerprint === deviceFingerprint && !d.isActive
    )
    const activeDevices = activationKey.devices.filter((d) => d.isActive)

    if (existingDevice) {
      await prisma.device.update({
        where: { id: existingDevice.id },
        data: { lastSeenAt: new Date() }
      })

      return NextResponse.json(successResponse({
        sessionId: existingDevice.id.toString(),
        key: {
          keyCode: activationKey.keyCode,
          status: 'active',
          expiresAt: activationKey.expiresAt,
          maxDevices: activationKey.maxDevices
        }
      }, 'تم التحقق من الجهاز بنجاح'))
    }

    if (inactiveDevice) {
      if (activeDevices.length >= activationKey.maxDevices) {
        return NextResponse.json(errorResponse(
          `تم الوصول للحد الأقصى من الأجهزة (${activationKey.maxDevices}). يرجى إعادة تعيين جهاز من لوحة التحكم.`
        ), { status: 403 })
      }

      await prisma.device.update({
        where: { id: inactiveDevice.id },
        data: { isActive: true, lastSeenAt: new Date() }
      })

      return NextResponse.json(successResponse({
        sessionId: inactiveDevice.id.toString(),
        key: {
          keyCode: activationKey.keyCode,
          status: 'active',
          expiresAt: activationKey.expiresAt,
          maxDevices: activationKey.maxDevices
        }
      }, 'تم إعادة تفعيل الجهاز بنجاح'))
    }

    if (activeDevices.length >= activationKey.maxDevices) {
      return NextResponse.json(errorResponse(
        `تم تجاوز الحد الأقصى للأجهزة (${activationKey.maxDevices}). يرجى إعادة تعيين جهاز أولاً`
      ), { status: 403 })
    }

    if (activationKey.status === 'available') {
      await prisma.activationKey.update({
        where: { id: activationKey.id },
        data: {
          status: 'active',
          activatedAt: new Date(),
          expiresAt: getActivationExpiry()
        }
      })
    }

    const device = await prisma.device.create({
      data: {
        userId: activationKey.userId || 0,
        keyId: activationKey.id,
        deviceFingerprint,
        deviceName: deviceInfo?.hostname,
        osInfo: deviceInfo?.platform ? `${deviceInfo.platform} ${deviceInfo.arch}` : undefined,
        cpuInfo: deviceInfo?.cpu,
        ramInfo: deviceInfo?.ram,
        gpuInfo: deviceInfo?.gpu,
        screenResolution: deviceInfo?.screenResolution
      }
    })

    if (activationKey.userId) {
      await prisma.auditLog.create({
        data: {
          userId: activationKey.userId,
          action: 'device_verified',
          details: { deviceFingerprint, deviceId: device.id },
          ipAddress: req.headers.get('x-forwarded-for') || '0.0.0.0'
        }
      })
    }

    return NextResponse.json(successResponse({
      sessionId: device.id.toString(),
      key: {
        keyCode: activationKey.keyCode,
        status: 'active',
        expiresAt: activationKey.expiresAt || getActivationExpiry(),
        maxDevices: activationKey.maxDevices
      }
    }, 'تم تسجيل الجهاز بنجاح'))
  } catch (err) {
    console.error('Verify device error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}
