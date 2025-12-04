import { describe, it, beforeEach, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { logger } from '@blog-starter/logger'
import { SignIn, SignOut } from '@/components/auth-components'

// Mock the auth module
jest.mock('@/lib/auth', () => ({
  signIn: jest.fn(async (provider?: string) => {
    console.log(`Mock signIn called with provider: ${provider}`)
    return { ok: true }
  }),
  signOut: jest.fn(async () => {
    console.log('Mock signOut called')
    return { ok: true }
  }),
  auth: jest.fn(async () => ({
    user: {
      id: 'mock-user-id',
      email: 'mock@example.com',
      name: 'Mock User',
    },
  })),
}))

describe('AuthComponents', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    logger.info('Running AuthComponents test')
  })

  describe('SignIn', () => {
    it('should render sign in button', () => {
      logger.debug('Testing SignIn component render')
      render(<SignIn provider="GitHub" />)
      const button = screen.getByRole('button', { name: /sign in/i })
      expect(button).toBeInTheDocument()
    })

    it('should display provider name in button text', () => {
      logger.debug('Testing SignIn button text with provider')
      render(<SignIn provider="GitHub" />)
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('GitHub')
    })

    it('should render form element', () => {
      logger.debug('Testing SignIn form structure')
      const { container } = render(<SignIn provider="GitHub" />)
      const form = container.querySelector('form')
      expect(form).toBeInTheDocument()
    })
  })

  describe('SignOut', () => {
    it('should render sign out button', () => {
      logger.debug('Testing SignOut component render')
      render(<SignOut />)
      const button = screen.getByRole('button', { name: /sign out/i })
      expect(button).toBeInTheDocument()
    })

    it('should have sign out text on button', () => {
      logger.debug('Testing SignOut button text')
      render(<SignOut />)
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('Sign Out')
    })

    it('should render form element', () => {
      logger.debug('Testing SignOut form structure')
      const { container } = render(<SignOut />)
      const form = container.querySelector('form')
      expect(form).toBeInTheDocument()
    })
  })
})
