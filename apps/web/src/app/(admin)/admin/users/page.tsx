import { getUsers } from '@/lib/actions/users'
import { UsersTable } from './users-table'

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    sortBy?: string
  }>
}

export default async function UsersPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1
  const search = resolvedSearchParams.search || ''
  const sortBy =
    resolvedSearchParams.sortBy === 'asc' || resolvedSearchParams.sortBy === 'desc'
      ? resolvedSearchParams.sortBy
      : 'asc'

  const usersResult = await getUsers({
    page,
    limit: 10,
    search: search || undefined,
    sortBy: sortBy as 'asc' | 'desc',
  })

  if (!usersResult.success) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage users</p>
        </div>
        <div className="text-destructive">Failed to load users</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-white dark:bg-background p-6 rounded-xl border border-border">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="font-sans font-bold text-3xl text-secondary-foreground">Users</h2>
        </div>
      </div>
      <hr className="mb-10 border-border" />

      <UsersTable
        users={usersResult.users || []}
        pagination={usersResult.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }}
        currentFilters={{
          search,
          sortBy,
        }}
      />
    </div>
  )
}
