import { notFound } from 'next/navigation'
import { getPostBySlug, getPosts } from '@/lib/actions/posts'
import { formatDate, formatRelativeDate } from '@/lib/utils/date'
import { Badge } from '@blog-starter/ui/badge'
import { Button } from '@blog-starter/ui/button'
import { CommentForm } from '@/components/comment-form'
import { HtmlContent } from '@/components/html-content'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = (await params).slug
  const { post } = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post does not exist.',
    }
  }

  const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?title=${encodeURIComponent(post.title)}`

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt!,
      locale: 'en_US',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      tags: post.tags.map(tag => tag.name),
      siteName: process.env.NEXT_PUBLIC_BASE_URL,
      authors: post.author.name,
      emails: [post.author.email!],
      publishedTime: post.createdAt.toString(),
      modifiedTime: post.updatedAt.toString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt!,
      images: [ogImageUrl],
    },
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const [{ post }, { posts: recentPosts }] = await Promise.all([
    getPostBySlug(slug),
    getPosts({ 
      published: true,
      limit: 4
    })
  ])
  const session = await auth()
  
  // Filter out the current post from recent posts
  const otherPosts = recentPosts?.filter(p => p.id !== post?.id).slice(0, 4) || []

  if (!post) {
    notFound()
  }

  return (
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

        <div className="prose prose-lg dark:prose-invert mx-auto" dangerouslySetInnerHTML={{ __html: post.content }} />

        <hr className="my-8" />

        <section className="space-y-6">
          <h3 className="text-2xl font-bold">Comments ({post.comments.length})</h3>

          <div className="space-y-4">
            {post.comments.map(comment => (
              <div key={comment.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold">{comment.author.name || 'Anonymous'}</div>
                  <div className="text-xs text-muted-foreground">{formatRelativeDate(comment.createdAt)}</div>
                </div>
                <div className="text-sm">
                  <HtmlContent content={comment.content} className="text-sm" />
                </div>
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

        <hr className="my-8" />

        {otherPosts.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-2xl font-bold">More Posts</h3>
            <div className="space-y-2">
              {otherPosts.map((post) => (
                <div key={post.id} className="flex justify-between items-center py-2 border-b">
                  <Link 
                    href={`/posts/${post.slug}`}
                    className="hover:underline hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(post.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
        </section>
      </article>
    </main>
  )
}
