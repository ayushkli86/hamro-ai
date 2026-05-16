import { useState } from 'react'
import Spinner from './Spinner'

const API = import.meta.env.PROD ? '' : 'http://localhost:5000'

function authHeaders() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {}
}

export default function PaymentModal({ amount, onClose, onSuccess }) {
  const [method, setMethod] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [step, setStep] = useState('select')

  const pay = async (paymentMethod) => {
    setProcessing(true)
    setStep('processing')
    setMethod(paymentMethod)

    if (paymentMethod === 'card') {
      try {
        const res = await fetch(`${API}/api/stripe/create-checkout-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({ amount }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Payment failed')
        window.location.href = data.url
      } catch (err) {
        setStep('select')
        setProcessing(false)
        alert(err.message)
      }
    } else {
      await new Promise((r) => setTimeout(r, 1500))
      setStep('success')
      setTimeout(() => { onSuccess?.(); onClose() }, 1500)
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="rounded-xl w-full max-w-sm p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {step === 'select' && (
          <>
            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Add ${amount}</h3>
            <p className="text-sm mb-5" style={{ color: 'var(--text-dim)' }}>Choose payment method</p>
            <div className="space-y-3">
              {[
                { id: 'khalti', label: 'Khalti', color: 'bg-[#4C2B8B]' },
                { id: 'esewa', label: 'eSewa', color: 'bg-[#60B246]' },
                { id: 'card', label: 'Credit Card (Stripe)', color: 'bg-blue-600' },
              ].map((m) => (
                <button key={m.id} onClick={() => pay(m.id)}
                  className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition hover:opacity-90 cursor-pointer ${m.color}`}>
                  Pay with {m.label}
                </button>
              ))}
            </div>
            <button onClick={onClose} className="w-full mt-3 py-2 text-sm cursor-pointer bg-transparent" style={{ color: 'var(--text-dim)' }}>Cancel</button>
          </>
        )}
        {step === 'processing' && (
          <div className="text-center py-8">
            <Spinner size={40} />
            <p className="mt-4 text-sm" style={{ color: 'var(--text-dim)' }}>{method === 'card' ? 'Redirecting to Stripe...' : `Processing payment via ${method}...`}</p>
          </div>
        )}
        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="text-green-400" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p className="font-bold text-lg" style={{ color: 'var(--text)' }}>Payment Successful!</p>
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>${amount} added to your balance</p>
          </div>
        )}
      </div>
    </div>
  )
}
