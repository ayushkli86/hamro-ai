import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'

export default function Login() {
  useEffect(() => { document.title = 'Sign In — hamro.ai' }, [])
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setFieldErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    try {
      setError('')
      await login(email, password)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-[#1a1a1a] p-8 rounded-lg w-full max-w-md border border-white/10" noValidate>
        <h2 className="text-white text-2xl font-bold mb-6 text-center">Sign in to hamro.ai</h2>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <div className="mb-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: '' })) }}
            className={`w-full bg-[#0d1117] text-white border ${fieldErrors.email ? 'border-red-500' : 'border-white/10'} rounded px-4 py-3 focus:outline-none focus:border-blue-500`} />
          {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
        </div>
        <div className="mb-6">
          <input type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: '' })) }}
            className={`w-full bg-[#0d1117] text-white border ${fieldErrors.password ? 'border-red-500' : 'border-white/10'} rounded px-4 py-3 focus:outline-none focus:border-blue-500`} />
          {fieldErrors.password && <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>}
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded transition cursor-pointer flex items-center justify-center gap-2">
          {loading && <Spinner size={18} />}
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p className="text-gray-400 text-sm mt-4 text-center">
          No account? <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  )
}
