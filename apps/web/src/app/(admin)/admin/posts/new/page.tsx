'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@blog-starter/ui/button'
import { Input } from '@blog-starter/ui/input'
import { Textarea } from '@blog-starter/ui/textarea'
import { Label } from '@blog-starter/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@blog-starter/ui/card'
import { createPost, getCurrentUserId } from '@/lib/actions/posts'
import { getAllCategories } from '@/lib/actions/categories'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { Checkbox } from '@blog-starter/ui/checkbox'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar } from '@blog-starter/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@blog-starter/ui/popover'
import TiptapEditor from '@/components/my-editor/tiptap-editor'

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
    tags: '',
    schedulePost: false,
    scheduledAt: undefined as Date | undefined,
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

    // Validate scheduled date if scheduling is enabled
    if (formData.schedulePost && !formData.scheduledAt) {
      toast.error('Please select a date and time for scheduling')
      return
    }

    setLoading(true)

    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    try {
      const postData = {
        title: formData.title.trim(),
        content: formData.content,
        excerpt: formData.excerpt.trim() || undefined,
        published: formData.schedulePost ? false : formData.published, // Don't publish immediately if scheduling
        scheduledAt: formData.schedulePost ? formData.scheduledAt : undefined,
        authorId,
        tags: tags.length > 0 ? tags : undefined,
        categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
      }

      const result = await createPost(postData)

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
    <div className="bg-white dark:bg-gray-900 scheme-dark border border-border rounded-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <Card className="border-none dark:bg-background">
                <CardHeader>
                  <CardTitle className="text-base/7 font-semibold text-gray-900 dark:text-gray-300">Add Post</CardTitle>
                  <CardDescription className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                    This information will be displayed publicly so be careful what you share.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Title *</Label>
                    <Input
                      id="title"
                      className="block w-full shadow-none rounded-md bg-background dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-input placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-1 focus:outline-ring sm:text-sm/6"
                      placeholder="Enter post title"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="published"
                          className="appearance-none rounded-sm border border-border bg-white checked:border-ring checked:bg-ring indeterminate:border-ring indeterminate:bg-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                          checked={formData.published}
                          onCheckedChange={checked => {
                            // If scheduling is enabled, don't allow direct publishing
                            if (formData.schedulePost) {
                              setFormData(prev => ({ ...prev, published: false }))
                              return
                            }
                            setFormData(prev => ({ ...prev, published: checked === true }))
                          }}
                          disabled={loading || formData.schedulePost}
                        />
                        <Label htmlFor="published" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Publish immediately</Label>
                      </div>
                      {formData.schedulePost && (
                        <p className="text-sm text-muted-foreground">
                          Post will be scheduled instead of published immediately
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="schedule"
                          className="appearance-none rounded-sm border border-border bg-white checked:border-ring checked:bg-ring indeterminate:border-ring indeterminate:bg-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                          checked={formData.schedulePost}
                          onCheckedChange={checked => {
                            const isScheduling = checked === true
                            setFormData(prev => ({
                              ...prev,
                              schedulePost: isScheduling,
                              // If enabling scheduling, uncheck published
                              ...(isScheduling && { published: false }),
                            }))
                          }}
                          disabled={loading}
                        />
                        <Label htmlFor="schedule" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Schedule for later</Label>
                      </div>
                    </div>
                  </div>

                  {formData.schedulePost && (
                    <div className="space-y-2">
                      <Label className="block text-sm/6 font-medium text-gray-900 dark:text-white">Schedule Date & Time *</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Calendar
                            selected={formData.scheduledAt}
                            onSelect={date => {
                              if (!date) return
                              // Keep the existing time if we have one, otherwise set to current time
                              const currentTime = formData.scheduledAt || new Date()
                              const newDate = new Date(date)
                              newDate.setHours(currentTime.getHours(), currentTime.getMinutes(), 0, 0)
                              setFormData(prev => ({ ...prev, scheduledAt: newDate }))
                            }}
                          />
                        <Input
                          type="time"
                          className="block w-full shadow-none rounded-md bg-background dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-input placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-1 focus:outline-ring sm:text-sm/6"
                          value={formData.scheduledAt ? format(formData.scheduledAt, 'HH:mm') : ''}
                          onChange={e => {
                            if (!formData.scheduledAt) return
                            const [hours, minutes] = e.target.value.split(':').map(Number)
                            const newDate = new Date(formData.scheduledAt)
                            newDate.setHours(hours!, minutes)
                            setFormData(prev => ({ ...prev, scheduledAt: newDate }))
                          }}
                          disabled={!formData.scheduledAt}
                        />
                      </div>
                      {formData.scheduledAt && (
                        <p className="text-sm text-muted-foreground">
                          Post will be published on {format(formData.scheduledAt, 'PPPppp')}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="excerpt" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      className="block w-full shadow-none rounded-md bg-background dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-input placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-1 focus:outline-ring sm:text-sm/6"
                      value={formData.excerpt}
                      onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief summary of the post"
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground">A short description that appears in post listings</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Content *</Label>
                    {/* <TiptapEditor content={formData.content} onChange={content => setFormData({ ...formData, content })} /> */}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Tags</Label>
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
                    <div className="space-y-2 border border-border rounded-md p-4 bg-background dark:bg-white/5">
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
                </CardContent>
              </Card>
              <div className="flex justify-end gap-4">
                <Button type="submit" disabled={loading || !authorId}>
                  {loading ? 'Creating...' : 'Create'}
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
