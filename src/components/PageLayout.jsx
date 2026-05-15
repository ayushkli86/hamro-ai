import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function PageLayout({ title, subtitle, children }) {
  useEffect(() => { document.title = `${title} — hamro.ai` }, [title])
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[1280px] mx-auto px-[32px] lg:px-[40px] 2xl:px-0 py-[120px] md:py-[140px]">
        <Link to="/" className="text-[#315fff] hover:text-[#a8bbff] text-sm no-underline mb-8 inline-block">← Back to Home</Link>
        <h1 className="text-[36px] md:text-[48px] font-bold mb-4">{title}</h1>
        {subtitle && <p className="text-[#8b949e] text-lg mb-10 max-w-[700px]">{subtitle}</p>}
        {children}
      </div>
    </div>
  )
}
