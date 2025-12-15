'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@blog-starter/ui/button'
import { Input } from '@blog-starter/ui/input'
import { Label } from '@blog-starter/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'
import { resetPassword } from '@/lib/actions/auth-password'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    if (!token) {
        return (
            <div className="text-center">
                <h1 className="text-3xl font-bold text-red-500">Invalid Link</h1>
                <p className="text-muted-foreground mt-2">Missing reset token.</p>
                <Button asChild className="mt-4" variant="outline">
                    <Link href="/login">Back to Login</Link>
                </Button>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
        }

        setLoading(true)

        try {
            const result = await resetPassword(token, password)
            if (result.success) {
                toast.success('Password updated successfully')
                router.push('/login')
            } else {
                toast.error(result.error as string || 'Failed to reset password')
            }
        } catch (error) {
            console.error(error)
            toast.error('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="password" className='block text-sm/6 font-medium text-gray-900 dark:text-white'>New Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="block w-full shadow-none rounded-md bg-background dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white/50 outline-1 -outline-offset-1 outline-input placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-1 focus:outline-ring sm:text-sm/6"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword" className='block text-sm/6 font-medium text-gray-900 dark:text-white'>Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="block w-full shadow-none rounded-md bg-background dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white/50 outline-1 -outline-offset-1 outline-input placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-1 focus:outline-ring sm:text-sm/6"
                />
            </div>

            <Button size="lg" type="submit" className="w-full cursor-pointer" disabled={loading}>
                {loading ? 'Reseting...' : 'Reset Password'}
            </Button>
        </form>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="w-full max-w-md space-y-8 px-4">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Reset Password</h1>
                <p className="text-muted-foreground mt-2">Enter your new password</p>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    )
}
