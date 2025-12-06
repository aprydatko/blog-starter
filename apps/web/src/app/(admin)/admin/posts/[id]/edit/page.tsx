import { getPostById } from '@/lib/actions/posts'
import { EditPostForm } from './edit-post-form'
import { notFound } from 'next/navigation'

export default async function EditPostPage({
    params,
}: {
    params: { id: string }
}) {
    const result = await getPostById(params.id)

    if (!result.success || !result.post) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit Post</h1>
                <p className="text-muted-foreground">
                    Update your blog post
                </p>
            </div>

            <EditPostForm post={result.post} />
        </div>
    )
}
