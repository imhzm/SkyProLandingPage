import { NextRequest, NextResponse } from 'next/server'
import { generateWelcomeEmail, generateWelcomeEmailText, sendEmail, type WelcomeEmailData } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface WelcomeEmailRequest {
  subject?: string
  welcomeData?: WelcomeEmailData
}

export async function POST(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET
  const authorization = req.headers.get('authorization')

  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
  }

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
