import { NextResponse } from 'next/server'
import { publishScheduledPosts } from '@/lib/actions/scheduled-posts'

// This API route is protected by a secret key in the environment variables
// and is meant to be called by the cron job

export async function GET(request: Request) {
  // Get the API key from the request headers
  const authHeader = request.headers.get('authorization')
  const apiKey = authHeader?.split(' ')[1] // Bearer <token>

  // Verify the API key
  if (apiKey !== process.env.CRON_SECRET) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Publish any scheduled posts that are due
    const result = await publishScheduledPosts()

    return NextResponse.json({
      success: true,
      message: `Successfully published ${result.count} scheduled posts`,
      count: result.count,
    })
  } catch (error) {
    console.error('Error publishing scheduled posts:', error)
    return NextResponse.json({ success: false, error: 'Failed to publish scheduled posts' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
