import { getComments, getAllPostsForFilter, getAllUsersForFilter } from '@/lib/actions/comments'
import { CommentsTable } from './comments-table'

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    postId?: string
    authorId?: string
    sortBy?: string
  }>
}

export default async function CommentsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1
  const search = resolvedSearchParams.search || ''
  const postId = resolvedSearchParams.postId || ''
  const authorId = resolvedSearchParams.authorId || ''
  const sortBy =
    resolvedSearchParams.sortBy === 'asc' || resolvedSearchParams.sortBy === 'desc'
      ? resolvedSearchParams.sortBy
      : 'desc'

  const [commentsResult, postsResult, usersResult] = await Promise.all([
    getComments({
      page,
      limit: 10,
      search: search || undefined,
      postId: postId || undefined,
      authorId: authorId || undefined,
      sortBy: sortBy as 'asc' | 'desc',
    }),
    getAllPostsForFilter(),
    getAllUsersForFilter(),
  ])

  if (!commentsResult.success) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Comments</h1>
          <p className="text-muted-foreground">Manage comments</p>
        </div>
        <div className="text-destructive">Failed to load comments</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-white dark:bg-background p-6 rounded-xl border border-border">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="font-sans font-bold text-3xl text-secondary-foreground">Comments</h2>
        </div>
      </div>
      <hr className="mb-10 border-border" />

      <CommentsTable
        comments={commentsResult.comments || []}
        pagination={commentsResult.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }}
        posts={postsResult.posts || []}
        users={usersResult.users || []}
        currentFilters={{
          search,
          postId,
          authorId,
          sortBy,
        }}
      />
    </div>
  )
}
