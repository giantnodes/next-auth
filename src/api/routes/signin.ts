import type CookieStore from '@/storage/cookie-store'
import type { AuthProvider } from '@/typings/providers.types'
import type { NextAuthRequest } from '@/typings/route.types'
import type { NextApiResponse } from 'next'

import doPasswordSignIn from '@/api/grants/password'

export type SignInRouteOptions = {
  provider: AuthProvider
  redirect_url?: string
}

const signin = async (
  req: NextAuthRequest,
  res: NextApiResponse,
  store: CookieStore,
  options: SignInRouteOptions
): Promise<NextApiResponse<any> | any> => {
  const { provider } = options

  if (req.method !== 'POST') {
    return res.status(400).end()
  }

  if (!provider) {
    return res.status(400).end()
  }

  switch (provider.grant_type) {
    case 'password':
      return doPasswordSignIn(req, res, store, options)
    default:
      return res.status(400).end()
  }
}

export default signin
