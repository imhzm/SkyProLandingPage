import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { registerSchema } from '@/lib/validations'
import { hashPassword, getTrialEndDate } from '@/lib/utils'
import { successResponse, errorResponse, getErrorMessage } from '@/lib/api'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message).join(', ')
      return NextResponse.json(errorResponse(errors), { status: 400 })
    }

    const { name, email, password } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(errorResponse('البريد الإلكتروني مسجل بالفعل'), { status: 409 })
    }

    const passwordHash = hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: 'user',
        status: 'active',
        emailVerifiedAt: new Date()
      }
    })

    await prisma.subscription.create({
      data: {
        userId: user.id,
        keyId: null,
        status: 'trial',
        trialEndsAt: getTrialEndDate()
      }
    })

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'register',
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '0.0.0.0'
      }
    })

    return NextResponse.json(successResponse({ userId: user.id, email: user.email }, 'تم إنشاء الحساب بنجاح'))
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}