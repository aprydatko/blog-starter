import { describe, it, beforeEach } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { logger } from '@blog-starter/logger'
import RootLayout from '@/app/layout'

describe('Layout', () => {
    beforeEach(() => {
        logger.info('Running Layout component test')
    })

    it('should render children', () => {
        logger.debug('Testing Layout children rendering')
        render(
            <RootLayout>
                <div>Test Content</div>
            </RootLayout>
        )

        expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should have proper html structure', () => {
        logger.debug('Testing Layout HTML structure')
        const { container } = render(
            <RootLayout>
                <div>Test</div>
            </RootLayout>
        )

        const html = container.querySelector('html')
        const body = container.querySelector('body')

        expect(html).toBeInTheDocument()
        expect(body).toBeInTheDocument()
    })

    it('should include metadata', () => {
        logger.debug('Testing Layout metadata')
        // Test for metadata like title, description
        // This may require different testing approach for Next.js metadata
    })
})
