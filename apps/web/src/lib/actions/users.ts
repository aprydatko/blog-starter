'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@blog-starter/db'
import { auth } from '@/lib/auth'

export async function getUsers(options?: { page?: number; limit?: number; search?: string; sortBy?: 'asc' | 'desc' }) {
  try {
    const page = options?.page ?? 1
    const limit = options?.limit ?? 10
    const skip = (page - 1) * limit
    const sortOrder = options?.sortBy ?? 'asc'

    const where = {
      ...(options?.search && {
        OR: [
          { name: { contains: options.search, mode: 'insensitive' as const } },
          { email: { contains: options.search, mode: 'insensitive' as const } },
        ],
      }),
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: sortOrder },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ])

    return {
      success: true,
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { success: false, error: 'Failed to fetch users' }
  }
}

export async function deleteUser(id: string) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    await prisma.user.delete({
      where: { id },
    })

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: 'Failed to delete user' }
  }
}
