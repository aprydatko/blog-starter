'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { createComment } from '@/lib/actions/comments'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface CommentFormProps {
    postId: string
    postSlug: string
}

export function CommentForm({ postId, postSlug }: CommentFormProps) {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        setLoading(true)
        const result = await createComment(postId, content, postSlug)
        setLoading(false)

        if (result.success) {
            setContent('')
            toast.success('Comment added')
            router.refresh()
        } else {
            toast.error(result.error || 'Failed to add comment')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
                placeholder="Write a comment..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                required
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={loading || !content.trim()}>
                    {loading ? 'Posting...' : 'Post Comment'}
                </Button>
            </div>
        </form>
    )
}
