import type { OAuthUserInfoResponse } from '@/typings/oauth.types'
import type { NextSession } from '@/typings/session.types'
import type { GetServerSidePropsContext } from 'next'

import { StorageConfig } from '@/configuration'

// eslint-disable-next-line import/prefer-default-export
export const getServerSession = async <T extends NextSession>(
  context: GetServerSidePropsContext
): Promise<T | null> => {
  const { cookies } = context.req

  const pid = cookies[StorageConfig.names.provider_id]
  const token = cookies[StorageConfig.names.access_token]
  if (token == null || pid == null) {
    return null
  }

  const response = await fetch(`http://${context.req.headers.host}/api/auth/session/${pid}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    return null
  }

  const payload = (await response.json()) as OAuthUserInfoResponse
  return payload as T
}
