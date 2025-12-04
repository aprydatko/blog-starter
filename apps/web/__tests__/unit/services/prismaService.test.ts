import { describe, it, expect, beforeEach } from '@jest/globals'
import { logger } from '@blog-starter/logger'
import { prisma } from '@/lib/prisma'

describe('Prisma Service', () => {
    beforeEach(() => {
        logger.info('Running Prisma Service test')
    })

    it.only('should export prisma client', () => {
        logger.debug('Testing prisma client export')
        expect(prisma).toBeDefined()
    })

    it('should have post model', () => {
        logger.debug('Testing post model availability')
        expect(prisma.PrismaClient.post).toBeDefined()
    })

    it('should have user model', () => {
        logger.debug('Testing user model availability')
        expect(prisma.PrismaClient.user).toBeDefined()
    })

    it('should be a singleton instance', () => {
        logger.debug('Testing prisma singleton pattern')
        const { prisma: prisma2 } = require('@/lib/prisma')
        expect(prisma).toBe(prisma2)
    })
})
