import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('airline_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('airline_user')
      }
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    // userData: { token, role, name, email, id }
    const userObj = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      token: userData.token
    }
    setUser(userObj)
    localStorage.setItem('airline_user', JSON.stringify(userObj))
    localStorage.setItem('airline_token', userData.token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('airline_user')
    localStorage.removeItem('airline_token')
  }

  const isAuthenticated = !!user
  const isAdmin = user?.role === 'ADMIN'

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
