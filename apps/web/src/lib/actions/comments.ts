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
        authorId: session.user.id,
      },
    })

    revalidatePath(`/posts/${postSlug}`)
    return { success: true, comment }
  } catch (error) {
    console.error('Error creating comment:', error)
    return { success: false, error: 'Failed to create comment' }
  }
}

export async function getComments(options?: {
  page?: number
  limit?: number
  search?: string
  postId?: string
  authorId?: string
  sortBy?: 'asc' | 'desc'
}) {
  try {
    const page = options?.page ?? 1
    const limit = options?.limit ?? 10
    const skip = (page - 1) * limit
    const sortOrder = options?.sortBy ?? 'desc'

    const where = {
      ...(options?.postId && { postId: options.postId }),
      ...(options?.authorId && { authorId: options.authorId }),
      ...(options?.search && {
        content: { contains: options.search, mode: 'insensitive' as const },
      }),
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: sortOrder },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.comment.count({ where }),
    ])

    return {
      success: true,
      comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error('Error fetching comments:', error)
    return { success: false, error: 'Failed to fetch comments' }
  }
}

export async function deleteComment(id: string) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    await prisma.comment.delete({
      where: { id },
    })

    revalidatePath('/admin/comments')
    return { success: true }
  } catch (error) {
    console.error('Error deleting comment:', error)
    return { success: false, error: 'Failed to delete comment' }
  }
}

export async function getAllPostsForFilter() {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, posts }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { success: false, error: 'Failed to fetch posts', posts: [] }
  }
}

export async function getAllUsersForFilter() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, users }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { success: false, error: 'Failed to fetch users', users: [] }
  }
}
