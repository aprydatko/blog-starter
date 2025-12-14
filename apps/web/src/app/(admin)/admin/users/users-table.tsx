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
import { Label } from '@blog-starter/ui/label'

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
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
            Search Users
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              placeholder="Search by name or email..."
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className="block w-full shadow-none rounded-md bg-background dark:bg-white/5 px-3 py-1.5 pl-10 text-base text-gray-900 dark:text-white/50 outline-1 -outline-offset-1 outline-input placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-1 focus:outline-ring sm:text-sm/6"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sortBy" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
            Sort by Name
          </Label>
          <select
            id="sortBy"
            value={sortByFilter}
            onChange={e => handleFilterChange('sortBy', e.target.value)}
            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-background dark:bg-white/5 py-1.5 pr-8 pl-3 text-base text-gray-900 dark:text-white/50 outline-1 -outline-offset-1 outline-input focus:outline-1 focus:-outline-offset-1 focus:outline-ring sm:text-sm/6"
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>
        
        <div className='flex items-end justify-end gap-4'>
          <Button type="submit" variant="default" className='flex items-center gap-2'>
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </form>

      {/* Table */}
      <div className="rounded-md border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/25">
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
                <tr key={user.id}>
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
