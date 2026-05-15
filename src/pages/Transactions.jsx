import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import Price from '../components/Price'
import Spinner from '../components/Spinner'
import { orderApi } from '../api'

export default function Transactions() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderApi.list().then(setOrders).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <PageLayout title="Transactions" subtitle="Your billing history and payment records.">
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <svg className="mx-auto mb-4 text-gray-600" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>
          <p className="text-gray-400">No transactions yet.</p>
          <Link to="/dashboard" className="text-sm text-[#315fff] hover:underline mt-2 inline-block">Go to Dashboard →</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-white/10 text-left">
                <th className="pb-3 pr-6">Date</th><th className="pb-3 pr-6">Description</th><th className="pb-3 pr-6">Amount</th><th className="pb-3 pr-6">Status</th><th className="pb-3">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-white/5">
                  <td className="py-3 pr-6 text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 pr-6">{o.gpuName} — {o.hours} hrs</td>
                  <td className="py-3 pr-6 font-mono">-<Price usd={o.cost} /></td>
                  <td className="py-3 pr-6">
                    <span className={`text-xs px-2 py-0.5 rounded ${o.status === 'active' ? 'bg-green-900 text-green-400' : o.status === 'cancelled' ? 'bg-red-900 text-red-400' : 'bg-gray-800 text-gray-400'}`}>{o.status}</span>
                  </td>
                  <td className="py-3">
                    <a href={`${import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'}/orders/${o._id}/invoice?token=${JSON.parse(localStorage.getItem('user') || '{}')?.token || ''}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">PDF</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageLayout>
  )
}
