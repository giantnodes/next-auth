import type { AuthProvider } from '@/typings/providers.types'
import type { NextApiRequest } from 'next'

export type NextAuthRequest = NextApiRequest & {
  options: {
    provider?: AuthProvider
  }
}
