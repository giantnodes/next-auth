import type { NextSession } from '@/typings/session.types'

import React, { createContext, useMemo, useState } from 'react'

type SessionContextValue = {
  session?: NextSession
  isAuthenticated: boolean
}

type SessionContextProps = {
  children: React.ReactElement | React.ReactElement[]
  session?: NextSession
}

const SessionContext = createContext<SessionContextValue>({
  session: undefined,
  isAuthenticated: false,
})

export const SessionProvider: React.FC<SessionContextProps> = ({ children, ...props }) => {
  const [session] = useState<NextSession | undefined>(props.session)

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: session != null && Object.keys(session).length > 0,
    }),
    [session]
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export default SessionContext
