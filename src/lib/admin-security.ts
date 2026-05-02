import { NextRequest, NextResponse } from 'next/server'
import type { Session } from 'next-auth'
import { auth } from '@/lib/auth'
import { errorResponse } from '@/lib/api'

type AdminSession = Session | null

interface AdminGuardResult {
  session: AdminSession
  response: NextResponse | null
}

function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  const forwardedHost = req.headers.get('x-forwarded-host')
  const fetchSite = req.headers.get('sec-fetch-site')

  if (fetchSite && !['same-origin', 'same-site', 'none'].includes(fetchSite)) {
    return false
  }

  if (!origin) return true

  try {
    const originUrl = new URL(origin)
    return originUrl.host === host || originUrl.host === forwardedHost
  } catch {
    return false
  }
}

export async function requireAdmin(req?: NextRequest, options: { stateChanging?: boolean } = {}): Promise<AdminGuardResult> {
  const session = await auth()

  if (!session?.user || session.user.role !== 'admin') {
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

export function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || '0.0.0.0'
}
