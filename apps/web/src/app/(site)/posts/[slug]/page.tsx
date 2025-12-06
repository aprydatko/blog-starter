import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/actions/posts'
import { formatDate, formatRelativeDate } from '@/lib/utils/date'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CommentForm } from '@/components/comment-form'
import { auth } from '@/lib/auth'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: PageProps) {
    const { slug } = await params
    const { post } = await getPostBySlug(slug)
    const session = await auth()

    if (!post) {
        notFound()
    }

    return (
        <div className="min-h-screen">
            <header className="border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold hover:opacity-80">
                        Web Blogger
                    </Link>
                    <div className="flex gap-4">
                        {session ? (
                            <span className="text-sm text-muted-foreground">
                                {session.user?.name || session.user?.email}
                            </span>
                        ) : (
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/login">Login</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                <article className="max-w-3xl mx-auto space-y-8">
                    <div className="space-y-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <span>{formatDate(post.createdAt)}</span>
                            <span>•</span>
                            <span>{post.author.name || 'Anonymous'}</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
                        <div className="flex flex-wrap justify-center gap-2">
                            {post.tags.map(tag => (
                                <Badge key={tag.id} variant="secondary">
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div
                        className="prose prose-lg dark:prose-invert mx-auto"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <hr className="my-8" />

                    <section className="space-y-6">
                        <h3 className="text-2xl font-bold">Comments ({post.comments.length})</h3>

                        <div className="space-y-4">
                            {post.comments.map(comment => (
                                <div key={comment.id} className="border rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div className="font-semibold">
                                            {comment.author.name || 'Anonymous'}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {formatRelativeDate(comment.createdAt)}
                                        </div>
                                    </div>
                                    <p className="text-sm">{comment.content}</p>
                                </div>
                            ))}
                            {post.comments.length === 0 && (
                                <p className="text-muted-foreground text-center py-4">
                                    No comments yet. Be the first to share your thoughts!
                                </p>
                            )}
                        </div>

                        <div className="pt-4">
                            {session ? (
                                <CommentForm postId={post.id} postSlug={post.slug} />
                            ) : (
                                <div className="text-center p-6 border rounded-lg bg-muted/50">
                                    <p className="mb-4">Please login to leave a comment</p>
                                    <Button asChild>
                                        <Link href="/login">Login</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </section>
                </article>
            </main>
        </div>
    )
}
