import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import Price from '../components/Price'

export default function Pricing() {
  const plans = [
    { name: 'Pay-as-you-go', price: <Price usd={0.33} />, unit: '/hr starting', desc: 'Per-second billing. No minimums. No commitments.', features: ['20,000+ GPUs', '40+ data centers', 'Per-second billing', 'API & CLI access', 'Community support'], cta: 'Get Started', popular: false },
    { name: 'Reserved', price: '20%', unit: 'discount', desc: 'Pre-purchase compute hours at a discount for predictable workloads.', features: ['All pay-as-you-go features', '20% cost savings', 'Priority scheduling', 'Guaranteed availability', 'Priority support'], cta: 'Contact Sales', popular: true },
    { name: 'Enterprise', price: 'Custom', unit: 'pricing', desc: 'Dedicated clusters, private data centers, and tailored SLAs.', features: ['All reserved features', 'Dedicated clusters', 'InfiniBand networking', 'Private data centers', '24/7 dedicated support'], cta: 'Talk to Us', popular: false },
  ]

  return (
    <PageLayout title="Pricing" subtitle="Simple, transparent pricing. Pay only for what you use.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.name} className={`rounded-xl p-8 flex flex-col ${p.popular ? 'bg-[#1a2332] border-2 border-[#315fff]' : 'bg-[#161616] border border-gray-800'}`}>
            {p.popular && <span className="text-[#315fff] text-xs font-semibold uppercase tracking-wider mb-2">Most Popular</span>}
            <h3 className="text-xl font-bold mb-1">{p.name}</h3>
            <div className="mb-4"><span className="text-3xl font-bold">{p.price}</span> <span className="text-gray-400 text-sm">{p.unit}</span></div>
            <p className="text-gray-400 text-sm mb-6">{p.desc}</p>
            <ul className="space-y-2 mb-8 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <svg className="text-green-400 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="w-full text-center py-3 rounded-lg font-semibold text-sm no-underline transition" style={{ background: p.popular ? '#315fff' : 'rgba(255,255,255,0.1)', color: '#fff' }}>{p.cta}</Link>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
