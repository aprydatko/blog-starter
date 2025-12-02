import '@/envConfig'

import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from "@/src/lib/prisma";
import GithubProvider from 'next-auth/providers/github'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const { handlers, auth, signIn, signOut }: any = NextAuth({
  adapter: PrismaAdapter(prisma),
   providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
})