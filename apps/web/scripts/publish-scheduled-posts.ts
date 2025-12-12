#!/usr/bin/env node

import { publishScheduledPosts } from '@/lib/actions/scheduled-posts'

async function main() {
  console.log('Checking for scheduled posts to publish...')
  
  try {
    const result = await publishScheduledPosts()
    
    if (result.count > 0) {
      console.log(`✅ Successfully published ${result.count} scheduled posts`)
    } else {
      console.log('ℹ️ No scheduled posts to publish')
    }
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error publishing scheduled posts:', error)
    process.exit(1)
  }
}

main()
