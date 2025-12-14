import { getPosts } from '@/lib/actions/posts'
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
    <div className="space-y-6 bg-white dark:bg-background p-6 rounded-xl border border-border">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="font-sans font-bold text-3xl text-secondary-foreground">Posts</h2>
        </div>
        <div className="flex">
          <Link href="/admin/posts/new">
            <Button className='flex justify-center gap-2'>
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>
      </div>
      <hr className="mb-10 border-border" />

      <PostsSearch />

      <PostsTable
        posts={result.posts || []}
        pagination={result.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }}
      />
    </div>
  )
}
