import { test, expect } from '@playwright/test'
import { logger } from '@blog-starter/logger'

test.describe('Blog E2E Tests', () => {
  test.beforeAll(() => {
    logger.info('Starting Blog E2E tests')
  })

  test.afterAll(() => {
    logger.info('Completed Blog E2E tests')
  })

  test('should display blog posts on homepage', async ({ page }) => {
    logger.debug('Testing blog posts display on homepage')
    await page.goto('/')
    // Check for blog post elements
    const posts = page.locator('[data-testid="blog-post"]')
    await expect(posts.first()).toBeVisible()
    logger.info('Blog posts displayed successfully')
  })

  test('should navigate to individual blog post', async ({ page }) => {
    logger.debug('Testing navigation to individual blog post')
    await page.goto('/')
    const firstPost = page.locator('[data-testid="blog-post"]').first()
    await firstPost.click()

    // Should navigate to post detail page
    await expect(page).toHaveURL(/\/posts\//)
    logger.info('Navigation to blog post verified')
  })

  test('should display post content correctly', async ({ page }) => {
    logger.debug('Testing post content display')
    // Navigate to a specific post (adjust URL as needed)
    await page.goto('/posts/test-post')

    const title = page.locator('h1')
    const content = page.locator('[data-testid="post-content"]')

    await expect(title).toBeVisible()
    await expect(content).toBeVisible()
    logger.info('Post content displayed correctly')
  })
})
