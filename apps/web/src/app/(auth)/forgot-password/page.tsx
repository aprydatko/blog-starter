'use client'

import { useState } from 'react'
import { Button } from '@blog-starter/ui/button'
import { Input } from '@blog-starter/ui/input'
import { Label } from '@blog-starter/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'
import { forgotPassword } from '@/lib/actions/auth-password'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await forgotPassword(email)
      if (result.success) {
        setSubmitted(true)
        toast.success(result.message)
      } else {
        toast.error('Something went wrong')
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="w-full max-w-md space-y-8 px-4 text-center">
        <h1 className="text-3xl font-bold">Check your email</h1>
        <p className="text-muted-foreground mt-2">
          If an account exists for <strong>{email}</strong>, we have sent a password reset link.
        </p>
        <div className="mt-8">
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-8 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground mt-2">Enter your email to receive a reset link</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="block w-full shadow-none rounded-md bg-background dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white/50 outline-1 -outline-offset-1 outline-input placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-1 focus:outline-ring sm:text-sm/6"
          />
        </div>

        <Button size="lg" type="submit" className="w-full cursor-pointer" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>

        <div className="text-center text-sm">
          <Link href="/login" className="text-muted-foreground hover:text-primary">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  )
}
