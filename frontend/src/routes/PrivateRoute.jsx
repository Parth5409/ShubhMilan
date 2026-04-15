import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}
