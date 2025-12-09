'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@blog-starter/db'
import { unlink, readdir, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function getMedia(options?: {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'date' | 'name'
  sortOrder?: 'asc' | 'desc'
}) {
  try {
    const page = options?.page ?? 1
    const limit = options?.limit ?? 20
    const skip = (page - 1) * limit
    const sortBy = options?.sortBy ?? 'date'
    const sortOrder = options?.sortOrder ?? 'desc'

    const where = options?.search
      ? {
          filename: {
            contains: options.search,
            mode: 'insensitive' as const,
          },
        }
      : {}

    const orderBy = sortBy === 'name' ? { filename: sortOrder } : { createdAt: sortOrder }

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.media.count({ where }),
    ])

    return {
      success: true,
      media,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error('Error fetching media:', error)
    return { success: false, error: 'Failed to fetch media' }
  }
}

export async function deleteMedia(id: string) {
  try {
    const media = await prisma.media.findUnique({
      where: { id },
    })

    if (!media) {
      return { success: false, error: 'Media not found' }
    }

    // Delete the file from the filesystem
    try {
      // Remove leading slash from URL to ensure proper path joining
      const urlPath = media.url.startsWith('/') ? media.url.slice(1) : media.url
      const filePath = join(process.cwd(), 'public', urlPath)
      await unlink(filePath)
    } catch (fileError) {
      // Log but don't fail if file doesn't exist
      console.warn('File not found or already deleted:', media.url)
    }

    // Delete from database
    await prisma.media.delete({
      where: { id },
    })

    revalidatePath('/admin/media')
    return { success: true }
  } catch (error) {
    console.error('Error deleting media:', error)
    return { success: false, error: 'Failed to delete media' }
  }
}

export async function syncMediaFromFilesystem() {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'images')

    if (!existsSync(uploadsDir)) {
      return { success: true, synced: 0, message: 'Uploads directory does not exist' }
    }

    // Get all files in the uploads directory
    const files = await readdir(uploadsDir)
    const imageFiles = files.filter(file => {
      const ext = file.toLowerCase().split('.').pop()
      return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext || '')
    })

    let synced = 0
    let skipped = 0
    const errors: string[] = []

    // Get existing media URLs from database to avoid duplicates
    const existingMedia = await prisma.media.findMany({
      select: { url: true },
    })
    const existingUrls = new Set(existingMedia.map(m => m.url))

    for (const filename of imageFiles) {
      try {
        const publicUrl = `/uploads/images/${filename}`

        // Skip if already in database
        if (existingUrls.has(publicUrl)) {
          skipped++
          continue
        }

        // Get file stats
        const filePath = join(uploadsDir, filename)
        const stats = await stat(filePath)

        // Determine MIME type from extension
        const ext = filename.toLowerCase().split('.').pop() || ''
        const mimeTypes: Record<string, string> = {
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          gif: 'image/gif',
          webp: 'image/webp',
          svg: 'image/svg+xml',
          bmp: 'image/bmp',
        }
        const mimeType = mimeTypes[ext] || 'image/jpeg'

        // Create media record
        await prisma.media.create({
          data: {
            url: publicUrl,
            filename,
            mimeType,
            size: stats.size,
            createdAt: stats.birthtime, // Use file creation time
          },
        })

        synced++
      } catch (error) {
        errors.push(`Failed to sync ${filename}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    revalidatePath('/admin/media')

    return {
      success: true,
      synced,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
      message: `Synced ${synced} file(s), skipped ${skipped} existing file(s)`,
    }
  } catch (error) {
    console.error('Error syncing media from filesystem:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sync media from filesystem',
    }
  }
}
