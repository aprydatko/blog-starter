import { describe, it, beforeEach, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { logger } from '@blog-starter/logger'
import '@testing-library/jest-dom'

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Geist: jest.fn(() => ({
    variable: '--font-geist-sans',
  })),
  Geist_Mono: jest.fn(() => ({
    variable: '--font-geist-mono',
  })),
}))

// Mock CSS imports
jest.mock('@/app/globals.css', () => ({}))
jest.mock('@blog-starter/ui/styles.css', () => ({}))

// Since RootLayout is a Server Component that renders <html> and <body>,
// we test the component structure by importing it
import RootLayout from '@/app/layout'

describe('Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    logger.info('Running Layout component test')
  })

  it('should render children', async () => {
    logger.debug('Testing Layout children rendering')
    const TestChildren = () => <div>Test Content</div>

    render(
      <RootLayout>
        <TestChildren />
      </RootLayout>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should accept children prop', () => {
    logger.debug('Testing Layout accepts children')

    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should be defined as a function', () => {
    logger.debug('Testing Layout is a valid component')

    expect(RootLayout).toBeDefined()
    expect(typeof RootLayout).toBe('function')
  })
})
