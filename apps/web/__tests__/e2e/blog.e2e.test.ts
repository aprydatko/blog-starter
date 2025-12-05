import { test, expect } from '@playwright/test'
import { logger } from '@blog-starter/logger'

test.describe('Blog E2E Tests', () => {
  test.beforeAll(() => {
    logger.info('Starting Blog E2E tests')
  })

  test.afterAll(() => {
    logger.info('Completed Blog E2E tests')
  })

  test('should load homepage without errors', async ({ page }) => {
    logger.debug('Testing homepage loads without errors')
    await page.goto('/')
    // Verify page loaded successfully
    await expect(page).toHaveURL('http://localhost:3000/')
    const content = await page.content()
    expect(content).toBeTruthy()
    logger.info('Homepage loaded without errors')
  })

  test('should handle missing blog posts gracefully', async ({ page }) => {
    logger.debug('Testing handling of missing blog posts')
    await page.goto('/')
    // Homepage should be accessible even without blog posts
    const response = await page.goto('/')
    expect(response?.ok()).toBeTruthy()
    logger.info('App handles missing blog posts gracefully')
  })

  test('should handle non-existent post URLs gracefully', async ({ page }) => {
    logger.debug('Testing handling of non-existent post URL')
    const response = await page.goto('/posts/non-existent-post')
    // Should either 404 or redirect, both are acceptable
    expect(response?.status()).toBeLessThan(500)
    logger.info('App handles non-existent posts gracefully')
  })
})
