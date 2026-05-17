import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import Price from '../components/Price'
import Spinner from '../components/Spinner'

const API = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'

export default function Transactions() {
  const [txns, setTxns] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (!user?.token) { setLoading(false); return }
    fetch(`${API}/transactions`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(r => r.json()).then(setTxns).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleDownload = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (!user?.token) return
    setDownloading(true)
    try {
      const res = await fetch(`${API}/transactions/export`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'transactions.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      // silent failure
    } finally {
      setDownloading(false)
    }
  }, [])

  return (
    <PageLayout title="Transactions" subtitle="Your billing history, top-ups, and payments.">
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : txns.length === 0 ? (
        <div className="text-center py-16">
          <svg className="mx-auto mb-4 text-gray-600" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>
          <p className="text-gray-400">No transactions yet.</p>
          <Link to="/dashboard" className="text-sm text-[#315fff] hover:underline mt-2 inline-block">Go to Dashboard →</Link>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              {downloading ? 'Downloading…' : 'Download CSV'}
            </button>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-white/10 text-left">
                <th className="pb-3 pr-6">Date</th><th className="pb-3 pr-6">Description</th><th className="pb-3 pr-6">Type</th><th className="pb-3 pr-6">Amount</th>
              </tr>
            </thead>
            <tbody>
              {txns.map((t) => (
                <tr key={t._id} className="border-b border-white/5">
                  <td className="py-3 pr-6 text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 pr-6">{t.description}</td>
                  <td className="py-3 pr-6"><span className={`text-xs px-2 py-0.5 rounded ${t.type === 'topup' ? 'bg-green-900 text-green-400' : t.type === 'rental' ? 'bg-blue-900 text-blue-400' : 'bg-yellow-900 text-yellow-400'}`}>{t.type}</span></td>
                  <td className="py-3 pr-6 font-mono"><span className={t.amount > 0 ? 'text-green-400' : 'text-red-400'}>{t.amount > 0 ? '+' : ''}<Price usd={Math.abs(t.amount)} /></span></td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
        </>
      )}
    </PageLayout>
  )
}
