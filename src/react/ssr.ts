import type { NextAuthConfig } from '@/configuration'
import type { NextSession } from '@/typings/session.types'
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import { getServerSession } from '@/api/session'

const getSessionServerSideProps = async <T extends NextSession>(
  context: GetServerSidePropsContext,
  config?: NextAuthConfig
): Promise<GetServerSidePropsResult<{ session: T }>> => {
  const session = await getServerSession<T>(context)

  if (!session) {
    return {
      redirect: {
        destination: config?.pages?.login ?? '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}

export default getSessionServerSideProps
