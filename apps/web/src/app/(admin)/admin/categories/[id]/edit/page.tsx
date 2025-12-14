import { getCategoryById } from '@/lib/actions/categories'
import { EditCategoryForm } from './edit-category-form'
import { notFound } from 'next/navigation'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getCategoryById(id)

  if (!result.success || !result.category) {
    notFound()
  }

  return (
    <div className="bg-white dark:bg-gray-900 scheme-dark border border-border rounded-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <EditCategoryForm category={result.category} />
        </div>
      </div>
    </div>
  )
}
