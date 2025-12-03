import { describe, it, expect } from '@jest/globals'
import { logger } from '../index'

describe('Logger', () => {
    it('should export a logger instance', () => {
        expect(logger).toBeDefined()
    })

    it('should have info method', () => {
        expect(typeof logger.info).toBe('function')
    })

    it('should have error method', () => {
        expect(typeof logger.error).toBe('function')
    })

    it('should have warn method', () => {
        expect(typeof logger.warn).toBe('function')
    })

    it('should log info messages without throwing', () => {
        expect(() => {
            logger.info('Test info message')
        }).not.toThrow()
    })

    it('should log error messages without throwing', () => {
        expect(() => {
            logger.error('Test error message')
        }).not.toThrow()
    })
})
