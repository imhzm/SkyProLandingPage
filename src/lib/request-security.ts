import { NextRequest, NextResponse } from 'next/server'
import { errorResponse } from '@/lib/api'

const MAX_BUCKETS = 10000
const buckets = new Map<string, { count: number; resetAt: number }>()

export function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || '0.0.0.0'
}

export function sameOrigin(req: NextRequest): boolean {
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

export function rejectCrossSite(req: NextRequest): NextResponse | null {
  if (sameOrigin(req)) return null
  return NextResponse.json(errorResponse('تم رفض الطلب لأسباب أمنية'), { status: 403 })
}

export function rejectLargeJson(req: NextRequest, maxBytes = 64 * 1024): NextResponse | null {
  const contentLength = Number(req.headers.get('content-length') || '0')
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return NextResponse.json(errorResponse('حجم الطلب أكبر من المسموح'), { status: 413 })
  }
  return null
}

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const normalizedKey = key.slice(0, 250)
  const current = buckets.get(normalizedKey)

  if (!current || current.resetAt <= now) {
    if (buckets.size > MAX_BUCKETS) pruneBuckets(now)
    buckets.set(normalizedKey, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, retryAfter: 0 }
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    }
  }

  current.count += 1
  return { allowed: true, remaining: limit - current.count, retryAfter: 0 }
}

export function rateLimitedResponse(retryAfterSeconds: number): NextResponse {
  return NextResponse.json(errorResponse('طلبات كثيرة جداً. حاول لاحقاً.'), {
    status: 429,
    headers: { 'Retry-After': String(retryAfterSeconds) }
  })
}

function pruneBuckets(now: number) {
  buckets.forEach((value, key) => {
    if (value.resetAt <= now) buckets.delete(key)
  })
}
