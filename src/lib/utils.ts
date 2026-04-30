import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10)
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash)
}

export function generateApiKey(): string {
  const prefix = 'SKY1-PRO2'
  const segment = () => crypto.randomBytes(2).toString('hex').toUpperCase().padEnd(4, '0').slice(0, 4)
  const year = new Date().getFullYear() + 1
  return `${prefix}-${segment()}-${segment()}-${year}`
}

export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function isKeyExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return true
  return new Date() > new Date(expiresAt)
}

export function getTrialEndDate(): Date {
  const days = parseInt(process.env.DEFAULT_TRIAL_DAYS || '2')
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

export function getActivationExpiry(): Date {
  const days = parseInt(process.env.DEFAULT_KEY_DURATION_DAYS || '365')
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}