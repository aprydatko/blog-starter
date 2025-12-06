import { getCategories } from '@/lib/actions/categories'
import { CategoriesTable } from './categories-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>
}

export default async function CategoriesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1
  const search = resolvedSearchParams.search || ''

  const result = await getCategories({
    page,
    limit: 10,
    search: search || undefined
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
          <p className="text-muted-foreground">
            Manage your blog categories
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Category
          </Button>
        </Link>
      </div>

      <CategoriesTable
        categories={result.categories || []}
        pagination={result.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }}
      />
    </div>
  )
}

