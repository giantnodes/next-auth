import type { OAuthUserInfoResponse } from '@/typings/oauth.types'
import type { AuthProvider } from '@/typings/providers.types'
import type { NextAuthRequest } from '@/typings/route.types'

import { NextResponse } from 'next/server'

export type SessionRouteOptions = {
  provider: AuthProvider
}

const session = async (req: NextAuthRequest, options: SessionRouteOptions): Promise<NextResponse> => {
  const { provider } = options

  if (req.method === 'POST') {
    return NextResponse.next({
      status: 400,
      statusText: `The session route expects a POST request but received '${req.method}'.`,
    })
  }

  if (!provider) {
    return NextResponse.next({
      status: 400,
      statusText: `The session route expects a provider to be included but received '${provider}'.`,
    })
  }

  const endpoint = provider.endpoints.userinfo
  if (!endpoint) {
    return NextResponse.next({
      status: 400,
      statusText: `The session route expects a userinfo endpoint to be configured but received '${endpoint}'.`,
    })
  }

  const response = await fetch(endpoint, {
    method: 'GET',
    cache: 'no-cache',
    headers: {
      Authorization: req.headers.get('authorization') as string,
      'X-Forwarded-Host': req.headers.get('host') as string,
    },
  })

  if (!response.ok) {
    return NextResponse.next({
      status: 400,
      statusText: `The session route received a non 200 response and got '${response.status}'.`,
    })
  }

  const payload = (await response.json()) as OAuthUserInfoResponse
  return NextResponse.json(payload)
}

export default session
