import { describe, it, expect, beforeEach } from '@jest/globals'
import { logger } from '@blog-starter/logger'
import { authOptions } from '@/lib/auth'

describe('Auth Service', () => {
    beforeEach(() => {
        logger.info('Running Auth Service test')
    })

    it('should have GitHub provider configured', () => {
        logger.debug('Testing GitHub provider configuration')
        expect(authOptions.providers).toBeDefined()
        expect(authOptions.providers.length).toBeGreaterThan(0)
    })

    it('should have adapter configured', () => {
        logger.debug('Testing adapter configuration')
        expect(authOptions.adapter).toBeDefined()
    })

    it('should have session strategy defined', () => {
        logger.debug('Testing session strategy')
        expect(authOptions.session?.strategy).toBeDefined()
    })

    it('should include callbacks', () => {
        logger.debug('Testing callbacks configuration')
        expect(authOptions.callbacks).toBeDefined()
    })
})
