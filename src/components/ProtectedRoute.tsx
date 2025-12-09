import { Navigate } from 'react-router-dom'
import { useUser } from '../hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  redirectIfAuthenticated?: boolean
}

const ProtectedRoute = ({ 
  children, 
  requireAuth = true,
  redirectTo = '/login',
  redirectIfAuthenticated = true
}: ProtectedRouteProps) => {
  const { data: user, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const isAuthenticated = !!user

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  if (!requireAuth && isAuthenticated && redirectIfAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute