import { notFound } from 'next/navigation'
import { getPostBySlug, getPosts } from '@/lib/actions/posts'
import { formatDate, formatRelativeDate } from '@/lib/utils/date'
import { Badge } from '@blog-starter/ui/badge'
import { Button } from '@blog-starter/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@blog-starter/ui/breadcrumb'
import { CommentForm } from '@/components/comment-form'
import { HtmlContent } from '@/components/html-content'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import Image from 'next/image'
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
      limit: 4,
    }),
  ])
  const session = await auth()

  // Filter out the current post from recent posts
  const otherPosts = recentPosts?.filter(p => p.id !== post?.id).slice(0, 4) || []

  if (!post) {
    notFound()
  }

  return (
    <div className='pb-10 bg-secondary'>
      <div className="top-[92px] md:top-16">
        <section className='bg-grey-hair mx-auto flex items-center overflow-x-hidden min-h-[48px] pb-6 pt-5 md:min-h-[294px] justify-center'>
          <div className='flex items-center justify-center'>
            <div className="w-[600px] h-[90px] flex size-full items-center justify-center bg-gray-200 dark:bg-background text-center leading-3">Advertisement</div>
          </div>
        </section>
      </div>
      <article className="max-w-7xl mt-0 pt-10 pb-20 mx-auto space-y-8 bg-white dark:bg-background xl:rounded-lg xl:border border-border">
        <div className='mx-auto flex flex-row justify-between px-5 lg:px-5  xl:px-10 md:max-w-[1220px]'>
          <div className="min-w-0 flex-1">
            <div className="space-y-4">
              {/* Breadcrumb */}
              <div className='pb-2'>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/posts">Posts</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{post.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <div className="flex flex-wrap justify-start gap-2">
                {post.tags.map(tag => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>

              <h1 className="font-sans text-3xl font-bold tracking-tight">{post.title}</h1>
              <div className=" flex flex-col items-start justify-start gap-1 text-muted-foreground">
                <span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{post.author.name || 'Anonymous'}</span>
                <span className='text-sm text-muted-foreground'>{formatDate(post.createdAt)}</span>
              </div>

              {post.thumbnail && (
                <figure className='relative grid grid-cols-1 md:grid-cols-1 mb-4'>
                  <div className='relative aspect-video w-full overflow-hidden rounded-lg'>
                    <Image fill src={'/uploads/images/' + post.thumbnail} alt={post.title} className="object-cover" />
                  </div>
                  <figcaption className='relative text-[0.875rem]/[1.25rem] mt-1 line-clamp-2 pr-2.5'>
                    <div className='text-muted-foreground'>{post.thumbnailDescription}</div>
                  </figcaption>
                </figure>
              )}
            </div>

            <div className="pt-6 prose prose-lg dark:prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />

            <hr className="my-8 border border border-border" />

            <section className="space-y-6">
              <h3 className="text-2xl font-bold">Comments ({post.comments.length})</h3>

              <div className="space-y-4">
                {post.comments.map(comment => (
                  <div key={comment.id} className="border border-border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start mb-4">
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

              <div className="space-y-4">
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

              {otherPosts.length > 0 && (
                <section className="space-y-6">
                  <h3 className="text-2xl font-bold">More Posts</h3>
                  <div className="space-y-2">
                    {otherPosts.map(post => (
                      <div key={post.id} className="flex justify-between items-center py-2 border-b border-border">
                        <Link href={`/posts/${post.slug}`} className="hover:underline hover:text-primary transition-colors">
                          {post.title}
                        </Link>
                        <span className="text-sm text-muted-foreground">{formatDate(post.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </section>
          </div>
          <aside className="hidden md:block w-[300px] min-h-[600px] ml-8">
            <div className='flex size-full flex-col flex-nowrap'>
              <div className="h-[900px] pb-[40px]">
                <div className='sticky flex flex-none top-[135px]'>
                  <div className='w-[300px] h-[300px] bg-gray-100 dark:bg-secondary flex size-full items-center justify-center bg-marshmallow text-center leading-3'>
                    Advertisement
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </div>
  )
}
