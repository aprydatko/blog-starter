import NextAuth, { type NextAuthResult } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GitHub from 'next-auth/providers/github'
import { prisma } from '@blog-starter/db'

export function initializeAuth(nextAuth = NextAuth): NextAuthResult {
  const result = nextAuth({
    debug: true,
    adapter: PrismaAdapter(prisma),
    providers: [GitHub],
  })

  return result as unknown as NextAuthResult
}

export default initializeAuth
