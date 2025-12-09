'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@blog-starter/ui/button'
import { Input } from '@blog-starter/ui/input'
import { Label } from '@blog-starter/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@blog-starter/ui/card'
import { createPage } from '@/lib/actions/pages'
import { toast } from 'sonner'
import TiptapEditor from '@/components/my-editor/tiptap-editor'

export default function NewPagePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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

    try {
      const result = await createPage({
        title: formData.title.trim(),
        content: formData.content,
        published: formData.published,
      })

      if (result.success) {
        toast.success('Page created successfully')
        router.push('/admin/pages')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to create page')
      }
    } catch (error) {
      console.error('Error creating page:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Page</h1>
        <p className="text-muted-foreground">Create a new static page</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter page title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <TiptapEditor content={formData.content} onChange={content => setFormData({ ...formData, content })} />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={e => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Page'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
