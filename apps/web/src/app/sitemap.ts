import { MetadataRoute } from 'next'
import { prisma } from '@blog-starter/db'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all published posts
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // Get all published pages
  const pages = await prisma.page.findMany({
    where: { published: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // Static routes
  const staticRoutes = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/posts`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Dynamic routes for posts
  const postRoutes = posts.map(post => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: post.updatedAt.toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Dynamic routes for pages
  const pageRoutes = pages.map(page => ({
    url: `${BASE_URL}/pages/${page.slug}`,
    lastModified: page.updatedAt.toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...postRoutes, ...pageRoutes]
}
