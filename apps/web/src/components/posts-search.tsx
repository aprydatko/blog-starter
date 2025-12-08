'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@blog-starter/ui/input'
import { Button } from '@blog-starter/ui/button'
import { Label } from '@blog-starter/ui/label'
import { Search, X } from 'lucide-react'
import { format, subMonths, startOfMonth } from 'date-fns'

interface PostsSearchProps {
    className?: string
}

export function PostsSearch({ className }: PostsSearchProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [titleSearch, setTitleSearch] = useState(searchParams.get('titleSearch') || '')
    const [monthDate, setMonthDate] = useState(searchParams.get('monthDate') || '')
    const [generalSearch, setGeneralSearch] = useState(searchParams.get('search') || '')

    // Generate month options (last 12 months)
    const getMonthOptions = () => {
        const months = []
        for (let i = 0; i < 12; i++) {
            const date = subMonths(new Date(), i)
            const value = format(date, 'yyyy-MM')
            const label = format(date, 'MMMM yyyy')
            months.push({ value, label })
        }
        return months
    }

    const handleSearch = () => {
        const params = new URLSearchParams()
        
        if (titleSearch.trim()) {
            params.set('titleSearch', titleSearch.trim())
        }
        
        if (monthDate) {
            params.set('monthDate', monthDate)
        }
        
        if (generalSearch.trim() && !titleSearch.trim()) {
            params.set('search', generalSearch.trim())
        }
        
        // Reset to page 1 when searching
        params.set('page', '1')
        
        const url = params.toString() ? `/admin/posts?${params.toString()}` : '/admin/posts'
        router.push(url)
    }

    const handleClear = () => {
        setTitleSearch('')
        setMonthDate('')
        setGeneralSearch('')
        router.push('/admin/posts')
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSearch()
        }
    }

    // Update state when URL params change
    useEffect(() => {
        setTitleSearch(searchParams.get('titleSearch') || '')
        setMonthDate(searchParams.get('monthDate') || '')
        setGeneralSearch(searchParams.get('search') || '')
    }, [searchParams])

    const hasActiveFilters = titleSearch || monthDate || generalSearch

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Title Search */}
                <div className="space-y-2">
                    <Label htmlFor="titleSearch">Search by Title</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="titleSearch"
                            placeholder="Enter title..."
                            value={titleSearch}
                            onChange={(e) => setTitleSearch(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* General Search */}
                <div className="space-y-2">
                    <Label htmlFor="generalSearch">Search Content</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="generalSearch"
                            placeholder="Search in title and content..."
                            value={generalSearch}
                            onChange={(e) => setGeneralSearch(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Month/Date Filter */}
                <div className="space-y-2">
                    <Label htmlFor="monthDate">Filter by Month</Label>
                    <select
                        id="monthDate"
                        value={monthDate}
                        onChange={(e) => setMonthDate(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">All months</option>
                        {getMonthOptions().map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Search Actions */}
            <div className="flex gap-2">
                <Button onClick={handleSearch} className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search
                </Button>
                {hasActiveFilters && (
                    <Button variant="outline" onClick={handleClear} className="flex items-center gap-2">
                        <X className="h-4 w-4" />
                        Clear Filters
                    </Button>
                )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {titleSearch && (
                        <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                            Title: "{titleSearch}"
                            <button
                                onClick={() => {
                                    setTitleSearch('')
                                    handleSearch()
                                }}
                                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                    {monthDate && (
                        <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                            Month: {format(new Date(monthDate + '-01'), 'MMMM yyyy')}
                            <button
                                onClick={() => {
                                    setMonthDate('')
                                    handleSearch()
                                }}
                                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                    {generalSearch && !titleSearch && (
                        <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                            Content: "{generalSearch}"
                            <button
                                onClick={() => {
                                    setGeneralSearch('')
                                    handleSearch()
                                }}
                                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}