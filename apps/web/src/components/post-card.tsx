import Link from 'next/link'
import Image from 'next/image'
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
    <article className="relative grid grid-cols-[130px_auto] gap-3 sm:grid-cols-[36.396%_auto] md:grid-cols-[247.5px_auto] lg:grid-cols-[260px_auto]">
      <div className='relative aspect-square sm:col-auto sm:aspect-auto'>
        {post.thumbnail && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              fill
              src={'/uploads/images/carnaval-2025-12-10-13-34-24.jpg'}
              alt={post.title}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
      </div>

      <div className='flex min-w-0 flex-col gap-1'>
        <span className='block uppercase leading-0 font-semibold'>
          {post.tags.map(tag => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
          {!post.tags.length && (
            <Badge variant="secondary">No Tags</Badge>
          )}
        </span>
        <div className='flex flex-col gap-1 md:gap-2'>
          <h3 className='text-xl leading-normal font-bold'>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </h3>
          <div className='flex gap-2'>
            <span className='text-sm text-muted-foreground'>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
