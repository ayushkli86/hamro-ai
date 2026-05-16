import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      navigate('/', { replace: true })
    } else {
      navigate('/login?error=auth_failed', { replace: true })
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <Spinner size={32} />
        <p className="text-gray-400 mt-4">Completing sign in...</p>
      </div>
    </div>
  )
}
