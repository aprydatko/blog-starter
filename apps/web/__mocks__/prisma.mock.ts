import { mockDeep } from 'jest-mock-extended'
import { PrismaClient } from '@blog-starter/db'

export const prismaMock = mockDeep<PrismaClient>()
