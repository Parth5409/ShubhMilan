import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
