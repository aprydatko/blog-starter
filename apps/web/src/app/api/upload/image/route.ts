import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Generate unique filename: originalname-YYYY-MM-DD-HH-mm-ss.extension
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-')
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
    const extension = originalName.split('.').pop() || 'jpg'
    
    // Create readable datetime string: YYYY-MM-DD-HH-mm-ss
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const datetime = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`
    
    const uniqueFileName = `${nameWithoutExt}-${datetime}.${extension}`

    // Create uploads/images directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'images')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file to public/uploads/images/
    const filePath = join(uploadsDir, uniqueFileName)
    await writeFile(filePath, buffer)

    // Return the public URL
    const publicUrl = `/uploads/images/${uniqueFileName}`

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        filename: uniqueFileName
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to upload image'
      },
      { status: 500 }
    )
  }
}

