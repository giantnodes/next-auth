import type { OAuthEndpoint } from '@/typings/oauth.types'
import type { OAuthProvider, OAuthProviderOptions } from '@/typings/providers.types'

export type PasswordProviderOptions = OAuthProviderOptions & {
  client_id: string
  client_secret?: string
  scope: string
  endpoints: Pick<OAuthEndpoint, 'token' | 'logout' | 'userinfo'>
}

const Password: OAuthProvider<PasswordProviderOptions> = (options) => ({
  id: 'password',
  name: 'Password',
  type: 'oauth',
  grant_type: 'password',
  client_id: options.client_id,
  client_secret: options.client_secret,
  scope: options.scope,
  endpoints: options.endpoints,
})

export default Password
