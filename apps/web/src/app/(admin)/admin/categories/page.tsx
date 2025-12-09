import { getCategories } from '@/lib/actions/categories'
import { CategoriesTable } from './categories-table'
import { Button } from '@blog-starter/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { months } from '@/lib/constants'

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; month?: string }>
}

export default async function CategoriesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1
  const search = resolvedSearchParams.search || ''
  const month = resolvedSearchParams.month ?? ''

  const result = await getCategories({
    page,
    limit: 10,
    search: search || undefined,
    month: month || undefined,
  })

  if (!result.success) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Categories</h1>
        </div>
        <div className="text-destructive">Failed to load categories</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage your blog categories</p>
        </div>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Category
          </Button>
        </Link>
      </div>

      {/* -------------  Search / Filter Form  --------------------------- */}
      <form
        action="/admin/categories"
        method="GET"
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-end"
      >
        {/* Search input */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-muted-foreground mb-1">
            Search by name or description
          </label>
          <input
            type="text"
            id="search"
            name="search"
            defaultValue={search}
            className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search categories…"
          />
        </div>

        {/* Month dropdown */}
        <div>
          <label htmlFor="month" className="block text-sm font-medium text-muted-foreground mb-1">
            Created month
          </label>
          <select
            id="month"
            name="month"
            defaultValue={month}
            className="rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All months</option>
            {months.map((m, idx) => (
              <option key={idx} value={idx + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Submit & Reset */}
        <div className="flex gap-2">
          <Button type="submit" variant="outline">
            Apply
          </Button>
          <Link href="/admin/categories" className="text-muted-foreground hover:underline">
            Reset
          </Link>
        </div>
      </form>

      <CategoriesTable
        categories={result.categories || []}
        pagination={result.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }}
      />
    </div>
  )
}
