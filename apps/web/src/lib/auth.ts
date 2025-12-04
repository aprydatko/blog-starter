import '../../envConfig'

import { NextAuthResult, NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import Credentials from "next-auth/providers/credentials"
import Github from 'next-auth/providers/github'

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession`, `auth` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      address: string
    } & User
  }

  interface User {
    foo?: string
  }
}

export const authOptions: NextAuthConfig = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      authorize(c) {
        if (c.password !== "password") return null
        return {
          id: "test",
          name: "Test User",
          email: "test@example.com",
        }
      },
    }),
    Github,
  ],
  callbacks: {
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name
      return token
    },
  },
  basePath: "/auth",
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
}

export const { handlers, auth, signIn, signOut }: NextAuthResult = NextAuth(authOptions);
