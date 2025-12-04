import { describe, it, expect, beforeEach } from '@jest/globals'
import { formatDate, formatSlug, truncateText } from "@/lib/utils"
import { logger } from '@blog-starter/logger'

// Example utility functions - adjust based on your actual utils
describe('Format Utils', () => {
    beforeEach(() => {
        logger.info('Running Format Utils test')
    })

    describe('formatDate', () => {
        it('should format date correctly', () => {
            logger.debug('Testing date formatting')
            // Add your date formatting utility tests
            const date = new Date('2024-01-01')
            expect(formatDate(date)).toBe('January 1, 2024')
        })
    })

    describe('formatSlug', () => {
        it('should convert title to slug', () => {
            logger.debug('Testing slug formatting')
            // Add slug formatting tests
            expect(formatSlug('Hello World')).toBe('hello-world')
        })

        it('should handle special characters', () => {
            logger.debug('Testing slug special characters handling')
            expect(formatSlug('Hello & World!')).toBe('hello-world')
        })
    })

    describe('truncateText', () => {
        it('should truncate long text', () => {
            logger.debug('Testing text truncation')
            // Add text truncation tests
            const longText = 'This is a very long text that should be truncated'
            expect(truncateText(longText, 20)).toBe('This is a very long...')
        })

        it('should not truncate short text', () => {
            logger.debug('Testing short text handling')
            const shortText = 'Short'
            expect(truncateText(shortText, 20)).toBe('Short')
        })
    })
})
