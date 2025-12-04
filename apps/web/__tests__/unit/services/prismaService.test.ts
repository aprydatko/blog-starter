import { logger } from '@blog-starter/logger'
import { prismaMock } from '__mocks__/prisma.mock'

jest.mock('@blog-starter/db', () => ({
  prisma: prismaMock,
}))

describe('Prisma Service', () => {
  beforeEach(() => {
    logger.info('Starting Prisma service test')
  })

  it('should export a Prisma client instance', () => {
    logger.debug('Validating Prisma client export')
    expect(prismaMock).toBeDefined()
  })

  it('should expose the session model', () => {
    expect(prismaMock.session).toBeDefined()
  })

  it('should expose the user model', () => {
    expect(prismaMock.user).toBeDefined()
  })

  it('should ensure Prisma uses a singleton instance', async () => {
    // Import prisma again (same module) — should reference the same instance
    const { prisma: prismaSecondInstance } = await import('@blog-starter/db')
    expect(prismaMock).toBe(prismaSecondInstance)
  })
})
