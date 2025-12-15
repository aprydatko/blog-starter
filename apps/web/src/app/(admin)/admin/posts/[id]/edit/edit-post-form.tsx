'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@blog-starter/ui/button'
import { Input } from '@blog-starter/ui/input'
import { Textarea } from '@blog-starter/ui/textarea'
import { Label } from '@blog-starter/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@blog-starter/ui/card'
import { updatePost } from '@/lib/actions/posts'
import { getAllCategories } from '@/lib/actions/categories'
import { toast } from 'sonner'
import { Checkbox } from '@blog-starter/ui/checkbox'
import { useEffect } from 'react'
import TiptapEditor from '@/components/my-editor/tiptap-editor'

interface Post {
  id: string
  title: string
  content: string
  excerpt: string | null
  published: boolean
  tags: Array<{ id: string; name: string }>
  categories: Array<{ id: string; name: string }>
}

interface EditPostFormProps {
  post: Post
}

export function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(post.categories.map(c => c.id))
  const [formData, setFormData] = useState({
    title: post.title,
    content: post.content,
    excerpt: post.excerpt || '',
    published: post.published,
    tags: post.tags.map(t => t.name).join(', '),
  })

  useEffect(() => {
    async function fetchCategories() {
      const categoriesResult = await getAllCategories()
      if (categoriesResult.success && categoriesResult.categories) {
        setCategories(categoriesResult.categories)
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    const result = await updatePost(post.id, {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt || undefined,
      published: formData.published,
      tags: tags.length > 0 ? tags : undefined,
      categoryIds: selectedCategoryIds,
    })

    setLoading(false)

    if (result.success) {
      toast.success('Post updated successfully')
      router.push('/admin/posts')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to update post')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <Card className="border-none dark:bg-background">
          <CardHeader>
            <CardTitle className="text-base/7 font-semibold text-gray-900 dark:text-gray-300">Edit Post</CardTitle>
            <CardDescription className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
              This information will be displayed publicly so be careful what you share.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                Title *
              </Label>
              <Input
                id="title"
                className="block w-full shadow-none rounded-md bg-background dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white/50 outline-1 -outline-offset-1 outline-input placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-1 focus:outline-ring sm:text-sm/6"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter post title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                Excerpt
              </Label>
              <Textarea
                id="excerpt"
                className="block w-full shadow-none rounded-md bg-background dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white/50 outline-1 -outline-offset-1 outline-input placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-1 focus:outline-ring sm:text-sm/6"
                value={formData.excerpt}
                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary of the post"
                rows={3}
              />
              <p className="text-sm text-muted-foreground">A short description that appears in post listings</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <TiptapEditor content={formData.content} onChange={content => setFormData({ ...formData, content })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                Tags
              </Label>
              <Input
                id="tags"
                className="block w-full shadow-none rounded-md bg-background dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-input placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-1 focus:outline-ring sm:text-sm/6"
                value={formData.tags}
                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                placeholder="technology, web development, nextjs"
              />
              <p className="text-sm text-muted-foreground">Separate tags with commas</p>
            </div>

            <div className="space-y-2">
              <Label className="block text-sm/6 font-medium text-gray-900 dark:text-white">Categories</Label>
              <div className="space-y-2 border rounded-md p-4">
                {categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No categories available. Create categories first.</p>
                ) : (
                  categories.map(category => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        className="appearance-none rounded-sm border border-border bg-white checked:border-ring checked:bg-ring indeterminate:border-ring indeterminate:bg-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                        checked={selectedCategoryIds.includes(category.id)}
                        onCheckedChange={checked => {
                          if (checked) {
                            setSelectedCategoryIds([...selectedCategoryIds, category.id])
                          } else {
                            setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== category.id))
                          }
                        }}
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={e => setFormData({ ...formData, published: e.target.checked })}
                className="appearance-none rounded-sm border border-border bg-white checked:border-ring checked:bg-ring indeterminate:border-ring indeterminate:bg-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
              />
              <Label htmlFor="published" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                Published
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}
