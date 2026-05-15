import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.token) {
      authApi.me().then((u) => {
        setUser((prev) => ({ ...prev, ...u }))
        localStorage.setItem('user', JSON.stringify({ ...user, ...u }))
      }).catch(() => logout())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const data = await authApi.login({ email, password })
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
  }

  const signup = async (name, email, password) => {
    const data = await authApi.signup({ name, email, password })
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
  }

  const refreshUser = async () => {
    try {
      const u = await authApi.me()
      setUser((prev) => ({ ...prev, ...u }))
      localStorage.setItem('user', JSON.stringify({ ...user, ...u }))
    } catch {}
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
