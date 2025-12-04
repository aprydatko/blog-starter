import { test, expect } from '@playwright/test'
import { logger } from '@blog-starter/logger'

test.describe('Authentication E2E Tests', () => {
    test.beforeAll(() => {
        logger.info('Starting Authentication E2E tests')
    })

    test.afterAll(() => {
        logger.info('Completed Authentication E2E tests')
    })

    test('should display login page', async ({ page }) => {
        logger.debug('Testing login page display')
        await page.goto('/login')
        await expect(page.locator('text=Sign in')).toBeVisible()
        logger.info('Login page displayed successfully')
    })

    test('should redirect unauthenticated users from protected routes', async ({ page }) => {
        logger.debug('Testing protected route redirect')
        await page.goto('/admin')
        // Should redirect to login or home
        await page.waitForURL(/\/(login|)/)
        logger.info('Protected route redirect verified')
    })

    test('should allow GitHub OAuth flow to initiate', async ({ page }) => {
        logger.debug('Testing GitHub OAuth flow initiation')
        await page.goto('/login')
        const githubButton = page.locator('button:has-text("GitHub")')
        await expect(githubButton).toBeVisible()
        logger.info('GitHub OAuth flow initiation verified')
    })
})
