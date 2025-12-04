import { jest } from '@jest/globals'

export const signIn = jest.fn(async (provider?: string) => {
  console.log(`Mock signIn called with provider: ${provider}`)
  return { ok: true }
})

export const signOut = jest.fn(async () => {
  console.log('Mock signOut called')
  return { ok: true }
})

export const auth = jest.fn(async () => ({
  user: {
    id: 'mock-user-id',
    email: 'mock@example.com',
    name: 'Mock User',
  },
}))
