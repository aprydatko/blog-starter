import { getPages } from '@/lib/actions/pages'
import { Pagination } from '@/components/pagination'
import { Metadata } from 'next'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'All Pages',
  description: 'Browse all pages',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/pages`,
    title: 'All Pages',
    description: 'Browse all pages',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og`,
        width: 1200,
        height: 630,
        alt: 'All Pages',
      },
    ],
  },
}

interface PageProps {
  searchParams: { page?: string }
}

export default async function PagesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1
  const { pages, pagination } = await getPages({
    published: true,
    page,
    limit: 10,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-bold">All Pages</h1>
          <p className="text-muted-foreground">Browse through all our pages.</p>
        </section>

        <div className="grid gap-6">
          {pages?.map(page => (
            <article key={page.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/pages/${page.slug}`} className="hover:underline">
                  {page.title}
                </Link>
              </h2>
              <p className="text-muted-foreground line-clamp-2">{page.content.replace(/<[^>]*>?/gm, '')}</p>
              <div className="mt-4">
                <Link href={`/pages/${page.slug}`} className="text-sm font-medium text-primary hover:underline">
                  Read more →
                </Link>
              </div>
            </article>
          ))}
          {pages?.length === 0 && <p className="text-center text-muted-foreground py-12">No pages found.</p>}
        </div>

        {pagination && <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} />}
      </div>
    </div>
  )
}
