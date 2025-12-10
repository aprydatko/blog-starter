import { prisma } from '@blog-starter/db'

export async function getDashboardStats() {
  const [postsCount, pagesCount, commentsCount, mediaCount] = await Promise.all([
    prisma.post.count(),
    prisma.page.count(),
    prisma.comment.count(),
    prisma.media.count(),
  ])

  return {
    postsCount,
    pagesCount,
    commentsCount,
    mediaCount,
  }
}

export type DashboardStats = Awaited<ReturnType<typeof getDashboardStats>>
