import { auth } from '@/lib/auth'
import { prisma } from '@blog-starter/db'

import { Viewport } from 'next'
import Header from '@/components/header/auth-header'

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
            <main className="flex flex-1 items-center justify-center">{children}</main>
        </div>
    )
}
