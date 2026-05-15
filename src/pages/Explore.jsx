import { useState, useEffect, useCallback, useRef } from 'react'
import { useCurrency } from '../context/CurrencyContext'
import PageLayout from '../components/PageLayout'
import Price from '../components/Price'
import Spinner from '../components/Spinner'

const ARCHITECTURES = ['', 'Blackwell', 'Hopper', 'Ada Lovelace', 'Ampere']
const VRAM_OPTIONS = [
  { label: 'Any VRAM', value: '' },
  { label: '24GB+', value: '24' },
  { label: '32GB+', value: '32' },
  { label: '48GB+', value: '48' },
  { label: '80GB+', value: '80' },
]
const API = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'

export default function Explore() {
  const { formatPrice } = useCurrency()
  const [gpus, setGpus] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [arch, setArch] = useState('')
  const [minVram, setMinVram] = useState('')
  const [availability, setAvailability] = useState('')
  const [sort, setSort] = useState('')
  const [page, setPage] = useState(1)
  const debounceRef = useRef(null)

  const fetchGpus = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (arch) params.set('arch', arch)
    if (minVram) params.set('minVram', minVram)
    if (availability) params.set('availability', availability)
    if (sort) params.set('sort', sort)
    params.set('page', page.toString())
    params.set('limit', '12')

    try {
      const res = await fetch(`${API}/gpus?${params}`)
      const data = await res.json()
      setGpus(data.gpus || [])
      setTotal(data.total || 0)
    } catch { setGpus([]); setTotal(0) }
    finally { setLoading(false) }
  }, [search, minPrice, maxPrice, arch, minVram, availability, sort, page])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(fetchGpus, 300)
    return () => clearTimeout(debounceRef.current)
  }, [fetchGpus])

  useEffect(() => { setPage(1) }, [search, minPrice, maxPrice, arch, minVram, availability, sort])

  const clearFilters = () => {
    setSearch(''); setMinPrice(''); setMaxPrice(''); setArch(''); setMinVram(''); setAvailability(''); setSort(''); setPage(1)
  }

  const hasFilters = search || minPrice || maxPrice || arch || minVram || availability

  return (
    <PageLayout title="Explore GPUs" subtitle="Search, filter, and compare GPU instances available in Nepal.">
      <div className="bg-[#161616] border border-gray-800 rounded-xl p-4 md:p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <input type="text" placeholder="Search GPUs..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
          <select value={arch} onChange={(e) => setArch(e.target.value)}
            className="bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500">
            <option value="">All Architectures</option>
            {ARCHITECTURES.filter(Boolean).map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={minVram} onChange={(e) => setMinVram(e.target.value)}
            className="bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500">
            {VRAM_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={availability} onChange={(e) => setAvailability(e.target.value)}
            className="bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500">
            <option value="">All Availability</option>
            <option value="High">High Stock</option>
            <option value="Med">Medium Stock</option>
            <option value="Low">Low Stock</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm w-16">Price min</span>
            <input type="number" step="0.01" min="0" placeholder="$0.00" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
              className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
            <span className="text-gray-400 text-sm">to</span>
            <input type="number" step="0.01" min="0" placeholder="$10.00" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
              className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500">
              <option value="">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="vram">VRAM: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
            {hasFilters && (
              <button onClick={clearFilters} className="text-sm text-gray-400 hover:text-white bg-transparent border-none cursor-pointer whitespace-nowrap">Clear all</button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-400">{loading ? 'Searching...' : `${total} GPU${total !== 1 ? 's' : ''} found`}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#161616] border border-gray-800 rounded-xl p-6 animate-pulse">
              <div className="h-5 w-32 bg-gray-700 rounded mb-2" />
              <div className="h-3 w-20 bg-gray-700 rounded mb-4" />
              <div className="h-3 w-48 bg-gray-700 rounded mb-2" />
              <div className="h-3 w-36 bg-gray-700 rounded mb-4" />
              <div className="h-6 w-16 bg-gray-700 rounded mb-2" />
              <div className="h-9 w-full bg-gray-700 rounded-lg mt-4" />
            </div>
          ))}
        </div>
      ) : gpus.length === 0 ? (
        <div className="text-center py-20">
          <svg className="mx-auto mb-4 text-gray-600" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <p className="text-gray-500">No GPUs match your filters.</p>
          <button onClick={clearFilters} className="text-sm text-[#315fff] hover:underline mt-2 bg-transparent border-none cursor-pointer">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gpus.map((gpu) => (
            <div key={gpu._id} className="bg-[#161616] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">{gpu.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${gpu.availability === 'High' ? 'bg-green-900 text-green-400' : gpu.availability === 'Med' ? 'bg-yellow-900 text-yellow-400' : 'bg-red-900 text-red-400'}`}>{gpu.inStock} left</span>
              </div>
              <div className="flex gap-2 flex-wrap mb-3">
                <span className="text-xs bg-[#222] text-gray-400 px-2 py-0.5 rounded">{gpu.arch}</span>
                <span className="text-xs bg-[#222] text-gray-400 px-2 py-0.5 rounded">{gpu.vram}</span>
              </div>
              {gpu.description && <p className="text-gray-400 text-xs mb-3 leading-relaxed">{gpu.description}</p>}
              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                {gpu.bandwidth && <div><span className="text-gray-600">Bandwidth</span><p className="text-gray-300">{gpu.bandwidth}</p></div>}
                {gpu.cpu && <div><span className="text-gray-600">CPU</span><p className="text-gray-300">{gpu.cpu}</p></div>}
                {gpu.ram && <div><span className="text-gray-600">RAM</span><p className="text-gray-300">{gpu.ram}</p></div>}
                {gpu.disk && <div><span className="text-gray-600">Disk</span><p className="text-gray-300">{gpu.disk}</p></div>}
              </div>
              <div className="mt-auto">
                <div className="flex items-baseline gap-1 mb-4">
                  <Price usd={gpu.price} className="text-2xl font-bold" />
                  <span className="text-gray-500 text-sm">/hr</span>
                </div>
                <a href={`/dashboard`}
                  className="block w-full text-center py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg no-underline transition text-sm">
                  Rent — {formatPrice(gpu.price * 1)}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  )
}
