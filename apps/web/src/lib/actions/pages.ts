'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@blog-starter/db'
import { generateSlug, ensureUniqueSlug } from '@/lib/utils/slug'

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
                    startsWith: baseSlug
                }
            },
            select: { slug: true }
        })

        const existingSlugs = existingPages.map(p => p.slug)
        const slug = ensureUniqueSlug(baseSlug, existingSlugs)

        const page = await prisma.page.create({
            data: {
                title: data.title,
                slug,
                content: data.content,
                published: data.published ?? false
            }
        })

        revalidatePath('/admin/pages')
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
                        startsWith: baseSlug
                    },
                    NOT: {
                        id
                    }
                },
                select: { slug: true }
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
                ...(data.published !== undefined && { published: data.published })
            }
        })

        revalidatePath('/admin/pages')
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
            where: { id }
        })

        revalidatePath('/admin/pages')
        return { success: true }
    } catch (error) {
        console.error('Error deleting page:', error)
        return { success: false, error: 'Failed to delete page' }
    }
}

export async function getPages() {
    try {
        const pages = await prisma.page.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, pages }
    } catch (error) {
        console.error('Error fetching pages:', error)
        return { success: false, error: 'Failed to fetch pages' }
    }
}

export async function getPageBySlug(slug: string) {
    try {
        const page = await prisma.page.findUnique({
            where: { slug }
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
