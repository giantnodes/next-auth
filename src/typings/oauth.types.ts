export type GrantType =
  | 'authorization_code'
  | 'client_credentials'
  | 'implicit'
  | 'password'
  | 'refresh_token'
  | 'urn:ietf:params:oauth:grant-type:device_code'

export type OAuthEndpoint = {
  authorization: string
  callback: string
  logout: string
  token: string
  userinfo: string
}

export type OAuthTokenResponse = {
  scope: string
  expires_in: number
  token_type: string
  access_token: string
  refresh_token?: string
  id_token?: string
}

export type OAuthUserInfoResponse = {
  sub: string
  iss: string
  aud: string
}

export type ConsentResponse = {
  code: string
  scope: string
  prompt?: string
}
