import { getPosts } from '@/lib/actions/posts'
import { PostCard } from '@/components/post-card'
import { Pagination } from '@/components/pagination'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'All Posts',
  description: 'Browse all blog posts',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts`,
    title: 'All Posts',
    description: 'Browse all blog posts',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og`,
        width: 1200,
        height: 630,
        alt: 'All Posts',
      },
    ],
  },
}

interface PageProps {
  searchParams: { page?: string }
}

export default async function PostsPage({ searchParams }: PageProps) {
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
          <h1 className="text-3xl font-bold">All Posts</h1>
          <p className="text-muted-foreground">Browse through all our blog posts.</p>
        </section>

        <div className="grid gap-6">
          {posts?.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          {posts?.length === 0 && <p className="text-center text-muted-foreground py-12">No posts found.</p>}
        </div>

        {pagination && <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} />}
      </div>
    </div>
  )
}
