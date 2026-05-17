import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function ProviderSetup() {
  useEffect(() => { document.title = 'Earn with Your GPU — hamro.ai' }, [])
  const [copied, setCopied] = useState(false)
  const agentCmd = 'HAMRO_EMAIL=you@email.com HAMRO_PASSWORD=your_password node agent/agent.js'

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(agentCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const steps = [
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
      desc: 'Paste your email and password into the command below and run it. The agent will handle the rest — connecting your GPU to the network.',
    },
  ]

  const supportedGPUs = [
    'NVIDIA RTX 3060+',
    'NVIDIA RTX 3070+',
    'NVIDIA RTX 3080+',
    'NVIDIA RTX 3090',
    'NVIDIA RTX 4060+',
    'NVIDIA RTX 4070+',
    'NVIDIA RTX 4080+',
    'NVIDIA RTX 4090',
    'NVIDIA A4000+',
    'NVIDIA A5000',
    'NVIDIA A6000',
    'NVIDIA Tesla T4',
    'NVIDIA Tesla V100',
    'NVIDIA Tesla A100',
    'NVIDIA H100',
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[1280px] mx-auto px-[32px] lg:px-[40px] 2xl:px-0">

        <section className="py-[80px] md:py-[120px] text-center">
          <div className="max-w-[800px] mx-auto">
            <h1 className="font-['Roboto',sans-serif] font-bold text-[2.5rem] md:text-[3rem] lg:text-[68px] leading-[1.1] m-0 text-white">
              Earn Money with Your GPU
            </h1>
            <p className="font-['Roboto',sans-serif] text-[16px] md:text-[18px] leading-[26px] mt-[20px] text-white/70 max-w-[600px] mx-auto">
              Turn your idle GPU into passive income. Join the hamro.ai provider network and earn rewards for sharing your compute power with AI developers worldwide.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-[40px]">
              <Link to="/signup"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px 28px', background: '#315fff', border: '1px solid transparent', borderRadius: '8px', fontFamily: 'Roboto, sans-serif', fontSize: '16px', fontWeight: 600, color: '#ffffff', cursor: 'pointer', textDecoration: 'none' }}>
                Get Started
              </Link>
              <a href="#how-it-works"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px 28px', background: 'transparent', border: '1px solid #f6f6f6', borderRadius: '8px', fontFamily: 'Roboto, sans-serif', fontSize: '16px', fontWeight: 600, color: '#f6f6f6', cursor: 'pointer', textDecoration: 'none' }}>
                Learn More
              </a>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-[60px] md:py-[80px] border-t border-white/10">
          <div className="max-w-[800px] mx-auto text-center mb-[60px]">
            <h2 className="font-['Roboto',sans-serif] font-semibold text-[32px] md:text-[40px] lg:text-[48px] leading-[1.2] m-0 text-white">How It Works</h2>
            <p className="font-['Roboto',sans-serif] text-[16px] md:text-[18px] leading-[26px] mt-[14px] text-white/70">
              Three simple steps to start earning.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
            {steps.map((s) => (
              <div key={s.num} className="border border-white/10 rounded-lg p-[30px] bg-white/5 text-center" style={{ boxShadow: '0 2px 8px 0 rgba(24,39,75,0.15)' }}>
                <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white">
                  <span className="font-['Roboto',sans-serif] font-bold text-[20px] text-white">{s.num}</span>
                </div>
                <h3 className="font-['Roboto',sans-serif] font-semibold text-[20px] text-white m-0 mb-2">{s.title}</h3>
                <p className="font-['Roboto',sans-serif] text-[15px] text-white/60 m-0">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-[60px] md:py-[80px] border-t border-white/10">
          <div className="max-w-[800px] mx-auto text-center mb-[40px]">
            <h2 className="font-['Roboto',sans-serif] font-semibold text-[32px] md:text-[40px] lg:text-[48px] leading-[1.2] m-0 text-white">Run the Agent</h2>
            <p className="font-['Roboto',sans-serif] text-[16px] md:text-[18px] leading-[26px] mt-[14px] text-white/70">
              Copy and run this command in your terminal after installing Node.js and Docker.
            </p>
          </div>
          <div className="max-w-[700px] mx-auto bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden">
            <div className="flex items-center gap-[6px] px-4 py-3 border-b border-[#30363d] bg-[#161b22]">
              <span className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
              <span className="w-[10px] h-[10px] rounded-full bg-[#febc2e]" />
              <span className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
              <span className="ml-3 text-[12px] text-[#8b949e] font-mono">terminal</span>
            </div>
            <div className="p-4 md:p-5 relative">
              <pre className="m-0 overflow-x-auto text-[13px] md:text-[14px] leading-[1.6] text-[#e6edf3] font-mono whitespace-pre-wrap break-all">
                <code>{agentCmd}</code>
              </pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-4 right-4 px-3 py-1.5 text-xs font-semibold rounded border transition cursor-pointer bg-[#21262d] border-[#30363d] text-[#8b949e] hover:text-white hover:border-white/30"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </section>

        <section className="py-[60px] md:py-[80px] border-t border-white/10">
          <div className="max-w-[800px] mx-auto text-center mb-[40px]">
            <h2 className="font-['Roboto',sans-serif] font-semibold text-[32px] md:text-[40px] lg:text-[48px] leading-[1.2] m-0 text-white">Eligibility</h2>
            <p className="font-['Roboto',sans-serif] text-[16px] md:text-[18px] leading-[26px] mt-[14px] text-white/70">
              Make sure your setup meets the minimum requirements.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] max-w-[1000px] mx-auto">
            <div className="border border-white/10 rounded-lg p-[30px] bg-white/5">
              <div className="w-[48px] h-[48px] flex items-center justify-center mb-4 rounded-lg bg-blue-600/20 text-blue-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z" /></svg>
              </div>
              <h3 className="font-['Roboto',sans-serif] font-semibold text-[18px] text-white m-0 mb-2">Minimum 4GB VRAM</h3>
              <p className="font-['Roboto',sans-serif] text-[14px] text-white/60 m-0">Your GPU must have at least 4GB of VRAM to participate. Higher VRAM GPUs earn more.</p>
            </div>
            <div className="border border-white/10 rounded-lg p-[30px] bg-white/5">
              <div className="w-[48px] h-[48px] flex items-center justify-center mb-4 rounded-lg bg-green-600/20 text-green-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
              </div>
              <h3 className="font-['Roboto',sans-serif] font-semibold text-[18px] text-white m-0 mb-2">Docker Required</h3>
              <p className="font-['Roboto',sans-serif] text-[14px] text-white/60 m-0">Docker must be installed and running. All workloads run in isolated Docker containers.</p>
            </div>
            <div className="border border-white/10 rounded-lg p-[30px] bg-white/5">
              <div className="w-[48px] h-[48px] flex items-center justify-center mb-4 rounded-lg bg-purple-600/20 text-purple-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              </div>
              <h3 className="font-['Roboto',sans-serif] font-semibold text-[18px] text-white m-0 mb-2">Supported GPUs</h3>
              <p className="font-['Roboto',sans-serif] text-[14px] text-white/60 m-0">Most modern NVIDIA GPUs with 4GB+ VRAM. View the full list below.</p>
            </div>
          </div>
          <div className="max-w-[700px] mx-auto mt-[40px]">
            <h3 className="font-['Roboto',sans-serif] font-semibold text-[18px] text-white mb-4 text-center">Supported GPU Models</h3>
            <div className="border border-white/10 rounded-lg bg-white/5 overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                {supportedGPUs.map((gpu, i) => (
                  <div key={gpu} className={`px-4 py-3 text-[14px] text-white/70 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                    {gpu}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-center text-[13px] text-white/40 mt-3">More GPUs added regularly. If yours isn't listed, check back soon.</p>
          </div>
        </section>

        <section className="py-[60px] md:py-[80px] border-t border-white/10">
          <div className="max-w-[800px] mx-auto text-center mb-[40px]">
            <h2 className="font-['Roboto',sans-serif] font-semibold text-[32px] md:text-[40px] lg:text-[48px] leading-[1.2] m-0 text-white">Earnings</h2>
            <p className="font-['Roboto',sans-serif] text-[16px] md:text-[18px] leading-[26px] mt-[14px] text-white/70">
              Transparent pricing. Fair rates. Regular payouts.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] max-w-[1000px] mx-auto">
            <div className="border border-white/10 rounded-lg p-[30px] bg-white/5 text-center">
              <h3 className="font-['Roboto',sans-serif] font-semibold text-[20px] text-white m-0 mb-3">15% Platform Fee</h3>
              <p className="font-['Roboto',sans-serif] text-[14px] text-white/60 m-0">We take a 15% fee on each rental. You keep 85% of the earnings. No hidden fees or monthly charges.</p>
            </div>
            <div className="border border-white/10 rounded-lg p-[30px] bg-white/5 text-center">
              <h3 className="font-['Roboto',sans-serif] font-semibold text-[20px] text-white m-0 mb-3">$5 Minimum Withdrawal</h3>
              <p className="font-['Roboto',sans-serif] text-[14px] text-white/60 m-0">Withdraw your earnings once you reach $5. Payouts are processed within 48 hours via bank transfer or PayPal.</p>
            </div>
            <div className="border border-white/10 rounded-lg p-[30px] bg-white/5 text-center">
              <h3 className="font-['Roboto',sans-serif] font-semibold text-[20px] text-white m-0 mb-3">Pricing Tips</h3>
              <p className="font-['Roboto',sans-serif] text-[14px] text-white/60 m-0">Set competitive rates based on GPU demand. Higher VRAM and newer architectures command premium pricing. Adjust anytime.</p>
            </div>
          </div>
        </section>

        <section className="py-[60px] md:py-[80px] border-t border-white/10">
          <div className="max-w-[800px] mx-auto text-center mb-[40px]">
            <h2 className="font-['Roboto',sans-serif] font-semibold text-[32px] md:text-[40px] lg:text-[48px] leading-[1.2] m-0 text-white">Security & FAQ</h2>
            <p className="font-['Roboto',sans-serif] text-[16px] md:text-[18px] leading-[26px] mt-[14px] text-white/70">
              Your machine stays safe. Here's how.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] max-w-[1000px] mx-auto">
            <div className="border border-white/10 rounded-lg p-[30px] bg-white/5">
              <div className="w-[48px] h-[48px] flex items-center justify-center mb-4 rounded-lg bg-green-600/20 text-green-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </div>
              <h3 className="font-['Roboto',sans-serif] font-semibold text-[18px] text-white m-0 mb-2">Sandboxed in Docker</h3>
              <p className="font-['Roboto',sans-serif] text-[14px] text-white/60 m-0">Every workload runs inside an isolated Docker container with no access to your host system, files, or network.</p>
            </div>
            <div className="border border-white/10 rounded-lg p-[30px] bg-white/5">
              <div className="w-[48px] h-[48px] flex items-center justify-center mb-4 rounded-lg bg-yellow-600/20 text-yellow-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              </div>
              <h3 className="font-['Roboto',sans-serif] font-semibold text-[18px] text-white m-0 mb-2">Resource Limited</h3>
              <p className="font-['Roboto',sans-serif] text-[14px] text-white/60 m-0">You control the CPU, memory, and GPU limits per container. Workloads cannot exceed the allocated resources.</p>
            </div>
            <div className="border border-white/10 rounded-lg p-[30px] bg-white/5">
              <div className="w-[48px] h-[48px] flex items-center justify-center mb-4 rounded-lg bg-red-600/20 text-red-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <h3 className="font-['Roboto',sans-serif] font-semibold text-[18px] text-white m-0 mb-2">Time-Bounded</h3>
              <p className="font-['Roboto',sans-serif] text-[14px] text-white/60 m-0">All workloads have a maximum runtime limit. Your GPU is never locked indefinitely — you stay in control.</p>
            </div>
          </div>
        </section>

        <section className="py-[60px] md:py-[80px] border-t border-white/10 text-center">
          <div className="max-w-[700px] mx-auto">
            <h2 className="font-['Roboto',sans-serif] font-semibold text-[32px] md:text-[40px] lg:text-[48px] leading-[1.2] m-0 text-white">
              Ready to Start Earning?
            </h2>
            <p className="font-['Roboto',sans-serif] text-[16px] md:text-[18px] leading-[26px] mt-[14px] text-white/70">
              Join hundreds of providers already earning passive income with their GPUs.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-[40px]">
              <Link to="/signup"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px 28px', background: '#315fff', border: '1px solid transparent', borderRadius: '8px', fontFamily: 'Roboto, sans-serif', fontSize: '16px', fontWeight: 600, color: '#ffffff', cursor: 'pointer', textDecoration: 'none' }}>
                Create Account
              </Link>
              <Link to="/dashboard"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px 28px', background: 'transparent', border: '1px solid #f6f6f6', borderRadius: '8px', fontFamily: 'Roboto, sans-serif', fontSize: '16px', fontWeight: 600, color: '#f6f6f6', cursor: 'pointer', textDecoration: 'none' }}>
                Go to Console
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
