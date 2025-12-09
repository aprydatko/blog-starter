import { getPosts } from '@/lib/actions/posts'
import { PostCard } from '@/components/post-card'
import { Pagination } from '@/components/pagination'

import { Button } from '@blog-starter/ui/button'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Your Page Title',
  description: 'This is a description of the page content.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.yoursite.com/page', // The full URL to the page being shared
    title: 'Your Page Title',
    description: 'This is a description of the page content.',
    images: [
      {
        url: 'https://www.yoursite.com/api/og', // The dynamically generated OG image URL
        width: 1200,
        height: 630,
        alt: 'OG Image Alt Text',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image', // Ensures a large image card on Twitter
    title: 'Your Page Title',
    description: 'This is a description of the page content.',
    images: ['https://www.yoursite.com/api/og'], // Twitter card image URL (same as OG)
  },
}

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function SitePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1
  const { posts, pagination } = await getPosts({
    published: true,
    page,
    limit: 10,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">Latest Posts</h2>
          <p className="text-muted-foreground">
            Welcome to our blog. Here you can find the latest updates and articles.
          </p>
          <Button>Hello world!</Button>
        </section>

        <div className="grid gap-6">
          {posts?.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          {posts?.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No posts found. Check back later!</p>
          )}
        </div>

        {pagination && <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} />}
      </div>
    </div>
  )
}
