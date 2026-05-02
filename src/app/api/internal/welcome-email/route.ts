import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { generateWelcomeEmail, generateWelcomeEmailText, sendEmail, type WelcomeEmailData } from '@/lib/email'
import { rejectLargeJson } from '@/lib/request-security'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface WelcomeEmailRequest {
  subject?: string
  welcomeData?: WelcomeEmailData
}

function authorized(authorization: string | null) {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret || !authorization) return false

  const expected = `Bearer ${secret}`
  if (authorization.length !== expected.length) return false

  return crypto.timingSafeEqual(Buffer.from(authorization), Buffer.from(expected))
}

export async function POST(req: NextRequest) {
  if (!authorized(req.headers.get('authorization'))) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
  }

  const largePayload = rejectLargeJson(req, 32 * 1024)
  if (largePayload) return largePayload

  const body = (await req.json()) as WelcomeEmailRequest
  const welcomeData = body.welcomeData

  if (!welcomeData?.email || !welcomeData.serial) {
    return NextResponse.json({ success: false, error: 'Missing welcome email data' }, { status: 400 })
  }

  const result = await sendEmail({
    to: welcomeData.email,
    subject: body.subject || 'بيانات حسابك في SkyPro',
    text: generateWelcomeEmailText(welcomeData),
    html: generateWelcomeEmail(welcomeData)
  })

  return NextResponse.json(result, { status: result.success ? 200 : 502 })
}
