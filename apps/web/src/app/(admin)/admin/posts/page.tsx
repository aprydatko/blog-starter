import { getPosts, deletePost, togglePublishPost } from '@/lib/actions/posts'
import { PostsTable } from './posts-table'
import { PostsSearch } from '@/components/posts-search'
import { Button } from '@blog-starter/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; titleSearch?: string; monthDate?: string }>
}

export default async function PostsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1
  const search = resolvedSearchParams.search || ''
  const titleSearch = resolvedSearchParams.titleSearch || ''
  const monthDate = resolvedSearchParams.monthDate || ''

  const result = await getPosts({
    page,
    limit: 10,
    search: search || undefined,
    titleSearch: titleSearch || undefined,
    monthDate: monthDate || undefined,
  })

  if (!result.success) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Posts</h1>
        </div>
        <div className="text-destructive">Failed to load posts</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground">Manage your blog posts</p>
        </div>
        <Link href="/admin/posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <PostsSearch />

      <PostsTable
        posts={result.posts || []}
        pagination={result.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }}
      />
    </div>
  )
}
