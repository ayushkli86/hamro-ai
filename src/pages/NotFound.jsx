import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-bold text-[#315fff] mb-4">404</p>
        <h1 className="text-2xl font-bold mb-3">Page not found</h1>
        <p className="text-gray-400 mb-8 text-sm">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="px-6 py-3 bg-[#315fff] hover:bg-blue-500 text-white font-semibold rounded-lg no-underline transition text-sm">Go Home</Link>
          <Link to="/dashboard" className="px-6 py-3 border border-white/20 hover:bg-white/10 text-white font-semibold rounded-lg no-underline transition text-sm">Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
