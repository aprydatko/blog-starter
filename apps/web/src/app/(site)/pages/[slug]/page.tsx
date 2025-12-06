import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/lib/actions/pages'
import { formatDate } from '@/lib/utils/date'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function StaticPage({ params }: PageProps) {
    const { slug } = await params
    const { page } = await getPageBySlug(slug)

    if (!page) {
        notFound()
    }

    return (
        <div className="min-h-screen">
            <header className="border-b">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/" className="text-2xl font-bold hover:opacity-80">
                        Web Blogger
                    </Link>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                <article className="max-w-3xl mx-auto space-y-8">
                    <div className="space-y-4 text-center">
                        <h1 className="text-4xl font-bold tracking-tight">{page.title}</h1>
                        <p className="text-sm text-muted-foreground">
                            Last updated: {formatDate(page.updatedAt)}
                        </p>
                    </div>

                    <div
                        className="prose prose-lg dark:prose-invert mx-auto"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </article>
            </main>
        </div>
    )
}
