import type { OAuthUserInfoResponse } from '@/typings/oauth.types'
import type { AuthProvider } from '@/typings/providers.types'
import type { NextAuthRequest } from '@/typings/route.types'
import type { NextApiResponse } from 'next'

export type SessionRouteOptions = {
  provider: AuthProvider
}

const session = async (
  req: NextAuthRequest,
  res: NextApiResponse,
  options: SessionRouteOptions
): Promise<NextApiResponse<any> | any> => {
  const { provider } = options

  if (req.method === 'POST') {
    return res.status(400).end()
  }

  if (!provider) {
    return res.status(400).end()
  }

  const endpoint = provider.endpoints.userinfo
  if (endpoint == null) {
    return res.status(400).end()
  }

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: req.headers.authorization as string,
      'X-Forwarded-Host': req.headers.host as string,
    },
  })

  if (!response.ok) {
    return res.status(400).end()
  }

  const payload = (await response.json()) as OAuthUserInfoResponse
  return res.json(payload)
}

export default session
