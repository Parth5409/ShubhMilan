import { createContext, useEffect, useMemo, useState } from 'react'
import { getMe, login as apiLogin, register as apiRegister } from '../api/api'

export const AuthContext = createContext(null)

const AUTH_STORAGE_KEY = 'soulsync_auth'

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed?.token) {
          setToken(parsed.token)
          getMe(parsed.token)
            .then((freshUser) => {
              setUser(freshUser)
            })
            .catch(() => {
              localStorage.removeItem(AUTH_STORAGE_KEY)
              setToken(null)
              setUser(null)
            })
            .finally(() => setLoading(false))
          return
        }
      } catch (error) {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  const persistAuth = (tokenValue, userValue) => {
    setToken(tokenValue)
    setUser(userValue)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: tokenValue, user: userValue }))
  }

  const login = async (email, password) => {
    const response = await apiLogin(email, password)
    persistAuth(response.access_token, response.user)
    return response.user
  }

  const register = async (email, password, role = 'user') => {
    const response = await apiRegister(email, password, role)
    return response
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user && token),
      isAdmin: user?.role === 'admin',
      loading,
    }),
    [token, user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
