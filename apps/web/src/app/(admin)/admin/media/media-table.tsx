'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  Trash2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  RefreshCw,
  Copy,
  Plus,
  Upload,
} from 'lucide-react'
import { Button } from '@blog-starter/ui/button'
import { Input } from '@blog-starter/ui/input'
import { deleteMedia, syncMediaFromFilesystem } from '@/lib/actions/media'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

interface Media {
  id: string
  url: string
  filename: string
  mimeType: string
  size: number
  createdAt: Date
}

interface MediaTableProps {
  media: Media[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  currentSearch: string
  currentSortBy: 'date' | 'name'
  currentSortOrder: 'asc' | 'desc'
}

export function MediaTable({ media, pagination, currentSearch, currentSortBy, currentSortOrder }: MediaTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(currentSearch)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCopyLink = (url: string) => {
    const fullUrl = window.location.origin + url
    navigator.clipboard.writeText(fullUrl)
    toast.success('Link copied to clipboard')
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success(`File "${result.filename}" uploaded successfully`)
        router.refresh()
      } else {
        throw new Error(result.message || 'Upload failed')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload file')
    } finally {
      setIsUploading(false)
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async (id: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) return

    setDeletingId(id)
    const result = await deleteMedia(id)
    setDeletingId(null)

    if (result.success) {
      toast.success('Media deleted successfully')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to delete media')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (currentSortBy !== 'date') params.set('sortBy', currentSortBy)
    if (currentSortOrder !== 'desc') params.set('sortOrder', currentSortOrder)
    router.push(`/admin/media?${params.toString()}`)
  }

  const handleSync = async () => {
    setIsSyncing(true)
    const result = await syncMediaFromFilesystem()
    setIsSyncing(false)

    if (result.success) {
      toast.success(result.message || `Synced ${result.synced} file(s)`)
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to sync media')
    }
  }

  const handleSort = (sortBy: 'date' | 'name') => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    params.set('sortBy', sortBy)
    const newOrder = currentSortBy === sortBy && currentSortOrder === 'asc' ? 'desc' : 'asc'
    params.set('sortOrder', newOrder)
    router.push(`/admin/media?${params.toString()}`)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const buildPaginationUrl = (page: number) => {
    const params = new URLSearchParams()
    if (currentSearch) params.set('search', currentSearch)
    if (currentSortBy !== 'date') params.set('sortBy', currentSortBy)
    if (currentSortOrder !== 'desc') params.set('sortOrder', currentSortOrder)
    params.set('page', page.toString())
    return `/admin/media?${params.toString()}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-100">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by filename..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="block w-full shadow-none rounded-md bg-background dark:bg-white/5 px-3 py-1.5 pl-10 text-base text-gray-900 dark:text-white/50 outline-1 -outline-offset-1 outline-input placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-1 focus:outline-ring sm:text-sm/6"
            />
          </div>
          <Button type="submit" variant="default" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </form>

        <Input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        <Button onClick={handleUploadClick} disabled={isUploading}>
          <Plus className="h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Add Media'}
        </Button>

        <Button onClick={handleSync} disabled={isSyncing} variant="outline">
          <RefreshCw className={` h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Files'}
        </Button>
      </div>

      <div className="rounded-md border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/25">
              <th className="h-12 px-4 text-left align-middle font-medium">Preview</th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                <button onClick={() => handleSort('name')} className="flex items-center gap-2 hover:text-foreground">
                  Name
                  {currentSortBy === 'name' ? (
                    currentSortOrder === 'asc' ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  )}
                </button>
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">Size</th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                <button onClick={() => handleSort('date')} className="flex items-center gap-2 hover:text-foreground">
                  Date
                  {currentSortBy === 'date' ? (
                    currentSortOrder === 'asc' ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                  )}
                </button>
              </th>
              <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {media.length === 0 ? (
              <tr>
                <td colSpan={5} className="h-24 text-center">
                  {currentSearch
                    ? 'No media found matching your search.'
                    : 'No media files found. Upload your first image!'}
                </td>
              </tr>
            ) : (
              media.map(item => (
                <tr key={item.id} className="border-b border-border last:border-none">
                  <td className="p-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden border bg-muted">
                      {item.mimeType.startsWith('image/') ? (
                        <Image src={item.url} alt={item.filename} fill className="object-cover" sizes="64px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          File
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{item.filename}</div>
                    <div className="text-sm text-muted-foreground">{item.mimeType}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{formatFileSize(item.size)}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{format(new Date(item.createdAt), 'MMM d, yyyy HH:mm')}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      {item.mimeType.startsWith('image/') && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopyLink(item.url)}
                            title="Copy link"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Link href={item.url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" title="View image">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id, item.filename)}
                        disabled={deletingId === item.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total files)
          </div>
          <div className="flex gap-2">
            <Link
              href={buildPaginationUrl(pagination.page - 1)}
              className={pagination.page <= 1 ? 'pointer-events-none opacity-50' : ''}
            >
              <Button variant="outline" disabled={pagination.page <= 1}>
                Previous
              </Button>
            </Link>
            <Link
              href={buildPaginationUrl(pagination.page + 1)}
              className={pagination.page >= pagination.totalPages ? 'pointer-events-none opacity-50' : ''}
            >
              <Button variant="outline" disabled={pagination.page >= pagination.totalPages}>
                Next
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
