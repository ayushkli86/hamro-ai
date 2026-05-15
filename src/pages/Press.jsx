import { useState } from 'react'
import PageLayout from '../components/PageLayout'

const RELEASES = [
  { title: 'hamro.ai Launches Nepal\'s First GPU Cloud Platform', date: '2026-01-15', year: '2026', category: 'Product', summary: 'hamro.ai announced the launch of Nepal\'s first GPU cloud platform, making high-performance computing accessible to developers and AI teams across the region.' },
  { title: 'hamro.ai Achieves SOC 2 Certification', date: '2026-02-20', year: '2026', category: 'Security', summary: 'hamro.ai announced it has achieved SOC 2 Type II certification, demonstrating its commitment to security and data protection.' },
  { title: 'hamro.ai Partners with Leading GPU Suppliers', date: '2026-03-10', year: '2026', category: 'Partnership', summary: 'New partnerships ensure access to latest GPU hardware including H100, RTX 5090, and Blackwell architecture.' },
  { title: 'hamro.ai Startup Program Opens Applications', date: '2026-04-05', year: '2026', category: 'Product', summary: 'New program offers $500 in free compute credits to early-stage AI startups building in Nepal and South Asia.' },
  { title: 'hamro.ai Expands to Southeast Asia', date: '2025-11-20', year: '2025', category: 'Expansion', summary: 'New data center locations in Singapore and Malaysia to serve growing demand in Southeast Asia.' },
]

const CATEGORIES = [...new Set(RELEASES.map((r) => r.category))]
const YEARS = [...new Set(RELEASES.map((r) => r.year))].sort().reverse()

export default function Press() {
  const [yearFilter, setYearFilter] = useState('')
  const [catFilter, setCatFilter] = useState('')

  const filtered = RELEASES.filter((r) => {
    if (yearFilter && r.year !== yearFilter) return false
    if (catFilter && r.category !== catFilter) return false
    return true
  })

  return (
    <PageLayout title="Press Releases" subtitle="Latest news and announcements from hamro.ai.">
      <div className="flex gap-3 mb-8 flex-wrap">
        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}
          className="bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
          <option value="">All Years</option>
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
          className="bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <a href="/press/feed" className="inline-flex items-center gap-1.5 px-3 py-2 bg-orange-600/20 text-orange-400 text-sm rounded-lg hover:bg-orange-600/30 transition no-underline">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="19" r="2"/><path d="M5 9v3a7 7 0 0 1 7 7h3c0-5.52-4.48-10-10-10z"/><path d="M5 5v3c6.07 0 11 4.93 11 11h3c0-7.73-6.27-14-14-14z"/></svg>
          RSS Feed
        </a>
      </div>

      <div className="space-y-6 mb-12">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No press releases match your filters.</p>
        ) : filtered.map((r) => (
          <div key={r.title} className="bg-[#161616] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition">
            <div className="flex items-center gap-3 mb-2">
              <p className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <span className="text-xs bg-[#222] text-gray-400 px-2 py-0.5 rounded">{r.category}</span>
            </div>
            <h3 className="text-lg font-bold mb-2">{r.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{r.summary}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#161616] border border-gray-800 rounded-xl p-8 text-center">
        <h3 className="font-bold text-lg mb-2">Media Contact</h3>
        <p className="text-gray-400 text-sm mb-1">For press inquiries, please contact:</p>
        <a href="mailto:press@hamro.ai" className="text-[#315fff] hover:underline text-sm">press@hamro.ai</a>
      </div>
    </PageLayout>
  )
}
