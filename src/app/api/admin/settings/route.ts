import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { errorResponse, getErrorMessage } from '@/lib/api'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(errorResponse('غير مصرح'), { status: 403 })
    }

    const settings = await prisma.systemSetting.findMany()
    const map: Record<string, string> = {}
    settings.forEach((s) => { map[s.settingKey] = s.settingValue || '' })

    return NextResponse.json({ success: true, data: map })
  } catch (err) {
    console.error('Get settings error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(errorResponse('غير مصرح'), { status: 403 })
    }

    const { key, value } = await req.json()

    if (!key) {
      return NextResponse.json(errorResponse('المفتاح مطلوب'), { status: 400 })
    }

    const setting = await prisma.systemSetting.upsert({
      where: { settingKey: key },
      update: { settingValue: value },
      create: { settingKey: key, settingValue: value }
    })

    await prisma.auditLog.create({
      data: {
        userId: parseInt(session.user.id),
        action: 'update_setting',
        details: { key, value },
        ipAddress: req.headers.get('x-forwarded-for') || '0.0.0.0'
      }
    })

    return NextResponse.json({ success: true, data: setting })
  } catch (err) {
    console.error('Save setting error:', err)
    return NextResponse.json(errorResponse(getErrorMessage(err)), { status: 500 })
  }
}