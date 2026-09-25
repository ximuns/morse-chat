import { createContext, useContext, useEffect, useState } from 'react'

import { getCurrentSession } from '../../services/auth/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [status, setStatus] = useState('loading')
  const [identity, setIdentity] = useState(null)

  async function refreshAuth() {
    try {
      const result = await getCurrentSession()

      if (result.authenticated) {
        setIdentity(result.identity)
        setStatus('authenticated')
      } else {
        setIdentity(null)
        setStatus('unauthenticated')
      }

      return result
    } catch {
      setIdentity(null)
      setStatus('unauthenticated')

      return {
        authenticated: false,
      }
    }
  }

  function setAuthenticatedIdentity(identityData) {
    setIdentity(identityData)
    setStatus('authenticated')
  }

  function clearAuthentication() {
    setIdentity(null)
    setStatus('unauthenticated')
  }

  useEffect(() => {
    refreshAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        status,
        identity,
        isLoading: status === 'loading',
        isAuthenticated: status === 'authenticated',
        refreshAuth,
        setAuthenticatedIdentity,
        clearAuthentication,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
