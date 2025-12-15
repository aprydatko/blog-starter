import { auth } from '@/lib/auth'
import { prisma } from '@blog-starter/db'

import { Viewport } from 'next'
import Header from '@/components/header/main-header'

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
      <Header user={user} />
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
