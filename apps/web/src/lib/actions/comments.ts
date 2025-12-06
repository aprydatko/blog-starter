'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@blog-starter/db'
import { auth } from '@/lib/auth'

export async function createComment(postId: string, content: string, postSlug: string) {
    const session = await auth()
    if (!session?.user?.id) {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                authorId: session.user.id
            }
        })

        revalidatePath(`/posts/${postSlug}`)
        return { success: true, comment }
    } catch (error) {
        console.error('Error creating comment:', error)
        return { success: false, error: 'Failed to create comment' }
    }
}
