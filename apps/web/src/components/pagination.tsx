import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@blog-starter/ui/button'

interface PaginationProps {
    totalPages: number
    currentPage: number
    className?: string
}

export function Pagination({ totalPages, currentPage, className }: PaginationProps) {
    // If there's only one page (or less), don't show pagination
    if (totalPages <= 1) return null

    return (
        <div className={cn('flex items-center justify-center gap-4 mt-8', className)}>
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage <= 1}
                asChild={currentPage > 1}
            >
                {currentPage > 1 ? (
                    <Link href={`/?page=${currentPage - 1}`} aria-label="Previous Page">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                ) : (
                    <ChevronLeft className="h-4 w-4" />
                )}
            </Button>

            <span className="text-sm font-medium text-muted-foreground">
                Page <span className="text-foreground">{currentPage}</span> of <span className="text-foreground">{totalPages}</span>
            </span>

            <Button
                variant="outline"
                size="icon"
                disabled={currentPage >= totalPages}
                asChild={currentPage < totalPages}
            >
                {currentPage < totalPages ? (
                    <Link href={`/?page=${currentPage + 1}`} aria-label="Next Page">
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                ) : (
                    <ChevronRight className="h-4 w-4" />
                )}
            </Button>
        </div>
    )
}
