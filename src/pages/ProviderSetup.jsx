import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const STEPS = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#315fff]">
        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'Register Your GPUs',
    desc: 'List your GPU hardware on hamro.ai. Specify model, VRAM, and your price per hour.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#00d0a2]">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Earn Automatically',
    desc: 'Once registered, your GPUs are available for rent. We handle billing, provisioning, and monitoring.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-yellow-500">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: 'Withdraw Anytime',
    desc: 'Withdraw your earnings at any time. No minimum thresholds, no lock-in periods.',
  },
]

const REQUIREMENTS = [
  'A GPU with at least 8GB VRAM',
  'Stable internet connection',
  'Linux-based operating system (Ubuntu 22.04+ recommended)',
  'SSH access to the machine',
  'Docker installed (we provide the setup script)',
]

export default function ProviderSetup() {
  return (
    <PageLayout title="Become a Provider" subtitle="Turn your GPU hardware into a revenue stream. Join hamro.ai's provider network and earn passive income.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {STEPS.map((step, i) => (
          <div key={i} className="bg-[#161616] border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-all">
            <div className="mb-4">{step.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
            <p className="text-[#8b949e] leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#161616] border border-gray-800 rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Requirements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
          {REQUIREMENTS.map((req, i) => (
            <div key={i} className="flex items-center gap-3 text-[#8b949e]">
              <svg className="flex-shrink-0 text-[#00d0a2]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{req}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#315fff]/10 to-[#00d0a2]/10 border border-[#315fff]/20 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Ready to start earning?</h2>
        <p className="text-[#8b949e] mb-6 max-w-lg mx-auto">Sign up or log in to access the Provider Dashboard and register your first GPU.</p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/signup"
            className="px-6 py-3 bg-[#315fff] hover:bg-[#2a4fd8] text-white font-semibold rounded-lg transition no-underline inline-flex">
            Get Started
          </Link>
          <Link to="/login"
            className="px-6 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition no-underline inline-flex">
            Log In
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}
