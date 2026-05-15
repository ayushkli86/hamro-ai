import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  useEffect(() => { document.title = 'Sign In — hamro.ai' }, [])
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      await login(email, password)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-[#1a1a1a] p-8 rounded-lg w-full max-w-md border border-white/10">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">Sign in to hamro.ai</h2>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#0d1117] text-white border border-white/10 rounded px-4 py-3 mb-4 focus:outline-none focus:border-blue-500" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#0d1117] text-white border border-white/10 rounded px-4 py-3 mb-6 focus:outline-none focus:border-blue-500" required />
        <button type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded transition cursor-pointer">
          Sign In
        </button>
        <p className="text-gray-400 text-sm mt-4 text-center">
          No account? <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  )
}
