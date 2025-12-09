'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@blog-starter/db'
import { generateSlug, ensureUniqueSlug } from '@/lib/utils/slug'
import { cache } from 'react'

export interface CreatePageInput {
  title: string
  content: string
  published?: boolean
}

export interface UpdatePageInput {
  title?: string
  content?: string
  published?: boolean
}

export async function createPage(data: CreatePageInput) {
  try {
    const baseSlug = generateSlug(data.title)
    const existingPages = await prisma.page.findMany({
      where: {
        slug: {
          startsWith: baseSlug,
        },
      },
      select: { slug: true },
    })

    const existingSlugs = existingPages.map(p => p.slug)
    const slug = ensureUniqueSlug(baseSlug, existingSlugs)

    const page = await prisma.page.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        published: data.published ?? false,
      },
    })

    revalidatePath('/admin/pages')
    revalidatePath('/')

    return { success: true, page }
  } catch (error) {
    console.error('Error creating page:', error)
    return { success: false, error: 'Failed to create page' }
  }
}

export async function updatePage(id: string, data: UpdatePageInput) {
  try {
    let slug: string | undefined

    if (data.title) {
      const baseSlug = generateSlug(data.title)
      const existingPages = await prisma.page.findMany({
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

      const existingSlugs = existingPages.map(p => p.slug)
      slug = ensureUniqueSlug(baseSlug, existingSlugs)
    }

    const page = await prisma.page.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(slug && { slug }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.published !== undefined && { published: data.published }),
      },
    })

    revalidatePath('/admin/pages')
    revalidatePath('/')
    revalidatePath(`/pages/${page.slug}`)

    return { success: true, page }
  } catch (error) {
    console.error('Error updating page:', error)
    return { success: false, error: 'Failed to update page' }
  }
}

export async function deletePage(id: string) {
  try {
    await prisma.page.delete({
      where: { id },
    })

    revalidatePath('/admin/pages')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Error deleting page:', error)
    return { success: false, error: 'Failed to delete page' }
  }
}

export async function getPages(options?: { published?: boolean; page?: number; limit?: number; search?: string }) {
  try {
    const page = options?.page ?? 1
    const limit = options?.limit ?? 10
    const skip = (page - 1) * limit

    const where = {
      ...(options?.published !== undefined && { published: options.published }),
      ...(options?.search && {
        OR: [
          { title: { contains: options.search, mode: 'insensitive' as const } },
          { content: { contains: options.search, mode: 'insensitive' as const } },
        ],
      }),
    }

    const [pages, total] = await Promise.all([
      prisma.page.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.page.count({ where }),
    ])

    return {
      success: true,
      pages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error('Error fetching pages:', error)
    return { success: false, error: 'Failed to fetch pages' }
  }
}

export async function getPageById(id: string) {
  try {
    const page = await prisma.page.findUnique({
      where: { id },
    })

    if (!page) {
      return { success: false, error: 'Page not found' }
    }

    return { success: true, page }
  } catch (error) {
    console.error('Error fetching page:', error)
    return { success: false, error: 'Failed to fetch page' }
  }
}

export async function togglePublishPage(id: string) {
  try {
    const page = await prisma.page.findUnique({
      where: { id },
      select: { published: true },
    })

    if (!page) {
      return { success: false, error: 'Page not found' }
    }

    const updated = await prisma.page.update({
      where: { id },
      data: { published: !page.published },
    })

    revalidatePath('/admin/pages')

    return { success: true, page: updated }
  } catch (error) {
    console.error('Error toggling publish status:', error)
    return { success: false, error: 'Failed to toggle publish status' }
  }
}

export const getPageBySlug = cache(async (slug: string) => {
  try {
    const page = await prisma.page.findUnique({
      where: { slug },
    })

    if (!page) {
      return { success: false, error: 'Page not found' }
    }

    return { success: true, page }
  } catch (error) {
    console.error('Error fetching page:', error)
    return { success: false, error: 'Failed to fetch page' }
  }
})
