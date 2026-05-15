import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { adminApi } from '../api'
import Spinner from '../components/Spinner'
import Price from '../components/Price'

export default function Admin() {
  useEffect(() => { document.title = 'Admin — hamro.ai' }, [])
  const { user, logout } = useAuth()
  const toast = useToast()
  const [tab, setTab] = useState('overview')
  const [gpus, setGpus] = useState([])
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [editGpu, setEditGpu] = useState(null)
  const [form, setForm] = useState({ name: '', arch: '', vram: '', price: '', rangeLow: '', rangeHigh: '', availability: 'Med', inStock: 10 })

  const load = async () => {
    setLoading(true)
    try {
      const [g, u, o] = await Promise.all([adminApi.gpus(), adminApi.users(), adminApi.orders()])
      setGpus(g); setUsers(u); setOrders(o)
    } catch (err) { toast(err.message, 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const resetForm = () => setForm({ name: '', arch: '', vram: '', price: '', rangeLow: '', rangeHigh: '', availability: 'Med', inStock: 10 })

  const openEdit = (gpu) => {
    setEditGpu(gpu._id)
    setForm({ name: gpu.name, arch: gpu.arch || '', vram: gpu.vram || '', price: gpu.price.toString(), rangeLow: gpu.rangeLow?.toString() || '', rangeHigh: gpu.rangeHigh?.toString() || '', availability: gpu.availability, inStock: gpu.inStock })
  }

  const save = async () => {
    if (!form.name || !form.price) return toast('Name and price required', 'error')
    const body = { ...form, price: parseFloat(form.price), rangeLow: form.rangeLow ? parseFloat(form.rangeLow) : undefined, rangeHigh: form.rangeHigh ? parseFloat(form.rangeHigh) : undefined, inStock: parseInt(form.inStock) || 0 }
    try {
      if (editGpu) {
        await adminApi.updateGpu(editGpu, body)
        toast('GPU updated', 'success')
      } else {
        await adminApi.createGpu(body)
        toast('GPU created', 'success')
      }
      setEditGpu(null); resetForm(); load()
    } catch (err) { toast(err.message, 'error') }
  }

  const deleteGpu = async (id, name) => {
    if (!confirm(`Delete ${name}?`)) return
    try { await adminApi.deleteGpu(id); toast('GPU deleted', 'warning'); load() }
    catch (err) { toast(err.message, 'error') }
  }

  const seedData = async () => {
    try { const d = await adminApi.seed(); toast(d.message, 'success'); load() }
    catch (err) { toast(err.message, 'error') }
  }

  if (user && !user.isAdmin) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center"><p className="text-red-400">Admin access only.</p></div>
  }

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'gpus', label: `GPUs (${gpus.length})` },
    { key: 'users', label: `Users (${users.length})` },
    { key: 'orders', label: `Orders (${orders.length})` },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-bold">hamro.ai Admin</h1>
        <div className="flex items-center gap-3">
          <span className="text-yellow-400 text-sm">Admin</span>
          <span className="text-gray-400 text-sm hidden sm:inline">{user?.name}</span>
          <button onClick={logout} className="text-sm text-gray-400 hover:text-white cursor-pointer bg-transparent border-none">Logout</button>
        </div>
      </header>

      <div className="border-b border-white/10 px-4 md:px-8 flex gap-6 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`py-3 text-sm font-medium border-b-2 transition cursor-pointer bg-transparent ${tab === t.key ? 'border-blue-500 text-white' : 'border-transparent text-gray-500 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {loading ? (
          <div className="flex justify-center py-20"><Spinner size={40} /></div>
        ) : tab === 'overview' ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#161616] border border-gray-800 rounded-xl p-6"><p className="text-gray-400 text-sm">Users</p><p className="text-3xl font-bold mt-1">{users.length}</p></div>
              <div className="bg-[#161616] border border-gray-800 rounded-xl p-6"><p className="text-gray-400 text-sm">GPUs</p><p className="text-3xl font-bold mt-1">{gpus.length}</p></div>
              <div className="bg-[#161616] border border-gray-800 rounded-xl p-6"><p className="text-gray-400 text-sm">Orders</p><p className="text-3xl font-bold mt-1">{orders.length}</p></div>
            </div>
            <button onClick={seedData} className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer">
              Re-seed Database
            </button>
          </div>
        ) : tab === 'gpus' ? (
          <div>
            <div className="bg-[#161616] border border-gray-800 rounded-xl p-6 mb-6">
              <h3 className="font-bold mb-4">{editGpu ? 'Edit GPU' : 'Add GPU'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-[#0d1117] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                <input placeholder="Architecture" value={form.arch} onChange={(e) => setForm({ ...form, arch: e.target.value })}
                  className="bg-[#0d1117] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                <input placeholder="VRAM (e.g. 24GB VRAM)" value={form.vram} onChange={(e) => setForm({ ...form, vram: e.target.value })}
                  className="bg-[#0d1117] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                <input placeholder="Price/hr" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="bg-[#0d1117] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                <input placeholder="Range Low" type="number" step="0.01" value={form.rangeLow} onChange={(e) => setForm({ ...form, rangeLow: e.target.value })}
                  className="bg-[#0d1117] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                <input placeholder="Range High" type="number" step="0.01" value={form.rangeHigh} onChange={(e) => setForm({ ...form, rangeHigh: e.target.value })}
                  className="bg-[#0d1117] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                <select value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })}
                  className="bg-[#0d1117] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                  <option value="Low">Low</option><option value="Med">Med</option><option value="High">High</option>
                </select>
                <input placeholder="In Stock" type="number" value={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.value })}
                  className="bg-[#0d1117] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div className="flex gap-3">
                <button onClick={save} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2 rounded-lg transition cursor-pointer">
                  {editGpu ? 'Update' : 'Create'}
                </button>
                {editGpu && <button onClick={() => { setEditGpu(null); resetForm() }} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2 rounded-lg transition cursor-pointer">Cancel</button>}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-gray-400 border-b border-white/10 text-left">
                  <th className="pb-3 pr-4">Name</th><th className="pb-3 pr-4">Arch</th><th className="pb-3 pr-4">VRAM</th><th className="pb-3 pr-4">Price</th><th className="pb-3 pr-4">Stock</th><th className="pb-3">Actions</th>
                </tr></thead>
                <tbody>
                  {gpus.map((g) => (
                    <tr key={g._id} className="border-b border-white/5">
                      <td className="py-3 pr-4">{g.name}</td>
                      <td className="py-3 pr-4 text-gray-400">{g.arch}</td>
                      <td className="py-3 pr-4 text-gray-400">{g.vram}</td>
                      <td className="py-3 pr-4"><Price usd={g.price} /></td>
                      <td className="py-3 pr-4">{g.inStock}</td>
                      <td className="py-3 flex gap-2">
                        <button onClick={() => openEdit(g)} className="text-blue-400 hover:text-blue-300 cursor-pointer bg-transparent border-none text-sm">Edit</button>
                        <button onClick={() => deleteGpu(g._id, g.name)} className="text-red-400 hover:text-red-300 cursor-pointer bg-transparent border-none text-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : tab === 'users' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-gray-400 border-b border-white/10 text-left">
                <th className="pb-3 pr-4">Name</th><th className="pb-3 pr-4">Email</th><th className="pb-3 pr-4">Balance</th><th className="pb-3">Role</th>
              </tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-white/5">
                    <td className="py-3 pr-4">{u.name}</td>
                    <td className="py-3 pr-4 text-gray-400">{u.email}</td>
                    <td className="py-3 pr-4 text-green-400"><Price usd={u.balance} /></td>
                    <td className="py-3">{u.isAdmin ? <span className="text-yellow-400">Admin</span> : <span className="text-gray-500">User</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-gray-400 border-b border-white/10 text-left">
                <th className="pb-3 pr-4">GPU</th><th className="pb-3 pr-4">User</th><th className="pb-3 pr-4">Hours</th><th className="pb-3 pr-4">Cost</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Date</th>
              </tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b border-white/5">
                    <td className="py-3 pr-4">{o.gpuName}</td>
                    <td className="py-3 pr-4 text-gray-400">{o.user?.name || o.user?.email || '—'}</td>
                    <td className="py-3 pr-4">{o.hours}</td>
                    <td className="py-3 pr-4"><Price usd={o.cost} /></td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded ${o.status === 'active' ? 'bg-green-900 text-green-400' : o.status === 'cancelled' ? 'bg-red-900 text-red-400' : 'bg-gray-800 text-gray-400'}`}>{o.status}</span>
                    </td>
                    <td className="py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
