import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <p className="text-6xl mb-4">⚠️</p>
            <h2 className="text-xl font-bold mb-3">Something went wrong</h2>
            <p className="text-gray-400 text-sm mb-2">The dashboard encountered an error.</p>
            <p className="text-gray-600 text-xs mb-6 font-mono">{this.state.error?.message}</p>
            <button onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition cursor-pointer">
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
