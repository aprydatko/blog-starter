'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Trash2, Search } from 'lucide-react'
import { Button } from '@blog-starter/ui/button'
import { Input } from '@blog-starter/ui/input'
import { deleteComment } from '@/lib/actions/comments'
import { toast } from 'sonner'
import Link from 'next/link'

interface Comment {
    id: string
    content: string
    createdAt: Date
    post: {
        id: string
        title: string
        slug: string
    }
    author: {
        id: string
        name: string | null
        email: string | null
    }
}

interface Post {
    id: string
    title: string
}

interface User {
    id: string
    name: string | null
    email: string | null
}

interface CommentsTableProps {
    comments: Comment[]
    pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
    posts: Post[]
    users: User[]
    currentFilters: {
        search: string
        postId: string
        authorId: string
        sortBy: string
    }
}

function buildQueryString(filters: {
    page?: number
    search?: string
    postId?: string
    authorId?: string
    sortBy?: string
}) {
    const params = new URLSearchParams()
    if (filters.page && filters.page > 1) {
        params.set('page', filters.page.toString())
    }
    if (filters.search) {
        params.set('search', filters.search)
    }
    if (filters.postId) {
        params.set('postId', filters.postId)
    }
    if (filters.authorId) {
        params.set('authorId', filters.authorId)
    }
    if (filters.sortBy && filters.sortBy !== 'desc') {
        params.set('sortBy', filters.sortBy)
    }
    return params.toString() ? `?${params.toString()}` : ''
}

export function CommentsTable({
    comments,
    pagination,
    posts,
    users,
    currentFilters
}: CommentsTableProps) {
    const router = useRouter()
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [searchValue, setSearchValue] = useState(currentFilters.search)
    const [postIdFilter, setPostIdFilter] = useState(currentFilters.postId)
    const [authorIdFilter, setAuthorIdFilter] = useState(currentFilters.authorId)
    const [sortByFilter, setSortByFilter] = useState(currentFilters.sortBy)

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return

        setDeletingId(id)
        const result = await deleteComment(id)
        setDeletingId(null)

        if (result.success) {
            toast.success('Comment deleted successfully')
            router.refresh()
        } else {
            toast.error(result.error || 'Failed to delete comment')
        }
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const query = buildQueryString({
            page: 1,
            search: searchValue || undefined,
            postId: postIdFilter || undefined,
            authorId: authorIdFilter || undefined,
            sortBy: sortByFilter || undefined
        })
        router.push(`/admin/comments${query}`)
    }

    const handleFilterChange = (filterType: 'postId' | 'authorId' | 'sortBy', value: string) => {
        if (filterType === 'postId') {
            setPostIdFilter(value)
        } else if (filterType === 'authorId') {
            setAuthorIdFilter(value)
        } else if (filterType === 'sortBy') {
            setSortByFilter(value)
        }

        const newFilters = {
            ...currentFilters,
            [filterType]: value
        }

        const query = buildQueryString({
            page: 1,
            search: newFilters.search || undefined,
            postId: newFilters.postId || undefined,
            authorId: newFilters.authorId || undefined,
            sortBy: newFilters.sortBy || undefined
        })
        router.push(`/admin/comments${query}`)
    }

    const truncateContent = (content: string, maxLength: number = 100) => {
        if (content.length <= maxLength) return content
        return content.substring(0, maxLength) + '...'
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="rounded-md border p-4 space-y-4">
                <form onSubmit={handleSearchSubmit} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label htmlFor="search" className="text-sm font-medium mb-2 block">
                            Search Content
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search"
                                type="text"
                                placeholder="Search comments..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                    <div className="w-48">
                        <label htmlFor="postId" className="text-sm font-medium mb-2 block">
                            Filter by Post
                        </label>
                        <select
                            id="postId"
                            value={postIdFilter}
                            onChange={(e) => handleFilterChange('postId', e.target.value)}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="">All Posts</option>
                            {posts.map((post) => (
                                <option key={post.id} value={post.id}>
                                    {post.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-48">
                        <label htmlFor="authorId" className="text-sm font-medium mb-2 block">
                            Filter by Author
                        </label>
                        <select
                            id="authorId"
                            value={authorIdFilter}
                            onChange={(e) => handleFilterChange('authorId', e.target.value)}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="">All Authors</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name || user.email || 'Unknown'}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-40">
                        <label htmlFor="sortBy" className="text-sm font-medium mb-2 block">
                            Sort by Date
                        </label>
                        <select
                            id="sortBy"
                            value={sortByFilter}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                    </div>
                    <Button type="submit">Search</Button>
                </form>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="h-12 px-4 text-left align-middle font-medium">
                                Content
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                                Post
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                                Author
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                                Date
                            </th>
                            <th className="h-12 px-4 text-right align-middle font-medium">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="h-24 text-center">
                                    No comments found.
                                </td>
                            </tr>
                        ) : (
                            comments.map((comment) => (
                                <tr key={comment.id} className="border-b">
                                    <td className="p-4">
                                        <div className="text-sm max-w-md">
                                            {truncateContent(comment.content)}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Link
                                            href={`/posts/${comment.post.slug}`}
                                            className="text-sm text-primary hover:underline"
                                        >
                                            {comment.post.title}
                                        </Link>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm">
                                            {comment.author.name || comment.author.email || 'Unknown'}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm">
                                            {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(comment.id)}
                                                disabled={deletingId === comment.id}
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
                        Page {pagination.page} of {pagination.totalPages} ({pagination.total} total comments)
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/comments${buildQueryString({
                                page: pagination.page - 1,
                                search: currentFilters.search || undefined,
                                postId: currentFilters.postId || undefined,
                                authorId: currentFilters.authorId || undefined,
                                sortBy: currentFilters.sortBy || undefined
                            })}`}
                            className={pagination.page <= 1 ? 'pointer-events-none opacity-50' : ''}
                        >
                            <Button variant="outline" disabled={pagination.page <= 1}>
                                Previous
                            </Button>
                        </Link>
                        <Link
                            href={`/admin/comments${buildQueryString({
                                page: pagination.page + 1,
                                search: currentFilters.search || undefined,
                                postId: currentFilters.postId || undefined,
                                authorId: currentFilters.authorId || undefined,
                                sortBy: currentFilters.sortBy || undefined
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

