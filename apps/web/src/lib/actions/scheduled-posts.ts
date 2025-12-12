'use server'

import { prisma } from '@blog-starter/db'
import { revalidatePath } from 'next/cache'

export async function getScheduledPosts() {
  return prisma.post.findMany({
    where: {
      published: false,
      scheduledAt: {
        not: null,
        lte: new Date()
      }
    }
  })
}

export async function publishScheduledPosts() {
  const postsToPublish = await getScheduledPosts()
  
  if (postsToPublish.length === 0) {
    return { count: 0 }
  }

  const result = await prisma.post.updateMany({
    where: {
      id: {
        in: postsToPublish.map(post => post.id)
      }
    },
    data: {
      published: true,
      scheduledAt: null
    }
  })

  // Revalidate relevant paths
  revalidatePath('/')
  revalidatePath('/admin/posts')
  revalidatePath('/admin/scheduled-posts')

  return { count: result.count }
}

export async function getUpcomingScheduledPosts() {
  return prisma.post.findMany({
    where: {
      published: false,
      scheduledAt: {
        not: null,
        gte: new Date()
      }
    },
    orderBy: {
      scheduledAt: 'asc'
    },
    include: {
      author: {
        select: { name: true, email: true }
      },
      tags: true,
      categories: true
    }
  })
}

export async function unschedulePost(id: string) {
  try {
    await prisma.post.update({
      where: { id },
      data: {
        scheduledAt: null
      }
    })

    revalidatePath('/admin/scheduled-posts')
    revalidatePath('/admin/posts')
    
    return { success: true }
  } catch (error) {
    console.error('Error unscheduling post:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to unschedule post' 
    }
  }
}
