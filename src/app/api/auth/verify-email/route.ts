import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { errorResponse, getErrorMessage } from '@/lib/api'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json(errorResponse('رمز التحقق مطلوب'), { status: 400 })
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!verificationToken) {
      return NextResponse.json(errorResponse('رمز التحقق غير صالح'), { status: 400 })
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token } })
      return NextResponse.json(errorResponse('رمز التحقق منتهي الصلاحية'), { status: 400 })
    }

    const userIdStr = verificationToken.identifier.replace('verify-email:', '')
    const userId = parseInt(userIdStr)

    if (isNaN(userId)) {
      return NextResponse.json(errorResponse('رمز التحقق غير صالح'), { status: 400 })
    }

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerifiedAt: new Date() }
    })

    await prisma.verificationToken.delete({ where: { token } })

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'verify_email',
        ipAddress: req.headers.get('x-forwarded-for') || '0.0.0.0'
      }
    })

    return NextResponse.json({ success: true, message: 'تم تأكيد البريد الإلكتروني بنجاح' })
  } catch (err) {
    console.error('Verify email error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}