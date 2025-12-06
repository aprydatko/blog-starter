import { getPageById } from '@/lib/actions/pages'
import { EditPageForm } from './edit-page-form'
import { notFound } from 'next/navigation'

export default async function EditPagePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const result = await getPageById(id)

    if (!result.success || !result.page) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit Page</h1>
                <p className="text-muted-foreground">
                    Update your static page
                </p>
            </div>

            <EditPageForm page={result.page} />
        </div>
    )
}

