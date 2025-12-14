'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@blog-starter/ui/button'
import { Input } from '@blog-starter/ui/input'
import { Label } from '@blog-starter/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@blog-starter/ui/card'
import { createPage } from '@/lib/actions/pages'
import { toast } from 'sonner'
import TiptapEditor from '@/components/my-editor/tiptap-editor'
import { Checkbox } from '@blog-starter/ui/checkbox'

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
    <div className="bg-white dark:bg-gray-900 scheme-dark border border-border rounded-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <Card className="border-none dark:bg-background">
                <CardHeader>
                  <CardTitle className="text-base/7 font-semibold text-gray-900 dark:text-gray-300">Add Page</CardTitle>
                  <CardDescription className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                    This information will be displayed publicly so be careful what you share.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Title *</Label>
                    <Input
                      id="title"
                      className="block w-full shadow-none rounded-md bg-background dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-input placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-1 focus:outline-ring sm:text-sm/6"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter page title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Content *</Label>
                    {/* <TiptapEditor content={formData.content} onChange={content => setFormData({ ...formData, content })} /> */}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={e => setFormData({ ...formData, published: e.target.checked })}
                      className="appearance-none rounded-sm border border-border bg-white checked:border-ring checked:bg-ring indeterminate:border-ring indeterminate:bg-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                    />
                    <Label htmlFor="published" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Publish immediately</Label>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Page'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
