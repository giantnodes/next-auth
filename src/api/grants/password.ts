import type { SignInRouteOptions } from '@/api/routes/signin'
import type { OAuthTokenResponse } from '@/typings/oauth.types'
import type { NextAuthRequest } from '@/typings/route.types'

import { NextResponse } from 'next/server'
import qs from 'query-string'

import CookieStore from '@/storage/cookie-store'

const doPasswordSignIn = async (request: NextAuthRequest, options: SignInRouteOptions): Promise<NextResponse> => {
  const { provider } = options

  const endpoint = provider.endpoints.token
  if (!endpoint) {
    return NextResponse.next({
      status: 400,
      statusText: `The provider '${provider.name}' has no token endpoint defined.`,
    })
  }

  const body = await request.formData()
  const params = {
    grant_type: provider.grant_type,
    client_id: provider.client_id,
    client_secret: provider.client_secret,
    scope: provider.scope,
    username: body.get('username'),
    password: body.get('password'),
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: qs.stringify(params),
  })

  if (!response.ok) {
    const json = await response.json()
    return NextResponse.json(json, {
      status: 400,
      statusText: `The login password route received a non 200 response and got '${response.status}'.`,
    })
  }

  const payload = (await response.json()) as OAuthTokenResponse

  const redirect = NextResponse.redirect(options.redirect_url)
  const cookies = CookieStore.create(provider, payload)
  cookies.forEach((cookie) => redirect.cookies.set(cookie))

  return redirect
}

export default doPasswordSignIn
