'use server'

import { cache } from 'react'
import { revalidatePath } from 'next/cache'
import { prisma } from '@blog-starter/db'
import { generateSlug, ensureUniqueSlug } from '@/lib/utils/slug'
import { auth } from '@/lib/auth'

export interface CreatePostInput {
  title: string
  content: string
  excerpt?: string
  published?: boolean
  authorId: string
  tags?: string[]
  categoryIds?: string[]
  scheduledAt?: Date
}

export interface UpdatePostInput {
  title?: string
  content?: string
  excerpt?: string
  published?: boolean
  tags?: string[]
  categoryIds?: string[]
}

export async function getCurrentUserId() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return null
    }
    return session.user.id
  } catch (error) {
    console.error('Error getting current user ID:', error)
    return null
  }
}

export async function createPost(data: CreatePostInput) {
  try {
    const baseSlug = generateSlug(data.title)

    // If post is scheduled, ensure it's not published immediately
    const shouldPublish = data.scheduledAt ? false : data.published

    // Get existing slugs to ensure uniqueness
    const existingPosts = await prisma.post.findMany({
      where: {
        slug: {
          startsWith: baseSlug,
        },
      },
      select: { slug: true },
    })

    const existingSlugs = existingPosts.map(p => p.slug)
    const slug = ensureUniqueSlug(baseSlug, existingSlugs)

    const postData: any = {
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt,
      published: shouldPublish ?? false,
      authorId: data.authorId,
    }

    // Add scheduledAt if provided
    if (data.scheduledAt) {
      postData.scheduledAt = data.scheduledAt
    }

    const postDataWithRelations = {
      ...postData,
      tags: data.tags
        ? {
            connectOrCreate: data.tags.map(tag => ({
              where: { name: tag },
              create: { name: tag },
            })),
          }
        : undefined,
      categories:
        data.categoryIds && data.categoryIds.length > 0
          ? {
              connect: data.categoryIds.map(id => ({ id })),
            }
          : undefined,
    }

    const post = await prisma.post.create({
      data: postDataWithRelations,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: true,
        categories: true,
      },
    })

    revalidatePath('/')
    revalidatePath('/admin/posts')

    return { success: true, post }
  } catch (error) {
    console.error('Error creating post:', error)
    return { success: false, error: 'Failed to create post' }
  }
}

export async function updatePost(id: string, data: UpdatePostInput) {
  try {
    let slug: string | undefined

    if (data.title) {
      const baseSlug = generateSlug(data.title)
      const existingPosts = await prisma.post.findMany({
        where: {
          slug: {
            startsWith: baseSlug,
          },
          NOT: {
            id,
          },
        },
        select: { slug: true },
      })

      const existingSlugs = existingPosts.map(p => p.slug)
      slug = ensureUniqueSlug(baseSlug, existingSlugs)
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(slug && { slug }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
        ...(data.published !== undefined && { published: data.published }),
        ...(data.tags && {
          tags: {
            set: [],
            connectOrCreate: data.tags.map(tag => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        }),
        ...(data.categoryIds !== undefined && {
          categories: {
            set: data.categoryIds.length > 0 ? data.categoryIds.map(id => ({ id })) : [],
          },
        }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: true,
        categories: true,
      },
    })

    revalidatePath('/')
    revalidatePath('/admin/posts')
    revalidatePath(`/posts/${post.slug}`)

    return { success: true, post }
  } catch (error) {
    console.error('Error updating post:', error)
    return { success: false, error: 'Failed to update post' }
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: { id },
    })

    revalidatePath('/')
    revalidatePath('/admin/posts')

    return { success: true }
  } catch (error) {
    console.error('Error deleting post:', error)
    return { success: false, error: 'Failed to delete post' }
  }
}

export async function togglePublishPost(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: { published: true },
    })

    if (!post) {
      return { success: false, error: 'Post not found' }
    }

    const updated = await prisma.post.update({
      where: { id },
      data: { published: !post.published },
    })

    revalidatePath('/')
    revalidatePath('/admin/posts')

    return { success: true, post: updated }
  } catch (error) {
    console.error('Error toggling publish status:', error)
    return { success: false, error: 'Failed to toggle publish status' }
  }
}

export async function getPosts(options?: {
  published?: boolean
  page?: number
  limit?: number
  search?: string
  titleSearch?: string
  monthDate?: string // Format: YYYY-MM for month filtering
}) {
  try {
    const page = options?.page ?? 1
    const limit = options?.limit ?? 10
    const skip = (page - 1) * limit

    const where: any = {
      ...(options?.published !== undefined && { published: options.published }),
    }

    // Handle title search
    if (options?.titleSearch) {
      where.title = {
        contains: options.titleSearch,
        mode: 'insensitive' as const,
      }
    }

    // Handle general text search (title and content)
    if (options?.search && !options?.titleSearch) {
      where.OR = [
        { title: { contains: options.search, mode: 'insensitive' as const } },
        { content: { contains: options.search, mode: 'insensitive' as const } },
      ]
    }

    // Handle month/date filtering
    if (options?.monthDate) {
      const [year, month] = options.monthDate.split('-').map(Number)
      if (year && month) {
        const startDate = new Date(year, month - 1, 1) // First day of month
        const endDate = new Date(year, month, 0) // Last day of month (0 gets last day of previous month)

        where.createdAt = {
          gte: startDate,
          lte: endDate,
        }
      }
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tags: true,
          categories: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ])

    return {
      success: true,
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { success: false, error: 'Failed to fetch posts' }
  }
}

export async function getPostById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        tags: true,
        categories: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!post) {
      return { success: false, error: 'Post not found' }
    }

    return { success: true, post }
  } catch (error) {
    console.error('Error fetching post:', error)
    return { success: false, error: 'Failed to fetch post' }
  }
}

export const getPostBySlug = cache(async (slug: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        tags: true,
        categories: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!post) {
      return { success: false, error: 'Post not found' }
    }

    return { success: true, post }
  } catch (error) {
    console.error('Error fetching post:', error)
    return { success: false, error: 'Failed to fetch post' }
  }
})
