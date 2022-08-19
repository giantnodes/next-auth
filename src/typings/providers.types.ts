import type { GrantType, OAuthEndpoint } from '@/typings/oauth.types'

export type ProviderType = 'oauth'

export type ProviderOptions = {
  refresh_lifetime: number
}

export type BaseProvider = {
  id: string
  name: string
  type: ProviderType
  options?: ProviderOptions
}

export type BaseOAuthProvider = BaseProvider & {
  grant_type: GrantType
  client_id: string
  client_secret?: string
  scope: string
  endpoints: Partial<OAuthEndpoint>
}

export type OAuthProviderOptions = {
  client_id: string
  client_secret?: string
  endpoints?: Partial<OAuthEndpoint>
}

export type OAuthProvider<T extends OAuthProviderOptions> = (options: T) => BaseOAuthProvider

export type AuthProvider = BaseOAuthProvider
