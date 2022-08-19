export type NextAuthConfig = {
  pages: {
    login: string
    logout?: string
  }
}

export const StorageConfig = {
  refresh_lifetime: 14 * 24 * 60 * 60, // 14 days in seconds
  names: {
    access_token: 'access-token',
    refresh_token: 'refresh-token',
    provider_id: 'pid',
  },
}
