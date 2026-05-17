import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AuthCallback from './pages/AuthCallback'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Docs from './pages/Docs'
import Pricing from './pages/Pricing'
import UseCases from './pages/UseCases'
import ModelLibrary from './pages/ModelLibrary'
import CaseStudies from './pages/CaseStudies'
import About from './pages/About'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import ProductPage from './pages/ProductPage'
import Legal from './pages/Legal'
import Hosting from './pages/Hosting'
import DataCenters from './pages/DataCenters'
import Financing from './pages/Financing'
import Hardware from './pages/Hardware'
import Careers from './pages/Careers'
import StartupProgram from './pages/StartupProgram'
import BlogPost from './pages/BlogPost'
import Press from './pages/Press'
import PressKit from './pages/PressKit'
import Enterprise from './pages/Enterprise'
import Explore from './pages/Explore'
import Trust from './pages/Trust'
import Transactions from './pages/Transactions'
import ProviderSetup from './pages/ProviderSetup'
import NotFound from './pages/NotFound'
import ErrorBoundary from './components/ErrorBoundary'
import ThemeToggle from './components/ThemeToggle'
import CurrencyToggle from './components/CurrencyToggle'
import Price from './components/Price'

const ITEM_LINKS = {
  'Quickstart': '/docs', 'CLI': '/docs', 'Python SDK': '/docs', 'API': '/docs', 'Docs': '/docs',
  'GPU Cloud': '/products/gpu-cloud', 'Clusters': '/products/clusters', 'Serverless': '/products/serverless',
  'Model Library': '/model-library',
  'Explore GPUs': '/explore',
  'Hosting': '/hosting', 'Data Centers': '/data-centers', 'Financing': '/financing', 'Hardware': '/hardware',
  'All Use Cases': '/use-cases', 'AI Agents': '/use-cases', 'AI Fine Tuning': '/use-cases',
  'AI Image + Video Generation': '/use-cases', 'AI Text Generation': '/use-cases',
  'AI/ML Frameworks': '/use-cases', 'Audio-to-Text Transcription': '/use-cases',
  'Batch Data Processing': '/use-cases', 'GPU Programming': '/use-cases',
  'Graphics Rendering': '/use-cases', 'Virtual Computing': '/use-cases',
  'Press Kit': '/press-kit', 'About': '/about', 'Blog': '/blog', 'Careers': '/careers', 'Enterprise': '/enterprise',
  'Trust Center': '/trust', 'Security': '/trust',
  'Case Studies': '/case-studies', 'Startup Program': '/startup-program', 'FAQ': '/faq',
  'Press Releases': '/press', 'Pricing': '/pricing', 'Contact Sales': '/contact',
  'Investor Inquiries': '/contact', 'Terms of Service': '/legal/terms',
  'Privacy Policy': '/legal/privacy', 'Compliance': '/legal/compliance',
  'Vulnerability Disclosure': '/legal/disclosure', 'Data Processing': '/legal/data-processing', 'Transactions': '/transactions',
  'Discord': 'https://discord.gg/hamroai', 'GitHub': 'https://github.com/hamroai', 'Twitter': 'https://twitter.com/hamroai', 'YouTube': 'https://youtube.com/@hamroai',
}

const NAV_LINKS = {
  Developers: '/docs',
  Products: '/products/gpu-cloud',
  Hosting: '/hosting',
  'Use Cases': '/use-cases',
  Company: '/about',
}

const NAV_ITEMS = [
  { label: 'Developers', items: ['Quickstart', 'CLI', 'Python SDK', 'API', 'Docs'] },
  { label: 'Products', items: ['GPU Cloud', 'Clusters', 'Serverless', 'Model Library', 'Explore GPUs'] },
  { label: 'Hosting', items: ['Hosting', 'Data Centers', 'Financing', 'Hardware', 'Docs'] },
  {
    label: 'Use Cases',
    items: [
      'All Use Cases', 'AI Agents', 'AI Fine Tuning', 'AI Image + Video Generation',
      'AI Text Generation', 'AI/ML Frameworks', 'Audio-to-Text Transcription',
      'Batch Data Processing', 'GPU Programming', 'Graphics Rendering', 'Virtual Computing',
    ],
  },
  { label: 'Company', items: ['About', 'Blog', 'Careers', 'Enterprise', 'Case Studies', 'Startup Program', 'FAQ', 'Press Releases'] },
]

