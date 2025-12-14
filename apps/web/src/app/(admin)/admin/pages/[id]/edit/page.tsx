import { getPageById } from '@/lib/actions/pages'
import { EditPageForm } from './edit-page-form'
import { notFound } from 'next/navigation'

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getPageById(id)

  if (!result.success || !result.page) {
    notFound()
  }

  return (
    <div className="bg-white dark:bg-gray-900 scheme-dark border border-border rounded-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <EditPageForm page={result.page} />
        </div>
      </div>
    </div>
  )
}
