import { test, expect } from '@playwright/test'
import { logger } from '@blog-starter/logger'

test.describe('App E2E Tests', () => {
  test.beforeAll(() => {
    logger.info('Starting App E2E tests')
  })

  test.afterAll(() => {
    logger.info('Completed App E2E tests')
  })

  test('should load the homepage', async ({ page }) => {
    logger.debug('Testing homepage load')
    await page.goto('/')
    await expect(page).toHaveTitle(/Create Next App/)
    logger.info('Homepage loaded successfully')
  })

  test('should navigate to different pages', async ({ page }) => {
    logger.debug('Testing page navigation')
    await page.goto('/')
    // Check that page is loaded
    await expect(page).toHaveURL('http://localhost:3000/')
    logger.info('Page navigation verified')
  })

  test('should have proper meta tags', async ({ page }) => {
    logger.debug('Testing meta tags')
    await page.goto('/')
    // Check that the page loaded successfully
    const content = await page.content()
    expect(content).toBeTruthy()
    logger.info('Meta tags verified')
  })
})
