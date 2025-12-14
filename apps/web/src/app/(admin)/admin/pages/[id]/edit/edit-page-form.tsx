'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@blog-starter/ui/button'
import { Input } from '@blog-starter/ui/input'
import { Label } from '@blog-starter/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@blog-starter/ui/card'
import { updatePage } from '@/lib/actions/pages'
import { toast } from 'sonner'
import TiptapEditor from '@/components/my-editor/tiptap-editor'
import { Checkbox } from '@blog-starter/ui/checkbox'

interface Page {
  id: string
  title: string
  content: string
  published: boolean
}

interface EditPageFormProps {
  page: Page
}

export function EditPageForm({ page }: EditPageFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: page.title,
    content: page.content,
    published: page.published,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await updatePage(page.id, {
      title: formData.title,
      content: formData.content,
      published: formData.published,
    })

    setLoading(false)

    if (result.success) {
      toast.success('Page updated successfully')
      router.push('/admin/pages')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to update page')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <Card className="border-none dark:bg-background">
          <CardHeader>
            <CardTitle className="text-base/7 font-semibold text-gray-900 dark:text-gray-300">Edit Page</CardTitle>
            <CardDescription className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
              This information will be displayed publicly so be careful what you share.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                Title *
              </Label>
              <Input
                id="title"
                className="block w-full shadow-none rounded-md bg-background dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white/50 outline-1 -outline-offset-1 outline-input placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-1 focus:outline-ring sm:text-sm/6"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter page title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                Content *
              </Label>
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
              <Label htmlFor="published" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                Published
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}
