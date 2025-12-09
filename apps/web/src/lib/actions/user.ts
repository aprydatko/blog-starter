'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@blog-starter/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { cwd } from 'process'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

export async function updateUserProfile(formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const imageFile = formData.get('image') as File | null

    const validatedFields = profileSchema.safeParse({ name, email })

    if (!validatedFields.success) {
      return { success: false, error: 'Invalid fields', details: validatedFields.error.flatten() }
    }

    let imagePath: string | undefined

    if (imageFile && imageFile.size > 0) {
      // Validate image type
      if (!imageFile.type.startsWith('image/')) {
        return { success: false, error: 'Invalid file type. Please upload an image.' }
      }

      // Validate image size (e.g., 5MB)
      if (imageFile.size > 5 * 1024 * 1024) {
        return { success: false, error: 'File size too large. Max 5MB.' }
      }

      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Ensure directory exists
      // In a monorepo, process.cwd() might be the root or the package root depending on how it's run.
      // Next.js usually runs from the project root.
      // We aim for apps/web/public/users/avatars

      const publicDir = join(cwd(), 'public')
      // Verify if we are in apps/web or root. usually next runs in apps/web with pnpm dev filter
      // If we are in root, we need to adjust. But standard usage is process.cwd() is where package.json is for next app.

      const uploadDir = join(publicDir, 'users', 'avatars')

      await mkdir(uploadDir, { recursive: true })

      const filename = `${session.user.id}-${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
      const filepath = join(uploadDir, filename)

      await writeFile(filepath, buffer)
      imagePath = `/users/avatars/${filename}`
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        ...(imagePath && { image: imagePath }),
      },
    })

    revalidatePath('/user-profile')
    revalidatePath('/') // Update header across site

    return { success: true }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
