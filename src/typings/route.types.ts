import type { AuthProvider } from '@/typings/providers.types'
import type { NextRequest } from 'next/server'

export type NextAuthRequest = NextRequest & {
  options: {
    provider?: AuthProvider
  }
}

export type NextAuthRequestParams = {
  params: {
    auth?: string[]
  }
}
