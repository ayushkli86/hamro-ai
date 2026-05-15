import { useCurrency } from '../context/CurrencyContext'

export default function Price({ usd, className = '' }) {
  const { formatPrice } = useCurrency()
  const val = typeof usd === 'number' ? usd : 0
  return <span className={className}>{formatPrice(val)}</span>
}
