import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

// Return parsed user object or null if not valid
import { getStoredUser } from '../lib/auth'

type Props = {
  children: ReactNode
}

const RequireAuth = ({ children }: Props) => {
  // Basic client-side check — the app stores user in localStorage on login
  const user = getStoredUser()
  const location = useLocation()

  if (!user) {
    // not authenticated — redirect to login and keep current location in state
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default RequireAuth
