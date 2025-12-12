
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FileText, File, Users, MessageSquare, Image, ChartBarStacked, Loader2, Timer } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // If session is loaded and user is not authenticated or not an admin, redirect to home
    if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'ADMIN')) {
      router.push('/')
    } else if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      setIsLoading(false)
    }
  }, [status, session, router])

  // Show loading state while checking authentication
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // If not an admin, this will be caught by the middleware and redirected, but we'll return null here
  if (session?.user?.role !== 'ADMIN') {
    return null
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Categories', href: '/admin/categories', icon: ChartBarStacked },
    { name: 'Posts', href: '/admin/posts', icon: FileText },
    { name: 'Pages', href: '/admin/pages', icon: File },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Comments', href: '/admin/comments', icon: MessageSquare },
    { name: 'Media', href: '/admin/media', icon: Image },
    { name: 'Scheduled Posts', href: '/admin/scheduled-posts', icon: Timer },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold">Web Blogger Admin</h1>
        </div>
        <nav className="space-y-1 p-4">
          {navigation.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <header className="flex h-16 items-center border-b px-6">
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{session?.user?.name || 'Admin User'}</span>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
