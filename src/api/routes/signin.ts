import type { AuthProvider } from '@/typings/providers.types'
import type { NextAuthRequest } from '@/typings/route.types'

import { NextResponse } from 'next/server'

import doPasswordSignIn from '@/api/grants/password'

export type SignInRouteOptions = {
  provider: AuthProvider
  redirect_url: string
}

const signin = async (req: NextAuthRequest, options: SignInRouteOptions): Promise<NextResponse> => {
  const { provider } = options

  if (req.method !== 'POST') {
    return NextResponse.next({
      status: 400,
      statusText: `The signin route expects a POST request but received '${req.method}'.`,
    })
  }

  if (!provider) {
    return NextResponse.next({
      status: 400,
      statusText: `The signin route expects a provider to be included but received '${provider}'.`,
    })
  }

  switch (provider.grant_type) {
    case 'password':
      return doPasswordSignIn(req, options)
    default:
      return NextResponse.next({
        status: 400,
        statusText: `The signin route cannot handle grant_type of '${provider.grant_type}'.`,
      })
  }
}

export default signin
