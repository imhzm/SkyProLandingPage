import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendEmail({ to, subject, text, html }: EmailOptions): Promise<boolean> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html: html || text
    })
    return true
  } catch (error) {
    console.error('Email sending failed:', error)
    return false
  }
}

export function generateWelcomeEmail(name: string, email: string, serial: string, expiryDate: string): string {
  return `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0A6CF1;">مرحباً ${name || 'عميلنا الكريم'}</h1>
      </div>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <p>شكراً لك على التسجيل في <strong>سيندر برو</strong>!</p>
        <p>بيانات التفعيل الخاصة بك:</p>
        <div style="background: #fff; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #e0e0e0;">
          <p><strong>البريد الإلكتروني:</strong> ${email}</p>
          <p><strong>السيريال:</strong> <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 16px;">${serial}</code></p>
          <p><strong>تاريخ الانتهاء:</strong> ${expiryDate}</p>
        </div>
        <p>قم بتحميل التطبيق واستخدم هذه البيانات لتسجيل الدخول.</p>
      </div>
      <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
        <p>مع تحيات فريق سيندر برو</p>
        <p>skywaveads.com</p>
      </div>
    </div>
  `
}
