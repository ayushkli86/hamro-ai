import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { jobApi } from '../api'
import Spinner from '../components/Spinner'
import Price from '../components/Price'

const STATUS_COLORS = {
  pending: 'bg-yellow-900/50 text-yellow-400',
  running: 'bg-blue-900/50 text-blue-400',
  completed: 'bg-green-900/50 text-green-400',
  failed: 'bg-red-900/50 text-red-400',
  cancelled: 'bg-gray-800 text-gray-400',
}

export default function Jobs() {
  useEffect(() => { document.title = 'Jobs — hamro.ai' }, [])
  const { user } = useAuth()
  const toast = useToast()

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showSubmit, setShowSubmit] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', gpu: '', command: '' })
  const [selected, setSelected] = useState(null)

  const load = () => {
    setLoading(true)
    jobApi.list()
      .then(setJobs)
      .catch((err) => toast(err.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (loading) return
    const timer = setTimeout(load, 10000)
    return () => clearTimeout(timer)
  }, [jobs])

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const job = await jobApi.submit(form)
      setJobs((prev) => [job, ...prev])
      setShowSubmit(false)
      setForm({ name: '', gpu: '', command: '' })
      toast('Job submitted', 'success')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = jobs.filter((job) => {
    const matchSearch = !search || job.name?.toLowerCase().includes(search.toLowerCase()) || job.gpu?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || job.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-[1280px] mx-auto px-[32px] lg:px-[40px] 2xl:px-0 py-[120px] md:py-[140px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[32px] md:text-[40px] font-bold text-white">Jobs</h1>
            <p className="text-[#8b949e] mt-1">Manage and monitor your compute jobs</p>
          </div>
          <button onClick={() => setShowSubmit(!showSubmit)}
            className="px-4 py-2 bg-[#315fff] hover:bg-[#2a4fd8] text-white font-semibold rounded-lg transition cursor-pointer">
            {showSubmit ? 'Cancel' : 'Submit Job'}
          </button>
        </div>

        {showSubmit && (
          <form onSubmit={submit} className="bg-[#161616] border border-gray-800 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input placeholder="Job Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                className="bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#315fff]" />
              <input placeholder="GPU Type (e.g. RTX 4090)" value={form.gpu} onChange={(e) => setForm({ ...form, gpu: e.target.value })} required
                className="bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#315fff]" />
              <input placeholder="Command to run" value={form.command} onChange={(e) => setForm({ ...form, command: e.target.value })} required
                className="bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#315fff]" />
            </div>
            <button type="submit" disabled={submitting}
              className="px-6 py-2.5 bg-[#315fff] hover:bg-[#2a4fd8] text-white font-semibold rounded-lg transition disabled:opacity-50 cursor-pointer flex items-center gap-2">
              {submitting ? <Spinner size={18} /> : null}
              Submit
            </button>
          </form>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#315fff]" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#315fff] cursor-pointer">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#161616] border border-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-5 bg-gray-700 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-700 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-700 rounded-xl">
            <svg className="mx-auto mb-4 text-gray-600" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <p className="text-[#8b949e] text-lg mb-2">{search || statusFilter !== 'all' ? 'No matching jobs' : 'No jobs yet'}</p>
            <p className="text-[#6b7280] text-sm mb-4">{search || statusFilter !== 'all' ? 'Try adjusting your search or filters.' : 'Submit your first compute job to get started.'}</p>
            {!search && statusFilter === 'all' && (
              <button onClick={() => setShowSubmit(true)} className="px-4 py-2 bg-[#315fff] hover:bg-[#2a4fd8] text-white font-semibold rounded-lg transition cursor-pointer">Submit Job</button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((job) => (
              <div key={job._id}
                className="bg-[#161616] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all cursor-pointer"
                onClick={() => setSelected(selected?._id === job._id ? null : job)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-bold text-white">{job.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[job.status] || 'bg-gray-800 text-gray-400'}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#8b949e]">
                    <span>{job.gpu}</span>
                    {job.cost !== undefined && <Price usd={job.cost} />}
                  </div>
                </div>
                {selected?._id === job._id && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-[#6b7280] mb-1">Created</p>
                        <p className="text-white">{new Date(job.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[#6b7280] mb-1">GPU</p>
                        <p className="text-white">{job.gpu}</p>
                      </div>
                      <div>
                        <p className="text-[#6b7280] mb-1">Duration</p>
                        <p className="text-white">{job.duration ? `${job.duration}h` : '—'}</p>
                      </div>
                      <div>
                        <p className="text-[#6b7280] mb-1">Cost</p>
                        <p className="text-white">{job.cost !== undefined ? <Price usd={job.cost} /> : '—'}</p>
                      </div>
                    </div>
                    {job.command && (
                      <div className="mt-3">
                        <p className="text-[#6b7280] text-sm mb-1">Command</p>
                        <code className="bg-[#0d1117] text-[#e6edf3] text-sm px-3 py-2 rounded-md block overflow-x-auto">{job.command}</code>
                      </div>
                    )}
                    {job.output && (
                      <div className="mt-3">
                        <p className="text-[#6b7280] text-sm mb-1">Output</p>
                        <pre className="bg-[#0d1117] text-[#e6edf3] text-sm px-3 py-2 rounded-md overflow-x-auto max-h-40">{job.output}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
