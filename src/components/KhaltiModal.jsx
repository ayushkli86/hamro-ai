import { useState, useEffect, useCallback } from 'react'
import Spinner from './Spinner'

const API = import.meta.env.PROD ? '' : 'http://localhost:5000'

function authHeaders() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {}
}

export default function KhaltiModal({ onClose, onSuccess }) {
  const [amount, setAmount] = useState('')
  const [step, setStep] = useState('form')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const handleSuccess = useCallback(async (response) => {
    setProcessing(true)
    setStep('processing')
    try {
      const res = await fetch(`${API}/api/khalti/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ token: response.token, amount: response.amount }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Verification failed')
      setStep('success')
      setTimeout(() => { onSuccess?.(data.amount); onClose() }, 1500)
    } catch (err) {
      setError(err.message)
      setStep('form')
      setProcessing(false)
    }
  }, [onClose, onSuccess])

  useEffect(() => {
    if (step !== 'processing' || processing) return
    const script = document.createElement('script')
    script.src = 'https://khalti.com/static/khalti-checkout.js'
    script.async = true
    script.onload = () => {
      const nprAmount = parseInt(amount, 10) * 100
      const config = {
        publicKey: import.meta.env.VITE_KHALTI_PUBLIC_KEY,
        productIdentity: 'hamro-ai-topup',
        productName: 'Hamro AI Topup',
        productUrl: window.location.origin,
        eventHandler: {
          onSuccess(payload) { handleSuccess(payload) },
          onError(err) { setError(err.message); setStep('form'); setProcessing(false) },
          onClose() { setStep('form'); setProcessing(false) },
        },
        paymentPreference: ['KHALTI', 'EBANKING', 'MOBILE_BANKING', 'CONNECT_IPS', 'SCT'],
        amount: nprAmount,
      }
      const checkout = new window.KhaltiCheckout(config)
      checkout.show()
    }
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [step, processing, amount, handleSuccess])

  const handleSubmit = (e) => {
    e.preventDefault()
    const val = parseInt(amount, 10)
    if (!val || val < 10) { setError('Minimum amount is NPR 10'); return }
    setError('')
    setProcessing(true)
    setStep('processing')
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="rounded-xl w-full max-w-sm p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {step === 'form' && (
          <>
            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Add balance via Khalti</h3>
            <p className="text-sm mb-5" style={{ color: 'var(--text-dim)' }}>Enter amount in NPR</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-dim)' }}>Amount (NPR)</label>
                <input type="number" min="10" step="1" value={amount} onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition"
                  style={{ background: 'var(--bg)', color: 'var(--text)', borderColor: 'var(--border)' }}
                  placeholder="e.g. 500" autoFocus />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" disabled={processing}
                className="w-full py-3 rounded-lg text-white font-semibold transition hover:opacity-90 cursor-pointer bg-[#4C2B8B] disabled:opacity-50">
                {processing ? 'Opening Khalti...' : 'Pay with Khalti'}
              </button>
            </form>
            <button onClick={onClose} className="w-full mt-3 py-2 text-sm cursor-pointer bg-transparent" style={{ color: 'var(--text-dim)' }}>Cancel</button>
          </>
        )}
        {step === 'processing' && (
          <div className="text-center py-8">
            <Spinner size={40} />
            <p className="mt-4 text-sm" style={{ color: 'var(--text-dim)' }}>Processing Khalti payment...</p>
          </div>
        )}
        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="text-green-400" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p className="font-bold text-lg" style={{ color: 'var(--text)' }}>Payment Successful!</p>
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>Balance updated</p>
          </div>
        )}
      </div>
    </div>
  )
}
