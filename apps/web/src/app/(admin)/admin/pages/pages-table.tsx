'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { Badge } from '@blog-starter/ui/badge'
import { Button } from '@blog-starter/ui/button'
import { deletePage, togglePublishPage } from '@/lib/actions/pages'
import { toast } from 'sonner'
import Link from 'next/link'

interface Page {
  id: string
  title: string
  slug: string
  published: boolean
  createdAt: Date
}

interface PagesTableProps {
  pages: Page[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export function PagesTable({ pages, pagination }: PagesTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return

    setDeletingId(id)
    const result = await deletePage(id)
    setDeletingId(null)

    if (result.success) {
      toast.success('Page deleted successfully')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to delete page')
    }
  }

  const handleTogglePublish = async (id: string) => {
    setTogglingId(id)
    const result = await togglePublishPage(id)
    setTogglingId(null)

    if (result.success) {
      toast.success(result.page?.published ? 'Page published' : 'Page unpublished')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to update page')
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/25">
              <th className="h-12 px-4 text-left align-middle font-medium">Title</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
              <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 ? (
              <tr>
                <td colSpan={4} className="h-24 text-center">
                  No pages found. Create your first page!
                </td>
              </tr>
            ) : (
              pages.map(page => (
                <tr key={page.id}>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{page.title}</div>
                      <div className="text-sm text-muted-foreground">/{page.slug}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={page.published ? 'success' : 'secondary'}>
                      {page.published ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{format(new Date(page.createdAt), 'MMM d, yyyy')}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/pages/${page.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTogglePublish(page.id)}
                        disabled={togglingId === page.id}
                      >
                        {page.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(page.id)}
                        disabled={deletingId === page.id}
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

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total pages)
          </div>
          <div className="flex gap-2">
            <Link
              href={`/admin/pages?page=${pagination.page - 1}`}
              className={pagination.page <= 1 ? 'pointer-events-none opacity-50' : ''}
            >
              <Button variant="outline" disabled={pagination.page <= 1}>
                Previous
              </Button>
            </Link>
            <Link
              href={`/admin/pages?page=${pagination.page + 1}`}
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
