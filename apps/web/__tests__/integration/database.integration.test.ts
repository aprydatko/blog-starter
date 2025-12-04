import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { logger } from '@blog-starter/logger'
import { prisma } from '@/lib/prisma'

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

    it('should create a post', async () => {
        logger.debug('Testing post creation')
        const post = await prisma.post.create({
            data: {
                title: 'Test Post',
                content: 'Test content',
                slug: 'test-post',
                authorId: 'test-user-id'
            }
        })

        expect(post).toBeDefined()
        expect(post.title).toBe('Test Post')
        logger.info({ postId: post.id }, 'Post created successfully')
    })

    it('should fetch posts', async () => {
        logger.debug('Testing posts fetch')
        const posts = await prisma.post.findMany()
        expect(Array.isArray(posts)).toBe(true)
        logger.info({ postsCount: posts.length }, 'Posts fetched successfully')
    })

    it('should update a post', async () => {
        logger.debug('Testing post update')
        const post = await prisma.post.create({
            data: {
                title: 'Original Title',
                content: 'Content',
                slug: 'original-slug',
                authorId: 'test-user-id'
            }
        })

        const updated = await prisma.post.update({
            where: { id: post.id },
            data: { title: 'Updated Title' }
        })

        expect(updated.title).toBe('Updated Title')
        logger.info({ postId: updated.id }, 'Post updated successfully')
    })
})
