'use server'

import { prisma } from '@blog-starter/db'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    // Return success even if user not found to prevent enumeration
    return { success: true, message: 'If an account exists, a reset link has been sent.' }
  }

  // Generate a random token
  const token = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 3600 * 1000) // 1 hour

  // Save token to database
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  })

  // In a real app, send email here.
  // For dev/demo, we'll log the link to the server console.
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`
  console.log('----------------------------------------')
  console.log('PASSWORD RESET LINK:', resetLink)
  console.log('----------------------------------------')

  return { success: true, message: 'Check your email for a reset link.' }
}

export async function resetPassword(token: string, password: string) {
  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      token,
      expires: { gt: new Date() },
    },
  })

  if (!verificationToken) {
    return { error: 'Invalid or expired token' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  // Update user password
  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { password: hashedPassword },
  })

  // Delete the used token
  // Note: Prisma composite ID delete requires both fields
  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: verificationToken.identifier,
        token: verificationToken.token,
      },
    },
  })

  return { success: true, message: 'Password updated successfully' }
}
