import type { AuthProvider } from '@/typings/providers.types'
import type { NextAuthRequest } from '@/typings/route.types'

import { NextResponse } from 'next/server'

export type LogoutRouteOptions = {
  provider: AuthProvider
  redirect_url: string
}

const logout = async (req: NextAuthRequest, options: LogoutRouteOptions): Promise<NextResponse> => {
  const { provider } = options

  if (req.method !== 'POST') {
    return NextResponse.next({
      status: 400,
      statusText: `The logout route expects a POST request but received '${req.method}'.`,
    })
  }

  if (!provider) {
    return NextResponse.next({
      status: 400,
      statusText: `The logout route expects a provider to be included but received '${provider}'.`,
    })
  }

  const endpoint = provider.endpoints.logout
  if (!endpoint) {
    return NextResponse.next({
      status: 400,
      statusText: `The logout route expects a logout endpoint to be configured but received '${endpoint}'.`,
    })
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      Authorization: req.headers.get('authorization') as string,
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Forwarded-Host': req.headers.get('host') as string,
    },
  })

  if (!response.ok) {
    const json = await response.json()
    return NextResponse.json(json, {
      status: 400,
      statusText: `The logout route received a non 200 response and got '${response.status}'.`,
    })
  }

  return NextResponse.redirect(options.redirect_url)
}

export default logout
