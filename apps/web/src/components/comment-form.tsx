'use client'

import { useRef, useState } from 'react'
import { Button } from '@blog-starter/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import TiptapEditor, { TiptapEditorRef  } from "@/components/my-editor/comment-editor"

interface CommentFormProps {
  postId: string
  postSlug: string
}

export function CommentForm({ postId, postSlug }: CommentFormProps) {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const editorRef = useRef<TiptapEditorRef>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate content (remove HTML tags and check if there's actual text)
    const textContent = content.replace(/<[^>]*>/g, '').trim()
    if (!textContent) {
      toast.error('Please enter a comment')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          postId,
          postSlug,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to post comment')
      }

      toast.success('Comment added successfully')
      setContent('')
      router.refresh()
    } catch (error) {
      console.error('Error posting comment:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to post comment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg border bg-card">
          <TiptapEditor ref={editorRef} content={content} onChange={content => setContent(content)} />
          <div className="flex items-center justify-end p-2 border-t">
            <Button 
              type="submit" 
              disabled={loading || !content.trim()}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Comment'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
