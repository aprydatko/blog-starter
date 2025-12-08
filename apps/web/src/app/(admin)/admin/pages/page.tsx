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
        search: search || undefined
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Pages</h1>
                    <p className="text-muted-foreground">
                        Manage your static pages
                    </p>
                </div>
                <Link href="/admin/pages/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Page
                    </Button>
                </Link>
            </div>

            <PagesTable
                pages={result.pages || []}
                pagination={result.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }}
            />
        </div>
    )
}

