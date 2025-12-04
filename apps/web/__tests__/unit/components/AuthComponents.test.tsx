import { describe, it, beforeEach, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { logger } from '@blog-starter/logger'
import { SignIn, SignOut } from '@/components/auth-components'

// Mock next-auth
jest.mock('next-auth/react', () => ({
    signIn: jest.fn(),
    signOut: jest.fn()
}))

describe('AuthComponents', () => {
    beforeEach(() => {
        logger.info('Running AuthComponents test')
    })

    describe('SignIn', () => {
        it('should render sign in button', () => {
            logger.debug('Testing SignIn component render')
            render(<SignIn />)
            const button = screen.getByRole('button', { name: /sign in/i })
            expect(button).toBeInTheDocument()
        })

        it('should call signIn when clicked', async () => {
            logger.debug('Testing SignIn click handler')
            const { signIn } = await import('next-auth/react')
            render(<SignIn />)
            const button = screen.getByRole('button', { name: /sign in/i })
            button.click()
            expect(signIn).toHaveBeenCalled()
        })
    })

    describe('SignOut', () => {
        it('should render sign out button', () => {
            logger.debug('Testing SignOut component render')
            render(<SignOut />)
            const button = screen.getByRole('button', { name: /sign out/i })
            expect(button).toBeInTheDocument()
        })

        it('should call signOut when clicked', async () => {
            logger.debug('Testing SignOut click handler')
            const { signOut } = await import('next-auth/react')
            render(<SignOut />)
            const button = screen.getByRole('button', { name: /sign out/i })
            button.click()
            expect(signOut).toHaveBeenCalled()
        })
    })
})
