import { useCurrency } from '../context/CurrencyContext'

export default function Price({ usd, className = '' }) {
  const { formatPrice } = useCurrency()
  return <span className={className}>{formatPrice(usd)}</span>
}
