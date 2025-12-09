'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { Badge } from '@blog-starter/ui/badge'
import { Button } from '@blog-starter/ui/button'
import { deletePost, togglePublishPost } from '@/lib/actions/posts'
import { toast } from 'sonner'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  slug: string
  published: boolean
  createdAt: Date
  author: {
    id: string
    name: string | null
    email: string | null
  }
  tags: Array<{ id: string; name: string }>
  categories: Array<{ id: string; name: string }>
  _count: {
    comments: number
  }
}

interface PostsTableProps {
  posts: Post[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export function PostsTable({ posts, pagination }: PostsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // Get current search parameters
  const currentSearch = searchParams.get('search') || ''
  const titleSearch = searchParams.get('titleSearch') || ''
  const monthDate = searchParams.get('monthDate') || ''

  // Build URL with search parameters
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams()
    params.set('page', page.toString())

    if (titleSearch) params.set('titleSearch', titleSearch)
    if (monthDate) params.set('monthDate', monthDate)
    if (currentSearch && !titleSearch) params.set('search', currentSearch)

    const paramsString = params.toString()
    return paramsString ? `/admin/posts?${paramsString}` : `/admin/posts?page=${page}`
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    setDeletingId(id)
    const result = await deletePost(id)
    setDeletingId(null)

    if (result.success) {
      toast.success('Post deleted successfully')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to delete post')
    }
  }

  const handleTogglePublish = async (id: string) => {
    setTogglingId(id)
    const result = await togglePublishPost(id)
    setTogglingId(null)

    if (result.success) {
      toast.success(result.post?.published ? 'Post published' : 'Post unpublished')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to update post')
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">Title</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Author</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Comments</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
              <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="h-24 text-center">
                  No posts found. Create your first post!
                </td>
              </tr>
            ) : (
              posts.map(post => (
                <tr key={post.id} className="border-b">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-muted-foreground">/{post.slug}</div>
                      {post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {post.categories.map(category => (
                            <Badge key={category.id} variant="outline" className="text-xs">
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{post.author.name || post.author.email}</div>
                  </td>
                  <td className="p-4">
                    <Badge variant={post.published ? 'success' : 'secondary'}>
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{post._count.comments}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{format(new Date(post.createdAt), 'MMM d, yyyy')}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTogglePublish(post.id)}
                        disabled={togglingId === post.id}
                      >
                        {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
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
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total posts)
          </div>
          <div className="flex gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNumber => (
              <Link key={pageNumber} href={buildPageUrl(pageNumber)}>
                <Button variant="outline" disabled={pagination.page === pageNumber}>
                  {pageNumber}
                </Button>
              </Link>
            ))}
          </div>
          <div className="flex gap-2">
            <Link
              href={buildPageUrl(pagination.page - 1)}
              className={pagination.page <= 1 ? 'pointer-events-none opacity-50' : ''}
            >
              <Button variant="outline" disabled={pagination.page <= 1}>
                Previous
              </Button>
            </Link>
            <Link
              href={buildPageUrl(pagination.page + 1)}
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
