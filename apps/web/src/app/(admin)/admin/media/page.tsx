import { getMedia } from '@/lib/actions/media'
import { MediaTable } from './media-table'

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    sortBy?: 'date' | 'name'
    sortOrder?: 'asc' | 'desc'
  }>
}

export default async function MediaPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1
  const search = resolvedSearchParams.search || ''
  const sortBy = resolvedSearchParams.sortBy || 'date'
  const sortOrder = resolvedSearchParams.sortOrder || 'desc'

  const result = await getMedia({
    page,
    limit: 20,
    search: search || undefined,
    sortBy,
    sortOrder,
  })

  if (!result.success) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Media</h1>
        </div>
        <div className="text-destructive">Failed to load media</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-white dark:bg-background p-6 rounded-xl border border-border">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="font-sans font-bold text-3xl text-secondary-foreground">Media Files</h2>
        </div>
      </div>
      <hr className="mb-10 border-border" />
      <MediaTable
        media={result.media || []}
        pagination={result.pagination || { total: 0, page: 1, limit: 20, totalPages: 0 }}
        currentSearch={search}
        currentSortBy={sortBy}
        currentSortOrder={sortOrder}
      />
    </div>
  )
}
