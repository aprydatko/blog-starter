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
    params: Promise<{ category: string; tag: string }>
    searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category: categorySlug, tag: tagSlug } = await params
    const { category } = await getCategoryBySlug(categorySlug)

    if (!category) {
        return {}
    }

    const title = `${decodeURIComponent(tagSlug)} - ${category.name}`

    return {
        title: title,
        description: `Posts about ${decodeURIComponent(tagSlug)} in ${category.name}`,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/${categorySlug}/${tagSlug}`,
        },
        openGraph: {
            title: title,
            description: `Posts about ${decodeURIComponent(tagSlug)} in ${category.name}`,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/${categorySlug}/${tagSlug}`,
            type: 'website',
        },
    }
}

export default async function TagPage({ params, searchParams }: PageProps) {
    const { category: categorySlug, tag: tagSlug } = await params
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
        tagName: tagSlug, // Pass slug directly, getPosts handles unslugifying via loose match
    })

    const tagName = tagSlug.replace(/-/g, ' ')

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
                                <BreadcrumbLink href={`/${categorySlug}`}>
                                    {category.name}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="capitalize">{tagName}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-3xl font-bold capitalize">{tagName}</h1>
                    <p className="text-muted-foreground">in {category.name}</p>
                </section>

                <div className="grid gap-6">
                    {posts?.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                    {posts?.length === 0 && (
                        <p className="text-center text-muted-foreground py-12">
                            No posts found for "{tagName}" in {category.name}.
                        </p>
                    )}
                </div>

                {pagination && (
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                    />
                )}
            </div>
        </div>
    )
}
