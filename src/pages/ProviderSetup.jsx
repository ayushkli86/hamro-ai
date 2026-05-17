import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const AGENT_CMD = 'HAMRO_EMAIL=you@email.com HAMRO_PASSWORD=your_password node agent/agent.js'

const STEPS = [
  {
    num: '1',
    title: 'Create Account & Get API Key',
    desc: 'Sign up for a free hamro.ai account. Log in to the console and generate your personal API key — it takes under a minute.',
  },
  {
    num: '2',
    title: 'Install Node.js 18+ and Docker',
    desc: 'Make sure you have Node.js 18 or higher and Docker installed on your laptop or server. Both are free and open-source.',
  },
  {
    num: '3',
    title: 'Run the Agent',
    desc: 'Paste your credentials into the command and run it. The agent handles the rest — connecting your GPU to the network.',
  },
]

const SUPPORTED_GPUS = [
  'NVIDIA RTX 3060+', 'NVIDIA RTX 3070+', 'NVIDIA RTX 3080+', 'NVIDIA RTX 3090',
  'NVIDIA RTX 4060+', 'NVIDIA RTX 4070+', 'NVIDIA RTX 4080+', 'NVIDIA RTX 4090',
  'NVIDIA A4000+', 'NVIDIA A5000', 'NVIDIA A6000', 'NVIDIA Tesla T4',
  'NVIDIA Tesla V100', 'NVIDIA Tesla A100', 'NVIDIA H100',
]

export default function ProviderSetup() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(AGENT_CMD)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PageLayout
      title="Earn Money with Your GPU"
      subtitle="Turn your idle GPU into passive income. Join the hamro.ai provider network and earn rewards for sharing your compute power with AI developers worldwide."
    >
      <div className="flex flex-wrap items-center gap-4 mb-16">
        <Link to="/signup" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer no-underline text-sm">
          Get Started
        </Link>
        <a href="#how-it-works" className="border border-white/30 hover:bg-white hover:text-black text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer no-underline text-sm">
          Learn More
        </a>
      </div>

      <section id="how-it-works" className="py-16 border-t border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">How It Works</h2>
          <p className="text-gray-400 text-lg">Three simple steps to start earning.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.num} className="bg-[#161616] border border-gray-800 rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white">
                <span className="font-bold text-xl text-white">{s.num}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 border-t border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Run the Agent</h2>
          <p className="text-gray-400 text-lg">Copy and run this command in your terminal after installing Node.js and Docker.</p>
        </div>
        <div className="max-w-3xl mx-auto bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#30363d] bg-[#161b22]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs text-[#8b949e] font-mono">terminal</span>
          </div>
          <div className="p-5 relative">
            <pre className="m-0 overflow-x-auto text-sm leading-relaxed text-[#e6edf3] font-mono whitespace-pre-wrap break-all">
              <code>{AGENT_CMD}</code>
            </pre>
            <button
              onClick={copyToClipboard}
              className="absolute top-5 right-5 px-3 py-1.5 text-xs font-semibold rounded border transition cursor-pointer bg-[#21262d] border-[#30363d] text-[#8b949e] hover:text-white hover:border-white/30"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Eligibility</h2>
          <p className="text-gray-400 text-lg">Make sure your setup meets the minimum requirements.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
          <div className="bg-[#161616] border border-gray-800 rounded-xl p-6">
            <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-lg bg-blue-600/20 text-blue-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Minimum 4GB VRAM</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Your GPU must have at least 4GB of VRAM to participate. Higher VRAM GPUs earn more.</p>
          </div>
          <div className="bg-[#161616] border border-gray-800 rounded-xl p-6">
            <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-lg bg-green-600/20 text-green-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Docker Required</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Docker must be installed and running. All workloads run in isolated Docker containers.</p>
          </div>
          <div className="bg-[#161616] border border-gray-800 rounded-xl p-6">
            <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-lg bg-purple-600/20 text-purple-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Supported GPUs</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Most modern NVIDIA GPUs with 4GB+ VRAM are supported. View the full list below.</p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Supported GPU Models</h3>
          <div className="bg-[#161616] border border-gray-800 rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {SUPPORTED_GPUS.map((gpu, i) => (
                <div key={gpu} className={`px-5 py-3 text-sm text-gray-300 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                  {gpu}
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-3">More GPUs added regularly. If yours isn't listed, check back soon.</p>
        </div>
      </section>

      <section className="py-16 border-t border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Earnings</h2>
          <p className="text-gray-400 text-lg">Transparent pricing. Fair rates. Regular payouts.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-[#161616] border border-gray-800 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-3">15% Platform Fee</h3>
            <p className="text-gray-400 text-sm leading-relaxed">We take 15% on each rental. You keep 85% of the earnings. No hidden fees or monthly charges.</p>
          </div>
          <div className="bg-[#161616] border border-gray-800 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-3">$5 Minimum Withdrawal</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Withdraw earnings once you reach $5. Payouts processed within 48 hours via bank transfer or PayPal.</p>
          </div>
          <div className="bg-[#161616] border border-gray-800 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-3">Pricing Tips</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Set competitive rates based on GPU demand. Higher VRAM and newer architectures command premium pricing. Adjust anytime.</p>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Security & FAQ</h2>
          <p className="text-gray-400 text-lg">Your machine stays safe. Here's how.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-[#161616] border border-gray-800 rounded-xl p-6">
            <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-lg bg-green-600/20 text-green-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Sandboxed in Docker</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Every workload runs inside an isolated Docker container with no access to your host system, files, or network.</p>
          </div>
          <div className="bg-[#161616] border border-gray-800 rounded-xl p-6">
            <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-lg bg-yellow-600/20 text-yellow-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Resource Limited</h3>
            <p className="text-gray-400 text-sm leading-relaxed">You control the CPU, memory, and GPU limits per container. Workloads cannot exceed allocated resources.</p>
          </div>
          <div className="bg-[#161616] border border-gray-800 rounded-xl p-6">
            <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-lg bg-red-600/20 text-red-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Time-Bounded</h3>
            <p className="text-gray-400 text-sm leading-relaxed">All workloads have a maximum runtime limit. Your GPU is never locked indefinitely — you stay in control.</p>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/10 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready to Start Earning?</h2>
          <p className="text-gray-400 text-lg mb-8">Join hundreds of providers already earning passive income with their GPUs.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/signup" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer no-underline text-sm">
              Create Account
            </Link>
            <Link to="/dashboard" className="border border-white/30 hover:bg-white hover:text-black text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer no-underline text-sm">
              Go to Console
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
