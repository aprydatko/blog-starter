import { getCategoryBySlug } from '@/lib/actions/categories'
import { getPosts } from '@/lib/actions/posts'
import { PostCard } from '@/components/post-card'
import { Pagination } from '@/components/pagination'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@blog-starter/ui/breadcrumb'

interface PageProps {
    params: Promise<{ category: string }>
    searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category: categorySlug } = await params
    const { category } = await getCategoryBySlug(categorySlug)

    if (!category) {
        return {}
    }

    return {
        title: category.name,
        description: category.description || `Posts in ${category.name}`,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/${categorySlug}`,
        },
        openGraph: {
            title: category.name,
            description: category.description || `Posts in ${category.name}`,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/${categorySlug}`,
            type: 'website',
        },
    }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
    const { category: categorySlug } = await params
    const resolvedSearchParams = await searchParams
    const page = Number(resolvedSearchParams.page) || 1

    const { category } = await getCategoryBySlug(categorySlug)

    if (!category) {
        notFound()
    }

    const { posts, pagination } = await getPosts({
        published: true,
        page,
        limit: 10,
        categorySlug,
    })

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <section className="space-y-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{category.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-3xl font-bold">{category.name}</h1>
                    {category.description && (
                        <p className="text-muted-foreground">{category.description}</p>
                    )}
                </section>

                <div className="grid gap-6">
                    {posts?.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                    {posts?.length === 0 && (
                        <p className="text-center text-muted-foreground py-12">
                            No posts found in this category.
                        </p>
                    )}
                </div>

                {pagination && (
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                    // baseUrl={`/${categorySlug}`}
                    />
                )}
            </div>
        </div>
    )
}
