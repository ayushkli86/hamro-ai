import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { jobsApi } from '../api'
import Spinner from '../components/Spinner'
import Price from '../components/Price'

const STATUS_BADGE = {
  pending: 'bg-gray-700 text-gray-300',
  assigned: 'bg-blue-900 text-blue-400',
  running: 'bg-yellow-900 text-yellow-400',
  completed: 'bg-green-900 text-green-400',
  failed: 'bg-red-900 text-red-400',
  cancelled: 'bg-gray-800 text-gray-500',
}

export default function Jobs() {
  useEffect(() => { document.title = 'Compute Jobs — hamro.ai' }, [])
  const { user } = useAuth()
  const toast = useToast()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [form, setForm] = useState({
    script: '',
    dockerImage: 'python:3.11-slim',
    hoursRequested: 1,
    gpuName: '',
    minVram: '',
  })

  const loadJobs = () => {
    jobsApi.list()
      .then(setJobs)
      .catch((err) => toast(err.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadJobs() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.script.trim()) return toast('Script is required', 'error')
    setSubmitting(true)
    try {
      const body = {
        script: form.script,
        dockerImage: form.dockerImage || 'python:3.11-slim',
        hoursRequested: form.hoursRequested,
      }
      if (form.gpuName.trim()) body.gpuName = form.gpuName.trim()
      if (form.minVram) body.minVram = Number(form.minVram)
      const job = await jobsApi.create(body)
      setJobs((prev) => [job, ...prev])
      setForm({ script: '', dockerImage: 'python:3.11-slim', hoursRequested: 1, gpuName: '', minVram: '' })
      toast('Job submitted', 'success')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <header className="border-b px-4 md:px-8 py-3 md:py-4 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <h1 className="text-lg md:text-xl font-bold">Compute Jobs</h1>
        <span className="text-green-400 text-sm"><Price usd={user?.balance || 0} /></span>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="bg-[#161616] border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Submit Job</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">Script *</label>
              <textarea value={form.script} onChange={(e) => setForm((p) => ({ ...p, script: e.target.value }))} rows={6}
                className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-blue-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Docker Image</label>
                <input type="text" value={form.dockerImage} onChange={(e) => setForm((p) => ({ ...p, dockerImage: e.target.value }))}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Hours (1–720)</label>
                <input type="number" min="1" max="720" value={form.hoursRequested} onChange={(e) => setForm((p) => ({ ...p, hoursRequested: Math.max(1, Math.min(720, parseInt(e.target.value) || 1)) }))}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">GPU Name (optional)</label>
                <input type="text" value={form.gpuName} onChange={(e) => setForm((p) => ({ ...p, gpuName: e.target.value }))} placeholder="e.g. RTX 4090"
                  className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Min VRAM GB (optional)</label>
                <input type="number" min="0" value={form.minVram} onChange={(e) => setForm((p) => ({ ...p, minVram: e.target.value }))}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <button type="submit" disabled={submitting}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg transition cursor-pointer flex items-center gap-2">
              {submitting ? <Spinner size={18} /> : null}
              {submitting ? 'Submitting...' : 'Submit Job'}
            </button>
          </form>
        </div>

        <h2 className="text-xl font-bold mb-4">Job History</h2>
        {loading ? (
          <div className="flex justify-center py-10"><Spinner size={30} /></div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto mb-4 text-gray-600" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
            <p className="text-gray-500 text-sm">No jobs submitted yet.</p>
            <p className="text-gray-600 text-xs mt-1">Submit a compute job above to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job._id} className="bg-[#161616] border border-gray-800 rounded-lg overflow-hidden">
                <button onClick={() => setExpanded(expanded === job._id ? null : job._id)}
                  className="w-full p-4 flex items-center justify-between bg-transparent border-none cursor-pointer text-left">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{job.gpuName || 'Any GPU'}</p>
                    <p className="text-sm text-gray-400">{job.hoursRequested} hrs — <Price usd={job.cost} /></p>
                    <p className="text-xs text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <span className={`text-xs px-2 py-1 rounded ${STATUS_BADGE[job.status] || 'bg-gray-700 text-gray-300'}`}>{job.status}</span>
                    <svg className={`transition-transform ${expanded === job._id ? 'rotate-180' : ''} text-gray-500`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>
                </button>
                {expanded === job._id && (
                  <div className="border-t border-gray-800 px-4 py-4 bg-[#0d1117] space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1 font-semibold">Script</p>
                      <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap bg-black rounded-lg p-3 max-h-48 overflow-auto">{job.script}</pre>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div><span className="text-gray-500">Docker Image</span><p className="text-white mt-0.5">{job.dockerImage}</p></div>
                      <div><span className="text-gray-500">Started</span><p className="text-white mt-0.5">{job.startedAt ? new Date(job.startedAt).toLocaleString() : '—'}</p></div>
                      <div><span className="text-gray-500">Completed</span><p className="text-white mt-0.5">{job.completedAt ? new Date(job.completedAt).toLocaleString() : '—'}</p></div>
                      <div><span className="text-gray-500">Cost</span><p className="text-white mt-0.5"><Price usd={job.cost} /></p></div>
                    </div>
                    {job.result && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1 font-semibold">Result / Output</p>
                        <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap bg-black rounded-lg p-3 max-h-48 overflow-auto">{job.result}</pre>
                      </div>
                    )}
                    {job.errorLog && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1 font-semibold">Error Log</p>
                        <pre className="text-sm text-red-400 font-mono whitespace-pre-wrap bg-black rounded-lg p-3 max-h-48 overflow-auto">{job.errorLog}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
