import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const FEATURES = [
  { title: 'Customers & Support', desc: '120K+ developers actively searching for compute. We handle 24/7 support, billing, and discovery so you never talk to a customer unless you want to.' },
  { title: 'Your Terms, Your Control', desc: 'Set your own prices. Choose on-demand, interruptible, or reserved. Configure GPU, CPU, storage, and bandwidth billing.' },
  { title: 'Hardware & Financing', desc: 'Source GPUs through our vetted suppliers. Finance them with partners who use your hamro.ai earnings as qualification.' },
]

const STEPS = [
  { num: '1', title: 'List Your Hardware', desc: 'Install our lightweight client. Your machines appear on the platform in minutes.' },
  { num: '2', title: 'Set Your Terms', desc: 'Price your GPUs, choose rental types, and configure billing.' },
  { num: '3', title: 'We Bring the Customers', desc: '120K+ developers discover your GPUs. Revenue flows automatically. We handle support 24/7.' },
]

export default function Hosting() {
  return (
    <PageLayout title="Host Your GPUs on hamro.ai" subtitle="List your hardware on Nepal's GPU cloud. We handle customers, support, billing — you control pricing and earn.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {['120K+ Active Developers', '20K+ GPUs on Platform', '24/7 Customer Support'].map((s) => (
          <div key={s} className="bg-[#161616] border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-2xl font-bold text-[#315fff]">{s.split(' ')[0]}</p>
            <p className="text-gray-400 text-sm mt-1">{s}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-6">What We Handle vs. What You Handle</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-[#161616] border border-green-800 rounded-xl p-6">
          <h3 className="text-green-400 font-bold mb-4">hamro.ai Handles</h3>
          <ul className="space-y-3">
            {['Customer acquisition & platform exposure', '24/7 customer support', 'Billing, invoicing, payments', 'Job scheduling & resource optimization', 'Marketing & demand generation', 'Compliance (SOC 2 Type I)'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                <svg className="text-green-400 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>{item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#161616] border border-gray-800 rounded-xl p-6">
          <h3 className="text-yellow-400 font-bold mb-4">You Handle</h3>
          <ul className="space-y-3">
            {['Hardware uptime & maintenance', 'Network connectivity', 'Physical infrastructure', 'Initial hardware setup'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                <svg className="text-yellow-400 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>{item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {STEPS.map((s) => (
          <div key={s.num} className="bg-[#161616] border border-gray-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#315fff]/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-[#315fff] font-bold text-xl">{s.num}</span>
            </div>
            <h3 className="font-bold mb-2">{s.title}</h3>
            <p className="text-gray-400 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#161616] border border-gray-800 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Earning?</h2>
        <p className="text-gray-400 mb-6">Join hundreds of hosts already earning revenue on hamro.ai.</p>
        <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#315fff] hover:bg-blue-500 text-white font-semibold rounded-lg no-underline transition">Start Hosting</Link>
      </div>
    </PageLayout>
  )
}
