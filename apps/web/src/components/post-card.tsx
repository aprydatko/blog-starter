import Link from 'next/link'
import { Badge } from '@blog-starter/ui/badge'
import { formatDate } from '@/lib/utils/date'

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    thumbnail?: string | null
    excerpt?: string | null
    createdAt: Date
    author: {
      name: string | null
    }
    tags: {
      id: string
      name: string
    }[]
  }
}


export function PostCard({ post }: PostCardProps) {
  console.log("post", post)
  return (
    <article className="flex flex-col gap-2 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{formatDate(post.createdAt)}</span>
        <span>•</span>
        <span>{post.author.name || 'Anonymous'}</span>
      </div>
      {post.thumbnail && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <img src={post.thumbnail} alt={post.title} className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      <Link href={`/posts/${post.slug}`} className="hover:underline">
        <h2 className="text-xl font-semibold">{post.title}</h2>
      </Link>
      {post.excerpt && <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        {post.tags.map(tag => (
          <Badge key={tag.id} variant="secondary">
            {tag.name}
          </Badge>
        ))}
      </div>
    </article>
  )
}
