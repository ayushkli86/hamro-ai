import { useState, useRef, useEffect } from 'react'
import { useCurrency } from '../context/CurrencyContext'

export default function CurrencyToggle() {
  const { currency, setCurrency, rates } = useCurrency()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const current = rates[currency]

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer"
        style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)' }}>
        {current.symbol} {current.label}
        <svg className={`transition ${open ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 bg-[#242424] border border-[#333] rounded-lg shadow-lg py-1 min-w-[130px] z-50">
          {Object.entries(rates).map(([key, cfg]) => (
            <button key={key} onClick={() => { setCurrency(key); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-sm transition cursor-pointer border-none ${key === currency ? 'text-white bg-white/10' : 'text-[#d4d4d4] hover:bg-white/5'}`}
              style={{ background: key === currency ? 'rgba(255,255,255,0.1)' : 'transparent' }}>
              {cfg.symbol} {cfg.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
