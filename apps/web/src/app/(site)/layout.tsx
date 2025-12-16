import { auth } from '@/lib/auth'
import { prisma } from '@blog-starter/db'

import { Viewport } from 'next'
import Header from '@/components/header/main-header'
import Footer from '@/components/footer/main-footer'

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
      <main className="w-full overflow-x-hidden bg-white">{children}</main>
      <Footer />
    </div>
  )
}
