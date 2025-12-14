import { Button } from '@blog-starter/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@blog-starter/ui/card'
import { Plus } from 'lucide-react'
import Link from 'next/link'

import { getUpcomingScheduledPosts } from '@/lib/actions/scheduled-posts'
import { ScheduledPostsTable } from './scheduled-posts-table'

export const dynamic = 'force-dynamic'

export default async function ScheduledPostsPage() {
  const posts = await getUpcomingScheduledPosts()

  return (
    <div className="space-y-6 bg-white dark:bg-background p-6 rounded-xl border border-border">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="font-sans font-bold text-3xl text-secondary-foreground">Scheduled Posts</h2>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>
      <hr className="mb-10 border-border" />

      <Card className="border-none dark:bg-background">
        <CardTitle className="text-base/7 font-semibold text-gray-900 dark:text-gray-300">
          Upcoming Scheduled Posts
        </CardTitle>
        <CardContent className="space-y-4">
          <ScheduledPostsTable initialPosts={posts} />
        </CardContent>
      </Card>
    </div>
  )
}