function Navbar() {
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const closeTimerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed w-full z-[999] transition-all duration-300 ${scrolled ? 'bg-[rgba(26,26,26,0.9)] backdrop-blur-md' : 'bg-transparent'}`}>
      <nav className="max-w-[1280px] mx-auto w-full px-[32px] lg:px-[40px] 2xl:px-0">
        <div className="flex items-center justify-between transition-all duration-300 h-[75px]">
          <div className="flex items-center gap-[30px]">
            <Link to="/"><img alt="hamro.ai" title="hamro.ai" width="114" height="30" src="./vast_logo.svg" /></Link>
            <ul className="hidden xl:flex items-center gap-[28px] 2xl:gap-[32px] list-none m-0 p-0 mt-[7px]">
              {NAV_ITEMS.map((item) => (
                <li key={item.label} className="relative"
                  onMouseEnter={() => {
                    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
                    setOpenDropdown(item.label)
                  }}
                  onMouseLeave={() => {
                    closeTimerRef.current = setTimeout(() => setOpenDropdown(null), 150)
                  }}
                >
                  <Link to={NAV_LINKS[item.label] || '/'} className="font-heading font-semibold text-[15px] xl:text-[17px] transition-colors duration-150 text-[#d4d4d4] hover:text-white no-underline flex items-center gap-1"
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}>
                    {item.label}
                    <span style={{ display: 'inline-block', width: '20px', height: '20px', WebkitMaskImage: 'url(/icons/chevron-down.svg)', maskImage: 'url(/icons/chevron-down.svg)', backgroundColor: '#595959', WebkitMaskSize: 'contain', maskSize: 'contain' }} />
                  </Link>
                  {openDropdown === item.label && (
                    <div className="absolute left-0 top-full pt-2 bg-[#242424] rounded-md shadow-lg py-2 min-w-[180px] z-50 border border-[#333]"
                      onMouseEnter={() => {
                        if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
                      }}
                      onMouseLeave={() => {
                        closeTimerRef.current = setTimeout(() => setOpenDropdown(null), 150)
                      }}>
                      {item.items.map((sub) => (
                        <Link key={sub} to={ITEM_LINKS[sub] || '/'} className="block px-4 py-2 text-[15px] font-heading font-medium text-[#d4d4d4] hover:text-white no-underline whitespace-nowrap transition-colors duration-150">
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
              <li><Link to="/pricing" className="font-heading font-semibold text-[15px] xl:text-[17px] transition-colors duration-150 text-[#d4d4d4] hover:text-white no-underline">Pricing</Link></li>
            </ul>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/signup" className="hidden sm:inline-flex items-center px-[10px] py-[6px] border border-[#00d0a2] rounded text-[#00d0a2] font-heading font-semibold text-[15px] xl:text-[17px] transition-colors duration-150 hover:bg-[#00d0a2] hover:text-white no-underline">
              Get Started
            </Link>
            <Link to="/dashboard" className="inline-flex items-center px-[10px] py-[6px] border border-white/20 rounded text-[#d4d4d4] font-heading font-semibold text-[15px] xl:text-[17px] transition-colors duration-150 hover:bg-[#d4d4d4] hover:text-black no-underline">
              Console
            </Link>
            {user?.isAdmin && (
              <Link to="/admin" className="inline-flex items-center px-[10px] py-[6px] border border-yellow-600/50 rounded text-yellow-500 font-heading font-semibold text-[15px] xl:text-[17px] transition-colors duration-150 hover:bg-yellow-600 hover:text-white no-underline">
                Admin
              </Link>
            )}
            <div className="hidden sm:block"><CurrencyToggle /></div>
            <ThemeToggle />
            <button className="xl:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              <div className="w-5 h-0.5 bg-[#d4d4d4] mb-1" />
              <div className="w-5 h-0.5 bg-[#d4d4d4] mb-1" />
              <div className="w-5 h-0.5 bg-[#d4d4d4]" />
            </button>
          </div>
        </div>
      </nav>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[300px] bg-[#1a1a1a] p-6 overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="border-b border-white/10 py-3">
                <button onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                  className="w-full text-white font-semibold text-[17px] flex items-center justify-between bg-transparent border-none cursor-pointer">
                  {item.label}
                  <svg className={`transition ${mobileExpanded === item.label ? 'rotate-180' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                {mobileExpanded === item.label && (
                  <div className="mt-2 ml-2 space-y-2">
                    {item.items.map((sub) => (
                      <Link key={sub} to={ITEM_LINKS[sub] || '/'} onClick={() => setMobileOpen(false)}
                        className="block text-[#d4d4d4] text-sm no-underline hover:text-white transition-colors">
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-6 space-y-3">
              <Link to="/pricing" onClick={() => setMobileOpen(false)} className="block text-[#d4d4d4] font-semibold text-[17px] no-underline">Pricing</Link>
              <Link to="/docs" onClick={() => setMobileOpen(false)} className="block text-[#d4d4d4] font-semibold text-[17px] no-underline">Docs</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function Sparkline({ data, color = '#f97316' }) {
  const w = 300, h = 40
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 5) - 2}`).join(' ')
  const area = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 5) - 2}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10 overflow-visible">
      <path d={`M${points}`} fill="none" stroke={color} strokeWidth="2" />
      <path d={`M${area} L${w},${h} L0,${h} Z`} fill={color} opacity="0.1" />
    </svg>
  )
}

function Hero() {
  return (
    <div className="hero-section bg-black relative overflow-hidden w-full mb-0 flex flex-col !mt-0 !py-0">
      <video className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none z-0" src="https://storage.googleapis.com/vast-public-media-assets/video/vid-home-hero.mp4" autoPlay loop muted playsInline preload="auto" aria-hidden="true" style={{ filter: 'brightness(0.65) saturate(0.9)' }} />
      <div className="absolute inset-0 bg-black/35 pointer-events-none z-0" />
      <div className="max-w-[1280px] mx-auto w-full py-2 md:py-8 my-8 px-[32px] lg:px-[40px] 2xl:px-0 relative z-10 w-full flex-1 flex items-center pt-[175px] md:pt-[195px]">
        <div className="flex flex-col items-start gap-3 w-full max-w-[680px] pb-4 md:pb-0">
          <span className="flex items-center text-white font-medium text-[14px] pb-1 sans-font">
            <span style={{ display: 'inline-block', width: '20px', height: '20px', marginRight: '8px', WebkitMaskImage: 'url(/icons/shield-check.svg)', maskImage: 'url(/icons/shield-check.svg)', backgroundColor: 'white', WebkitMaskSize: 'contain', maskSize: 'contain' }} />
            SOC 2 Certified
          </span>
          <h1 className="text-left text-[2.5rem] md:text-[3rem] lg:text-[68px] font-bold text-white leading-[1.1] m-0">Agent-Ready AI<br />Infrastructure.</h1>
          <p className="text-[0.9rem] md:text-[0.95rem] lg:text-[1rem] text-white -mt-1 mb-6 leading-relaxed sans-font">
            hamro.ai is the infrastructure layer where AI agents autonomously design, procure, and optimize their own compute. Per-second billing. Real-time pricing. No lock-in.
          </p>
          <form className="mt-2 flex flex-col w-full max-w-[560px]" onSubmit={(e) => { e.preventDefault(); window.location.href = '/signup' }}>
            <div className="flex w-full bg-white rounded-full p-2 md:px-3 gap-3 items-center">
              <input type="email" placeholder="What's your work email?" className="flex-1 rounded-full text-[#0a0a0a] placeholder:text-[#6b7280] text-base sans-font truncate px-2 py-2 md:px-4 md:py-3 focus:outline-none" style={{ background: 'transparent', border: 'none' }} />
              <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '10px 28px', background: '#315fff', border: '1px solid transparent', borderRadius: '60px', fontFamily: 'Roboto, sans-serif', fontSize: '16px', fontWeight: 600, lineHeight: '16px', color: '#ffffff', cursor: 'pointer', whiteSpace: 'nowrap' }}>Get Started</button>
            </div>
          </form>
          <div className="mt-3">
            <Link to="/docs" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '10px 28px', background: 'transparent', border: '1px solid #f6f6f6', borderRadius: '60px', fontFamily: 'Roboto, sans-serif', fontSize: '16px', fontWeight: 600, color: '#f6f6f6', cursor: 'pointer', textDecoration: 'none' }}>CLI Docs</Link>
          </div>
        </div>
      </div>
      <div className="relative w-full pt-4 pb-10 md:pb-20" style={{ background: 'linear-gradient(to top, #000000 0%, #000000 15%, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.2) 70%, transparent 100%)' }}>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:gap-x-10 mb-6">
          {['700K+ transactions/mo', '20,000+ GPUs', 'Available in Nepal', '68+ GPU types'].map((s) => (
            <span key={s} className="font-mono text-[15px] md:text-[17px] text-white/80 whitespace-nowrap">{s}</span>
          ))}
        </div>
        <p className="text-white text-center text-sm mb-5 sans-font">Trusted by innovative teams worldwide</p>
        <div className="w-full overflow-hidden">
          <div className="flex gap-12" style={{ animation: 'marquee 28s linear infinite', width: 'max-content' }}>
            {[1, 2].map((dup) => (
              <div key={dup} className="flex gap-12 items-center">
                {['Chai', 'bosch', 'cognition', 'inria', 'ibm', 'brave', 'speechify'].map((name) => (
                  <div key={name} className="h-[24px] md:h-[28px] w-auto opacity-80 flex items-center text-white/40 text-sm font-medium tracking-wider uppercase">{name}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const gpuCards = [
  { name: 'RTX PRO 6000 S', arch: 'Blackwell', vram: '48GB VRAM', price: 1.33, rangeLow: 0.73, rangeHigh: 2.00, availability: 'Med', dots: [true, true, false], sparkData: [35, 32, 30, 28, 25, 22, 18, 15, 12, 10, 8, 6] },
  { name: 'RTX 4090', arch: 'Ada Lovelace', vram: '24GB VRAM', price: 0.33, rangeLow: 0.13, rangeHigh: 2.40, availability: 'High', dots: [true, true, true], sparkData: [38, 38, 35, 35, 32, 30, 28, 25, 22, 20, 22, 22] },
  { name: 'H100', arch: 'Hopper', vram: '80GB VRAM', price: 3.49, rangeLow: 2.50, rangeHigh: 4.80, availability: 'Low', dots: [true, false, false], sparkData: [20, 25, 22, 28, 30, 25, 20, 22, 18, 15, 12, 10] },
]

function RealTimeInfra() {
  return (
    <section className="bg-[#0a0a0a] text-white py-16 px-4 font-sans">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Real-time GPU infrastructure</h2>
        <p className="text-gray-400 text-lg">Prices set by supply and demand across 20,000+ GPUs. Transparent. Programmatically queryable.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {gpuCards.map((card) => (
          <div key={card.name} className="bg-[#161616] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{card.name}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="bg-[#222] text-xs text-gray-400 px-2 py-0.5 rounded">{card.arch}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">{card.vram}</span>
                </div>
              </div>
            </div>
            <div className="my-6"><Sparkline data={card.sparkData} /></div>
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-baseline gap-1">
                  <Price usd={card.price} className="text-2xl font-bold" />
                  <span className="text-gray-500 text-sm">/hr</span>
                </div>
                <p className="text-gray-600 text-xs mt-1"><Price usd={card.rangeLow} /> — <Price usd={card.rangeHigh} />/hr range</p>
              </div>
              <Link to="/explore" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer inline-block text-center no-underline">Rent</Link>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-12">
        <Link to="/explore" className="border border-gray-700 hover:bg-white hover:text-black text-white font-semibold py-3 px-8 rounded-lg transition-all flex items-center gap-2 cursor-pointer no-underline inline-flex">
          View All GPUs
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </Link>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { num: '1', title: 'Add credit & get your API key', desc: 'Start with as little as $5. Grab your API key from the console — no contracts, no sales calls.' },
    { num: '2', title: 'Search GPUs', desc: 'Filter by model, VRAM, price, and availability — via console or API.' },
    { num: '3', title: 'Deploy', desc: 'Launch instances in seconds. Scale up or down programmatically.' },
  ]

  return (
    <section className="bg-transparent py-[60px] md:py-[80px]">
      <div className="max-w-[1280px] mx-auto px-[32px] lg:px-[40px] 2xl:px-0">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-['Roboto',sans-serif] font-semibold text-[32px] md:text-[40px] lg:text-[48px] leading-[1.2] m-0 text-white">How it works</h2>
          <p className="font-['Roboto',sans-serif] font-normal text-[16px] md:text-[18px] leading-[26px] mt-[14px] m-0 text-white/70">
            From sign-up to running GPU workloads in under five minutes.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-[30px]">
          {steps.map((s) => (
            <div key={s.num} className="text-center border border-white/10 rounded-lg p-[30px] bg-transparent" style={{ boxShadow: '0 2px 8px 0 rgba(24,39,75,0.15)' }}>
              <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center mx-auto mb-4" style={{ border: '2px solid #ffffff' }}>
                <span className="font-['Roboto',sans-serif] font-bold text-[20px]" style={{ color: '#ffffff' }}>{s.num}</span>
              </div>
              <h3 className="font-['Roboto',sans-serif] font-semibold text-[20px] text-white m-0 mb-2">{s.title}</h3>
              <p className="font-['Roboto',sans-serif] text-[15px] text-white/60 m-0">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
              <Link to="/signup"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '10px 16px', background: '#315fff', border: '1px solid transparent', borderRadius: '8px', fontFamily: 'Roboto, sans-serif', fontSize: '16px', fontWeight: 600, color: '#ffffff', cursor: 'pointer', textDecoration: 'none' }}>
                Get Started
              </Link>
          <Link to="/contact"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '10px 16px', background: 'transparent', border: '1px solid #f6f6f6', borderRadius: '8px', fontFamily: 'Roboto, sans-serif', fontSize: '16px', fontWeight: 600, color: '#f6f6f6', cursor: 'pointer', textDecoration: 'none' }}>
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  )
}

function DevTools() {
  return (
    <section className="py-[60px] md:py-[80px]">
      <div className="max-w-[1280px] mx-auto px-[16px] md:px-[40px] lg:px-[40px] 2xl:px-0">
        <div className="bg-[#1a1a1a] rounded-lg px-[24px] md:px-[48px] lg:px-[64px] py-[48px] md:py-[64px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] md:gap-[48px] items-start">
            <div className="flex flex-col gap-6">
              <h2 className="font-['Roboto',sans-serif] font-bold text-[28px] md:text-[36px] text-white m-0 mb-3 leading-tight">Compare. Launch. Exit. Repeat.</h2>
              <p className="font-['Roboto',sans-serif] text-[15px] md:text-[16px] text-[#b0b0b0] m-0 leading-relaxed">
                Every GPU on hamro.ai is provisioned through code. The same API that developers use to deploy in seconds is the interface agents use to procure and optimize at scale.
              </p>

              <div className="mt-4">
                <span className="font-['Roboto',sans-serif] font-semibold text-[14px] text-white tracking-wide uppercase">Python SDK &amp; CLI</span>
                <div className="mt-2">
                  <code className="bg-[#0d1117] text-[#e6edf3] text-[13px] font-mono px-3 py-2 rounded-md block overflow-x-auto">pip install hamro-ai</code>
                </div>
                <p className="font-['Roboto',sans-serif] text-[13px] text-[#8b8b8b] m-0 mt-3">One install gives you both the CLI and Python SDK.</p>
                <div className="mt-2">
                  <span className="text-[13px] text-[#b0b0b0]"><span className="text-white font-semibold">SDK</span> — Programmatic compute provisioning in five lines of code.</span>
                  <Link to="/docs" className="ml-2 text-[#315fff] hover:text-[#a8bbff] text-[13px] no-underline">Docs →</Link>
                </div>
                <div className="mt-1">
                  <span className="text-[13px] text-[#b0b0b0]"><span className="text-white font-semibold">CLI</span> — Search, filter, and deploy from your terminal.</span>
                  <Link to="/docs" className="ml-2 text-[#315fff] hover:text-[#a8bbff] text-[13px] no-underline">Docs →</Link>
                </div>
              </div>

              <div className="mt-2">
                <span className="font-['Roboto',sans-serif] font-semibold text-[14px] text-white tracking-wide uppercase">REST API</span>
                <p className="font-['Roboto',sans-serif] text-[13px] text-[#8b8b8b] m-0 mt-2">The interface agents call to provision infrastructure.</p>
                <div className="mt-2">
                  <code className="bg-[#0d1117] text-[#e6edf3] text-[12px] md:text-[13px] font-mono px-3 py-2 rounded-md block overflow-x-auto overflow-y-hidden whitespace-nowrap max-w-full">
                    curl -H &quot;Authorization: Bearer $HAMRO_API_KEY&quot; https://hamro.ai/api/v1/bundles/
                  </code>
                </div>
                <Link to="/docs" className="inline-block mt-2 text-[#a8bbff] hover:text-[#315fff] text-[13px] no-underline">Docs →</Link>
              </div>

              <div className="mt-2">
              <Link to="/docs"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '10px 16px', background: '#315fff', border: '1px solid transparent', borderRadius: '8px', fontFamily: 'Roboto, sans-serif', fontSize: '14px', fontWeight: 600, color: '#ffffff', cursor: 'pointer', textDecoration: 'none' }}>
                Explore Developer Tools
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              </div>
            </div>

            <div className="bg-[#0d1117] rounded-lg overflow-hidden border border-[#30363d] min-w-0">
              <div className="flex items-center gap-[6px] px-4 py-3 border-b border-[#30363d]">
                <span className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
                <span className="w-[10px] h-[10px] rounded-full bg-[#febc2e]" />
                <span className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
                <span className="ml-3 text-[12px] text-[#8b949e] font-mono">deploy.py</span>
              </div>
              <pre className="p-4 md:p-5 m-0 overflow-x-auto text-[12px] md:text-[13px] leading-[1.7] text-[#e6edf3] min-h-[260px] font-mono">
                <code>
                  <span className="text-[#8b949e">from hamro_ai import deploy</span>{'\n\n'}
                  <span className="text-[#e6edf3]">deploy(</span>{'\n'}
                  <span className="ml-3">gpu="H100",</span>{'\n'}
                  <span className="ml-3">count=4,</span>{'\n'}
                  <span className="ml-3">region="nepal",</span>{'\n'}
                  <span>)</span>{'\n\n'}
                  <span className="inline-block w-[8px] h-[16px] bg-[#e6edf3] animate-pulse ml-[2px] align-middle" />
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DeployOptions() {
  const items = [
    { title: 'GPU Cloud', desc: 'On-demand GPU instances available in Nepal. Deploy in seconds via CLI, SDK, or API.', link: 'Explore GPU Cloud', href: '/products/gpu-cloud' },
    { title: 'Serverless', desc: 'Deploy models as endpoints with automatic benchmarking and optimization across GPU types. Autoscale to zero, pay only for compute time.', link: 'Try Serverless', href: '/products/serverless' },
    { title: 'Clusters', desc: 'Dedicated multi-node GPU clusters with InfiniBand networking for large-scale training.', link: 'View Clusters', href: '/products/clusters' },
  ]

  return (
    <section className="bg-transparent py-[60px] md:py-[80px]">
      <div className="max-w-[1280px] mx-auto px-[32px] lg:px-[40px] 2xl:px-0">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-['Roboto',sans-serif] font-semibold text-[32px] md:text-[40px] lg:text-[48px] leading-[1.2] m-0 text-white">One platform. Three ways to deploy.</h2>
          <p className="font-['Roboto',sans-serif] font-normal text-[16px] md:text-[18px] leading-[26px] mt-[14px] m-0 text-white/70">
            GPU Cloud for full control. Serverless for zero-ops inference. Clusters for large-scale training.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] mt-10">
          {items.map((item) => (
            <div key={item.title} className="border rounded-lg overflow-hidden flex flex-col transition-shadow duration-200 hover:shadow-lg border-white/10 bg-white/5" style={{ boxShadow: '0 2px 8px 0 rgba(24,39,75,0.15)' }}>
              <div className="p-[30px] flex flex-col flex-1">
                <h3 className="font-['Roboto',sans-serif] font-semibold text-[20px] md:text-[24px] leading-[1.3] m-0 text-white">{item.title}</h3>
                <p className="font-['Roboto',sans-serif] font-normal leading-[1.5] mt-3 m-0 flex-1 text-white/60 text-[14px] md:text-[16px]">{item.desc}</p>
                <div className="mt-4">
                  <Link to={item.href}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '10px 16px', background: 'transparent', border: '1px solid #f6f6f6', borderRadius: '8px', fontFamily: 'Roboto, sans-serif', fontSize: '14px', fontWeight: 600, color: '#f6f6f6', cursor: 'pointer', textDecoration: 'none' }}>
                    {item.link}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function LandingUseCases() {
  const tags = [
    'AI/ML Frameworks', 'AI Text Generation', 'AI Image + Video Generation', 'AI Agents',
    'Batch Data Processing', 'Audio-to-Text Transcription', 'AI Fine Tuning',
    'Virtual Computing', 'GPU Programming', 'Graphics Rendering',
  ]

  return (
    <section className="bg-transparent py-[60px] md:py-[80px]">
      <div className="max-w-[1280px] mx-auto px-[32px] lg:px-[40px] 2xl:px-0">
        <div className="rounded-lg p-[28px] flex flex-col lg:flex-row gap-[40px] items-stretch lg:items-center border border-white/10">
          <div className="relative flex-shrink-0 w-full lg:w-[580px] h-[280px] md:h-[340px] lg:h-[400px] rounded-lg overflow-hidden bg-black">
            <div className="w-full h-full bg-gradient-to-br from-[#315fff]/20 to-[#00d0a2]/10 flex items-center justify-center">
              <div className="text-center p-8">
                <p className="text-[24px] md:text-[32px] lg:text-[36px] font-semibold text-white m-0 leading-tight">Built for Every AI Workload</p>
                <p className="text-[14px] text-white/60 m-0 mt-3">From training to inference, fine-tuning to rendering — run any GPU workload on hamro.ai.</p>
                <div className="mt-6">
                  <Link to="/use-cases" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#1a1a1a] rounded-lg font-semibold text-[14px] no-underline hover:opacity-90 transition">
                    Use Cases
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-wrap gap-[10px] content-start">
            {tags.map((tag) => (
              <Link key={tag} to="/use-cases" className="no-underline">
                <span className="rounded-lg px-[10px] py-[8px] text-[14px] md:text-[16px] lg:text-[18px] whitespace-nowrap inline-block hover:bg-white/5 transition-colors cursor-pointer text-white" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
                  {tag}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PopularModels() {
  const models = [
    { name: 'Kimi K2.6', desc: 'Kimi K2.6 is an open-source, native multimodal agentic MoE model from Moonshot AI with 1T total parameters, 32B activated, advancing long-horizon coding, coding-driven design, and swarm-based task orchestration.', logo: 'moonshot-ai' },
    { name: 'Qwen3.6 35B A3B', desc: 'Agentic coding MoE with hybrid Gated DeltaNet and vision support', logo: 'alibaba' },
    { name: 'Gemma 4 31B IT', desc: 'Gemma 4 31B dense vision-language model by Google with 256K context and thinking mode', logo: 'google' },
    { name: 'Qwen3.5 27B', desc: 'Dense 27B vision-language model with unified multimodal reasoning', logo: 'alibaba' },
  ]

  return (
    <section className="bg-transparent py-[60px] md:py-[80px]">
      <div className="max-w-[1280px] mx-auto px-[32px] lg:px-[40px] 2xl:px-0">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-['Roboto',sans-serif] font-semibold text-[32px] md:text-[40px] lg:text-[48px] leading-[1.2] m-0 text-white">Popular Models, Ready to Deploy</h2>
          <p className="font-['Roboto',sans-serif] font-normal text-[16px] md:text-[18px] leading-[26px] mt-[14px] m-0 text-white/70">
            Launch pre-configured templates for the most popular open-source models.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px] mt-10">
          {models.map((m) => (
            <div key={m.name} className="border rounded-lg overflow-hidden flex flex-col transition-shadow duration-200 hover:shadow-lg border-white/10 bg-white/5" style={{ boxShadow: '0 2px 8px 0 rgba(24,39,75,0.15)' }}>
              <div className="p-[30px] flex flex-col flex-1">
                <div className="mb-4 text-white/60">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold uppercase text-white/40">{m.logo.slice(0, 2)}</div>
                </div>
                <h3 className="font-['Roboto',sans-serif] font-semibold text-[20px] md:text-[24px] leading-[1.3] m-0 text-white">{m.name}</h3>
                <p className="font-['Roboto',sans-serif] font-normal leading-[1.5] mt-3 m-0 flex-1 text-white/60 text-[12px] md:text-[13px]">{m.desc}</p>
                <div className="mt-4">
                  <Link to="/model-library"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '10px 16px', background: 'transparent', border: '1px solid #f6f6f6', borderRadius: '8px', fontFamily: 'Roboto, sans-serif', fontSize: '14px', fontWeight: 600, color: '#f6f6f6', cursor: 'pointer', textDecoration: 'none' }}>
                    Deploy
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link to="/model-library"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '10px 16px', background: 'transparent', border: '1px solid #f6f6f6', borderRadius: '8px', fontFamily: 'Roboto, sans-serif', fontSize: '14px', fontWeight: 600, color: '#f6f6f6', cursor: 'pointer', textDecoration: 'none' }}>
            Browse Model Library
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

const TESTIMONIALS = [
  { text: 'hamro.ai reduced our GPU costs by over 60% while giving us the flexibility to scale training jobs on demand. We serve 200K daily users without breaking the bank.', name: 'Giang', title: 'Creatix Technology' },
  { text: 'We cut our infrastructure spend by half and doubled our model training throughput. hamro.ai is a game-changer for Nepali AI startups.', name: 'Aarav', title: 'Kathmandu AI Labs' },
  { text: 'The easiest way to rent GPUs in Nepal. No more dealing with foreign cloud providers and complex billing.', name: 'Sita', title: 'Lumbini Tech' },
]

function Testimonials() {
  const [idx, setIdx] = useState(0)
  const [fade, setFade] = useState(true)
  const t = TESTIMONIALS[idx]

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % TESTIMONIALS.length)
        setFade(true)
      }, 300)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-[60px] md:py-[80px]">
      <div className="max-w-[1280px] mx-auto px-[32px] lg:px-[40px] 2xl:px-0">
        <section className="rounded-lg p-[40px] md:p-[60px] bg-white/5 border border-white/10">
          <blockquote className="m-0">
            <p className={`font-['Roboto',sans-serif] font-normal text-[20px] md:text-[24px] lg:text-[28px] leading-[1.4] text-white m-0 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
              &ldquo;{t.text}&rdquo;
            </p>
            <footer className="mt-6">
              <p className={`font-['Roboto',sans-serif] font-normal text-[16px] md:text-[18px] text-white/60 m-0 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>{t.name}<span className="text-white/40">, {t.title}</span></p>
            </footer>
          </blockquote>
          <div className="flex items-center justify-center gap-[48px] mt-10">
            <button onClick={() => { setIdx((idx - 1 + TESTIMONIALS.length) % TESTIMONIALS.length); setFade(true) }} className="text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-2" aria-label="Previous testimonial">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => { setIdx(i); setFade(true) }} className={`w-2 h-2 rounded-full transition cursor-pointer border-none ${i === idx ? 'bg-white' : 'bg-white/30'}`} />
              ))}
            </div>
            <button onClick={() => { setIdx((idx + 1) % TESTIMONIALS.length); setFade(true) }} className="text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-2" aria-label="Next testimonial">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </section>
  )
}

function LandingCaseStudies() {
  const studies = [
    {
      company: 'Creatix Technology',
      title: "Creatix Technology Scales to 200K Daily Users with hamro.ai's GPU Cloud",
      desc: 'How a fast-growing AI app company cut infrastructure costs by over 60% and powered millions of new users with hamro.ai.',
      tag: 'Tech',
      href: '/case-studies/creatix-technology',
      gradient: 'from-[#315fff]/20 to-[#00d0a2]/10',
    },
    {
      company: 'PAICON',
      title: 'PAICON Accelerates Global, Data-Centric Cancer Diagnostics with hamro.ai',
      desc: 'How a global oncology data platform used hamro.ai\'s GPU cloud to rapidly iterate on Athena, validating that diversity can matter more than scale.',
      tag: 'Medical AI',
      href: '/case-studies/paicon',
      gradient: 'from-[#00d0a2]/20 to-[#315fff]/10',
    },
  ]

  return (
    <section className="bg-transparent py-[60px] md:py-[80px]">
      <div className="max-w-[1280px] mx-auto px-[32px] lg:px-[40px] 2xl:px-0">
        <div className="max-w-[800px] mx-auto text-center mb-10">
          <h2 className="font-['Roboto',sans-serif] font-semibold text-[32px] md:text-[40px] lg:text-[48px] leading-[1.2] m-0 text-white">How teams build on hamro.ai</h2>
          <p className="font-['Roboto',sans-serif] font-normal text-[16px] md:text-[18px] leading-[26px] mt-[14px] m-0 text-white/70">
            See how teams use hamro.ai to scale AI infrastructure and accelerate production workloads.
          </p>
        </div>
        <div className="space-y-6">
          {studies.map((s) => (
            <div key={s.company} className="border rounded-[8px] p-[24px] flex flex-col md:flex-row gap-[40px] items-start justify-center border-white/10 bg-white/5">
              <Link to={s.href} className="block flex-1 min-w-0 md:min-w-[300px] no-underline">
                <div className="aspect-[16/9] overflow-hidden rounded-[4px] relative">
                  <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(49,95,255,0.2), rgba(0,208,162,0.1))' }}>
                    <span className="text-white/30 text-4xl font-bold">{s.company[0]}</span>
                  </div>
                </div>
              </Link>
              <div className="flex flex-col gap-[16px] flex-1 min-w-0 md:min-w-[300px]">
                <p className="text-[16px] leading-[26px] mb-0 text-white/50">{s.company}</p>
                <h3 className="text-[22px] md:text-[26px] leading-[32px] font-medium mb-0 text-white">{s.title}</h3>
                <p className="text-[16px] leading-[26px] mb-0 text-white/70">{s.desc}</p>
                <div>
                  <span className="text-[14px] leading-[26px] px-[12px] py-[2px] rounded-[12px] bg-white/10 text-white">{s.tag}</span>
                </div>
                <div>
                  <Link to={s.href} className="no-underline inline-flex gap-[10px] items-center justify-center px-[16px] py-[10px] rounded-[8px] border font-semibold text-[14px] leading-[1.2] transition-colors duration-150 border-white/30 text-white hover:bg-white hover:text-[#0a0a0a]">
                    View Case Study
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-[32px] lg:px-[40px] 2xl:px-0 my-[40px]">
      <section className="relative overflow-hidden rounded-lg bg-black">
        <div className="absolute inset-0 bg-black" />
        <div className="relative z-10 px-[40px] md:px-[90px] py-[80px] md:py-[120px]">
          <div className="max-w-[1080px] mx-auto flex flex-col items-center text-center">
            <h2 className="font-['Roboto',sans-serif] font-semibold text-[32px] md:text-[40px] lg:text-[48px] leading-[1.2] text-white m-0 max-w-[800px]">
              Start with $5. Scale to 20,000 GPUs. Per-second billing.
            </h2>
            <p className="font-['Roboto',sans-serif] font-normal text-[16px] md:text-[18px] leading-[26px] text-white/80 mt-2 m-0 max-w-[800px]">
              No humans required. No minimums. No lock-in.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Link to="/signup"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '10px 16px', background: '#315fff', border: '1px solid transparent', borderRadius: '8px', fontFamily: 'Roboto, sans-serif', fontSize: '16px', fontWeight: 600, color: '#ffffff', cursor: 'pointer', textDecoration: 'none' }}>
                Get Started
              </Link>
              <Link to="/contact"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '10px 16px', background: 'transparent', border: '1px solid #f6f6f6', borderRadius: '8px', fontFamily: 'Roboto, sans-serif', fontSize: '16px', fontWeight: 600, color: '#f6f6f6', cursor: 'pointer', textDecoration: 'none' }}>
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Footer() {
  const [footerEmail, setFooterEmail] = useState('')
  const [footerMsg, setFooterMsg] = useState('')
  const cols = {
    Products: ['GPU Cloud', 'Clusters', 'Hosting'],
    Developers: ['CLI', 'Python SDK', 'API Reference', 'Documentation'],
    Resources: ['Enterprise', 'Startup Program', 'Pricing', 'Use Cases', 'Docs', 'FAQs', 'Press Kit', 'Press Releases'],
    Community: ['Discord', 'GitHub', 'Twitter', 'YouTube'],
    Trust: ['Trust Center', 'Vulnerability Disclosure', 'Data Processing'],
    Contact: ['Contact Sales', 'Investor Inquiries'],
    Legal: ['Terms of Service', 'Privacy Policy', 'Compliance', 'Vulnerability Disclosure', 'Data Processing'],
  }

  return (
    <footer className="bg-[#0d0d0d] py-[60px] md:py-[80px] font-heading border-t border-white/10">
      <div className="max-w-[1280px] mx-auto w-full px-[32px] lg:px-[40px] 2xl:px-0">
        <div className="flex flex-col xl:flex-row gap-[58px]">
          <div className="flex flex-row gap-[56px] xl:w-[480px] shrink-0">
            <div className="flex flex-col gap-6 w-full max-w-[320px]">
              <img alt="hamro.ai" width="40" height="45" src="./vast_logo.svg" />
              <p className="text-white text-[18px] font-bold m-0">Subscribe for our product updates.</p>
              <form className="flex w-full border-b border-white/20 pb-2" onSubmit={async (e) => {
                e.preventDefault()
                if (!footerEmail) return
                try {
                  const API = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'
                  const res = await fetch(`${API}/subscribe`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: footerEmail }) })
                  const data = await res.json()
                  setFooterMsg(data.message || 'Subscribed!')
                  setFooterEmail('')
                  setTimeout(() => setFooterMsg(''), 3000)
                } catch { setFooterMsg('Error subscribing') }
              }}>
                <input type="email" placeholder="Your email" value={footerEmail} onChange={(e) => setFooterEmail(e.target.value)} className="text-[18px] w-full bg-transparent outline-none text-white placeholder:text-white/50 font-medium" />
                <button type="submit" className="bg-transparent p-2 text-white cursor-pointer text-[21px]">→</button>
              </form>
              {footerMsg && <p className="text-xs text-green-400">{footerMsg}</p>}
              <p className="text-white/40 text-[13px] hidden xl:block m-0">© 2026 hamro.ai. All rights reserved.</p>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-x-[32px] gap-y-[40px] flex-1 justify-between">
            {Object.entries(cols).map(([cat, links]) => (
              <div key={cat} className="flex flex-col gap-3">
                <h3 className="text-white text-[18px] font-heading font-bold m-0">{cat}</h3>
                <ul className="flex flex-col gap-3 list-none m-0 p-0">
                  {links.map((link) => (
                    <li key={link}>
                    {(() => {
                      const url = ITEM_LINKS[link] || '/'
                      if (url.startsWith('http')) return <a href={url} target="_blank" rel="noopener noreferrer" className="text-white/70 text-[16px] font-heading font-medium no-underline hover:text-[#a8bbff] transition-colors duration-150">{link}</a>
                      return <Link to={url} className="text-white/70 text-[16px] font-heading font-medium no-underline hover:text-[#a8bbff] transition-colors duration-150">{link}</Link>
                    })()}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/40 text-[13px] xl:hidden mt-[32px] m-0">© 2026 hamro.ai. All rights reserved.</p>
      </div>
    </footer>
  )
}

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <RealTimeInfra />
      <HowItWorks />
      <DevTools />
      <DeployOptions />
      <LandingUseCases />
      <PopularModels />
      <Testimonials />
      <LandingCaseStudies />
      <CTA />
      <Footer />
    </>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <div className="bg-black min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<ProtectedRoute><ErrorBoundary><Dashboard /></ErrorBoundary></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/use-cases" element={<UseCases />} />
        <Route path="/model-library" element={<ModelLibrary />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/products/:name" element={<ProductPage />} />
        <Route path="/legal/:page" element={<Legal />} />
        <Route path="/hosting" element={<Hosting />} />
        <Route path="/data-centers" element={<DataCenters />} />
        <Route path="/financing" element={<Financing />} />
        <Route path="/hardware" element={<Hardware />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/startup-program" element={<StartupProgram />} />
        <Route path="/press" element={<Press />} />
        <Route path="/press-kit" element={<PressKit />} />
        <Route path="/enterprise" element={<Enterprise />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/trust" element={<Trust />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/provider-setup" element={<ProviderSetup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
