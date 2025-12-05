import { initializeAuth } from '@/services/authService'

// Initialize NextAuth via service wrapper. Kept as destructured exports
// so existing imports in the codebase/tests remain compatible.
const nextAuthResult = initializeAuth()

export const { handlers, signIn, signOut, auth } = nextAuthResult
