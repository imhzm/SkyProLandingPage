import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { forgotPasswordSchema } from '@/lib/validations'
import { successResponse, errorResponse, getErrorMessage } from '@/lib/api'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = forgotPasswordSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message).join(', ')
      return NextResponse.json(errorResponse(errors), { status: 400 })
    }

    const { email } = parsed.data

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json(successResponse(null, 'إذا كان البريد مسجلاً، ستصلك رسالة إعادة التعيين'))
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.verificationToken.create({
      data: {
        identifier: `reset-password:${user.id}`,
        token,
        expires
      }
    })

    console.log(`Password reset token for ${email}: ${token}`)
    console.log(`Reset URL: ${process.env.APP_URL}/auth/reset-password?token=${token}`)

    return NextResponse.json(successResponse(null, 'إذا كان البريد مسجلاً، ستصلك رسالة إعادة التعيين'))
  } catch (err) {
    console.error('Forgot password error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}