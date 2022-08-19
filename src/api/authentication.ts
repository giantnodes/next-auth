import type { AuthProvider } from '@/typings/providers.types'
import type { NextAuthRequest } from '@/typings/route.types'
import type { NextApiResponse } from 'next'

import session from '@/api/routes/session'
import signin from '@/api/routes/signin'
import CookieStore from '@/storage/cookie-store'

type AuthenticationOptions = {
  providers: AuthProvider[]
}

const NextAuth = (options: AuthenticationOptions) => async (req: NextAuthRequest, res: NextApiResponse) => {
  const { providers } = options

  if (!req.query.auth) {
    return res.status(400).end()
  }

  const params = Array.isArray(req.query.auth) ? req.query.auth : [req.query.auth]
  const provider = providers.find((p) => p.id === params[1])
  if (provider == null) {
    return res.status(400).end()
  }

  const store = new CookieStore(req, res)

  switch (req.query.auth[0]) {
    case 'signin':
      return signin(req, res, store, { provider, redirect_url: req.query.redirect_url as string })
    case 'session':
      return session(req, res, { provider })
    default:
      return res.status(400).end()
  }
}

export default NextAuth
