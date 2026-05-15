import { useState } from 'react'
import { authApi } from '../api'
import { useToast } from '../context/ToastContext'
import Spinner from './Spinner'

export default function PaymentModal({ amount, onClose, onSuccess }) {
  const toast = useToast()
  const [method, setMethod] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [step, setStep] = useState('select')

  const pay = async () => {
    setProcessing(true)
    setStep('processing')
    await new Promise((r) => setTimeout(r, 2000))
    try {
      const data = await authApi.topup(amount)
      toast(data.message, 'success')
      setStep('success')
      setTimeout(() => { onSuccess?.(); onClose() }, 1500)
    } catch (err) {
      toast(err.message, 'error')
      setStep('select')
      setProcessing(false)
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
                { id: 'card', label: 'Credit Card', color: 'bg-blue-600' },
              ].map((m) => (
                <button key={m.id} onClick={() => { setMethod(m.id); pay() }}
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
            <p className="mt-4 text-sm" style={{ color: 'var(--text-dim)' }}>Processing payment via {method}...</p>
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
