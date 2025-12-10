import { auth } from '@/lib/auth'
import { UserNav } from '@/components/user-nav'
import Link from 'next/link'
import { Button } from '@blog-starter/ui/button'
import { prisma } from '@blog-starter/db'
import ThemeToggler from '@/components/theme-toggler'

import { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = session?.user?.id ? await prisma.user.findUnique({ where: { id: session.user.id } }) : null

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold">Web Blogger</h1>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <UserNav user={user} />
            ) : (
              <div className="flex gap-2">
                <Button asChild variant="ghost" aria-label="Login Button">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild aria-label="Sign Up Button">
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}
            <ThemeToggler />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm text-muted-foreground">
          <span>Web Blogger</span>
          <span>Copyright © 2025 Web blogger </span>
        </div>
      </footer>
    </div>
  )
}
