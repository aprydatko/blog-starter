'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@blog-starter/ui/button'
import { Input } from '@blog-starter/ui/input'
import { Textarea } from '@blog-starter/ui/textarea'
import { Label } from '@blog-starter/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@blog-starter/ui/card'
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-muted-foreground">Write and publish a new blog post</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
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
                    <Label htmlFor="published">Publish immediately</Label>
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
                    <Label htmlFor="schedule">Schedule for later</Label>
                  </div>
                </div>
              </div>

              {formData.schedulePost && (
                <div className="space-y-2">
                  <Label>Schedule Date & Time *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !formData.scheduledAt && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.scheduledAt ? format(formData.scheduledAt, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
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
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="time"
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
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
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
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="technology, web development, nextjs"
                />
                <p className="text-sm text-muted-foreground">Separate tags with commas</p>
              </div>

              <div className="space-y-2">
                <Label>Categories</Label>
                <div className="space-y-2 border rounded-md p-4">
                  {categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No categories available. Create categories first.</p>
                  ) : (
                    categories.map(category => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
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
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading || !authorId}>
              {loading ? 'Creating...' : 'Create Post'}
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
