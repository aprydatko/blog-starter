import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/lib/actions/pages'
import { formatDate } from '@/lib/utils/date'
import Link from 'next/link'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = (await params).slug
  const { page } = await getPageBySlug(slug)

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page does not exist.',
    }
  }

  const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?title=${encodeURIComponent(page.title)}`

  return {
    title: page.title,
    openGraph: {
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${page.slug}`,
      title: page.title,
      locale: 'en_US',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
      siteName: process.env.NEXT_PUBLIC_BASE_URL,
      publishedTime: page.createdAt.toString(),
      modifiedTime: page.updatedAt.toString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      images: [ogImageUrl],
    },
  }
}

export default async function StaticPage({ params }: PageProps) {
  const { slug } = await params
  const { page } = await getPageBySlug(slug)

  if (!page) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">{page.title}</h1>
          <p className="text-sm text-muted-foreground">Last updated: {formatDate(page.updatedAt)}</p>
        </div>

        <div className="prose prose-lg dark:prose-invert mx-auto" dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    </main>
  )
}
