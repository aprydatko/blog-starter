'use server'

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
}

export interface UpdatePostInput {
    title?: string
    content?: string
    excerpt?: string
    published?: boolean
    tags?: string[]
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

        // Get existing slugs to ensure uniqueness
        const existingPosts = await prisma.post.findMany({
            where: {
                slug: {
                    startsWith: baseSlug
                }
            },
            select: { slug: true }
        })

        const existingSlugs = existingPosts.map(p => p.slug)
        const slug = ensureUniqueSlug(baseSlug, existingSlugs)

        const post = await prisma.post.create({
            data: {
                title: data.title,
                slug,
                content: data.content,
                excerpt: data.excerpt,
                published: data.published ?? false,
                authorId: data.authorId,
                tags: data.tags ? {
                    connectOrCreate: data.tags.map(tag => ({
                        where: { name: tag },
                        create: { name: tag }
                    }))
                } : undefined
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                tags: true
            }
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
                        startsWith: baseSlug
                    },
                    NOT: {
                        id
                    }
                },
                select: { slug: true }
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
                            create: { name: tag }
                        }))
                    }
                })
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                tags: true
            }
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
            where: { id }
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
            select: { published: true }
        })

        if (!post) {
            return { success: false, error: 'Post not found' }
        }

        const updated = await prisma.post.update({
            where: { id },
            data: { published: !post.published }
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
}) {
    try {
        const page = options?.page ?? 1
        const limit = options?.limit ?? 10
        const skip = (page - 1) * limit

        const where = {
            ...(options?.published !== undefined && { published: options.published }),
            ...(options?.search && {
                OR: [
                    { title: { contains: options.search, mode: 'insensitive' as const } },
                    { content: { contains: options.search, mode: 'insensitive' as const } }
                ]
            })
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
                            email: true
                        }
                    },
                    tags: true,
                    _count: {
                        select: {
                            comments: true
                        }
                    }
                }
            }),
            prisma.post.count({ where })
        ])

        return {
            success: true,
            posts,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
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
                        image: true
                    }
                },
                tags: true,
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
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

export async function getPostBySlug(slug: string) {
    try {
        const post = await prisma.post.findUnique({
            where: { slug },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                },
                tags: true,
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
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
