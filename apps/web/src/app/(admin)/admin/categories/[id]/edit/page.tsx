import { getCategoryById } from '@/lib/actions/categories'
import { EditCategoryForm } from './edit-category-form'
import { notFound } from 'next/navigation'

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getCategoryById(id)

  if (!result.success || !result.category) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Category</h1>
        <p className="text-muted-foreground">
          Update category information
        </p>
      </div>

      <EditCategoryForm category={result.category} />
    </div>
  )
}

