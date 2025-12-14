import { getCategories } from '@/lib/actions/categories'
import { CategoriesTable } from './categories-table'
import { Button } from '@blog-starter/ui/button'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { months } from '@/lib/constants'
import { Label } from '@blog-starter/ui/label'
import { Input } from '@blog-starter/ui/input'

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
            <Button className="flex justify-center gap-2">
              <Plus className="h-4 w-4" />
              New Category
            </Button>
          </Link>
        </div>
      </div>
      <hr className="mb-10 border-border" />

      {/* -------------  Search / Filter Form  --------------------------- */}
      <form action="/admin/categories" method="GET" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search input */}
        <div className="space-y-2">
          <Label htmlFor="search" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
            Search by name or description
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              name="search"
              defaultValue={month}
              placeholder="Enter search..."
              className="block w-full shadow-none rounded-md bg-background dark:bg-white/5 px-3 py-1.5 pl-10 text-base text-gray-900 dark:text-white/50 outline-1 -outline-offset-1 outline-input placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-1 focus:outline-ring sm:text-sm/6"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="month" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
            Filter by Month
          </Label>
          <select
            id="month"
            name="month"
            defaultValue={month}
            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-background dark:bg-white/5 py-1.5 pr-8 pl-3 text-base text-gray-900 dark:text-white/50 outline-1 -outline-offset-1 outline-input focus:outline-1 focus:-outline-offset-1 focus:outline-ring sm:text-sm/6"
          >
            <option value="" className="text-muted-foreground">
              All months
            </option>
            {months.map((m, idx) => (
              <option className="text-black dark:text-black" key={idx} value={idx + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Submit & Reset */}
        <div className="flex items-end justify-end gap-4">
          <Button type="submit" variant="default" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
          <Link href="/admin/categories">
            <Button type="submit" variant="secondary">
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
