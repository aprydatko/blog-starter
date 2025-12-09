import NextAuth, { type NextAuthResult } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@blog-starter/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>

/**
 * Register a new user with email and password
 */
export async function registerUser(data: RegisterInput) {
  // Validate input
  const validated = registerSchema.parse(data)

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: validated.email },
  })

  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(validated.password, 10)

  // Create user
  const user = await prisma.user.create({
    data: {
      name: validated.name,
      email: validated.email,
      password: hashedPassword,
      role: 'USER',
    },
  })

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Validate user credentials for login
 */
export async function validateCredentials(email: string, password: string) {
  const validated = loginSchema.parse({ email, password })

  const user = await prisma.user.findUnique({
    where: { email: validated.email },
  })

  if (!user || !user.password) {
    return null
  }

  const isValidPassword = await bcrypt.compare(validated.password, user.password)

  if (!isValidPassword) {
    return null
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export function initializeAuth(nextAuth = NextAuth): NextAuthResult {
  const result = nextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
      GitHub,
      Credentials({
        name: 'credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const user = await validateCredentials(credentials.email as string, credentials.password as string)

          return user
        },
      }),
    ],
    session: {
      strategy: 'jwt',
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id
        }
        return token
      },
      async session({ session, token }) {
        if (session.user && token.id) {
          session.user.id = token.id as string
        }
        return session
      },
    },
    pages: {
      signIn: '/login',
    },
  })

  return result as unknown as NextAuthResult
}

export default initializeAuth
