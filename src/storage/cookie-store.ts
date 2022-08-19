import type { OAuthTokenResponse } from '@/typings/oauth.types'
import type { AuthProvider } from '@/typings/providers.types'
import type { NextAuthRequest } from '@/typings/route.types'
import type { NextApiResponse } from 'next'

import { serialize } from 'cookie'

import { StorageConfig } from '@/configuration'

class CookieStore {
  private readonly MAX_COOKIE_SIZE = 4096

  // @ts-ignore
  private readonly req: NextAuthRequest

  private readonly res: NextApiResponse

  constructor(req: NextAuthRequest, res: NextApiResponse) {
    this.req = req
    this.res = res
  }

  /**
   * Splits a large cookie into smaller chunks where its size exceeds the maximum
   * cookie size of 4096 bytes. Each chunk is a new cookie with an index appended
   * to the cookie name, inheriting all the attributes of the provided value.
   *
   * @param value a cookie value including attributes
   * @returns a array of cookies chunked to not exceed browser cookie size limits
   */
  private getChunkedCookie(value: string): string[] {
    if (value.length <= this.MAX_COOKIE_SIZE) {
      return [value]
    }

    const name = value.substring(0, value.indexOf('='))
    const data = value.substring(value.indexOf('=') + 1, value.indexOf(';'))
    const attributes = value.substring(value.indexOf(';') + 1, value.length)

    // add an extra 5 characters to account for the the index and separators {name}-00={data};{attributes}
    const size = this.MAX_COOKIE_SIZE - (name.length + attributes.length + 5)
    const chunks = Array.from(data.match(new RegExp(`.{1,${size}}`, 'g')) ?? [])

    const cookies: string[] = []
    chunks.forEach((chunk, index) => {
      cookies.push(`${name}-${index}=${chunk};${attributes}`)
    })

    return cookies
  }

  store(provider: AuthProvider, tokens: OAuthTokenResponse) {
    const cookies = []
    const sid = serialize(StorageConfig.names.provider_id, provider.id, {
      secure: process.env.NODE_ENV === 'production',
      maxAge: provider.options?.refresh_lifetime ?? StorageConfig.refresh_lifetime,
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    })

    if (tokens.refresh_token !== undefined) {
      const refresh = serialize(StorageConfig.names.refresh_token, tokens.refresh_token, {
        secure: process.env.NODE_ENV === 'production',
        maxAge: provider.options?.refresh_lifetime ?? StorageConfig.refresh_lifetime,
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
      })

      cookies.push(...this.getChunkedCookie(refresh))
    }

    const access = serialize(StorageConfig.names.access_token, tokens.access_token, {
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokens.expires_in,
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    })

    cookies.push(sid)
    cookies.push(...this.getChunkedCookie(access))
    this.res.setHeader('Set-Cookie', cookies)
  }
}

export default CookieStore
