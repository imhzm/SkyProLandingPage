import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST() {
  try {
    const session = await auth()

    if (session?.user?.id) {
      const { prisma } = await import('@/lib/db')
      await prisma.auditLog.create({
        data: {
          userId: parseInt(session.user.id),
          action: 'logout',
          ipAddress: '0.0.0.0'
        }
      })
    }

    const response = NextResponse.json({ success: true, message: 'تم تسجيل الخروج' })
    response.cookies.set('session_id', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })

    return response
  } catch (err) {
    console.error('Logout error:', err)
    return NextResponse.json({ success: false, error: 'حدث خطأ غير متوقع' }, { status: 500 })
  }
}