import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { providerApi } from '../api'
import Spinner from '../components/Spinner'
import Price from '../components/Price'

export default function ProviderDashboard() {
  useEffect(() => { document.title = 'Provider Dashboard — hamro.ai' }, [])
  const { user } = useAuth()
  const toast = useToast()

  const [gpus, setGpus] = useState([])
  const [earnings, setEarnings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', gpu: '', vram: '', price: '' })

  const load = () => {
    setLoading(true)
    Promise.all([providerApi.listGpus(), providerApi.earnings()])
      .then(([gpuData, earnData]) => {
        setGpus(gpuData)
        setEarnings(earnData)
      })
      .catch((err) => toast(err.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const register = async (e) => {
    e.preventDefault()
    setRegistering(true)
    try {
      const gpu = await providerApi.registerGpu({ ...form, price: parseFloat(form.price) })
      setGpus((prev) => [gpu, ...prev])
      setShowForm(false)
      setForm({ name: '', gpu: '', vram: '', price: '' })
      toast('GPU registered', 'success')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setRegistering(false)
    }
  }

  const withdraw = async () => {
    setWithdrawing(true)
    try {
      await providerApi.withdraw()
      toast('Withdrawal initiated', 'success')
      load()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setWithdrawing(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-[1280px] mx-auto px-[32px] lg:px-[40px] 2xl:px-0 py-[120px] md:py-[140px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[32px] md:text-[40px] font-bold text-white">Provider Dashboard</h1>
            <p className="text-[#8b949e] mt-1">Manage your GPU listings and earnings</p>
          </div>
          <div className="flex items-center gap-4">
            {earnings !== null && (
              <div className="text-right">
                <p className="text-[#8b949e] text-sm">Available Balance</p>
                <p className="text-2xl font-bold text-white"><Price usd={earnings?.available || 0} /></p>
              </div>
            )}
            {earnings?.available > 0 && (
              <button onClick={withdraw} disabled={withdrawing}
                className="px-4 py-2.5 bg-[#00d0a2] hover:bg-[#00b892] text-black font-semibold rounded-lg transition disabled:opacity-50 cursor-pointer flex items-center gap-2">
                {withdrawing ? <Spinner size={18} /> : null}
                Withdraw
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Your GPUs</h2>
          <button onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-[#315fff] hover:bg-[#2a4fd8] text-white font-semibold rounded-lg transition cursor-pointer">
            {showForm ? 'Cancel' : 'Register GPU'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={register} className="bg-[#161616] border border-gray-800 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input placeholder="GPU Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                className="bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#315fff]" />
              <input placeholder="GPU Model (e.g. RTX 4090)" value={form.gpu} onChange={(e) => setForm({ ...form, gpu: e.target.value })} required
                className="bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#315fff]" />
              <input placeholder="VRAM (e.g. 24GB)" value={form.vram} onChange={(e) => setForm({ ...form, vram: e.target.value })} required
                className="bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#315fff]" />
              <input placeholder="Price per hour ($)" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required
                className="bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#315fff]" />
            </div>
            <button type="submit" disabled={registering}
              className="px-6 py-2.5 bg-[#315fff] hover:bg-[#2a4fd8] text-white font-semibold rounded-lg transition disabled:opacity-50 cursor-pointer flex items-center gap-2">
              {registering ? <Spinner size={18} /> : null}
              Register
            </button>
          </form>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#161616] border border-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-5 bg-gray-700 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-700 rounded w-1/3 mb-4" />
                <div className="h-8 bg-gray-700 rounded w-full" />
              </div>
            ))}
          </div>
        ) : gpus.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-700 rounded-xl">
            <svg className="mx-auto mb-4 text-gray-600" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <p className="text-[#8b949e] text-lg mb-2">No GPUs registered yet</p>
            <p className="text-[#6b7280] text-sm mb-4">Register your first GPU to start earning.</p>
            <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-[#315fff] hover:bg-[#2a4fd8] text-white font-semibold rounded-lg transition cursor-pointer">Register GPU</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gpus.map((gpu) => (
              <div key={gpu._id} className="bg-[#161616] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
                <h3 className="text-lg font-bold text-white mb-1">{gpu.name || gpu.gpu}</h3>
                <p className="text-[#8b949e] text-sm mb-2">{gpu.gpu} — {gpu.vram}</p>
                <div className="flex items-baseline gap-1 mb-4">
                  <Price usd={gpu.price} className="text-2xl font-bold text-white" />
                  <span className="text-[#6b7280] text-sm">/hr</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${gpu.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                    {gpu.status || 'active'}
                  </span>
                  <span className="text-[#6b7280]">{gpu.orders || 0} rentals</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {earnings !== null && earnings.history?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-white mb-4">Earnings History</h2>
            <div className="bg-[#161616] border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-800 text-[#8b949e] text-sm">
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">GPU</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.history.map((h, i) => (
                    <tr key={i} className="border-b border-gray-800/50 text-white text-sm">
                      <td className="px-6 py-3 text-[#8b949e]">{new Date(h.date).toLocaleDateString()}</td>
                      <td className="px-6 py-3">{h.gpu}</td>
                      <td className="px-6 py-3"><Price usd={h.amount} /></td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${h.status === 'paid' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                          {h.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
