'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Trash2, Search } from 'lucide-react'
import { Button } from '@blog-starter/ui/button'
import { Input } from '@blog-starter/ui/input'
import { deleteUser } from '@/lib/actions/users'
import { toast } from 'sonner'
import Link from 'next/link'

interface User {
  id: string
  name: string | null
  email: string | null
  role: string
  image: string | null
  createdAt: Date
  updatedAt: Date
}

interface UsersTableProps {
  users: User[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  currentFilters: {
    search: string
    sortBy: string
  }
}

function buildQueryString(filters: { page?: number; search?: string; sortBy?: string }) {
  const params = new URLSearchParams()
  if (filters.page && filters.page > 1) {
    params.set('page', filters.page.toString())
  }
  if (filters.search) {
    params.set('search', filters.search)
  }
  if (filters.sortBy && filters.sortBy !== 'asc') {
    params.set('sortBy', filters.sortBy)
  }
  return params.toString() ? `?${params.toString()}` : ''
}

export function UsersTable({ users, pagination, currentFilters }: UsersTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState(currentFilters.search)
  const [sortByFilter, setSortByFilter] = useState(currentFilters.sortBy)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    setDeletingId(id)
    const result = await deleteUser(id)
    setDeletingId(null)

    if (result.success) {
      toast.success('User deleted successfully')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to delete user')
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = buildQueryString({
      page: 1,
      search: searchValue || undefined,
      sortBy: sortByFilter || undefined,
    })
    router.push(`/admin/users${query}`)
  }

  const handleFilterChange = (filterType: 'sortBy', value: string) => {
    if (filterType === 'sortBy') {
      setSortByFilter(value)
    }

    const newFilters = {
      ...currentFilters,
      [filterType]: value,
    }

    const query = buildQueryString({
      page: 1,
      search: newFilters.search || undefined,
      sortBy: newFilters.sortBy || undefined,
    })
    router.push(`/admin/users${query}`)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="rounded-md border p-4 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="search" className="text-sm font-medium mb-2 block">
              Search Users
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                type="text"
                placeholder="Search by name or email..."
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="w-40">
            <label htmlFor="sortBy" className="text-sm font-medium mb-2 block">
              Sort by Name
            </label>
            <select
              id="sortBy"
              value={sortByFilter}
              onChange={e => handleFilterChange('sortBy', e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Role</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
              <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="h-24 text-center">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="border-b">
                  <td className="p-4">
                    <div className="text-sm font-medium">{user.name || 'No name'}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{user.email || 'No email'}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{format(new Date(user.createdAt), 'MMM d, yyyy')}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                        disabled={deletingId === user.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total users)
          </div>
          <div className="flex gap-2">
            <Link
              href={`/admin/users${buildQueryString({
                page: pagination.page - 1,
                search: currentFilters.search || undefined,
                sortBy: currentFilters.sortBy || undefined,
              })}`}
              className={pagination.page <= 1 ? 'pointer-events-none opacity-50' : ''}
            >
              <Button variant="outline" disabled={pagination.page <= 1}>
                Previous
              </Button>
            </Link>
            <Link
              href={`/admin/users${buildQueryString({
                page: pagination.page + 1,
                search: currentFilters.search || undefined,
                sortBy: currentFilters.sortBy || undefined,
              })}`}
              className={pagination.page >= pagination.totalPages ? 'pointer-events-none opacity-50' : ''}
            >
              <Button variant="outline" disabled={pagination.page >= pagination.totalPages}>
                Next
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
