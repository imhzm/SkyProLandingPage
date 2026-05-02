/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { hashPassword, generateApiKey, getActivationExpiry } from '@/lib/utils'
import { sendEmail, generateWelcomeEmail, generateWelcomeEmailText } from '@/lib/email'
import { errorResponse, getErrorMessage } from '@/lib/api'
import { createUserSchema } from '@/lib/validations'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(errorResponse('غير مصرح'), { status: 403 })
    }

    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const search = url.searchParams.get('search') || ''
    const status = url.searchParams.get('status') || ''

    const where: any = {}
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { name: { contains: search } }
      ]
    }
    if (status) {
      where.status = status
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { activationKeys: true, devices: true } },
          subscriptions: { take: 1, orderBy: { createdAt: 'desc' } }
        }
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        users: users.map(u => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          status: u.status,
          emailVerifiedAt: u.emailVerifiedAt,
          createdAt: u.createdAt,
          keysCount: u._count.activationKeys,
          devicesCount: u._count.devices,
          subscription: u.subscriptions[0] || null
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (err) {
    console.error('Users list error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(errorResponse('غير مصرح'), { status: 403 })
    }

    const body = await req.json()
    const { id, name, role, status, maxDevices } = body

    if (!id) {
      return NextResponse.json(errorResponse('معرف المستخدم مطلوب'), { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } })
    if (!user) {
      return NextResponse.json(errorResponse('المستخدم غير موجود'), { status: 404 })
    }

    const updateData: any = {}
    if (name) updateData.name = name
    if (role) updateData.role = role
    if (status) updateData.status = status

    await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData
    })

    if (maxDevices !== undefined) {
      await prisma.activationKey.updateMany({
        where: { userId: parseInt(id) },
        data: { maxDevices: parseInt(maxDevices) }
      })
    }

    await prisma.auditLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: 'update_user',
        details: { targetUserId: id, updates: updateData },
        ipAddress: req.headers.get('x-forwarded-for') || '0.0.0.0'
      }
    })

    return NextResponse.json({ success: true, message: 'تم تحديث المستخدم بنجاح' })
  } catch (err) {
    console.error('Update user error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(errorResponse('غير مصرح'), { status: 403 })
    }

    const body = await req.json()
    const parsed = createUserSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message).join(', ')
      return NextResponse.json(errorResponse(errors), { status: 400 })
    }

    const { email, name, sendEmail: shouldSendEmail } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(errorResponse('البريد الإلكتروني مسجل مسبقاً'), { status: 400 })
    }

    const password = Math.random().toString(36).slice(-10) + 'A1!'
    const passwordHash = hashPassword(password)
    const expiryDate = getActivationExpiry()
    const keyCode = generateApiKey()

    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
        role: 'user',
        status: 'active',
        emailVerifiedAt: new Date()
      }
    })

    const activationKey = await prisma.activationKey.create({
      data: {
        keyCode,
        userId: user.id,
        status: 'active',
        activatedAt: new Date(),
        expiresAt: expiryDate
      }
    })

    await prisma.subscription.create({
      data: {
        userId: user.id,
        keyId: activationKey.id,
        status: 'active',
        startedAt: new Date(),
        expiresAt: expiryDate,
        amount: parseFloat(process.env.DEFAULT_KEY_PRICE || '2000'),
        currency: process.env.DEFAULT_KEY_CURRENCY || 'EGP'
      }
    })

    await prisma.auditLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: 'create_user',
        details: { newUserId: user.id, email, keyCode },
        ipAddress: req.headers.get('x-forwarded-for') || '0.0.0.0'
      }
    })

    let emailSent = false
    let emailError: string | undefined
    if (shouldSendEmail) {
      const welcomeData = {
        name: name || 'عميلنا الكريم',
        email,
        password,
        serial: keyCode,
        expiryDate: expiryDate.toLocaleDateString('ar-EG'),
        planLabel: 'اشتراك سنوي'
      }
      const emailResult = await sendEmail({
        to: email,
        subject: 'بيانات حسابك وتفعيل سيندر برو',
        text: generateWelcomeEmailText(welcomeData),
        html: generateWelcomeEmail(welcomeData)
      })
      emailSent = emailResult.success
      emailError = emailResult.error
    }

    return NextResponse.json({
      success: true,
      message: shouldSendEmail
        ? (emailSent ? 'تم إنشاء المستخدم وإرسال الإيميل بنجاح' : 'تم إنشاء المستخدم لكن فشل إرسال الإيميل')
        : 'تم إنشاء المستخدم بنجاح',
      data: {
        user: { id: user.id, email: user.email, name: user.name },
        password,
        serial: keyCode,
        expiryDate: expiryDate,
        emailSent,
        emailError
      }
    })
  } catch (err) {
    console.error('Create user error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(errorResponse('غير مصرح'), { status: 403 })
    }

    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(errorResponse('معرف المستخدم مطلوب'), { status: 400 })
    }

    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { status: 'deleted' }
    })

    await prisma.auditLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: 'delete_user',
        details: { targetUserId: id },
        ipAddress: req.headers.get('x-forwarded-for') || '0.0.0.0'
      }
    })

    return NextResponse.json({ success: true, message: 'تم حذف المستخدم بنجاح' })
  } catch (err) {
    console.error('Delete user error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}
