import { getPosts } from '@/lib/actions/posts'
import { PostCard } from '@/components/post-card'

export const dynamic = 'force-dynamic'

interface PageProps {
    searchParams: Promise<{ page?: string }>
}

export default async function SitePage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams
    const page = Number(resolvedSearchParams.page) || 1
    const { posts } = await getPosts({
        published: true,
        page,
        limit: 10
    })

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <section className="space-y-4">
                    <h2 className="text-3xl font-bold">Latest Posts</h2>
                    <p className="text-muted-foreground">
                        Welcome to our blog. Here you can find the latest updates and articles.
                    </p>
                </section>

                <div className="grid gap-6">
                    {posts?.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                    {posts?.length === 0 && (
                        <p className="text-center text-muted-foreground py-12">
                            No posts found. Check back later!
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
