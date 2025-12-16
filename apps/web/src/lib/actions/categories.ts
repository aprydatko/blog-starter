'use server'

import { startOfMonth, endOfMonth } from 'date-fns'
import { revalidatePath } from 'next/cache'
import { prisma } from '@blog-starter/db'
import { generateSlug, ensureUniqueSlug } from '@/lib/utils/slug'

export interface CreateCategoryInput {
  name: string
  description?: string
}

export interface UpdateCategoryInput {
  name?: string
  description?: string
}

export interface GetCategoriesOptions {
  page?: number
  limit?: number
  search?: string
  month?: string // “1”‑“12”, or undefined
}

export async function createCategory(data: CreateCategoryInput) {
  try {
    const baseSlug = generateSlug(data.name)

    // Get existing slugs to ensure uniqueness
    const existingCategories = await prisma.category.findMany({
      where: {
        slug: {
          startsWith: baseSlug,
        },
      },
      select: { slug: true },
    })

    const existingSlugs = existingCategories.map(c => c.slug)
    const slug = ensureUniqueSlug(baseSlug, existingSlugs)

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
      },
    })

    revalidatePath('/admin/categories')

    return { success: true, category }
  } catch (error) {
    console.error('Error creating category:', error)
    return { success: false, error: 'Failed to create category' }
  }
}

export async function updateCategory(id: string, data: UpdateCategoryInput) {
  try {
    let slug: string | undefined

    if (data.name) {
      const baseSlug = generateSlug(data.name)
      const existingCategories = await prisma.category.findMany({
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

      const existingSlugs = existingCategories.map(c => c.slug)
      slug = ensureUniqueSlug(baseSlug, existingSlugs)
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(slug && { slug }),
        ...(data.description !== undefined && { description: data.description }),
      },
    })

    revalidatePath('/admin/categories')

    return { success: true, category }
  } catch (error) {
    console.error('Error updating category:', error)
    return { success: false, error: 'Failed to update category' }
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    })

    revalidatePath('/admin/categories')

    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { success: false, error: 'Failed to delete category' }
  }
}

export async function getCategories(options?: GetCategoriesOptions) {
  try {
    const page = options?.page ?? 1
    const limit = options?.limit ?? 10
    const skip = (page - 1) * limit

    const where: any = {
      ...(options?.search && {
        OR: [
          { name: { contains: options.search, mode: 'insensitive' as const } },
          { description: { contains: options.search, mode: 'insensitive' as const } },
        ],
      }),
    }

    // --- Month filter ------------------------------------------
    if (options?.month) {
      const monthNum = parseInt(options.month, 10)
      if (monthNum >= 1 && monthNum <= 12) {
        const start = startOfMonth(new Date(new Date().getFullYear(), monthNum - 1))
        const end = endOfMonth(start)
        where.createdAt = { gte: start, lte: end }
      }
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      }),
      prisma.category.count({ where }),
    ])

    return {
      success: true,
      categories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { success: false, error: 'Failed to fetch categories' }
  }
}

export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })

    if (!category) {
      return { success: false, error: 'Category not found' }
    }

    return { success: true, category }
  } catch (error) {
    console.error('Error fetching category:', error)
    return { success: false, error: 'Failed to fetch category' }
  }
}

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    })

    return { success: true, categories }
  } catch (error) {
    console.error('Error fetching all categories:', error)
    return { success: false, error: 'Failed to fetch categories' }
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })

    if (!category) {
      return { success: false, error: 'Category not found' }
    }

    return { success: true, category }
  } catch (error) {
    console.error('Error fetching category:', error)
    return { success: false, error: 'Failed to fetch category' }
  }
}
