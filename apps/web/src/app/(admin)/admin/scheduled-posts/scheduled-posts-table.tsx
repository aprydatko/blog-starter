'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar, Clock, Edit, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Badge } from '@blog-starter/ui/badge'
import { Button } from '@blog-starter/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@blog-starter/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@blog-starter/ui/tooltip'

import { PostWithRelations } from '@/types/post'
import { unschedulePost } from '@/lib/actions/scheduled-posts'

type ScheduledPostsTableProps = {
  initialPosts: PostWithRelations[]
}

export function ScheduledPostsTable({ initialPosts }: ScheduledPostsTableProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  const handleUnschedule = async (id: string) => {
    try {
      setIsDeleting(id)
      const result = await unschedulePost(id)

      if (result.success) {
        setPosts(posts.filter(post => post.id !== id))
        toast.success('Post unscheduled successfully')
      } else {
        toast.error(result.error || 'Failed to unschedule post')
      }
    } catch (error) {
      console.error('Error unscheduling post:', error)
      toast.error('An error occurred while unscheduling the post')
    } finally {
      setIsDeleting(null)
    }
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No scheduled posts found.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Scheduled For</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map(post => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span>{post.title}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">{post.author?.name || 'Unknown'}</div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {post.categories.map(category => (
                    <Badge key={category.id} variant="secondary">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {post.tags.map(tag => (
                    <Badge key={tag.id} variant="outline">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  {post.scheduledAt ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>{format(new Date(post.scheduledAt), 'MMM d, yyyy h:mm a')}</TooltipTrigger>
                        <TooltipContent>
                          {format(new Date(post.scheduledAt), 'EEEE, MMMM d, yyyy h:mm a')}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    'Not scheduled'
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/posts/${post.id}/edit`)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleUnschedule(post.id)}
                    disabled={isDeleting === post.id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Unschedule</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
