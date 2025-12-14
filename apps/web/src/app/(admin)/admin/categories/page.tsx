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
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-white dark:bg-background p-6 rounded-xl border border-border">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="font-sans font-bold text-3xl text-secondary-foreground">Categories</h2>
        </div>
        <div className="flex">
            <Link href="/admin/categories/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Category
              </Button>
            </Link>
        </div>
      </div>
      <hr className='mb-10 border-border' />

      {/* -------------  Search / Filter Form  --------------------------- */}
      <form
        action="/admin/categories"
        method="GET"
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-end"
      >
        {/* Search input */}
        <div className="flex-1">
          <input
            type="text"
            id="search"
            name="search"
            defaultValue={search}
            className="w-full rounded-md border border-border h-10 p-2 focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search by name or description…"
          />
        </div>

        {/* Month dropdown */}
        <div>
          <select
            id="month"
            name="month"
            defaultValue={month}
            className="rounded-md border border-border h-10 px-8 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option className='text-muted-foreground' value="">All months</option>
            {months.map((m, idx) => (
              <option className='text-black dark:text-black' key={idx} value={idx + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Submit & Reset */}
        <div className="flex gap-2">
          <Button size="lg" type="submit" variant="default">
            Apply
          </Button>
          <Link href="/admin/categories">
            <Button size='lg' type="submit" variant="secondary" className="px-8">
              Reset
            </Button>
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
