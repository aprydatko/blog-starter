import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { logger } from '@blog-starter/logger'
import { prisma } from '@blog-starter/db'

describe('Database Integration Tests', () => {
  beforeAll(async () => {
    logger.info('Setting up database integration tests')
    // Setup test database
  })

  afterAll(async () => {
    logger.info('Cleaning up database integration tests')
    // Cleanup and disconnect
    await prisma.$disconnect()
  })

  beforeEach(() => {
    logger.debug('Running database integration test')
  })

  it('should connect to database', async () => {
    logger.debug('Testing database connection')
    await expect(prisma.$connect()).resolves.not.toThrow()
    logger.info('Database connection verified')
  })
})
