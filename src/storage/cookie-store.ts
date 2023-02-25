import type { OAuthTokenResponse } from '@/typings/oauth.types'
import type { AuthProvider } from '@/typings/providers.types'
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

import { StorageConfig } from '@/configuration'

type NextCookie = Partial<ResponseCookie> & {
  name: string
  value: string
}

class CookieStore {
  static create(provider: AuthProvider, tokens: OAuthTokenResponse) {
    const cookies: NextCookie[] = []

    cookies.push({
      name: StorageConfig.names.provider_id,
      value: provider.id,
      secure: process.env.NODE_ENV === 'production',
      maxAge: provider.options?.refresh_lifetime ?? StorageConfig.refresh_lifetime,
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    })

    if (tokens.refresh_token !== undefined) {
      cookies.push({
        name: StorageConfig.names.refresh_token,
        value: tokens.refresh_token,
        secure: process.env.NODE_ENV === 'production',
        maxAge: provider.options?.refresh_lifetime ?? StorageConfig.refresh_lifetime,
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
      })
    }

    cookies.push({
      name: StorageConfig.names.access_token,
      value: tokens.access_token,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokens.expires_in,
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    })

    return cookies
  }
}

export default CookieStore
