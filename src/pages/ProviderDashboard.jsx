import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Spinner from '../components/Spinner'
import Price from '../components/Price'

const API = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'

function authHeaders() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {}
}

async function api(url, options = {}) {
  const res = await fetch(`${API}${url}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...options.headers },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export default function ProviderDashboard() {
  useEffect(() => { document.title = 'Provider Dashboard — hamro.ai' }, [])
  const { user } = useAuth()
  const toast = useToast()

  const [gpus, setGpus] = useState([])
  const [earnings, setEarnings] = useState([])
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(null)
  const [withdrawing, setWithdrawing] = useState(false)
  const [withdrawError, setWithdrawError] = useState('')

  const [gpuName, setGpuName] = useState('')
  const [gpuMemory, setGpuMemory] = useState('')
  const [pricePerHour, setPricePerHour] = useState('')
  const [region, setRegion] = useState('')
  const [registering, setRegistering] = useState(false)

  const loadData = () => {
    setLoading(true)
    Promise.all([
      api('/provider/gpus'),
      api('/provider/earnings'),
    ])
      .then(([gpuData, earningsData]) => {
        setGpus(gpuData.gpus || gpuData || [])
        setEarnings(earningsData.earnings || earningsData || [])
        setBalance(earningsData.balance ?? 0)
      })
      .catch((err) => toast(err.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const registerGpu = async (e) => {
    e.preventDefault()
    if (!gpuName || !gpuMemory || !pricePerHour || !region) {
      return toast('Fill in all fields', 'error')
    }
    setRegistering(true)
    try {
      const gpu = await api('/provider/gpus', {
        method: 'POST',
        body: JSON.stringify({ gpuName, gpuMemory, pricePerHour: parseFloat(pricePerHour), region }),
      })
      setGpus((prev) => [gpu, ...prev])
      setGpuName('')
      setGpuMemory('')
      setPricePerHour('')
      setRegion('')
      toast('GPU registered successfully', 'success')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setRegistering(false)
    }
  }

  const toggleAvailable = async (id, current) => {
    setToggling(id)
    try {
      const updated = await api(`/provider/gpus/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isAvailable: !current }),
      })
      setGpus((prev) => prev.map((g) => (g._id === id ? { ...g, isAvailable: !current } : g)))
      toast(`GPU ${!current ? 'available' : 'unavailable'}`, 'success')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setToggling(null)
    }
  }

  const withdraw = async () => {
    setWithdrawError('')
    setWithdrawing(true)
    try {
      const result = await api('/provider/withdraw', { method: 'POST' })
      toast(result.message || 'Withdrawal successful', 'success')
      loadData()
    } catch (err) {
      setWithdrawError(err.message)
      toast(err.message, 'error')
    } finally {
      setWithdrawing(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <header className="border-b px-4 md:px-8 py-3 md:py-4 flex flex-wrap items-center gap-2 justify-between" style={{ borderColor: 'var(--border)' }}>
        <h1 className="text-lg md:text-xl font-bold">Provider Dashboard</h1>
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-green-400 text-sm md:text-base">Balance: <Price usd={balance} /></span>
          <span className="text-gray-400 text-sm hidden sm:inline">{user?.name}</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8">

        <section className="bg-[#161616] border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Register GPU</h2>
          <form onSubmit={registerGpu} className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input type="text" placeholder="GPU Name" value={gpuName} onChange={(e) => setGpuName(e.target.value)}
              className="bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
            <input type="text" placeholder="VRAM (e.g. 24GB)" value={gpuMemory} onChange={(e) => setGpuMemory(e.target.value)}
              className="bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
            <input type="number" step="0.01" min="0" placeholder="Price/hr ($)" value={pricePerHour} onChange={(e) => setPricePerHour(e.target.value)}
              className="bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
            <input type="text" placeholder="Region (e.g. us-east-1)" value={region} onChange={(e) => setRegion(e.target.value)}
              className="bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
            <button type="submit" disabled={registering}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-2 text-sm">
              {registering ? <Spinner size={18} /> : null}
              {registering ? 'Registering...' : 'Register GPU'}
            </button>
          </form>
        </section>

        <section className="bg-[#161616] border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold">Earnings</h2>
              <p className="text-2xl font-bold text-green-400 mt-1"><Price usd={balance} /></p>
            </div>
            <button onClick={withdraw} disabled={withdrawing}
              className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg transition cursor-pointer flex items-center gap-2 text-sm">
              {withdrawing ? <Spinner size={18} /> : null}
              {withdrawing ? 'Processing...' : 'Withdraw'}
            </button>
          </div>
          {withdrawError && (
            <div className="bg-red-900/30 border border-red-800 rounded-lg px-4 py-2 mb-4">
              <p className="text-red-400 text-xs">{withdrawError}</p>
            </div>
          )}
          {earnings.length > 0 && (
            <div className="space-y-2 mt-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">History</h3>
              {earnings.map((e, i) => (
                <div key={i} className="bg-[#0d1117] border border-gray-800 rounded-lg px-4 py-3 flex items-center justify-between text-sm">
                  <span className="text-gray-400">{new Date(e.date || e.createdAt).toLocaleDateString()}</span>
                  <span className={e.amount >= 0 ? 'text-green-400' : 'text-red-400'}><Price usd={e.amount} /></span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-[#161616] border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Your GPU Listings ({gpus.length})</h2>
          {loading ? (
            <div className="flex justify-center py-10"><Spinner size={30} /></div>
          ) : gpus.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto mb-3 text-gray-600" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/></svg>
              <p className="text-gray-500 text-sm">No GPUs registered yet.</p>
              <p className="text-gray-600 text-xs mt-1">Use the form above to register your first GPU.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                    <th className="text-left py-3 px-2">GPU Name</th>
                    <th className="text-left py-3 px-2">VRAM</th>
                    <th className="text-left py-3 px-2">Price/hr</th>
                    <th className="text-left py-3 px-2">Region</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-center py-3 px-2">Available</th>
                  </tr>
                </thead>
                <tbody>
                  {gpus.map((gpu) => (
                    <tr key={gpu._id} className="border-b border-gray-800 hover:bg-[#1a1a1a]">
                      <td className="py-3 px-2 font-medium">{gpu.gpuName || gpu.name}</td>
                      <td className="py-3 px-2 text-gray-400">{gpu.gpuMemory || gpu.vram || '-'}</td>
                      <td className="py-3 px-2"><Price usd={gpu.pricePerHour ?? gpu.price ?? 0} /></td>
                      <td className="py-3 px-2 text-gray-400">{gpu.region || '-'}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${gpu.status === 'active' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                          {gpu.status || 'active'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <button
                          onClick={() => toggleAvailable(gpu._id, gpu.isAvailable)}
                          disabled={toggling === gpu._id}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition cursor-pointer border-none ${
                            gpu.isAvailable ? 'bg-green-600' : 'bg-gray-600'
                          } disabled:opacity-50`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                            gpu.isAvailable ? 'translate-x-[18px]' : 'translate-x-[2px]'
                          }`} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>
    </div>
  )
}
