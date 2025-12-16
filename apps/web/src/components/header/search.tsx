"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search as SearchIcon, Loader2, X } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { searchPosts } from "@/lib/actions/posts"
import { Button } from "@blog-starter/ui/button"
import { Input } from "@blog-starter/ui/input"
import { cn } from "@blog-starter/ui/lib/utils"
import Link from "next/link"

interface SearchResult {
    id: string
    title: string
    slug: string
    thumbnail: string | null
    createdAt: Date
}

export function Search() {
    const router = useRouter()
    const searchContainerRef = React.useRef<HTMLDivElement>(null)
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(false)

    const debouncedQuery = useDebounce(query, 300)

    // Handle click outside to close dropdown
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    // Execute search when debounced query changes
    React.useEffect(() => {
        const fetchResults = async () => {
            if (!debouncedQuery || debouncedQuery.trim() === "") {
                setResults([])
                return
            }

            setIsLoading(true)
            try {
                const response = await searchPosts(debouncedQuery)
                if (response.success && response.posts) {
                    setResults(response.posts)
                    setIsOpen(true)
                }
            } catch (error) {
                console.error("Search error:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchResults()
    }, [debouncedQuery])

    // Clear search handler
    const handleClear = () => {
        setQuery("")
        setResults([])
        setIsOpen(false)
    }

    // Handle key press (Enter to search, Esc to close)
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setIsOpen(false)
        }
    }

    return (
        <div ref={searchContainerRef} className="relative w-full max-w-lg z-50">
            <div className="relative flex items-center">
                <Input
                    id="titleSearch"
                    placeholder="Search items..."
                    className="flex h-11 shrink w-full shadow-none rounded-full bg-background dark:bg-white/5 pl-4 pr-10 text-base outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        if (e.target.value.length > 0) setIsOpen(true)
                    }}
                    onFocus={() => {
                        if (query.length > 0) setIsOpen(true)
                    }}
                    onKeyDown={handleKeyDown}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : query ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full hover:bg-transparent"
                            onClick={handleClear}
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    ) : (
                        <SearchIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                </div>
            </div>

            {/* Results Dropdown */}
            {isOpen && (results.length > 0 || (query.length > 0 && !isLoading)) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg overflow-hidden max-h-[60vh] overflow-y-auto">
                    {results.length > 0 ? (
                        <div className="py-2">
                            <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Posts
                            </div>
                            {results.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/posts/${post.slug}`}
                                    className="flex flex-col px-4 py-3 hover:bg-accent transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="text-sm font-medium leading-none mb-1">
                                        {post.title}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        !isLoading && query.length > 0 && (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                No results found for "{query}"
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    )
}
