import { Link } from 'react-router-dom'

export default function ProviderSetup() {
  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">Provider Setup</h1>
      <p className="text-gray-400">Start earning by providing GPU resources.</p>
      <Link to="/signup" className="text-blue-400 hover:underline">Get Started</Link>
    </div>
  )
}
