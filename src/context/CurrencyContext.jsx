import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const RATES = {
  usd: { symbol: '$', rate: 1, label: 'USD' },
  npr: { symbol: 'Rs.', rate: 133, label: 'NPR' },
  eur: { symbol: '€', rate: 0.92, label: 'EUR' },
  gbp: { symbol: '£', rate: 0.79, label: 'GBP' },
  inr: { symbol: '₹', rate: 83, label: 'INR' },
}

const CurrencyContext = createContext(null)

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'usd')

  useEffect(() => {
    localStorage.setItem('currency', currency)
  }, [currency])

  const formatPrice = useCallback((usdPrice) => {
    const cfg = RATES[currency]
    if (!cfg) return `$${usdPrice.toFixed(2)}`
    const converted = usdPrice * cfg.rate
    if (currency === 'npr') return `${cfg.symbol} ${Math.round(converted).toLocaleString()}`
    return `${cfg.symbol}${converted.toFixed(2)}`
  }, [currency])

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, rates: RATES }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)
