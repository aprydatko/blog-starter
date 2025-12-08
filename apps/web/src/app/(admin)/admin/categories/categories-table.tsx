'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@blog-starter/ui/button'
import { deleteCategory } from '@/lib/actions/categories'
import { toast } from 'sonner'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: Date
  _count: {
    posts: number
  }
}

interface CategoriesTableProps {
  categories: Category[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export function CategoriesTable({ categories, pagination }: CategoriesTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    setDeletingId(id)
    const result = await deleteCategory(id)
    setDeletingId(null)

    if (result.success) {
      toast.success('Category deleted successfully')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to delete category')
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">
                Name
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Slug
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Description
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Posts
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Created
              </th>
              <th className="h-12 px-4 text-right align-middle font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="h-24 text-center">
                  No categories found. Create your first category!
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="border-b">
                  <td className="p-4">
                    <div className="font-medium">{category.name}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground">
                      /{category.slug}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground max-w-md truncate">
                      {category.description || '-'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{category._count.posts}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      {format(new Date(category.createdAt), 'MMM d, yyyy')}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category.id)}
                        disabled={deletingId === category.id}
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
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total categories)
          </div>
          <div className="flex gap-2">
            <Link
              href={`/admin/categories?page=${pagination.page - 1}`}
              className={pagination.page <= 1 ? 'pointer-events-none opacity-50' : ''}
            >
              <Button variant="outline" disabled={pagination.page <= 1}>
                Previous
              </Button>
            </Link>
            <Link
              href={`/admin/categories?page=${pagination.page + 1}`}
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

