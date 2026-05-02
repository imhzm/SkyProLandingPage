import { NextRequest, NextResponse } from 'next/server'
import type { Session } from 'next-auth'
import { auth } from '@/lib/auth'
import { errorResponse } from '@/lib/api'
import { getClientIp, sameOrigin } from '@/lib/request-security'

export { getClientIp }

type AdminSession = Session | null

interface AdminGuardResult {
  session: AdminSession
  response: NextResponse | null
}

export async function requireAdmin(req?: NextRequest, options: { stateChanging?: boolean } = {}): Promise<AdminGuardResult> {
  const session = await auth()

  if (!session?.user || session.user.role !== 'admin' || (session.user as { status?: string }).status !== 'active') {
    return {
      session,
      response: NextResponse.json(errorResponse('غير مصرح'), { status: 403 }),
    }
  }

  if (options.stateChanging && req && !sameOrigin(req)) {
    return {
      session,
      response: NextResponse.json(errorResponse('تم رفض الطلب لأسباب أمنية'), { status: 403 }),
    }
  }

  return { session, response: null }
}
