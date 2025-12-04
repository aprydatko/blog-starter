import { describe, it, expect, beforeEach } from '@jest/globals'
import { validateEmail, validateSlug, validatePostData } from '@/lib/utils'
import { logger } from '@blog-starter/logger'

// Example validation utilities - adjust based on your actual utils
describe('Validation Utils', () => {
  beforeEach(() => {
    logger.info('Running Validation Utils test')
  })

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      logger.debug('Testing email validation - valid email')
      expect(validateEmail('test@example.com')).toBe(true)
    })

    it('should reject invalid email', () => {
      logger.debug('Testing email validation - invalid email')
      expect(validateEmail('invalid-email')).toBe(false)
    })
  })

  describe('validateSlug', () => {
    it('should validate correct slug', () => {
      logger.debug('Testing slug validation - valid slug')
      expect(validateSlug('valid-slug-123')).toBe(true)
    })

    it('should reject invalid slug', () => {
      logger.debug('Testing slug validation - invalid slug')
      expect(validateSlug('Invalid Slug!')).toBe(false)
    })
  })

  describe('validatePostData', () => {
    it('should validate complete post data', () => {
      logger.debug('Testing post data validation - valid data')
      const validPost = {
        title: 'Test Post',
        content: 'Test content',
        slug: 'test-post',
      }
      expect(validatePostData(validPost)).toBe(true)
    })

    it('should reject incomplete post data', () => {
      logger.debug('Testing post data validation - invalid data')
      const invalidPost = {
        title: 'Test Post',
        // missing content and slug
      }
      expect(validatePostData(invalidPost)).toBe(false)
    })
  })
})
