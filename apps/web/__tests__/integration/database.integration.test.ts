import "../../envConfig"

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { logger } from '@blog-starter/logger'
import { prisma } from '@blog-starter/db'

const testUser = {
  email: `test-${Date.now()}@example.com`,
  name: 'Test User',
}

describe('Database Integration Tests', () => {

  beforeAll(async () => {
    logger.info('Setting up database integration tests')
    await prisma.$connect()
    console.log("Connect successfull!");
    console.log(process.env.DATABASE_URL);

  })

  // afterAll(async () => {
  //   logger.info('Cleaning up database integration tests')
  //   try {
  //     await prisma.user.deleteMany({
  //       where: { email: testUser.email },
  //     })
  //   } catch (error) {
  //     logger.warn(`Error cleaning up test user: ${(error as Error).message}`)
  //   } finally {
  //     await prisma.$disconnect()
  //   }
  // })

  it.only('should create and retrieve a user', async () => {
    const users = await prisma.user.findMany();
    console.log(users);

    // expect(created).toMatchObject({
    //   email: testUser.email,
    //   name: testUser.name,
    // })

    // const retrieved = await prisma.user.findUnique({
    //   where: { id: created.id },
    // })

    // expect(retrieved).toMatchObject({
    //   id: created.id,
    //   email: testUser.email,
    //   name: testUser.name,
    // })
  })
})
