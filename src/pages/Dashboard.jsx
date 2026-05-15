import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useSocket } from '../context/SocketContext'
import { apiKeyApi, gpuApi, orderApi, authApi } from '../api'
import Spinner from '../components/Spinner'
import Price from '../components/Price'
import SkeletonCard from '../components/SkeletonCard'
import ThemeToggle from '../components/ThemeToggle'
import CurrencyToggle from '../components/CurrencyToggle'
import ConfirmDialog from '../components/ConfirmDialog'
import PaymentModal from '../components/PaymentModal'

const API = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'

export default function Dashboard() {
  useEffect(() => { document.title = 'Dashboard — hamro.ai' }, [])
  const { user, logout, refreshUser } = useAuth()
  const toast = useToast()
  const [gpus, setGpus] = useState([])
  const [orders, setOrders] = useState([])
  const [hours, setHours] = useState({})
  const [loading, setLoading] = useState(true)
  const [renting, setRenting] = useState(null)
  const [search, setSearch] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')
  const [topupAmount, setTopupAmount] = useState(10)
  const [showPayment, setShowPayment] = useState(false)
  const [orderSearch, setOrderSearch] = useState('')
  const [orderStatus, setOrderStatus] = useState('')
  const [orderSort, setOrderSort] = useState('newest')
  const [section, setSection] = useState('orders')
  const [apiKeys, setApiKeys] = useState([])
  const [keyName, setKeyName] = useState('')
  const [newKey, setNewKey] = useState('')
  const [sshKeys, setSshKeys] = useState([])
  const [sshName, setSshName] = useState('')
  const [sshPublicKey, setSshPublicKey] = useState('')
  const [confirm, setConfirm] = useState(null)
  const [pwCurrent, setPwCurrent] = useState('')
  const [pwNew, setPwNew] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const loadOrders = () => {
    const params = {}
    if (orderSearch) params.search = orderSearch
    if (orderStatus) params.status = orderStatus
    if (orderSort !== 'newest') params.sort = orderSort
    orderApi.list(params).then(setOrders).catch((err) => toast(err.message, 'error'))
  }

  useEffect(() => {
    Promise.all([gpuApi.list(), orderApi.list()])
      .then(([gpuData, orderData]) => {
        setGpus(gpuData)
        setOrders(orderData)
      })
      .catch((err) => toast(err.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading) return
    const timer = setTimeout(loadOrders, orderSearch ? 300 : 0)
    return () => clearTimeout(timer)
  }, [orderSearch, orderStatus, orderSort])

  useEffect(() => {
    apiKeyApi.list().then(setApiKeys).catch(() => {})
    fetch(`${API}/sshkeys`, { headers: { Authorization: `Bearer ${user?.token}` } }).then(r => r.json()).then(setSshKeys).catch(() => {})
  }, [])

  const rent = async (gpuId) => {
    const h = hours[gpuId] || 1
    const gpu = gpus.find((g) => g._id === gpuId)
    const cost = (gpu?.price || 0) * h
    if ((user?.balance || 0) < cost) {
      setConfirm({ action: 'low-balance', id: gpuId, name: gpu?.name || '', cost })
      return
    }
    setRenting(gpuId)
    try {
      const order = await orderApi.create({ gpuId, hours: h })
      setOrders((prev) => [order, ...prev])
      setHours((prev) => ({ ...prev, [gpuId]: 1 }))
      toast(`Rented GPU for ${h} hours`, 'success')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setRenting(null)
    }
  }

  const cancel = async (id) => {
    try {
      await orderApi.cancel(id)
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status: 'cancelled' } : o))
      toast('Order cancelled', 'warning')
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const onPaymentSuccess = () => { refreshUser() }

  const filtered = gpus.filter((gpu) => {
    const matchSearch = !search || gpu.name.toLowerCase().includes(search.toLowerCase()) || gpu.arch?.toLowerCase().includes(search.toLowerCase())
    const matchPrice = priceFilter === 'all' ||
      (priceFilter === 'low' && gpu.price < 0.5) ||
      (priceFilter === 'med' && gpu.price >= 0.5 && gpu.price < 2) ||
      (priceFilter === 'high' && gpu.price >= 2)
    return matchSearch && matchPrice
  })

  const { priceAlerts } = useSocket()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {priceAlerts.length > 0 && (
        <div className="overflow-hidden border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
          <div className="flex gap-6 py-1.5 px-4 md:px-8 text-xs animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
            {priceAlerts.map((a, i) => (
              <span key={i} className={a.direction === 'up' ? 'text-green-400' : 'text-red-400'}>
                {a.name} {a.direction === 'up' ? '▲' : '▼'} ${a.change.toFixed(3)}
              </span>
            ))}
          </div>
        </div>
      )}
      <header className="border-b px-4 md:px-8 py-3 md:py-4 flex flex-wrap items-center gap-2 justify-between" style={{ borderColor: 'var(--border)' }}>
        <h1 className="text-lg md:text-xl font-bold">hamro.ai</h1>
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-green-400 text-sm md:text-base"><Price usd={user?.balance || 0} /></span>
          <span className="text-gray-400 text-sm hidden sm:inline">{user?.name}</span>
          <CurrencyToggle />
          <ThemeToggle />
          {user?.isAdmin && <Link to="/admin" className="text-yellow-400 text-sm hover:underline">Admin</Link>}
          <button onClick={logout} className="text-sm text-gray-400 hover:text-white cursor-pointer bg-transparent border-none">Logout</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8">

        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-3 flex-1">
            <input type="text" placeholder="Search GPUs..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm w-full md:w-64 focus:outline-none focus:border-blue-500" />
            <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}
              className="bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500">
              <option value="all">All Prices</option>
              <option value="low">Under $0.50/hr</option>
              <option value="med">$0.50 – $2.00/hr</option>
              <option value="high">$2.00+ /hr</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="number" min="1" value={topupAmount} onChange={(e) => setTopupAmount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 bg-[#0d1117] border border-white/10 rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
            <button onClick={() => setShowPayment(true)}
              className="bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition cursor-pointer">
              Add Funds
            </button>
          </div>
        </div>

        <h2 className="text-xl md:text-2xl font-bold mb-4">Available GPUs in Nepal</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto mb-3 text-gray-600" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <p className="text-gray-500 text-sm">No GPUs match your filters.</p>
            <p className="text-gray-600 text-xs mt-1">Try changing your search or price range.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
            {filtered.map((gpu) => (
              <div key={gpu._id} className="bg-[#161616] border border-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">{gpu.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${gpu.availability === 'High' ? 'bg-green-900 text-green-400' : gpu.availability === 'Med' ? 'bg-yellow-900 text-yellow-400' : 'bg-red-900 text-red-400'}`}>
                    {gpu.inStock} left
                  </span>
                </div>
                <div className="flex gap-2 mt-1 mb-4">
                  <span className="bg-[#222] text-xs text-gray-400 px-2 py-0.5 rounded">{gpu.arch}</span>
                  <span className="text-xs text-gray-500 uppercase">{gpu.vram}</span>
                </div>
                <p className="text-2xl font-bold"><Price usd={gpu.price} /><span className="text-gray-500 text-sm font-normal">/hr</span></p>
                <p className="text-xs text-gray-500 mt-1"><Price usd={gpu.rangeLow} /> — <Price usd={gpu.rangeHigh} />/hr range</p>
                <div className="flex items-center gap-2 mt-5 mb-4">
                  <input type="number" min="1" value={hours[gpu._id] || 1}
                    onChange={(e) => setHours((prev) => ({ ...prev, [gpu._id]: Math.max(1, parseInt(e.target.value) || 1) }))}
                    className="w-20 bg-[#0d1117] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none" />
                  <span className="text-sm text-gray-400">hours</span>
                </div>
                <button onClick={() => rent(gpu._id)} disabled={renting === gpu._id}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-2">
                  {renting === gpu._id ? <Spinner size={18} /> : null}
                  {renting === gpu._id ? 'Renting...' : <>Rent — <Price usd={gpu.price * (hours[gpu._id] || 1)} /></>}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4 mb-6 border-b border-white/10">
          {['orders', 'apikeys', 'sshkeys', 'settings'].map((s) => (
            <button key={s} onClick={() => setSection(s)}
              className={`pb-3 text-sm font-medium border-b-2 transition cursor-pointer bg-transparent ${section === s ? 'border-blue-500 text-white' : 'border-transparent text-gray-500 hover:text-white'}`}>
              {s === 'orders' ? `Orders (${orders.length})` : s === 'settings' ? 'Settings' : 'API Keys'}
            </button>
          ))}
        </div>

        {section === 'orders' ? (
          <>
            <div className="flex flex-col md:flex-row gap-3 mb-4 items-start md:items-center">
              <h2 className="text-xl md:text-2xl font-bold flex-1">My Orders</h2>
              <div className="flex gap-2 w-full md:w-auto">
                <input type="text" placeholder="Search GPU..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)}
                  className="bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-white text-sm w-full md:w-44 focus:outline-none focus:border-blue-500" />
                <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}
                  className="bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select value={orderSort} onChange={(e) => setOrderSort(e.target.value)}
                  className="bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center py-10"><Spinner size={30} /></div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto mb-4 text-gray-600" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                <p className="text-gray-500 text-sm">No orders yet.</p>
                <p className="text-gray-600 text-xs mt-1">Rent a GPU above to get started. Your instances will appear here.</p>
                <Link to="/explore" className="inline-block mt-4 text-sm text-[#315fff] hover:underline">Browse Available GPUs →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order._id} className="bg-[#161616] border border-gray-800 rounded-lg overflow-hidden">
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">{order.gpuName}</p>
                        <p className="text-sm text-gray-400">{order.hours} hrs — <Price usd={order.cost} /> — {order.region}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                        <span className={`text-xs px-2 py-1 rounded ${order.status === 'active' ? 'bg-green-900 text-green-400' : order.status === 'cancelled' ? 'bg-red-900 text-red-400' : 'bg-gray-800 text-gray-400'}`}>{order.status}</span>
                        {order.instanceStatus && (
                          <span className={`text-xs px-2 py-1 rounded ${order.instanceStatus === 'running' ? 'bg-green-900 text-green-400' : order.instanceStatus === 'provisioning' ? 'bg-blue-900 text-blue-400' : order.instanceStatus === 'stopped' ? 'bg-yellow-900 text-yellow-400' : 'bg-gray-800 text-gray-400'}`}>{order.instanceStatus}</span>
                        )}
                        {order.status === 'active' && order.instanceStatus === 'running' && (
                          <button onClick={async () => {
                            try { const o = await orderApi.instanceAction(order._id, 'stop'); setOrders((prev) => prev.map((x) => x._id === o._id ? o : x)); toast('Instance stopping', 'warning') }
                            catch (err) { toast(err.message, 'error') }
                          }} className="text-xs text-yellow-400 hover:text-yellow-300 cursor-pointer bg-transparent border-none">Stop</button>
                        )}
                        {order.status === 'active' && order.instanceStatus === 'stopped' && (
                          <button onClick={async () => {
                            try { const o = await orderApi.instanceAction(order._id, 'start'); setOrders((prev) => prev.map((x) => x._id === o._id ? o : x)); toast('Instance starting', 'success') }
                            catch (err) { toast(err.message, 'error') }
                          }} className="text-xs text-green-400 hover:text-green-300 cursor-pointer bg-transparent border-none">Start</button>
                        )}
                        {order.status === 'active' && (
                          <button onClick={() => setConfirm({ action: 'cancel', id: order._id, name: order.gpuName })} className="text-xs text-red-400 hover:text-red-300 cursor-pointer bg-transparent border-none">Cancel</button>
                        )}
                        <a href={`${API}/orders/${order._id}/invoice?token=${user?.token || ''}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 no-underline">Receipt</a>
                      </div>
                    </div>
                    {order.status === 'active' && order.instanceStatus === 'running' && order.sshHost && (
                      <div className="border-t border-gray-800 px-4 py-3 bg-[#0d1117]">
                        <p className="text-xs text-gray-400 mb-2 font-semibold">Connect to Instance</p>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 w-16">SSH:</span>
                            <code className="text-green-400 font-mono text-xs">ssh {order.sshUser}@{order.sshHost} -p {order.sshPort}</code>
                            <button onClick={() => { navigator.clipboard?.writeText(`ssh ${order.sshUser}@${order.sshHost} -p ${order.sshPort}`); toast('Copied!', 'success') }} className="text-blue-400 hover:text-blue-300 bg-transparent border-none cursor-pointer text-xs">Copy</button>
                          </div>
                          {order.jupyterUrl && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 w-16">Jupyter:</span>
                              <a href={order.jupyterUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-mono text-xs">{order.jupyterUrl}</a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
          ) : section === 'apikeys' ? (
          <div>
            <div className="bg-[#161616] border border-gray-800 rounded-xl p-6 mb-6">
              <h3 className="font-bold mb-4">Create API Key</h3>
              <div className="flex gap-3">
                <input type="text" placeholder="Key name (e.g. CLI, Python SDK)" value={keyName} onChange={(e) => setKeyName(e.target.value)}
                  className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
                <button onClick={async () => {
                  if (!keyName) return toast('Enter a key name', 'error')
                  try { const k = await apiKeyApi.create(keyName); setApiKeys((prev) => [k, ...prev]); setNewKey(k.key); setKeyName(''); toast('API key created', 'success') }
                  catch (err) { toast(err.message, 'error') }
                }} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg transition cursor-pointer text-sm">Create Key</button>
              </div>
            </div>
            {newKey && (
              <div className="bg-[#1a2332] border border-[#315fff] rounded-xl p-4 mb-6">
                <p className="text-xs text-[#315fff] font-semibold mb-1">New Key Created — Copy it now</p>
                <code className="text-sm text-white break-all">{newKey}</code>
                <button onClick={() => { navigator.clipboard?.writeText(newKey); toast('Copied!', 'success') }} className="ml-2 text-xs text-blue-400 hover:underline cursor-pointer bg-transparent border-none">Copy</button>
                <button onClick={() => setNewKey('')} className="ml-2 text-xs text-gray-500 hover:text-white cursor-pointer bg-transparent border-none">Dismiss</button>
              </div>
            )}
            <div className="space-y-2">
              {apiKeys.map((k) => (
                <div key={k._id} className="bg-[#161616] border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{k.name}</p>
                    <p className="text-xs text-gray-500">Created {new Date(k.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => setConfirm({ action: 'revoke', id: k._id, name: k.name })} className="text-sm text-red-400 hover:text-red-300 cursor-pointer bg-transparent border-none">Revoke</button>
                </div>
              ))}
              {apiKeys.length === 0 && <p className="text-gray-500 text-sm text-center py-6">No API keys yet.</p>}
            </div>
          </div>
          ) : section === 'sshkeys' ? (
          <div>
            <div className="bg-[#161616] border border-gray-800 rounded-xl p-6 mb-6">
              <h3 className="font-bold mb-4">Add SSH Key</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Key name (e.g. My Laptop)" value={sshName} onChange={(e) => setSshName(e.target.value)}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
                <textarea placeholder="Paste your public SSH key (starts with ssh-rsa, ssh-ed25519, etc.)" value={sshPublicKey} onChange={(e) => setSshPublicKey(e.target.value)} rows={3}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-blue-500" />
                <button onClick={async () => {
                  if (!sshName || !sshPublicKey) return toast('Fill in all fields', 'error')
                  try { const k = await fetch(`${API}/sshkeys`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` }, body: JSON.stringify({ name: sshName, publicKey: sshPublicKey }) }).then(r => r.json()); setSshKeys((prev) => [k, ...prev]); setSshName(''); setSshPublicKey(''); toast('SSH key added', 'success') }
                  catch (err) { toast(err.message, 'error') }
                }} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg transition cursor-pointer text-sm">Add Key</button>
              </div>
            </div>
            <div className="space-y-2">
              {sshKeys.map((k) => (
                <div key={k._id} className="bg-[#161616] border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{k.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{k.fingerprint || k.publicKey?.slice(0, 40)}...</p>
                  </div>
                  <button onClick={async () => {
                    try { await fetch(`${API}/sshkeys/${k._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${user?.token}` } }); setSshKeys((prev) => prev.filter((x) => x._id !== k._id)); toast('SSH key removed', 'warning') }
                    catch (err) { toast(err.message, 'error') }
                  }} className="text-sm text-red-400 hover:text-red-300 cursor-pointer bg-transparent border-none">Remove</button>
                </div>
              ))}
              {sshKeys.length === 0 && <p className="text-gray-500 text-sm text-center py-6">No SSH keys yet. Add one above.</p>}
            </div>
          </div>
          ) : (
          <div className="max-w-md">
            <h3 className="font-bold mb-4">Change Password</h3>
            <div className="space-y-3">
              <input type="password" placeholder="Current password" value={pwCurrent} onChange={(e) => setPwCurrent(e.target.value)}
                className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
              <input type="password" placeholder="New password (min 6 chars)" value={pwNew} onChange={(e) => setPwNew(e.target.value)}
                className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
              <button onClick={async () => {
                if (!pwCurrent || !pwNew) return toast('Fill in both fields', 'error')
                if (pwNew.length < 6) return toast('Password must be at least 6 characters', 'error')
                setPwLoading(true)
                try { const data = await authApi.changePassword(pwCurrent, pwNew); toast(data.message, 'success'); setPwCurrent(''); setPwNew('') }
                catch (err) { toast(err.message, 'error') }
                finally { setPwLoading(false) }
              }} disabled={pwLoading}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg transition cursor-pointer text-sm">
                {pwLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
            <div className="mt-8 p-4 bg-[#161616] border border-gray-800 rounded-lg">
              <p className="text-xs text-gray-500">Account: {user?.email}</p>
              <p className="text-xs text-gray-500 mt-1">Member since {new Date(user?._id?.toString().substring(0, 8) ? parseInt(user._id.toString().substring(0, 8), 16) * 1000 : Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </main>
      {confirm && (
        <ConfirmDialog
          title={confirm.action === 'cancel' ? 'Cancel Order' : confirm.action === 'low-balance' ? 'Insufficient Balance' : 'Revoke Key'}
          message={confirm.action === 'cancel' ? `Are you sure you want to cancel the ${confirm.name} order? This will stop your instance.` : confirm.action === 'low-balance' ? `You need <Price usd={confirm.cost} /> to rent ${confirm.name} but your balance is <Price usd={user?.balance || 0} />. Add funds first?` : `Revoke API key "${confirm.name}"? This action cannot be undone.`}
          confirmLabel={confirm.action === 'cancel' ? 'Cancel Order' : confirm.action === 'low-balance' ? 'Add Funds' : 'Revoke'}
          onConfirm={async () => {
            if (confirm.action === 'cancel') { await cancel(confirm.id) }
            else if (confirm.action === 'low-balance') { setShowPayment(true); setConfirm(null); return }
            else { try { await apiKeyApi.revoke(confirm.id); setApiKeys((prev) => prev.filter((x) => x._id !== confirm.id)); toast('Key revoked', 'warning') } catch (err) { toast(err.message, 'error') } }
            setConfirm(null)
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
      {showPayment && (
        <PaymentModal amount={topupAmount} onClose={() => setShowPayment(false)} onSuccess={onPaymentSuccess} />
      )}
    </div>
  )
}
