import cron from 'node-cron'
import { publishScheduledPosts } from './actions/scheduled-posts'

// Run every minute to check for scheduled posts
const CRON_SCHEDULE = '* * * * *'

// Initialize and start the cron job
export function startScheduledPostsCron() {
  console.log('🚀 Starting scheduled posts cron job...')

  const job = cron.schedule(
    CRON_SCHEDULE,
    async () => {
      try {
        console.log('⏰ Checking for scheduled posts to publish...')
        const result = await publishScheduledPosts()

        if (result.count > 0) {
          console.log(`✅ Published ${result.count} scheduled posts`)
        }
      } catch (error) {
        console.error('❌ Error in scheduled posts cron job:', error)
      }
    },
    {
      timezone: 'UTC',
    }
  )

  return job
}

// For development purposes - run immediately on startup in development
if (process.env.NODE_ENV === 'development') {
  startScheduledPostsCron()
}
