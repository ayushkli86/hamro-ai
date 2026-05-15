import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import Price from '../components/Price'
import Spinner from '../components/Spinner'

const API = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'

export default function Pricing() {
  const [gpus, setGpus] = useState([])
  const [loading, setLoading] = useState(true)
  const [instanceType, setInstanceType] = useState('on-demand')
  const [calcGpu, setCalcGpu] = useState('')
  const [calcCount, setCalcCount] = useState(1)
  const [calcHours, setCalcHours] = useState(100)

  useEffect(() => {
    fetch(`${API}/gpus`).then(r => r.json()).then(d => { setGpus(d.gpus || d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const discount = instanceType === 'interruptible' ? 0.5 : instanceType === 'reserved' ? 0.2 : 0
  const selectedGpu = gpus.find(g => g._id === calcGpu) || gpus[0]
  const basePrice = selectedGpu?.price || 0.33
  const effectivePrice = instanceType === 'interruptible' ? basePrice * 0.5 : instanceType === 'reserved' ? basePrice * 0.8 : basePrice
  const estimatedCost = effectivePrice * calcCount * calcHours

  return (
    <PageLayout title="Pricing" subtitle="Simple, transparent pricing. Pay only for what you use — per-second billing, no lock-in.">
      <div className="flex flex-wrap gap-3 mb-10">
        {[
          { id: 'on-demand', label: 'On-Demand', badge: 'Most Popular', desc: 'Guaranteed uptime. Best for production.' },
          { id: 'interruptible', label: 'Interruptible', badge: '50%+ cheaper', desc: 'Best for batch training. Preemptible.' },
          { id: 'reserved', label: 'Reserved', badge: 'Up to 20% off', desc: 'Long-term commitment. Best for steady workloads.' },
        ].map((t) => (
          <button key={t.id} onClick={() => setInstanceType(t.id)}
            className={`flex-1 min-w-[200px] p-5 rounded-xl text-left transition cursor-pointer border ${
              instanceType === t.id ? 'border-[#315fff] bg-[#1a2332]' : 'border-gray-800 bg-[#161616] hover:border-gray-700'
            }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm">{t.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${t.id === 'on-demand' ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}`}>{t.badge}</span>
            </div>
            <p className="text-gray-400 text-xs">{t.desc}</p>
          </button>
        ))}
      </div>

      <div className="bg-[#161616] border border-gray-800 rounded-xl p-6 mb-10">
        <h2 className="text-lg font-bold mb-4">Pricing Calculator</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="text-xs text-gray-500 block mb-1">GPU Model</label>
            <select value={calcGpu} onChange={(e) => setCalcGpu(e.target.value)}
              className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500">
              {gpus.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Quantity</label>
            <input type="number" min="1" max="100" value={calcCount} onChange={(e) => setCalcCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Hours / month</label>
            <input type="number" min="1" value={calcHours} onChange={(e) => setCalcHours(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex items-end">
            <div className="w-full bg-[#0d1117] border border-gray-800 rounded-lg px-3 py-2.5">
              <p className="text-xs text-gray-500">Estimated monthly cost</p>
              <p className="text-xl font-bold text-green-400"><Price usd={estimatedCost} /></p>
              <p className="text-xs text-gray-600"><Price usd={effectivePrice} />/GPU/hr ({instanceType})</p>
            </div>
          </div>
        </div>
        {instanceType === 'interruptible' && <p className="text-xs text-yellow-500">Interruptible instances may be reclaimed. Best for checkpointed/fault-tolerant workloads.</p>}
        {instanceType === 'reserved' && <p className="text-xs text-blue-400">Reserved pricing applies for 1, 3, or 6 month terms. Contact sales to purchase.</p>}
      </div>

      <h2 className="text-xl font-bold mb-4">Live GPU Prices</h2>
      {loading ? (
        <div className="flex justify-center py-10"><Spinner size={30} /></div>
      ) : (
        <div className="overflow-x-auto mb-10">
          <table className="w-full text-sm">
            <thead><tr className="text-gray-400 border-b border-white/10 text-left">
              <th className="pb-3 pr-6">GPU</th><th className="pb-3 pr-6">Arch</th><th className="pb-3 pr-6">VRAM</th><th className="pb-3 pr-6">On-Demand</th><th className="pb-3 pr-6">Interruptible</th><th className="pb-3">Stock</th>
            </tr></thead>
            <tbody>
              {gpus.map((g) => (
                <tr key={g._id} className="border-b border-white/5">
                  <td className="py-3 pr-6 font-semibold">{g.name}</td>
                  <td className="py-3 pr-6 text-gray-400">{g.arch}</td>
                  <td className="py-3 pr-6 text-gray-400">{g.vram}</td>
                  <td className="py-3 pr-6"><Price usd={g.price} /></td>
                  <td className="py-3 pr-6 text-yellow-400"><Price usd={g.price * 0.5} /></td>
                  <td className="py-3">{g.inStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { title: 'Supply & Demand Pricing', desc: 'Prices are set by the market. More supply means lower prices — and you always see the real rate.' },
          { title: 'Per-Second Billing', desc: 'Pay only for what you use, down to the second. No minimum hours, no rounding up, no surprise charges.' },
          { title: 'No Lock-In', desc: 'No long-term contracts required. Scale up, scale down, or switch GPU types anytime without penalties.' },
        ].map((f) => (
          <div key={f.title} className="bg-[#161616] border border-gray-800 rounded-xl p-5">
            <h3 className="font-bold text-sm mb-2">{f.title}</h3>
            <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <Link to="/explore" className="px-6 py-3 bg-[#315fff] hover:bg-blue-500 text-white font-semibold rounded-lg no-underline transition text-sm">Browse GPUs</Link>
        <Link to="/signup" className="px-6 py-3 border border-white/20 hover:bg-white/10 text-white font-semibold rounded-lg no-underline transition text-sm">Get Started</Link>
      </div>
    </PageLayout>
  )
}
