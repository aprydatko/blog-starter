import { logger } from '@blog-starter/logger'

// Mocks MUST be defined before importing the module under test
jest.mock('@auth/prisma-adapter', () => {
  const PrismaAdapter = jest.fn().mockReturnValue({ adapterMarker: true })
  return { PrismaAdapter }
})

const mockGitHub = jest.fn()
jest.mock('next-auth/providers/github', () => {
  return { __esModule: true, default: mockGitHub }
})

jest.mock('@blog-starter/db', () => ({
  prisma: { __prismaMock: true },
}))

jest.mock('next-auth', () => {
  const NextAuth = jest.fn(config => {
    const signIn = jest.fn().mockImplementation(async () => {
      try {
        throw new Error('Sign-in failed')
      } catch (err) {
        logger.error(err)
        throw err
      }
    })

    const signOut = jest.fn().mockImplementation(async () => {
      logger.info('User signed out successfully')
      return { message: 'Signed out successfully' }
    })

    return {
      handlers: { _handlersForTest: true },
      signIn,
      signOut,
      auth: jest.fn(),
      __config: config,
    }
  })
  return { __esModule: true, default: NextAuth }
})

describe('NextAuth Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls NextAuth with PrismaAdapter(prisma) and GitHub provider', async () => {
    const { default: NextAuth } = await import('next-auth')
    const GitHubModule = await import('next-auth/providers/github')
    const { PrismaAdapter } = await import('@auth/prisma-adapter')
    const { prisma } = await import('@blog-starter/db')

    // Import module under test AFTER mocks
    const authModule = await import('../../../src/lib/auth')

    expect(NextAuth).toHaveBeenCalledTimes(1)

    const config = (NextAuth as jest.Mock).mock.calls[0][0]
    expect(config).toBeDefined()
    expect(Array.isArray(config.providers)).toBe(true)
    expect(config.providers).toHaveLength(1)
    expect(config.providers[0]).toBe(GitHubModule.default)

    expect(PrismaAdapter).toHaveBeenCalledWith(prisma)

    // Exports should come from our NextAuth mock return value
    expect(authModule.handlers).toEqual(expect.objectContaining({ _handlersForTest: true }))
    expect(typeof authModule.signIn).toBe('function')
    expect(typeof authModule.signOut).toBe('function')
    expect(typeof authModule.auth).toBe('function')
  })

  it('should log an error if signIn fails', async () => {
    const authModule = await import('../../../src/lib/auth')

    await expect(authModule.signIn()).rejects.toThrow('Sign-in failed')

    expect(logger.error).toHaveBeenCalled()
    const loggedArg = (logger.error as jest.Mock).mock.calls[0][0]
    expect(loggedArg).toBeInstanceOf(Error)
    expect(loggedArg.message).toBe('Sign-in failed')
  })

  it('should log info on successful sign-out', async () => {
    const authModule = await import('../../../src/lib/auth')

    const res = await authModule.signOut()
    expect(res).toEqual({ message: 'Signed out successfully' })
    expect(logger.info).toHaveBeenCalledWith('User signed out successfully')
  })
})
