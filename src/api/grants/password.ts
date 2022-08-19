import type { SignInRouteOptions } from '@/api/routes/signin'
import type CookieStore from '@/storage/cookie-store'
import type { OAuthTokenResponse } from '@/typings/oauth.types'
import type { NextAuthRequest } from '@/typings/route.types'
import type { NextApiResponse } from 'next'

import * as qs from 'query-string'

import 'isomorphic-fetch'

const doPasswordSignIn = async (
  req: NextAuthRequest,
  res: NextApiResponse,
  store: CookieStore,
  options: SignInRouteOptions
): Promise<NextApiResponse<any> | any> => {
  const { provider } = options

  const endpoint = provider.endpoints.token
  if (!endpoint) {
    return res.status(400).end(`The provider '${provider.name}' has no token endpoint defined.`)
  }

  const params = {
    grant_type: provider.grant_type,
    client_id: provider.client_id,
    client_secret: provider.client_secret,
    scope: provider.scope,
    username: req.body.username,
    password: req.body.password,
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: qs.stringify(params),
  })

  if (!response.ok) {
    const json = await response.json()
    return res.status(400).json(json)
  }

  const payload = (await response.json()) as OAuthTokenResponse
  store.store(provider, payload)

  return res.redirect(options.redirect_url ?? '/')
}

export default doPasswordSignIn
