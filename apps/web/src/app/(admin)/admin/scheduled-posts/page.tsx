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
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Scheduled Posts</h1>
        <Button asChild>
          <Link href="/admin/posts/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Scheduled Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduledPostsTable initialPosts={posts} />
        </CardContent>
      </Card>
    </div>
  )
}
