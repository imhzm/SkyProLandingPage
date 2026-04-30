import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { resetPasswordSchema } from '@/lib/validations'
import { hashPassword } from '@/lib/utils'
import { successResponse, errorResponse, getErrorMessage } from '@/lib/api'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = resetPasswordSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message).join(', ')
      return NextResponse.json(errorResponse(errors), { status: 400 })
    }

    const { password } = parsed.data
    const token = body.token as string | undefined

    if (!token) {
      return NextResponse.json(errorResponse('رابط إعادة التعيين غير صالح'), { status: 400 })
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json(errorResponse('رابط إعادة التعيين منتهي الصلاحية'), { status: 400 })
    }

    const userIdStr = verificationToken.identifier.replace('reset-password:', '')
    const userId = parseInt(userIdStr)

    if (isNaN(userId)) {
      return NextResponse.json(errorResponse('رابط إعادة التعيين غير صالح'), { status: 400 })
    }

    const passwordHash = hashPassword(password)

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    })

    await prisma.verificationToken.delete({
      where: { token }
    })

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'password_reset',
        ipAddress: req.headers.get('x-forwarded-for') || '0.0.0.0'
      }
    })

    return NextResponse.json(successResponse(null, 'تم إعادة تعيين كلمة المرور بنجاح'))
  } catch (err) {
    console.error('Reset password error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}