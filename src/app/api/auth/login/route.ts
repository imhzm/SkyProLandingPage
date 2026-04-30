import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { loginSchema } from '@/lib/validations'
import { verifyPassword, generateSessionId } from '@/lib/utils'
import { successResponse, errorResponse, getErrorMessage } from '@/lib/api'

const loginAttempts = new Map<string, { count: number; lockedUntil: number }>()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message).join(', ')
      return NextResponse.json(errorResponse(errors), { status: 400 })
    }

    const { email, password } = parsed.data
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '0.0.0.0'

    const attempt = loginAttempts.get(ip)
    if (attempt && attempt.lockedUntil > Date.now()) {
      const remaining = Math.ceil((attempt.lockedUntil - Date.now()) / 60000)
      return NextResponse.json(errorResponse(`الحساب مقفل. حاول مرة أخرى بعد ${remaining} دقيقة`), { status: 429 })
    }

    if (attempt && attempt.lockedUntil <= Date.now()) {
      loginAttempts.delete(ip)
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.passwordHash) {
      incrementAttempts(ip)
      return NextResponse.json(errorResponse('بيانات الدخول غير صحيحة'), { status: 401 })
    }

    if (user.status === 'suspended') {
      return NextResponse.json(errorResponse('الحساب معلق. تواصل مع الدعم الفني'), { status: 403 })
    }

    if (!user.emailVerifiedAt) {
      return NextResponse.json(errorResponse('يرجى تأكيد البريد الإلكتروني أولاً'), { status: 403 })
    }

    const isValid = verifyPassword(password, user.passwordHash)
    if (!isValid) {
      incrementAttempts(ip)
      return NextResponse.json(errorResponse('بيانات الدخول غير صحيحة'), { status: 401 })
    }

    loginAttempts.delete(ip)

    const sessionId = generateSessionId()
    await prisma.nextAuthSession.create({
      data: {
        sessionToken: sessionId,
        userId: user.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    })

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'login',
        ipAddress: ip
      }
    })

    const response = NextResponse.json(successResponse({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      sessionId
    }, 'تم تسجيل الدخول بنجاح'))

    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/'
    })

    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}

function incrementAttempts(ip: string) {
  const attempt = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 }
  attempt.count++
  if (attempt.count >= 5) {
    attempt.lockedUntil = Date.now() + 15 * 60 * 1000
  }
  loginAttempts.set(ip, attempt)
}