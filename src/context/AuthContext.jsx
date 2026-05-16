import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
  const [loading, setLoading] = useState(true)

  const setAuth = (data) => {
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const userId = params.get('userId')
    const name = params.get('name')
    const email = params.get('email')
    if (token && userId) {
      setAuth({ token, _id: userId, name, email })
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  useEffect(() => {
    if (user?.token) {
      authApi.me().then((u) => {
        setAuth({ ...user, ...u })
      }).catch(() => logout())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const data = await authApi.login({ email, password })
    setAuth(data)
  }

  const signup = async (name, email, password) => {
    const data = await authApi.signup({ name, email, password })
    setAuth(data)
  }

  const phoneLogin = async (phone, code) => {
    const data = await authApi.verifyOtp(phone, code)
    setAuth(data)
  }

  const refreshUser = async () => {
    try {
      const u = await authApi.me()
      setAuth({ ...user, ...u })
    } catch {}
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, phoneLogin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
