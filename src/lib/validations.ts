import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمة المرور غير متطابقة',
  path: ['confirmPassword']
})

export const loginSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(1, 'أدخل كلمة المرور')
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح')
})

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمة المرور غير متطابقة',
  path: ['confirmPassword']
})

export const verifyDeviceSchema = z.object({
  key: z.string().min(1, 'مفتاح التفعيل مطلوب'),
  deviceFingerprint: z.string().min(1, 'بصمة الجهاز مطلوبة'),
  deviceInfo: z.object({
    hostname: z.string().optional(),
    platform: z.string().optional(),
    arch: z.string().optional(),
    cpu: z.string().optional(),
    cpuCores: z.number().optional(),
    ram: z.string().optional(),
    gpu: z.string().optional(),
    screenResolution: z.string().optional()
  }).optional()
})

export const resetDeviceSchema = z.object({
  key: z.string().min(1, 'مفتاح التفعيل مطلوب'),
  deviceFingerprint: z.string().min(1, 'بصمة الجهاز مطلوبة')
})

export const generateKeysSchema = z.object({
  count: z.number().min(1).max(100),
  plan: z.string().default('pro'),
  durationDays: z.number().default(365),
  maxDevices: z.number().default(1)
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type VerifyDeviceInput = z.infer<typeof verifyDeviceSchema>
export type ResetDeviceInput = z.infer<typeof resetDeviceSchema>
export const createUserSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح'),
  name: z.string().optional(),
  sendEmail: z.boolean().default(true)
})

export type GenerateKeysInput = z.infer<typeof generateKeysSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>