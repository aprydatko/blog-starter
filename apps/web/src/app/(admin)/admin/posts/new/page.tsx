'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createPost, getCurrentUserId } from '@/lib/actions/posts'
import { getAllCategories } from '@/lib/actions/categories'
import { toast } from 'sonner'
import { TiptapEditor } from '@/components/editor/tiptap-editor'
import { useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'

export default function NewPostPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [authorId, setAuthorId] = useState<string | null>(null)
    const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        published: false,
        tags: ''
    })

    useEffect(() => {
        async function fetchData() {
            const userId = await getCurrentUserId()
            if (!userId) {
                toast.error('You must be logged in to create a post')
                router.push('/login')
                return
            }
            setAuthorId(userId)

            const categoriesResult = await getAllCategories()
            if (categoriesResult.success && categoriesResult.categories) {
                setCategories(categoriesResult.categories)
            }
        }
        fetchData()
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!authorId) {
            toast.error('You must be logged in to create a post')
            return
        }

        // Client-side validation
        if (!formData.title.trim()) {
            toast.error('Title is required')
            return
        }

        // Check if content is not empty (strip HTML tags for validation)
        const textContent = formData.content.replace(/<[^>]*>/g, '').trim()
        if (!textContent) {
            toast.error('Content is required')
            return
        }

        setLoading(true)

        const tags = formData.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)

        try {
            const result = await createPost({
                title: formData.title.trim(),
                content: formData.content,
                excerpt: formData.excerpt.trim() || undefined,
                published: formData.published,
                authorId,
                tags: tags.length > 0 ? tags : undefined,
                categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined
            })

            if (result.success) {
                toast.success('Post created successfully')
                router.push('/admin/posts')
                router.refresh()
            } else {
                toast.error(result.error || 'Failed to create post')
            }
        } catch (error) {
            console.error('Error creating post:', error)
            toast.error('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Create New Post</h1>
                <p className="text-muted-foreground">
                    Write and publish a new blog post
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Post Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter post title"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Excerpt</Label>
                                <Textarea
                                    id="excerpt"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    placeholder="Brief summary of the post"
                                    rows={3}
                                />
                                <p className="text-sm text-muted-foreground">
                                    A short description that appears in post listings
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Content *</Label>
                                <TiptapEditor
                                    content={formData.content}
                                    onChange={(content) => setFormData({ ...formData, content })}
                                    placeholder="Write your post content here..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags</Label>
                                <Input
                                    id="tags"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    placeholder="technology, web development, nextjs"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Separate tags with commas
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Categories</Label>
                                <div className="space-y-2 border rounded-md p-4">
                                    {categories.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">
                                            No categories available. Create categories first.
                                        </p>
                                    ) : (
                                        categories.map((category) => (
                                            <div key={category.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`category-${category.id}`}
                                                    checked={selectedCategoryIds.includes(category.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedCategoryIds([...selectedCategoryIds, category.id])
                                                        } else {
                                                            setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== category.id))
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor={`category-${category.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {category.name}
                                                </label>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="published"
                                    checked={formData.published}
                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor="published">Publish immediately</Label>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={loading || !authorId}>
                            {loading ? 'Creating...' : 'Create Post'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
