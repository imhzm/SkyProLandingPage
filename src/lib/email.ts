import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

export interface WelcomeEmailData {
  name?: string | null
  email: string
  password?: string | null
  serial: string
  expiryDate: string
  planLabel?: string
  loginMethod?: string
}

const APP_NAME = 'SkyPro'
const APP_WEBSITE_URL = 'https://www.skywaveads.com'
const APP_WEBSITE_LABEL = 'www.skywaveads.com'

function env(name: string): string {
  return (process.env[name] || '').trim().replace(/^['"]|['"]$/g, '')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function sendEmail({ to, subject, text, html }: EmailOptions): Promise<EmailResult> {
  const host = env('SMTP_HOST')
  const port = parseInt(env('SMTP_PORT') || '465', 10)
  const user = env('SMTP_USER')
  const pass = env('SMTP_PASS')

  if (!host || !user || !pass) {
    return { success: false, error: 'SMTP configuration is incomplete' }
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass },
  })

  try {
    const info = await transporter.sendMail({
      from: `"${APP_NAME}" <${user}>`,
      replyTo: user,
      to,
      subject,
      text,
      html: html || text,
    })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Email sending failed:', message)
    return { success: false, error: message }
  }
}

export function generateWelcomeEmailText(data: WelcomeEmailData): string {
  const name = data.name || 'عميلنا الكريم'
  const passwordLine = data.password
    ? `كلمة المرور: ${data.password}\n`
    : `طريقة الدخول: ${data.loginMethod || 'Google'}\n`

  return `مرحباً ${name}

تم إنشاء حسابك في ${APP_NAME} بنجاح.

بيانات الحساب والتفعيل:
البريد: ${data.email}
${passwordLine}السيريال: ${data.serial}
الخطة: ${data.planLabel || 'تجربة مجانية لمدة يومين'}
تاريخ الانتهاء: ${data.expiryDate}

يمكنك تسجيل الدخول من لوحة الويب أو استخدام السيريال داخل تطبيق الديسكتوب.

فريق ${APP_NAME}
الموقع: ${APP_WEBSITE_LABEL}`
}

export function generateWelcomeEmail(data: WelcomeEmailData): string {
  const name = escapeHtml(data.name || 'عميلنا الكريم')
  const email = escapeHtml(data.email)
  const serial = escapeHtml(data.serial)
  const expiryDate = escapeHtml(data.expiryDate)
  const planLabel = escapeHtml(data.planLabel || 'تجربة مجانية لمدة يومين')
  const passwordRow = data.password
    ? `<p><strong>كلمة المرور:</strong> <code style="background:#eef2ff;padding:4px 8px;border-radius:6px;font-size:15px;">${escapeHtml(data.password)}</code></p>`
    : `<p><strong>طريقة الدخول:</strong> ${escapeHtml(data.loginMethod || 'Google')}</p>`

  return `
    <div dir="rtl" style="font-family:Arial,Tahoma,sans-serif;max-width:640px;margin:0 auto;padding:24px;background:#f8fafc;color:#0f172a;">
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
        <div style="padding:24px;background:linear-gradient(135deg,#0A6CF1,#8B2CF5);color:#ffffff;text-align:center;">
          <h1 style="margin:0;font-size:24px;">مرحباً ${name}</h1>
          <p style="margin:8px 0 0;font-size:14px;">تم إنشاء حسابك في ${APP_NAME} بنجاح</p>
        </div>

        <div style="padding:24px;">
          <p style="margin-top:0;">بيانات الحساب والتفعيل الخاصة بك:</p>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px;margin:18px 0;">
            <p><strong>البريد الإلكتروني:</strong> ${email}</p>
            ${passwordRow}
            <p><strong>السيريال:</strong> <code style="background:#eef2ff;padding:4px 8px;border-radius:6px;font-size:15px;">${serial}</code></p>
            <p><strong>الخطة:</strong> ${planLabel}</p>
            <p><strong>تاريخ الانتهاء:</strong> ${expiryDate}</p>
          </div>
          <p>يمكنك تسجيل الدخول من لوحة الويب أو استخدام السيريال داخل تطبيق الديسكتوب.</p>
          <p style="margin-bottom:0;color:#64748b;font-size:13px;">لو لم تطلب هذا الحساب، تجاهل هذه الرسالة.</p>
        </div>
      </div>
      <p style="text-align:center;color:#64748b;font-size:12px;margin-top:18px;">
        ${APP_NAME}<br />
        <a href="${APP_WEBSITE_URL}" style="color:#0A6CF1;text-decoration:none;">${APP_WEBSITE_LABEL}</a>
      </p>
    </div>
  `
}
