/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import { generateApiKey, getTrialEndDate, verifyPassword } from '@/lib/utils'

async function sendWelcomeEmailThroughApi(subject: string, welcomeData: Record<string, unknown>) {
  const baseUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, '')
  if (!baseUrl || !process.env.NEXTAUTH_SECRET) return

  const response = await fetch(`${baseUrl}/api/internal/welcome-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXTAUTH_SECRET}`
    },
    body: JSON.stringify({ subject, welcomeData })
  })

  if (!response.ok) {
    console.error('Welcome email failed:', response.status)
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  debug: process.env.NODE_ENV !== 'production',
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'البريد الإلكتروني', type: 'email' },
        password: { label: 'كلمة المرور', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.passwordHash) {
          return null
        }

        if (user.status === 'suspended') {
          return null
        }

        if (!user.emailVerifiedAt) {
          return null
        }

        const isValid = verifyPassword(
          credentials.password as string,
          user.passwordHash
        )

        if (!isValid) {
          return null
        }

        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'login',
            ipAddress: '0.0.0.0'
          }
        })

        return {
          id: String(user.id),
          email: user.email,
          name: user.name || '',
          role: user.role,
          image: user.avatarUrl
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login'
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || 'user'
      }

      if (account?.provider === 'google' && user) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })

        if (!existingUser) {
          const trialDays = parseInt(process.env.DEFAULT_TRIAL_DAYS || '2', 10)
          const trialEndsAt = getTrialEndDate()
          const keyCode = generateApiKey()
          const { newUser, activationKey } = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
              data: {
                email: user.email!,
                name: user.name || '',
                avatarUrl: user.image || null,
                role: 'user',
                status: 'active',
                emailVerifiedAt: new Date()
              }
            })

            const activationKey = await tx.activationKey.create({
              data: {
                keyCode,
                userId: newUser.id,
                status: 'active',
                plan: 'trial',
                durationDays: trialDays,
                maxDevices: parseInt(process.env.DEFAULT_MAX_DEVICES || '1', 10),
                activatedAt: new Date(),
                expiresAt: trialEndsAt
              }
            })

            await tx.subscription.create({
              data: {
                userId: newUser.id,
                keyId: activationKey.id,
                status: 'trial',
                trialEndsAt,
                startedAt: new Date(),
                expiresAt: trialEndsAt
              }
            })

            await tx.auditLog.create({
              data: {
                userId: newUser.id,
                action: 'register_google',
                details: { keyCode, trialDays },
                ipAddress: '0.0.0.0'
              }
            })

            return { newUser, activationKey }
          })

          const welcomeData = {
            name: newUser.name || 'عميلنا الكريم',
            email: newUser.email,
            password: null,
            serial: activationKey.keyCode,
            expiryDate: trialEndsAt.toLocaleDateString('ar-EG'),
            planLabel: `تجربة مجانية لمدة ${trialDays} يوم`,
            loginMethod: 'Google'
          }
          await sendWelcomeEmailThroughApi('بيانات تجربة SkyPro المجانية', welcomeData)

          token.id = String(newUser.id)
          token.role = 'user'
        } else {
          const existingKey = await prisma.activationKey.findFirst({
            where: {
              userId: existingUser.id,
              status: { in: ['active', 'available'] }
            },
            orderBy: { createdAt: 'desc' }
          })

          if (!existingKey) {
            const trialDays = parseInt(process.env.DEFAULT_TRIAL_DAYS || '2', 10)
            const trialEndsAt = getTrialEndDate()
            const keyCode = generateApiKey()

            const activationKey = await prisma.$transaction(async (tx) => {
              await tx.user.update({
                where: { id: existingUser.id },
                data: {
                  status: 'active',
                  emailVerifiedAt: existingUser.emailVerifiedAt || new Date()
                }
              })

              const activationKey = await tx.activationKey.create({
                data: {
                  keyCode,
                  userId: existingUser.id,
                  status: 'active',
                  plan: 'trial',
                  durationDays: trialDays,
                  maxDevices: parseInt(process.env.DEFAULT_MAX_DEVICES || '1', 10),
                  activatedAt: new Date(),
                  expiresAt: trialEndsAt
                }
              })

              await tx.subscription.create({
                data: {
                  userId: existingUser.id,
                  keyId: activationKey.id,
                  status: 'trial',
                  trialEndsAt,
                  startedAt: new Date(),
                  expiresAt: trialEndsAt
                }
              })

              await tx.auditLog.create({
                data: {
                  userId: existingUser.id,
                  action: 'google_trial_activation_created',
                  details: { keyCode, trialDays },
                  ipAddress: '0.0.0.0'
                }
              })

              return activationKey
            })

            await sendWelcomeEmailThroughApi('بيانات تجربة SkyPro المجانية', {
              name: existingUser.name || 'عميلنا الكريم',
              email: existingUser.email,
              password: null,
              serial: activationKey.keyCode,
              expiryDate: trialEndsAt.toLocaleDateString('ar-EG'),
              planLabel: `تجربة مجانية لمدة ${trialDays} يوم`,
              loginMethod: 'Google'
            })
          }

          token.id = String(existingUser.id)
          token.role = existingUser.role

          await prisma.auditLog.create({
            data: {
              userId: existingUser.id,
              action: 'login_google',
              ipAddress: '0.0.0.0'
            }
          })
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  }
})
