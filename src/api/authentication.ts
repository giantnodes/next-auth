import type { AuthProvider } from '@/typings/providers.types'
import type { NextAuthRequest, NextAuthRequestParams } from '@/typings/route.types'

import { NextResponse } from 'next/server'

import logout from '@/api/routes/logout'
import session from '@/api/routes/session'
import signin from '@/api/routes/signin'

type AuthenticationOptions = {
  providers: AuthProvider[]
}

const NextAuth =
  (options: AuthenticationOptions) =>
  async (request: NextAuthRequest, { params }: NextAuthRequestParams) => {
    const { providers } = options

    if (!params.auth) {
      return NextResponse.next({
        status: 400,
        statusText: `The provider route params 'auth' were not found in the request.`,
      })
    }

    const provider = providers.find((p) => p.id === params?.auth?.[1])
    if (provider == null) {
      return NextResponse.next({
        status: 400,
        statusText: `The provider id '${params?.auth?.[1]}' has not been defined.`,
      })
    }

    const redirectUrl = request.nextUrl.searchParams.get('redirect_url') || request.nextUrl.origin
    switch (params.auth[0]) {
      case 'signin':
        return signin(request, { provider, redirect_url: redirectUrl })
      case 'logout':
        return logout(request, { provider, redirect_url: redirectUrl })
      case 'session':
        return session(request, { provider })
      default:
        return NextResponse.next({ status: 400 })
    }
  }

export default NextAuth
