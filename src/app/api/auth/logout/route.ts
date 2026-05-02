import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getClientIp, rejectCrossSite } from '@/lib/request-security'

export async function POST(req: NextRequest) {
  try {
    const crossSite = rejectCrossSite(req)
    if (crossSite) return crossSite

    const session = await auth()

    if (session?.user?.id) {
      const { prisma } = await import('@/lib/db')
      await prisma.auditLog.create({
        data: {
          userId: parseInt(session.user.id),
          action: 'logout',
          ipAddress: getClientIp(req)
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
