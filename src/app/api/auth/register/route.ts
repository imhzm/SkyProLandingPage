import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { registerSchema } from '@/lib/validations'
import { generateApiKey, getTrialEndDate, hashPassword } from '@/lib/utils'
import { generateWelcomeEmail, generateWelcomeEmailText, sendEmail } from '@/lib/email'
import { successResponse, errorResponse, getErrorMessage } from '@/lib/api'
import {
  checkRateLimit,
  getClientIp,
  rateLimitedResponse,
  rejectCrossSite,
  rejectLargeJson,
} from '@/lib/request-security'

export async function POST(req: NextRequest) {
  try {
    const crossSite = rejectCrossSite(req)
    if (crossSite) return crossSite

    const largePayload = rejectLargeJson(req, 32 * 1024)
    if (largePayload) return largePayload

    const ipAddress = getClientIp(req)
    const ipLimit = checkRateLimit(`register:ip:${ipAddress}`, 10, 60 * 60 * 1000)
    if (!ipLimit.allowed) return rateLimitedResponse(ipLimit.retryAfter)

    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message).join(', ')
      return NextResponse.json(errorResponse(errors), { status: 400 })
    }

    const { name, email, password } = parsed.data
    const emailLimit = checkRateLimit(`register:email:${email}`, 3, 60 * 60 * 1000)
    if (!emailLimit.allowed) return rateLimitedResponse(emailLimit.retryAfter)

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(errorResponse('البريد الإلكتروني مسجل بالفعل'), { status: 409 })
    }

    const passwordHash = hashPassword(password)
    const trialDays = parseInt(process.env.DEFAULT_TRIAL_DAYS || '2', 10)
    const maxDevices = parseInt(process.env.DEFAULT_MAX_DEVICES || '1', 10)
    const trialEndsAt = getTrialEndDate()
    const keyCode = generateApiKey()

    const { user, activationKey } = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          name,
          passwordHash,
          role: 'user',
          status: 'active',
          emailVerifiedAt: new Date()
        }
      })

      const activationKey = await tx.activationKey.create({
        data: {
          keyCode,
          userId: user.id,
          status: 'active',
          plan: 'trial',
          durationDays: trialDays,
          maxDevices,
          activatedAt: new Date(),
          expiresAt: trialEndsAt
        }
      })

      await tx.subscription.create({
        data: {
          userId: user.id,
          keyId: activationKey.id,
          status: 'trial',
          trialEndsAt,
          startedAt: new Date(),
          expiresAt: trialEndsAt
        }
      })

      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'register',
          details: { keyId: activationKey.id, trialDays },
          ipAddress
        }
      })

      return { user, activationKey }
    })

    const welcomeData = {
      name,
      email,
      password,
      serial: activationKey.keyCode,
      expiryDate: trialEndsAt.toLocaleDateString('ar-EG'),
      planLabel: `تجربة مجانية لمدة ${trialDays} يوم`
    }
    const emailResult = await sendEmail({
      to: email,
      subject: 'بيانات حسابك وتجربة SkyPro المجانية',
      text: generateWelcomeEmailText(welcomeData),
      html: generateWelcomeEmail(welcomeData)
    })

    return NextResponse.json(successResponse({
      userId: user.id,
      email: user.email,
      serial: activationKey.keyCode,
      trialEndsAt,
      emailSent: emailResult.success
    }, emailResult.success
      ? 'تم إنشاء الحساب وإرسال بيانات الدخول والتفعيل إلى البريد. إذا لم تظهر الرسالة في الوارد، راجع قسم Spam/Junk.'
      : 'تم إنشاء الحساب والتجربة، لكن فشل إرسال البريد. تواصل مع الدعم للحصول على البيانات.'))
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}
