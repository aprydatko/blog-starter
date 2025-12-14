import { getPages, deletePage, togglePublishPage } from '@/lib/actions/pages'
import { PagesTable } from './pages-table'
import { Button } from '@blog-starter/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>
}

export default async function PagesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1
  const search = resolvedSearchParams.search || ''

  const result = await getPages({
    page,
    limit: 10,
    search: search || undefined,
  })

  if (!result.success) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Pages</h1>
        </div>
        <div className="text-destructive">Failed to load pages</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-white dark:bg-background p-6 rounded-xl border border-border">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="font-sans font-bold text-3xl text-secondary-foreground">Pages</h2>
        </div>
        <div className="flex">
          <Link href="/admin/pages/new">
            <Button className='flex justify-center gap-2'>
              <Plus className="mr-2 h-4 w-4" />
              New Page
            </Button>
          </Link>
        </div>
      </div>
      <hr className="mb-10 border-border" />

      <PagesTable
        pages={result.pages || []}
        pagination={result.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }}
      />
    </div>
  )
}
