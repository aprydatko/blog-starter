'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  File,
  Users,
  MessageSquare,
  Image,
  ChartBarStacked,
  Loader2,
  Timer,
  ListCollapse,
  Bold,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { UserNav } from '@/components/user-nav'
import ThemeToggler from '@/components/theme-toggler'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const user = session?.user?.id ? session.user : null

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
        <Loader2 className="h-8 w-8" />
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
      <aside
        className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} transition-all duration-500 border-r bg-white dark:bg-background border-border relative`}
      >
        <div className="flex h-16 items-center px-6 justify-between">
          {!isSidebarCollapsed && <h1 className="text-xl text-accent font-bold">Blogger</h1>}
          {isSidebarCollapsed && <Bold className="h-6 w-6 text-accent dark:text-white cursor-pointer" />}
        </div>
        <nav className="space-y-1 p-4">
          {navigation.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                  ? 'bg-accent/15 dark:bg-primary/75 text-accent-foreground'
                  : 'hover:bg-primary/15 hover:text-accent-foreground hover:dark:bg-accent'
              }`}
            >
              <item.icon className={`h-4 w-4 text-accent dark:text-white ${isSidebarCollapsed ? 'mx-auto' : ''}`} />
              {!isSidebarCollapsed && item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 bg-background transition-all duration-500 ${isSidebarCollapsed ? 'ml-20' : 'ml-0'}`}>
        <header className="h-16 relative bg-white dark:bg-background border-b border-border">
          <div className="mx-auto max-w-8xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                  <ListCollapse className="h-4 w-4 text-accent dark:text-white cursor-pointer" />
                </button>
              </div>
              <div className="flex items-center">
                <div className="flex items-center gap-4">
                  <ThemeToggler />
                  {user && <UserNav user={user} />}
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
