import { getPosts } from '@/lib/actions/posts'
import { PostCard } from '@/components/post-card'
import { Pagination } from '@/components/pagination'

import { Button } from '@blog-starter/ui/button'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Home Page',
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
    <div className="mx-auto w-full max-w-[1504px]">
      <section className="mx-auto my-10 w-full px-4 sm:px-6 lg:px-8 grid grow">
        <header>
          <h2 className='flex items-center font-bold leading-10 text-2xl'>More from Yahoo Shopping</h2>
        </header>
        <div className='lg:grid lg:grid-cols-3 lg:gap-6'>
          <ul className='flex flex-col gap-4 lg:col-span-2 lg:gap-6'>
            {posts?.map(post => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
          {posts?.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No posts found. Check back later!</p>
          )}
        </div>
      </section>

      {pagination && <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} />}
    </div>
  )
}
